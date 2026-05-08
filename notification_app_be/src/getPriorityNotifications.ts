import { Notification } from "./types";

const getWeight = (type: string) => {

  if (type === "Placement") return 3;

  if (type === "Result") return 2;

  return 1;
};

export const getPriorityNotifications = (
  notifications: Notification[]
) => {

  const sortedNotifications = notifications.sort((a, b) => {

    const weightDifference =
      getWeight(b.Type) - getWeight(a.Type);

    if (weightDifference !== 0) {
      return weightDifference;
    }

    return (
      new Date(b.Timestamp).getTime() -
      new Date(a.Timestamp).getTime()
    );
  });

  return sortedNotifications.slice(0, 10);
};