import { Prisma, Transaction } from "@prisma/client";

export interface TransactionsRepositoryItf {
    findAll(): Promise<Transaction[]>;
    findById(id: number): Promise<Transaction | null>;
    create(data: Prisma.TransactionCreateInput): Promise<Transaction>;
    update(id: number, data: Prisma.TransactionUpdateInput): Promise<Transaction>;
    delete(id: number): Promise<void>;
}