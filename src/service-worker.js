workbox.routing.registerRoute(
    ({url}) => url.pathname.endsWith('jpg'),
        new workbox.strategies.CacheFirst({
            cacheName: "imageCache",
        })
)

workbox.routing.registerRoute(
    ({url}) => url.origin.endsWith('mp3'),
        new workbox.strategies.CacheFirst({
            cacheName: "mp3Cache",
        })
)