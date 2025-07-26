import { AccountStatus, AccountType } from '@prisma/client';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Decimal } from '@prisma/client/runtime/library';

export class Account {
  id: number;
  userId: number;
  accountNumber: string;
  accountType: AccountType;
  status: AccountStatus;
  balance: Decimal;
  currency: string;
  createdAt: Date;

  user?: User;
  transactions?: Transaction[];
}