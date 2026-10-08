const C='kortos-v3';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png',
'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
const page=u.origin===location.origin&&(r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html'));
if(page){
const net=fetch(r,{cache:'no-store'}).then(res=>{const c2=res.clone();caches.open(C).then(c=>c.put(r,c2));return res});
const cached=()=>caches.match(r,{ignoreSearch:true}).then(h=>h||caches.match('./index.html'));
e.respondWith(Promise.race([net.catch(()=>null),new Promise(ok=>setTimeout(()=>ok(null),3500))]).then(res=>res||cached()).then(res=>res||net));return}
e.respondWith(caches.open(C).then(async c=>{const hit=await c.match(r);
const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>hit);
return hit||net}))});
