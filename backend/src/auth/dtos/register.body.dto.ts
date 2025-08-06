import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { AUTH_VALIDATION } from '../auth.constants';

export class RegisterBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(AUTH_VALIDATION.PASSWORD.MIN_LENGTH, {
    message: AUTH_VALIDATION.PASSWORD.MESSAGE,
  })
  password!: string;

  @IsBoolean()
  @IsNotEmpty()
  isSeller!: boolean;

  @IsOptional()
  @IsString()
  fullName?: string;
}
