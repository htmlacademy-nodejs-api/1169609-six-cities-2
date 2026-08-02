import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';
import { UserRole } from '../../../types/index.js';
import { CreateUserMessages } from './create-user.messages.js';

export class CreateUserDto {
  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @MinLength(1, { message: CreateUserMessages.name.lengthField })
  @MaxLength(15, { message: CreateUserMessages.name.lengthField })
  public name!: string;

  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email!: string;

  @IsOptional()
  @IsString({ message: CreateUserMessages.avatarPath.invalidFormat })
  @Matches(/\.(jpg|png)$/i, { message: CreateUserMessages.avatarPath.invalidFormat })
  public avatarPath?: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @MinLength(6, { message: CreateUserMessages.password.lengthField })
  @MaxLength(12, { message: CreateUserMessages.password.lengthField })
  public password!: string;

  @IsEnum(UserRole, { message: CreateUserMessages.userRole.invalidFormat })
  public userRole!: UserRole;
}
