import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import SlotModel from "../models/Slot";
import BookingModel from "../models/Booking";

const router = Router();

// POST /bookings - Accept booking details and store them
router.post("/", async (req: Request, res: Response) => {
  const {
    experienceId,
    slotId,
    quantity,
    fullName,
    email,
    totalPaid,
    promoCode,
  } = req.body;

  // 1. Input Validation
  if (
    !experienceId ||
    !slotId ||
    !quantity ||
    !fullName ||
    !email ||
    !totalPaid
  ) {
    return res
      .status(400)
      .json({ message: "Missing required booking fields." });
  }

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be positive." });
  }

  try {
    // Step 1: Find the slot and lock it for update using findOneAndUpdate
    const slot = await SlotModel.findOneAndUpdate(
      {
        _id: slotId,
        // Only allow booking if capacity is not exceeded
        $expr: {
          $lte: [{ $add: ["$bookedSeats", quantity] }, "$totalCapacity"],
        },
      },
      {
        $inc: { bookedSeats: quantity },
      },
      {
        new: true, // Return updated document
        runValidators: true,
      }
    );

    // Step 2: Check if slot was found and updated
    if (!slot) {
      console.log(
        `[Booking Failed] Slot ${slotId} capacity exceeded or not found.`
      );
      return res.status(409).json({
        message:
          "This slot is now sold out or capacity exceeded. Double-booking prevented.",
      });
    }

    // Step 3: Create Booking Record
    const refId = "HDF" + uuidv4().substring(0, 7).toUpperCase();

    const newBooking = new BookingModel({
      refId,
      experienceId,
      slotId: slot._id,
      quantity,
      fullName,
      email,
      totalPaid,
      promoApplied: promoCode || "",
    });

    await newBooking.save();

    console.log(
      `[Booking Success] RefId: ${refId}, Slot: ${slotId}, Qty: ${quantity}`
    );

    return res.status(201).json({
      success: true,
      refId,
      message: "Booking confirmed successfully.",
    });
  } catch (error) {
    console.error("Booking Error:", error);
    return res
      .status(500)
      .json({ message: "Server error during booking process." });
  }
});

export default router;
