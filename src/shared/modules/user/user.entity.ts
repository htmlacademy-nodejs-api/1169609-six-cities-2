import { User, UserRole } from '../../types/index.js';

export class UserEntity implements User {
  public name: string;
  public email: string;
  public avatarPath?: string;
  public password: string;
  public userRole: UserRole;
}
