import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min, Max, IsString } from 'class-validator';
import { TransactionType } from '@prisma/client';
import { WALLET_CONFIG } from '../wallet.constants';

export class AddFundsDto {
  @IsNumber()
  @Min(WALLET_CONFIG.MIN_DEPOSIT_AMOUNT) // Minimum 10,000 VND
  @Max(WALLET_CONFIG.MAX_DEPOSIT_AMOUNT) // Maximum 100,000,000 VND
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class WalletTransactionResponseDto {
  transactionId!: string;
  userId!: string;
  type!: TransactionType;
  status!: string;
  amount!: string;
  balanceAfter!: string;
  description?: string;
  createdAt!: Date;
}

export class WalletBalanceResponseDto {
  userId!: string;
  walletBalance!: string;
  formattedBalance!: string; // Format với dấu phẩy
}

export class AdminAdjustBalanceDto {
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNumber()
  amount!: number; // Có thể âm hoặc dương

  @IsOptional()
  @IsString()
  reason?: string;
}

export class TransactionListResponseDto {
  transactions!: WalletTransactionResponseDto[];
  total!: number;
  pagination!: {
    currentPage: number;
    totalPages: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalRecords: number;
  };
}
