import { inject, injectable } from 'inversify';
import { FavoriteService } from './favorite-service.interface.js';
import { Component } from '../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { OfferEntity } from '../offer/index.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) {}

  public async add(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity>> {
    return this.favoriteModel.create({ userId, offerId });
  }

  public async delete(userId: string, offerId: string): Promise<number> {
    const result = await this.favoriteModel
      .deleteOne({ userId, offerId })
      .exec();

    return result.deletedCount;
  }

  public async findByUserId(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const favorites = await this.favoriteModel
      .find({ userId })
      .populate('offerId')
      .exec();

    return favorites.map((favorite) => favorite.offerId as DocumentType<OfferEntity>);
  }

  public async deleteByOfferId(offerId: string): Promise<number | null> {
    const result = await this.favoriteModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount ?? null;
  }

  public async exists(userId: string, offerId: string): Promise<boolean> {
    return (await this.favoriteModel
      .exists({ userId, offerId })) !== null;
  }
}
