import { Account, Prisma } from "@prisma/client";

export interface AccountsRepositoryItf {
    findAll(): Promise<Account[]>;
    findById(id: number): Promise<Account | null>;
    findByUserId(userId: number): Promise<Account | null>;
    create(data: Prisma.AccountCreateInput): Promise<Account>;
    update(id: number, data: Prisma.AccountUpdateInput): Promise<Account>;
    delete(id: number): Promise<void>;
}