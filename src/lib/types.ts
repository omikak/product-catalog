export type Variant = {
  sku: string;
  color: string;
  price: number;
  stock: number;
};

export type Review = {
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Product = {
  _id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl: string;
  variants: Variant[];
  reviews: Review[];
  avgRating: number;
  createdAt: string;
};
