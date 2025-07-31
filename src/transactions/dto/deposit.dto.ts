import {TransactionStatus, TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IsDecimal, IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class DepositDto {
    
    @IsNotEmpty()
    @IsInt()
    accountId: number;

    @IsNotEmpty()
    @IsInt()
    senderId: number;

    @IsNotEmpty()
    @IsEnum(TransactionType)
    type: TransactionType = TransactionType.deposit;

    @IsNotEmpty()
    @IsDecimal()
    @IsPositive()
    amount: Decimal;

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsNotEmpty()
    @IsEnum(TransactionStatus)
    status: TransactionStatus;
}