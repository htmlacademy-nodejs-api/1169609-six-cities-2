import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { City, Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferListRdo } from './rdo/offer-list.rdo.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';
import { ParamOfferId } from './type/param-offerid.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.premium });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async index({ query }: Request, res: Response): Promise<void> {
    const limit = query.limit ? Number(query.limit) : undefined;
    const offers = await this.offerService.find(limit);
    const responseData = fillDTO(OfferListRdo, offers);
    this.ok(res, responseData);
  }

  public async premium({ query }: Request, res: Response): Promise<void> {
    const city = query.city as City;
    const offers = await this.offerService.findPremiumByCity(city);
    this.ok(res, fillDTO(OfferListRdo, offers));
  }

  public async show(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${offerId}» not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { params, body }: UpdateOfferRequest,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.updateById(offerId, body);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${offerId}» not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${offerId}» not found.`,
        'OfferController',
      );
    }

    this.noContent(res, undefined);
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }
}
