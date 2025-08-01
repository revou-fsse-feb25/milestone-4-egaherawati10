import { Injectable } from '@nestjs/common';
import { AccountsRepositoryItf } from './accounts.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountRepository implements AccountsRepositoryItf {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Account[]> {
    return this.prisma.account.findMany();
  }

  async findById(id: number): Promise<Account | null> {
    return this.prisma.account.findUnique({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Account | null> {
    return this.prisma.account.findFirst({ where: { userId } });
  }

  async create(data: CreateAccountDto): Promise<Account> {
    return this.prisma.account.create({
      data: {
        user: { connect: { id: data.userId } },
        accountNumber: data.accountNumber,
        accountType: data.accountType,
        status: data.status,
        balance: data.balance,
        currency: data.currency,
      },
    });
  }

  async update(id: number, data: UpdateAccountDto): Promise<Account> {
    return this.prisma.account.update({
      where: { id },
      data: {
        accountNumber: data.accountNumber,
        accountType: data.accountType,
        status: data.status,
        balance: data.balance,
        currency: data.currency,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.account.delete({ where: { id } });
  }
}