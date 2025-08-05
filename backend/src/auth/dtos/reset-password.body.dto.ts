import { IsNotEmpty, MinLength } from 'class-validator';
import { AUTH_VALIDATION } from '../auth.constants';

export class ResetPasswordBodyDto {
  @IsNotEmpty()
  token!: string;

  @IsNotEmpty()
  @MinLength(AUTH_VALIDATION.PASSWORD.MIN_LENGTH, {
    message: AUTH_VALIDATION.PASSWORD.MESSAGE,
  })
  newPassword!: string;
}
