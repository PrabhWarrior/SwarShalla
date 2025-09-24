import { Schema, model, Document } from "mongoose";

export interface IStudyMaterial extends Document {
  title: string;
  type: "Raga" | "Taal" | "Theory";
  content: string;
  created_by: number;
  created_at: Date;
}

const studyMaterialSchema = new Schema<IStudyMaterial>({
  title: { type: String, required: true },
  type: { type: String, enum: ["Raga","Taal","Theory"], required: true },
  content: { type: String, required: true },
  created_by: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

export const StudyMaterial = model<IStudyMaterial>("StudyMaterial", studyMaterialSchema);
