import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  group_id: Schema.Types.ObjectId;
  sender_id: number;
  message_type: "text" | "link" | "media";
  content: string;
  media_url?: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  group_id: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  sender_id: { type: Number, required: true },
  message_type: { type: String, enum: ["text","link","media"], required: true },
  content: { type: String, required: true },
  media_url: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export const Message = model<IMessage>("Message", messageSchema);
