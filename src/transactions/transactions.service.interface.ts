import { Transaction } from '@prisma/client';

export interface TransactionsServiceItf {
  deposit(userId: number, dto: any): Promise<Transaction>;
  withdraw(userId: number, dto: any): Promise<Transaction>;
  transfer(userId: number, dto: any): Promise<Transaction>;
  getAllByUser(userId: number, role: string): Promise<Transaction[]>;
  getTransactionById(id: number, userId: number, role: string): Promise<Transaction>;
}