import mongoose, { Document, Schema, Model } from "mongoose";

export interface IExperience extends Document {
  id: string; // Used for frontend routing/lookup
  name: string;
  location: string;
  tagline: string;
  basePrice: number;
  description: string;
  image: string;
  minAge: number;
  duration: string;
}

const ExperienceSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    tagline: { type: String, required: true },
    basePrice: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    minAge: { type: Number, required: true },
    duration: { type: String, required: true },
  },
  { timestamps: true }
);

const ExperienceModel: Model<IExperience> = mongoose.model<IExperience>(
  "Experience",
  ExperienceSchema
);
export default ExperienceModel;
