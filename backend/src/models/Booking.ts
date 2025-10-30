import mongoose, { Document, Schema, Model } from "mongoose";

export interface IBooking extends Document {
  userId: string;
  refId: string;
  experienceId: string;
  slotId: string;
  quantity: number;
  fullName: string;
  email: string;
  totalPaid: number;
  promoApplied: string;
  bookingDate: Date;
}

const BookingSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, default: "anonymous_user" }, // Default for mock
    refId: { type: String, required: true, unique: true },
    experienceId: { type: String, required: true, ref: "Experience" },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Slot",
    }, // Slot ID must be the MongoDB ObjectId
    quantity: { type: Number, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    totalPaid: { type: Number, required: true },
    promoApplied: { type: String, default: "" },
    bookingDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const BookingModel: Model<IBooking> = mongoose.model<IBooking>(
  "Booking",
  BookingSchema
);
export default BookingModel;
