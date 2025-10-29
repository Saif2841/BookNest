// src/books/schemas/book.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Book {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) author: string;
  @Prop({ default: true }) available: boolean;
}
export const BookSchema = SchemaFactory.createForClass(Book);
