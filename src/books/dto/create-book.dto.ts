// src/books/dto/create-book.dto.ts
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBookDto {
  @ApiProperty() @IsNotEmpty() title: string;
  @ApiProperty() @IsNotEmpty() author: string;
}
