"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type VariantInput = {
  sku: string;
  color: string;
  price: string;
  stock: string;
};

export default function ProductForm() {
  const router = useRouter();

  const [name, setName] = useState("Premium Headphones");
  const [category, setCategory] = useState("Electronics");
  const [description, setDescription] = useState("Studio-grade wireless audio with premium comfort.");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
  );
  const [variants, setVariants] = useState<VariantInput[]>([
    { sku: "HP-BL-001", color: "Black", price: "199.99", stock: "15" },
    { sku: "HP-WH-001", color: "White", price: "209.99", stock: "8" }
  ]);
  const [loading, setLoading] = useState(false);

  function updateVariant(index: number, key: keyof VariantInput, value: string) {
    setVariants((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  function addVariant() {
    setVariants((prev) => [...prev, { sku: "", color: "", price: "", stock: "" }]);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        category,
        description,
        imageUrl,
        variants: variants.map((v) => ({
          sku: v.sku,
          color: v.color,
          price: Number(v.price),
          stock: Number(v.stock)
        }))
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Product creation failed");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-orange-200 bg-white/80 p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          className="rounded-lg border border-slate-300 px-3 py-2"
          required
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="rounded-lg border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
      />

      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
        required
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Variants</h3>
          <button type="button" onClick={addVariant} className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-white">
            Add Variant
          </button>
        </div>

        {variants.map((variant, idx) => (
          <div key={idx} className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-4">
            <input
              value={variant.sku}
              onChange={(e) => updateVariant(idx, "sku", e.target.value)}
              placeholder="SKU"
              className="rounded border border-slate-300 px-2 py-1"
              required
            />
            <input
              value={variant.color}
              onChange={(e) => updateVariant(idx, "color", e.target.value)}
              placeholder="Color"
              className="rounded border border-slate-300 px-2 py-1"
              required
            />
            <input
              type="number"
              step="0.01"
              value={variant.price}
              onChange={(e) => updateVariant(idx, "price", e.target.value)}
              placeholder="Price"
              className="rounded border border-slate-300 px-2 py-1"
              required
            />
            <input
              type="number"
              value={variant.stock}
              onChange={(e) => updateVariant(idx, "stock", e.target.value)}
              placeholder="Stock"
              className="rounded border border-slate-300 px-2 py-1"
              required
            />
          </div>
        ))}
      </div>

      <button disabled={loading} type="submit" className="rounded-xl bg-orange-600 px-5 py-2 font-semibold text-white">
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}
