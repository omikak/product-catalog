import mongoose from "mongoose";

import { connectDb } from "@/lib/db";
import { error, json } from "@/lib/response";
import Product from "@/models/Product";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();

    const { id } = await params;
    const body = await request.json();

    if (!body?.userId || !body?.rating || !body?.comment) {
      return error("userId, rating and comment are required", 422);
    }

    const product = await Product.findById(id);

    if (!product) {
      return error("Product not found", 404);
    }

    product.reviews.push({
      userId: new mongoose.Types.ObjectId(body.userId),
      rating: Number(body.rating),
      comment: body.comment,
      createdAt: new Date()
    });

    await product.save();

    return json(product);
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to add review", 500);
  }
}
