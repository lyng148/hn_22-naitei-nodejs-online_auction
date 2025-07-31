import { Controller, Get, Param, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/user.decorator';
import { UserAccountInfoDto } from './dtos/profile.response.dto';
import { SellerAccountInfoDto } from './dtos/seller-profile.response.dto';
import { UpdateProfileDto } from './dtos/update-profile.body.dto';
import { AuthType } from '@common/types/auth-type.enum';
import { Auth } from '@common/decorators/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/accountInfo')
  @Auth(AuthType.ACCESS_TOKEN)
  async getUserAccountInfo(
    @Param('id') userId: string,
    @CurrentUser() currentUser: { id: string; email: string },
  ): Promise<UserAccountInfoDto | SellerAccountInfoDto> {
    return this.usersService.getUserAccountInfo(userId, currentUser);
  }

  @Put(':id/profile')
  @Auth(AuthType.ACCESS_TOKEN)
  async updateProfile(
    @Param('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() currentUser: { id: string; email: string },
  ): Promise<UserAccountInfoDto> {
    return await this.usersService.updateProfile(
      userId,
      updateProfileDto,
      currentUser,
    );
  }
}
