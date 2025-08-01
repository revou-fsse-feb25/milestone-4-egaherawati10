import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UserRole, UserStatus, User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    usersService = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
    } as any;

    jwtService = {
      sign: jest.fn(),
    } as any;

    authService = new AuthService(usersService, jwtService);
  });

  describe('validateUser', () => {
    it('should return user if email and password are valid', async () => {
      const mockUser = { email: 'test@example.com', password: 'hashed' } as User;
      usersService.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test@example.com', 'plain');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);
      const result = await authService.validateUser('no@example.com', 'any');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const mockUser = { email: 'test@example.com', password: 'hashed' } as User;
      usersService.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser('test@example.com', 'wrong');
      expect(result).toBeNull();
    });

    it('should throw error on internal failure', async () => {
      usersService.getUserByEmail.mockRejectedValue(new Error('DB error'));
      await expect(authService.validateUser('error@example.com', 'pass')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    it('should return access token and user info', () => {
      const mockUser = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        role: UserRole.user,
      } as User;

      jwtService.sign.mockReturnValue('jwt-token');

      const result = authService.login(mockUser);

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: 1,
          name: 'Test',
          email: 'test@example.com',
          role: UserRole.user,
        },
      });
    });

    it('should throw error on failure', () => {
      jwtService.sign.mockImplementation(() => {
        throw new Error();
      });

      expect(() => authService.login({} as User)).toThrow(InternalServerErrorException);
    });
  });

  describe('register', () => {
    const dto: RegisterDto = {
      name: 'New User',
      username: 'newuser',
      email: 'new@example.com',
      password: 'securepass',
      status: UserStatus.active,
      role: UserRole.user,
    };

    it('should register a new user', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpass');

      const createdUser = {
        id: 1,
        ...dto,
        password: 'hashedpass',
      } as User;

      usersService.createUser.mockResolvedValue(createdUser);

      const result = await authService.register(dto);

      const { password: _, ...expected } = createdUser;
      expect(result).toEqual(expected);
    });

    it('should throw ConflictException if email already exists', async () => {
      usersService.getUserByEmail.mockResolvedValue({} as User);

      await expect(authService.register(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      usersService.getUserByEmail.mockRejectedValue(new Error('DB error'));

      await expect(authService.register(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});