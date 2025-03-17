const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/index.html",
  "/script.js",
  "/assets",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(urlsToCache);
      } catch (error) {
        console.error("Cache addAll failed:", error);
      }
    })
  );
});
