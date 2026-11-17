/* klone-garde.js : Klone copie InsertKoin sur la même origine (mauktenieb.github.io).
   Ce fichier, chargé avant tout le reste, isole la copie : stockage préfixé, bases et caches renommés,
   zéro connexion de présence ou de palmarès, zéro service worker, zéro écriture réseau. */
(function(){
'use strict';
var P='klone:';
/* stockage local et de session : chaque clé reçoit le préfixe de Klone */
['localStorage','sessionStorage'].forEach(function(nom){
  var s;try{s=window[nom];}catch(e){return;}if(!s)return;
  var g=Storage.prototype.getItem,st=Storage.prototype.setItem,r=Storage.prototype.removeItem,k=Storage.prototype.key;
  var vue={
    getItem:function(c){return g.call(s,P+c);},
    setItem:function(c,v){return st.call(s,P+c,String(v));},
    removeItem:function(c){return r.call(s,P+c);},
    clear:function(){var a=[];for(var i=0;i<s.length;i++){var c=k.call(s,i);if(c&&c.indexOf(P)===0)a.push(c);}a.forEach(function(c){r.call(s,c);});},
    key:function(n){var a=[];for(var i=0;i<s.length;i++){var c=k.call(s,i);if(c&&c.indexOf(P)===0)a.push(c.slice(P.length));}return a[n]===undefined?null:a[n];}
  };
  Object.defineProperty(vue,'length',{get:function(){var n=0;for(var i=0;i<s.length;i++){var c=k.call(s,i);if(c&&c.indexOf(P)===0)n++;}return n;}});
  var px=new Proxy(vue,{get:function(o,p){if(p in o)return o[p];return o.getItem(p);},set:function(o,p,v){o.setItem(p,v);return true;}});
  try{Object.defineProperty(window,nom,{configurable:true,get:function(){return px;}});}catch(e){}
});
/* bases et caches : noms préfixés */
try{var io=indexedDB.open.bind(indexedDB),idel=indexedDB.deleteDatabase.bind(indexedDB);
  indexedDB.open=function(n,v){return v===undefined?io(P+n):io(P+n,v);};indexedDB.deleteDatabase=function(n){return idel(P+n);};}catch(e){}
try{if(window.caches){var co=caches.open.bind(caches),cd=caches.delete.bind(caches),ck=caches.keys.bind(caches);
  caches.open=function(n){return co(P+n);};caches.delete=function(n){return cd(P+n);};
  caches.keys=function(){return ck().then(function(a){return a.filter(function(n){return n.indexOf(P)===0;}).map(function(n){return n.slice(P.length);});});};}}catch(e){}
/* zéro service worker */
try{if(navigator.serviceWorker){navigator.serviceWorker.register=function(){return Promise.reject(new Error('klone'));};}}catch(e){}
/* zéro connexion temps réel (présence MQTT, relais Nostr du palmarès et des curations) */
var WS=function(){var o={readyState:3,send:function(){},close:function(){},addEventListener:function(){},removeEventListener:function(){}};setTimeout(function(){if(o.onclose)o.onclose({});},0);return o;};
WS.CONNECTING=0;WS.OPEN=1;WS.CLOSING=2;WS.CLOSED=3;window.WebSocket=WS;
/* réseau : lectures permises, écritures neutralisées */
var f0=window.fetch&&window.fetch.bind(window);
if(f0)window.fetch=function(u,o){var m=(o&&o.method||'GET').toUpperCase();if(m!=='GET'&&m!=='HEAD')return Promise.resolve(new Response('',{status:204}));return f0(u,o);};
try{navigator.sendBeacon=function(){return true;};}catch(e){}
})();
