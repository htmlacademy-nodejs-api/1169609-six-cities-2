import { defaultClasses, getModelForClass, prop } from '@typegoose/typegoose';
import { User, UserRole } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, minlength: [1, 'Min length for firstname is 1'] })
  public name: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: false, default: '' })
  public avatarPath?: string;

  @prop({ required: true })
  public password: string;

  @prop({ required: true, enum: UserRole })
  public userRole: UserRole;
}

export const UserModel = getModelForClass(UserEntity);
