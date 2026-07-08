import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { City, Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT } from './offer.constant.js';
import { CommentEntity } from '../comment/comment.entity.js';
import { FavoriteEntity } from '../favorite/favorite.entity.js';
import { PipelineStage, Types } from 'mongoose';

type OfferAggregationOptions = {
  match?: Record<string, unknown>;
  sort?: Record<string, SortType>;
  limit?: number;
  userId?: string;
};

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>,
  ) {}

  private createIsFavoriteStages(userId?: string): PipelineStage[] {
    if (!userId) {
      return [{ $addFields: { isFavorite: false } }];
    }

    const userObjectId = new Types.ObjectId(userId);

    return [
      {
        $lookup: {
          from: 'favorites',
          let: { offerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$offerId', '$$offerId'] },
                    { $eq: ['$userId', userObjectId] },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: 'favorites',
        },
      },
      {
        $addFields: {
          isFavorite: { $gt: [{ $size: '$favorites' }, 0] },
        },
      },
      { $unset: 'favorites' },
    ];
  }

  private async aggregateOffers(options: OfferAggregationOptions): Promise<DocumentType<OfferEntity>[]> {
    const pipeline: PipelineStage[] = [];

    if (options.match) {
      pipeline.push({ $match: options.match });
    }

    pipeline.push(...this.createIsFavoriteStages(options.userId));

    if (options.sort) {
      pipeline.push({ $sort: options.sort });
    }

    if (options.limit) {
      pipeline.push({ $limit: options.limit });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      {
        $unwind: {
          path: '$userId',
          preserveNullAndEmptyArrays: true,
        },
      },
    );

    return this.offerModel.aggregate<DocumentType<OfferEntity>>(pipeline).exec();
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const offers = await this.aggregateOffers({
      match: { _id: new Types.ObjectId(offerId) },
      userId,
    });

    return offers[0] ?? null;
  }

  public async find(count?: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    return this.aggregateOffers({
      sort: { postDate: SortType.Down },
      limit: count ?? DEFAULT_OFFER_COUNT,
      userId,
    });
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    await this.commentModel.deleteMany({ offerId }).exec();
    await this.favoriteModel.deleteMany({ offerId }).exec();

    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('userId')
      .exec();
  }

  public async findByCity(city: City, count?: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    return this.aggregateOffers({
      match: { city },
      sort: { postDate: SortType.Down },
      limit: count ?? DEFAULT_OFFER_COUNT,
      userId,
    });
  }

  public async findPremiumByCity(city: City, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    return this.aggregateOffers({
      match: { city, isPremium: true },
      sort: { postDate: SortType.Down },
      limit: PREMIUM_OFFER_COUNT,
      userId,
    });
  }

  public async findNew(count: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    return this.aggregateOffers({
      sort: { createdAt: SortType.Down },
      limit: count,
      userId,
    });
  }

  public async findDiscussed(count: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    return this.aggregateOffers({
      sort: { commentsCount: SortType.Down },
      limit: count,
      userId,
    });
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { '$inc': {
        commentsCount: 1,
      } })
      .exec();
  }

  public async updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const aggregationResult = await this.offerModel.aggregate<{ rating: number }>([
      { $match: { _id: new Types.ObjectId(offerId) } },
      {
        $lookup: {
          from: 'comments',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
            { $project: { rating: 1 } },
          ],
          as: 'comments',
        },
      },
      {
        $addFields: {
          rating: {
            $round: [{ $ifNull: [{ $avg: '$comments.rating' }, 0] }, 1],
          },
        },
      },
      {
        $project: {
          rating: 1,
        },
      },
    ]).exec();

    const rating = aggregationResult[0]?.rating ?? 0;

    return this.offerModel
      .findByIdAndUpdate(offerId, { rating }, { new: true })
      .exec();
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({ _id: offerId })) !== null;
  }
}
