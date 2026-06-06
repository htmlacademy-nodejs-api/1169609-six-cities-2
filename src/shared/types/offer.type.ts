import type {
  Amenity,
  City,
  HousingCategory,
  Location,
  OfferImages,
  User,
} from './index.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  images: OfferImages;
  isPremium: boolean;
  isFavorite: boolean;
  rating?: number;
  housingCategory: HousingCategory;
  rooms: number;
  guests: number;
  price: number;
  amenities: Amenity[];
  author: User;
  commentsCount: number;
  location: Location;
};
