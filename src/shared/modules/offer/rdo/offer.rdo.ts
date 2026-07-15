import { Expose, Transform, Type } from 'class-transformer';
import { Amenity, City, HousingCategory } from '../../../types/index.js';

class OfferAuthorRdo {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  public id!: string;

  @Expose()
  public email!: string;
}
class OfferLocationRdo {
  @Expose()
  public latitude!: number;

  @Expose()
  public longitude!: number;
}
export class OfferRdo {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public housingCategory!: HousingCategory;

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public price!: number;

  @Expose()
  public amenities!: Amenity[];

  @Expose()
  @Type(() => OfferAuthorRdo)
  @Transform(({ obj }) => obj.userId)
  public author!: OfferAuthorRdo;

  @Expose()
  public commentsCount!: number;

  @Expose()
  @Type(() => OfferLocationRdo)
  public location!: OfferLocationRdo;
}
