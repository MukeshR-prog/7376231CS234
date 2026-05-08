import { useEffect, useState } from "react";

import {
  Container,
  Typography,
} from "@mui/material";

import NotificationCard from "../components/NotificationCard";
import Loader from "../components/Loader";
import { getNotifications } from "../services/notificationService";
import type { Notification } from "../types/notification";

const getWeight = (type: string) => {

  if (type === "Placement") return 3;

  if (type === "Result") return 2;

  return 1;
};

const PriorityPage = () => {

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const data = await getNotifications();

        const sortedNotifications = data.sort(
          (a, b) => {
            const weightDifference =
              getWeight(b.Type) -
              getWeight(a.Type);

            if (weightDifference !== 0) {
              return weightDifference;
            }

            return (
              new Date(b.Timestamp).getTime() -
              new Date(a.Timestamp).getTime()
            );
          }
        );

        setNotifications(
          sortedNotifications.slice(0, 10)
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    fetchData();

  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container sx={{ marginTop: 4 }}>

      <Typography
        variant="h4"
        sx={{ marginBottom: 3 }}
      >
        Priority Notifications
      </Typography>

      {notifications.map((notification) => (
        <NotificationCard
          key={notification.ID}
          notification={notification}
        />
      ))}

    </Container>
  );
};

export default PriorityPage;