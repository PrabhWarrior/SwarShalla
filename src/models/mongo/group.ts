import { Schema, model, Document } from "mongoose";

export interface IGroup extends Document {
  name: string;
  created_by: number;
  members: number[];
  created_at: Date;
}

const groupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  created_by: { type: Number, required: true },
  members: [{ type: Number, required: true }],
  created_at: { type: Date, default: Date.now },
});

export const Group = model<IGroup>("Group", groupSchema);
