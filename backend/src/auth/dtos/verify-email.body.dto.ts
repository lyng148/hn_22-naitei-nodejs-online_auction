import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailBodyDto {
    @IsString()
    @IsNotEmpty()
    token!: string;
}
