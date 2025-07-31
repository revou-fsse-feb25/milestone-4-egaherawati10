import { TransactionStatus, TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class WithdrawDto {
        @IsNotEmpty()
        @IsNumber()
        accountId: number;
    
        @IsNotEmpty()
        @IsNumber()
        senderId: number;

        @IsNotEmpty()
        @IsEnum(TransactionType)
        type: TransactionType = TransactionType.withdrawal;

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
}