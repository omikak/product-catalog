"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

type Analytics = {
  categoryStats: {
    _id: string;
    products: number;
    totalVariants: number;
    avgVariantPrice: number;
    totalStock: number;
  }[];
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadData(query?: string) {
    setLoading(true);

    try {
      const productRes = await fetch(`/api/products${query ? `?search=${encodeURIComponent(query)}` : ""}`);
      const analyticsRes = await fetch("/api/products/analytics");

      const productJson = await productRes.json();
      const analyticsJson = await analyticsRes.json();

      setProducts(productJson.products ?? []);
      setAnalytics(analyticsJson);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const totalInventory = useMemo(
    () => products.reduce((sum, p) => sum + p.variants.reduce((acc, v) => acc + v.stock, 0), 0),
    [products]
  );

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">
      <section className="catalog-shell rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-700">E-Commerce Catalog</p>
            <h1 className="fancy-title mt-1 font-[var(--font-merri)] text-3xl font-bold md:text-5xl">Products + Inventory</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Nested schema catalog with variant-level stock control, reviews, aggregation analytics, and indexed search.
            </p>
          </div>

          <Link href="/products/new" className="rounded-xl bg-teal-700 px-5 py-3 text-center text-sm font-semibold text-white">
            + Add Product
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs uppercase tracking-widest text-amber-700">Total Products</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{products.length}</p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
            <p className="text-xs uppercase tracking-widest text-teal-700">Total Inventory</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalInventory}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-widest text-slate-700">Categories</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{analytics?.categoryStats?.length ?? 0}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name/category/description"
            className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm"
          />
          <button
            onClick={() => void loadData(search)}
            className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-slate-600">Loading catalog...</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
