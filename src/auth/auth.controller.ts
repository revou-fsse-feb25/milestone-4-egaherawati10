import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    try {
      const { name, username, email, password, status, role } = body;
      return await this.authService.register(name, username, email, password, status, role);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email or username already exists');
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: User }) {
    try {
      if (!req.user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return await this.authService.login(req.user);
    } catch (error) {
      throw new InternalServerErrorException('Login failed');
    }
  }
}
