import { useEffect, useState } from "react";

import {
  Container,
  Typography,
  MenuItem,
  Select,
  Box,
} from "@mui/material";

import NotificationCard from "../components/NotificationCard";
import Loader from "../components/Loader";
import { getNotifications } from "../services/notificationService";
import type { Notification } from "../types/notification";

const NotificationsPage = () => {

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("All");
useEffect(() => {

    const fetchData = async () => {

      try {

        const data = await getNotifications();

        setNotifications(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    fetchData();

  }, []);

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter(
          (notification) =>
            notification.Type === filter
        );

  if (loading) {
    return <Loader />;
  }
 return (
    <Container sx={{ marginTop: 4 }}>

      <Typography
        variant="h4"
        sx={{ marginBottom: 3 }}
      >
        Notifications
      </Typography>

      <Box sx={{ marginBottom: 3 }}>

        <Select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Placement">
            Placement
          </MenuItem>
          <MenuItem value="Result">
            Result
          </MenuItem>
          <MenuItem value="Event">
            Event
          </MenuItem>
        </Select>

      </Box>

      {filteredNotifications.map((notification) => (
        <NotificationCard
          key={notification.ID}
          notification={notification}
        />
      ))}

    </Container>
 );
 };

export default NotificationsPage;