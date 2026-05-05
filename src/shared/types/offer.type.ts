import { User } from './user.type.js';
import { City } from './city-type.enum.js';
import { OfferImages } from './offer-images.type.js';
import { HousingType } from './housing-type.enum.js';
import { Amenity } from './amenity-type.enum.js';
import { Location } from './location.type.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  images: OfferImages;
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  rooms: number;
  guests: number;
  price: number;
  amenities: Amenity[];
  author: User;
  commentsCount: number;
  location: Location;
}
