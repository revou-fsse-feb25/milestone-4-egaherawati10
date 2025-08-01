import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      return isPasswordValid ? user : null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to validate user');
    }
  }

  login(user: User) {
    try {
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Login failed');
    }
  }

  async register(
    name: string,
    username: string,
    email: string,
    password: string,
    status: UserStatus,
    role: UserRole,
  ) {
    try {
      const existing = await this.usersService.getUserByEmail(email);
      if (existing) {
        throw new ConflictException('Email is already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.usersService.createUser({
        name,
        username,
        email,
        password: hashedPassword,
        status,
        role,
      });

      const { password: _removed, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Registration failed');
    }
  }
}
