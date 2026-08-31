https://supportdesk-iota.vercel.app/
# SupportDesk

SupportDesk is a REST API for managing users and support tickets.

The project was built as a NoSQL mini project using Node.js, Express, MongoDB, and Mongoose.

The API allows users to create, read, update, and delete users and support tickets.

---

## Features

### Users

- Create users
- Get all users
- Get user by ID
- Update users
- Delete users

### Tickets

- Create tickets
- Get all tickets
- Get ticket by ID
- Update tickets
- Delete tickets
- Filter tickets by status
- Filter tickets by priority
- Search tickets
- Sort tickets
- Pagination

### API

- REST API
- JSON responses
- HTTP status codes
- Global error handling
- 404 handling
- Request logging
- CORS support

---

## Technologies

- Node.js
- Express
- MongoDB
- MongoDB Atlas
- Mongoose
- CORS
- Nodemon

---

## Project Structure

```text
backend/
├── src/
│   ├── controllers/
│   │   ├── ticketController.js
│   │   └── userController.js
│   │
│   ├── database/
│   │   └── connectDB.js
│   │
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── notFound.js
│   │
│   ├── models/
│   │   ├── TicketModel.js
│   │   └── UserModel.js
│   │
│   ├── routes/
│   │   ├── ticketRoutes.js
│   │   └── userRoutes.js
│   │
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── README.md
└── requests.md
```

The project follows an MVC-style structure by separating models, controllers, routes, middleware, and database configuration.

---

## Installation

Install the dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

Do not commit the `.env` file to GitHub.

---

## Start Development Server

```bash
npm run dev
```

The API runs by default on:

```text
http://localhost:3000
```

---

# API Endpoints

## Users

| Method | Endpoint     | Description   |
| ------ | ------------ | ------------- |
| GET    | `/users`     | Get all users |
| GET    | `/users/:id` | Get one user  |
| POST   | `/users`     | Create a user |
| PUT    | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

---

### Create User

**Request**

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Max Mustermann",
  "email": "max@example.com"
}
```

**Example Response**

```json
{
  "success": true,
  "data": {
    "_id": "USER_ID",
    "name": "Max Mustermann",
    "email": "max@example.com"
  }
}
```

---

### Get All Users

```http
GET /users
```

Example response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "USER_ID",
      "name": "Max Mustermann",
      "email": "max@example.com"
    }
  ]
}
```

---

### Get User by ID

```http
GET /users/USER_ID
```

---

### Update User

**Request**

```http
PUT /users/USER_ID
Content-Type: application/json
```

```json
{
  "name": "Max Mustermann",
  "email": "max@example.com"
}
```

---

### Delete User

```http
DELETE /users/USER_ID
```

---

# Tickets

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | `/tickets`     | Get all tickets |
| GET    | `/tickets/:id` | Get one ticket  |
| POST   | `/tickets`     | Create a ticket |
| PUT    | `/tickets/:id` | Update a ticket |
| DELETE | `/tickets/:id` | Delete a ticket |

---

### Create Ticket

**Request**

```http
POST /tickets
Content-Type: application/json
```

```json
{
  "title": "Login Problem",
  "message": "Ich kann mich nicht anmelden",
  "email": "max@example.com",
  "status": "open",
  "priority": "high"
}
```

**Example Response**

```json
{
  "success": true,
  "data": {
    "_id": "TICKET_ID",
    "title": "Login Problem",
    "message": "Ich kann mich nicht anmelden",
    "email": "max@example.com",
    "status": "open",
    "priority": "high"
  }
}
```

---

### Get All Tickets

```http
GET /tickets
```

Example response:

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1,
  "data": [
    {
      "_id": "TICKET_ID",
      "title": "Login Problem",
      "message": "Ich kann mich nicht anmelden",
      "email": "max@example.com",
      "status": "open",
      "priority": "high"
    }
  ]
}
```

---

### Get Ticket by ID

```http
GET /tickets/TICKET_ID
```

---

### Update Ticket

**Request**

```http
PUT /tickets/TICKET_ID
Content-Type: application/json
```

```json
{
  "title": "Login Problem",
  "message": "Das Problem wird bearbeitet",
  "email": "max@example.com",
  "status": "in-progress",
  "priority": "high"
}
```

---

### Delete Ticket

```http
DELETE /tickets/TICKET_ID
```

---

# Ticket Filtering

Filter by status:

```http
GET /tickets?status=open
```

Filter by priority:

```http
GET /tickets?priority=high
```

Combine filters:

```http
GET /tickets?status=open&priority=high
```

---

# Ticket Search

```http
GET /tickets?search=login
```

The search checks ticket titles and messages.

---

# Ticket Sorting

Newest tickets first:

```http
GET /tickets?sort=newest
```

Oldest tickets first:

```http
GET /tickets?sort=oldest
```

---

# Pagination

```http
GET /tickets?page=1&limit=10
```

Example response:

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 3,
  "totalPages": 1,
  "data": []
}
```

The maximum page limit is `50`.

---

# Combined Query

Filters, search, sorting, and pagination can be combined.

Example:

```http
GET /tickets?status=open&priority=high&search=login&sort=newest&page=1&limit=10
```

---

# Ticket Status

Available values:

```text
open
in-progress
closed
```

---

# Ticket Priority

Available values:

```text
low
medium
high
```

---

# Error Handling

The API returns JSON error responses.

Example:

```json
{
  "success": false,
  "message": "Invalid ID"
}
```

Common HTTP status codes:

```text
200 OK
201 Created
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error
```

---

# Additional API Examples

More curl examples are available in:

```text
requests.md
```

---

# Frontend

SupportDesk also includes a React frontend for managing users and support tickets through a graphical interface.

The frontend includes:

- Dashboard
- Ticket management
- User management
- Search and filtering
- Responsive design
- Light and dark mode

The frontend communicates with the SupportDesk REST API.

---

# Team Members

- Feras — Individual Project
