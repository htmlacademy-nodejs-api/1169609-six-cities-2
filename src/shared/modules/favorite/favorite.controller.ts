import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { FavoriteService } from './favorite-service.interface.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferListRdo } from '../offer/rdo/offer-list.rdo.js';

@injectable()
export class FavoriteController extends BaseController {
  private readonly testUserId = '6a23430859ddf6a46ee12e48';
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.favoriteService.findByUserId(this.testUserId);
    this.ok(res, fillDTO(OfferListRdo, offers));
  }

  public async create(
    { params }: Request,
    res: Response,
  ): Promise<void> {
    const offerId = String(params.offerId);

    if (!await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${offerId}» not found.`,
        'FavoriteController',
      );
    }

    await this.favoriteService.add(this.testUserId, offerId);
    this.ok(res, {});
  }

  public async delete(
    { params }: Request,
    res: Response,
  ): Promise<void> {
    const offerId = String(params.offerId);

    if (!await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${offerId}» not found.`,
        'FavoriteController',
      );
    }

    await this.favoriteService.delete(this.testUserId, offerId);
    this.noContent(res, undefined);
  }
}
