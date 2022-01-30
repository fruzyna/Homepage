/**
 * file:        pwa.js
 * description: Used to implement offline mode for PWAs. 
 * author:      Liam Fruzyna
 * date:        2022-01-30
 */

 const CACHE_NAME = 'homepage-220130'
 const CACHE_LIST = [
     // html files
     '/index.html',
     '/config.html',
     // styles
     '/style.css',
     // scripts
     '/pwa.js',
     '/script.js',
     '/config.js',
     '/common.js',
     // configs
     '/work.conf',
     '/home.conf',
     // icons
     '/favicon.ico',
     '/icons/icon-192x192.png',
     '/icons/icon-256x256.png',
     '/icons/icon-384x384.png',
     '/icons/icon-512x512.png'
 ]
 
 // store files to cache on install
 self.addEventListener('install', e => {
     e.waitUntil((async () => {
         const CACHE = await caches.open(CACHE_NAME)
         await CACHE.addAll(CACHE_LIST)
     })())
 })
 
 // use cache instead of server
 self.addEventListener('fetch', e => {
     e.respondWith((async () => {
         // attempt to pull resource from cache
         const R = await caches.match(e.request, {ignoreSearch: true})
         if (R)
         {
             return R
         }
         
         // if not there pull from server
         const RES = await fetch(e.request)
         const CACHE = await caches.open(CACHE_NAME)
         CACHE.put(e.request, RES.clone())
         return RES
     })())
 })
 
 // remove old caches
 self.addEventListener('activate', e => {
     e.waitUntil(caches.keys().then(keyList => {
         return Promise.all(keyList.map(key => {
             if (key != CACHE_NAME)
             {
                 return caches.delete(key)
             }
         }))
     }))
 })