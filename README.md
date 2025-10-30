
```
# E-Commerce Web Application

A simple e-commerce web application built using **Next.js (App Router)** and **MongoDB**.  
The project demonstrates multiple rendering strategies — **SSG**, **ISR**, **SSR**, and **CSR** — within one unified setup.

---
## Tech Stack
**Framework:** Next.js 14 (TypeScript, App Router)  
**Styling:** Tailwind CSS, Shadcn/UI, Lucide React Icons  
**Database:** MongoDB with Mongoose  
**Notifications:** Sonner  
**Backend:** Next.js API Routes  
**Environment:** Configurable for both Development and Production
---

## Features
- Product listing with search and filtering  
- Product details with incremental updates  
- Admin dashboard for inventory overview  
- Add new products from the dashboard  
- Client-side cart and wishlist handling  
- Responsive and clean user interface  

---
## Rendering Strategies

**Home Page (`/`)**  
→ **Static Site Generation (SSG)**  
Product data is fetched at build time for fast load speed.  
This page won’t update with new products until a rebuild occurs — demonstrating SSG behavior.

**Product Detail Page (`/product/[id]`)**  
→ **Incremental Static Regeneration (ISR)**  
Each product page is pre-generated and revalidated periodically (e.g., every 60 seconds) for near-live updates.

**Inventory Dashboard (`/inventory`)**  
→ **Server-Side Rendering (SSR)**  
Fetches fresh data on every request to ensure always up-to-date inventory for admin users.

**Dashboard Page (`/dashboard`)**  
→ **Client-Side Rendering (CSR)**  
All interactions occur client-side. Products are added via API calls and reflected immediately in inventory.

---
## Environment Variables
Create a `.env.local` file in the root directory and add the following:

1.NEXT_PUBLIC_BASE_URL=[http://localhost:3000](http://localhost:3000)
2.MONGODB_URI=your_mongodb_connection_string
3.JWT_SECRET=your_secret_key

Do not commit your `.env.local` file. Use `.env.example` as a safe template.

---
## Database Setup

1. Create a MongoDB cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) or use a local MongoDB instance.  
2. Copy your connection string and paste it into the `.env.local` file under `MONGODB_URI`.  
3. When the development server starts, it will automatically connect to MongoDB.

---

## Setup Instructions
1. **Clone the repository**  

git clone [https://github.com/](https://github.com/)<your-username>/<your-repo-name>.git
cd <your-repo-name>

2.**Install dependencies**  
npm install

3. **Run the development server**  
npm run dev

4. **Build for production**  
npm run build && npm start
---

## Notes

- Ensure `NODE_ENV` is set to `production` before deployment.  
- The project demonstrates correct use of SSG, ISR, SSR, and CSR in Next.js.  
- Avoid committing any sensitive data such as real API keys or environment variables.
```
