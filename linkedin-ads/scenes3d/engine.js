import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {SCENES} from './scenes.js';
const W=1600,H=1200;
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(W,H);renderer.setClearColor(0x000000,0);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const pm=new THREE.PMREMGenerator(renderer);
const envTex=pm.fromScene(new RoomEnvironment(),0.04).texture;
export const M={};
const mk=(c,o={})=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:.32,metalness:0,clearcoat:.8,clearcoatRoughness:.25},o));
M.violet=mk(0x6B3FE4);M.violetD=mk(0x4A25AD,{roughness:.4});M.lav=mk(0xC9B3FF,{roughness:.38});M.white=mk(0xF6F4FA,{roughness:.55,clearcoat:.3});
M.ink=mk(0x241a44,{roughness:.35});M.inkD=mk(0x150f26,{roughness:.4});M.amber=mk(0xF59E0B,{roughness:.3});M.green=mk(0x10B981,{roughness:.3});M.cyan=mk(0x67E3EE,{roughness:.3});
M.glass=new THREE.MeshPhysicalMaterial({color:0xC9B3FF,roughness:.08,metalness:0,transmission:.9,thickness:.6,ior:1.4,transparent:true,opacity:1,clearcoat:1});
M.steel=mk(0xB4A8D6,{roughness:.3,metalness:.4});
const T={THREE,RoundedBoxGeometry,M,mk,
 box(w,h,d,r,mat){const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,4,r??Math.min(w,h,d)*.18),mat);m.castShadow=true;m.receiveShadow=true;return m},
 cyl(rt,rb,h,mat,seg=48){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat);m.castShadow=true;m.receiveShadow=true;return m},
 sph(r,mat){const m=new THREE.Mesh(new THREE.SphereGeometry(r,48,32),mat);m.castShadow=true;m.receiveShadow=true;return m},
 tube(a,b,r,mat){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b);const len=va.distanceTo(vb);const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,24),mat);m.position.copy(va).add(vb).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vb.clone().sub(va).normalize());m.castShadow=true;return m},
 tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t},
 screen(w,h,tex){return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}))},
 rr(x,a,b,w,h,r){x.beginPath();x.roundRect(a,b,w,h,r);}
};
window.renderScene=async(name,opts={})=>{
  await Promise.all(['600 40px Urbanist','700 40px Urbanist','500 26px Inter','600 26px Inter','500 24px "JetBrains Mono"'].map(f=>document.fonts.load(f)));await document.fonts.ready;
  const scene=new THREE.Scene();scene.environment=envTex;scene.environmentIntensity=.9;
  const cam=new THREE.PerspectiveCamera(opts.fov||26,W/H,.1,100);
  const g=new THREE.Group();scene.add(g);
  const info=SCENES[name](T,g,scene)||{};
  // lights
  const key=new THREE.DirectionalLight(0xffffff,2.1);key.position.set(5,9,6);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.radius=7;key.shadow.bias=-.0004;
  Object.assign(key.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:30});scene.add(key);
  const rim=new THREE.DirectionalLight(0x8E67EA,2.2);rim.position.set(-6,4,-5);scene.add(rim);
  const fill=new THREE.DirectionalLight(0x67E3EE,.55);fill.position.set(-7,2,6);scene.add(fill);
  // ground shadow catcher
  const gc=document.createElement('canvas');gc.width=gc.height=256;const gx=gc.getContext('2d');const gg=gx.createRadialGradient(128,128,0,128,128,128);gg.addColorStop(0,'rgba(139,92,246,.55)');gg.addColorStop(.5,'rgba(107,63,228,.22)');gg.addColorStop(1,'rgba(107,63,228,0)');gx.fillStyle=gg;gx.fillRect(0,0,256,256);
  const gt=new THREE.CanvasTexture(gc);const glow=new THREE.Mesh(new THREE.PlaneGeometry(info.glow??15,info.glow??15),new THREE.MeshBasicMaterial({map:gt,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));glow.rotation.x=-Math.PI/2;glow.position.y=(info.floor??0)+.003;scene.add(glow);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({opacity:.38}));gr.rotation.x=-Math.PI/2;gr.position.y=info.floor??0;gr.receiveShadow=true;scene.add(gr);
  g.rotation.y=(info.rot??0);g.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(g);const ctr=bb.getCenter(new THREE.Vector3());
  const az=(info.az??-28)*Math.PI/180,el=(info.el??20)*Math.PI/180;
  const dir=new THREE.Vector3(Math.sin(az)*Math.cos(el),Math.sin(el),Math.cos(az)*Math.cos(el));
  let dist=20;const look=ctr.clone();const tx=(info.fx??.80),ty=(info.fy??.80);
  const corners=[];for(const x of [bb.min.x,bb.max.x])for(const y of [bb.min.y,bb.max.y])for(const z of [bb.min.z,bb.max.z])corners.push(new THREE.Vector3(x,y,z));
  for(let it=0;it<10;it++){cam.position.copy(look).addScaledVector(dir,dist);cam.lookAt(look);cam.updateMatrixWorld(true);cam.updateProjectionMatrix();
    let mnx=9,mxx=-9,mny=9,mxy=-9;corners.forEach(c=>{const v=c.clone().project(cam);mnx=Math.min(mnx,v.x);mxx=Math.max(mxx,v.x);mny=Math.min(mny,v.y);mxy=Math.max(mxy,v.y)});
    const cx=(mnx+mxx)/2,cy=(mny+mxy)/2;const right=new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld,0),up=new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld,1);
    const hh=Math.tan(cam.fov*Math.PI/360)*dist;look.addScaledVector(right,cx*hh*cam.aspect*.9).addScaledVector(up,cy*hh*.9);
    const sx=(mxx-mnx)/2/tx,sy=(mxy-mny)/2/ty;dist*=Math.max(sx,sy)**.9;}
  cam.position.copy(look).addScaledVector(dir,dist);cam.lookAt(look);cam.updateMatrixWorld(true);
  renderer.render(scene,cam);
  g.updateMatrixWorld(true);
  const labels=(info.labels||[]).map(l=>{const v=new THREE.Vector3(...l.p);g.localToWorld(v);v.project(cam);return {t:l.t,x:(v.x+1)/2,y:(1-v.y)/2,tone:l.tone||'lav'}});
  return {png:renderer.domElement.toDataURL('image/png'),labels};
};
window.__ready=true;
