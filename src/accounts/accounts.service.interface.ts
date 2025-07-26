import { Account, Prisma } from "@prisma/client";

export interface AccountsServiceItf {
    getAllAccounts(): Promise<Account[]>
    getAccountById(id: number): Promise<Account | null>
    getAccountByUserId(userId: number): Promise<Account | null>
    createAccount(data: Prisma.AccountCreateInput): Promise<Account>
    updateAccount(id: number, data: Prisma.AccountUpdateInput): Promise<Account>
    deleteAccount(id: number): Promise<void>
}