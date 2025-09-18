import { Schema, model, Document } from "mongoose";

export interface IMedia extends Document {
  uploaded_by: number;
  file_type: "image" | "audio" | "video" | "pdf";
  url: string;
  description?: string;
  created_at: Date;
}

const mediaSchema = new Schema<IMedia>({
  uploaded_by: { type: Number, required: true },
  file_type: { type: String, enum: ["image","audio","video","pdf"], required: true },
  url: { type: String, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
});

export const Media = model<IMedia>("Media", mediaSchema);
