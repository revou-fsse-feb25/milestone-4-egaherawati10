import { TransactionStatus, TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Account } from "src/accounts/entities/account.entity";
import { User } from "src/users/entities/user.entity";

export class Transaction {
    id: number;
    userId: number;
    accountId?: number;
    senderId?: string;
    receiverId?: string;
    type: TransactionType;
    amount: Decimal;
    currency: string;
    description?: string;
    status: TransactionStatus;
    createdAt: Date;
    referenceNumber?: string;

    user?: User;
    account?: Account;
}
