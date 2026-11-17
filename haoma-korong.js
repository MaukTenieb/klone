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
var N={vx:0,vz:0,vu:-1,pres:[]};
function naphta(c,px,pz,draw){var g=G(),e=g.e,v=Math.hypot(e.puck_vx,e.puck_vz),chg=Math.sign(e.puck_vx)!==Math.sign(N.vx)||Math.sign(e.puck_vz)!==Math.sign(N.vz);
  if(chg&&(N.vx||N.vz)){N.vu=g.t+.22;N.pres.push({x:px,z:pz,t:g.t});if(N.pres.length>6)N.pres.shift();}
  N.vx=e.puck_vx;N.vz=e.puck_vz;
  N.pres=N.pres.filter(function(q){return g.t-q.t<3.2;});
  N.pres.forEach(function(q){huile(c,q.x,q.z,1-(g.t-q.t)/3.2,g.t-q.t);});
  if(v<38||g.t<N.vu||!e.running)draw(c,px,pz);}
/* une tache d'huile posée sur la table : noire, luisante, cernée d'irisations ; elle s'étale un peu puis sèche */
var PKV=(330-128)/(330-30);function pky(y){return 330-(330-y)*PKV;}
function huile(c,x,z,a,age){var s=G().e.p.puck_size*(2.3+Math.min(1,age*.6)),p0=project(x,FLOOR_Y,z),pl=project(x-s,FLOOR_Y,z),pf=project(x,FLOOR_Y,z+s),pn=project(x,FLOOR_Y,z-s);
  var cx=p0[0],cy=pky(p0[1]),rx=Math.abs(p0[0]-pl[0]),ry=Math.max(2.2,Math.abs(pky(pn[1])-pky(pf[1]))/2);
  c.save();c.globalAlpha=Math.max(0,a);
  var gr=c.createRadialGradient(cx,cy,0,cx,cy,rx);gr.addColorStop(0,'rgba(6,5,8,.92)');gr.addColorStop(.72,'rgba(10,8,14,.85)');gr.addColorStop(1,'rgba(10,8,14,0)');
  c.fillStyle=gr;c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,6.2832);c.fill();
  for(var k=0;k<3;k++){c.strokeStyle='hsla('+((age*90+k*110)%360)+',70%,55%,'+(.35*a)+')';c.lineWidth=.6;c.beginPath();c.ellipse(cx+k*.3,cy,rx*(.62+k*.09),ry*(.62+k*.09),0,.4+k,2.6+k);c.stroke();}
  c.fillStyle='rgba(255,255,255,'+(.35*a)+')';c.beginPath();c.ellipse(cx-rx*.3,cy-ry*.25,rx*.18,ry*.12,0,0,6.2832);c.fill();
  c.restore();}
/* ---------- Poisoned Well ---------- */
var P={on:false,x:0,z:0,vx:0,vz:0,t:-1,lastvz:0};
function puits(c,px,pz,draw){var g=G(),e=g.e;
  /* une frappe du Mask : le palet repart vers toi (vz devient négatif) */
  if(e.puck_vz<0&&P.lastvz>=0&&e.puck_z>e.p.back*.55){P.on=true;P.x=e.puck_x;P.z=e.puck_z;P.vx=-e.puck_vx||(e.puck_vx>=0?-60:60);P.vz=e.puck_vz;P.t=e.t;}
  P.lastvz=e.puck_vz;
  if(P.on){while(P.t<e.t){P.t++;P.x+=P.vx;P.z+=P.vz;var s=e.p.puck_size,k=e.p.rail_keep;if(P.x<s-250){P.x=s-250;P.vx=-Math.trunc(P.vx*k/100);}if(P.x>250-s){P.x=250-s;P.vx=-Math.trunc(P.vx*k/100);}}
    if(P.z<e.pad_z||P.z<0||e.puck_vz>=0||e.crack_hold>0)P.on=false;else draw(c,P.x,P.z);}
  draw(c,px,pz);}
window.HOM_PUCK=function(c,px,pz,draw){if(!ON)return draw(c,px,pz);var m=id();
  if(m==='naphta')return naphta(c,px,pz,draw);
  if(m==='poisoned_well')return puits(c,px,pz,draw);
  return draw(c,px,pz);};
window.HOM_TRAIL=function(){return !(ON&&id()==='naphta');};
var tape='';addEventListener('keydown',function(e){if(!e.key||e.key.length!==1)return;tape=(tape+e.key.toUpperCase()).slice(-8);if(tape==='KALABASS'){tape='';ON=!ON;}},true);
window.HAOMAK={on:function(v){if(v!==undefined)ON=v;return ON;}};
})();
