const CACHE_NAME = "yama100-v2"

const PRECACHE_URLS = [
  "/",
  "/mountains200/",
  "/mountains300/",
  "/mountains_flowers/",
  "/mountains_minor12/",
  "/mountains_new100/",
  "/mountains_kanto100/",
  "/map/",
  "/summary/",
  "/share/",
  "/gear-checklist/",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // 1件の失敗でインストール全体が失敗しないよう個別に追加する
      Promise.all(
        PRECACHE_URLS.map((url) => cache.add(url).catch(() => undefined))
      )
    )
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  // ページ（HTML）はネットワーク優先にして、デザイン更新がすぐ反映されるようにする
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, copy))
          }
          return response
        })
        .catch(
          async () =>
            (await caches.match(event.request)) ??
            (await caches.match(url.pathname)) ??
            caches.match("/")
        )
    )
    return
  }

  // 静的ファイルはキャッシュ優先＋裏で更新
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, copy))
          }
          return response
        })
        .catch(() => cached)
      return cached ?? networkFetch
    })
  )
})
