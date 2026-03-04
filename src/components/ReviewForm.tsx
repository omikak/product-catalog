"use client";

import { useState } from "react";

type Props = {
  productId: string;
  onAdded: () => void;
};

export default function ReviewForm({ productId, onAdded }: Props) {
  const [userId, setUserId] = useState("65f4a8b7c1e6a8c1f4b8c7d1");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${productId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, rating, comment })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Could not add review");
      }

      setComment("");
      onAdded();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitReview} className="rounded-xl border border-teal-200 bg-white p-4">
      <h4 className="font-semibold text-slate-800">Add Review</h4>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="User ObjectId"
          required
        />
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          required
        />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        placeholder="Write your review"
        required
      />
      <button
        disabled={loading}
        type="submit"
        className="mt-3 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Saving..." : "Submit Review"}
      </button>
    </form>
  );
}
