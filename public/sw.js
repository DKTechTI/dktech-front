if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>a(e,n),d={module:{uri:n},exports:t,require:r};s[n]=Promise.all(c.map((e=>d[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-07a7b4f2"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/WmdUhKasJCR3YKWY_-JRM/_buildManifest.js",revision:"b3fc53a191fb5ba731eb72887e5a80ce"},{url:"/_next/static/WmdUhKasJCR3YKWY_-JRM/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/216-647fa0595f82b619.js",revision:"647fa0595f82b619"},{url:"/_next/static/chunks/225-46da7fa192795e2a.js",revision:"46da7fa192795e2a"},{url:"/_next/static/chunks/325-feb0b8212e609dc3.js",revision:"feb0b8212e609dc3"},{url:"/_next/static/chunks/401-aad496c6d537859c.js",revision:"aad496c6d537859c"},{url:"/_next/static/chunks/642-376df106ca45f09f.js",revision:"376df106ca45f09f"},{url:"/_next/static/chunks/646-dca117aeabeac6c5.js",revision:"dca117aeabeac6c5"},{url:"/_next/static/chunks/659-af0c3c33b86c4bf9.js",revision:"af0c3c33b86c4bf9"},{url:"/_next/static/chunks/864-6edd56a050ba82ca.js",revision:"6edd56a050ba82ca"},{url:"/_next/static/chunks/882-f42cd460243df77a.js",revision:"f42cd460243df77a"},{url:"/_next/static/chunks/886-5e94ca3d47075e0b.js",revision:"5e94ca3d47075e0b"},{url:"/_next/static/chunks/94-41f046397395dc77.js",revision:"41f046397395dc77"},{url:"/_next/static/chunks/bee240a3-f435a23bc5c2b3d4.js",revision:"f435a23bc5c2b3d4"},{url:"/_next/static/chunks/framework-73b8966a3c579ab0.js",revision:"73b8966a3c579ab0"},{url:"/_next/static/chunks/main-158c87e2d5434753.js",revision:"158c87e2d5434753"},{url:"/_next/static/chunks/pages/401-3472b4d2439fe35a.js",revision:"3472b4d2439fe35a"},{url:"/_next/static/chunks/pages/404-d7cf319750e75e94.js",revision:"d7cf319750e75e94"},{url:"/_next/static/chunks/pages/500-4b71766a66a1ab58.js",revision:"4b71766a66a1ab58"},{url:"/_next/static/chunks/pages/_app-c27d17e5ba31cd87.js",revision:"c27d17e5ba31cd87"},{url:"/_next/static/chunks/pages/_error-3f6d1c55bb8051ab.js",revision:"3f6d1c55bb8051ab"},{url:"/_next/static/chunks/pages/clientes-47932a61b24af903.js",revision:"47932a61b24af903"},{url:"/_next/static/chunks/pages/clientes/%5Bid%5D-a8113ca8d8d8babe.js",revision:"a8113ca8d8d8babe"},{url:"/_next/static/chunks/pages/clientes/criar-cliente-279c363106cd566b.js",revision:"279c363106cd566b"},{url:"/_next/static/chunks/pages/dispositivos-a4d1980f039c6904.js",revision:"a4d1980f039c6904"},{url:"/_next/static/chunks/pages/dispositivos/%5Bid%5D-dbca59ef0f65842b.js",revision:"dbca59ef0f65842b"},{url:"/_next/static/chunks/pages/dispositivos/criar-dispositivo-eca8008c1acd3e60.js",revision:"eca8008c1acd3e60"},{url:"/_next/static/chunks/pages/esqueceu-a-senha-4b2a7aadbc81b4e2.js",revision:"4b2a7aadbc81b4e2"},{url:"/_next/static/chunks/pages/home-2d526cb9c8d6e9ab.js",revision:"2d526cb9c8d6e9ab"},{url:"/_next/static/chunks/pages/index-767919b05e7d83bf.js",revision:"767919b05e7d83bf"},{url:"/_next/static/chunks/pages/login-2d7e6ed492b96381.js",revision:"2d7e6ed492b96381"},{url:"/_next/static/chunks/pages/minha-conta-06c7139cb245c21d.js",revision:"06c7139cb245c21d"},{url:"/_next/static/chunks/pages/monitoramento-25f5cd5bed515576.js",revision:"25f5cd5bed515576"},{url:"/_next/static/chunks/pages/primeiro-acesso-50a08065512df82a.js",revision:"50a08065512df82a"},{url:"/_next/static/chunks/pages/projetos-af304da5df23714b.js",revision:"af304da5df23714b"},{url:"/_next/static/chunks/pages/projetos/configurar-projeto/%5Bid%5D-2b065693c173f391.js",revision:"2b065693c173f391"},{url:"/_next/static/chunks/pages/redefinir-senha-89107bcddea10c42.js",revision:"89107bcddea10c42"},{url:"/_next/static/chunks/pages/revendas-83926b2946278ac9.js",revision:"83926b2946278ac9"},{url:"/_next/static/chunks/pages/revendas/%5Bid%5D-7b71bd7dee6f1d6a.js",revision:"7b71bd7dee6f1d6a"},{url:"/_next/static/chunks/pages/revendas/criar-revenda-aa98cf2f6552231c.js",revision:"aa98cf2f6552231c"},{url:"/_next/static/chunks/pages/usuarios-9d127a8733bc085e.js",revision:"9d127a8733bc085e"},{url:"/_next/static/chunks/pages/usuarios/%5Bid%5D-8502405d239188d9.js",revision:"8502405d239188d9"},{url:"/_next/static/chunks/pages/usuarios/criar-usuario-388f68c1071db57f.js",revision:"388f68c1071db57f"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-6ef43a8d4a395f49.js",revision:"6ef43a8d4a395f49"},{url:"/_next/static/css/00907eb975caaf69.css",revision:"00907eb975caaf69"},{url:"/_next/static/css/30fd6dae99bf48e4.css",revision:"30fd6dae99bf48e4"},{url:"/images/apple-touch-icon.png",revision:"abead32a69df75255c09d10aea3d0058"},{url:"/images/favicon.png",revision:"29f03b97f1445fdfbc36c3286472dea7"},{url:"/images/pages/auth-v2-mask-dark.png",revision:"5aa3aab68f21ae85493957d2d84d84c9"},{url:"/images/pages/auth-v2-mask-light.png",revision:"5919d6e95af34ba3ab8e2cf179ebfe0d"},{url:"/images/pages/misc-mask-dark.png",revision:"4573139fc226684bf7af479fd371e672"},{url:"/images/pages/misc-mask-light.png",revision:"0d953103d6c7245c6002ed9d73b621ba"},{url:"/manifest.json",revision:"4316659afebbe4db6b6ba640ef5d922e"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
