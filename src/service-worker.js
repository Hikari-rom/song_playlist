workbox.routing.registerRoute(
    ({url}) => url.startsWith("https://www.free-stock-music.com/"),
        new workbox.strategies.CacheFirst({
            cacheName: "songsCache",
        })
)