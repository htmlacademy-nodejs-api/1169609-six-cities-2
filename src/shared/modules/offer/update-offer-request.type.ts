import { Request } from 'express';
import { RequestBody } from '../../libs/rest/index.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { ParamOfferId } from './type/param-offer-id.type.js';

export type UpdateOfferRequest = Request<ParamOfferId, RequestBody, UpdateOfferDto>;
