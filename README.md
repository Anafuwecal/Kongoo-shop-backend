# COHORT6 E-Commerce API

This project is a simple backend API for an e-commerce application built with Node.js, Express, MongoDB, and Mongoose. It provides authentication for users and CRUD functionality for products, making it a good foundation for a full-stack shopping platform.

## Project Overview

The application allows users to:
- Register and log in securely
- Create, view, update, and delete products
- Protect product management routes with JSON Web Tokens (JWT)
- Connect to a MongoDB database using Mongoose

This project was built as a learning-focused backend example to practice routing, authentication, database models, and API design.

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication for protected routes
- Product CRUD operations
- Product ownership checks for update and delete actions
- MongoDB connection via Mongoose
- CORS support for frontend integration

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcrypt
- dotenv
- cors

## Project Structure

- index.js - Main server entry point
- configuration/database.js - Database connection setup
- controller/ - Handles request logic for users and products
- middleware/authMiddleware.js - JWT authentication middleware
- model/ - Mongoose schemas and models
- router/ - API route definitions

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the project root and add your environment variables
4. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a .env file with the following values:

```env
PORT=3001
LIVE_URL=your_mongodb_connection_string
LOCAL_URL=mongodb://localhost:27017/COHORT6_ECOMMERCE
JWT_SECRET=your_secret_key
```

## API Endpoints

### Authentication

- POST /api/register - Register a new user
- POST /api/login - Log in an existing user

### Products

- GET /api/get - Get all products
- GET /api/get/:id - Get a single product by ID
- POST /api/create - Create a new product (requires authentication)
- PUT /api/update/:id - Update a product (requires authentication)
- DELETE /api/delete/:id - Delete a product (requires authentication)

### Authentication Header

For protected routes, include a bearer token in the Authorization header:

```http
Authorization: Bearer <token>
```

## Example Request

### Register User

```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Create Product

```http
POST /api/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "productName": "Laptop",
  "description": "A powerful laptop",
  "price": 1200,
  "productImage": "https://example.com/laptop.jpg",
  "quantity": 10
}
```

## Notes

This API is a solid starting point for building a full e-commerce backend. It can be extended with features such as cart management, order processing, admin controls, image upload, and pagination.
