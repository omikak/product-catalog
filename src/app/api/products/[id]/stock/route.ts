import { connectDb } from "@/lib/db";
import { error, json } from "@/lib/response";
import Product from "@/models/Product";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();

    const { id } = await params;
    const body = await request.json();

    const { sku, quantity, operation } = body ?? {};

    if (!sku || !quantity || !["increment", "decrement"].includes(operation)) {
      return error("sku, quantity and operation (increment|decrement) are required", 422);
    }

    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty <= 0) {
      return error("Quantity must be a positive number", 422);
    }

    const updated =
      operation === "increment"
        ? await Product.increaseStock(id, sku, qty)
        : await Product.decreaseStock(id, sku, qty);

    if (!updated) {
      return error("Stock update failed. Check product id, sku, or available stock.", 400);
    }

    return json(updated);
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to update stock", 500);
  }
}
