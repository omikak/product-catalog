"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ReviewForm from "@/components/ReviewForm";
import StockManager from "@/components/StockManager";
import type { Product } from "@/lib/types";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProduct() {
    setLoading(true);

    const res = await fetch(`/api/products/${params.id}`);
    const data = await res.json();

    setProduct(data);
    setLoading(false);
  }

  useEffect(() => {
    if (params.id) {
      void loadProduct();
    }
  }, [params.id]);

  if (loading) {
    return <p className="p-10 text-center text-slate-600">Loading product...</p>;
  }

  if (!product?._id) {
    return <p className="p-10 text-center text-red-600">Product not found.</p>;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="catalog-shell rounded-3xl p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
            Back
          </Link>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">{product.category}</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative h-72 overflow-hidden rounded-2xl border border-orange-200">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          </div>

          <div>
            <h1 className="font-[var(--font-merri)] text-3xl font-bold text-slate-900">{product.name}</h1>
            <p className="mt-2 text-slate-600">{product.description}</p>
            <p className="mt-4 font-semibold text-amber-700">Average Rating: {product.avgRating || 0}</p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-800">Variants</h3>
              <div className="mt-2 space-y-2">
                {product.variants.map((variant) => (
                  <div key={variant.sku} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
                    <span>
                      {variant.sku} ({variant.color})
                    </span>
                    <span>
                      ${variant.price} | Stock: {variant.stock}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <StockManager productId={product._id} skus={product.variants.map((v) => v.sku)} onUpdated={loadProduct} />
          <ReviewForm productId={product._id} onAdded={loadProduct} />
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-semibold text-slate-800">Reviews</h3>
          {product.reviews.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No reviews yet.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {product.reviews.map((review, index) => (
                <div key={index} className="rounded-lg border border-slate-100 p-3 text-sm">
                  <p className="font-medium text-slate-800">Rating: {review.rating}/5</p>
                  <p className="text-slate-600">{review.comment}</p>
                  <p className="text-xs text-slate-400">User: {review.userId}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
