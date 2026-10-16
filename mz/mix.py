import json,subprocess,sys
mode=sys.argv[1];m=json.load(open(f'mzmix_{mode}.json'));end=m['end'];A='a/'
F={'logo':'logo_c','swish':'swish_c','tick':'tick_c','car':'car_c','jet':'jet_c','phone':'phone_c','keycard':'keycard_c','riser':'riser_c','pop':'pop_c','popl':'popl_c','shim':'shim_c','paper':'paper_c','seal':'seal_c','door':'door_c','chime':'chime_c','whoosh':'whoosh_c','click':'click_c','flick':'flick_c','light':'light_c','satin':'satin_c'}
inp=['-i',A+'vo_mz.mp3','-i',A+'music_mz.mp3'];f=[];o=int(m['voOff']*1000)
f.append(f"[0:a]adelay={o}|{o},volume=1.3,asplit=2[vo][sc]");E=json.load(open('emph.json'));terms='+'.join(f"clip((t-{a+m['voOff']-.25:.2f})/.2,0,1)*clip(({b+m['voOff']+.35:.2f}-t)/.3,0,1)" for a,b in E)
VE=max(w['end'] for w in json.load(open('words_mz.json')))+m['voOff']
f.append(f"[1:a]volume='0.256*(1-0.2*min(1,{terms}))*(1+1.5*clip((t-{VE:.2f})/0.8,0,1))':eval=frame,afade=t=out:st={end-1.8}:d=1.8[mu0]");f.append("[mu0][sc]sidechaincompress=threshold=0.03:ratio=2.2:attack=40:release=800[mu]")
L=['[vo]','[mu]'];k=2
for s in m['sfx']:
  if s['t']<0:continue
  inp+=['-i',A+F[s['k']]+'.mp3'];ms=int(s['t']*1000);f.append(f"[{k}:a]adelay={ms}|{ms},volume={s['v']*0.75*(0.75 if s['k'] in ('pop','popl') else 1):.3f}[s{k}]");L.append(f'[s{k}]');k+=1
f.append(''.join(L)+f"amix=inputs={len(L)}:normalize=0,apad,atrim=0:{end},alimiter=limit=0.95[out]")
subprocess.run(['ffmpeg','-y','-v','error',*inp,'-filter_complex',';'.join(f),'-map','[out]','-c:a','aac','-b:a','192k',f'mzaudio_{mode}.m4a'],check=True)
name='CityPremium_maisons_v3_16x9.mp4' if mode=='render' else 'CityPremium_maisons_v3_9x16.mp4'
subprocess.run(['ffmpeg','-y','-v','error','-i',f'mzvideo_{mode}.mp4','-i',f'mzaudio_{mode}.m4a','-c:v','copy','-c:a','copy','-shortest','-movflags','+faststart',name],check=True);print('done',name)
