// src/sessions/sessions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req, // 👈 Import Req
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { AuthGuard } from '@nestjs/passport'; // 👈 Import AuthGuard

@UseGuards(AuthGuard('jwt')) // 👈 Protect all routes in this controller
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

@Post(':id/generate')
generateCode(@Param('id') id: string, @Body('prompt') prompt: string) {
    return this.sessionsService.generateCode(id, prompt);
}
  // 👇 Use @Req() to get the request object, which contains the user
  @Post()
  create(@Req() req, @Body() createSessionDto: CreateSessionDto) {
    const userId = req.user.userId; // Get userId from the token payload
    return this.sessionsService.create(createSessionDto, userId);
  }

  // 👇 Also get all sessions for the logged-in user
  @Get()
  findAllForUser(@Req() req) {
    const userId = req.user.userId;
    return this.sessionsService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(id);
  }
}