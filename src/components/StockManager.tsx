"use client";

import { useState } from "react";

type Props = {
  productId: string;
  skus: string[];
  onUpdated: () => void;
};

export default function StockManager({ productId, skus, onUpdated }: Props) {
  const [sku, setSku] = useState(skus[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  async function update(operation: "increment" | "decrement") {
    if (!sku || quantity <= 0) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, quantity, operation })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Stock update failed");
      }

      onUpdated();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50/80 p-4">
      <h4 className="text-sm font-semibold text-slate-800">Stock Management</h4>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <select
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="rounded-lg border border-orange-300 px-3 py-2 text-sm"
        >
          {skus.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="rounded-lg border border-orange-300 px-3 py-2 text-sm"
        />

        <div className="flex gap-2">
          <button
            onClick={() => update("increment")}
            disabled={loading}
            className="flex-1 rounded-lg bg-teal-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            + Add
          </button>
          <button
            onClick={() => update("decrement")}
            disabled={loading}
            className="flex-1 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            - Reduce
          </button>
        </div>
      </div>
    </div>
  );
}
