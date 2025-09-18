import { Schema, model, Types, Document } from "mongoose";

export interface IChat extends Document {
  type: "direct" | "group";
  name?: string;
  avatar?: string;
  participants: { userId: Types.ObjectId; joinedAt: Date }[];
  admins?: Types.ObjectId[];
  lastMessage?: {
    text: string;
    senderId: Types.ObjectId;
    createdAt: Date;
  };
  isArchived?: boolean;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    type: { type: String, enum: ["direct", "group"], required: true },
    name: { type: String, trim: true },
    avatar: { type: String },
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      text: { type: String },
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date },
    },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// For faster lookups
ChatSchema.index({ "participants.userId": 1 });
ChatSchema.index({ admins: 1 });

export const Chat = model<IChat>("Chat", ChatSchema);
