import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
  UseGuards, Request, ForbiddenException, NotFoundException, BadRequestException, InternalServerErrorException
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enums/role.enum';

@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply both guards globally
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async createAccount(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    try {
      return await this.accountsService.createAccount(createAccountDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllAccounts(): Promise<Account[]> {
    try {
      return await this.accountsService.getAllAccounts();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch accounts');
    }
  }

  @Get(':id')
  async getAccountById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { id: number; role: string } }
  ): Promise<Account> {
    const account = await this.accountsService.getAccountById(id);
    if (!account) throw new NotFoundException(`Account with ID ${id} not found`);

    if (req.user.role !== 'admin' && req.user.id !== account.userId) {
      throw new ForbiddenException('You are not authorized to access this account');
    }

    return account;
  }

  @Patch(':id')
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
    @Request() req: { user: { id: number; role: string } }
  ): Promise<Account> {
    try {
      return await this.accountsService.updateAccount(id, updateAccountDto, req.user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async deleteAccount(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { id: number; role: string } }
  ): Promise<{ message: string }> {
    try {
      await this.accountsService.deleteAccount(id, req.user);
      return { message: `Account ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete account');
    }
  }
}
