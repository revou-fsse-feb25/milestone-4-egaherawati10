import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new BadRequestException('Email or username already exists');
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: User }) {
    if (!req.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      return this.authService.login(req.user);
    } catch (error) {
      throw new InternalServerErrorException('Login failed');
    }
  }
}