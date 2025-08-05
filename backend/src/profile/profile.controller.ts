import { Controller, Get, Param, Put, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CurrentUser } from '../common/decorators/user.decorator';
import { UserAccountInfoDto } from './dtos/profile.response.dto';
import { SellerAccountInfoDto } from './dtos/seller-profile.response.dto';
import { UpdateProfileDto } from './dtos/update-profile.body.dto';
import { AuthType } from '@common/types/auth-type.enum';
import { Auth } from '@common/decorators/auth.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id/accountInfo')
  @Auth(AuthType.ACCESS_TOKEN)
  async getUserAccountInfo(
    @Param('id') userId: string,
    @CurrentUser() currentUser: { id: string; email: string },
  ): Promise<UserAccountInfoDto | SellerAccountInfoDto> {
    return this.profileService.getUserAccountInfo(userId, currentUser);
  }

  @Put(':id')
  @Auth(AuthType.ACCESS_TOKEN)
  async updateProfile(
    @Param('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() currentUser: { id: string; email: string },
  ): Promise<UserAccountInfoDto> {
    return await this.profileService.updateProfile(
      userId,
      updateProfileDto,
      currentUser,
    );
  }
}
