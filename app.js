if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then((reg) => {
        console.log('SW has registered!',reg);
    })
    .catch((err) => {
        console.log('SW has not registered!',err);
    })
}