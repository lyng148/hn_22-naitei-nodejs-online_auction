import { BidService } from './bid.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BidResponseDto } from './dtos/bid.response.dto';
import { Roles } from '@common/decorators/roles.decorator';
import { AuthType } from '@common/types/auth-type.enum';
import { Auth } from '@common/decorators/auth.decorator';
import { CreateBidBodyDto } from './dtos/create-bid.body.dto';
import { Role } from '@common/enums/role.enum';
import { CurrentUser } from '@common/decorators/user.decorator';
import { HiddenBidRequestDto } from './dtos/create-hidden-bid.body.dto';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get(':auctionId')
  @HttpCode(HttpStatus.OK)
  async getBids(
    @Param('auctionId') auctionId: string,
  ): Promise<BidResponseDto[]> {
    return this.bidService.getBidsByAuction(auctionId);
  }
  @Post()
  @Auth(AuthType.ACCESS_TOKEN)
  @Roles(Role.BIDDER)
  @HttpCode(HttpStatus.CREATED)
  async placeBid(
    @Body() dto: CreateBidBodyDto,
    @CurrentUser() currentUser: { id: string; email: string },
  ): Promise<BidResponseDto> {
    const userId = currentUser.id;
    return this.bidService.placeBid(userId, dto);
  }

  @Post('hidden')
  @Auth(AuthType.ACCESS_TOKEN)
  @Roles(Role.BIDDER)
  @HttpCode(HttpStatus.CREATED)
  async placeHiddenBids(
    @Body() dto: HiddenBidRequestDto,
    @CurrentUser() currentUser: { id: string; email: string },
  ): Promise<BidResponseDto[]> {
    const userId = currentUser.id;
    return this.bidService.placeHiddenBidsLast10Minutes(userId, dto);
  }
}
