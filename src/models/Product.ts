import mongoose, { Model, Schema, Types } from "mongoose";

export type Variant = {
  sku: string;
  color: string;
  price: number;
  stock: number;
};

export type Review = {
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
};

export type ProductDocument = {
  _id: Types.ObjectId;
  name: string;
  category: string;
  description?: string;
  imageUrl: string;
  variants: Variant[];
  reviews: Review[];
  avgRating: number;
  createdAt: Date;
  updatedAt: Date;
};

type ProductModel = Model<ProductDocument> & {
  increaseStock: (productId: string, sku: string, quantity: number) => Promise<ProductDocument | null>;
  decreaseStock: (productId: string, sku: string, quantity: number) => Promise<ProductDocument | null>;
  categoryAnalytics: () => Promise<
    {
      _id: string;
      products: number;
      totalVariants: number;
      avgVariantPrice: number;
      totalStock: number;
    }[]
  >;
};

const VariantSchema = new Schema<Variant>(
  {
    sku: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 }
  },
  { _id: false }
);

const ReviewSchema = new Schema<Review>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const ProductSchema = new Schema<ProductDocument, ProductModel>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    imageUrl: { type: String, required: true, trim: true },
    variants: {
      type: [VariantSchema],
      validate: {
        validator: (arr: Variant[]) => arr.length > 0,
        message: "At least one variant is required"
      }
    },
    reviews: { type: [ReviewSchema], default: [] },
    avgRating: { type: Number, default: 0, min: 0, max: 5 }
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, name: 1 });
ProductSchema.index({ "variants.sku": 1 }, { unique: true });
ProductSchema.index({ avgRating: -1 });
ProductSchema.index({ name: "text", category: "text", description: "text" });

ProductSchema.pre("save", function updateAverageRating(next) {
  if (!this.reviews?.length) {
    this.avgRating = 0;
    return next();
  }

  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.avgRating = Number((total / this.reviews.length).toFixed(2));
  next();
});

ProductSchema.static("increaseStock", async function increaseStock(productId: string, sku: string, quantity: number) {
  return this.findOneAndUpdate(
    { _id: productId, "variants.sku": sku },
    { $inc: { "variants.$.stock": Math.abs(quantity) } },
    { new: true }
  );
});

ProductSchema.static("decreaseStock", async function decreaseStock(productId: string, sku: string, quantity: number) {
  const qty = Math.abs(quantity);
  return this.findOneAndUpdate(
    { _id: productId, variants: { $elemMatch: { sku, stock: { $gte: qty } } } },
    { $inc: { "variants.$.stock": -qty } },
    { new: true }
  );
});

ProductSchema.static("categoryAnalytics", async function categoryAnalytics() {
  return this.aggregate([
    {
      $facet: {
        perCategory: [
          { $unwind: "$variants" },
          {
            $group: {
              _id: "$category",
              products: { $addToSet: "$_id" },
              totalVariants: { $sum: 1 },
              avgVariantPrice: { $avg: "$variants.price" },
              totalStock: { $sum: "$variants.stock" }
            }
          },
          {
            $project: {
              _id: 1,
              products: { $size: "$products" },
              totalVariants: 1,
              avgVariantPrice: { $round: ["$avgVariantPrice", 2] },
              totalStock: 1
            }
          },
          { $sort: { totalStock: -1 } }
        ]
      }
    },
    { $project: { perCategory: 1 } }
  ]).then((result) => result[0]?.perCategory ?? []);
});

const Product = (mongoose.models.Product as ProductModel) || mongoose.model<ProductDocument, ProductModel>("Product", ProductSchema);

export default Product;
