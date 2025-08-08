import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dtos/create-auction.body.dto';
import { CreateAuctionResponseDto } from './dtos/create-auction.response.dto';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { SearchAuctionQueryDto } from './dtos/search-auction.query.dto';
import { SearchAuctionResponseDto } from './dtos/search-auction.response.dto';
import { Public } from '@common/decorators/public.decorator';
import { GetAuctionDetailResponseDto } from './dtos/get-auction-detail.response.dto';
import { ERROR_AUCTION_NOT_FOUND } from './auction.constant';

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

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  async searchAuctions(
    @Query() query: SearchAuctionQueryDto,
  ): Promise<SearchAuctionResponseDto> {
    return this.auctionService.searchAuctions(query);
  }

  @Get(':auctionId')
  @Public()
  async getAuctionById(
    @Param('auctionId') auctionId: string,
  ): Promise<GetAuctionDetailResponseDto> {
    const auction = await this.auctionService.getAuctionById(auctionId);
    if (!auction) {
      throw new NotFoundException(ERROR_AUCTION_NOT_FOUND);
    }
    return auction;
  }
}
