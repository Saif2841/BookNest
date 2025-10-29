// src/users/users.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createWithHash(data: { username: string; email: string; password: string; image?: string }) {
    const exists = await this.userModel.findOne({ $or: [{ email: data.email }, { username: data.username }]});
    if (exists) throw new BadRequestException('username/email déjà pris');
    const password = await bcrypt.hash(data.password, 10);
    return this.userModel.create({ ...data, password });
  }

  findAll() { return this.userModel.find(); }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  findByEmail(email: string) { return this.userModel.findOne({ email }); }

  async setImage(userId: string, path: string) {
    return this.userModel.findByIdAndUpdate(userId, { image: path }, { new: true });
  }

  async borrowBook(userId: string, bookId: Types.ObjectId) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { borrows: { bookId, borrowDate: new Date() } } },
      { new: true },
    );
  }

  async returnBook(userId: string, bookId: Types.ObjectId) {
    return this.userModel.findOneAndUpdate(
      { _id: userId, 'borrows.bookId': bookId, 'borrows.returnDate': { $exists: false } },
      { $set: { 'borrows.$.returnDate': new Date() } },
      { new: true },
    );
  }
}
