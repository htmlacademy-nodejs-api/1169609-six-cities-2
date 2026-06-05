import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js'; 
import { City, HousingCategory, Amenity, Location } from '../../types/index.js';

class LocationStructure implements Location {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title!: string;

  @prop({ trim: true, required: true })
  public description!: string;

  @prop({ required: true })
  public postDate!: Date;

  @prop({
    type: () => String,
    enum: City,
    required: true
  })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ type: () => [String], required: true })
  public images!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true })
  public rating!: number;

  @prop({
    type: () => String,
    enum: HousingCategory,
    required: true
  })
  public housingCategory!: HousingCategory;

  @prop({ required: true })
  public rooms!: number;

  @prop({ required: true })
  public guests!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ 
    type: () => [String], 
    enum: Amenity, 
    required: true
   })
  public amenities!: Amenity[];

  @prop({
    ref: () => UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentsCount!: number;

  @prop({ 
    type: () => LocationStructure, 
    required: true, 
    _id: false })
  public location!: LocationStructure;
}

export const OfferModel = getModelForClass(OfferEntity);
