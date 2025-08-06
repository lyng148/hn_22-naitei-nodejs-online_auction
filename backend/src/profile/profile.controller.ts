import { Controller, Get, Param, Put, Body, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { CurrentUser } from '../common/decorators/user.decorator';
import { UserAccountInfoDto } from './dtos/profile.response.dto';
import { SellerAccountInfoDto } from './dtos/seller-profile.response.dto';
import { UpdateProfileDto } from './dtos/update-profile.body.dto';
import { AuthType } from '@common/types/auth-type.enum';
import { Auth } from '@common/decorators/auth.decorator';
import { UploadImageResponseDto } from '../products/dtos/upload-image.dto';

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

  @Post(':id/upload-avatar')
  @Auth(AuthType.ACCESS_TOKEN)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: { id: string; email: string },
  ): Promise<UploadImageResponseDto> {
    if (!file) {
      throw new BadRequestException('No avatar file provided');
    }
    
    return await this.profileService.uploadAvatar(userId, file, currentUser);
  }
}
