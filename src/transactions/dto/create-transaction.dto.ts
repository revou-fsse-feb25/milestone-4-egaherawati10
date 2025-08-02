import { IsDecimal, IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateTransactionDto {
  @IsInt()
  accountId: number;

  @IsInt()
  senderId: number;

  @IsOptional()
  @IsInt()
  receiverId?: number;

  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsPositive()
  @IsDecimal()
  amount: Decimal;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  referenceNumber?: string;
}