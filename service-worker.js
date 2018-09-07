var cache_name = "rutas-cache-v210";
var urlsToCache = [
  "/images/logo.png",
  "/images/loading.gif"
];


self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cache_name).then((cache) => cache.addAll(urlsToCache))
  )
});

self.addEventListener("push", event => {
  if (event.data) {
    // star wars vibration pattern
    let data = event.data.json()
    const options = {
      body: data.body,
      vibrate:data.vibrate,
      icon: data.icon,
      image: data.image,
      badge: data.badge,
      requireInteraction: true,
      data: {
        time: new Date(Date.now()).toString(),
        id: data.id,
        url: data.url
      }
    };
    if (data.actions) { 
      options.actions = data.actions
    }
    const promiseChain = self.registration.showNotification(
      data.title,
      options
    );
    event.waitUntil(promiseChain);
  } else {
    console.log("this push event has not data");
  }
});

self.addEventListener('notificationclick', function (event) {
  const clickedNotification = event.notification;
  const notificationData = clickedNotification.data;
  clickedNotification.close();
  if (!event.action) {
    //data sent from server
    const page = notificationData.url;
    const promiseChain = clients.openWindow(page);
    event.waitUntil(promiseChain);
    return;
  }
  else { 
    const pushInfoPromise = fetch(`/api/actions/${event.action}/${notificationData.id}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      const urlAction = response.url;
      return clients.openWindow(urlAction)
    });
    event.waitUntil(pushInfoPromise)
  }
});

self.addEventListener("fetch", function (event) {
  // Prevent the default, and handle the request ourselves.
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
})

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(keyList => { 
      Promise.all(
        keyList.map(key => {
          if (key !== cache_name) {
            console.log("deleting old cache");
            return caches.delete(key);
          }
        })
      );
    })
  );
}); 
