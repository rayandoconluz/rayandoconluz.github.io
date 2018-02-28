var cache_name = "rutas-cache-v112";
var urlsToCache = [
  "/",
  "/images/logo.png",
  "/images/loading.gif",
  "/documents.json",
  "/javascript/index.bundle.js",
  "https://cdn.ampproject.org/v0.js",
  "https://cdn.ampproject.org/v0/amp-iframe-0.1.js",
  "https://cdn.ampproject.org/v0/amp-carousel-0.1.js",
  "https://cdn.ampproject.org/v0/amp-analytics-0.1.js",
  "https://cdn.ampproject.org/v0/amp-video-0.1.js",
  "https://cdn.ampproject.org/v0/amp-sidebar-0.1.js",
  "https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js",
  "https://cdn.ampproject.org/shadow-v0.js",
  "https://cdn.ampproject.org/v0/amp-social-share-0.1.js"
];
/*// Any requests that match the regular expression will match this route, with
// the capture groups passed along to the handler as an array via params.
const workboxSW = new WorkboxSW();

workboxSW.precache([
  {
    url: '/index.html',
    revision: 'cb13ex',
  }, {
    url: '/javascript/index.bundle.js',
    revision: 'b33xqw',
  },
  {
    url: '/documents.json',
    revision: 'c34xbc',
  }
]);
*/
/*
// Register runtime routes like so.
workboxSW.router.registerRoute(
  /\/images\/(.*\/)?.*\.(png|jpg|jpeg|gif)/,
  workboxSW.strategies.cacheFirst());
*/
self.addEventListener("install", function(event) {
  // Perform install steps
  event.waitUntil(fetch("/documents.json").
    then(documents => documents.json()).
    then((documents) => documents.docs).
    then((jsonDocuments) => jsonDocuments.reduce((urlsToCache, document) => urlsToCache.concat(document.url, document.image), urlsToCache)).
    then((imagesArray) => { 
      caches.open(cache_name).then(function(cache) {
      return cache.addAll(urlsToCache.concat(imagesArray));})
    })
  );
});
self.addEventListener("push", event => {
  if (event.data) {
    var img = "/images/launcher-icon-4x.png";
    // star wars vibration pattern
    const options = {
      body: event.data.text(),
      vibrate: [
        500,
        110,
        500,
        110,
        450,
        110,
        200,
        110,
        170,
        40,
        450,
        110,
        200,
        110,
        170,
        40,
        500
      ],
      icon: img,
      badge: img
    };
    const promiseChain = self.registration.showNotification(
      "Notificacion de Rutas",
      options
    );
    event.waitUntil(promiseChain);
  } else {
    console.log("this push event has not data");
  }
});
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

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
