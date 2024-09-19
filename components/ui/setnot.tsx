import React, { useState, useEffect } from "react";

// Define types for subscription and message
type Subscription = PushSubscription | null;

const Notifications: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription>(null);
  const [message, setMessage] = useState<string>("");
  const isSupported = "serviceWorker" in navigator && "PushManager" in window;

  // Utility function to convert base64 string to Uint8Array
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    // Remove any characters that are not part of the base64 alphabet
    const cleanedBase64 = base64String.replace(/[^A-Za-z0-9+/]/g, "");
    const padding = "=".repeat((4 - (cleanedBase64.length % 4)) % 4);
    const base64 = (cleanedBase64 + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    try {
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    } catch (error) {
      console.error("Error decoding base64 string:", error);
      throw new Error("Invalid base64 string");
    }
  };

  // Register service worker and subscribe user to push notifications
  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log("Service Worker is ready");

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      console.log("VAPID Public Key:", vapidPublicKey);

      if (!vapidPublicKey) {
        throw new Error("VAPID Public Key is not defined");
      }

      // Validate the VAPID key format
      if (!/^[A-Za-z0-9_-]+$/.test(vapidPublicKey)) {
        throw new Error("Invalid VAPID Public Key format");
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      console.log("Converted VAPID Key:", convertedVapidKey);

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      console.log("Subscription successful:", sub);

      setSubscription(sub);
      await saveSubscription(sub); // Save subscription to backend
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  // Save subscription to the backend
  const saveSubscription = async (sub: PushSubscription) => {
    try {
      const response = await fetch("/api/save-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (!response.ok) {
        throw new Error("Failed to save subscription");
      }
      console.log("Subscription saved successfully.");
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  };

  // Unsubscribe user from push notifications
  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        await removeSubscription(subscription); // Remove subscription from backend
      }
    } catch (error) {
      console.error("Unsubscription error:", error);
    }
  };

  // Remove subscription from the backend
  const removeSubscription = async (sub: PushSubscription) => {
    try {
      const response = await fetch("/api/remove-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (!response.ok) {
        throw new Error("Failed to remove subscription");
      }
      console.log("Subscription removed successfully.");
    } catch (error) {
      console.error("Error removing subscription:", error);
    }
  };

  // Send a test notification
  const sendTestNotification = async () => {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  };

  // Send notification to the backend
  const sendNotification = async (message: string) => {
    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
      console.log("Notification sent successfully.");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  useEffect(() => {
    if (isSupported) {
      // Check if user is already subscribed
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
        });
      });
    }
  }, []);

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      <button onClick={subscribeUser}>Subscribe to Push Notifications</button>
      <button onClick={unsubscribeFromPush}>
        Unsubscribe from Push Notifications
      </button>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <button onClick={sendTestNotification}>Send Test Notification</button>
      </div>
    </div>
  );
};

export default Notifications;
