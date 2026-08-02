export const CreateUserMessages = {
  name: {
    invalidFormat: 'Name is required',
    lengthField: 'Min length for name is 1, max is 15',
  },
  email: {
    invalidFormat: 'Email must be a valid address',
  },
  avatarPath: {
    invalidFormat: 'Avatar path must be a string with .jpg or .png format',
  },
  password: {
    invalidFormat: 'Password is required',
    lengthField: 'Min length for password is 6, max is 12',
  },
  userRole: {
    invalidFormat: 'UserRole must be a valid enum value',
  },
} as const;
