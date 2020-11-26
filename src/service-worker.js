workbox.routing.registerRoute(
    ({url}) => url.origin === url.origin,
        new workbox.strategies.NetworkOnly({
            cacheName: "serviceCache",
        })
)