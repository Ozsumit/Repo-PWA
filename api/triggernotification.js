const triggerNotification = async () => {
  try {
    const response = await fetch("/api/trigger-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Custom Notification",
        body: "This is a custom notification from the client",
        icon: "/custom-icon.png",
        data: { url: "/custom-page" },
      }),
    });

    if (response.ok) {
      console.log("Notification triggered successfully");
    } else {
      console.error("Failed to trigger notification");
    }
  } catch (error) {
    console.error("Error triggering notification:", error);
  }
};
