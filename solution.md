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