import { AccountStatus, AccountType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateAccountDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @IsNotEmpty()
    @IsEnum(AccountType)
    accountType: AccountType;

    @IsNotEmpty()
    @IsEnum(AccountStatus)
    status: AccountStatus;

    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '0,2' }, { message: "Balance must be a number with up to 2 decimal places" })
    @IsPositive()
    balance: Decimal;

    @IsNotEmpty()
    @IsString()
    currency: string;
}
