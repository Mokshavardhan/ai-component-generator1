// src/users/users.controller.ts
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // All the other methods (@Get, @Patch, @Delete) have been removed
  // because our UsersService doesn't implement them.
}