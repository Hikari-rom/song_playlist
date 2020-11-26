workbox.routing.registerRoute(
    ({url}) => url.origin.startsWith('https://www.free-stock'),
        new workbox.strategies.CacheFirst({
            cacheName: "songsCache",
        })
)