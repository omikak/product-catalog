import Link from "next/link";

import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="catalog-shell rounded-3xl p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-[var(--font-merri)] text-3xl font-bold text-slate-900">Create Product</h1>
            <p className="text-sm text-slate-600">Add product details, variants and image URL.</p>
          </div>
          <Link href="/" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
            Back
          </Link>
        </div>

        <ProductForm />
      </div>
    </main>
  );
}
