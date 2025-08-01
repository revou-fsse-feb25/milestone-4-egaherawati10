import { TransactionStatus, TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IsDecimal, IsEnum, IsNotEmpty, isNumber, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    accountId: number;

    @IsString()
    senderId: string;

    @IsString()
    receiverId: string;

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

    @IsString()
    referenceNumber: string;
}
