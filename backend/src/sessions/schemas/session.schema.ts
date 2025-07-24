// src/sessions/schemas/session.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

// Define the structure for a single chat message
@Schema({ _id: false }) // Don't create separate IDs for chat messages
class ChatMessage {
  @Prop({ required: true, enum: ['user', 'assistant'] })
  role: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

// Define the structure for the code
@Schema({ _id: false })
class ComponentCode {
  @Prop({ default: '' })
  jsx: string;

  @Prop({ default: '' })
  css: string;
}

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true })
  title: string;

  // This links the session to a user
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  // This will be an array of the ChatMessage objects defined above
  @Prop({ type: [ChatMessage], default: [] })
  chatHistory: ChatMessage[];

  // This will be a nested object with the ComponentCode structure
  @Prop({ type: ComponentCode, default: {} })
  latestCode: ComponentCode;
}

export const SessionSchema = SchemaFactory.createForClass(Session);