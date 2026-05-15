import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, OFFER_IMAGES_COUNT } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100_000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

function pickOfferImagesColumn(urls: string[]): string {
  const picks: string[] = [];
  for (let i = 0; i < OFFER_IMAGES_COUNT; i++) {
    picks.push(getRandomItem(urls));
  }
  return picks.join(';');
}

function randomBooleanString(): string {
  return getRandomItem([true, false]) ? 'true' : 'false';
}

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const postDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = pickOfferImagesColumn(this.mockData.offerImages);
    const isPremium = randomBooleanString();
    const isFavorite = randomBooleanString();
    const rating = String(generateRandomValue(0, 5, 1));
    const housingCategory = getRandomItem(this.mockData.housingCategories);
    const rooms = String(Math.floor(generateRandomValue(1, 9)));
    const guests = String(Math.floor(generateRandomValue(1, 11)));
    const price = String(Math.floor(generateRandomValue(MIN_PRICE, MAX_PRICE + 1)));
    let amenitiesPick = getRandomItems(this.mockData.amenities);
    if (amenitiesPick.length === 0) {
      amenitiesPick = [getRandomItem(this.mockData.amenities)];
    }
    const amenities = amenitiesPick.join(';');

    const authorName = getRandomItem(this.mockData.users);
    const [firstName, lastName] = authorName.split(' ');
    const authorEmail = getRandomItem(this.mockData.emails);
    const authorAvatarPath = getRandomItem(this.mockData.avatars);
    const authorPassword = getRandomItem(this.mockData.passwords);
    const authorRole = getRandomItem(this.mockData.userRoles);

    const commentsCount = String(Math.floor(generateRandomValue(0, 200)));
    const { latitude, longitude } = this.mockData.cityCoordinates[city];

    return [
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
      String(latitude),
      String(longitude),
    ].join('\t');
  }
}
