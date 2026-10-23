import sys
from PIL import Image
mode,ts,out=sys.argv[1],sys.argv[2].split(','),sys.argv[3]
ims=[Image.open(f'shots/ta9_{mode}_{t}.png') for t in ts]
w=640 if ims[0].width>ims[0].height else 360; h=int(ims[0].height*w/ims[0].width); cols=3 if w==640 else 5
from PIL import ImageDraw
c=Image.new('RGB',(w*cols,h*((len(ims)+cols-1)//cols)),'white')
for i,(t,im) in enumerate(zip(ts,ims)):
  im=im.resize((w,h));d=ImageDraw.Draw(im);d.rectangle((0,0,58,18),fill='black');d.text((4,3),t,fill='white');c.paste(im,((i%cols)*w,(i//cols)*h))
c.save(out)
