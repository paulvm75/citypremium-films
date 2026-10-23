import numpy as np
from PIL import Image, ImageDraw
im=Image.open('/home/claude/dl/a320/Models/Fuselage/res/Fuse-Main.png').convert('RGB').resize((2048,2048),Image.LANCZOS)
rgb=np.asarray(im).astype(np.float32)/255; L=rgb@np.array([.299,.587,.114],np.float32)+1e-4
sat=rgb.max(-1)-rgb.min(-1); paint=sat>.06
q=(rgb[paint]*31).astype(int); k=q[:,0]*1024+q[:,1]*32+q[:,2]
u,c=np.unique(k,return_counts=True); top=u[c>paint.sum()*.004]
P=np.stack([top//1024,(top//32)%32,top%32],1)/31.0+1/62; print(len(P),(P*255).astype(int))
Lp=P@np.array([.299,.587,.114])
best=np.full(L.shape,1e9,np.float32); ratio=np.ones(L.shape,np.float32)
for c,lc in zip(P.astype(np.float32),Lp):
    r=np.clip(L/lc,0,1.2); err=np.linalg.norm(rgb-c*r[...,None],axis=-1)+np.clip(L/lc-1.04,0,None)*2
    m=err<best; best[m]=err[m]; ratio[m]=r[m]
white=np.array([.955,.955,.948],np.float32)
pv=white*(np.clip(ratio,0,1)**1.6)[...,None]
w=np.clip((sat-.03)/.05,0,1)[...,None]
out=pv*w+rgb*(1-w)
o=Image.fromarray((np.clip(out,0,1)*255).astype(np.uint8)); d=ImageDraw.Draw(o)
for (x0,y0,x1,y1) in [(655,108,730,128),(655,313,730,334)]: d.rectangle([x0*2,y0*2,x1*2,y1*2],fill=(244,244,242))
o.save('fuse_white.jpg',quality=88)
o.crop((0,0,2048,900)).save('/tmp/claude-0/-home-claude/e682fdc2-527b-573d-9d4f-9d2ea5507444/scratchpad/fw.jpg')
# --- remove primer-black areas (radome, fin stripes, fairing blocks); keep windscreens and windows
from scipy.ndimage import label,find_objects,binary_dilation
arr=np.asarray(o).astype(np.float32)/255
Lo=arr@np.array([.299,.587,.114],np.float32)
dk=Lo<.14; lab,n=label(dk); sl=find_objects(lab); fill=np.zeros_like(dk)
for i,s in enumerate(sl):
    ys,xs=s; h=ys.stop-ys.start; w=xs.stop-xs.start; cy=(ys.start+ys.stop)/2
    area=(lab[s]==i+1).sum()
    wind=False
    if area>350 and not wind: fill|=lab==i+1
fill=binary_dilation(fill,iterations=2)
arr[fill]=[.95,.95,.945]
o=Image.fromarray((arr*255).astype(np.uint8))
o.save('fuse_white.jpg',quality=88)
o.resize((1024,1024)).save('/tmp/claude-0/-home-claude/e682fdc2-527b-573d-9d4f-9d2ea5507444/scratchpad/fw2.jpg')
