import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPromoCode extends Document {
  code: string;
  type: "percentage" | "flat";
  value: number;
  expiryDate?: Date;
}

const PromoCodeSchema: Schema = new Schema(
  {
    // The actual promo code string (e.g., 'SAVE10')
    code: { type: String, required: true, unique: true, uppercase: true },

    // Type of discount: percentage (e.g., 0.10 for 10%) or flat (e.g., 100 for ₹100)
    type: { type: String, required: true, enum: ["percentage", "flat"] },

    // The value associated with the type
    value: { type: Number, required: true, min: 0 },

    // Optional date when the code expires
    expiryDate: { type: Date, required: false },
  },
  {
    // Mongoose option to automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Export the Mongoose model instance for use in routes
const PromoCodeModel: Model<IPromoCode> = mongoose.model<IPromoCode>(
  "PromoCode",
  PromoCodeSchema
);
export default PromoCodeModel;
