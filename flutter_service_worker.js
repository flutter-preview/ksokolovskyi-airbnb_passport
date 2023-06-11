'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "291119b1890dd641c135d13189479395",
"/": "291119b1890dd641c135d13189479395",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"version.json": "13ad59348aa74234af3dbb039be57101",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/fonts/MaterialIcons-Regular.otf": "62ec8220af1fb03e1c20cfa38781e17e",
"assets/NOTICES": "689264ae9b1f52710d90bac62d9edc08",
"assets/assets/fonts/PlusJakartaSans-Regular.ttf": "086a38d660fc107d0a20aa9a91979237",
"assets/assets/fonts/PlusJakartaSans-Bold.ttf": "1c51d1fb8daa95760a726496b2c5efd7",
"assets/assets/fonts/PlusJakartaSans-SemiBold.ttf": "94fe9cdf95a72756739bdf895abd57a5",
"assets/assets/fonts/PlusJakartaSans-Medium.ttf": "17380874f87d6fa63ab3c09a14e6b217",
"assets/assets/fonts/PlusJakartaSans-ExtraLight.ttf": "07944e5d93df66bbb8fec886e3a08ccc",
"assets/assets/fonts/PlusJakartaSans-Light.ttf": "5fbea2e2a03de14e62fa3253f8db3480",
"assets/assets/apartments/2.jpg": "ac6fc0565bc51b8dc9959da3090def45",
"assets/assets/apartments/3.jpg": "0c19452302005f0694779ad07b99c66f",
"assets/assets/apartments/9.jpg": "648fb055c38206a277a84abf64c9f4a8",
"assets/assets/apartments/10.jpg": "4b736222436f16fd1b69e9e60a5372ba",
"assets/assets/apartments/4.jpg": "a788f583cd45d48397130db6c893f5bd",
"assets/assets/apartments/5.jpg": "745223fa90f4f2d73bc9fdbdcb6e43e8",
"assets/assets/apartments/7.jpg": "1571aa908b6fffca522d6c74bbf549f1",
"assets/assets/apartments/8.jpg": "4ec0fbc501e5d2a0630bb8fa50290e81",
"assets/assets/apartments/1.jpg": "259a3abfa51daf85563e9b48aaeccd87",
"assets/assets/apartments/6.jpg": "7a956a33c42cb3ff07319ef6c9e69613",
"assets/assets/avatars/ludovico.jpg": "796d4a66140109467ad1aa5abfe9eabd",
"assets/assets/avatars/romain.jpg": "6d112651dd47ff5b2053253abc7b7d6a",
"assets/assets/avatars/valentina.jpg": "90f34180c2ab49cff83b3add7ee9c3e5",
"assets/assets/avatars/carmela.jpg": "1a3bda1875b416e7410a57cb8f8c25af",
"assets/assets/avatars/chris.jpg": "3f544365d79b68096f0a299bbfa46b09",
"assets/assets/avatars/rebecca.jpg": "1bc08dcbb00d66541e908365471760f0",
"assets/assets/avatars/roberta.jpg": "2bfefc522b8470522fe6d29387451178",
"assets/assets/avatars/meritt.jpg": "5d6806a86f31eb0b1b3a4b0c556413c6",
"assets/assets/avatars/russel.jpg": "2a33f0eaecb5b0a4649e2915e4bf031b",
"assets/assets/avatars/oliver.jpg": "5fd453e06bdc7c72c3f54dd31da888e2",
"assets/FontManifest.json": "164d5f36ccbc8c867f1d08a57e4bac0c",
"assets/AssetManifest.bin": "525d28a6dd3d8dc1f597be17fb17cf02",
"assets/AssetManifest.json": "1dc98c25bec145d6985fdb2f3b31c0c1",
"main.dart.js": "f5eb703d7a5ec38fcefcb42337973862",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"manifest.json": "f3e9d663d97d839aa099bebad2a8901a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
