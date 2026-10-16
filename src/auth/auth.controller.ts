import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from './current-user.decorator';
import { AuthUser } from './user.types';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @Post("register")
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Public()
    @Post("login")
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get("me")
    me(@CurrentUser() user: AuthUser) {
        return this.authService.me(user.id);
    }
}
