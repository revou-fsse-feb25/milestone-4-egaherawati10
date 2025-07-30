import { PrismaService } from "src/prisma/prisma.service";
import { DepositDto } from "./dto/deposit.dto";
import { NotFoundException } from "@nestjs/common";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { WithdrawDto } from "./dto/withdraw.dto";
import { TransferDto } from "./dto/transfer.dto";

export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async deposit(userId: number, dto: DepositDto) {
    const account = await this.prisma.account.findUnique({ where: { id: dto.accountId } });
    if (!account) throw new NotFoundException('Account not found');

    await this.prisma.account.update({ where: { id: dto.accountId },
    data: { balance: { increment: dto.amount } },
    });
    return this.prisma.transaction.create({ 
      data: { 
        userId, 
        accountId: dto.accountId, 
        type: TransactionType.deposit,
        amount: dto.amount,
        currency: dto.currency,
        description: dto.description,
        status: TransactionStatus.success,
       }, 
      });
  }

  async withdraw(userId: number, dto: WithdrawDto) {
    const account = await this.prisma.account.findUnique({ where: { id: dto.accountId } });
    if (!account || account.balance < dto.amount) throw new NotFoundException('Account not found');

    await this.prisma.account.update({
      where: { id: dto.accountId },
      data: { balance: { decrement: dto.amount } },
    });

    return this.prisma.transaction.create({
      data: {
        userId,
        accountId: dto.accountId,
        type: TransactionType.withdrawal,
        amount: dto.amount,
        currency: dto.currency,
        description: dto.description,
        status: TransactionStatus.success,
      },
    });
  }

  // async transfer(userId: number, dto: TransferDto) {
  //   const sender = await this.prisma.account.findUnique({ where: { id: dto.senderId } });
  //   const receiver = await this.prisma.account.findUnique({ where: { id: dto.receiverId } });

  //   if (!sender || !receiver || sender.balance < dto.amount) {
  //     throw new NotFoundException('Accounts not found or insufficient balance');
  //   }

  //   await this.prisma.$transaction([
  //     this.prisma.account.update({
  //       where: { id: dto.senderId },
  //       data: { balance: { decrement: dto.amount } },
  //     }),
  //     this.prisma.account.update({
  //       where: { id: dto.receiverId },
  //       data: { balance: { increment: dto.amount } },
  //     }),
  //   ]);

  //   return this.prisma.transaction.create({
  //     data: {
  //       userId,
  //       senderId: dto.account,
  //       receiverId: dto.receiverId,
  //       type: TransactionType.transfer,
  //       amount: dto.amount,
  //       currency: dto.currency,
  //       description: dto.description,
  //       status: TransactionStatus.success,
  //     }
  //   })
  // }

  async getAllByUser(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTransactionById(id: number) {
    return this.prisma.transaction.findUnique({ where: { id } });
  }
}