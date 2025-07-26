import { Injectable } from "@nestjs/common";
import { AccountsRepositoryItf } from "./accounts.repository.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { Account, Prisma } from "@prisma/client";

@Injectable()
export class AccountRepository implements AccountsRepositoryItf {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<Account[]> {
        return this.prisma.account.findMany();
    }

    async findById(id: number): Promise<Account | null> {
        return this.prisma.account.findUnique({ 
            where: { id } });
    }

    async findByUserId(userId: number): Promise<Account | null> {
    return this.prisma.account.findFirst({
      where: { userId },
    });
  }

    async create(data: Prisma.AccountCreateInput): Promise<Account> {
        return this.prisma.account.create({ data });
    }

    async update(id: number, data: Prisma.AccountUpdateInput): Promise<Account> {
        return this.prisma.account.update({ where: { id }, data });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.account.delete({ where: { id } });
    }
}