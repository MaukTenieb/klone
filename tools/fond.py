# fond.py carte.pix palette.json — les gris neutres collés au bord (restes du fond de la source) deviennent la salle
import sys,json
R=[list(r) for r in open(sys.argv[1]).read().rstrip('\n').split('\n')];P=json.load(open(sys.argv[2]))
def gris(c):
  if c in '.0' or c not in P:return False
  h=P[c];r,g,b=(int(h[i:i+2],16) for i in (1,3,5));return max(r,g,b)-min(r,g,b)<30 and 60<(r+g+b)/3<140 and r>=b
H=len(R);W=len(R[0]);st=[(x,y) for y in range(H) for x in range(W) if R[y][x]=='.' or ((x in(0,W-1) or y==H-1) and gris(R[y][x]))]
for x,y in st:R[y][x]='.'
while st:
  x,y=st.pop()
  for a,b in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
    if 0<=a<W and 0<=b<H and gris(R[b][a]):R[b][a]='.';st.append((a,b))
open(sys.argv[1],'w').write('\n'.join(''.join(r) for r in R)+'\n')
