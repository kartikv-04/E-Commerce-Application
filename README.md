# E-Commerce Web Application

A full-stack e-commerce platform built with **Next.js (App Router)** on the frontend and **Node.js (Express + MongoDB)** on the backend. It includes authentication, product management, cart and wishlist functionality, and an admin dashboard for inventory control.

## Tech Stack
**Frontend:** Next.js 14 (App Router), TypeScript, Shadcn/UI, Tailwind CSS, Lucide React Icons, Sonner, Next Image Optimization  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, REST API with structured error handling

## Features
- Secure JWT-based Authentication  
- Role-Based Access (User / Admin)  
- Admin Dashboard for product and user management  
- CRUD operations for products  
- Shopping Cart and Wishlist functionality  
- Responsive, optimized UI  
- Environment-based configuration for development and production

## Folder Structure
.
├── app/                # Next.js app router pages and layouts  
├── components/  
│   ├── ui/             # Shadcn UI components  
│   └── custom/         # Custom reusable UI components  
├── lib/                # Database and utility functions  
├── model/              # Mongoose models  
├── public/             # Static assets  
├── .env.example        # Example environment configuration  
├── package.json  
├── next.config.js  
└── README.md  

## Environment Variables
Create a `.env.local` file in the root directory and add:  
NEXT_PUBLIC_BASE_URL=http://localhost:3000  
MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

## Setup Instructions
1. Clone the repository  
   git clone https://github.com/<your-username>/<your-repo-name>.git  
   cd <your-repo-name>  
2. Install dependencies  
   npm install  
3. Run development server  
   npm run dev  
4. For production build  
   npm run build && npm start  

## Notes
Ensure `NODE_ENV` is set to `production` before deployment. Avoid committing any `.env` files and use `.env.example` as a template for configuration.
