/* motel.js : la chambre du Motel Korhogo, une scène 3D rendue en pixels puis en texte.
   Deux caméras pour une même scène : 'face' (perspective, à hauteur d'yeux) et 'iso' (maison de poupée). */
(function(){
'use strict';
var MODE=document.body.getAttribute('data-camera')||'face';
var PW=MODE==='iso'?176:192,PH=MODE==='iso'?132:128;
var scr=new A.Ecran(document.getElementById('m'),PW,PH),rampe=A.rampe,bay=A.bay,hash=A.hash;
var SALLE='#0b0908',TRAIT='#140a06';
var R={
 mur:['#160c05','#2e1a0a','#4c2e12','#704818','#946222','#b47e30','#d69e46','#efc472'],
 plafond:['#0e0804','#1c1008','#2e1c0e','#46301a'],
 moquette:['#120303','#260606','#400b0a','#5e120e','#801a14','#a4261a','#c43a24'],
 bois:['#0e0603','#1e1008','#341c0e','#4e2c16','#6c4020','#8c582c'],
 creme:['#221a12','#4a3c2a','#7a6a50','#b09c7a','#dccaa2','#f2e4c2'],
 rouge:['#1e0606','#40100c','#6c1c14','#9c2c1e','#c84030'],
 bleu:['#06080e','#10162a','#1c2a48','#2e4270'],
 rideau:['#1c0505','#3a0d0a','#621812','#8e261a','#b83424'],
 nuit:['#03050a','#070c18','#0e1830','#1a2a4a'],
 tole:['#0c0b0e','#1a181e','#2c2830','#45404a','#6a6270']
};
function v3(x,y,z){return [x,y,z];}
function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function add(a,b){return [a[0]+b[0],a[1]+b[1],a[2]+b[2]];}
function mul(a,k){return [a[0]*k,a[1]*k,a[2]*k];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function norm(a){var l=Math.sqrt(dot(a,a))||1;return [a[0]/l,a[1]/l,a[2]/l];}
/* ===== La scène ===== */
var F=[];/* faces : {o,eu,ev,lu,lv,n,mat,id,trait} */
function quad(o,eu,ev,lu,lv,mat,id,trait){var n=norm(cross(eu,ev));F.push({o:o,eu:norm(eu),ev:norm(ev),lu:lu,lv:lv,n:n,mat:mat,id:id||null,trait:trait!==false});}
/* boîte : les six faces, normales vers l'extérieur */
function boite(x0,x1,y0,y1,z0,z1,mat,id){var w=x1-x0,h=y1-y0,d=z1-z0;
  quad(v3(x0,y0,z1),[1,0,0],[0,1,0],w,h,mat.avant||mat,id);            /* avant (+z) */
  quad(v3(x1,y0,z0),[-1,0,0],[0,1,0],w,h,mat.arriere||mat,id);         /* arrière */
  quad(v3(x0,y1,z1),[1,0,0],[0,0,-1],w,d,mat.dessus||mat,id);          /* dessus */
  quad(v3(x0,y0,z0),[1,0,0],[0,0,1],w,d,mat.dessous||mat,id);          /* dessous */
  quad(v3(x0,y0,z0),[0,0,1],[0,1,0],d,h,mat.gauche||mat,id);           /* gauche (-x) */
  quad(v3(x1,y0,z1),[0,0,-1],[0,1,0],d,h,mat.droite||mat,id);}         /* droite (+x) */
function M(r,k,tex){return {r:r,k:k||1,tex:tex};}
var X0=-3,X1=3,Y1=2.6,Z0=-7,Z1=0;
/* pièce : les normales regardent vers l'intérieur */
quad(v3(X0,0,Z1),[1,0,0],[0,0,-1],6,7,M(R.moquette,1,'poil'),null,false);                 /* sol */
quad(v3(X0,0,Z0),[1,0,0],[0,1,0],6,Y1,M(R.mur,1,'enduit'),null,false);                    /* fond */
quad(v3(X0,0,Z1),[0,0,-1],[0,1,0],7,Y1,M(R.mur,1,'enduit'),null,false);                   /* mur gauche */
if(MODE==='face'){
  quad(v3(X1,0,Z0),[0,0,1],[0,1,0],7,Y1,M(R.mur,1,'enduit'),null,false);                  /* mur droit */
  quad(v3(X0,Y1,Z0),[1,0,0],[0,0,1],6,7,M(R.plafond,1),null,false);}                       /* plafond */
/* plinthes */
boite(X0,X1,0,.12,Z0,Z0+.04,M(R.bois,.9));boite(X0,X0+.04,0,.12,Z0,Z1,M(R.bois,.9));
if(MODE==='face')boite(X1-.04,X1,0,.12,Z0,Z1,M(R.bois,.9));
/* porte, mur gauche */
boite(X0,X0+.06,0,2.05,-2.6,-1.6,M(R.bois,1,'porte'),'porte');
boite(X0+.06,X0+.1,1,1.06,-2.5,-2.4,M(R.tole,1.4),'porte');
/* fenêtre et rideaux, au fond */
quad(v3(-2.0,1.05,Z0+.01),[1,0,0],[0,1,0],1.25,1.05,M(R.nuit,1,'fenetre'),'fenetre',false);
boite(-2.32,-1.94,.95,2.25,Z0+.02,Z0+.18,M(R.rideau,1,'plis'));boite(-.81,-.43,.95,2.25,Z0+.02,Z0+.18,M(R.rideau,1,'plis'));
boite(-2.42,-.33,2.25,2.3,Z0+.02,Z0+.2,M(R.bois,1));
/* lit, couverture tissée */
var tissu={avant:M(R.creme,1,'navajo'),dessus:M(R.creme,1,'navajo'),gauche:M(R.creme,1,'navajo'),droite:M(R.creme,1,'navajo'),arriere:M(R.bois),dessous:M(R.bois)};
boite(-2.75,-1.35,.18,.58,-6.85,-3.6,tissu,'lit');
boite(-2.75,-1.35,0,.18,-6.85,-3.6,M(R.bois,.8),'lit');
boite(-2.65,-2.08,.58,.72,-6.8,-6.35,M(R.creme,1.15),'lit');boite(-2.02,-1.45,.58,.72,-6.8,-6.35,M(R.creme,1.15),'lit');
/* tapis, valise, chaussures */
quad(v3(-1.0,.005,-2.2),[1,0,0],[0,0,-1],1.9,1.3,M(R.creme,.95,'navajo'),null,true);
boite(-2.85,-2.1,0,.55,-1.4,-1.05,M(['#120806','#2a1408','#4a2410','#6e3818','#94502a'],1,'valise'),'valise');
boite(-2.55,-2.4,.55,.62,-1.3,-1.15,M(R.tole,1.3),'valise');
boite(-1.2,-1.02,0,.08,-3.0,-2.72,M(R.bois,.8));boite(-.98,-.8,0,.08,-2.95,-2.67,M(R.bois,.8));
/* commode et télé */
boite(1.05,2.75,0,.82,-6.95,-6.2,M(R.bois,1,'tiroirs'),'commode');
boite(1.25,2.55,.82,1.72,-6.9,-6.25,{avant:M(R.bois,1,'ecran'),dessus:M(R.bois),gauche:M(R.bois),droite:M(R.bois),arriere:M(R.bois),dessous:M(R.bois)},'tele');
/* antenne */
var ANT=[[1.9,1.72,-6.6,1.55,2.15,-6.6],[1.9,1.72,-6.6,2.3,2.1,-6.6]];
/* appliques */
var LUM=[{p:v3(-.02,1.95,Z0+.15),i:1.25,c:'#ffe3a0'},{p:v3(1.35,1.95,Z0+.15),i:1.25,c:'#ffe3a0'},{p:v3(1.9,1.25,-6.0),i:.5,c:'#9fd8ff'}];
LUM.slice(0,2).forEach(function(l){boite(l.p[0]-.16,l.p[0]+.16,l.p[1]-.2,l.p[1]+.12,Z0+.01,Z0+.14,M(['#b08040','#ffd27a','#ffe3a0','#fff4d0'],1,'emet'),'lampe');F.slice(-6).forEach(function(f){f.trait=false;});});
/* portrait au mur : Unkle Maukie */
boite(.22,1.12,1.28,2.3,Z0+.01,Z0+.05,{avant:M(R.bois,1,'portrait'),dessus:M(R.bois),gauche:M(R.bois),droite:M(R.bois),arriere:M(R.bois),dessous:M(R.bois)},'portrait');
/* ===== Caméras ===== */
var cam={};
function camera(px,py){
  if(MODE==='face'){var C=v3(.1+px*.5,1.55+py*.16,-.8),cible=v3(px*.25,1.05,-7),f=norm(sub(cible,C)),r=norm(cross(f,[0,1,0])),u=cross(r,f);
    cam={C:C,f:f,r:r,u:u,F:PW*.56,cx:PW/2,cy:PH*.44,ortho:false};}
  else{var yaw=Math.PI/4,pit=Math.asin(Math.tan(Math.atan(.5))),f2=norm([-Math.sin(yaw)*Math.cos(pit),-Math.sin(pit),-Math.cos(yaw)*Math.cos(pit)]),r2=norm(cross(f2,[0,1,0])),u2=cross(r2,f2);
    cam={C:v3(4,6,3),f:f2,r:r2,u:u2,S:PW/9.3,cx:PW/2+3,cy:PH*.5,ortho:true,centre:v3(0,1.1,-3.5)};}
}
function projette(p){var v=sub(p,cam.ortho?cam.centre:cam.C),x=dot(v,cam.r),y=dot(v,cam.u),z=dot(v,cam.f);
  if(cam.ortho)return [cam.cx+x*cam.S,cam.cy-y*cam.S,z+50];
  return [cam.cx+cam.F*x/z,cam.cy-cam.F*y/z,z];}
function rayon(sx,sy){if(cam.ortho){var o=add(cam.centre,add(mul(cam.r,(sx-cam.cx)/cam.S),mul(cam.u,-(sy-cam.cy)/cam.S)));return {o:add(o,mul(cam.f,-50)),d:cam.f};}
  return {o:cam.C,d:add(cam.f,add(mul(cam.r,(sx-cam.cx)/cam.F),mul(cam.u,-(sy-cam.cy)/cam.F)))};}
/* ===== Lumière ===== */
var tvI=.5,chaine=0;
function eclaire(p,n){var L=.1;for(var i=0;i<LUM.length;i++){var l=sub(LUM[i].p,p),d2=dot(l,l),d=Math.sqrt(d2),lam=Math.max(0,dot(n,l)/d);
  L+=(i===2?tvI:LUM[i].i)*(.25+.75*lam)/(1+d2*.32);}return L;}
/* ===== Matières ===== */
var MN=window.MINIS?Object.keys(MINIS):[];
function couleur(fc,p,u,v,x,y,t){var m=fc.mat,L=eclaire(p,fc.n)*m.k,r=m.r;
  switch(m.tex){
  case 'valise':if(Math.abs(v-.5)<.06||Math.abs(u-.5)<.04)return rampe(R.tole,L*1.2,x,y);return rampe(r,L,x,y);
  case 'emet':return rampe(r,.55+.45*v+.2*Math.sin(t/700),x,y);
  case 'poil':L*=.8+.4*hash(Math.floor(u*22),Math.floor(v*22));return rampe(r,L,x,y);
  case 'enduit':L*=.95+.1*hash(Math.floor(u*5),Math.floor(v*7));if(v<.12)return rampe(R.bois,L,x,y);return rampe(r,L,x,y);
  case 'navajo':var s=v*4.5+Math.abs(((u*4)%2+2)%2-1)*.9,b=((Math.floor(s)%4)+4)%4;return rampe([R.creme,R.rouge,R.bleu,R.creme][b],L*(b===3?.8:1),x,y);
  case 'plis':return rampe(r,L*(.7+.45*Math.abs(Math.sin(u*28))),x,y);
  case 'fenetre':if(Math.abs(u-.65)<.03||Math.abs(v-.52)<.03)return rampe(R.bois,L,x,y);return rampe(r,.35+.25*v+(hash(Math.floor(u*30),Math.floor(v*30))>.985?2:0),x,y);
  case 'porte':if(u>.08&&u<.92&&((v>.12&&v<.9)&&(Math.abs(v-.5)<.02||u<.12||u>.88)))return rampe(r,L*.6,x,y);return rampe(r,L,x,y);
  case 'tiroirs':if(fc.n[2]>.9&&(Math.abs(v-.27)<.012||Math.abs(v-.55)<.012))return TRAIT;if(fc.n[2]>.9&&Math.abs(v-.42)<.02&&Math.abs(u-.85)<.08)return '#c8a050';return rampe(r,L,x,y);
  case 'ecran':if(fc.n[2]>.9&&u>.07&&u<.72&&v>.14&&v<.86){return tele(u,v,x,y,t);}
    if(fc.n[2]>.9&&u>.78&&u<.93&&v>.3&&v<.72)return ((Math.floor(v*20))&1)?'#3a2a20':'#1a120c';return rampe(r,L,x,y);
  case 'portrait':if(u>.08&&u<.72&&v>.08&&v<.82&&MN.length){var mi=MINIS.unkle_maukie||MINIS[MN[0]],pw=mi.pix[0].length,ph=mi.pix.length;
      var c=mi.pix[Math.min(ph-1,Math.floor((1-(v-.08)/.74)*ph))][Math.min(pw-1,Math.floor((u-.08)/.64*pw))];
      if(c==='.')return rampe(R.mur,L*.5,x,y);var h=mi.pal[c]||'#000000',k=Math.min(1.2,L*.9);var rgb=A.hex(h);return '#'+rgb.map(function(q){return ('0'+Math.min(255,Math.round(q*k)).toString(16)).slice(-2);}).join('');}
    return rampe(r,L,x,y);
  }
  return rampe(r,L,x,y);}
/* la télé : neige, ou un Mask sur sa chaîne */
function tele(u,v,x,y,t){var su=(u-.07)/.65,sv=(v-.14)/.72;
  if(chaine===0||!MN.length){var n=hash(x*7+Math.floor(t/60),y*13);return n>.62?'#cfe6ee':n>.35?'#5c7a88':'#10181c';}
  var mi=MINIS[MN[(chaine-1)%MN.length]],pw=mi.pix[0].length,ph=mi.pix.length,c=mi.pix[Math.min(ph-1,Math.floor((1-sv)*ph))][Math.min(pw-1,Math.floor(su*pw))];
  if(y%2===0&&hash(y,Math.floor(t/90))>.8)return '#9fd8ff';
  return c==='.'?'#0a1418':mixe(mi.pal[c]||'#000000');}
function mixe(h){var c=A.hex(h);return '#'+[c[0]*.7+30,c[1]*.85+40,c[2]*.95+55].map(function(q){return ('0'+Math.min(255,Math.round(q)).toString(16)).slice(-2);}).join('');}
/* ===== Rendu ===== */
/* plan proche : la face se coupe là où elle passe derrière l'œil */
function coupe(Pw){var N=.08,out=[];for(var i=0;i<Pw.length;i++){var a=Pw[i],b=Pw[(i+1)%Pw.length],da=dot(sub(a,cam.C),cam.f)-N,db=dot(sub(b,cam.C),cam.f)-N;
  if(da>=0)out.push(a);if((da>=0)!==(db>=0))out.push(add(a,mul(sub(b,a),da/(da-db))));}return out;}
var idmap=new Array(PW*PH);
function rendu(t){
  scr.vide(SALLE);scr.zb.fill(1e9);for(var i=0;i<idmap.length;i++)idmap[i]=null;
  var vue=cam.ortho?mul(cam.f,-1):null;
  F.forEach(function(fc){
    var ctr=add(fc.o,add(mul(fc.eu,fc.lu/2),mul(fc.ev,fc.lv/2)));
    var vv=cam.ortho?vue:sub(cam.C,ctr);if(dot(fc.n,vv)<=0)return;
    var W4=[fc.o,add(fc.o,mul(fc.eu,fc.lu)),add(add(fc.o,mul(fc.eu,fc.lu)),mul(fc.ev,fc.lv)),add(fc.o,mul(fc.ev,fc.lv))];
    if(!cam.ortho)W4=coupe(W4);if(W4.length<3)return;
    var P=W4.map(projette);
    var k0=dot(fc.n,fc.o);
    scr.poly(P,function(x,y){var ry=rayon(x+.5,y+.5),den=dot(fc.n,ry.d);if(Math.abs(den)<1e-6)return scr.px[y*PW+x];
      var s=(k0-dot(fc.n,ry.o))/den,p=add(ry.o,mul(ry.d,s)),z=cam.ortho?s:dot(sub(p,cam.C),cam.f),j=y*PW+x;
      if(z>scr.zb[j]-1e-4)return scr.px[j];scr.zb[j]=z;idmap[j]=fc.id;
      var q=sub(p,fc.o);return couleur(fc,p,dot(q,fc.eu)/fc.lu*(fc.mat.tex==='navajo'||fc.mat.tex==='poil'||fc.mat.tex==='enduit'||fc.mat.tex==='plis'?fc.lu:1),dot(q,fc.ev)/fc.lv*(fc.mat.tex==='navajo'||fc.mat.tex==='poil'||fc.mat.tex==='enduit'||fc.mat.tex==='plis'?fc.lv:1),x,y,t);});
  });
  /* trait épais : les arêtes des objets, cachées derrière ce qui les masque */
  var ACT={tele:1,portrait:1,porte:1};var lueur=['#6a3a10','#a0601a','#ffa726','#ffe3a0'][Math.floor((Math.sin(t/420)+1)*1.99)];
  F.forEach(function(fc){if(!fc.trait&&!ACT[fc.id])return;var trait=ACT[fc.id]?lueur:TRAIT;var ctr=add(fc.o,add(mul(fc.eu,fc.lu/2),mul(fc.ev,fc.lv/2))),vv=cam.ortho?vue:sub(cam.C,ctr);if(dot(fc.n,vv)<=0)return;
    var Pw=[fc.o,add(fc.o,mul(fc.eu,fc.lu)),add(add(fc.o,mul(fc.eu,fc.lu)),mul(fc.ev,fc.lv)),add(fc.o,mul(fc.ev,fc.lv))];
    for(var e=0;e<4;e++){var a=Pw[e],b=Pw[(e+1)%4],n=24;for(var s2=0;s2<=n;s2++){var p=add(a,mul(sub(b,a),s2/n)),q=projette(p),X=Math.round(q[0]-.5),Y=Math.round(q[1]-.5);
      if(X<0||Y<0||X>=PW||Y>=PH)continue;var z=cam.ortho?q[2]:q[2];if(z<=scr.zb[Y*PW+X]+.06)scr.px[Y*PW+X]=trait;}}});
  if(cam.ortho){var C1='#5a3a1c';[[X0,Y1,Z0,X1,Y1,Z0],[X0,Y1,Z0,X0,Y1,Z1],[X1,0,Z0,X1,Y1,Z0],[X0,0,Z1,X0,Y1,Z1]].forEach(function(a){var p=projette(v3(a[0],a[1],a[2])),q=projette(v3(a[3],a[4],a[5]));scr.ligne(p[0],p[1],q[0],q[1],C1);scr.ligne(p[0],p[1]-1,q[0],q[1]-1,'#8a5a2a');});}
  /* antenne */
  ANT.forEach(function(a){var p=projette(v3(a[0],a[1],a[2])),q=projette(v3(a[3],a[4],a[5]));scr.ligne(p[0],p[1],q[0],q[1],'#8a8290');});
  /* halo des appliques sur l'enduit, en trame */
  LUM.slice(0,2).forEach(function(l){var c=projette(l.p);for(var dy=-9;dy<=9;dy++)for(var dx=-14;dx<=14;dx++){var d=Math.sqrt(dx*dx/2+dy*dy*1.4),X=Math.round(c[0]+dx),Y=Math.round(c[1]+dy);
    if(d<9&&d>2&&X>=0&&Y>=0&&X<PW&&Y<PH&&idmap[Y*PW+X]===null&&scr.zb[Y*PW+X]>3&&bay(X,Y)<(9-d)/22)scr.px[Y*PW+X]='#efc472';}});
  scr.encode();
}
/* ===== Mouvement : la caméra suit le pointeur, en douceur ===== */
var tx=0,ty=0,cxv=0,cyv=0,der=0,t0=performance.now();
function boucle(){var t=performance.now();setTimeout(boucle,80);
  cxv+=(tx-cxv)*.18;cyv+=(ty-cyv)*.18;camera(cxv,cyv);
  tvI=.35+.25*hash(Math.floor(t/90),3);
  rendu(t-t0);
  if(!A.reduit&&t-t0<1000){/* le tube s'allume : la pièce sort du noir de haut en bas */}
}
document.getElementById('m').addEventListener('pointermove',function(e){var r=this.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*2;ty=-((e.clientY-r.top)/r.height-.5)*2;});
addEventListener('deviceorientation',function(e){if(e.gamma==null)return;tx=Math.max(-1,Math.min(1,e.gamma/25));ty=Math.max(-1,Math.min(1,(45-e.beta)/30));});
addEventListener('keydown',function(e){if(e.key==='ArrowLeft')tx=Math.max(-1,tx-.25);if(e.key==='ArrowRight')tx=Math.min(1,tx+.25);if(e.key==='ArrowUp')ty=Math.min(1,ty+.25);if(e.key==='ArrowDown')ty=Math.max(-1,ty-.25);
  if(e.key==='Enter'||e.key===' ')chaine=(chaine+1)%(MN.length+1);if(e.key==='Escape')location.href='./';});
function cherche(p){var best=null;for(var r=0;r<=6&&!best;r++)for(var dy=-r;dy<=r&&!best;dy++)for(var dx=-r;dx<=r;dx++){var X=p.x+dx,Y=p.y+dy;if(X<0||Y<0||X>=PW||Y>=PH)continue;var id=idmap[Y*PW+X];if(id==='tele'||id==='portrait'||id==='porte'){best=id;break;}}return best;}
document.getElementById('m').addEventListener('click',function(e){var id=cherche(scr.pixelDe(e));
  if(id==='tele')chaine=(chaine+1)%(MN.length+1);else if(id==='portrait')location.href='masks.html';else if(id==='porte')location.href='./';});
document.getElementById('m').addEventListener('mousemove',function(e){var id=cherche(scr.pixelDe(e));this.style.cursor=(id==='tele'||id==='portrait'||id==='porte')?'pointer':'default';});
addEventListener('resize',function(){scr.fit(.98,.92);});
document.fonts.load('8px UN').then(function(){scr.fit(.98,.92);camera(0,0);boucle();});
})();
