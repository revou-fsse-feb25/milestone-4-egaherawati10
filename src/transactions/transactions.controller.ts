import { Controller, Post, Body, Param, Get, Request, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post('deposit')
  deposit(@Request() req, @Body() dto: DepositDto) {
    return this.service.deposit(req.user.id, dto);
  }

  @Post('withdraw')
  withdraw(@Request() req, @Body() dto: WithdrawDto) {
    return this.service.withdraw(req.user.id, dto);
  }

  // @Post('transfer')
  // transfer(@Request() req, @Body() dto: TransferDto) {
  //   return this.service.transfer(req.user.id, dto);
  // }

  @Get()
  list(@Request() req) {
    return this.service.getAllByUser(req.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getTransactionById(+id);
  }
}