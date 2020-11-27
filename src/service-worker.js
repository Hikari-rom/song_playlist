workbox.routing.registerRoute(
    ({url}) => url.pathname.endsWith('jpg'),
        new workbox.strategies.CacheFirst({
            cacheName: "imageCache",
        })
)