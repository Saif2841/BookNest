// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException();
    const ok = await bcrypt.compare(pass, user.password);
    if (!ok) throw new UnauthorizedException();
    return user;
  }

  sign(user: any) {
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    return { access_token: this.jwt.sign(payload) };
  }
}
