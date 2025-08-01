import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    const dto: RegisterDto = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'securepass123',
      status: UserStatus.active,
      role: UserRole.user,
    };

    it('should register a user successfully', async () => {
      const expected = { id: 1, ...dto, password: undefined };
      mockAuthService.register.mockResolvedValue(expected);

      const result = await controller.register(dto);
      expect(result).toEqual(expected);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException on duplicate email or username', async () => {
      mockAuthService.register.mockRejectedValue(new ConflictException());

      await expect(controller.register(dto)).rejects.toThrow('Email or username already exists');
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      role: UserRole.user,
    };

    const mockTokenResponse = {
      access_token: 'mocked.jwt.token',
      user: mockUser,
    };

    it('should return access token on successful login', async () => {
      mockAuthService.login.mockResolvedValue(mockTokenResponse);

      const req = { user: mockUser };
      const result = await controller.login(req as any);

      expect(result).toEqual(mockTokenResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException if no user is present', async () => {
      await expect(controller.login({} as any)).rejects.toThrow(UnauthorizedException);
    });
  });
});