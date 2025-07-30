import { Transaction, TransactionStatus, TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class DepositDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;
    
    @IsNotEmpty()
    @IsNumber()
    accountId: number;

    @IsNotEmpty()
    @IsEnum(TransactionType)
    type: TransactionType;

    @IsNotEmpty()
    @IsDecimal()
    @IsPositive()
    amount: Decimal;

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsEnum(TransactionStatus)
    status: TransactionStatus;
}