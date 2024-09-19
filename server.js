// server.js

const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// VAPID keys setup
const vapidKeys = {
  publicKey: process.env.PUBLIC_VAPID_KEY,
  privateKey: process.env.PRIVATE_VAPID_KEY,
};

webpush.setVapidDetails(
  "mailto:POKHRELSUMIT36@GMAIL.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// In-memory storage for subscriptions (replace with a database in production)
let subscriptions = [];

// Save subscription
app.post("/api/save-subscription", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription saved" });
});

// Send notification
app.post("/api/send-notification", async (req, res) => {
  const payload = {
    title: "New Notification",
    body: "This is a test notification",
    icon: "/path/to/icon.png",
    data: {
      url: "http://localhost:3000/",
    },
  };

  try {
    await Promise.all(
      subscriptions.map((subscription) =>
        webpush.sendNotification(subscription, JSON.stringify(payload))
      )
    );
    res.status(200).json({ message: "Notifications sent successfully." });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Failed to send notifications." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
