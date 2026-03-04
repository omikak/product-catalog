import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);

  return (
    <Link
      href={`/products/${product._id}`}
      className="group overflow-hidden rounded-2xl border border-orange-200 bg-white/80 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-[var(--font-merri)] text-lg font-bold text-slate-800">{product.name}</h3>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">{product.category}</span>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{product.description || "No description added yet."}</p>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-amber-700">Avg Rating: {product.avgRating || 0}</span>
          <span className="text-slate-500">Stock: {totalStock}</span>
        </div>
      </div>
    </Link>
  );
}
