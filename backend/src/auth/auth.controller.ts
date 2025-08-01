import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { Public } from '@common/decorators/public.decorator';
import { RegisterBodyDto } from './dtos/register.body.dto';
import { AuthService } from './auth.service';
import { RegisterResponseDto } from './dtos/register.response.dto';
import { LoginBodyDto } from './dtos/login.body.dto';
import { LoginResponseDto } from './dtos/login.response.dto';
import { ChangePasswordBodyDto } from './dtos/changePassword.dto';
import { ChangePasswordResponseDto } from './dtos/changePasswordResponse.dto';
import { Auth } from '@common/decorators/auth.decorator';
import { AuthType } from '@common/types/auth-type.enum';
import { CurrentUser } from '@common/decorators/user.decorator';


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

  @Auth(AuthType.ACCESS_TOKEN)
  @Put('changePassword')
  async changePassword(@Body() changePasswordDTO: ChangePasswordBodyDto, @CurrentUser() currentUser: { id: string, email: string }): Promise<ChangePasswordResponseDto> {
    return this.authService.changePassword(currentUser.id, changePasswordDTO);
  }
}
