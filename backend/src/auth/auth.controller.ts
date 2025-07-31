import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@common/decorators/public.decorator';
import { RegisterBodyDto } from './dtos/register.body.dto';
import { AuthService } from './auth.service';
import { RegisterResponseDto } from './dtos/register.response.dto';
import { LoginBodyDto } from './dtos/login.body.dto';
import { LoginResponseDto } from './dtos/login.response.dto';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async register(
    @Body() registerDTO: RegisterBodyDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDTO);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDTO: LoginBodyDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDTO);
  }
}
