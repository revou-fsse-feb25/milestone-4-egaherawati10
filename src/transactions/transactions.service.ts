import { PrismaService } from "src/prisma/prisma.service";
import { DepositDto } from "./dto/deposit.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { WithdrawDto } from "./dto/withdraw.dto";
import { TransferDto } from "./dto/transfer.dto";
import { TransactionsServiceItf } from "./transactions.service.interface";

export class TransactionsService implements TransactionsServiceItf {
  constructor(private prisma: PrismaService) {}

  async deposit(senderId: number, dto: DepositDto) {
    const account = await this.prisma.account.findUnique({ where: { id: dto.accountId } });
    if (!account) throw new NotFoundException('Account not found');

    await this.prisma.account.update({ where: { id: dto.accountId },
    data: { balance: { increment: dto.amount } },
    });
    return this.prisma.transaction.create({ 
      data: { 
        senderId, 
        accountId: dto.accountId, 
        type: TransactionType.deposit,
        amount: dto.amount,
        currency: dto.currency,
        status: TransactionStatus.success,
       }, 
      });
  }

  async withdraw(senderId: number, dto: WithdrawDto) {
    const account = await this.prisma.account.findUnique({ where: { id: dto.accountId } });
    if (!account || account.balance < dto.amount) throw new NotFoundException('Account not found');

    await this.prisma.account.update({
      where: { id: dto.accountId },
      data: { balance: { decrement: dto.amount } },
    });

    return this.prisma.transaction.create({
      data: {
        senderId,
        accountId: dto.accountId,
        type: TransactionType.withdrawal,
        amount: dto.amount,
        currency: dto.currency,
        status: TransactionStatus.success,
      },
    });
  }

  async transfer(senderId: number, dto: TransferDto) {
    const { receiverId, accountId, amount, currency, description, referenceNumber } = dto;

    const sender = await this.prisma.user.findUnique({ 
      where: { id: senderId }, 
    });
    if (!sender) throw new NotFoundException('Sender not found');

    const senderAccount = await this.prisma.account.findFirst({ 
      where: { id: accountId, userId: senderId },
    });
    if (!senderAccount) throw new NotFoundException('Sender account not found');

    if (senderAccount.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    };

    const receiver = await this.prisma.user.findUnique({ 
      where: { id: receiverId }, 
    });
    if (!receiver) throw new NotFoundException('Receiver not found');

    const receiverAccount = await this.prisma.account.findFirst({
      where: {id: accountId, userId: receiverId, status: 'active'},
    });
    if (!receiverAccount) throw new NotFoundException('Receiver account not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: senderAccount.id },
        data: { balance: { decrement: amount } },
      });

      await tx.account.update({
        where: { id: receiverAccount.id },
        data: { balance: { increment: amount } },
      });

      return tx.transaction.create({
        data: {
          accountId: senderAccount.id,
          senderId,
          receiverId,
          type: TransactionType.transfer,
          amount,
          currency,
          description,
          status: TransactionStatus.success,
          referenceNumber,
        },
      });
    })
  }

  async getAllByUser(userId: number, role: string) {
  if (role === 'admin') {
    return this.prisma.transaction.findMany();
  }

  return this.prisma.transaction.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
  });
}

  async getTransactionById(id: number) {
    return this.prisma.transaction.findUnique({ where: { id } });
  }
}