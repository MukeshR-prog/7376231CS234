import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

const TOKEN = process.env.TOKEN;

app.get("/notifications", async (req, res) => {

  console.log("route hit");

  try {

    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    console.log("api success");

    const notifications =
      response.data.notifications;

    res.status(200).json(notifications);

  } catch (error: any) {

    console.log("FULL ERROR START");

    console.log(error);

    console.log("FULL ERROR END");

    res.status(500).json({
      message: "backend failed"
    });
  }
});

app.get("/", (req, res) => {

  res.send("backend running");

});

app.listen(5000, () => {

  console.log("server running on port 5000");

});