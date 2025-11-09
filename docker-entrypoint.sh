#!/bin/sh
set -e

echo "Waiting for postgres..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npm run prisma:seed

echo "Starting server..."
exec npm start
