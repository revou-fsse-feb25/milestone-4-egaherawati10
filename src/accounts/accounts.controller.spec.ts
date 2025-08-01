import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

const mockAccountsService = {
  createAccount: jest.fn(),
  getAllAccounts: jest.fn(),
  getAccountById: jest.fn(),
  updateAccount: jest.fn(),
  deleteAccount: jest.fn(),
};

const adminUser = { id: 1, role: UserRole.ADMIN };
const normalUser = { id: 2, role: UserRole.USER };

describe('AccountsController', () => {
  let controller: AccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        { provide: AccountsService, useValue: mockAccountsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create and return a new account', async () => {
      const dto: CreateAccountDto = {
        userId: 1,
        accountNumber: '1234567890',
        accountType: 'checking',
        status: 'active',
        balance: '10000000.00',
        currency: 'IDR',
      } as any;

      const mockResult = { id: 1, ...dto };
      mockAccountsService.createAccount.mockResolvedValue(mockResult);

      const result = await controller.createAccount(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAllAccounts', () => {
    it('should return all accounts', async () => {
      const mockAccounts = [{ id: 1 }, { id: 2 }];
      mockAccountsService.getAllAccounts.mockResolvedValue(mockAccounts);

      const result = await controller.getAllAccounts();
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('getAccountById', () => {
    it('should return the account if found and authorized (admin)', async () => {
      const mockAccount = { id: 1, userId: 99 };
      mockAccountsService.getAccountById.mockResolvedValue(mockAccount);

      const result = await controller.getAccountById(1, { user: adminUser });
      expect(result).toEqual(mockAccount);
    });

    it('should return the account if found and user is owner', async () => {
      const mockAccount = { id: 1, userId: normalUser.id };
      mockAccountsService.getAccountById.mockResolvedValue(mockAccount);

      const result = await controller.getAccountById(1, { user: normalUser });
      expect(result).toEqual(mockAccount);
    });

    it('should throw NotFoundException if account does not exist', async () => {
      mockAccountsService.getAccountById.mockResolvedValue(null);

      await expect(
        controller.getAccountById(999, { user: adminUser }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner nor admin', async () => {
      const mockAccount = { id: 1, userId: 5 };
      mockAccountsService.getAccountById.mockResolvedValue(mockAccount);

      await expect(
        controller.getAccountById(1, { user: normalUser }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateAccount', () => {
    it('should update and return the account', async () => {
      const dto: UpdateAccountDto = { balance: '2000000.00' } as any;
      const updatedAccount = { id: 1, ...dto };
      mockAccountsService.updateAccount.mockResolvedValue(updatedAccount);

      const result = await controller.updateAccount(1, dto, { user: adminUser });
      expect(result).toEqual(updatedAccount);
    });
  });

  describe('deleteAccount', () => {
    it('should return success message when deleted', async () => {
      mockAccountsService.deleteAccount.mockResolvedValue(undefined);

      const result = await controller.deleteAccount(1, { user: adminUser });
      expect(result).toEqual({ message: 'Account 1 deleted successfully' });
    });

    it('should rethrow NotFoundException from service', async () => {
      mockAccountsService.deleteAccount.mockRejectedValue(new NotFoundException());

      await expect(
        controller.deleteAccount(1, { user: adminUser }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should rethrow ForbiddenException from service', async () => {
      mockAccountsService.deleteAccount.mockRejectedValue(new ForbiddenException());

      await expect(
        controller.deleteAccount(1, { user: normalUser }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});