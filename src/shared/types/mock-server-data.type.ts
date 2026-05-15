import type {
  Amenity,
  City,
  HousingCategory,
  Location,
  UserRole,
} from './index.js';

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  cities: City[];
  previewImages: string[];
  offerImages: string[];
  housingCategories: HousingCategory[];
  amenities: Amenity[];
  users: string[];
  emails: string[];
  avatars: string[];
  passwords: string[];
  userRoles: UserRole[];
  cityCoordinates: Record<City, Location>;
};
