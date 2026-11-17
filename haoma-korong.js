/* haoma-korong.js : Haoma dans Korong!. Boire le Haoma, c'est percevoir la partie avec la loi du Mask d'en face.
   Naphta, « Presence is the essence of power » : seul l'immobile existe. Le palet n'apparaît qu'aux instants où sa course change
   (bande, raquette) ou quand il ralentit ; il laisse là une présence qui s'efface, pendant que le vrai file, invisible.
   Poisoned Well, « Words are venom. Honey is the pus of the real » : deux palets après chacune de ses frappes ; le faux suit la course
   que ton réflexe attend, le vrai dévie. Seul le vrai sonne contre la bande.
   Entrée du brouillon : taper KALABASS, ou #haoma dans l'adresse. */
(function(){
'use strict';
var ON=/haoma/i.test(location.hash);
function G(){return window.__pk&&window.__pk();}
function id(){var g=G();return g&&g.r&&g.r.id;}
/* ---------- Naphta ---------- */
var AC=null;function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC;}
addEventListener('pointerdown',ac,{once:false});
function plop(x){var a=ac();if(!a)return;var t=a.currentTime,o=a.createOscillator(),g=a.createGain(),p=a.createStereoPanner?a.createStereoPanner():null;
  o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(70,t+.06);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.35,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+.07);
  o.connect(g);if(p){p.pan.value=Math.max(-1,Math.min(1,x/250));g.connect(p);p.connect(a.destination);}else g.connect(a.destination);o.start(t);o.stop(t+.08);}
var N={vx:0,vz:0,vu:-1,pres:[],der:-9,dx:0,dz:0};
function naphta(c,px,pz,draw){var g=G(),e=g.e,v=Math.hypot(e.puck_vx,e.puck_vz),chg=Math.sign(e.puck_vx)!==Math.sign(N.vx)||Math.sign(e.puck_vz)!==Math.sign(N.vz);
  var parcours=Math.hypot(px-N.dx,pz-N.dz),pose=(chg&&(N.vx||N.vz))||(e.running&&e.crack_hold===0&&v>0&&((parcours>e.p.back*.18&&g.t-N.der>.12)||g.t-N.der>.45));
  if(pose&&N.pres.some(function(q){return Math.hypot(q.x-px,q.z-pz)<e.p.puck_size*4.2;})&&!chg)pose=false;
  if(pose){N.der=g.t;N.dx=px;N.dz=pz;if(chg)N.vu=g.t+.18;N.pres.push({x:px,z:pz,t:g.t,vx:e.puck_vx,vz:e.puck_vz});while(N.pres.length>6)N.pres.shift();plop(px);}
  N.vx=e.puck_vx;N.vz=e.puck_vz;
  N.pres=N.pres.filter(function(q){return g.t-q.t<1.8;});
  N.pres.forEach(function(q){huile(c,q,g.t-q.t);});
  if(v<38||g.t<N.vu||!e.running){c.save();c.shadowColor='transparent';draw(c,px,pz);c.restore();}}
var PKV=(330-128)/(330-30);function pky(y){return 330-(330-y)*PKV;}
function ecran(x,z){var d=z+FOCAL;return [ORIGIN_H+x*FOCAL/d,ORIGIN_V+FLOOR_Y*FOCAL/d];}
/* une tache d'huile : cœur noir à 90 %, liseré irisé jusqu'à 1,2 s, puis le noir sèche jusqu'à 3 s en se rétractant à 70 % ; trois gouttes indiquent le cap */
function huile(c,q,age){var e=G().e,s=e.p.puck_size*2*(age<1.2?1:1-.3*(age-1.2)/1.8),P=ecran(q.x,q.z),Pl=ecran(q.x-s,q.z),Pf=ecran(q.x,q.z+s),Pn=ecran(q.x,q.z-s);
  var rx=Math.max(Math.abs(P[0]-Pl[0]),17),ry=Math.max(7,Math.abs(Pn[1]-Pf[1])/2),noir=age<1.2?.82:.82*Math.max(0,1-(age-1.2)/.6);
  /* bord irrégulier, propre à chaque flaque : rayon modulé par trois harmoniques tirées de sa naissance */
  var sd=q.t*977.13,h1=Math.sin(sd)*43758.5453%1,h2=Math.sin(sd*1.7)*12345.678%1,h3=Math.sin(sd*2.3)*9876.54%1;
  c.save();c.beginPath();for(var k=0;k<=40;k++){var th=k/40*6.2832,m=1+.13*Math.sin(3*th+h1*6)+.08*Math.sin(5*th+h2*6)+.05*Math.sin(7*th+h3*6);var X=P[0]+Math.cos(th)*rx*m,Y=P[1]+Math.sin(th)*ry*m;if(k)c.lineTo(X,Y);else c.moveTo(X,Y);}c.closePath();
  /* l'huile assombrit le bois sans le cacher : fond translucide en multiplication */
  c.globalCompositeOperation='multiply';c.filter='blur(1.2px)';var mg=c.createRadialGradient(P[0],P[1],0,P[0],P[1],rx*1.1);mg.addColorStop(0,'rgba(70,56,44,'+(noir*.5)+')');mg.addColorStop(.7,'rgba(46,36,28,'+(noir*.78)+')');mg.addColorStop(1,'rgba(40,30,24,'+(noir*.85)+')');c.fillStyle=mg;c.fill();c.filter='none';
  c.globalCompositeOperation='source-over';
  /* irisation faible, au bord seulement, et un reflet rasant */
  if(age<1.2){var ir=.3*(1-age/1.2*.5);try{var cg=c.createConicGradient(h1*6+age*.8,P[0],P[1]);cg.addColorStop(0,'rgba(80,200,210,'+ir+')');cg.addColorStop(.35,'rgba(170,90,190,'+ir+')');cg.addColorStop(.65,'rgba(210,180,70,'+ir+')');cg.addColorStop(1,'rgba(80,200,210,'+ir+')');c.strokeStyle=cg;}catch(x){c.strokeStyle='rgba(170,90,190,'+ir+')';}
    /* arc irisé en spectre fin : violet, vert, or, sur un cinquième du pourtour */
    var a0=h2*6.2832,HU=[285,250,190,130,95,60,45];c.lineWidth=1.6;
    for(var k=0;k<HU.length;k++){var t0=a0+k*.18,t1=t0+.2;c.strokeStyle='hsla('+HU[k]+',85%,62%,'+(ir*1.5)+')';c.beginPath();c.ellipse(P[0],P[1],rx*.93,ry*.93,0,t0,t1);c.stroke();}
    /* reflet dans l'axe de la course : étroit, vertical à l'écran */
    var rf=c.createLinearGradient(0,P[1]-ry*.7,0,P[1]+ry*.4);rf.addColorStop(0,'rgba(255,246,230,0)');rf.addColorStop(.5,'rgba(255,246,230,'+(ir*1.4)+')');rf.addColorStop(1,'rgba(255,246,230,0)');
    c.fillStyle=rf;c.beginPath();c.ellipse(P[0]-rx*.28,P[1]-ry*.1,Math.max(.9,rx*.07),ry*.55,0,0,6.2832);c.fill();}
  c.restore();c.save();
  var vn=Math.hypot(q.vx,q.vz)||1;for(var k=1;k<=3;k++){var D=ecran(q.x+q.vx/vn*s*(1+k*.55),q.z+q.vz/vn*s*(1+k*.55)),r=Math.max(.8,2.2-k*.45);c.fillStyle='rgba(10,10,12,'+(noir*(1-k*.2))+')';c.beginPath();c.ellipse(D[0],D[1],r*1.6,r*.8,0,0,6.2832);c.fill();}
  c.restore();}
/* ---------- Poisoned Well ---------- */
var P={on:false,x:0,z:0,vx:0,vz:0,t:-1,lastvz:0,n0:0,miel:null};
function aspire(){var a=ac();if(!a)return;var t=a.currentTime,n=a.createBufferSource(),b=a.createBuffer(1,a.sampleRate*.12,a.sampleRate),d=b.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
  var f=a.createBiquadFilter(),g=a.createGain();f.type='lowpass';f.frequency.setValueAtTime(900,t);f.frequency.exponentialRampToValueAtTime(200,t+.12);g.gain.value=.25;n.buffer=b;n.connect(f);f.connect(g);g.connect(a.destination);n.start(t);}
function gros(c,x,z,draw,teinte){var Q=ecran(x,z);c.save();c.translate(Q[0],Q[1]);c.scale(1.15,1.15);c.translate(-Q[0],-Q[1]);if(teinte){c.filter='saturate(.55) hue-rotate(-18deg) brightness(.92)';c.shadowBlur=0;}draw(c,x,z);c.restore();}
function puits(c,px,pz,draw){var g=G(),e=g.e;
  if(e.puck_vz<0&&P.lastvz>=0&&e.puck_z>e.p.back*.55){var n=Math.max(4,(e.puck_z-e.p.back/2)/Math.abs(e.puck_vz||1)),fvx=-e.puck_vx;
    if(Math.abs(fvx-e.puck_vx)*n<175){var sgn=e.puck_x>0?-1:1;fvx=e.puck_vx+sgn*175/n;}
    P.on=true;P.x=e.puck_x;P.z=e.puck_z;P.vx=fvx;P.vz=e.puck_vz;P.t=e.t;P.n0=e.t+6;P.miel=null;}
  P.lastvz=e.puck_vz;
  /* l'ombre du vrai : 2 px vers la lampe, contraste sous 15 % */
  var R=ecran(px,pz);c.save();c.fillStyle='rgba(28,18,12,.62)';c.beginPath();c.ellipse(R[0]-1,R[1]+2.5,11,3.4,0,0,6.2832);c.fill();c.restore();
  if(P.on){while(P.t<e.t){P.t++;if(P.t<P.n0){P.x=e.puck_x;P.z=e.puck_z;continue;}P.x+=P.vx;P.z+=P.vz;var s=e.p.puck_size,k=e.p.rail_keep;if(P.x<s-250){P.x=s-250;P.vx=-Math.trunc(P.vx*k/100);}if(P.x>250-s){P.x=250-s;P.vx=-Math.trunc(P.vx*k/100);}}
    var touche=P.z<e.pad_z+e.p.puck_size&&Math.abs(P.x-e.pad_x)<e.p.pad_size+e.p.puck_size;
    if(touche||P.z<0||e.crack_hold>0||e.puck_vz>=0){if(touche||P.z<0){P.miel={x:P.x,z:Math.max(0,P.z),t:g.t};aspire();}P.on=false;}
    else gros(c,P.x,P.z,draw,true);}
  if(P.miel){var age=g.t-P.miel.t;if(age<.25){var M=ecran(P.miel.x,P.miel.z),r=12+age*70;c.save();c.fillStyle='rgba(217,162,27,'+(1-age/.25)+')';for(var k2=0;k2<7;k2++){var an=k2*.9+P.miel.t;c.beginPath();c.ellipse(M[0]+Math.cos(an)*r,M[1]+Math.sin(an)*r*.35,5.5,3,0,0,6.2832);c.fill();}c.beginPath();c.ellipse(M[0],M[1],12,5,0,0,6.2832);c.fill();c.restore();}else P.miel=null;}
  gros(c,px,pz,draw,true);}
/* ---------- C7H5N3O6, « Efficiency is... », ne quitte jamais sa ligne : le monde réduit à une seule ligne ----------
   Tout le cadre du jeu tombe au noir. Reste une rangée : la ligne de ta raquette. Le palet y projette son ombre ;
   plus il approche, plus l'ombre s'élargit et s'éclaire. Ta raquette y figure en barre crème. Au but, la ligne casse. */
var ov=null,oc=null;
function cadre(){var cv=document.getElementById('cv');if(!cv)return null;var r=cv.getBoundingClientRect(),W=512,H=343,cw=Math.min(r.width,r.height*W/H),ch=Math.min(r.height,r.width*H/W);
  if(!ov){ov=document.createElement('canvas');ov.style.cssText='position:fixed;pointer-events:none;z-index:2147483000';document.documentElement.appendChild(ov);oc=ov.getContext('2d');}
  var d=Math.min(2,devicePixelRatio||1),L=r.left+(r.width-cw)/2,T=r.top+(r.height-ch)/2;ov.style.left=L+'px';ov.style.top=T+'px';ov.style.width=cw+'px';ov.style.height=ch+'px';
  var w=Math.round(cw*d),h=Math.round(ch*d);if(ov.width!==w||ov.height!==h){ov.width=w;ov.height=h;}oc.setTransform(w/W,0,0,h/H,0,0);return true;}
function ligne(){requestAnimationFrame(ligne);var g=G();
  var on=ON&&g&&g.e&&id()==='c7h5n3o6'&&!document.getElementById('game').hidden;if(!on){if(ov)ov.style.display='none';return;}
  if(!cadre())return;ov.style.display='block';var e=g.e,c=oc;c.fillStyle='#050506';c.fillRect(0,0,512,343);
  var pz=e.pad_z,p0=project(-250,FLOOR_Y,pz),p1=project(250,FLOOR_Y,pz),y=pky(p0[1]);
  /* la ligne : rangée de 2 px, grain de phosphore */
  for(var x=Math.floor(p0[0]);x<p1[0];x+=3){var n=Math.sin(x*12.9898+g.t*40)*43758.5453;n-=Math.floor(n);c.fillStyle='rgba(255,167,38,'+(.14+.12*n)+')';c.fillRect(x,y-.75,1.5,1.5);}
  (window.__C7=window.__C7||[]).push([e.puck_x,g.t]);window.__C7=window.__C7.filter(function(q){return g.t-q[1]<.4;});
  if(e.crack_hold>0){for(var k=0;k<22;k++){var xx=p0[0]+Math.random()*(p1[0]-p0[0]);c.fillStyle='#ffe3a0';c.fillRect(xx,y-2+(Math.random()-.5)*14,2.5+Math.random()*12,2.5);}return;}
  /* l'ombre du palet : position latérale réelle, largeur et éclat selon la distance */
  var dist=Math.max(0,Math.min(1,(e.puck_z-pz)/e.p.back)),near=1-dist,q=project(e.puck_x,FLOOR_Y,pz),L0=p1[0]-p0[0],half=L0*(.05+.075*near*near),lum=.35+.65*near*near;
  window.__C7.forEach(function(r){var qq=project(r[0],FLOOR_Y,pz),a=(1-(g.t-r[1])/.4)*.25*lum;c.fillStyle='rgba(255,167,38,'+a+')';c.fillRect(qq[0]-1,y-1.5,2,3);});
  var gr=c.createLinearGradient(q[0]-half,0,q[0]+half,0);gr.addColorStop(0,'rgba(255,167,38,0)');gr.addColorStop(.5,'rgba(255,'+Math.round(167+60*near)+','+Math.round(38+120*near)+','+lum+')');gr.addColorStop(1,'rgba(255,167,38,0)');
  c.fillStyle=gr;c.fillRect(q[0]-half,y-1.5-near*3,half*2,3+near*6);c.fillStyle='rgba(255,227,160,.55)';c.fillRect(q[0]-1,y-1,2,2);
  /* ta raquette */
  var a=project(e.pad_x-e.p.pad_size,FLOOR_Y,pz),b=project(e.pad_x+e.p.pad_size,FLOOR_Y,pz);c.fillStyle='rgba(236,230,226,.7)';c.fillRect(a[0],y+3,b[0]-a[0],1.2);}
requestAnimationFrame(ligne);
window.HOM_PUCK=function(c,px,pz,draw){if(!ON)return draw(c,px,pz);var m=id();
  if(m==='naphta')return naphta(c,px,pz,draw);
  if(m==='poisoned_well')return puits(c,px,pz,draw);
  return draw(c,px,pz);};
window.HOM_TRAIL=function(){return !(ON&&id()==='naphta');};
var tape='';addEventListener('keydown',function(e){if(!e.key||e.key.length!==1)return;tape=(tape+e.key.toUpperCase()).slice(-8);if(tape==='KALABASS'){tape='';ON=!ON;}},true);
window.HAOMAK={on:function(v){if(v!==undefined)ON=v;return ON;}};
})();
