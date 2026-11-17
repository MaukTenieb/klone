# Honey Buzzard : l'œil (anneau gris, pupille, reflet) et le vert du nœud papillon, repris à la main.
import json
R=[list(r) for r in open('hb.pix').read().rstrip('\n').split('\n')]
eye=[" fff ","f0i0f","f000f"," fff "]
for dy,l in enumerate(eye):
  for dx,c in enumerate(l):
    if c!=' ':R[13+dy][56+dx]=c
P=json.load(open('hb.pal.json'));P['k']='#24563a'
open('hb.pix','w').write('\n'.join(''.join(r) for r in R[:-4])+'\n');json.dump(P,open('hb.pal.json','w'))
