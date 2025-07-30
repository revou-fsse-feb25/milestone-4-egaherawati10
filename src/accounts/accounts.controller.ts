import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AccountsServiceItf } from "./accounts.service.interface";
import { AccountsService } from "./accounts.service";
import { Account } from "@prisma/client";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountsService.createAccount(createAccountDto);
  }

  @Get()
  async getAllAccounts(): Promise<Account[]> {
    return this.accountsService.getAllAccounts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAccountById(@Param('id', ParseIntPipe) id: number): Promise<Account | null> {
    return this.accountsService.getAccountById(+id);
  }

  @Patch(':id')
  async updateAccount(@Param('id', ParseIntPipe) id: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
    return this.accountsService.updateAccount(+id, updateAccountDto);
  }

  @Delete(':id')
  async deleteAccount(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.accountsService.deleteAccount(id);
  }
}