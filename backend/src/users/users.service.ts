// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // 👇 FIX: Changed this.model to this.userModel
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    console.log(`--- Searching for email in DB: ${email} ---`);
    // 👇 FIX: Changed this.model to this.userModel
    const result = await this.userModel.findOne({ email }).exec();
    console.log(`--- DB Result: ${JSON.stringify(result)} ---`);
    return result;
  }
}