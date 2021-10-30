var staticNameCache = 'site-static';
var dynamicNameCache = 'site-dynamic';
var assets = ['index.html',
'./assets/src/css/main.css',
'./manifest.json',
'./assets/src/leaflet.css',
'./assets/src/plugins/L.Control.Sidebar.css',
'./assets/src/plugins/easy-button.css',
'./assets/src/fontawesome-free-5.15.1-web/css/all.min.css',
'./assets/src/leaflet.js',
'./assets/src/jquery-3.2.0.min.js',
'./assets/src/plugins/leaflet.ajax.js',
'./assets/src/plugins/L.Control.Sidebar.js',
'./assets/src/plugins/easy-button.js',
'./assets/src/fontawesome-free-5.15.1-web/js/all.min.js',
'./assets/src/js/map.js',
'./assets/img/watertap.png',
'./assets/img/SW.png',
'./assets/img/GW.png',
'./assets/img/People_Comittee.png',
'./assets/img/view1.jpg',
'./assets/img/view2.jpg',
'./assets/src/images/layers-2x.png',
'./assets/src/images/layers.png',
'./assets/src/images/marker-icon-2x.png',
'./assets/src/images/marker-icon.png',
'./assets/src/images/marker-shadow.png'
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
                keys.filter(key => (key !== staticNameCache && key !==dynamicNameCache)).map(key => caches.delete(key)));
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
            // if cache ko có resource cần tìm, thì y/c dc gửi đến máy chủ và nhận respond từ máy chủ:fetchRes
            .then(fetchRes => {
                // tạo một caches with name is dynamicNameCache;
                return caches.open(dynamicNameCache)
                .then(cache => {
                    // here ko sử dụng addAll do addAll là method access to server, here đã có resource nên chỉ put vào
                    cache.put(e.request.url, fetchRes.clone());
                    return fetchRes;
                })
            })
        })
    )

})

                            