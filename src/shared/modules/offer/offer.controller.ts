import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController,
  HttpMethod,
  ValidateObjectIdMiddleware,
  DocumentExistsMiddleware,
  ValidateDtoMiddleware,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  UploadFilesMiddleware
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { City, Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferListRdo } from './rdo/offer-list.rdo.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';
import { ParamOfferId } from './type/param-offer-id.type.js';
import { CommentRdo, CommentService } from '../comment/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { UploadImageRdo } from './rdo/upload-image.rdo.js';
import { OFFER_IMAGES_COUNT } from '../../types/index.js';
import { UploadImagesRdo } from './rdo/upload-images.rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.premium });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image'),
      ],
    });
    this.addRoute({
      path: '/:offerId/images',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
        new UploadFilesMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'images', OFFER_IMAGES_COUNT),
      ],
    });
  }

  public async index({ query, tokenPayload }: Request, res: Response): Promise<void> {
    const limit = query.limit ? Number(query.limit) : undefined;
    const offers = await this.offerService.find(limit, tokenPayload?.id);
    const responseData = fillDTO(OfferListRdo, offers);
    this.ok(res, responseData);
  }

  public async premium({ query, tokenPayload }: Request, res: Response): Promise<void> {
    const city = query.city as City;
    const offers = await this.offerService.findPremiumByCity(city, tokenPayload?.id);
    this.ok(res, fillDTO(OfferListRdo, offers));
  }

  public async show(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId, tokenPayload?.id);


    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { params, body }: UpdateOfferRequest,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.updateById(offerId, body);


    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    await this.offerService.deleteById(offerId);


    this.noContent(res, undefined);
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, userId: tokenPayload.id });
    const offer = await this.offerService.findById(result.id, tokenPayload.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {


    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async uploadImage(
    { params, file }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const updateDto: UpdateOfferDto = { previewImage: file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageRdo, { image: file?.filename }));
  }

  public async uploadImages({ params, files }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const filenames = files?.map((file) => file.filename) ?? [];
    await this.offerService.updateById(offerId, { images: filenames });
    this.created(res, fillDTO(UploadImagesRdo, { images: filenames }));
  }

}
