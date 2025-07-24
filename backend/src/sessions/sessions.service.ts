// src/sessions/sessions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session, SessionDocument } from './schemas/session.schema';
import { AiService } from 'src/ai/ai.service'; // Make sure AiService is imported

@Injectable()
export class SessionsService {
  // 👇 The constructor should be on one line like this
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private aiService: AiService,
  ) {}

  async create(createSessionDto: CreateSessionDto, userId: string): Promise<Session> {
    const newSession = new this.sessionModel({
      ...createSessionDto,
      userId: userId,
    });
    return newSession.save();
  }

  async findAllForUser(userId: string): Promise<Session[]> {
    return this.sessionModel.find({ userId }).sort({ updatedAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionModel.findById(id).exec();
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto): Promise<Session> {
    const updatedSession = await this.sessionModel
      .findByIdAndUpdate(id, updateSessionDto, { new: true })
      .exec();
    if (!updatedSession) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return updatedSession;
  }

  async remove(id: string) {
    const result = await this.sessionModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return { message: `Session with ID ${id} deleted successfully` };
  }
// In src/sessions/sessions.service.ts

// ...

// Replace the existing generateCode method with this one
async generateCode(sessionId: string, prompt: string): Promise<SessionDocument> {
    const generatedCode = await this.aiService.generateComponentCode(prompt);

    const userMessage = {
        role: 'user',
        content: prompt,
        timestamp: new Date(),
    };

    const assistantMessage = {
        role: 'assistant',
        content: 'Here is the code I generated.',
        timestamp: new Date(),
    };

    const updatedSession = await this.sessionModel.findByIdAndUpdate(
        sessionId,
        {
            $set: { latestCode: generatedCode },
            // 👇 FIX: Push both messages at once
            $push: {
                chatHistory: { $each: [userMessage, assistantMessage] }
            }
        },
        { new: true },
    );

    // 👇 FIX: Add a check for null before proceeding
    if (!updatedSession) {
        throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    return updatedSession;
}
}