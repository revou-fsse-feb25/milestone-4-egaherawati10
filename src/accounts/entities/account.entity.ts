import { AccountStatus } from "@prisma/client";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { User } from "src/users/entities/user.entity";

export class Account {
    id: number;
    userId: number;
    accountNumber: string;
    accountType: string;
    status: AccountStatus;
    balance: number;
    currency: string;
    createdAt: Date;

    user?: User;
    transactions?: Transaction[];
}
