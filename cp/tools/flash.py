import subprocess,sys,numpy as np
f=sys.argv[1];w,h=96,54 if '16x9' in f else (54,96)
if '9x16' in f: w,h=54,96
p=subprocess.run(['ffmpeg','-v','error','-i',f,'-vf',f'scale={w}:{h},format=gray','-f','rawvideo','-'],capture_output=True).stdout
a=np.frombuffer(p,np.uint8).reshape(-1,h,w).astype(np.int16);out=[]
for i in range(1,len(a)-1):
  d1=np.abs(a[i]-a[i-1]);d2=np.abs(a[i]-a[i+1]);d0=np.abs(a[i+1]-a[i-1])
  m=(d1>40)&(d2>40)&(d0<15)
  if m.sum()>=3: out.append((round(i/30,2),int(m.sum())))
print(f,len(a),'flashes:',out[:30])
