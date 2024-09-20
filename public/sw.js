// service-worker.js

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("http://localhost:3000/"));
});

// Add this event listener to handle background sync for offline functionality
self.addEventListener("sync", function (event) {
  if (event.tag === "sync-notifications") {
    event.waitUntil(syncNotifications());
  }
});

// Function to sync notifications when back online
async function syncNotifications() {
  try {
    const response = await fetch("/api/get-missed-notifications");
    const notifications = await response.json();

    for (const notification of notifications) {
      self.registration.showNotification(
        notification.title,
        notification.options
      );
    }
  } catch (error) {
    console.error("Failed to sync notifications:", error);
  }
}
// public/service-worker.js
const CACHE_NAME = "offline-cache-v1";
const OFFLINE_URL = "@/app/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});

// Keep existing push notification logic
self.addEventListener("push", function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
