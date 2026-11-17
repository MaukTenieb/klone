# cases.py carte.pix palette.json nom sortie.json — 2x2 pixels -> une case texte (demi-blocs et quarts, deux encres par case, comme l'ANSI et le PETSCII)
import sys,json
Q=' ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█'
R=open(sys.argv[1]).read().rstrip('\n').split('\n');P=json.load(open(sys.argv[2]));P.setdefault('.','#0b0908')
rgb=lambda h:tuple(int(h[i:i+2],16) for i in (1,3,5))
W=max(map(len,R));R=[r.ljust(W,'.') for r in R]
if len(R)%2:R.append('.'*W)
if W%2:R=[r+'.' for r in R];W+=1
G=[];F=[];B=[]
for y in range(0,len(R),2):
  g=f=b=''
  for x in range(0,W,2):
    px=[R[y][x],R[y][x+1],R[y+1][x],R[y+1][x+1]]
    cnt={};[cnt.__setitem__(c,cnt.get(c,0)+1) for c in px]
    o=sorted(cnt,key=lambda c:(-cnt[c],c=='.'))
    bg=o[0];fg=o[1] if len(o)>1 else o[0]
    def near(c):
      if c in (bg,fg):return c
      d=lambda u,v:sum((a-b)**2 for a,b in zip(rgb(P[u]),rgb(P[v])))
      return bg if d(c,bg)<=d(c,fg) else fg
    px=[near(c) for c in px]
    m=sum(1<<i for i,c in enumerate(px) if c==fg and fg!=bg)
    # préférence : la salle en fond
    if fg=='.' and m: m^=15;fg,bg=bg,fg
    g+=Q[m];f+=fg;b+=bg
  G.append(g);F.append(f);B.append(b)
json.dump({'nom':sys.argv[3],'pal':P,'g':G,'f':F,'b':B},open(sys.argv[4],'w'),ensure_ascii=False)
print(W//2,len(G))
