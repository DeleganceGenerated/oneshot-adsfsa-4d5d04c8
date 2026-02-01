# adsfsa-app

Express.js MVP application with SQLite database for managing users and items.

## Features

- REST API with full CRUD operations for users and items
- SQLite database with automatic table creation
- Environment variable configuration
- Health monitoring endpoints
- CORS enabled for cross-origin requests
- Error handling middleware

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on port 3000 (or PORT environment variable).

## API Endpoints

### Health & Info
- `GET /` - Welcome message and server status
- `GET /health` - Health check endpoint

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (requires: name, email)
- `PUT /api/users/:id` - Update user (requires: name, email)
- `DELETE /api/users/:id` - Delete user

### Items
- `GET /api/items` - Get all items (with user info)
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item (requires: title; optional: description, user_id)
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - SQLite database file path

## Database

Uses SQLite with automatic table creation on startup:
- `users` table: id, name, email, created_at, updated_at
- `items` table: id, title, description, user_id, created_at, updated_at

## Example Usage

```bash
# Create a user
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}' \
  http://localhost:3000/api/users

# Create an item
curl -X POST -H "Content-Type: application/json" \
  -d '{"title":"My Item","description":"Item description","user_id":1}' \
  http://localhost:3000/api/items

# Get all items
curl http://localhost:3000/api/items
```