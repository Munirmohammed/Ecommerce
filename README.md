# E-commerce Platform Backend

A comprehensive REST API for an e-commerce platform built with Node.js, TypeScript, Express, and PostgreSQL.

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
git clone <https://github.com/Munirmohammed/Ecommerce.git>
cd ecommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing
- `REDIS_URL`: Redis connection string (optional)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: For image uploads (optional)

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

### Docker Setup

Run the entire stack with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- API server on port 3000

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
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Technology Choices

**TypeScript**: Type safety reduces bugs and improves developer experience.

**Prisma**: Modern ORM with excellent TypeScript support and migration tooling.

**Zod**: Runtime validation with TypeScript inference for request validation.

**Redis**: Fast in-memory caching for frequently accessed data like product listings.

**Docker**: Ensures consistent development and deployment environments.

## License

ISC
