# E-commerce Platform Backend

A comprehensive REST API for an e-commerce platform built with Node.js, TypeScript, Express, and PostgreSQL.

[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-blueviolet.svg)](https://prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docker.com/)

## Quick Start

The fastest way to get started is with Docker:

```bash
# Clone the repository
git clone https://github.com/Munirmohammed/Ecommerce.git
cd ecommerce

# Start the entire stack (database, cache, and API)
docker-compose up --build

# The API will be available at http://localhost:3000
# API Documentation: http://localhost:3000/api-docs
```

Test credentials:
- **Admin**: admin@ecommerce.com / Admin@123
- **User**: user@ecommerce.com / User@123

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5+
- **Framework**: Express.js
- **Database**: PostgreSQL 16 with Prisma ORM
- **Caching**: Redis
- **Authentication**: JWT with bcrypt
- **Validation**: Zod
- **File Upload**: Cloudinary
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 20 or higher
- Docker and Docker Compose (for containerized setup)
- PostgreSQL 16 (if running locally without Docker)
- Redis (optional, for caching)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Munirmohammed/Ecommerce.git
cd ecommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and update with your values:

```bash
# On Linux/Mac
cp .env.example .env

# On Windows
copy .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing
- `REDIS_URL`: Redis connection string (optional)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: For image uploads (optional)

> **Note**: For Cloudinary integration, you need to create a free account at [Cloudinary](https://cloudinary.com/) and obtain your API credentials.

### 4. Database Setup

Run database migrations:

```bash
npm run prisma:migrate
```

Generate Prisma client:

```bash
npm run prisma:generate
```

### 5. Seed the database (optional)

Add sample data including admin and test users:

```bash
npm run prisma:seed
```

Test credentials after seeding:
- **Admin**: admin@ecommerce.com / Admin@123
- **User**: user@ecommerce.com / User@123

### 6. Run the application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

### Docker Setup (Recommended for Testing)

Run the entire stack with Docker Compose (includes automatic migrations and seeding):

```bash
docker-compose up --build
```

This will:
1. Build the application image
2. Start PostgreSQL database on port 5432
3. Start Redis cache on port 6379
4. Run database migrations automatically
5. Seed the database with test data
6. Start the API server on port 3000

**Test credentials after Docker setup:**
- **Admin**: admin@ecommerce.com / Admin@123
- **User**: user@ecommerce.com / User@123

**Access the API:**
- API Base URL: http://localhost:3000/api
- API Documentation: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health

**Stop the services:**
```bash
docker-compose down
```

**Stop and remove volumes (clean slate):**
```bash
docker-compose down -v
```

## API Documentation

The API follows RESTful conventions and returns JSON responses.

### Base URL
```
http://localhost:3000/api
```

### Response Format

**Standard Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "errors": null
}
```

**Paginated Response:**
```json
{
  "success": true,
  "message": "Products retrieved",
  "data": [],
  "pageNumber": 1,
  "pageSize": 10,
  "totalSize": 100,
  "errors": null
}
```

### Product Image Upload

Products support image uploads in two ways:
1. **Multipart Form-Data**: Upload an image file directly when creating/updating a product
2. **Image URL**: Provide an `imageUrl` field with a public image URL

The API automatically processes and optimizes uploaded images using Cloudinary.

### Testing with Postman

As an alternative to Swagger, you can test the APIs using the provided Postman collection. Simply import the `Ecommerce_API_Postman_Collection.json` file into Postman to get started with pre-configured requests for all endpoints, including authentication, product management, and order processing.

## Project Structure

```
src/
├── config/          # Configuration files (database, redis, env)
├── middleware/      # Express middleware (auth, validation, error handling)
├── routes/          # API route definitions
├── controllers/     # Request handlers
├── services/        # Business logic layer
├── utils/           # Helper functions
├── types/           # TypeScript type definitions
└── index.ts         # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with test data
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode

## Technology Choices

**TypeScript**: Type safety reduces bugs and improves developer experience.

**Prisma**: Modern ORM with excellent TypeScript support and migration tooling.

**Zod**: Runtime validation with TypeScript inference for request validation.

**Redis**: Fast in-memory caching for frequently accessed data like product listings.

**Docker**: Ensures consistent development and deployment environments.

**Cloudinary**: Cloud-based image management with automatic optimization and transformation.

**Swagger**: Interactive API documentation for easy integration and testing.

## License

ISC
