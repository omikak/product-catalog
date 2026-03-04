import { connectDb } from "@/lib/db";
import { error, json } from "@/lib/response";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDb();

    const [categoryStats, topRated, lowStock] = await Promise.all([
      Product.categoryAnalytics(),
      Product.find().sort({ avgRating: -1 }).limit(5).select("name category avgRating imageUrl"),
      Product.aggregate([
        { $unwind: "$variants" },
        { $match: { "variants.stock": { $lte: 10 } } },
        {
          $project: {
            name: 1,
            category: 1,
            sku: "$variants.sku",
            color: "$variants.color",
            stock: "$variants.stock"
          }
        },
        { $sort: { stock: 1 } }
      ])
    ]);

    return json({ categoryStats, topRated, lowStock });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch analytics", 500);
  }
}
