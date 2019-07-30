importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/305f4a606b37f8b8b731.js",
    "revision": "e7161f88b44989be7ad2142b9862d4ce"
  },
  {
    "url": "/_nuxt/58e75f7c8536bd810876.js",
    "revision": "a5c943f1d396bafa7afe78a38f626dbf"
  },
  {
    "url": "/_nuxt/b87d3139a79967741d3a.js",
    "revision": "0d4b9852610f457f7dbc05a9f39bd716"
  },
  {
    "url": "/_nuxt/dc6d6c9d677faa51c40e.js",
    "revision": "098b12a6e836b93e3f51160fe3770436"
  },
  {
    "url": "/_nuxt/e96444951ccf1d3f9cfd.js",
    "revision": "b93a72ba6924cc89d251471d7b5c87b2"
  }
], {
  "cacheId": "nuxt-buttons",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
