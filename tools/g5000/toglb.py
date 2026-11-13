# Bombardier Global 5000 (FlightGear AI model by gooneybird47, GPL v2) to glTF, gear removed for flight shots
import sys,numpy as np
sys.path.insert(0,'../a320')
import toglb as T
SRC='/home/claude/gooneybird47/bombardier-global-5000/CCX/Models/bomb-5000.ac'
T.SKIP=T.SKIP+tuple(sys.argv[1:]) if len(sys.argv)>1 else T.SKIP+('gear',)
T.build([(SRC,(0,0,0),{'bomb-5000-tex.png':'tex.png'},())],'g5000.gltf',lambda v:v*np.array([-1,1,-1]))
