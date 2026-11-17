/* haoma.js : la lentille Haoma. Elle se pose sur chaque lieu de Klone, entre le dessin et l'encodage en texte.
   Une dose : la palette coule vers l'amanite (nuit, ecchymose, vermillon, safran, or vert « zairi », os) et la pièce respire.
   Deux doses : mydriase (les lumières bavent), verrues de l'amanite sur les surfaces, rémanence, les yeux des espions de Mithra.
   Trois doses : macropsie et micropsie, un scarabée, les lettres qui deviennent HOM.
   Quatre doses : tout blanchit, retour à jeun.
   Prises : taper HOM ou HAOMA au clavier ; neuf Koins en neuf secondes dans la fente ; toucher la télé du motel quand elle passe HOM ; #haoma dans l'adresse.
   La dose suit le kandiKtat d'un lieu à l'autre (sessionStorage) : montée 15 s, plateau 7 min, descente 3 min. */
(function(){
'use strict';
var RAMPE=['#07040f','#160a2a','#33103c','#5e0f34','#96141f','#cc3214','#e47a26','#e6b23c','#c9c64e','#f3ead6'];
var OS='#f3ead6',VERM='#c8281e',NUIT='#07040f';
var BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function bay(x,y){return (BAYER[(y&3)*4+(x&3)]+.5)/16;}
function hash(x,y){var h=Math.sin(x*127.1+y*311.7)*43758.5453;return h-Math.floor(h);}
var LU={};function lum(h){var v=LU[h];if(v===undefined){if(!h||h[0]!=='#'){v=0;}else{var r=parseInt(h.substr(1,2),16),g=parseInt(h.substr(3,2),16),b=parseInt(h.substr(5,2),16);v=(r*.3+g*.59+b*.11)/255;}LU[h]=v;}return v;}
var MONTEE=15000,PLATEAU=420000,DESCENTE=180000;
var S={n:0,t0:0};
function lit(){try{var s=JSON.parse(sessionStorage.getItem('klone:haoma')||'null');if(s)S=s;}catch(e){}}
function ecrit(){try{sessionStorage.setItem('klone:haoma',JSON.stringify(S));}catch(e){}}
lit();
function intensite(){if(!S.n)return 0;var d=Date.now()-S.t0;
  if(S.blanc&&Date.now()-S.blanc>3200){S={n:0,t0:0};ecrit();return 0;}
  if(d<MONTEE)return d/MONTEE;if(d<MONTEE+PLATEAU)return 1;var r=1-(d-MONTEE-PLATEAU)/DESCENTE;if(r<=0){S={n:0,t0:0};ecrit();return 0;}return r;}
function dose(){var I=intensite();
  if(S.n>=3){S.blanc=Date.now();ecrit();son(1);return;}
  S.n=(S.n||0)+1;S.t0=Date.now()-MONTEE*I;S.blanc=0;ecrit();son(1);}
/* ===== pointeur : les yeux le suivent ===== */
var PX=.5,PY=.5;addEventListener('pointermove',function(e){PX=e.clientX/innerWidth;PY=e.clientY/innerHeight;});
/* ===== son : deux sinus qui battent, un souffle au rythme de la respiration ; seulement si la note est ouverte ===== */
var C=null,G=null,SB=null;
function sonOuvert(){try{return localStorage.getItem('klone:son')==='1';}catch(e){return false;}}
function son(geste){if(!sonOuvert())return;try{
  if(!C&&geste){C=new (window.AudioContext||window.webkitAudioContext)();G=C.createGain();G.gain.value=0;G.connect(C.destination);
    [49,49.6,73.4].forEach(function(f,i){var o=C.createOscillator();o.type=i===2?'triangle':'sine';o.frequency.value=f;var g=C.createGain();g.gain.value=i===2?.25:.6;o.connect(g);g.connect(G);o.start();});
    var n=C.createBuffer(1,C.sampleRate*2,C.sampleRate),d=n.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    var s=C.createBufferSource();s.buffer=n;s.loop=true;var f=C.createBiquadFilter();f.type='bandpass';f.frequency.value=420;f.Q.value=.7;SB=C.createGain();SB.gain.value=0;s.connect(f);f.connect(SB);SB.connect(C.destination);s.start();}
  if(C&&C.state==='suspended')C.resume();}catch(e){}}
function sonSuit(I,souffle){if(!C)return;var t=C.currentTime;G.gain.setTargetAtTime(.05*I,t,.4);SB.gain.setTargetAtTime(.025*I*(.5+.5*souffle),t,.3);}
/* ===== la couleur seule (lieux sans tampon de pixels : les Masks) ===== */
function versRampe(h,x,y,t,I){var l=lum(h);if(l<.075)return h;l=Math.pow(l,.72);var ph=(.16*Math.sin(t/5300+x*.021+y*.017)+.06*Math.sin(t/1900-y*.05))*Math.min(1,l*3);
  var k=Math.floor((l*1.04+ph*I)*(RAMPE.length-1)+bay(x,y)-.5);if(k<1)k=1;return RAMPE[k<0?0:k>=RAMPE.length?RAMPE.length-1:k];}
function ink(h,x,y,t){var I=intensite();if(!I)return h;if(S.blanc)return bay(x,y)<(Date.now()-S.blanc)/2600?OS:h;
  return bay(x+3,y+1)<I?versRampe(h,x,y,t,I):h;}
/* ===== la lentille sur un tampon de pixels ===== */
var prec=null;
function lens(px,txt,PW,PH,t){var I=intensite();if(!I){prec=null;return;}
  var N=S.n,src=px.slice(),i,x,y;
  if(S.blanc){var p=(Date.now()-S.blanc)/2600;for(y=0;y<PH;y++)for(x=0;x<PW;x++)if(bay(x,y)<p)px[y*PW+x]=OS;return;}
  var souffle=Math.sin(t*2*Math.PI/9000);
  /* macropsie : toutes les 23 s, la pièce enfle ou rétrécit pendant 4 s (Alice, la chenille, le champignon) */
  var cyc=t%23000,bosse=N>=3&&cyc<4000?Math.sin(cyc/4000*Math.PI):0,sens=Math.floor(t/23000)%2?1:-1;
  var zoom=1+I*(.028*souffle+.16*bosse*sens);
  var cx=PW*(.5+.18*Math.sin(t/7100)),cy=PH*(.46+.14*Math.cos(t/9300)),A1=N>=2?2.4:1.3;
  for(y=0;y<PH;y++){var oy=I*A1*.6*Math.sin(t*.0011+y*.07);
    for(x=0;x<PW;x++){var sx=Math.round(cx+(x-cx)/zoom+I*A1*Math.sin(y*.11+t*.0013)),sy=Math.round(cy+(y-cy)/zoom+oy*Math.sin(x*.09-t*.0009));
      if(sx<0)sx=0;else if(sx>=PW)sx=PW-1;if(sy<0)sy=0;else if(sy>=PH)sy=PH-1;
      var c=src[sy*PW+sx];px[y*PW+x]=bay(x+3,y+1)<I?versRampe(c,x,y,t,I):c;}}
  /* mydriase : la pupille ouverte, chaque lumière bave en trame */
  var L=new Float32Array(PW*PH);for(i=0;i<L.length;i++)L[i]=lum(px[i]);
  var R=N>=2?2:1;
  for(y=0;y<PH;y++)for(x=0;x<PW;x++){var l=L[y*PW+x];if(l<.74)continue;
    for(var dy=-R;dy<=R;dy++)for(var dx=-R;dx<=R;dx++){var X=x+dx,Y=y+dy;if(X<0||Y<0||X>=PW||Y>=PH)continue;var j=Y*PW+X;
      if(L[j]<l-.2&&bay(X+1,Y+2)<I*(.55-.15*(Math.abs(dx)+Math.abs(dy))))px[j]=px[y*PW+x];}}
  if(N>=2){
    /* les verrues de l'amanite poussent sur les surfaces claires et dérivent */
    var Z=7,dv=t/1400;
    for(y=0;y<PH;y++)for(x=0;x<PW;x++){var gy=y+dv,ix=Math.floor(x/Z),iy=Math.floor(gy/Z),h1=hash(ix,iy);if(h1>.5)continue;
      var ox=ix*Z+2+hash(ix+5,iy)*5,oyy=iy*Z+2+hash(ix,iy+7)*5,d2=(x-ox)*(x-ox)+(gy-oyy)*(gy-oyy),rr=.6+h1*2.2;
      var lv=L[y*PW+x];if(d2<rr&&lv>.22&&lv<.82&&bay(x,y)<I)px[y*PW+x]=d2<rr*.45?OS:'#e6dcc4';}
    /* rémanence : l'image d'avant traîne */
    if(prec&&prec.length===px.length)for(i=0;i<px.length;i++){x=i%PW;y=(i/PW)|0;if(bay(x+2,y+3)<.38*I)px[i]=prec[i];}
    /* les dix mille espions de Mithra : des yeux s'ouvrent dans le noir et suivent le pointeur */
    var ep=Math.floor(t/6800),ph2=(t%6800)/6800,ouv=Math.max(0,Math.sin(ph2*Math.PI));ouv=ouv>.92?.92:ouv;
    for(var e=0;e<(N>=3?14:7);e++){var ex=Math.floor(hash(e,ep)*(PW-12))+6,ey=Math.floor(hash(ep,e+3)*(PH-8))+4;
      if(L[ey*PW+ex]>.2)continue;
      var cl=(Math.sin(t/160+e)>.97)?0:ouv*I,hm=cl*2.2;if(hm<.5)continue;
      var gx=Math.round((PX-.5)*3),gy2=Math.round((PY-.5)*1.4);
      for(var u=-6;u<=6;u++){var hh=hm*Math.sqrt(1-u*u/36);for(var v=-3;v<=3;v++){if(Math.abs(v)>hh)continue;var X2=ex+u,Y2=ey+v;if(X2<0||Y2<0||X2>=PW||Y2>=PH)continue;
        var du=u-gx,dvv=v-gy2,q=du*du/3+dvv*dvv;px[Y2*PW+X2]=q<1.6?NUIT:q<4.2?VERM:(Math.abs(v)>=Math.floor(hh)?'#5e0f34':OS);}}}}
  if(N>=3){
    /* un scarabée longe la pièce */
    var bx=Math.round(PW*(.5+.42*Math.sin(t/11000))),by=Math.round(PH*(.5+.4*Math.sin(t/7300+1))),pa=Math.floor(t/120)%2;
    [[0,0],[1,0],[-1,0],[0,1],[1,1],[-1,1],[0,-1]].forEach(function(o){var X=bx+o[0],Y=by+o[1];if(X>=0&&Y>=0&&X<PW&&Y<PH)px[Y*PW+X]=o[1]===-1?'#2a3a18':'#0e1408';});
    [[-2,pa],[2,1-pa],[-2,1+pa],[2,2-pa]].forEach(function(o){var X=bx+o[0],Y=by+o[1];if(X>=0&&Y>=0&&X<PW&&Y<PH)px[Y*PW+X]='#0e1408';});
    /* les lettres deviennent HOM, par moments */
    if(txt){var W2=PW/2,ep2=Math.floor(t/2200);for(i=0;i<txt.length;i++){var tc=txt[i];if(!tc)continue;
      if(hash(i,ep2)<.12*I){var k2=(i+ep2)%3;txt[i]={g:'HOM'[k2],c:VERM};}}}}
  if(txt)for(i=0;i<txt.length;i++)if(txt[i]&&txt[i].c&&txt[i].c[0]==='#'){var cx2=i%(PW/2),cy2=(i/(PW/2))|0;txt[i]={g:txt[i].g,c:ink(txt[i].c,cx2,cy2,t)};}
  prec=px.slice();
  sonSuit(I,souffle);}
/* ===== prises ===== */
var tape='';addEventListener('keydown',function(e){if(!e.key||e.key.length!==1)return;tape=(tape+e.key.toUpperCase()).slice(-5);
  if(/(HOM|HAOMA)$/.test(tape)){dose();tape='';}});
if(/haoma/i.test(location.hash)){addEventListener('pointerdown',function(){son(1);},{once:true});if(!S.n)dose();}
/* les lieux qui ont un Ecran (ansi.js) reçoivent la lentille sans rien changer à leur code */
if(window.A&&A.Ecran){var enc=A.Ecran.prototype.encode;A.Ecran.prototype.encode=function(){lens(this.px,this.txt,this.PW,this.PH,performance.now());return enc.call(this);};}
/* lieux sans tampon : la grille entière respire, enfle et rétrécit */
function respire(el,t){var I=intensite();if(!I){el.style.transform='';return;}var so=Math.sin(t*2*Math.PI/9000),cyc=t%23000,bo=S.n>=3&&cyc<4000?Math.sin(cyc/4000*Math.PI)*(Math.floor(t/23000)%2?1:-1):0;
  el.style.transform='scale('+(1+I*(.022*so+.14*bo)).toFixed(4)+') skewX('+(I*(S.n>=2?1.4:.7)*Math.sin(t/3100)).toFixed(3)+'deg)';}
window.HAOMA={respire:respire,lens:lens,ink:ink,dose:dose,intensite:intensite,doses:function(){return S.n;}};
})();
