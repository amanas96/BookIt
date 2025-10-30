import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISlot extends Document {
  experienceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM am/pm
  totalCapacity: number;
  bookedSeats: number;
  priceMultiplier?: number; // e.g., 1.1 for a 10% peak time surcharge
}

const SlotSchema: Schema = new Schema(
  {
    experienceId: { type: String, required: true, ref: "Experience" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    totalCapacity: { type: Number, required: true, default: 10 },
    bookedSeats: { type: Number, required: true, default: 0 },
    priceMultiplier: { type: Number, default: 1.0 },
  },
  { timestamps: true }
);

const SlotModel: Model<ISlot> = mongoose.model<ISlot>("Slot", SlotSchema);
export default SlotModel;
