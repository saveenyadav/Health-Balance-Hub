# Health Balance Hub - API Endpoints

## Server Information

- **Base URL:** `http://localhost:5001`
- **Environment:** Development
- **Server Port:** 5001

## Authentication Endpoints

### Public Endpoints (No Authentication Required)

#### Register New User

```http
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Endpoints (Require JWT Token)

#### Logout User

```http
POST http://localhost:5001/api/auth/logout
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

#### Get Current User Profile

```http
GET http://localhost:5001/api/auth/user-profile
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

#### Update User Details

```http
PUT http://localhost:5001/api/auth/updatedetails
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YWQ4YjM4NzM3Mjc4OTRlNWM1N2E3MSIsImlhdCI6MTc1NjIwNDA3NywiZXhwIjoxNzU2ODA4ODc3fQ.genEIjt3mPdAF1zLPO8SNcLben9PZ8x-szYyeGBOX2c
Content-Type: application/json

{
  "name": "Updated Test Client",
  "email": "updatedclient@example.com"
}
```

#### Update User Password

```http
PUT http://localhost:5001/api/auth/updatepassword
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YWQ4YjM4NzM3Mjc4OTRlNWM1N2E3MSIsImlhdCI6MTc1NjIwNDA3NywiZXhwIjoxNzU2ODA4ODc3fQ.genEIjt3mPdAF1zLPO8SNcLben9PZ8x-szYyeGBOX2c
Content-Type: application/json

{
  "currentPassword": "password2025",
  "newPassword": "newpassword456"
}

```

## Test Endpoints

#### Basic API Test

```http
GET http://localhost:5001/api/test
```

#### Error Handler Test

```http
GET http://localhost:5001/api/test-error
```

## Response Examples

### Successful Registration/Login

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f2a...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---
