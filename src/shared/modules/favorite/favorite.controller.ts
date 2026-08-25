import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { FavoriteService } from './favorite-service.interface.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferListRdo } from '../offer/rdo/offer-list.rdo.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
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
  }

  public async index({ tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.favoriteService.findByUserId(tokenPayload.id);
    this.ok(res, fillDTO(OfferListRdo, offers));
  }

  public async create(
    { params, tokenPayload }: Request,
    res: Response,
  ): Promise<void> {
    const offerId = String(params.offerId);
    await this.favoriteService.add(tokenPayload.id, offerId);
    this.ok(res, {});
  }

  public async delete(
    { params, tokenPayload }: Request,
    res: Response,
  ): Promise<void> {
    const offerId = String(params.offerId);
    await this.favoriteService.delete(tokenPayload.id, offerId);
    this.noContent(res, undefined);
  }
}
