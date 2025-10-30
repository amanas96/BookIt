import { Router, Request, Response } from "express";
import PromoCodeModel from "../models/PromoCode";

const router = Router();

// POST /promo/validate - Validate promo codes
router.post("/validate", async (req: Request, res: Response) => {
  const { code, subtotal } = req.body;

  if (!code || typeof subtotal === "undefined") {
    return res.status(400).json({ message: "Missing code or subtotal." });
  }

  try {
    const promo = await PromoCodeModel.findOne({
      code: code.toUpperCase(),
      // Ensure promo is not expired
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: new Date() } },
      ],
    });

    if (!promo) {
      return res
        .status(400)
        .json({ discount: 0, message: "Invalid or expired promo code." });
    }

    let discount = 0;
    if (promo.type === "percentage") {
      discount = subtotal * promo.value;
    } else if (promo.type === "flat") {
      discount = promo.value;
    }

    // Cap discount at subtotal
    discount = Math.min(Math.round(discount), subtotal);

    return res.json({
      discount: discount,
      message: `${promo.code} applied! You saved ₹${discount}.`,
    });
  } catch (error) {
    console.error("Error validating promo code:", error);
    return res
      .status(500)
      .json({ message: "Server error during promo validation." });
  }
});

export default router;
