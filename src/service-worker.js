workbox.routing.registerRoute(
    ({url}) => url.pathname.endsWith('jpg'),
        new workbox.strategies.CacheFirst({
            cacheName: "imageCache",
        })
)

workbox.routing.registerRoute(
    ({url}) => url.pathname.endsWith('mp3'),
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: "mp3Cache",
        })
)