import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
