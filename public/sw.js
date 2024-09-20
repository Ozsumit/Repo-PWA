// public/service-worker.js

const CACHE_NAME = "offline-cache-v1";
const OFFLINE_URL = "/offline";
const urlsToCache = [
  OFFLINE_URL,
  "/",
  "/styles/globals.css",
  "/images/logo.svg",
  "/icon-192x192.png",
  "/badge-72x72.png",
  // Add other assets you want to cache
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match(OFFLINE_URL);
          }
        });
      })
    );
  }
});

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon-192x192.png",
      badge: "/badge-72x72.png",
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

self.addEventListener("sync", function (event) {
  if (event.tag === "sync-notifications") {
    event.waitUntil(syncNotifications());
  }
});

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
