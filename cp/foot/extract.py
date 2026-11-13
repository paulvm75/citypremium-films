# Grade and convert the Katana clips: render sequences (30 fps, 1920x1080), page sequences for letters (15 fps, 1280),
# page videos for full-bleed clips (H.264, 1920x1080). Writes clips.json for the engine.
import subprocess,json,os,shutil
G="eq=contrast=1.04:saturation=0.9:gamma=0.98,colorbalance=rs=-0.02:bs=0.03:bm=0.012"
C={'dawn':('v1_paris_dawn',1.0,'vid'),'saloon':('v2_saloon',1.0,'vid'),'champ':('v3_champagne',1.0,'seq'),'cots':('v4_cotswolds',1.0,'seq'),'night':('v5_paris_night',0.8,'vid')}
J={}
def run(a): subprocess.run(a,check=True)
for k,(src,rate,kind) in C.items():
    s=f'src/{src}.mp4'; slow=f',setpts={1/rate:.4f}*PTS' if rate!=1 else ''
    d=f'r/{k}'; shutil.rmtree(d,ignore_errors=True); os.makedirs(d)
    run(['ffmpeg','-v','error','-y','-i',s,'-vf',f'{G}{slow},framerate=fps=30,format=yuvj420p','-q:v','3',f'{d}/f%04d.jpg'])
    n=len(os.listdir(d)); vdur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',s],capture_output=True,text=True).stdout)
    J[k]={'n':n,'vdur':round(vdur,3),'rate':rate}
    if kind=='seq':
        d=f'p/{k}'; shutil.rmtree(d,ignore_errors=True); os.makedirs(d)
        run(['ffmpeg','-v','error','-y','-i',s,'-vf',f'{G},fps=15,scale=1280:-2,format=yuvj420p','-q:v','5',f'{d}/f%03d.jpg'])
        J[k]['np']=len(os.listdir(d))
    else:
        os.makedirs('v',exist_ok=True)
        run(['ffmpeg','-v','error','-y','-i',s,'-vf',f'{G},format=yuv420p','-an','-c:v','libx264','-preset','slow','-crf','21','-g','12','-movflags','+faststart',f'v/{k}.mp4'])
        J[k]['np']=n
    print(k,J[k],flush=True)
json.dump(J,open('clips.json','w'))
