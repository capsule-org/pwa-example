// Check if Workbox is available
if ("workbox" in self) {
  workbox.setConfig({ debug: true });

  // Precaching of assets
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  // Cache CSS and JavaScript files
  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "static-resources",
    }),
  );

  // Cache image files
  workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif)$/,
    new workbox.strategies.CacheFirst({
      cacheName: "image-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  );
}
