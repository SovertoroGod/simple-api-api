import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Passport } from 'passport';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? "1h" }
    })
  ],
  providers: [AuthService],
  controllers: [AuthController, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
