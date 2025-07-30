import { Decimal } from "@prisma/client/runtime/library";
import { IsDecimal, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class WithdrawDto {
        @IsNotEmpty()
        @IsNumber()
        userId: number;
        
        @IsNotEmpty()
        @IsNumber()
        accountId: number;
    
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