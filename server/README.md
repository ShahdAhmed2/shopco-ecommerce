# SHOP.CO Backend

Backend API service for SHOP.CO build with Node.js, Express, and MongoDB.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security & Optimization**: Helmet, CORS, Compression
- **Logger**: Morgan

## Getting Started

### Prerequisites
- Node.js (>=18.x)
- MongoDB running locally or MongoDB Atlas connection string

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   Ensure `.env` contains correct connection properties.

### Run Server
- Start production server:
  ```bash
  npm start
  ```

- Start development server (with nodemon reload):
  ```bash
  npm run dev
  ```
