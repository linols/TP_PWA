self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notification sans contenu";
  
    event.waitUntil(
      self.registration.showNotification("📸 Photo Capturée !", {
        body: data,
        icon: "/pwa-192x192.png", // Assure-toi que l'icône existe dans /public
        vibrate: [200, 100, 200],
      })
    );
  });
  
  self.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow("/");
      })
    );
  });
  
  // Activation immédiate du Service Worker
  self.addEventListener("install", event => {
    self.skipWaiting();
  });
  
  self.addEventListener("activate", event => {
    event.waitUntil(clients.claim());
  });
  