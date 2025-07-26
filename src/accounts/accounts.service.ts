import { Injectable } from "@nestjs/common";
import { AccountsServiceItf } from "./accounts.service.interface";
import { Account } from "@prisma/client";
import { AccountRepository } from "./accounts.repository";

@Injectable()
export class AccountsService implements AccountsServiceItf {
  constructor(
    private readonly accountRepository: AccountRepository
  ) {}

  getAllAccounts(): Promise<Account[]> {
    return this.accountRepository.findAll();
  }

  getAccountById(id: number): Promise<Account | null> {
    return this.accountRepository.findById(id);
  }

  getAccountByUserId(userId: number): Promise<Account | null> {
    return this.accountRepository.findByUserId(userId);
  }

  createAccount(data: any): Promise<any> {
    return this.accountRepository.create(data);
  }

  updateAccount(id: number, data: any): Promise<any> {
    return this.accountRepository.update(id, data);
  }

  deleteAccount(id: number): Promise<void> {
    return this.accountRepository.delete(id);
  }
}