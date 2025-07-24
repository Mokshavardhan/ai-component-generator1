// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, pass: string): Promise<{ access_token: string }> {
    console.log('--- Inside signUp method ---'); // 👈 ADD THIS LOG
    const existingUser = await this.usersService.findByEmail(email);
    console.log(`--- existingUser variable is: ${JSON.stringify(existingUser)} ---`); // 👈 ADD THIS LOG

    if (existingUser) {
      console.log('--- User found, throwing ConflictException ---'); // 👈 ADD THIS LOG
      throw new ConflictException('Email already registered');
    }
    
    const hashedPassword = await bcrypt.hash(pass, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
    });

    const payload = { sub: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
// In src/auth/auth.service.ts

async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    console.log(`--- Attempting login for email: ${email} ---`);
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      console.log('--- Login failed: User not found in DB. ---');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(`--- User found. Hashed password from DB: ${user.password} ---`);
    console.log(`--- Password provided by user: ${pass} ---`);

    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    console.log(`--- Was the password a match? ${isPasswordMatching} ---`);

    if (!isPasswordMatching) {
      console.log('--- Login failed: Passwords do not match. ---');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('--- Login successful, creating token. ---');
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}