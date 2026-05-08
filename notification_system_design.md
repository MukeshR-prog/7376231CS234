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

# Stage 3

## Existing Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

## Is The Query Accurate?

Yes, the query is logically accurate because it correctly fetches unread notifications for a specific student and sorts them by creation time.

However, the query becomes slow when the notification table grows to millions of records.

## Why Is The Query Slow?

The database contains around:

- 50,000 students
- 5,000,000 notifications

Without proper indexing, the database performs a full table scan to find matching rows.

The sorting operation using `ORDER BY createdAt` also increases execution time because the database must sort a large number of records before returning results.

## Main Performance Problems

1. Full table scan
2. Expensive sorting operation
3. Large dataset size
4. Increased disk reads
5. Higher query execution time

## Query Optimization

### Recommended Composite Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(student_id, is_read, created_at);
```

## Why This Index Improves Performance

The query filters notifications using:

- student_id
- is_read

and sorts results using:

- created_at

The composite index helps the database quickly locate matching rows without scanning the entire table.

It also reduces sorting cost because the data is already partially ordered inside the index.

## Likely Computation Cost

Without indexes:

- Time Complexity: O(n)

The database scans the entire notifications table.

With composite indexing:

- Time Complexity: Approximately O(log n)

The database directly accesses matching indexed rows, reducing execution time significantly.

## Should Indexes Be Added On Every Column?

No, adding indexes on every column is not an effective solution.

Excessive indexes can create several problems:

1. Increased storage usage
2. Slower INSERT and UPDATE operations
3. Higher index maintenance cost
4. Reduced write performance

Indexes should only be added on frequently searched, filtered, or sorted columns.

## Query To Fetch Students Who Received Placement Notifications In The Last 7 Days

```sql
SELECT DISTINCT student_id
FROM notifications
WHERE notification_type = 'Placement'
AND created_at >= NOW() - INTERVAL '7 days';
```

## Summary

The main reason for slow query performance is the increasing volume of notification data combined with missing indexes.

Using proper composite indexing, pagination, and optimized filtering can significantly improve query execution time and overall database performance.

