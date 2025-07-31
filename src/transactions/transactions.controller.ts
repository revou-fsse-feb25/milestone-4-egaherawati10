import { Controller, Post, Body, Param, Get, Request, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

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

  @Post('transfer')
  transfer(@Req() req, @Body() dto: TransferDto) {
    return this.service.transfer(req.user.id, dto);
  }

  @Get()
  @Roles('admin', 'user')
  list(@CurrentUser() user: any) {
    return this.service.getAllByUser(user.id, user.role);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getTransactionById(+id);
  }
}