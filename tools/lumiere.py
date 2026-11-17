# lumiere.py carte.pix palette.json — contre-jour du néon : les pixels de la figure qui bordent la salle, côté haut et gauche, prennent la lumière ambrée
import sys,json
R=[list(r) for r in open(sys.argv[1]).read().rstrip('\n').split('\n')];P=json.load(open(sys.argv[2]))
H=len(R);W=len(R[0]);rgb=lambda h:[int(h[i:i+2],16) for i in (1,3,5)]
# grains isolés : un pixel seul de sa couleur prend la couleur de ses voisins
for _ in range(2):
  for y in range(1,H-1):
    for x in range(1,W-1):
      v=[R[y-1][x],R[y+1][x],R[y][x-1],R[y][x+1]]
      if R[y][x] not in v and R[y][x]!='0':
        R[y][x]=max(set(v),key=v.count)
# îlots : une tache de moins de 4 pixels prend la couleur qui l'entoure
seen=[[False]*W for _ in range(H)]
for y in range(H):
  for x in range(W):
    if seen[y][x] or R[y][x] in '.0':continue
    c=R[y][x];st=[(x,y)];comp=[];seen[y][x]=True
    while st:
      a,b=st.pop();comp.append((a,b))
      for u,v in ((a+1,b),(a-1,b),(a,b+1),(a,b-1)):
        if 0<=u<W and 0<=v<H and not seen[v][u] and R[v][u]==c:seen[v][u]=True;st.append((u,v))
    if len(comp)<4:
      voisins=[R[v][u] for a,b in comp for u,v in ((a+1,b),(a-1,b),(a,b+1),(a,b-1)) if 0<=u<W and 0<=v<H and R[v][u] not in (c,'.')]
      if voisins:
        m=max(set(voisins),key=voisins.count)
        for a,b in comp:R[b][a]=m
NEW={};CY={}
def froid(c):
  if c not in CY:
    r,g,b=rgb(P[c]);m=lambda v,t,a:int(v+(t-v)*a)
    CY[c]=chr(ord('Z')-len(CY));P[CY[c]]='#%02x%02x%02x'%(m(r,79,.45),m(g,195,.45),m(b,247,.45))
  return CY[c]
def clair(c):
  if c not in NEW:
    r,g,b=rgb(P[c]);m=lambda v,t,a:int(v+(t-v)*a)
    NEW[c]=chr(ord('A')+len(NEW));P[NEW[c]]='#%02x%02x%02x'%(m(r,255,.55),m(g,190,.5),m(b,90,.35))
  return NEW[c]
out=[r[:] for r in R]
for y in range(H):
  for x in range(W):
    c=R[y][x]
    if c=='.':continue
    up=y>0 and R[y-1][x]=='.';lf=x>0 and R[y][x-1]=='.'
    rt=x<W-1 and R[y][x+1]=='.'
    if up or (lf and y<H*0.6):out[y][x]=clair(c)
    elif rt and x>W*0.5:out[y][x]=froid(c)
open(sys.argv[1],'w').write('\n'.join(''.join(r) for r in out)+'\n');json.dump(P,open(sys.argv[2],'w'))
