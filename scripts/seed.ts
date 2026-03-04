import mongoose from "mongoose";

import { connectDb } from "../src/lib/db";
import Product from "../src/models/Product";

async function run() {
  await connectDb();

  await Product.deleteMany({ name: "Premium Headphones" });

  const seeded = await Product.create({
    name: "Premium Headphones",
    category: "Electronics",
    description: "High-fidelity over-ear wireless headphones with adaptive noise cancellation.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        sku: "HP-BL-001",
        color: "Black",
        price: 199.99,
        stock: 15
      },
      {
        sku: "HP-WH-001",
        color: "White",
        price: 209.99,
        stock: 8
      }
    ],
    reviews: [
      {
        userId: new mongoose.Types.ObjectId("65f4a8b7c1e6a8c1f4b8c7d1"),
        rating: 5,
        comment: "Excellent sound quality"
      }
    ]
  });

  console.log("Seeded product:");
  console.log(JSON.stringify(seeded.toJSON(), null, 2));

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
