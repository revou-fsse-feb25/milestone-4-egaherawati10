import { Decimal } from "@prisma/client/runtime/library";
import { IsDecimal, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class TransferDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    accountId: number;

    @IsNotEmpty()
    @IsString()
    senderId: string;

    @IsNotEmpty()
    @IsString()
    receiverId: string;

    @IsNotEmpty()
    @IsDecimal()
    @IsPositive()
    amount: Decimal;

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsString()
    description: string;
}