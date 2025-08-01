import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRole, UserStatus } from '@prisma/client';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() body: {
            name: string;
            username: string;
            email: string;
            password: string;
            status: UserStatus;
            role: UserRole;
        },
    ) {
        return this.authService.register(body.name, body.username, body.email, body.password, body.status, body.role);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req: { user: User}) {
        return this.authService.login(req.user);
    }

}