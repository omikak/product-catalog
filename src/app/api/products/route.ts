import { connectDb } from "@/lib/db";
import { error, json } from "@/lib/response";
import Product from "@/models/Product";
import type { SortOrder } from "mongoose";

function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 10)));
  return { page, limit, skip: (page - 1) * limit };
}

export async function GET(request: Request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const sort = searchParams.get("sort") ?? "latest";
    const { page, limit, skip } = parsePagination(searchParams);

    const query: Record<string, unknown> = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const sortOption: Record<string, SortOrder> =
      sort === "rating"
        ? { avgRating: -1, createdAt: -1 }
        : sort === "name"
          ? { name: 1 }
          : { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(query)
    ]);

    return json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch products", 500);
  }
}

export async function POST(request: Request) {
  try {
    await connectDb();

    const body = await request.json();

    if (!body?.name || !body?.category || !body?.imageUrl || !Array.isArray(body?.variants)) {
      return error("name, category, imageUrl and variants are required", 422);
    }

    const product = await Product.create(body);
    return json(product, 201);
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to create product", 500);
  }
}
