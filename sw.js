var staticNameCache = 'site-static';
var assets = ['index.html',
'./assets/src/css/main.css',
];

// Install SW
self.addEventListener('install', e => {
    // sure proccess don't stop
    e.waitUntil(
        caches.open(staticNameCache).then(cache => {
            // console.log('Caching shell assets!');
            cache.addAll(assets);
        })
    );
    
});

self.addEventListener('activate', e => {
    // console.log('SW has activated!');
    e.waitUntil(
        // access to nameCaches array
        caches.keys().then(keys => {
            // console.log(keys);
            // access to every cache, if nameCaches doesn't to current nameCache, keep it in array, then delete that array. 
            return Promise.all(
                keys.filter(key => key !== staticNameCache).map(key => caches.delete(key)));
        }
        )
    )
    
})

// Fetch Event: ACT every page has some changes, browser will looking for information so this time is prevent default fetch
self.addEventListener('fetch', e => {
    // prevent default fetch then respond with any other what... such as caches
    e.respondWith(
        // CACHES will check this request - have any resources in caches fit with its request, if fit, return a promise
        caches.match(e.request).then(cacheRes => {
            // if fit, it take resources from caches, after respond to do something as display on screen,.. but if it isn't there, means don't have fit resources in caches, it will make a normal request to server.
            return cacheRes || fetch(e.request)
        })
    )

})

                            