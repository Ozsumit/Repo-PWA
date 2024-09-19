import { NextApiRequest, NextApiResponse } from "next";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:POKHRELSUMIT36@GMAIL.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { subscription, message } = req.body;

    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "Test Notification",
          body: message,
          icon: "/icon.png",
        })
      );
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending push notification:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to send notification" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
