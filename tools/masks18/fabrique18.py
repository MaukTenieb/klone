# Les dix-huit Masks : cadrage automatique sur la figure, puis la même chaîne que les trois premiers.
import subprocess,json,os,numpy as np
from PIL import Image
from scipy import ndimage
SRC='/home/claude/src/insertkoin';T='/home/claude/work/tools'
ORDRE=[('unkle_maukie','UNKLE MAUKIE'),('dogxim','DOGXIM'),('c7h5n3o6','C7H5N3O6'),('naphta','NAPHTA'),('tsui_pen',"TS'UI PÊN"),('honey_buzzard','HONEY BUZZARD'),('hatra_loves','HÁTRA LÖVÉS'),('croisiere_noire','CROISIÈRE NOIRE'),('aube','AUBE'),('silent_pact','SILENT PACT'),('maiden_call','MAIDEN CALL'),('plague_of_justinian','PLAGUE OF JUSTINIAN'),('poisoned_well','POISONED WELL'),('cadaver_synod','CADAVER SYNOD'),('truce','TRUCE'),('auvergne','AUVERGNE'),('grand_colonel','GRAND COLONEL'),('malika','MALIKA')]
def run(c,env=None):subprocess.run(c,shell=True,check=True,env=dict(os.environ,**(env or {})),stdout=subprocess.DEVNULL)
for slug,nom in ORDRE:
  p=f'{SRC}/mask-{slug}.webp';im=np.asarray(Image.open(p).convert('RGB')).astype(float)
  bgc=np.median(im[:10,:10].reshape(-1,3),0);lum=im@[.299,.587,.114]
  cand=(np.abs(im-bgc).sum(2)<45)&(lum>40);lb,_=ndimage.label(cand)
  bords=set(np.unique(np.concatenate([lb[0],lb[:,0],lb[:,-1]])))-{0};fg=~np.isin(lb,list(bords))
  ys,xs=np.where(fg);y0=max(0,ys.min()-12);x0=max(0,xs.min()-8);x1=min(im.shape[1],xs.max()+8)
  h=im.shape[0]-y0;w=x1-x0
  if h>w*1.25: y1=y0+int(w*1.2)
  else: y1=im.shape[0]
  sombre=lum[fg].mean()<70
  env={'ENCRE':'14','TOLFOND':'40'} if sombre else {}
  if slug=='plague_of_justinian':env={'TOLFOND':'14'}
  run(f'python3 {T}/pixel.py {p} {x0},{y0},{x1},{y1} 112 12 {slug}',env)
  run(f'python3 {T}/fond.py {slug}.pix {slug}.pal.json')
  run(f'python3 {T}/lumiere.py {slug}.pix {slug}.pal.json')
  if sombre:
    P=json.load(open(f'{slug}.pal.json'))
    for k,v in P.items():
      if k in '.0' or not k.islower():continue
      r,g,b=(int(v[i:i+2],16) for i in (1,3,5));l=(r+g+b)/3
      if l<40:P[k]='#%02x%02x%02x'%(int(22+l*.5),int(26+l*.6),int(32+l*.8))
    json.dump(P,open(f'{slug}.pal.json','w'))
  print(slug,nom,(x0,y0,x1,y1),'sombre' if sombre else '')
