import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashed-password',
    status: UserStatus.active,
    role: UserRole.admin,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('validateUser', () => {
    it('should return user if email and password match', async () => {
      usersService.getUserByEmail.mockResolvedValue(mockUser);

      (jest
        .spyOn(bcrypt, 'compare') as unknown as jest.SpyInstance<
        Promise<boolean>,
        [string, string]
      >).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);

      const result = await service.validateUser('notfound@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      usersService.getUserByEmail.mockResolvedValue(mockUser);

      (jest
        .spyOn(bcrypt, 'compare') as unknown as jest.SpyInstance<
        Promise<boolean>,
        [string, string]
      >).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token and user info', () => {
      jwtService.sign.mockReturnValue('mocked-jwt-token');

      const result = service.login(mockUser as any);
      expect(result).toEqual({
        access_token: 'mocked-jwt-token',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      });
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);
      usersService.createUser.mockImplementation(async (data) => ({
        ...data,
        id: 1,
      }));

      const result = await service.register(
        'New User',
        'newuser',
        'new@example.com',
        'password123',
        UserStatus.active,
        UserRole.user,
      );

      expect(result).toMatchObject({
        id: 1,
        name: 'New User',
        email: 'new@example.com',
        username: 'newuser',
        role: UserRole.user,
        status: UserStatus.active,
      });
    });

    it('should throw if user already exists', async () => {
      usersService.getUserByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register(
          'Test User',
          'testuser',
          'test@example.com',
          'password123',
          UserStatus.active,
          UserRole.user,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
