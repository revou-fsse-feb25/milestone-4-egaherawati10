import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { AccountsServiceItf } from './accounts.service.interface';
import { Account } from '@prisma/client';
import { AccountRepository } from './accounts.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService implements AccountsServiceItf {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAllAccounts(): Promise<Account[]> {
    try {
      return await this.accountRepository.findAll();
    } catch {
      throw new InternalServerErrorException('Failed to get accounts');
    }
  }

  async getAccountById(id: number): Promise<Account | null> {
    const account = await this.accountRepository.findById(id);
    if (!account) throw new NotFoundException(`Account with ID ${id} not found`);
    return account;
  }

  async getAccountByUserId(userId: number): Promise<Account | null> {
    try {
      return await this.accountRepository.findByUserId(userId);
    } catch {
      throw new InternalServerErrorException('Failed to get account by user ID');
    }
  }

  async createAccount(data: CreateAccountDto): Promise<Account> {
    try {
      return await this.accountRepository.create(data);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to create account');
    }
  }

  async updateAccount(id: number, data: UpdateAccountDto, user: { id: number; role: string }): Promise<Account> {
    const existing = await this.accountRepository.findById(id);
    if (!existing) throw new NotFoundException(`Account with ID ${id} not found`);

    // RBAC: Only account owner or admin can update
    if (existing.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You are not allowed to update this account');
    }

    try {
      return await this.accountRepository.update(id, data);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to update account');
    }
  }

  async deleteAccount(id: number, user: { id: number; role: string }): Promise<void> {
    const existing = await this.accountRepository.findById(id);
    if (!existing) throw new NotFoundException(`Account with ID ${id} not found`);

    if (existing.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You are not allowed to delete this account');
    }

    try {
      await this.accountRepository.delete(id);
    } catch {
      throw new InternalServerErrorException('Failed to delete account');
    }
  }
}