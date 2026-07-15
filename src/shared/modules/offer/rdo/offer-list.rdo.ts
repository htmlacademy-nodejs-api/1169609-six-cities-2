import { Expose, Transform } from 'class-transformer';
import { City, HousingCategory } from '../../../types/index.js';

export class OfferListRdo {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public housingCategory!: HousingCategory;

  @Expose()
  public price!: number;

  @Expose()
  public commentsCount!: number;
}
