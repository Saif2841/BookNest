// src/users/users.controller.ts
import { Body, Controller, Get, Patch, Post, UploadedFile, UseGuards, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'uploads',
      filename: (_, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`)
    })
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: {
    username: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' },
    file: { type: 'string', format: 'binary' }
  }}})
  async register(@Body() dto: RegisterDto, @UploadedFile() file?: Express.Multer.File) {
    return this.users.createWithHash({ ...dto, image: file?.path });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() { return this.users.findAll(); }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: any) { return this.users.findById(user.sub); }

  @Patch('me/image')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'uploads',
      filename: (_, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`)
    })
  }))
  async changeImage(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    return this.users.setImage(user.sub, file.path);
  }

  @Post('me/borrow/:bookId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async borrow(@CurrentUser() user: any, @Param('bookId') bookId: string) {
    return this.users.borrowBook(user.sub, new Types.ObjectId(bookId));
  }

  @Patch('me/return/:bookId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async return(@CurrentUser() user: any, @Param('bookId') bookId: string) {
    return this.users.returnBook(user.sub, new Types.ObjectId(bookId));
  }
}
