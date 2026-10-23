import json,struct,sys,numpy as np
from ac import parse
SKIP=('WingtipFence','Placards','NurbsPath','Rat','FanSpinning','EngineLEAPL.007')
def tris_of(o,mats):
    V=o['wverts'];cre=np.cos(np.radians(o['crease'] if o['crease'] is not None else 30))
    ru,rv=o['texrep'];ou,ov=o['texoff']
    F=[]  # (vi[3], uv[3], mat, flags)
    for fl,mat,refs in o['surfs']:
        if fl&0xF: continue
        if len(refs)<3: continue
        for k in range(1,len(refs)-1):
            tri=[refs[0],refs[k],refs[k+1]]
            F.append(([t[0] for t in tri],[(t[1]*ru+ou,t[2]*rv+ov) for t in tri],mat,fl))
    if not F: return []
    vi=np.array([f[0] for f in F]);p=V[vi]
    fn=np.cross(p[:,1]-p[:,0],p[:,2]-p[:,0]);ln=np.linalg.norm(fn,axis=1,keepdims=True);fn=fn/np.maximum(ln,1e-12)
    # smooth normals with crease: per vertex list faces
    from collections import defaultdict
    vf=defaultdict(list)
    for fi,f in enumerate(F):
        for c in range(3): vf[f[0][c]].append(fi)
    out=[]
    for fi,f in enumerate(F):
        smooth=f[3]&0x10
        ns=[]
        for c in range(3):
            if not smooth: ns.append(fn[fi]);continue
            fs=vf[f[0][c]];w=fn[fs];sel=w@fn[fi]>cre;n=(w[sel]*ln[fs][sel]).sum(0);nn=np.linalg.norm(n)
            ns.append(n/nn if nn>1e-12 else fn[fi])
        out.append((p[fi],ns,f[1],f[2],f[3]))
    return out
def build(files,outp,xf):
    nodes=[];meshes=[];accs=[];views=[];buf=bytearray();matkeys={};materials=[];textures=[];images=[];imgidx={}
    def add_view(b,target=None):
        while len(buf)%4: buf.append(0)
        off=len(buf);buf.extend(b);v={'buffer':0,'byteOffset':off,'byteLength':len(b)}
        if target: v['target']=target
        views.append(v);return len(views)-1
    for path,offset,texmap,glassnames in files:
        mats,objs=parse(path)
        for o in objs:
            if o.get('wverts') is None or not len(o['wverts']) or any(s in o['name'] for s in SKIP): continue
            o['wverts']=xf(o['wverts']+np.array(offset))
            T=tris_of(o,mats)
            if not T: continue
            groups={}
            for (p,ns,uv,mat,fl) in T:
                mname=mats[mat]['name'];glass=mname.startswith('glass') or mname in glassnames
                key=(None if glass else o['tex'],glass,mname if glass else '')
                groups.setdefault(key,[]).append((p,ns,uv))
            prims=[]
            for key,tl in groups.items():
                if key not in matkeys:
                    tex,glass,mn=key;m={'name':(mn or tex or 'plain'),'doubleSided':True,'pbrMetallicRoughness':{'metallicFactor':0.0,'roughnessFactor':0.5}}
                    if glass: m['pbrMetallicRoughness'].update(baseColorFactor=[.03,.035,.05,1],roughnessFactor=.08,metallicFactor=.3); m['extras']={'glass':1}
                    if mn.startswith('glass.red'): m['pbrMetallicRoughness']['baseColorFactor']=[1,.1,.1,1];m['emissiveFactor']=[1,.1,.1]
                    if mn.startswith('glass.green'): m['pbrMetallicRoughness']['baseColorFactor']=[.1,1,.3,1];m['emissiveFactor']=[.1,1,.3]
                    if mn=='glass.white': m['pbrMetallicRoughness']['baseColorFactor']=[.9,.9,.9,1]
                    if tex and not glass:
                        f=texmap.get(tex)
                        if f:
                            if f not in imgidx: images.append({'uri':f});imgidx[f]=len(images)-1;textures.append({'source':imgidx[f]})
                            m['pbrMetallicRoughness']['baseColorTexture']={'index':textures.index({'source':imgidx[f]})}
                    materials.append(m);matkeys[key]=len(materials)-1
                P=np.array([t[0] for t in tl],np.float32).reshape(-1,3);N=np.array([t[1] for t in tl],np.float32).reshape(-1,3)
                UV=np.array([t[2] for t in tl],np.float32).reshape(-1,2);UV[:,1]=1-UV[:,1]
                # weld identical corners
                Kq=np.concatenate([np.round(P*2000),np.round(N*500),np.round(UV*8000)],1).astype(np.int64)
                _,first,inv=np.unique(Kq,axis=0,return_index=True,return_inverse=True)
                P,N,UV=P[first],N[first],UV[first];I=inv.reshape(-1).astype(np.uint32)
                a0=len(accs)
                accs.append({'bufferView':add_view(P.tobytes(),34962),'componentType':5126,'count':len(P),'type':'VEC3','min':P.min(0).tolist(),'max':P.max(0).tolist()})
                accs.append({'bufferView':add_view(N.tobytes(),34962),'componentType':5126,'count':len(N),'type':'VEC3'})
                accs.append({'bufferView':add_view(UV.tobytes(),34962),'componentType':5126,'count':len(UV),'type':'VEC2'})
                accs.append({'bufferView':add_view(I.tobytes(),34963),'componentType':5125,'count':len(I),'type':'SCALAR'})
                prims.append({'attributes':{'POSITION':a0,'NORMAL':a0+1,'TEXCOORD_0':a0+2},'indices':a0+3,'material':matkeys[key]})
            meshes.append({'name':o['name'],'primitives':prims});nodes.append({'name':o['name'],'mesh':len(meshes)-1})
    g={'asset':{'version':'2.0'},'scene':0,'scenes':[{'nodes':list(range(len(nodes)))}],'nodes':nodes,'meshes':meshes,'accessors':accs,'bufferViews':views,'buffers':[{'byteLength':len(buf),'uri':outp.replace('.gltf','.bin').split('/')[-1]}],'materials':materials,'textures':textures,'images':images,'samplers':[{'magFilter':9729,'minFilter':9987}]}
    for t in textures: t['sampler']=0
    open(outp,'w').write(json.dumps(g));open(outp.replace('.gltf','.bin'),'wb').write(buf)
    print(outp,len(nodes),'nodes',sum(a['count'] for a in accs if a['type']=='VEC3')//2,'verts',len(buf)//1024,'KB')
R='/home/claude/dl/a320/Models/'
rot=lambda v: v*np.array([-1,1,-1])  # nose to +x, keep handedness
if len(sys.argv)<2: build([(R+'Fuselage/res/A320-216.ac',(0,0,0),{'Fuse-Main.png':'fuse_white.jpg','LandingGears.png':'gear.jpg','Static-Elements.png':'static.jpg','placards.png':'static.jpg'},()),
       (R+'Fuselage/res/CFMLEAP1A.ac',(0,.83109,0),{'engine-leap1a.png':'eng.jpg'},())],'a320.gltf',rot)
if len(sys.argv)>1 and sys.argv[1]=='stairs':
    build([(R+'Services/Stairs/stairs.ac',(0,0,0),{'truck.png':'truck.jpg','blank.png':'blank.jpg','stairs-metal.png':'metal.jpg'},())],'stairs.gltf',lambda v:v)
