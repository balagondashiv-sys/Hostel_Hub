# HostelHub — API Reference

## Base URL
- Local Development: `http://localhost:5000/api`

## Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error format:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## System Health

### `GET /api/health`
- **Description**: Public health check.
- **Response**:
```json
{
  "success": true,
  "message": "HostelHub API is operational",
  "data": {
    "status": "ok",
    "service": "hostelhub-api",
    "timestamp": "2026-08-09T22:30:00.000Z",
    "uptime": 120.45,
    "environment": "development"
  }
}
```

## Authentication

### `POST /api/auth/register`
- **Body**: `{ "email": "...", "password": "...", "name": "...", "role": "STUDENT" }`

### `POST /api/auth/login`
- **Body**: `{ "email": "...", "password": "..." }`
- **Response**: `{ "token": "...", "user": {...} }`

### `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Active user payload.
