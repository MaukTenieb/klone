/* son.js : la mécanique de la borne, en enregistrements réels du domaine public (snd/SOURCES.md).
   Coupé à l'arrivée ; la note barrée ouvre le son. Chaque geste tire une prise au hasard, hauteur et volume légèrement changés. */
(function(){
'use strict';
var BANQUE={hum:1,coin:3,drop:4,press:5,release:6,detent:9,neon:3,power:1,crt:3},C=null,B={},maitre=null,ronron=null,on=false;
try{on=localStorage.getItem('klone:son')==='1';}catch(e){}
function fmt(){var a=document.createElement('audio');return a.canPlayType&&a.canPlayType('audio/ogg; codecs="opus"')?'ogg':'mp3';}
function charge(){if(C)return;C=new (window.AudioContext||window.webkitAudioContext)();maitre=C.createGain();maitre.gain.value=.8;maitre.connect(C.destination);var f=fmt();
  Object.keys(BANQUE).forEach(function(k){B[k]=[];for(var i=1;i<=BANQUE[k];i++)(function(i){fetch('snd/'+k+'-'+i+'.'+f).then(function(r){return r.arrayBuffer();}).then(function(a){return C.decodeAudioData(a);}).then(function(b){B[k][i-1]=b;if(k==='hum')fond();});})(i);});}
function fond(){if(!on||ronron||!B.hum||!B.hum[0])return;var s=C.createBufferSource(),g=C.createGain();s.buffer=B.hum[0];s.loop=true;g.gain.value=.22;s.connect(g);g.connect(maitre);s.start();ronron={s:s,g:g};}
function joue(k,vol){if(!on||!C||!B[k])return;var l=B[k].filter(Boolean);if(!l.length)return;var s=C.createBufferSource(),g=C.createGain();
  s.buffer=l[Math.floor(Math.random()*l.length)];s.playbackRate.value=.96+Math.random()*.08;g.gain.value=(vol||1)*(.85+Math.random()*.3);s.connect(g);g.connect(maitre);s.start();}
function bascule(){on=!on;try{localStorage.setItem('klone:son',on?'1':'0');}catch(e){}
  if(on){charge();if(C.state==='suspended')C.resume();fond();joue('power',.6);}else if(ronron){ronron.s.stop();ronron=null;}dessine();}
var bt=document.createElement('button');bt.className='picto son';bt.setAttribute('aria-label','Son');
function dessine(){bt.setAttribute('aria-pressed',on);bt.innerHTML='<span class="note">♪</span>'+(on?'':'<span class="barre"></span>');}
bt.onclick=bascule;dessine();document.body.appendChild(bt);
/* au premier geste, la page a le droit de jouer : le son reprend s'il était ouvert */
addEventListener('pointerdown',function(){if(on){charge();if(C.state==='suspended')C.resume();fond();}},{once:true});
window.SON={joue:joue};
})();
