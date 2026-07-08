import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { City } from '../../types/index.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;

  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;

  findByCity(city: City, count?: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(city: City, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  findNew(count: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  findDiscussed(count: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;

  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(offerId: string): Promise<boolean>;
}
