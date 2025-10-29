// src/common/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';  // ✅ this line is missing!

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
