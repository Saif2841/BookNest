// src/users/dto/register.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty() @IsNotEmpty() username: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @MinLength(6) password: string;
}
