workbox.routing.registerRoute(
    ({url}) => url.origin.startsWith("https://www.free-stock-music.com/"),
        new workbox.strategies.CacheFirst({
            cacheName: "songsCache",
        })
)