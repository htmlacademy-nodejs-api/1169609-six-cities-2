import { Expose } from 'class-transformer';
import { UserRole } from '../../../types/index.js';

export class LoggedUserRdo {

  @Expose()
  public name: string;

@Expose()
  public avatarPath: string;

@Expose()
public userRole: UserRole;

  @Expose()
public token: string;

  @Expose()
  public email: string;
}
