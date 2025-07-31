import { TransactionStatus, TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IsDecimal, IsEnum, IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class TransferDto {
    @IsNotEmpty()
    @IsInt()
    accountId: number;

    @IsNotEmpty()
    @IsInt()
    receiverId: number;

    @IsNotEmpty()
    @IsEnum(TransactionType)
    type: TransactionType = TransactionType.transfer;

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
    status: TransactionStatus

    @IsString()
    referenceNumber: string
}