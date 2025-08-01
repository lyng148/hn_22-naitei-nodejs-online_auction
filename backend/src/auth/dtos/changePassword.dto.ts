import { IsNotEmpty, MinLength, Validate } from 'class-validator';
import { AUTH_VALIDATION } from '../auth.constants';

export class ChangePasswordBodyDto {
  @IsNotEmpty()
  currentPassword!: string;

  @IsNotEmpty()
  @MinLength(AUTH_VALIDATION.PASSWORD.MIN_LENGTH, {
    message: AUTH_VALIDATION.PASSWORD.MESSAGE,})
  newPassword!: string;

}
