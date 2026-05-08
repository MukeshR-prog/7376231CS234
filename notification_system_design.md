# Campus Notification Platform Solution

# Stage 1
## Overview

The campus notification platform is designed to provide real-time updates to students regarding placements, events, and results. The system supports fetching notifications, filtering notifications, marking notifications as read, and displaying priority notifications.

## REST API Design

### 1. Get All Notifications

#### Endpoint

```http
GET /api/notifications
```

#### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| page | number | Current page number |
| limit | number | Number of notifications |
| notification_type | string | Filter by type |

#### Headers

```json
{
  "Authorization": "Bearer token"
}
```

#### Sample Response

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "type": "Placement",
      "message": "TCS hiring drive",
      "isRead": false,
      "createdAt": "2026-05-08T10:00:00Z"
    }
  ]
}
```
### 2. Mark Notification As Read

#### Endpoint

```http
PATCH /api/notifications/:id/read
```

#### Headers

```json
{
  "Authorization": "Bearer token"
}
```

#### Sample Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```
### 3. Get Priority Notifications

#### Endpoint

```http
GET /api/notifications/priority
```

#### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| limit | number | Number of priority notifications |

#### Sample Response

```json
{
  "success": true,
  "data": [
    {
      "id": "2",
      "type": "Placement",
      "message": "Amazon hiring",
      "priorityScore": 95
    }
  ]
}
```

## Real-Time Notification Mechanism

The application uses Socket.IO for real-time communication between frontend and backend.

### Flow

1. Backend emits notification event.
2. Frontend listens using Socket.IO client.
3. Students instantly receive notifications without refreshing the page.

### Advantages

- Faster updates
- Better user experience
- Reduced repeated API calls
- Real-time synchronization

# Stage 2

## Database Choice

PostgreSQL is selected as the primary database for the notification platform.

### Reasons

1. Structured relational data
2. Better query support
3. Strong indexing support
4. ACID compliance
5. Reliable handling of large notification records
6. Better filtering and pagination support

## Database Schema

### Students Table

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    student_id INT REFERENCES students(id),
    notification_type VARCHAR(20),
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Problems As Data Volume Increases

As the number of students and notifications increases, the following problems may occur:

1. Slow query performance
2. Increased database load
3. Delayed notification fetching
4. Higher memory usage
5. Slower sorting and filtering operations

## Solutions To Improve Performance

1. Add indexes on frequently searched columns
2. Use pagination for notification fetching
3. Use Redis caching for frequently accessed data
4. Use database partitioning for large notification tables
5. Use WebSockets instead of repeated polling

## SQL Queries

### Fetch Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = 1
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
```

### Filter Notifications By Type

```sql
SELECT *
FROM notifications
WHERE notification_type = 'Placement'
AND student_id = 1;
```

### Mark Notification As Read

```sql
UPDATE notifications
SET is_read = true
WHERE id = 'notification-id';
```

### Fetch Priority Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = 1
ORDER BY created_at DESC
LIMIT 10;
```

