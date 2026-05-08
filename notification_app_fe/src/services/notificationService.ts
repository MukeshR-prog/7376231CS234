import axios from "axios";

import type { Notification }
  from "../types/notification";

export const getNotifications =
  async (): Promise<Notification[]> => {

    const response = await axios.get(
      "http://localhost:5000/notifications"
    );

    return response.data;
};

