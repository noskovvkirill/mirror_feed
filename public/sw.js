
self.addEventListener("install", function (event) {
  console.log("Hello world from the Service Worker 🤙");
}); 


self.addEventListener("fetch", function (event) {
  //POST request aren't supported apparently, I need to put them in DB 
  // and justify it 
  if(event.request.url === 'https://api.thegraph.com/subgraphs/name/ensdomains/ens' && event.request.method === 'POST'){
    //     event.respondWith(fromCache(event.request));
    //     event.waitUntil(
    //     update(event.request)
    //     .then(refresh)
    // );
  }
})



function fromCache(request) {
  return caches.open('ensDomains').then(function (cache) {
    return caches.match(request).then(function (matching) {
      return matching || Promise.reject('request-not-in-cache');
    });
  });
}
function update(request) {
  return caches.open('ensDomains').then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}

function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {

      var message = {
        type: 'refresh',
        url: response.url,
        eTag: response.headers.get('ETag')
      };
      client.postMessage(JSON.stringify(message));
    });
  });
}