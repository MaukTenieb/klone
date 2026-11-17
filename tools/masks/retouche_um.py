# Reprise à la main du visage d'Unkle Maukie : sourcils, yeux, nez, bouche, pixel par pixel.
import json
R=[list(r) for r in open('um.pix').read().rstrip('\n').split('\n')]
O=35
def p(x,y,c): R[y][O+x]=c
for y in range(34,47):
  for x in range(6,33):
    if R[y][O+x] not in 'k': p(x,y,'c')
# sourcils froncés (gris), qui descendent vers le centre
for x,y in [(6,34),(7,34),(8,34),(9,35),(10,35),(11,35),(12,35),(13,36),(14,36)]:
  p(x,y,'i');p(36-x,y,'i')
for x,y in [(7,35),(8,35),(12,36)]: p(x,y,'e');p(36-x,y,'e')
# yeux : paupière, blanc, iris bleu pâle, pupille
for cx in (11,25):
  for dx in range(-3,3): p(cx+dx,37,'0')
  p(cx-3,38,'k');p(cx-2,38,'m');p(cx-1,38,'m');p(cx,38,'0');p(cx+1,38,'m');p(cx+2,38,'k')
  for dx in range(-2,2): p(cx+dx,39,'g')
# rides du regard
for x,y in [(5,38),(4,39),(31,38),(32,39)]: p(x,y,'g')
# nez
for y in range(40,45): p(16,y,'g')
p(17,44,'g');p(15,45,'0');p(16,45,'b');p(17,45,'g');p(18,45,'g');p(19,45,'b');p(20,45,'0');p(21,45,'0')
for y in range(41,45): p(20,y,'g')
# joues
for x,y in [(8,42),(9,42),(27,42),(28,42),(9,43),(27,43)]: p(x,y,'g')
# bouche sous la moustache
for x in range(13,24): p(x,51,'0')
for x in range(14,23): p(x,52,'b')
p(12,51,'k');p(24,51,'k')
# fond : les restes gris collés au bord deviennent la salle
H=len(R);W=len(R[0]);st=[(x,y) for y in range(H) for x in range(W) if R[y][x]=='.']
while st:
  x,y=st.pop()
  for a,b in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
    if 0<=a<W and 0<=b<H and R[b][a]=='a': R[b][a]='.';st.append((a,b))
open('um.pix','w').write('\n'.join(''.join(r) for r in R)+'\n')
P=json.load(open('um.pal.json'));P['m']='#8fb3c4';json.dump(P,open('um.pal.json','w'))
