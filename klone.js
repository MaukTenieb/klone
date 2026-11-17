/* Klone : moteur commun. Une grille de caractères, rendue en vrai texte dans une <pre>. */
(function(){
'use strict';
var K=window.K={};
K.SALLE='#0b0908';
K.hex=function(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];};
K.rgb=function(c){return 'rgb('+c.map(function(v){return Math.max(0,Math.min(255,Math.round(v)));}).join(',')+')';};
K.esc=function(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;');};
/* Grille : ch (signes), co (couleur [r,g,b] ou null), cl (classe d'action) */
K.Grille=function(W,H){this.W=W;this.H=H;this.ch=new Array(W*H);this.co=new Array(W*H);this.cl=new Array(W*H);this.vide();};
K.Grille.prototype.vide=function(){for(var i=0;i<this.W*this.H;i++){this.ch[i]=' ';this.co[i]=null;this.cl[i]='';}};
K.Grille.prototype.put=function(x,y,s,c,cl){for(var i=0;i<s.length;i++){var X=x+i;if(X<0||X>=this.W||y<0||y>=this.H||s[i]==='\u0000')continue;var j=y*this.W+X;this.ch[j]=s[i];this.co[j]=c||null;this.cl[j]=cl||'';}};
K.Grille.prototype.rendre=function(pre,lum){
  var out='',cur=null,curcl='',buf='',W=this.W;
  for(var y=0;y<this.H;y++){for(var x=0;x<W;x++){var i=y*W+x,c=this.co[i],s=this.ch[i],key='',cl=this.cl[i];
      if(s!==' '&&c){var f=lum?lum(x,y):1;key=K.rgb([c[0]*f,c[1]*f,c[2]*f]);}
      if(s===' ')cl=curcl;
      if(key!==cur||cl!==curcl){if(buf)out+=K.span(cur,curcl,buf);buf='';cur=key;curcl=cl;}buf+=s;}
    buf+='\n';}
  out+=K.span(cur,curcl,buf);pre.innerHTML=out;};
K.span=function(c,cl,b){if(!c&&!cl)return K.esc(b);return '<span'+(c?' style="color:'+c+'"':'')+(cl?' data-a="'+cl+'"':'')+'>'+K.esc(b)+'</span>';};
/* Mesure de la police : avance d'un caractère en em */
K.avance=function(fam){var m=document.createElement('span');m.textContent='MMMMMMMMMM';m.style.cssText='position:absolute;visibility:hidden;white-space:pre;font:100px '+fam+';line-height:1';document.body.appendChild(m);var a=m.getBoundingClientRect().width/1000;m.remove();return a||0.4;};
/* Ajuste la taille : la grille entière tient dans la boîte, mêmes proportions partout */
K.ajuste=function(pre,W,H,bw,bh){var a=K.avance('VT,monospace');var fs=Math.min(bw/(W*a),bh/H);pre.style.fontSize=Math.max(4,Math.floor(fs*10)/10)+'px';return fs;};
/* Case touchée */
K.caseDe=function(pre,W,H,e){var r=pre.getBoundingClientRect();return {x:Math.floor((e.clientX-r.left)/(r.width/W)),y:Math.floor((e.clientY-r.top)/(r.height/H))};};
/* Décodage à l'ouverture : chaque signe passe par des signes au hasard puis se fixe */
var SIGNES='!"#$%&()*+,-./:;<=>?@[\\]^_{|}~';
K.decode=function(g,t,duree){var p=t/duree;if(p>=1.25)return false;
  for(var y=0;y<g.H;y++)for(var x=0;x<g.W;x++){var i=y*g.W+x;if(g.ch[i]===' ')continue;
    var d=(y/g.H)*.7+(((Math.sin(x*12.9898+y*78.233)*43758.5453)%1+1)%1)*.3;
    if(d>p){g.ch[i]=d>p+.12?' ':SIGNES[(Math.random()*SIGNES.length)|0];}}
  return true;};
K.reduit=matchMedia('(prefers-reduced-motion:reduce)').matches;
})();
