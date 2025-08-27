import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationBodyDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}
