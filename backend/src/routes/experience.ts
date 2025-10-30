import { Router, Request, Response } from "express";
import ExperienceModel from "../models/Experience";
import SlotModel from "../models/Slot";

const router = Router();

// GET /experiences - Return list of all experiences
router.get("/", async (req: Request, res: Response) => {
  try {
    // Use Mongoose to find all experiences and select only necessary fields for the list view
    const experiences = await ExperienceModel.find(
      {},
      "id name location tagline basePrice image"
    );

    // Map the results to ensure they conform to the expected format (using id instead of _id)
    const formattedExperiences = experiences.map((exp) => ({
      id: exp.id,
      name: exp.name,
      location: exp.location,
      tagline: exp.tagline,
      basePrice: exp.basePrice,
      image: exp.image,
    }));

    res.json(formattedExperiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve experiences from database." });
  }
});

// GET /experiences/:id - Return details and slot availability
router.get("/:id", async (req: Request, res: Response) => {
  const experienceId = req.params.id;

  try {
    // Find the specific experience by its custom ID field
    const experience = await ExperienceModel.findOne({ id: experienceId });

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // ✅ FIXED: Find slots using the MongoDB _id, not the custom id field
    const relatedSlots = await SlotModel.find({
      experienceId: (experience._id as any).toString(),
    });

    console.log(
      `Found ${relatedSlots.length} slots for experience ${experienceId}`
    );

    // Group slots by date for easy frontend consumption
    const slotsByDate = relatedSlots.reduce(
      (acc, slot) => {
        const dateKey = slot.date as string;
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        // Use slot.toJSON() to ensure pure JSON objects
        acc[dateKey].push(slot.toJSON());
        return acc;
      },
      {} as Record<string, any[]>
    );

    // Combine experience details and slots
    res.json({ experience: experience.toJSON(), slotsByDate });
  } catch (error) {
    console.error("Error fetching experience details:", error);
    res.status(500).json({ message: "Failed to retrieve experience details." });
  }
});

export default router;
