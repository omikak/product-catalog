# E-Commerce Catalog (Next.js + MongoDB)

Full-stack product catalog with nested Mongoose schemas (`variants`, `reviews`), aggregation analytics, indexes, and stock update APIs.

## Features

- Nested schema modeling for products, variants, and reviews
- Aggregation API for category-level analytics and low-stock detection
- Indexed fields for faster search and sorting
- Variant stock increment/decrement methods
- Frontend catalog with product images, product creation, reviews, and stock controls

## Tech Stack

- Next.js 15 (App Router)
- React 19
- MongoDB Atlas + Mongoose
- Tailwind CSS

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Update `MONGODB_URI` in `.env.local`.

4. Seed sample data:

```bash
npm run seed
```

5. Run dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `GET /api/products` - list products (`search`, `category`, `sort`, `page`, `limit`)
- `POST /api/products` - create product
- `GET /api/products/:id` - get product
- `PATCH /api/products/:id` - update product
- `DELETE /api/products/:id` - delete product
- `POST /api/products/:id/review` - add review and auto-update avg rating
- `PATCH /api/products/:id/stock` - update stock with `{ sku, quantity, operation: increment|decrement }`
- `GET /api/products/analytics` - category stats, top rated, low stock variants

## Indexes Used

- `{ category: 1, name: 1 }`
- `{ "variants.sku": 1 }` unique
- `{ avgRating: -1 }`
- text index on `name`, `category`, `description`

## GitHub Push

```bash
git init
git add .
git commit -m "Build full-stack e-commerce catalog"
git branch -M main
git remote add origin https://github.com/omikak/product-catalog.git
git push -u origin main
```

If remote exists already, run:

```bash
git remote set-url origin https://github.com/omikak/product-catalog.git
git push -u origin main
```

## Deploy to Vercel

1. Push code to GitHub.
2. Import repo in Vercel dashboard.
3. Add environment variable:

- `MONGODB_URI` = your MongoDB Atlas connection string

4. Deploy.

No extra `vercel.json` is required for this setup.
