import sys,re,numpy as np
def parse(path):
    L=open(path,encoding='latin-1').read().split('\n');i=0;mats=[]
    def tok(): return L[i].split()
    while not L[i].startswith('OBJECT'):
        if L[i].startswith('MATERIAL'):
            m=re.match(r'MATERIAL "(.*?)" rgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+).*trans ([\d.e-]+)',L[i]); mats.append(dict(name=m[1],rgb=[float(m[2]),float(m[3]),float(m[4])],trans=float(m[5])))
        i+=1
    objs=[]
    def rd(parent_loc,parent_rot,pname):
        nonlocal i
        o=dict(name='',tex=None,verts=None,surfs=[],loc=np.zeros(3),rot=np.eye(3),crease=None,parent=pname,texrep=(1,1),texoff=(0,0))
        assert L[i].startswith('OBJECT'),L[i]; i+=1
        while True:
            t=L[i].split()
            if not t: i+=1;continue
            k=t[0]
            if k=='name': o['name']=L[i][5:].strip().strip('"');i+=1
            elif k=='data': i+=2
            elif k=='texture': o['tex']=L[i].split('"')[1];i+=1
            elif k=='texrep': o['texrep']=(float(t[1]),float(t[2]));i+=1
            elif k=='texoff': o['texoff']=(float(t[1]),float(t[2]));i+=1
            elif k=='rot': o['rot']=np.array(list(map(float,t[1:10]))).reshape(3,3);i+=1
            elif k=='loc': o['loc']=np.array(list(map(float,t[1:4])));i+=1
            elif k=='crease': o['crease']=float(t[1]);i+=1
            elif k in('url','subdiv','hidden','locked','folded'): i+=1
            elif k=='numvert':
                n=int(t[1]);o['verts']=np.array([list(map(float,L[i+1+j].split()[:3])) for j in range(n)]).reshape(-1,3);i+=1+n
            elif k=='numsurf':
                n=int(t[1]);i+=1
                for _ in range(n):
                    fl=int(L[i].split()[1],16);i+=1;mat=0
                    while not L[i].startswith('refs'):
                        if L[i].startswith('mat'): mat=int(L[i].split()[1])
                        i+=1
                    r=int(L[i].split()[1]);refs=[L[i+1+j].split() for j in range(r)];i+=1+r
                    o['surfs'].append((fl,mat,[(int(a[0]),float(a[1]),float(a[2])) for a in refs]))
            elif k=='kids':
                nk=int(t[1]);i+=1
                R=parent_rot@o['rot'].T if False else parent_rot
                wl=parent_loc+o['loc']
                if o['verts'] is not None: o['wverts']=o['verts']+wl
                objs.append(o)
                for _ in range(nk): rd(wl,R,o['name'])
                return
            else: i+=1
    rd(np.zeros(3),np.eye(3),None)
    return mats,objs
if __name__=='__main__':
    mats,objs=parse(sys.argv[1])
    print(len(mats),'mats',len(objs),'objs')
    allv=np.concatenate([o['wverts'] for o in objs if o.get('wverts') is not None and len(o['wverts'])])
    print('bounds',allv.min(0),allv.max(0))
    rotated=[o['name'] for o in objs if not np.allclose(o['rot'],np.eye(3))]
    print('rotated',rotated[:20])
    tv=sum(len(o['verts']) for o in objs if o['verts'] is not None); ts=sum(len(o['surfs']) for o in objs)
    print('verts',tv,'surfs',ts)
    for o in sorted(objs,key=lambda o:-(len(o['surfs'])))[:25]:
        v=o.get('wverts');print(o['name'],o['tex'],len(o['surfs']),v.min(0).round(2) if v is not None and len(v) else '',v.max(0).round(2) if v is not None and len(v) else '')
