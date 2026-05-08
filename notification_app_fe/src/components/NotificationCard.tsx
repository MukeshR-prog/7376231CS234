import {
  Card,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";

import type { Notification } from "../types/notification";

interface Props {
  notification: Notification;
}

const NotificationCard = ({ notification }: Props) => {

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
     <Chip
          label={notification.Type}
          sx={{ marginBottom: 1 }}
        />

        <Typography variant="h6">
          {notification.Message}
        </Typography>

        <Typography variant="body2">
          {notification.Timestamp}
        </Typography>

      </CardContent>
    </Card>
  );
};

export default NotificationCard;