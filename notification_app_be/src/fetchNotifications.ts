import axios from "axios";
import dotenv from "dotenv";
import { Notification } from "./types";

dotenv.config();

const TOKEN = process.env.TOKEN;

export const fetchNotifications = async (): Promise<Notification[]> => {

  const response = await axios.get(
    "http://4.224.186.213/evaluation-service/notifications",
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );

  return response.data.notifications;
};