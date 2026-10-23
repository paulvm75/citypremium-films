import json,subprocess,sys
mode=sys.argv[1];m=json.load(open(f'ta9mix_{mode}.json'));end=m['end'];A='assets6/'
F={'logo':'logo_c','swish':'swish_c','tick':'tick_c','car':'car_c','jet':'jet_c','phone':'phone_c','keycard':'keycard_c','riser':'riser_c','pop':'pop_c','popl':'popl_c','shim':'shim_c'}
inp=['-i',A+'vo_ta9.mp3','-i',A+'music_ta9.mp3'];f=[];o=int(m['voOff']*1000)
f.append(f"[0:a]adelay={o}|{o},volume=1.0,asplit=2[vo][sc]");vo=m['voOff'];a=vo+80.6;b=vo+84.3;e=vo+15.9
f.append(f"[1:a]volume=0.3,volume='if(lt(t,{e}),0.82,if(lt(t,{a}),1,if(lt(t,{a+.4}),1-0.6*(t-{a})/0.4,if(lt(t,{b}),0.4,if(lt(t,{b+.8}),0.4+0.6*(t-{b})/0.8,1)))))':eval=frame,afade=t=out:st={end-3}:d=3[mu0]");f.append("[mu0][sc]sidechaincompress=threshold=0.015:ratio=7:attack=30:release=700[mu]")
L=['[vo]','[mu]'];k=2
for s in m['sfx']:
  if s['t']<0:continue
  inp+=['-i',A+F[s['k']]+'.mp3'];ms=int(s['t']*1000);f.append(f"[{k}:a]adelay={ms}|{ms},volume={s['v']*0.9*(0.75 if s['k'] in ('pop','popl') else 1):.3f}[s{k}]");L.append(f'[s{k}]');k+=1
f.append(''.join(L)+f"amix=inputs={len(L)}:normalize=0,apad,atrim=0:{end},alimiter=limit=0.95[out]")
subprocess.run(['ffmpeg','-y','-v','error',*inp,'-filter_complex',';'.join(f),'-map','[out]','-c:a','aac','-b:a','192k',f'ta9audio_{mode}.m4a'],check=True)
name='CityPremium_agencies_v9_16x9.mp4' if mode=='render' else 'CityPremium_agencies_v9_9x16.mp4'
subprocess.run(['ffmpeg','-y','-v','error','-i',f'ta9video_{mode}.mp4','-i',f'ta9audio_{mode}.m4a','-c:v','copy','-c:a','copy','-shortest','-movflags','+faststart',name],check=True);print('done',name)
