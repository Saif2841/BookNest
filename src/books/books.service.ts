// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  create(dto: CreateBookDto) { return this.bookModel.create(dto); }
  findAll() { return this.bookModel.find(); }
  async findOne(id: string) {
    const b = await this.bookModel.findById(id);
    if (!b) throw new NotFoundException();
    return b;
  }
  update(id: string, dto: UpdateBookDto) { return this.bookModel.findByIdAndUpdate(id, dto, { new: true }); }
  remove(id: string) { return this.bookModel.findByIdAndDelete(id); }

  async setAvailability(bookId: Types.ObjectId, available: boolean) {
    return this.bookModel.findByIdAndUpdate(bookId, { available }, { new: true });
  }
}
