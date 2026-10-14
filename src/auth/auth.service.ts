import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { role } from '@prisma/orm-postgres/contract-builder';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.prisma.user
            .where({ email: dto.email })
            .first();

        if (existingUser) {
            throw new ConflictException("Email already registered")
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            email: dto.email,
            passwordHash,
            name: dto.username,
        });

        return this.toPublicUser(user)
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user
            .where({ email: dto.email })
            .first();

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        const comparePw = await bcrypt.compare(dto.password, user.passwordHash);

        if (!comparePw) {
            throw new UnauthorizedException("Invalid Password");
        }

        const payload = { id: user.id, email: user.email, role: user.role };

        return {
            accessToken: await this.jwt.signAsync(payload),
            user: this.toPublicUser(user)
        }

    }

    private toPublicUser(user: { id: string; email: string, name: string | null, role: string }) {
        return { id: user.id, email: user.email, name: user.name, role: user.role }
    }
}
