import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { OfferEntity } from '../offer/index.js';

export interface FavoriteService {
  add(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity>>;
  delete(userId: string, offerId: string): Promise<number>;
  findByUserId(userId: string): Promise<DocumentType<OfferEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
  exists(userId: string, offerId: string): Promise<boolean>;
}

