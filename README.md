# Kongoo API

Kongoo API is a Node.js and Express-based backend for a simple e-commerce platform. It handles user authentication, product catalog management, and merchant order confirmation with MongoDB persistence through Mongoose.

The project is designed for learning and production-style backend architecture, with structured controllers, secure JWT authentication, cloud image uploads, and modular route organization.

## Project Overview

This API supports the core flow of an online marketplace:

- Users can register and sign in securely
- Merchants can create and manage products
- Shoppers can browse all available products or a single product
- Merchants can view their own product performance dashboard
- Customers can confirm orders and reduce stock automatically
- Product images can be uploaded to Cloudinary

## Business Flow

1. A user registers or logs in.
2. The server validates the credentials and issues a JWT.
3. Authenticated users can create, update, or delete their products.
4. Public product endpoints allow search and catalog browsing.
5. A confirmed order validates stock availability and updates product quantities and sold counts.
6. MongoDB stores user, product, and order records securely.

## Architecture

The backend follows a clean layered structure:

- Routes define API endpoints
- Controllers contain request/response logic
- Models define database schemas
- Middleware handles JWT protection and file uploads
- Configuration manages MongoDB connection and environment variables

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cloudinary
- Multer
- CORS
- dotenv

## Features

- Secure user registration and login
- Password hashing with bcrypt
- JWT-based access control
- Product creation, listing, update, and deletion
- Merchant-specific product listing
- Search and category filtering on products
- Cloudinary-powered image upload support
- Stock validation before order confirmation
- Automatic sales tracking on products
- MongoDB integration with Mongoose models

## Project Structure

```text
COHORT6_E-COMMERCE/
├── configuration/
│   └── database.js
├── controller/
│   ├── orderController.js
│   ├── productController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
├── model/
│   ├── orderModel.js
│   ├── productModel.js
│   └── userModel.js
├── router/
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository.
2. Open the project directory.
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the project root and configure the required variables.
5. Start the server:

```bash
npm start
```

For development mode:

```bash
npm run dev
```

## Environment Variables

Create a `.env` file with the following values:

```env
PORT=3001
LIVE_URL=your_mongodb_connection_string
LOCAL_URL=mongodb://localhost:27017/COHORT6_ECOMMERCE
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Variable Explanation

- `PORT`: Port where the Express server runs
- `LIVE_URL`: Remote MongoDB connection string for production or hosted database
- `LOCAL_URL`: Local MongoDB URL for development
- `JWT_SECRET`: Secret used to sign authentication tokens
- `CLOUDINARY_*`: Credentials for storing product images in Cloudinary

## Authentication

Protected routes require a valid JWT in the Authorization header.

```http
Authorization: Bearer <token>
```

The token is generated during registration or login and is verified in the `protect` middleware.

## API Documentation

Base URL:

```text
http://localhost:3001
```

### 1. User Routes

#### Register user

```http
POST /api/users/register
Content-Type: application/json
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Response example:

```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "64f9...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-09-13T00:00:00.000Z",
    "updatedAt": "2026-09-13T00:00:00.000Z"
  }
}
```

#### Login user

```http
POST /api/users/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response example:

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "64f9...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Product Routes

#### Get all products

```http
GET /api/products/
```

Optional query params:

- `search`: Search by product name
- `category`: Filter by category

Example:

```http
GET /api/products/?search=laptop&category=electronics
```

#### Get single product by ID

```http
GET /api/products/:id
```

#### Get merchant product dashboard

```http
GET /api/products/merchant/my-products
Authorization: Bearer <token>
```

Response includes each product's image, remaining stock, sold count, and revenue estimate.

#### Create product

```http
POST /api/products/create
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Form fields:

- `productName` (required)
- `description`
- `price` (required)
- `quantity` (required)
- `category` (required)
- `productImage` (optional file upload)

Example:

```http
POST /api/products/create
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Form data:

```text
productName: Dell Inspiron
description: 14-inch business laptop
price: 1200
quantity: 10
category: electronics
productImage: <image file>
```

#### Update product

```http
PUT /api/products/update/:id
Authorization: Bearer <token>
Content-Type: application/json
```

Example payload:

```json
{
  "productName": "Dell Inspiron 14",
  "description": "Updated business laptop",
  "price": 1250,
  "quantity": 8,
  "productImage": "https://example.com/image.jpg"
}
```

#### Delete product

```http
DELETE /api/products/delete/:id
Authorization: Bearer <token>
```

### 3. Order Routes

#### Confirm order

```http
POST /api/orders/confirm
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "items": [
    {
      "productId": "64f9d8b4d3f12d2b5e7abc99",
      "quantity": 2
    },
    {
      "productId": "64f9d8c5d3f12d2b5e7abc88",
      "quantity": 1
    }
  ]
}
```

Behavior:

- Checks that each product exists
- Validates stock availability
- Deducts purchased quantity from stock
- Increases the product sold count
- Creates an order record with total amount

## Response Status Codes

Common responses in this API:

- `200 OK` - Successful GET or update request
- `201 Created` - Resource successfully created
- `400 Bad Request` - Missing required fields or invalid payload
- `401 Unauthorized` - Invalid or missing JWT
- `403 Forbidden` - User is not allowed to modify another merchant's product
- `404 Not Found` - Product or user not found
- `409 Conflict` - Duplicate user registration
- `500 Internal Server Error` - Server-side exception

## Example Full Flow

```text
Client -> POST /api/users/register
        -> Server validates input and hashes password
        -> MongoDB stores new user
        -> JWT returned to client

Client -> POST /api/products/create with bearer token
        -> Middleware verifies token
        -> Controller validates required fields
        -> Cloudinary uploads image if provided
        -> Product stored in MongoDB

Client -> POST /api/orders/confirm
        -> Middleware verifies token
        -> Order controller validates stock
        -> Product quantities are reduced
        -> Order record is created
```

## Notes

This project is a strong foundation for an MVP e-commerce backend. It can be extended with:

- Cart management
- Admin dashboards
- Order history and status tracking
- Payment integration
- User roles and permissions
- Pagination and filtering for large catalogs

## License

This project is currently distributed under the ISC license as defined in the package metadata.
