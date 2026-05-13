import { Amenity } from './amenity-type.enum.js';
import { City } from './city-type.enum.js';
import { HousingType } from './housing-type.enum.js';
import { Location } from './location.type.js';
import { UserType } from './user-type.enum.js';

export type MockServerApiData = {
  titles: string[];
  descriptions: string[];
  cities: City[];
  previewImages: string[];
  offerImages: string[];
  housingTypes: HousingType[];
  amenities: Amenity[];
  users: string[];
  emails: string[];
  avatars: string[];
  passwords: string[];
  userTypes: UserType[];
  cityCoordinates: Record<City, Location>;
};
