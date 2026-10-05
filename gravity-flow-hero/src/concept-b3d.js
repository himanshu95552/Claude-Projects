import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

const W=1600,H=1200,T=26;
const stage=document.getElementById('frame'),labelsEl=document.getElementById('labels');
const fit=()=>{stage.style.transform=`translate(-50%,-50%) scale(${Math.min(innerWidth/W,innerHeight/H)})`};addEventListener('resize',fit);fit();

const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(W,H);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.8;
document.getElementById('gl').appendChild(renderer.domElement);

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x120c24);scene.fog=new THREE.Fog(0x120c24,40,70);
const pm=new THREE.PMREMGenerator(renderer);
scene.environment=pm.fromScene(new RoomEnvironment(),0.04).texture;scene.environmentIntensity=.22;

const camera=new THREE.PerspectiveCamera(27,W/H,.1,100);
camera.position.set(27,21.5,35.5);camera.lookAt(-.8,0,.8);

// lights: soft key from above-left, plum rim from behind
const key=new THREE.DirectionalLight(0xffffff,1.5);key.position.set(-6,16,8);key.castShadow=true;
key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-16,right:16,top:14,bottom:-14,near:1,far:40});key.shadow.radius=6;key.shadow.bias=-.0004;scene.add(key);
const rim=new THREE.DirectionalLight(0x8E67EA,2.2);rim.position.set(10,6,-12);scene.add(rim);
scene.add(new THREE.HemisphereLight(0x8E7FD8,0x120c24,.18));

// floor with a soft plum pool of light under the scene
const floorTex=(()=>{const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');const r=g.createRadialGradient(256,256,10,256,256,256);r.addColorStop(0,'#3a2c78');r.addColorStop(.5,'#1d1540');r.addColorStop(1,'#120c24');g.fillStyle=r;g.fillRect(0,0,512,512);return new THREE.CanvasTexture(c)})();
const floor=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshStandardMaterial({map:floorTex,color:0x555555,roughness:.85,metalness:0}));
floor.rotation.x=-Math.PI/2;floor.position.y=-.55;floor.receiveShadow=true;scene.add(floor);

const mat=(c,o={})=>new THREE.MeshPhysicalMaterial({color:c,roughness:.28,metalness:.05,clearcoat:1,clearcoatRoughness:.12,...o});
const rbox=(w,h,d,m,x,y,z,r=.12)=>{const e=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,5,Math.min(r,h/2-.01)),m);e.position.set(x,y,z);e.castShadow=e.receiveShadow=true;scene.add(e);return e};

const laneZ=[-3.6,-1.2,1.2,3.6];
// platform (the engine)
rbox(14.4,.5,11.6,mat(0x2A2050,{roughness:.22,metalness:.25}),0,-.25,0,.2);
const rimMesh=rbox(14.8,.12,12,mat(0x6B3FE4,{emissive:0x6B3FE4,emissiveIntensity:.35,roughness:.3}),0,-.56,0,.05);
// events (left)
const evNames=['Appointment booked','Report signed','Order created','Patient missed the visit'];
const evs=laneZ.map((z,i)=>{const g=new THREE.Group();g.position.set(-9.4,0,z);scene.add(g);
  const b=new THREE.Mesh(new RoundedBoxGeometry(3.2,.55,1.5,5,.14),mat(0xF3EEFE,{roughness:.2}));b.position.y=.28;b.castShadow=b.receiveShadow=true;g.add(b);
  const st=new THREE.Mesh(new RoundedBoxGeometry(1.5,.06,.18,3,.03),new THREE.MeshStandardMaterial({color:0x6B3FE4,emissive:0x6B3FE4,emissiveIntensity:1.4}));st.position.set(-.5,.58,-.35);g.add(st);
  [1.1,.8].forEach((w,k)=>{const l=new THREE.Mesh(new RoundedBoxGeometry(w*1.2,.05,.12,3,.025),new THREE.MeshStandardMaterial({color:0x9c86e0}));l.position.set(-.5+(w*1.2-1.5)/2*0+(-.3+w*.3),.58,0+k*.26);g.add(l)});
  return g});
// agent block
const agentMat=mat(0x6B3FE4,{metalness:.35,roughness:.16,emissive:0x3A1C86,emissiveIntensity:.45});
const agent=rbox(3.4,1.9,4.9,agentMat,0,.95,2.4,.35);
const ringMats=[0xC9B3FF,0x8E67EA].map(c=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:1.6}));
const rings=[0,1].map(i=>{const r=new THREE.Mesh(new THREE.TorusGeometry(1.9+i*.5,.045,16,120),ringMats[i]);r.position.set(0,2.6+i*.0,2.4);r.rotation.x=Math.PI/2;scene.add(r);return r});
// done tiles (right)
const doneMats=[];const dones=[0,1,2].map(i=>{const m=mat(0x3a2f6a,{emissive:0x22C1CE,emissiveIntensity:0});doneMats.push(m);return rbox(2.8,.4,1.5,m,9.2,.2,laneZ[i],.12)});
// worklist stack (right)
const wlMats=[0xF3EEFE,0x9c86e0,0x6e57b8].map(c=>mat(c,{roughness:.22}));
const wl=[0,1,2].map(i=>rbox(3.2,.34,1.7,wlMats[i],8.8,.17+i*.4,laneZ[3]+0,.1));
const wlTopGlow=new THREE.MeshStandardMaterial({color:0xF59E0B,emissive:0xF59E0B,emissiveIntensity:0});
const wlStrip=new THREE.Mesh(new RoundedBoxGeometry(2.2,.05,.2,3,.025),wlTopGlow);wlStrip.position.set(8.8,1.04,laneZ[3]-.45);scene.add(wlStrip);

// light tracks
const laneColor=0xC9B3FF;
const tube=(pts,r,color,op)=>{const c=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p)),false,'catmullrom',0);const m=new THREE.Mesh(new THREE.TubeGeometry(c,2,r,10,false),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:op,roughness:.4}));scene.add(m);return m};
const Y=.32;
const paths=[
 [[-8.0,Y,laneZ[0]],[8.6,Y,laneZ[0]]],
 [[-8.0,Y,laneZ[1]],[8.6,Y,laneZ[1]]],
 [[-8.0,Y,laneZ[2]],[-1.7,Y,laneZ[2]],[1.7,Y,laneZ[2]],[8.6,Y,laneZ[2]]],
 [[-8.0,Y,laneZ[3]],[-1.7,Y,laneZ[3]],[1.7,Y,laneZ[3]],[8.2,Y,laneZ[3]]]];
paths.forEach(p=>tube(p,.04,laneColor,.55));
// packets
const packets=paths.map((p,i)=>{const g=new THREE.Group();const c=i==3?0xF59E0B:0xffffff;
  g.add(new THREE.Mesh(new THREE.SphereGeometry(.26,32,24),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:2})));
  const halo=new THREE.Mesh(new THREE.SphereGeometry(.5,24,16),new THREE.MeshBasicMaterial({color:i==3?0xF59E0B:0xC9B3FF,transparent:true,opacity:.18,depthWrite:false}));g.add(halo);
  scene.add(g);return g});
const poly=(pts,u)=>{const v=pts.map(p=>new THREE.Vector3(...p));let tot=0;const L=[];for(let k=0;k<v.length-1;k++){L.push(v[k].distanceTo(v[k+1]));tot+=L[k]}let d=u*tot;for(let k=0;k<L.length;k++){if(d<=L[k]||k==L.length-1){return v[k].clone().lerp(v[k+1],L[k]?Math.min(1,d/L[k]):0)}d-=L[k]}};

const post=new EffectComposer(renderer);post.setSize(W,H);post.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(W,H),.45,.35,.95);post.addPass(bloom);post.addPass(new OutputPass());

// labels (HTML overlay, real brand type)
const L=[];
const mk=(anchor,eb,txt,t0,align='c')=>{const e=document.createElement('div');e.className='lab '+align;e.innerHTML=(eb?`<span class="eb">${eb}</span>`:'')+`<span class="tx">${txt}</span>`;labelsEl.appendChild(e);L.push({e,a:new THREE.Vector3(...anchor),t0});};
evNames.forEach((n,i)=>mk([-11.4,.3,laneZ[i]],'',n,.2+i*.3,'r'));
mk([-11.4,2.2,laneZ[0]-3.0],'Any event','Starts a workflow',.1,'r');
mk([10.0,1.0,laneZ[0]-1.6],'Nothing to decide','Done on its own',4.0,'r');
mk([2.4,5.4,2.4],'Something to decide','An agent does the work',5.5,'c');
mk([8.8,-.3,laneZ[3]+3.6],'Exceptions','Go to your team',11.5,'c');
mk([-3.5,0,6.9],'Engine','Gravity Flow',1.0,'c');
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),seg=(t,a,b)=>clamp((t-a)/(b-a)),ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
function update(t){
  const fin=1-seg(t,24.6,25.8), vis=v=>v*fin;
  // lanes 0,1: routine, straight through
  [0,1].forEach(i=>{const s=1.5+i*.6,u=ease(seg(t,s,s+4.4));packets[i].position.copy(poly(paths[i],u));packets[i].visible=t>s&&t<24.6&&u<1});
  // lanes 2,3: into the agent, work, out
  const inAgent={};
  [2,3].forEach(i=>{const s=2.6+(i-2)*.6,tIn=s+3.4,tOut=tIn+3.2,tEnd=tOut+(i==2?3.4:2.6);
    const p=paths[i];let pos;
    if(t<tIn){pos=poly(p.slice(0,2),ease(seg(t,s,tIn)))}else if(t<tOut){pos=new THREE.Vector3(0,Y,laneZ[i]);inAgent[i]=true}else{pos=poly(p.slice(2),ease(seg(t,tOut,tEnd)))}
    packets[i].position.copy(pos);packets[i].visible=t>s&&t<24.6&&!inAgent[i]&&seg(t,tOut,tEnd)<1});
  // lights on arrival
  [[0,1.5+4.4],[1,2.1+4.4],[2,2.6+3.4+3.2+3.4]].forEach(([i,ta])=>{doneMats[i].emissiveIntensity=clamp((t-ta)/.5)*1.1*vis(1)});
  wlTopGlow.emissiveIntensity=clamp((t-(3.2+3.4+3.2+2.6))/.5)*2.2*vis(1);
  // agent works
  const busy=t>3.4&&t<12.8?1:0;agentMat.emissiveIntensity=.35+busy*(.55+.25*Math.sin(t*5));
  rings.forEach((r,i)=>{r.rotation.z=t*(busy?2.4:.5)*(i?-1:1);r.position.y=2.55+Math.sin(t*1.6+i)*.07;r.scale.setScalar(busy?1:.92)});
  rimMesh.material.emissiveIntensity=.3+.1*Math.sin(t*1.2);
  // gentle camera drift (parallax depth)
  camera.position.set(27+Math.sin(t*.25)*.8,21.5,35.5+Math.cos(t*.25)*.6);camera.lookAt(-.8,0,.8);camera.updateMatrixWorld();
  post.render();
  // labels
  L.forEach(o=>{const v=o.a.clone().project(camera);o.e.style.left=((v.x*.5+.5)*W)+'px';o.e.style.top=((-v.y*.5+.5)*H)+'px';o.e.style.opacity=clamp(Math.min(seg(t,o.t0,o.t0+.7),fin))});
}
window.__seek=ms=>{update(ms/1000)};
if(matchMedia('(prefers-reduced-motion: reduce)').matches){update(21)}else{const t0=performance.now();(function f(){if(window.__seeking)return;update(((performance.now()-t0)/1000)%T);requestAnimationFrame(f)})()}
window.__ready=true;
