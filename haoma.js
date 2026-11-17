/* haoma.js : la lentille Haoma, posée sur chaque lieu de Klone entre le dessin et l'encodage en texte.
   Haoma : la boisson de l'Avesta, le Soma védique, l'amanite tue-mouches de Wasson. Les lieux restent les mêmes ; la vue change.
   Chaque dose ajoute une form constant de Klüver (grille, toile, spirale, tunnel), calculée comme un effet de démo ; la fovéa reste nette autour du regard.
   Palette de l'amanite ; mydriase ; rémanence ; les yeux des espions de Mithra ; un scarabée ; des lettres qui deviennent HOM. La cinquième dose blanchit tout et rend la vue à jeun.
   Prises : HOM ou HAOMA au clavier ; neuf Koins en neuf secondes ; la télé du motel quand elle passe l'amanite ; #haoma dans l'adresse.
   La dose suit le kandiKtat d'un lieu à l'autre : montée 15 s, plateau 7 min, descente 3 min. */
(function(){
'use strict';
var RAMPE=['#07040f','#07040f','#4a0c2c','#c8281e','#c8281e','#e9a43a','#c9c64e','#f3ead6'];
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
  if(S.n>=4){S.blanc=Date.now();ecrit();son(1);return;}
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
/* ===== géométrie : une dose, une form constant de Klüver, au calcul de la demoscene =====
   1 grille : trois ondes planes à 60° font un nid d'abeille qui module la lumière (planformes de Bressloff et Cowan)
   2 toile : l'angle se replie en six secteurs miroirs (kaléidoscope)
   3 spirale : l'angle tourne avec le logarithme du rayon (onde oblique en coordonnées de V1)
   4 tunnel : la périphérie devient un tunnel tapissé du lieu, table d'angle et table de distance (Second Reality, 1993)
   La fovéa reste nette autour du regard : le pointeur fixe le centre. */
var FX=.5,FY=.5;
function regard(){FX+=(PX-FX)*.06;FY+=(PY-FY)*.06;}
function sst(a,b,v){v=(v-a)/(b-a);v=v<0?0:v>1?1:v;return v*v*(3-2*v);}
function map(x,y,W,H,t,I){var N=S.n,fx=FX*W,fy=FY*H,dx=x-fx,dy=y-fy,r=Math.sqrt(dx*dx+dy*dy)+1e-3,a=Math.atan2(dy,dx),R=Math.max(W,H)*.5;
  var so=Math.sin(t*2*Math.PI/9000),ox=I*1.2*Math.sin(y*.11+t*.0013),oy=I*.8*Math.sin(x*.09-t*.0009);
  var sx=x+ox+dx*.02*so*I,sy=y+oy+dy*.02*so*I;
  var w=I*sst(R*.12,R*.42,r);if(bay(x+1,y+3)>=w)return [sx,sy];
  if(N===2){var sec=Math.PI/3,k=((a+t*.00007)%sec+sec)%sec;if(k>sec/2)k=sec-k;var b2=k+Math.floor(a/sec)*0;return [fx+r*Math.cos(k+Math.PI/3+.5*Math.sin(t/4100)),fy+r*Math.sin(k+Math.PI/3+.5*Math.sin(t/4100))];}
  if(N===3){var a3=a+1.7*Math.log(r/(R*.25))+t*.00045,r3=r*(1+.04*Math.sin(t/1700));return [fx+r3*Math.cos(a3),fy+r3*Math.sin(a3)];}
  if(N>=4){var u=((a/(2*Math.PI)+.5+t*.000025)%1+1)%1,v=((R*6/r+t*.012)%H+H)%H;return [u*W,v];}
  return [sx,sy];}
function nid(x,y,t){var k=.62,c=0;for(var j=0;j<3;j++){var th=j*Math.PI/3+t*.00005;c+=Math.cos(k*(x*Math.cos(th)+y*Math.sin(th))+t*.0012);}return c/3;}
/* ===== la lentille sur un tampon de pixels ===== */
var prec=null;
function lens(px,txt,PW,PH,t){var I=intensite();if(!I){prec=null;return;}
  var N=S.n,src=px.slice(),i,x,y;regard();
  if(S.blanc){var p=(Date.now()-S.blanc)/2600;for(y=0;y<PH;y++)for(x=0;x<PW;x++)if(bay(x,y)<p)px[y*PW+x]=OS;return;}
  var souffle=Math.sin(t*2*Math.PI/9000);
  for(y=0;y<PH;y++)for(x=0;x<PW;x++){var m=map(x,y,PW,PH,t,I),sx=Math.round(m[0]),sy=Math.round(m[1]);
    if(sx<0)sx=0;else if(sx>=PW)sx=PW-1;if(sy<0)sy=0;else if(sy>=PH)sy=PH-1;
    var c=src[sy*PW+sx],l=lum(c);
    if(l>=.075&&bay(x+3,y+1)<I){var lv=Math.min(1,Math.pow(l,.72)*(1+.22*I*nid(x,y,t)));px[y*PW+x]=versL(lv,x,y,t,I);}else px[y*PW+x]=c;}
  /* mydriase : la pupille ouverte, chaque lumière bave en trame */
  var L=new Float32Array(PW*PH);for(i=0;i<L.length;i++)L[i]=lum(px[i]);
  for(y=0;y<PH;y++)for(x=0;x<PW;x++){var l2=L[y*PW+x];if(l2<.74)continue;
    for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var X=x+dx,Y=y+dy;if(X<0||Y<0||X>=PW||Y>=PH)continue;var j=Y*PW+X;
      if(L[j]<l2-.2&&bay(X+1,Y+2)<I*.4)px[j]=px[y*PW+x];}}
  if(N>=2){
    /* rémanence : l'image d'avant traîne */
    if(prec&&prec.length===px.length)for(i=0;i<px.length;i++){x=i%PW;y=(i/PW)|0;if(bay(x+2,y+3)<.3*I)px[i]=prec[i];}
    /* les dix mille espions de Mithra : des yeux s'ouvrent dans le noir et suivent le regard */
    var ep=Math.floor(t/6800),ph2=(t%6800)/6800,ouv=Math.min(.92,Math.max(0,Math.sin(ph2*Math.PI)));
    for(var e=0;e<(N>=3?12:6);e++){var ex=Math.floor(hash(e,ep)*(PW-12))+6,ey=Math.floor(hash(ep,e+3)*(PH-8))+4;
      if(L[ey*PW+ex]>.2)continue;var cl=(Math.sin(t/160+e)>.97)?0:ouv*I,hm=cl*2.2;if(hm<.5)continue;
      var gx=Math.round((FX*PW-ex)/PW*6),gy2=Math.round((FY*PH-ey)/PH*2);gx=gx<-3?-3:gx>3?3:gx;gy2=gy2<-1?-1:gy2>1?1:gy2;
      for(var u=-6;u<=6;u++){var hh=hm*Math.sqrt(1-u*u/36);for(var v=-3;v<=3;v++){if(Math.abs(v)>hh)continue;var X2=ex+u,Y2=ey+v;if(X2<0||Y2<0||X2>=PW||Y2>=PH)continue;
        var du=u-gx,dvv=v-gy2,q=du*du/3+dvv*dvv;px[Y2*PW+X2]=q<1.6?NUIT:q<4.2?VERM:(Math.abs(v)>=Math.floor(hh)?'#5e0f34':OS);}}}}
  if(N>=3){
    var bx=Math.round(PW*(.5+.42*Math.sin(t/11000))),by=Math.round(PH*(.5+.4*Math.sin(t/7300+1))),pa=Math.floor(t/120)%2;
    [[0,0],[1,0],[-1,0],[0,1],[1,1],[-1,1],[0,-1]].forEach(function(o){var X=bx+o[0],Y=by+o[1];if(X>=0&&Y>=0&&X<PW&&Y<PH)px[Y*PW+X]=o[1]===-1?'#2a3a18':'#0e1408';});
    [[-2,pa],[2,1-pa],[-2,1+pa],[2,2-pa]].forEach(function(o){var X=bx+o[0],Y=by+o[1];if(X>=0&&Y>=0&&X<PW&&Y<PH)px[Y*PW+X]='#0e1408';});
    if(txt){var ep2=Math.floor(t/2200);for(i=0;i<txt.length;i++){if(!txt[i])continue;if(hash(i,ep2)<.12*I)txt[i]={g:'HOM'[(i+ep2)%3],c:VERM};}}}
  if(txt)for(i=0;i<txt.length;i++)if(txt[i]&&txt[i].c&&txt[i].c[0]==='#'){txt[i]={g:txt[i].g,c:ink(txt[i].c,i%(PW/2),(i/(PW/2))|0,t)};}
  prec=px.slice();
  sonSuit(I,souffle);}
function versL(l,x,y,t,I){var ph=(.16*Math.sin(t/5300+x*.021+y*.017)+.06*Math.sin(t/1900-y*.05))*Math.min(1,l*3);
  var k=Math.floor((l*1.04+ph*I)*(RAMPE.length-1)+bay(x,y)-.5);if(k<1)k=1;return RAMPE[k>=RAMPE.length?RAMPE.length-1:k];}
/* ===== prises ===== */
var tape='';addEventListener('keydown',function(e){if(!e.key||e.key.length!==1)return;tape=(tape+e.key.toUpperCase()).slice(-5);
  if(/(HOM|HAOMA)$/.test(tape)){dose();tape='';}});
if(/haoma/i.test(location.hash)){addEventListener('pointerdown',function(){son(1);},{once:true});if(!S.n)dose();}
/* les lieux qui ont un Ecran (ansi.js) reçoivent la lentille sans rien changer à leur code */
if(window.A&&A.Ecran){var enc=A.Ecran.prototype.encode;A.Ecran.prototype.encode=function(){lens(this.px,this.txt,this.PW,this.PH,performance.now());return enc.call(this);};}
/* lieux sans tampon : la grille entière respire, enfle et rétrécit */
function respire(el,t){var I=intensite();if(!I){el.style.transform='';return;}var so=Math.sin(t*2*Math.PI/9000),cyc=t%23000,bo=S.n>=3&&cyc<4000?Math.sin(cyc/4000*Math.PI)*(Math.floor(t/23000)%2?1:-1):0;
  el.style.transform='scale('+(1+I*(.022*so+.14*bo)).toFixed(4)+') skewX('+(I*(S.n>=2?1.4:.7)*Math.sin(t/3100)).toFixed(3)+'deg)';}
window.HAOMA={map:function(x,y,W,H,t){regard();return map(x,y,W,H,t,intensite());},respire:respire,lens:lens,ink:ink,dose:dose,intensite:intensite,doses:function(){return S.n;}};
})();
