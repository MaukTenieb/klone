# Chaîne complète des Masks : réduction, fond, reprise à la main, contre-jour, cases
set -e;cd /home/claude/work/ansi;T=../tools;S=/home/claude/look
python3 $T/pixel.py $S/mask-unkle_maukie.png 120,250,720,900 112 12 um >/dev/null
python3 $T/pixel.py $S/mask-aube.png 40,190,700,900 112 12 au >/dev/null
ENCRE=14 TOLFOND=40 python3 $T/pixel.py $S/mask-honey_buzzard.png 20,60,700,820 112 12 hb >/dev/null
for m in um au; do python3 -c "import sys;m='$m';R=open(m+'.pix').read().rstrip('\n').split('\n');open(m+'.pix','w').write('\n'.join(R[:-5])+'\n')"; done
for m in um au hb; do python3 $T/fond.py $m.pix $m.pal.json; python3 $T/lumiere.py $m.pix $m.pal.json; done
python3 retouche_um.py
python3 retouche_hb.py
python3 - <<'Q'
import json
P=json.load(open('hb.pal.json'))
for k,v in P.items():
  if k in '.0' or not k.islower():continue
  r,g,b=(int(v[i:i+2],16) for i in (1,3,5));l=(r+g+b)/3
  if l<40:P[k]='#%02x%02x%02x'%(int(22+l*.5),int(26+l*.6),int(32+l*.8))
  if l>235:P[k]='#f2eee2'
json.dump(P,open('hb.pal.json','w'))
Q
python3 - <<'P'
import json
R=[list(r) for r in open('hb.pix').read().rstrip('\n').split('\n')]
for y in range(53,66):
  for x in range(44,76):
    if R[y][x]=='k':R[y][x]='v'
P=json.load(open('hb.pal.json'));P['k']='#2a2e2b';P['v']='#2f6e46'
open('hb.pix','w').write('\n'.join(''.join(r) for r in R)+'\n');json.dump(P,open('hb.pal.json','w'))
P
python3 $T/cases.py um.pix um.pal.json 'UNKLE MAUKIE' um.json
python3 $T/cases.py au.pix au.pal.json 'AUBE' au.json
python3 $T/cases.py hb.pix hb.pal.json 'HONEY BUZZARD' hb.json
python3 -c "
import json
M={t:json.load(open(k+'.json')) for k,t in [('um','unkle_maukie'),('au','aube'),('hb','honey_buzzard')]}
open('/home/claude/klone/masks.js','w').write('window.MASKS='+json.dumps(M,ensure_ascii=False,separators=(',',':'))+';')"
