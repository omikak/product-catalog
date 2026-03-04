import { connectDb } from "@/lib/db";
import { error, json } from "@/lib/response";
import Product from "@/models/Product";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();

    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return error("Product not found", 404);
    }

    return json(product);
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to fetch product", 500);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();

    const { id } = await params;
    const payload = await request.json();

    const product = await Product.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return error("Product not found", 404);
    }

    return json(product);
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to update product", 500);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();

    const { id } = await params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return error("Product not found", 404);
    }

    return json({ message: "Product deleted" });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to delete product", 500);
  }
}
