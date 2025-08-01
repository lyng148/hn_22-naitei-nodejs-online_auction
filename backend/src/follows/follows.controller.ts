import { Controller, Post, Param } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CurrentUser } from '@common/decorators/user.decorator';
import { FollowResponseDto } from './dtos/follow.response.dto';
import { AuthType } from '@common/types/auth-type.enum';
import { Auth } from '@common/decorators/auth.decorator';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':sellerId/follow')
  @Auth(AuthType.ACCESS_TOKEN)
  async followSeller(
    @Param('sellerId') sellerId: string,
    @CurrentUser() currentUser: { id: string; email: string },
  ): Promise<FollowResponseDto> {
    return this.followsService.followSeller(sellerId, currentUser);
  }
}
