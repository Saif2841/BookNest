// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class Borrow {
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  bookId: Types.ObjectId;

  @Prop({ type: Date, default: () => new Date() })
  borrowDate: Date;

  @Prop({ type: Date })
  returnDate?: Date;
}
const BorrowSchema = SchemaFactory.createForClass(Borrow);

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true }) username: string;
  @Prop({ unique: true, required: true }) email: string;
  @Prop({ required: true }) password: string; // hashé
  @Prop({ enum: ['user', 'admin'], default: 'user' }) role: 'user' | 'admin';
  @Prop() image?: string; // chemin local
  @Prop({ type: [BorrowSchema], default: [] }) borrows: Borrow[];
}
export const UserSchema = SchemaFactory.createForClass(User);
