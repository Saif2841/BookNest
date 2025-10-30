// src/auth/auth.controller.ts
import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { LoginDto } from 'src/users/dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ Use the LocalAuthGuard so Passport handles validation
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto }) // 👈 shows 'email' and 'password' in Swagger
  async login(@Request() req) {
    // req.user is set by LocalStrategy.validate()
    return this.authService.sign(req.user);
  }
}
