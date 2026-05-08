import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const TOKEN = process.env.TOKEN;
export const Log = async (
  stack: string,
  level: string,
  pkg: string,
  message: string
) => {
  try {
    const res = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.log(err);
  }
};