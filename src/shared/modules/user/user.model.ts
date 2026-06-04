import { Schema, Document, model } from 'mongoose';
import { User, UserRole } from '../../types/index.js';

export interface UserDocument extends User, Document {
  createdAt: Date,
  updatedAt: Date,
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: '',
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  avatarPath: {
    type: String,
    required: false,
    default: '',
  },
  password: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
    enum: Object.values(UserRole),
  },
},
{
  timestamps: true
}
);

export const UserModel = model<UserDocument>('User', userSchema);
