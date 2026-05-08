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

# Stage 4

## Problem Overview

Currently, notifications are fetched from the database every time a student loads the page.

As the number of students and notifications increases, the database receives a very large number of repeated requests, causing high load and slower response times.

## Main Problems

1. Increased database load
2. Repeated execution of the same queries
3. Slower API response time
4. Poor user experience
5. Increased server resource usage

## Solutions To Improve Performance

### 1. Pagination

Notifications should be fetched in smaller batches instead of loading all records at once.

Example:

- 10 notifications per request
- Infinite scrolling or page-based loading

### Advantages

- Reduced database load
- Faster API response
- Better frontend performance
- Lower memory usage

### 2. Redis Caching

Frequently accessed notification data can be stored temporarily in Redis cache.

Instead of querying the database repeatedly, the backend first checks Redis cache.

### Advantages

- Faster response time
- Reduced database traffic
- Better scalability

### 3. Real-Time Updates Using Socket.IO

Instead of repeatedly fetching notifications from the server, the frontend can receive new notifications instantly using Socket.IO.

This reduces unnecessary polling requests to the backend.

### Advantages

- Real-time notification delivery
- Reduced repeated API calls
- Better user experience

### 4. Database Indexing

Indexes should be added on frequently searched columns such as:

- student_id
- notification_type
- created_at
- is_read

This helps the database fetch records more efficiently.

### 5. Archiving Old Notifications

Very old notifications can be moved to archive tables or cold storage.

This keeps the active notifications table smaller and improves query performance.

## Tradeoffs Of Each Solution

### Pagination Tradeoffs

Advantages:
- Lower server load
- Faster response time

Disadvantages:
- Multiple API calls required for more data
- Slightly more frontend logic needed

### Redis Caching Tradeoffs

Advantages:
- Very fast data access
- Reduced database usage

Disadvantages:
- Additional infrastructure required
- Cache invalidation complexity
- Increased memory usage

### Socket.IO Tradeoffs

Advantages:
- Instant updates
- Reduced polling

Disadvantages:
- Persistent socket connections required
- More backend complexity
- Increased server memory usage

### Database Indexing Tradeoffs

Advantages:
- Faster query execution
- Improved filtering and sorting

Disadvantages:
- Increased storage usage
- Slower INSERT and UPDATE operations

## Recommended Final Approach

The best approach is to combine multiple strategies:

1. Use pagination for fetching notifications
2. Use Redis caching for frequently accessed data
3. Use Socket.IO for real-time updates
4. Use proper database indexing
5. Archive old notification records

This combination improves scalability, reduces database load, and provides a better user experience.

# Stage 5

## Problems In Current Implementation

1. Notifications are processed sequentially
2. One failure can interrupt the entire process
3. Sending emails for 50,000 students is very slow
4. No retry mechanism exists
5. High server load during bulk notifications

## Problem When Email Sending Fails

If the email service fails midway, some students may receive notifications while others may not.

This creates inconsistent system behavior and unreliable notification delivery.

## Improved Solution

The notification system should use asynchronous background job processing using queues and workers.

## Recommended Flow

1. HR clicks "Notify All"
2. Notification jobs are added to a queue
3. Workers process jobs asynchronously
4. Database stores notification
5. Email service sends emails
6. Socket.IO pushes real-time notifications
7. Failed jobs are retried automatically

## Advantages Of Queue-Based Processing

- Faster bulk processing
- Better scalability
- Retry support
- Reduced API response time
- Improved reliability

## Should Database Save And Email Sending Happen Together?

No.

Saving notifications to the database and sending emails should be handled independently.

The database operation is critical because notifications must always be stored reliably.

Email delivery can happen asynchronously through background workers and retries.

## Revised Pseudocode

```javascript
function notifyAllStudents(studentIds, message) {

    for (const studentId of studentIds) {

        queue.add({
            studentId,
            message
        });

    }
}
```

```javascript
worker.process(async (job) => {

    saveNotificationToDB(job.studentId, job.message);

    sendEmail(job.studentId, job.message);

    pushRealtimeNotification(job.studentId, job.message);

});
```

## Retry Mechanism

Failed jobs should automatically retry after a delay.

This improves reliability during temporary email service failures.

## Summary

Using queues, workers, retries, and asynchronous processing improves scalability, reliability, and notification delivery performance for large-scale systems.

# Stage 6

## Priority Notification Logic

Notifications are prioritized based on:

- notification type
- recency

Priority Order:

- Placement
- Result
- Event

The system sorts notifications using notification priority and latest timestamp, then returns the top 10 notifications.

## Efficient Top 10 Maintenance

For large-scale systems, a Min Heap or Priority Queue can be used to efficiently maintain the top 10 notifications when new notifications arrive continuously.