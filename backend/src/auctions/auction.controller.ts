import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dtos/create-auction.body.dto';
import { CreateAuctionResponseDto } from './dtos/create-auction.response.dto';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  @Roles(Role.SELLER)
  @HttpCode(HttpStatus.CREATED)
  async createAuction(
    @Body() createAuctionDto: CreateAuctionDto,
  ): Promise<CreateAuctionResponseDto> {
    return this.auctionService.createAuction(createAuctionDto);
  }
}
