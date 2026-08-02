export const CreateOfferValidationMessage = {
  title: {
    invalidFormat: 'Title is required',
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    invalidFormat: 'Description is required',
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  city: {
    invalid: 'city must be one of the valid cities',
  },
  previewImage: {
    invalidFormat: 'previewImage is required',
  },
  images: {
    invalidFormat: 'images must be an array',
    invalidSize: 'images array must contain exactly 6 items',
    invalidItem: 'Each image path must be a string',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a boolean',
  },
  housingCategory: {
    invalid: 'housingCategory must be a valid type',
  },
  rooms: {
    invalidFormat: 'rooms must be an integer',
    minValue: 'Minimum rooms count is 1',
    maxValue: 'Maximum rooms count is 8',
  },
  guests: {
    invalidFormat: 'guests must be an integer',
    minValue: 'Minimum guests count is 1',
    maxValue: 'Maximum guests count is 10',
  },
  price: {
    invalidFormat: 'price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  amenities: {
    invalidFormat: 'amenities must be an array',
    invalid: 'Each amenity must be a valid enum value',
  },
  userId: {
    invalidId: 'userId must be a valid MongoDB ObjectId',
  },
  location: {
    invalidFormat: 'location must be an object',
  },
} as const;