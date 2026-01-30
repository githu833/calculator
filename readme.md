# Capitalize Pro | Premium Interest Calculator 📈

Capitalize Pro is a high-end financial interest calculator built with a **Next-Gen Fintech Aesthetic**. It supports both Simple and Compound interest, features a permanent transaction history, and is fully responsive for all devices.

## 🚀 Live Deployment Instructions

To get this app running on the web for free, follow these simple steps:

### 1. Database Setup (MongoDB Atlas)
1.  Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Deploy a free "Shared Cluster".
3.  Go to **Database Access** and create a user with a password.
4.  Go to **Network Access** and add `0.0.0.0/0` (Allow Access from Anywhere).
5.  Click **Connect** -> **Connect your application** and copy the Connection String.

### 2. Hosting (Render.com)
1.  Create an account at [Render.com](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect this GitHub repository.
4.  **Runtime**: Node
5.  **Build Command**: `npm run build`
6.  **Start Command**: `npm start`

### 3. Environment Variables (Critical)
In Render, click on **Environment** and add:
-   `MONGODB_URI`: (Paste your MongoDB connection string here)
-   `PORT`: `5000`

---

## 🛠️ Local Development
1. Clone the repo.
2. Run `npm install` in both `/frontend` and `/backend`.
3. Start the dev servers using `run_all.bat`.

## ✨ Features
- **INR (₹) Standard**: Supports Indian numbering and currency format.
- **Copy-to-Clipboard**: Click any result card to copy the value.
- **Glassmorphism UI**: High-end visual depth and micro-animations.
- **History Modal**: Toggleable log of all previous calculations.

*Built by Antigravity*
