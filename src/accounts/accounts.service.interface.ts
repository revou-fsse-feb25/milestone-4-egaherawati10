import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

export interface AccountsServiceItf {
  getAllAccounts(): Promise<Account[]>;
  getAccountById(id: number): Promise<Account | null>;
  getAccountByUserId(userId: number): Promise<Account | null>;
  createAccount(data: CreateAccountDto): Promise<Account>;
  updateAccount(id: number, dto: UpdateAccountDto, user: { id: number; role: string }): Promise<Account>;
  deleteAccount(id: number, user: { id: number; role: string }): Promise<void>;
}