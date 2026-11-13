# Lone-frame flash and dark-block detector for a rendered MP4.
# Flags a frame that differs strongly from both neighbours while the neighbours match each other
# (a one-frame glitch), and frames with a large share of near-black pixels (Chrome black blocks).
import subprocess,sys,numpy as np
path=sys.argv[1]; t0=float(sys.argv[2]) if len(sys.argv)>2 else 0; dur=sys.argv[3] if len(sys.argv)>3 else None
W=320
p=subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',path],capture_output=True,text=True).stdout.strip().split(',')
w,h=int(p[0]),int(p[1]);H=int(round(h*W/w/2))*2
cmd=['ffmpeg','-v','error','-ss',str(t0),'-i',path]+(['-t',dur] if dur else [])+['-vf',f'scale={W}:{H},format=gray','-f','rawvideo','-']
a=np.frombuffer(subprocess.run(cmd,capture_output=True).stdout,np.uint8)
n=a.size//(W*H);a=a[:n*W*H].reshape(n,H,W).astype(np.float32)
d=np.abs(np.diff(a,axis=0)).mean((1,2))
lone=[round(t0+i/30,2) for i in range(1,n-1) if d[i-1]>6 and d[i]>6 and np.abs(a[i+1]-a[i-1]).mean()<min(d[i-1],d[i])*.35]
dark=(a<10).mean((1,2)); base=np.median(dark)
blocks=[round(t0+i/30,2) for i in range(n) if dark[i]>max(.25,base+.2)]
print(path.split('/')[-1],'frames',n,'lone-frame spikes',lone[:20],'dark-block frames',blocks[:20])
