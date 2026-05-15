import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import {
  Amenity,
  City,
  HousingCategory,
  Location,
  Offer,
  OFFER_IMAGES_COUNT,
  OfferImages,
  UserRole,
} from '../../types/index.js';

function isEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: string
): value is T[keyof T] {
  return (Object.values(enumObject) as string[]).includes(value);
}

function parseBoolean(value: string): boolean {
  return value.trim().toLowerCase() === 'true';
}

function parseNumber(value: string, fieldName: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number for "${fieldName}": ${value}`);
  }
  return parsed;
}

function parseOfferImages(value: string): OfferImages {
  const images = value
    .split(';')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (images.length !== OFFER_IMAGES_COUNT) {
    throw new Error(`Expected ${OFFER_IMAGES_COUNT} images, got ${images.length}`);
  }

  return images;
}

function parseAmenities(value: string): Amenity[] {
  const items = value
    .split(';')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const amenities: Amenity[] = [];

  for (const item of items) {
    if (!isEnumValue(Amenity, item)) {
      throw new Error(`Unknown amenity: ${item}`);
    }
    amenities.push(item);
  }

  return amenities;
}

function parseUserRole(value: string): UserRole {
  const normalized = value.trim().toLowerCase();
  if (!isEnumValue(UserRole, normalized)) {
    throw new Error(`Unknown userRole: ${value}`);
  }

  return normalized;
}

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split(/\r?\n/u)
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([
        title,
        description,
        postDate,
        city,
        previewImage,
        images,
        isPremium,
        isFavorite,
        rating,
        housingCategory,
        rooms,
        guests,
        price,
        amenities,
        firstName,
        lastName,
        authorEmail,
        authorAvatarPath,
        authorPassword,
        authorRole,
        commentsCount,
        latitude,
        longitude,
      ]) => {
        if (!isEnumValue(City, city)) {
          throw new Error(`Unknown city: ${city}`);
        }

        if (!isEnumValue(HousingCategory, housingCategory)) {
          throw new Error(`Unknown housingCategory: ${housingCategory}`);
        }

        const location: Location = {
          latitude: parseNumber(latitude, 'latitude'),
          longitude: parseNumber(longitude, 'longitude'),
        };

        return {
          title,
          description,
          postDate: new Date(postDate),
          city,
          previewImage,
          images: parseOfferImages(images) as OfferImages,
          isPremium: parseBoolean(isPremium),
          isFavorite: parseBoolean(isFavorite),
          rating: parseNumber(rating, 'rating'),
          housingCategory,
          rooms: parseNumber(rooms, 'rooms'),
          guests: parseNumber(guests, 'guests'),
          price: parseNumber(price, 'price'),
          amenities: parseAmenities(amenities),
          author: {
            name: `${firstName} ${lastName}`,
            email: authorEmail,
            avatarPath: authorAvatarPath || undefined,
            password: authorPassword,
            userRole: parseUserRole(authorRole),
          },
          commentsCount: parseNumber(commentsCount, 'commentsCount'),
          location,
        };
      });
  }
}
