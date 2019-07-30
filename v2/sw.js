importScripts('/v2/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/v2/_nuxt/09626d816920119c3cf4.js",
    "revision": "308983da65f337a7db52f981040c333d"
  },
  {
    "url": "/v2/_nuxt/22bf8b5a0c69cb167b61.js",
    "revision": "90b7a841367cf0b8e7720097b2e413e5"
  },
  {
    "url": "/v2/_nuxt/305f4a606b37f8b8b731.js",
    "revision": "e7161f88b44989be7ad2142b9862d4ce"
  },
  {
    "url": "/v2/_nuxt/b87d3139a79967741d3a.js",
    "revision": "0d4b9852610f457f7dbc05a9f39bd716"
  },
  {
    "url": "/v2/_nuxt/dc6d6c9d677faa51c40e.js",
    "revision": "098b12a6e836b93e3f51160fe3770436"
  }
], {
  "cacheId": "nuxt",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/v2/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/v2/.*'), workbox.strategies.networkFirst({}), 'GET')
