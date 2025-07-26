import { UserRole, UserStatus } from "@prisma/client";
import { Account } from "src/accounts/entities/account.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";

export class User {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    status: UserStatus;
    role: UserRole;
    
    accounts?: Account[];
    transactions?: Transaction
}
