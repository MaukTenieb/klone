# apercu.py carte.pix palette.json sortie.png [echelle] — chaque pixel de la carte = un quart de case
import sys,json
from PIL import Image
P=json.load(open(sys.argv[2]));P.setdefault('.','#0b0908')
R=open(sys.argv[1]).read().rstrip('\n').split('\n');s=int(sys.argv[4]) if len(sys.argv)>4 else 6
W=max(map(len,R));im=Image.new('RGB',(W,len(R)),'#0b0908')
for y,r in enumerate(R):
  for x,c in enumerate(r):im.putpixel((x,y),tuple(int(P.get(c,'#ff00ff')[i:i+2],16) for i in (1,3,5)))
im.resize((W*s,len(R)*s),Image.NEAREST).save(sys.argv[3])
