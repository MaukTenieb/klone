# pixel.py image crop(x0,y0,x1,y1) largeur_px k sortie_prefixe
# Réduction en pixel art : palette fermée, trait noir prioritaire, fond de la source remplacé par la salle.
# Sort une carte de pixels en lettres (.pix, retouchable à la main) et la palette (.pal.json).
import sys,json,numpy as np
from PIL import Image
src=sys.argv[1];x0,y0,x1,y1=map(int,sys.argv[2].split(','));Wp=int(sys.argv[3]);k=int(sys.argv[4]);out=sys.argv[5]
im=np.asarray(Image.open(src).convert('RGB').crop((x0,y0,x1,y1))).astype(float)
H,W,_=im.shape;s=W/Wp;Hp=int(H/s)
lum=im@[.299,.587,.114]
import os
ink=lum<int(os.environ.get('ENCRE','48'))
bgc=np.median(im[:8,:8].reshape(-1,3),0)
from scipy import ndimage
cand=(np.abs(im-bgc).sum(2)<int(os.environ.get('TOLFOND','45')))&(lum>40)
lb,_=ndimage.label(cand);bords=set(np.unique(np.concatenate([lb[0],lb[-1],lb[:,0],lb[:,-1]])))-{0}
isbg=np.isin(lb,list(bords))
sel=im[~ink & ~isbg][::5]
rng=np.random.default_rng(3);C=sel[rng.choice(len(sel),k,replace=False)]
for _ in range(30):
  d=((sel[:,None]-C[None])**2).sum(2);l=d.argmin(1)
  C=np.array([sel[l==i].mean(0) if (l==i).any() else C[i] for i in range(k)])
lab=((im.reshape(-1,3)[:,None]-C[None])**2).sum(2).argmin(1).reshape(H,W)
L='abcdefghijklmnopqrstuvwxyz'
rows=[]
for py in range(Hp):
  r=''
  for px in range(Wp):
    ya,yb,xa,xb=int(py*s),int((py+1)*s),int(px*s),int((px+1)*s)
    if ink[ya:yb,xa:xb].mean()>0.30: r+='0';continue
    if isbg[ya:yb,xa:xb].mean()>0.5: r+='.';continue
    m=~ink[ya:yb,xa:xb]&~isbg[ya:yb,xa:xb]
    v=lab[ya:yb,xa:xb][m]
    r+=L[np.bincount(v,minlength=k).argmax()] if v.size else '0'
  rows.append(r)
open(out+'.pix','w').write('\n'.join(rows)+'\n')
pal={'0':'#120c0a'};pal.update({L[i]:'#%02x%02x%02x'%tuple(int(v) for v in C[i]) for i in range(k)})
json.dump(pal,open(out+'.pal.json','w'),indent=0)
print(Wp,Hp,pal)
