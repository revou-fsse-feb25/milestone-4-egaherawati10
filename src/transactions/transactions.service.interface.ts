import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { Transaction } from '@prisma/client';

export interface TransactionsServiceItf {
  deposit(senderId: number, dto: DepositDto): Promise<Transaction>;
  withdraw(senderId: number, dto: WithdrawDto): Promise<Transaction>;
  transfer(senderId: number, dto: TransferDto): Promise<Transaction>;
  getAllByUser(userId: number, role: string): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | null>;
}