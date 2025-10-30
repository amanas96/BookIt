import mongoose from "mongoose";
import config from "./config";
import ExperienceModel from "./models/Experience";
import SlotModel from "./models/Slot";
import PromoCodeModel from "./models/PromoCode";

// Mock Data - Update image paths to your local images
const mockExperiences = [
  {
    id: "kayaking",
    name: "Kayaking",
    location: "Udupi, Karnataka",
    tagline: "Curated small-group experience. Certified guide.",
    basePrice: 999,
    description:
      "Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking. Scenic routes, trained guides, and safety briefing.",
    // image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600",
    image: "http://localhost:4000/images/kayaking.jpg",
    minAge: 10,
    duration: "2 hours",
  },
  {
    id: "sunrise",
    name: "Nandi Hills Sunrise",
    location: "Bangalore",
    tagline: "Witness the iconic sunrise view.",
    basePrice: 899,
    description:
      "Early morning trek to Nandi Hills. Includes light breakfast and photography tips.",
    // image:
    //   "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600",
    image: "http://localhost:4000/images/sunrise.jpg",

    minAge: 12,
    duration: "4 hours",
  },
  {
    id: "coffeetrail",
    name: "Coffee Trail",
    location: "Coorg",
    tagline: "Explore the misty coffee plantations.",
    basePrice: 1299,
    description:
      "Guided tour through lush coffee estates, including a tasting session.",
    // image:
    //   "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600",
    image: "http://localhost:4000/images/coffie.jpg",

    minAge: 8,
    duration: "3 hours",
  },
  {
    id: "boat-cruise",
    name: "Boat Cruise",
    location: "Sunderban",
    tagline: "Curated small-group experience. Certified guide.",
    basePrice: 999,
    description:
      "Experience the serene waters and wildlife of Sunderban. Safety first with gear included.",
    // image:
    //   "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600",
    image: "http://localhost:4000/images/boat-cruise.jpg",

    minAge: 8,
    duration: "3 hours",
  },
  {
    id: "bunjee-jumping",
    name: "Bunjee Jumping",
    location: "Manali",
    tagline: "Curated small-group experience. Certified guide.",
    basePrice: 999,
    description:
      "Adrenaline-pumping bungee jump experience. Safety first with gear included.",
    // image:
    //   "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&h=600",
    image: "http://localhost:4000/images/bunjee.jpg",

    minAge: 18,
    duration: "1 hour",
  },
  {
    id: "scuba-diving",
    name: "Scuba Diving",
    location: "Goa",
    tagline: "Explore the underwater world safely.",
    basePrice: 1999,
    description:
      "Professional instructors will guide you through coral reefs and marine life. Includes underwater photos and safety gear.",
    // image:
    //   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600",
    image: "http://localhost:4000/images/scuba.jpg",

    minAge: 14,
    duration: "2 hours",
  },
  {
    id: "desert-safari",
    name: "Desert Safari",
    location: "Jaisalmer, Rajasthan",
    tagline: "An unforgettable ride across golden dunes.",
    basePrice: 1599,
    description:
      "Evening desert safari with camel ride, folk dance, and dinner under the stars. Experience Rajasthan's culture at its finest.",
    // image:
    //   "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600",
    image: "http://localhost:4000/images/desert-safari.jpg",

    minAge: 10,
    duration: "5 hours",
  },
  {
    id: "paragliding",
    name: "Paragliding",
    location: "Bir Billing, Himachal Pradesh",
    tagline: "Fly over the Himalayas with certified pilots.",
    basePrice: 2499,
    description:
      "Soar through the skies at India’s paragliding capital. Includes training, flight video, and safety briefing.",
    // image:
    //   "https://images.unsplash.com/photo-1516569422866-f3c9ccf7c2cc?w=800&h=600",
    image: "http://localhost:4000/images/paragliding.jpg",

    minAge: 16,
    duration: "1.5 hours",
  },
];

const mockPromoCodes = [
  { code: "SAVE10", type: "percentage", value: 0.1 },
  { code: "SAVE15", type: "percentage", value: 0.15 },
  { code: "SAVE20", type: "percentage", value: 0.2 },
  { code: "FLAT100", type: "flat", value: 100 },
  { code: "FLAT200", type: "flat", value: 200 },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(config.mongoUri);
    console.log("✅ MongoDB connected successfully for seeding.");

    // Clear existing data
    console.log("Clearing existing data...");
    await ExperienceModel.deleteMany({});
    await SlotModel.deleteMany({});
    await PromoCodeModel.deleteMany({});
    console.log("✅ Existing data cleared.");

    // Insert Experiences
    console.log("Inserting experiences...");
    const insertedExperiences =
      await ExperienceModel.insertMany(mockExperiences);
    console.log(`✅ ${insertedExperiences.length} experiences seeded.`);

    // Prepare Slots
    const slotsToInsert = [];

    // Get experience IDs with proper typing
    const experiences = await ExperienceModel.find({});
    const experienceMap = new Map<string, string>();

    experiences.forEach((exp) => {
      experienceMap.set(exp.id, (exp._id as any).toString());
    });

    console.log("Experience IDs mapping:");
    experienceMap.forEach((id, key) => {
      console.log(`  ${key}: ${id}`);
    });

    // Kayaking Slots
    const kayakingId = experienceMap.get("kayaking");
    if (kayakingId) {
      slotsToInsert.push(
        {
          experienceId: kayakingId,
          date: "2025-11-05",
          time: "07:00 am",
          totalCapacity: 10,
          bookedSeats: 6,
        },
        {
          experienceId: kayakingId,
          date: "2025-11-05",
          time: "09:00 am",
          totalCapacity: 10,
          bookedSeats: 8,
          priceMultiplier: 1.1,
        },
        {
          experienceId: kayakingId,
          date: "2025-11-05",
          time: "11:00 am",
          totalCapacity: 10,
          bookedSeats: 9,
        },
        {
          experienceId: kayakingId,
          date: "2025-11-05",
          time: "01:00 pm",
          totalCapacity: 10,
          bookedSeats: 10,
        },
        {
          experienceId: kayakingId,
          date: "2025-11-06",
          time: "07:00 am",
          totalCapacity: 10,
          bookedSeats: 2,
        },
        {
          experienceId: kayakingId,
          date: "2025-11-07",
          time: "09:00 am",
          totalCapacity: 10,
          bookedSeats: 1,
        }
      );
    }

    // Sunrise Slots
    const sunriseId = experienceMap.get("sunrise");
    if (sunriseId) {
      slotsToInsert.push(
        {
          experienceId: sunriseId,
          date: "2025-11-08",
          time: "05:00 am",
          totalCapacity: 20,
          bookedSeats: 5,
        },
        {
          experienceId: sunriseId,
          date: "2025-11-09",
          time: "05:00 am",
          totalCapacity: 20,
          bookedSeats: 8,
        }
      );
    }

    // Coffee Trail Slots
    const coffeeId = experienceMap.get("coffeetrail");
    if (coffeeId) {
      slotsToInsert.push(
        {
          experienceId: coffeeId,
          date: "2025-11-10",
          time: "10:00 am",
          totalCapacity: 15,
          bookedSeats: 10,
        },
        {
          experienceId: coffeeId,
          date: "2025-11-11",
          time: "10:00 am",
          totalCapacity: 15,
          bookedSeats: 5,
        }
      );
    }

    // Boat Cruise Slots
    const boatId = experienceMap.get("boat-cruise");
    if (boatId) {
      slotsToInsert.push(
        {
          experienceId: boatId,
          date: "2025-11-12",
          time: "02:00 pm",
          totalCapacity: 25,
          bookedSeats: 12,
        },
        {
          experienceId: boatId,
          date: "2025-11-13",
          time: "02:00 pm",
          totalCapacity: 25,
          bookedSeats: 8,
        }
      );
    }

    // Bunjee Jumping Slots
    const bunjeeId = experienceMap.get("bunjee-jumping");
    if (bunjeeId) {
      slotsToInsert.push(
        {
          experienceId: bunjeeId,
          date: "2025-11-14",
          time: "11:00 am",
          totalCapacity: 8,
          bookedSeats: 5,
        },
        {
          experienceId: bunjeeId,
          date: "2025-11-15",
          time: "11:00 am",
          totalCapacity: 8,
          bookedSeats: 2,
        }
      );

      // Scuba Diving Slots
      const scubaId = experienceMap.get("scuba-diving");
      if (scubaId) {
        slotsToInsert.push(
          {
            experienceId: scubaId,
            date: "2025-11-16",
            time: "08:00 am",
            totalCapacity: 12,
            bookedSeats: 6,
          },
          {
            experienceId: scubaId,
            date: "2025-11-16",
            time: "10:00 am",
            totalCapacity: 12,
            bookedSeats: 9,
            priceMultiplier: 1.2,
          },
          {
            experienceId: scubaId,
            date: "2025-11-17",
            time: "02:00 pm",
            totalCapacity: 12,
            bookedSeats: 3,
          }
        );
      }

      // Desert Safari Slots
      const desertId = experienceMap.get("desert-safari");
      if (desertId) {
        slotsToInsert.push(
          {
            experienceId: desertId,
            date: "2025-11-18",
            time: "04:00 pm",
            totalCapacity: 20,
            bookedSeats: 8,
          },
          {
            experienceId: desertId,
            date: "2025-11-19",
            time: "05:00 pm",
            totalCapacity: 20,
            bookedSeats: 10,
          },
          {
            experienceId: desertId,
            date: "2025-11-20",
            time: "06:00 pm",
            totalCapacity: 20,
            bookedSeats: 15,
            priceMultiplier: 1.15,
          }
        );
      }

      // Paragliding Slots
      const paraId = experienceMap.get("paragliding");
      if (paraId) {
        slotsToInsert.push(
          {
            experienceId: paraId,
            date: "2025-11-21",
            time: "09:00 am",
            totalCapacity: 10,
            bookedSeats: 4,
          },
          {
            experienceId: paraId,
            date: "2025-11-21",
            time: "11:00 am",
            totalCapacity: 10,
            bookedSeats: 7,
            priceMultiplier: 1.1,
          },
          {
            experienceId: paraId,
            date: "2025-11-22",
            time: "03:00 pm",
            totalCapacity: 10,
            bookedSeats: 2,
          }
        );
      }
    }

    // Insert Slots
    console.log(`Inserting ${slotsToInsert.length} slots...`);
    await SlotModel.insertMany(slotsToInsert);
    console.log("✅ Slots seeded.");

    // Insert Promo Codes
    console.log("Inserting promo codes...");
    await PromoCodeModel.insertMany(mockPromoCodes);
    console.log("✅ Promo Codes seeded.");

    console.log("\n🎉 Database seed complete! Run npm run dev now.\n");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

// Check if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
