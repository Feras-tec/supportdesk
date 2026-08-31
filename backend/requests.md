# SupportDesk API Requests

Base URL:

http://localhost:3000

---

## Users

### Get all users

GET /users

Example:

curl -i http://localhost:3000/users

---

### Get user by ID

GET /users/:id

Example:

curl -i http://localhost:3000/users/USER_ID

---

### Create user

POST /users

Example:

curl -i -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{
"name": "Max Mustermann",
"email": "max@example.com"
}'

---

### Update user

PUT /users/:id

Example:

curl -i -X PUT http://localhost:3000/users/USER_ID \
-H "Content-Type: application/json" \
-d '{
"name": "Max Mustermann",
"email": "max@example.com"
}'

---

### Delete user

DELETE /users/:id

Example:

curl -i -X DELETE http://localhost:3000/users/USER_ID

---

# Tickets

### Get all tickets

GET /tickets

Example:

curl -i http://localhost:3000/tickets

---

### Get ticket by ID

GET /tickets/:id

Example:

curl -i http://localhost:3000/tickets/TICKET_ID

---

### Create ticket

POST /tickets

Example:

curl -i -X POST http://localhost:3000/tickets \
-H "Content-Type: application/json" \
-d '{
"title": "Login Problem",
"message": "Ich kann mich nicht anmelden",
"email": "max@example.com",
"status": "open",
"priority": "high"
}'

---

### Update ticket

PUT /tickets/:id

Example:

curl -i -X PUT http://localhost:3000/tickets/TICKET_ID \
-H "Content-Type: application/json" \
-d '{
"title": "Login Problem",
"message": "Das Problem wird bearbeitet",
"email": "max@example.com",
"status": "in-progress",
"priority": "high"
}'

---

### Delete ticket

DELETE /tickets/:id

Example:

curl -i -X DELETE http://localhost:3000/tickets/TICKET_ID

---

# Ticket Filtering

By status:

GET /tickets?status=open

By priority:

GET /tickets?priority=high

Combined:

GET /tickets?status=open&priority=high

---

# Ticket Search

GET /tickets?search=login

---

# Ticket Sorting

Newest first:

GET /tickets?sort=newest

Oldest first:

GET /tickets?sort=oldest

---

# Pagination

GET /tickets?page=1&limit=10

Example response:

{
"success": true,
"page": 1,
"limit": 10,
"total": 3,
"totalPages": 1,
"data": []
}

Maximum limit: 50

---

# Combined Query

Example:

GET /tickets?status=open&priority=high&search=login&sort=newest&page=1&limit=10

---

# Status Codes

200 - OK
201 - Created
400 - Bad Request
404 - Not Found
409 - Conflict
500 - Internal Server Error
