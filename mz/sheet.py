import sys,glob
from PIL import Image,ImageDraw
mode,ts,out=sys.argv[1],sys.argv[2].split(','),sys.argv[3]
ims=[Image.open(f'shots/{mode}_{t}.png') for t in ts]
w,h=ims[0].size;sc=640/w if w>h else 360/w;tw,th=int(w*sc),int(h*sc);cols=3 if w>h else 5
rows=(len(ims)+cols-1)//cols;S=Image.new('RGB',(cols*tw,rows*th),'white');d=ImageDraw.Draw(S)
for i,(im,t) in enumerate(zip(ims,ts)):
  x,y=(i%cols)*tw,(i//cols)*th;S.paste(im.convert('RGB').resize((tw,th)),(x,y));d.rectangle([x,y,x+60,y+22],fill='black');d.text((x+4,y+4),t,fill='white')
S.save(out)
