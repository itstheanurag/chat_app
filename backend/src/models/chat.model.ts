import { Schema, model, Types, Document } from 'mongoose';

export interface IChat extends Document {
  type: 'direct' | 'group';
  participants: { userId: Types.ObjectId; joinedAt: Date }[];
  lastMessage?: {
    text: string;
    senderId: Types.ObjectId;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    type: { type: String, enum: ['direct', 'group'], required: true },
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        joinedAt: { type: Date, default: Date.now }
      }
    ],
    lastMessage: {
      text: { type: String },
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date }
    }
  },
  { timestamps: true }
);

// Index for faster participant lookups
ChatSchema.index({ 'participants.userId': 1 });

export const Chat = model<IChat>('Chat', ChatSchema);
