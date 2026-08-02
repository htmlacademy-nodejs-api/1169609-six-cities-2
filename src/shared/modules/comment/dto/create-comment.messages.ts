export const CreateCommentMessages = {
  text: {
    invalidFormat: 'text is required',
    lengthField: 'min length is 5, max is 1024',
  },
  rating: {
    invalidFormat: 'rating must be an integer or float',
    valueField: 'min rating is 1, max rating is 5',
  },
  offerId: {
    invalidFormat: 'offerId must be a valid MongoId',
  },
  userId: {
    invalidFormat: 'userId must be a valid MongoId',
  },
} as const;
