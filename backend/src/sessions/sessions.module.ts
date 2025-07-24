// src/sessions/sessions.module.ts
import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './schemas/session.schema';
import { AiModule } from 'src/ai/ai.module'; // 👈 Import AiModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    AiModule, // 👈 Add AiModule here so you can use AiService
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}