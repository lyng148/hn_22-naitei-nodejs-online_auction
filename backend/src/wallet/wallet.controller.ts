import { Auth } from '@common/decorators/auth.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/user.decorator';
import { Role } from '@common/enums/role.enum';
import { AuthType } from '@common/types/auth-type.enum';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  AddFundsDto,
  AdminAdjustBalanceDto,
  WalletBalanceResponseDto,
  WalletTransactionResponseDto
} from './dtos/wallet.dto';
import { WalletService } from './wallet.service';
import { ListTransactionsDto } from './dtos/list-transactions.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  // Nạp tiền vào ví
  @Post('add-funds')
  @Auth(AuthType.ACCESS_TOKEN)
  @Roles(Role.BIDDER, Role.ADMIN, Role.SELLER)
  @HttpCode(HttpStatus.CREATED)
  async addFunds(
    @CurrentUser() user: { id: string },
    @Body() addFundsDto: AddFundsDto,
  ): Promise<WalletTransactionResponseDto> {
    return this.walletService.addFundsToWallet(user.id, addFundsDto);
  }

  // Lấy số dư ví
  @Get('balance')
  @Auth(AuthType.ACCESS_TOKEN)
  @Roles(Role.BIDDER, Role.ADMIN, Role.SELLER)
  async getBalance(
    @CurrentUser() user: { id: string; role: Role },
  ): Promise<WalletBalanceResponseDto> {
    return this.walletService.getWalletBalance(user.id);
  }

  // Chỉ ADMIN mới xem số dư của user khác
  @Get('balance/:userId')
  @Auth(AuthType.ACCESS_TOKEN)
  @Roles(Role.ADMIN)
  async getBalanceByUserId(
    @CurrentUser() admin: { id: string; role: Role },
    @Param('userId') userId: string,
  ): Promise<WalletBalanceResponseDto> {
    return this.walletService.getWalletBalance(userId);
  }

  // Lấy lịch sử giao dịch
  @Get('transactions')
  @Auth(AuthType.ACCESS_TOKEN)
  @Roles(Role.BIDDER, Role.SELLER, Role.ADMIN)
  async getTransactions(
    @CurrentUser() user: { id: string },
    @Query() query: ListTransactionsDto
  ) {
    return this.walletService.getWalletTransactions(user.id, query);
  }

   // Admin xem lịch sử giao dịch của user khác
  @Get('transactions/:userId')
  @Auth(AuthType.ACCESS_TOKEN)
  @Roles(Role.ADMIN)
  async getTransactionsByUserId(
    @CurrentUser() admin: { id: string; role: Role },
    @Param('userId') userId: string,
    @Query() query: ListTransactionsDto,
  ) {
    return this.walletService.getWalletTransactions(userId, query);
  }
}
