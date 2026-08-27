import 'reflect-metadata';
import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { User, UserRole } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, default: '', type: () => String })
  public name: string;

  @prop({ required: true, unique: true, type: () => String })
  public email: string;

  @prop({ required: false, default: 'default-avatar.jpg', type: () => String })
  public avatarPath?: string;

  @prop({ required: true, default: '', type: () => String })
  public password?: string;

  @prop({ required: true, enum: UserRole, type: () => String })
  public userRole: UserRole;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.userRole = userData.userRole;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }

}

export const UserModel = getModelForClass(UserEntity);
