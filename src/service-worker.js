/* eslint-disable */
workbox.routing.registerRoute(
    ({url}) => url.pathname.endsWith('jpg'),
        new workbox.strategies.CacheFirst({
            cacheName: "imageCache",
            plugins:[
                new workbox.expiration.ExpirationPlugin({
                    maxAgeSeconds: 24*60*60,
                })
            ]
        })
)

workbox.routing.registerRoute(
    ({url}) => url.pathname.endsWith('mp3'),
        new workbox.strategies.CacheFirst({
            cacheName: "mp3Cache",
            plugins:[
                new workbox.expiration.ExpirationPlugin({
                    maxAgeSeconds: 24*60*60,
                })
            ]
        })
)