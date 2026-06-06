import { defaultClasses, getModelForClass, modelOptions, prop, PropType, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js'; 
import { City, HousingCategory, Amenity, Location } from '../../types/index.js';

class LocationStructure implements Location {
  @prop({ required: true, type: () => Number })
  public latitude!: number;

  @prop({ required: true, type: () => Number })
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
  @prop({ trim: true, required: true, type: () => String })
  public title!: string;

  @prop({ trim: true, required: true, type: () => String })
  public description!: string;

  @prop({ required: true, type: () => Date })
  public postDate!: Date;

  @prop({
    type: () => String,
    enum: City,
    required: true
  })
  public city!: City;

  @prop({ required: true, type: () => String })
  public previewImage!: string;

  @prop({ type: () => String, required: true }, PropType.ARRAY)
  public images!: string[];

  @prop({ required: true, default: false, type: () => Boolean })
  public isPremium!: boolean;

  @prop({ required: true, type: () => Number, default: 0})
  public rating!: number;

  @prop({
    type: () => String,
    enum: HousingCategory,
    required: true
  })
  public housingCategory!: HousingCategory;

  @prop({ required: true, type: () => Number })
  public rooms!: number;

  @prop({ required: true, type: () => Number })
  public guests!: number;

  @prop({ required: true, type: () => Number })
  public price!: number;

  @prop({ 
    type: () => String, 
    enum: Amenity, 
    required: true
   }, PropType.ARRAY)
  public amenities!: Amenity[];

  @prop({
    ref: () => UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({ default: 0, type: () => Number })
  public commentsCount!: number;

  @prop({ 
    type: () => LocationStructure, 
    required: true, 
    _id: false })
  public location!: LocationStructure;
}

export const OfferModel = getModelForClass(OfferEntity);
