import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { CurrentUser } from '@common/decorators/user.decorator';
import { AddToWatchlistResponseDto } from './dtos/add-to-watchlist.response.dto';
import { AddToWatchlistDto } from './dtos/add-to-watchlist.body.dto';
import { RemoveFromWatchlistDto, RemoveFromWatchlistResponseDto } from './dtos/remove-from-watchlist.dto';

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
  
  @Roles(Role.BIDDER)
  @Post('add-to-watchlist')
  async addToWatchlist(
    @CurrentUser() user: any,
    @Body() addToWatchlistDto: AddToWatchlistDto,
  ): Promise<AddToWatchlistResponseDto> {
    return this.auctionService.addToWatchlist(user, addToWatchlistDto);
  }

  @Roles(Role.BIDDER)
  @Post('remove-from-watchlist')
  async removeFromWatchlist(
    @CurrentUser() user: any,
    @Body() removeFromWatchlistDto: RemoveFromWatchlistDto,
  ): Promise<RemoveFromWatchlistResponseDto> {
    return this.auctionService.removeFromWatchlist(user, removeFromWatchlistDto);
  }
}
