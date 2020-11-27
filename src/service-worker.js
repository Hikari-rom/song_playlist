workbox.routing.registerRoute(
    ({url}) => url.origin === url.origin,
        new workbox.strategies.CacheFirst({
            cacheName: "serviceCache",
        })
)