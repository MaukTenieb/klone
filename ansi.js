/* ansi.js : un écran de pixels encodé en texte (quarts de bloc Unscii, deux encres par case). */
(function(){
'use strict';
var Q=' ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█';
var BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function bay(x,y){return (BAYER[(y&3)*4+(x&3)]+.5)/16;}
function hex(h){return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)];}
var memo={};function dist(a,b){var k=a+b;if(memo[k]===undefined){var A=hex(a),B=hex(b);memo[k]=(A[0]-B[0])*(A[0]-B[0])+(A[1]-B[1])*(A[1]-B[1])+(A[2]-B[2])*(A[2]-B[2]);}return memo[k];}
function Ecran(el,PW,PH){this.el=el;this.PW=PW;this.PH=PH;this.CW=PW/2;this.CH=PH/2;this.px=new Array(PW*PH);this.txt=new Array(this.CW*this.CH);this.zb=new Float32Array(PW*PH);this.lignes=[];}
var E=Ecran.prototype;
E.vide=function(c){for(var i=0;i<this.px.length;i++)this.px[i]=c;for(i=0;i<this.txt.length;i++)this.txt[i]=null;};
E.set=function(x,y,c){x|=0;y|=0;if(x>=0&&x<this.PW&&y>=0&&y<this.PH)this.px[y*this.PW+x]=c;};
E.get=function(x,y){return this.px[y*this.PW+x];};
E.rect=function(x0,y0,x1,y1,f){for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++)this.set(x,y,typeof f==='function'?f(x,y):f);};
/* polygone convexe ou concave simple, rempli rangée par rangée */
E.poly=function(P,f){var y0=1e9,y1=-1e9;P.forEach(function(p){y0=Math.min(y0,p[0+1]);y1=Math.max(y1,p[1]);});
  y0=Math.max(0,Math.ceil(y0-.5));y1=Math.min(this.PH-1,Math.floor(y1-.5));
  for(var y=y0;y<=y1;y++){var yc=y+.5,xs=[];
    for(var i=0;i<P.length;i++){var a=P[i],b=P[(i+1)%P.length];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])/(b[1]-a[1])*(b[0]-a[0]));}
    xs.sort(function(a,b){return a-b;});
    for(var k=0;k+1<xs.length;k+=2){var xa=Math.max(0,Math.ceil(xs[k]-.5)),xb=Math.min(this.PW-1,Math.floor(xs[k+1]-.5));
      for(var x=xa;x<=xb;x++)this.px[y*this.PW+x]=f(x,y);}}};
E.ligne=function(x0,y0,x1,y1,c){var dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),n=Math.max(dx,dy,1);
  for(var i=0;i<=n;i++)this.set(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),c);};
E.ecrit=function(cx,cy,s,c){var x0=Math.round(cx-s.length/2);for(var i=0;i<s.length;i++){var X=x0+i;if(X>=0&&X<this.CW&&cy>=0&&cy<this.CH)this.txt[cy*this.CW+X]={g:s[i],c:c};}};
E.encode=function(){var PW=this.PW,html=[];
  for(var cy=0;cy<this.CH;cy++){var o='',run='',cf=null,cb=null;
    for(var cx=0;cx<this.CW;cx++){var t=this.txt[cy*this.CW+cx],i0=(cy*2)*PW+cx*2,g,f,b;
      if(t){g=t.g;f=t.c;b=this.px[i0];}
      else{var p=[this.px[i0],this.px[i0+1],this.px[i0+PW],this.px[i0+PW+1]],n={},o2=[];
        for(var j=0;j<4;j++){var c=p[j];if(!n[c]){n[c]=0;o2.push(c);}n[c]++;}
        o2.sort(function(a,c){return n[c]-n[a];});b=o2[0];f=o2[1]||o2[0];var m=0;
        for(j=0;j<4;j++){c=p[j];if(c!==b&&c!==f)c=dist(c,b)<=dist(c,f)?b:f;if(c===f&&f!==b)m|=1<<j;}
        g=Q[m];if(!m)f=b;}
      if(f!==cf||b!==cb){if(run)o+='<span style="color:'+cf+';background:'+cb+'">'+run+'</span>';run='';cf=f;cb=b;}
      run+=g==='<'?'&lt;':g==='&'?'&amp;':g;}
    html.push(o+'<span style="color:'+cf+';background:'+cb+'">'+run+'</span>');}
  if(!this.lignes.length){this.el.innerHTML='';for(var i=0;i<this.CH;i++){var d=document.createElement('div');this.el.appendChild(d);this.lignes.push({d:d,h:''});}}
  for(var k=0;k<this.CH;k++)if(this.lignes[k].h!==html[k]){this.lignes[k].h=html[k];this.lignes[k].d.innerHTML=html[k];}};
/* la grille entière à l'écran, un nombre entier de pixels physiques par case */
E.fit=function(fw,fh){var d=devicePixelRatio||1,c=Math.max(3,Math.floor(Math.min(innerWidth*(fw||.98)/this.CW,innerHeight*(fh||.98)/this.CH)*d));this.el.style.setProperty('--c',(c/d)+'px');};
E.pixelDe=function(e){var r=this.el.getBoundingClientRect();return {x:Math.floor((e.clientX-r.left)/r.width*this.PW),y:Math.floor((e.clientY-r.top)/r.height*this.PH)};};
function rampe(r,L,x,y,dith){var n=r.length,i=Math.floor(L*(n-1)+(dith===undefined?.25+.5*bay(x,y):dith*bay(x,y)+(1-dith)/2));return r[i<0?0:i>=n?n-1:i];}
function hash(x,y){var h=Math.sin(x*127.1+y*311.7)*43758.5453;return h-Math.floor(h);}
window.A={Ecran:Ecran,bay:bay,rampe:rampe,hex:hex,hash:hash,Q:Q,reduit:matchMedia('(prefers-reduced-motion:reduce)').matches};
})();
