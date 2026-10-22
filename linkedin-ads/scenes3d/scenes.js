const PI=Math.PI;
// ---------- shared builders ----------
const B=(T)=>{const {box,cyl,sph,tube,tex,screen,M,THREE}=T;
const api={};
api.doc=(w,h,draw,mat=T.M.white)=>{const g=new THREE.Group();const b=box(w,h,.07,.03,mat);g.add(b);if(draw){const t=tex(Math.round(w*256),Math.round(h*256),draw);const f=new THREE.Mesh(new THREE.PlaneGeometry(w*.96,h*.96),new THREE.MeshBasicMaterial({map:t,toneMapped:false}));f.position.z=.041;g.add(f)}return g};
api.lines=(x,w,h,rows,col='#8E86B8',top=.16)=>{x.fillStyle=col;for(let i=0;i<rows;i++){x.fillRect(w*.1,h*(top+i*(.72/rows)),w*(i%3==2?.45:.8),h*.025)}};
api.phone=(draw,body=T.M.white)=>{const g=new THREE.Group();const b=box(2.1,4.2,.24,.3,body);g.add(b);const bz=box(1.9,4.0,.1,.22,T.M.inkD);bz.position.z=.1;g.add(bz);const t=tex(512,1024,draw);const s=screen(1.78,3.56,t);s.position.z=.152;g.add(s);return g};
api.monitor=(draw,w=3.6,h=2.2)=>{const g=new THREE.Group();const fr=box(w,h,.16,.12,T.M.white);fr.position.y=h/2+.9;g.add(fr);const t=tex(Math.round(w*220),Math.round(h*220),draw);const s=screen(w-.22,h-.22,t);s.position.set(0,h/2+.9,.09);g.add(s);const nk=box(.3,.9,.18,.08,T.M.lav);nk.position.set(0,.45,-.1);g.add(nk);const bs=cyl(.9,1.0,.12,T.M.lav);bs.position.y=.06;g.add(bs);return g};
api.keyboard=()=>{const g=new THREE.Group();const b=box(3,.14,1.1,.06,T.M.white);g.add(b);for(let r=0;r<4;r++)for(let c=0;c<10;c++){const k=box(.2,.07,.2,.03,T.M.lav);k.position.set(-1.25+c*.28,.1,-.36+r*.24);g.add(k)}return g};
api.check=(col,s=1)=>{const g=new THREE.Group();const p=[[-.55,0],[-.15,-.42],[.6,.5]];g.add(T.tube([p[0][0],p[0][1],0],[p[1][0],p[1][1],0],.13*s,col),T.tube([p[1][0],p[1][1],0],[p[2][0],p[2][1],0],.13*s,col));[0,1,2].forEach(i=>{const sp=sph(.13*s,col);sp.position.set(p[i][0],p[i][1],0);g.add(sp)});g.scale.setScalar(s);return g};
api.badge=(col,s=1)=>{const g=new THREE.Group();const c=cyl(.7,.7,.2,col);c.rotation.x=PI/2;g.add(c);const k=api.check(T.M.white,.8);k.position.z=.16;g.add(k);g.scale.setScalar(s);return g};
api.clock=(s=1)=>{const g=new THREE.Group();const f=cyl(.9,.9,.22,T.M.white);f.rotation.x=PI/2;g.add(f);const r=new THREE.Mesh(new THREE.TorusGeometry(.9,.1,24,64),T.M.amber);r.castShadow=true;r.position.z=0;g.add(r);const h1=box(.1,.5,.06,.03,T.M.inkD);h1.position.set(0,.2,.14);g.add(h1);const h2=box(.38,.1,.06,.03,T.M.inkD);h2.position.set(.15,0,.15);g.add(h2);g.scale.setScalar(s);return g};
api.bubble=(mat,w=1.8,h=.9,tail=-1,text,col='#1B1430')=>{const g=new THREE.Group();g.add(box(w,h,.3,.3,mat));if(text){const tx=tex(Math.round(w*240),Math.round(h*240),(c,W,H)=>{c.clearRect(0,0,W,H);c.fillStyle=col;c.font='700 '+Math.round(H*.34)+'px Urbanist';c.textAlign='center';c.fillText(text,W/2,H*.62)});const f=new THREE.Mesh(new THREE.PlaneGeometry(w*.94,h*.94),new THREE.MeshBasicMaterial({map:tx,transparent:true,toneMapped:false}));f.position.z=.16;g.add(f)}const t=new THREE.Mesh(new THREE.ConeGeometry(.2,.35,24),mat);t.position.set(tail*w*.28,-h*.62,0);t.rotation.z=tail>0?.5:-.5;t.castShadow=true;g.add(t);return g};
api.coin=(r=.5)=>{const g=new THREE.Group();const c=cyl(r,r,.14,T.M.amber,48);g.add(c);const i=cyl(r*.72,r*.72,.16,T.M.amber,48);g.add(i);return g};
api.shield=(mat,s=1)=>{const sh=new THREE.Shape();sh.moveTo(0,1.5);sh.bezierCurveTo(.9,1.3,1.3,1.2,1.3,1.2);sh.lineTo(1.3,.1);sh.bezierCurveTo(1.3,-.8,.5,-1.3,0,-1.6);sh.bezierCurveTo(-.5,-1.3,-1.3,-.8,-1.3,.1);sh.lineTo(-1.3,1.2);sh.bezierCurveTo(-1.3,1.2,-.9,1.3,0,1.5);const m=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.35,bevelEnabled:true,bevelThickness:.14,bevelSize:.14,bevelSegments:8,curveSegments:32}),mat);m.castShadow=true;m.scale.setScalar(s);return m};
api.person=null;
return api};
const drawUI=(x,w,h,bg='#1B1430')=>{x.fillStyle=bg;x.fillRect(0,0,w,h)};
// ---------- scenes ----------
export const SCENES={
phone:(T,g)=>{const A=B(T),{M,box,sph,tex,THREE}=T;
 const ph=A.phone((x,w,h)=>{drawUI(x,w,h,'#1B1430');x.fillStyle='#fff';x.font='700 54px Urbanist';x.fillText('Pick a time',44,120);x.fillStyle='#B4A8D6';x.font='500 28px Inter';x.fillText('Tuesday · MRI',44,166);
  const t=['9:00','9:30','10:00','10:30','11:00','11:30','1:00','1:30','2:00'];for(let r=0;r<3;r++)for(let c=0;c<3;c++){const on=(r===1&&c===0);x.fillStyle=on?'#10B981':'rgba(255,255,255,.12)';T.rr(x,44+c*150,210+r*130,134,100,24);x.fill();x.fillStyle=on?'#06281e':'#E7DDFC';x.font='600 34px Inter';x.textAlign='center';x.fillText(t[r*3+c],111+c*150,274+r*130);x.textAlign='left'}
  x.fillStyle='#C9B3FF';T.rr(x,44,640,424,104,28);x.fill();x.fillStyle='#1B1430';x.font='700 40px Urbanist';x.textAlign='center';x.fillText('Book this time',256,706);x.textAlign='left';
  x.fillStyle='#10B981';T.rr(x,44,790,424,90,24);x.fill();x.fillStyle='#052e22';x.font='600 30px Inter';x.fillText('✓  Confirmed by text',84,848)});
 ph.position.set(0,2.15,0);ph.rotation.y=.12;g.add(ph);
 const b1=A.bubble(M.lav,3.0,1.0,-1,'Your slot is open');b1.position.set(-3.5,3.3,1.2);b1.rotation.y=.2;g.add(b1);
 const b2=A.bubble(M.violet,2.2,.9,1,'Booked ✓','#ffffff');b2.position.set(2.9,1.6,1.0);b2.rotation.y=-.2;g.add(b2);
 return {cy:2.1,az:-22,el:12,dist:15.5,labels:[{t:'TEXT SENT',p:[-2.2,4.5,1.4],tone:'lav'},{t:'PATIENT BOOKS',p:[2.1,2.6,1.2],tone:'ok'}]}},
fax:(T,g)=>{const A=B(T),{M,box,cyl,tex,screen,THREE,tube}=T;
 // fax machine
 const base=box(3.2,1.1,2.2,.25,M.white);base.position.set(-2.2,.55,0);g.add(base);
 const top=box(3.0,.5,1.6,.2,M.lav);top.position.set(-2.2,1.35,-.2);top.rotation.x=-.12;g.add(top);
 const panel=box(1.2,.12,.7,.05,M.inkD);panel.position.set(-2.8,1.75,.4);panel.rotation.x=-.25;g.add(panel);
 [0,1,2].forEach(i=>{const b=cyl(.07,.07,.06,i==2?M.green:M.violet,24);b.position.set(-2.2+i*.22,1.8,.45);b.rotation.x=-.25;g.add(b)});
 for(let i=0;i<6;i++){const d=A.doc(1.6,2.1,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);A.lines(x,w,h,7,'#B4A8D6',.1);x.fillStyle='#F59E0B';x.fillRect(w*.1,h*.82,w*.3,h*.05)});d.rotation.x=-PI/2+.06;d.position.set(-2.2+(i%2)*.1,.3+i*.06+1.05,1.9+i*.08);g.add(d)}
 for(let i=0;i<5;i++){const d=A.doc(1.5,2.0,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);A.lines(x,w,h,7,'#B4A8D6',.1)});d.position.set(-2.2+(i-2)*.05,2.6+i*.03,-.3-i*.06);d.rotation.set(-.35,.05*(i-2),0);g.add(d)}
 // arrow tube
 const ar=box(1.5,.18,.18,.08,M.violet);ar.position.set(.4,1.3,.4);g.add(ar);const tip=new THREE.Mesh(new THREE.ConeGeometry(.3,.55,32),M.violet);tip.rotation.z=-PI/2;tip.position.set(1.3,1.3,.4);tip.castShadow=true;g.add(tip);
 // monitor with order form
 const mon=A.monitor((x,w,h)=>{drawUI(x,w,h,'#F6F4FA');x.fillStyle='#1B1430';x.font='700 44px Urbanist';x.fillText('New order',40,70);x.fillStyle='#6B3FE4';x.fillRect(40,92,120,5);
  [['Patient','Maya R.'],['Exam','MRI lumbar'],['Referring','Dr. Chen'],['Insurance','Verified']].forEach((r,i)=>{x.fillStyle='#8E86B8';x.font='500 26px Inter';x.fillText(r[0],40,150+i*70);x.fillStyle='#1B1430';x.font='600 30px Inter';x.fillText(r[1],260,150+i*70);x.fillStyle='#E3DDF2';x.fillRect(40,166+i*70,w-80,2)});
  x.fillStyle='#10B981';T.rr(x,40,h-80,200,52,14);x.fill();x.fillStyle='#052e22';x.font='600 26px Inter';x.fillText('Confirm',84,h-44)},3.7,2.4);
 mon.position.set(3.3,0,-.4);mon.rotation.y=-.18;g.add(mon);
 const kb=A.keyboard();kb.position.set(3.0,.08,1.6);kb.rotation.y=-.18;g.add(kb);
 return {cy:1.7,az:-24,el:20,dist:19,labels:[{t:'FAX',p:[-2.2,3.4,.2],tone:'amber'},{t:'ORDER DRAFTED',p:[3.3,4.6,-.2],tone:'ok'}]}},
network:(T,g)=>{const A=B(T),{M,sph,tube,cyl,THREE}=T;
 const hub=sph(1.0,M.violet);hub.position.set(-2.2,1.6,0);g.add(hub);const ring=new THREE.Mesh(new THREE.TorusGeometry(1.35,.06,16,80),M.lav);ring.rotation.x=PI/2;ring.position.copy(hub.position);g.add(ring);
 const other=sph(.85,M.amber);other.position.set(3.3,1.6,-.4);g.add(other);const r2=new THREE.Mesh(new THREE.TorusGeometry(1.15,.06,16,80),M.amber);r2.rotation.x=PI/2;r2.position.copy(other.position);g.add(r2);
 const mine=[[-4.9,.9,1.8],[-4.3,2.9,-1.6],[-1.6,3.5,-2.0],[-.6,.6,2.2],[-2.5,2.9,2.6]];
 const away=[[1.2,.6,2.0],[1.7,3.0,-2.4],[5.6,.7,1.6],[5.4,3.0,-1.8]];
 mine.forEach(p=>{g.add(tube([-2.2,1.6,0],p,.07,M.green));const n=sph(.32,M.white);n.position.set(...p);g.add(n)});
 away.forEach((p,i)=>{g.add(tube([3.3,1.6,-.4],p,.06,M.amber));const n=sph(.3,M.white);n.position.set(...p);g.add(n)});
 return {cy:1.8,az:-18,el:22,dist:21,labels:[{t:'SENDS TO YOU',p:[-2.2,3.2,0],tone:'ok'},{t:'SENDS ELSEWHERE',p:[3.3,3.1,-.4],tone:'amber'}]}},
gaps:(T,g)=>{const A=B(T),{M,box,THREE}=T;
 const cols=6,rows=5;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const e=[[0,4],[1,2],[2,5],[3,1],[4,3]].some(([rr,cc])=>rr===r&&cc===c);const x=-3.6+c*1.45,z=-2.6+r*1.3;
  if(e){const b=box(1.28,.12,1.1,.1,M.glass);b.position.set(x,.06,z);g.add(b);const e2=new THREE.Mesh(new THREE.TorusGeometry(.2,.04,12,32),M.amber);e2.rotation.x=PI/2;e2.position.set(x,.2,z);g.add(e2)}
  else{const b=box(1.28,.36,1.1,.12,(r+c)%3===0?M.violet:M.lav);b.position.set(x,.18,z);g.add(b)}}
 const pad=box(10.2,.2,7.6,.2,M.ink);pad.position.set(0,-.1,-.2);g.add(pad);
 return {cy:.4,az:-24,el:34,dist:19,floor:-.2,labels:[{t:'EMPTY SLOTS',p:[2.0,1.0,1.8],tone:'amber'}]}},
timeline:(T,g)=>{const A=B(T),{M,box,sph,cyl,tube,THREE}=T;
 const bar=box(11,.28,.5,.14,M.ink);bar.position.set(0,.5,0);g.add(bar);
 const pts=[[-4.6,'green'],[0,'white'],[4.6,'amber']];
 pts.forEach(([x,c])=>{const s=sph(.62,M[c]);s.position.set(x,1.25,0);g.add(s);const st=cyl(.06,.06,.7,M.lav);st.position.set(x,.85,0);g.add(st)});
 const ok=A.check(M.green,.9);ok.position.set(-4.6,2.7,0);g.add(ok);
 const x2=box(.2,1.2,.2,.05,M.amber);x2.position.set(4.6,2.8,0);x2.rotation.z=PI/4;g.add(x2);const x3=box(.2,1.2,.2,.05,M.amber);x3.position.set(4.6,2.8,0);x3.rotation.z=-PI/4;g.add(x3);
 const cl=A.clock(.7);cl.position.set(2.3,2.3,.5);g.add(cl);
 return {cy:1.5,az:-12,el:16,dist:19,labels:[{t:'CAUGHT AT BOOKING',p:[-4.6,3.8,0],tone:'ok'},{t:'SCAN',p:[0,2.3,0],tone:'lav'},{t:'DENIED WEEKS LATER',p:[4.6,3.9,0],tone:'amber'}]}}
};

// ---------- more scenes ----------
const more=(T)=>{};
Object.assign(SCENES,{
textbook:(T,g)=>SCENES.phone(T,g),
profit:(T,g)=>{const A=B(T),{M,box}=T;
 const base=box(9.6,.3,5.6,.15,M.ink);base.position.y=-.15;g.add(base);
 [.9,1.7,2.6,3.5,4.5].forEach((h,i)=>{const b=box(1.3,h,1.3,.18,i%2?M.violet:M.lav);b.position.set(-3.4+i*1.7,h/2,1.1);g.add(b)});
 for(let i=0;i<5;i++){const b=box(1.3,.55,1.3,.14,M.green);b.position.set(-3.4+i*1.7,.275,-1.4);g.add(b)}
 return {labels:[{t:'SCANS KEEP RISING',p:[3.4,5.2,1.1],tone:'lav'},{t:'PROFIT STAYS FLAT',p:[3.4,1.1,-1.4],tone:'amber'}]}},
authstack:(T,g)=>{const A=B(T),{M,box,THREE}=T;
 for(let i=0;i<16;i++){const d=A.doc(2.6,3.4,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#6B3FE4';x.fillRect(w*.1,h*.08,w*.4,h*.05);A.lines(x,w,h,6,'#B4A8D6',.2);x.fillStyle=i%5==0?'#F59E0B':'#E3DDF2';x.fillRect(w*.1,h*.86,w*.35,h*.05)});d.rotation.x=-PI/2;d.rotation.z=(Math.sin(i*2.1)*.12);d.position.set(Math.sin(i*1.7)*.12-1,.05+i*.12,Math.cos(i*1.3)*.1);g.add(d)}
 const cl=A.clock(1.1);cl.position.set(2.3,1.3,.9);cl.rotation.y=-.35;g.add(cl);
 const bd=A.badge(M.amber,.7);bd.position.set(-1.2,2.7,1.0);bd.rotation.x=-.3;g.add(bd);
 return {labels:[{t:'AUTH QUEUE',p:[-1,2.5,0],tone:'amber'}]}},
approved:(T,g)=>{const A=B(T),{M}=T;
 const d=A.doc(3.2,4.2,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#6B3FE4';x.fillRect(w*.1,h*.07,w*.45,h*.05);A.lines(x,w,h,7,'#B4A8D6',.18)});d.position.set(-.8,2.2,0);d.rotation.y=.2;g.add(d);
 const bd=A.badge(M.green,1.6);bd.position.set(1.6,1.5,1.2);g.add(bd);return {labels:[{t:'APPROVED BEFORE ARRIVAL',p:[1.6,3.0,1.2],tone:'ok'}]}},
hiring:(T,g)=>{const A=B(T),{M,box,cyl,tex,screen}=T;
 const post=cyl(.12,.12,3.6,M.lav);post.position.set(-1.2,1.8,0);g.add(post);
 const bd=box(5,2,.28,.2,M.violet);bd.position.set(-1.2,3.9,0);g.add(bd);
 const t=tex(1000,400,(x,w,h)=>{x.fillStyle='#6B3FE4';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='700 120px Urbanist';x.fillText('NOW HIRING',60,170);x.fillStyle='#E7DDFC';x.font='500 52px Inter';x.fillText('Front desk · Scheduler · Biller',60,270)});
 const s=screen(4.8,1.9,t);s.position.set(-1.2,3.9,.15);g.add(s);
 [0,1,2,3].forEach(i=>{const c=A.coin(.55);c.position.set(2.8+(i>2?.2:0),.1+i*.16,1.2);g.add(c)});
 return {labels:[{t:'ROLE STILL OPEN',p:[-1.2,5.3,0],tone:'amber'},{t:'HIRING COSTS ADD UP',p:[2.8,1.3,1.2],tone:'lav'}]}},
chase:(T,g)=>{const A=B(T),{M,box,cyl,sph,THREE}=T;
 const d=A.doc(3.4,4.4,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#6B3FE4';x.font='700 44px Urbanist';x.fillText('Imaging order',w*.08,h*.1);A.lines(x,w,h,3,'#B4A8D6',.16);x.strokeStyle='#F59E0B';x.lineWidth=6;x.setLineDash([16,10]);x.strokeRect(w*.08,h*.42,w*.84,h*.12);x.setLineDash([]);x.fillStyle='#F59E0B';x.font='600 32px Inter';x.fillText('Referring provider: ?',w*.12,h*.495);A.lines(x,w,h,3,'#B4A8D6',.6)});d.position.set(-1.7,2.4,0);d.rotation.y=.25;g.add(d);
 const pc=A.phone((x,w,h)=>{x.fillStyle='#1B1430';x.fillRect(0,0,w,h);x.fillStyle='#B4A8D6';x.font='500 34px Inter';x.textAlign='center';x.fillText('Calling',256,260);x.fillStyle='#fff';x.font='700 64px Urbanist';x.fillText("Dr. Chen's",256,360);x.fillText('office',256,430);x.fillStyle='#F59E0B';x.beginPath();x.arc(256,620,90,0,7);x.fill();x.fillStyle='#1B1430';x.font='700 70px Urbanist';x.fillText('…',256,650);x.textAlign='left'});pc.scale.setScalar(.72);pc.position.set(2.5,1.6,.6);pc.rotation.set(0,-.25,.18);g.add(pc);
 [1,2,3].forEach(i=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.5+i*.38,.07,16,48,PI*.7),M.amber);r.position.set(3.9,3.2,.6);r.rotation.z=PI*.12;r.castShadow=true;g.add(r)});
 return {labels:[{t:'MISSING INFO',p:[-1.7,4.9,0],tone:'amber'},{t:'CALL THE OFFICE',p:[2.3,4.9,.8],tone:'lav'}]}},
card:(T,g)=>{const A=B(T),{M,box,THREE,tex,screen}=T;
 const c=box(4.2,2.6,.1,.18,M.violet);c.position.set(-.6,1.6,0);c.rotation.set(-.55,.3,.05);g.add(c);
 const t=tex(840,520,(x,w,h)=>{const gr=x.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#6B3FE4');gr.addColorStop(1,'#4A25AD');x.fillStyle=gr;x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='700 56px Urbanist';x.fillText('Health plan',50,100);x.fillStyle='#F59E0B';T.rr(x,50,160,120,90,16);x.fill();x.fillStyle='#E7DDFC';x.font='500 30px "JetBrains Mono"';x.fillText('MEMBER  0000 0000',50,340);x.fillText('COPAY  ·  DEDUCTIBLE',50,400)});
 const f=new THREE.Mesh(new THREE.PlaneGeometry(4.1,2.55),new THREE.MeshBasicMaterial({map:t,toneMapped:false}));f.position.set(0,0,.056);c.add(f);
 const sh=A.shield(M.green,.9);sh.position.set(3.0,2.2,.6);g.add(sh);const ck=A.check(M.white,.9);ck.position.set(3.0,2.15,1.1);g.add(ck);
 const mg=new THREE.Mesh(new THREE.TorusGeometry(.8,.13,24,64),M.lav);mg.position.set(-2.6,2.6,1.4);mg.castShadow=true;g.add(mg);const hd=T.tube([-2.05,2.05,1.4],[-1.3,1.3,1.4],.17,M.lav);g.add(hd);
 return {labels:[{t:'COVERAGE CHECKED',p:[3.0,3.9,.6],tone:'ok'}]}},
phonepay:(T,g)=>{const A=B(T),{M}=T;
 const ph=A.phone((x,w,h)=>{x.fillStyle='#1B1430';x.fillRect(0,0,w,h);x.fillStyle='#B4A8D6';x.font='500 30px Inter';x.fillText('Your estimate',44,120);x.fillStyle='#fff';x.font='700 120px Urbanist';x.fillText('$120',44,260);x.fillStyle='#B4A8D6';x.font='500 28px Inter';x.fillText('MRI lumbar spine',44,320);
  x.fillStyle='rgba(255,255,255,.1)';T.rr(x,44,380,424,220,28);x.fill();x.fillStyle='#E7DDFC';x.font='500 28px Inter';x.fillText('Insurance pays   $480',72,450);x.fillText('Deductible left   $120',72,500);x.fillText('Your share         $120',72,550);
  x.fillStyle='#C9B3FF';T.rr(x,44,680,424,110,30);x.fill();x.fillStyle='#1B1430';x.font='700 44px Urbanist';x.textAlign='center';x.fillText('Pay now',256,752);x.textAlign='left'});
 ph.position.set(-.4,2.15,0);ph.rotation.y=.12;g.add(ph);
 [0,1,2,3,4].forEach(i=>{const c=A.coin(.62);c.position.set(2.9,.1+i*.17,.9);g.add(c)});[0,1].forEach(i=>{const c=A.coin(.62);c.position.set(3.7,.1+i*.17,.2);g.add(c)});
 return {labels:[{t:'ESTIMATE SENT BEFORE THE VISIT',p:[-.4,4.7,0],tone:'ok'}]}},
report:(T,g)=>{const A=B(T),{M,box,THREE,tex,screen}=T;
 const d=A.doc(3,4,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#6B3FE4';x.font='700 44px Urbanist';x.fillText('Report',w*.1,h*.1);A.lines(x,w,h,7,'#B4A8D6',.17);x.strokeStyle='#4A25AD';x.lineWidth=6;x.beginPath();x.moveTo(w*.12,h*.88);x.bezierCurveTo(w*.2,h*.78,w*.28,h*.98,w*.4,h*.84);x.stroke();x.fillStyle='#10B981';x.font='600 30px Inter';x.fillText('SIGNED',w*.55,h*.9)});d.position.set(-3.6,2.2,0);d.rotation.y=.35;g.add(d);
 const bl=box(3.6,3.6,3,.2,M.white);bl.position.set(3.4,1.8,-.4);g.add(bl);
 const wt=tex(512,512,(x,w,h)=>{x.fillStyle='#F6F4FA';x.fillRect(0,0,w,h);for(let r=0;r<3;r++)for(let c=0;c<3;c++){x.fillStyle=(r==1&&c==1)?'#10B981':'#6B3FE4';T.rr(x,50+c*150,60+r*130,110,90,16);x.fill()}x.fillStyle='#1B1430';x.fillRect(200,400,110,112)});
 const wf=new THREE.Mesh(new THREE.PlaneGeometry(3.4,3.4),new THREE.MeshBasicMaterial({map:wt,toneMapped:false}));wf.position.set(3.4+.0,1.8,1.12);g.add(wf);
 const r=box(1.0,.32,.1,.04,M.violet);r.position.set(0,3.1,.4);g.add(r);const tip=new THREE.Mesh(new THREE.ConeGeometry(.3,.6,32),M.violet);tip.rotation.z=-PI/2;tip.position.set(.7,3.1,.4);tip.castShadow=true;g.add(tip);
 const bd=A.badge(M.green,.7);bd.position.set(5.0,3.9,1.2);g.add(bd);
 return {labels:[{t:'SIGNED REPORT',p:[-3.6,4.7,0],tone:'lav'},{t:'REFERRING OFFICE GETS IT',p:[3.4,4.4,1],tone:'ok'}]}},
status:(T,g)=>{const A=B(T),{M,box}=T;
 const tb=box(5.6,4.0,.22,.28,M.white);tb.position.set(0,2.3,0);tb.rotation.y=.18;g.add(tb);
 const sc=T.screen(5.2,3.6,T.tex(1040,720,(x,w,h)=>{x.fillStyle='#1B1430';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='700 56px Urbanist';x.fillText('Order status',50,100);
  [['Order received',1],['Patient scheduled',1],['Exam completed',1],['Report signed',1]].forEach((r,i)=>{x.fillStyle='#10B981';x.beginPath();x.arc(80,190+i*125,32,0,7);x.fill();x.strokeStyle='#052e22';x.lineWidth=8;x.beginPath();x.moveTo(64,190+i*125);x.lineTo(77,203+i*125);x.lineTo(98,176+i*125);x.stroke();x.fillStyle='#fff';x.font='600 42px Inter';x.fillText(r[0],140,205+i*125)})}));
 sc.position.set(0,2.3,.13);sc.rotation.y=.18;sc.position.x=.0;g.add(sc);
 return {labels:[{t:'NO PHONE CALL NEEDED',p:[0,4.9,0],tone:'ok'}]}},
worklist:(T,g)=>{const A=B(T),{M,box}=T;
 const tb=box(5.6,4.0,.22,.28,M.white);tb.position.set(0,2.3,0);tb.rotation.y=.18;g.add(tb);
 const sc=T.screen(5.2,3.6,T.tex(1040,720,(x,w,h)=>{x.fillStyle='#1B1430';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='700 56px Urbanist';x.fillText('Needs a person',50,100);
  [['Fax: missing referring doctor','#F59E0B'],['Patient replied by text','#8E67EA'],['Call back: referring office','#8E67EA'],['Auth needs a second look','#F59E0B']].forEach((r,i)=>{x.fillStyle='rgba(255,255,255,.1)';T.rr(x,50,150+i*135,w-100,105,24);x.fill();x.fillStyle=r[1];x.beginPath();x.arc(100,202+i*135,18,0,7);x.fill();x.fillStyle='#fff';x.font='500 40px Inter';x.fillText(r[0],140,216+i*135)})}));
 sc.position.set(0,2.3,.13);sc.rotation.y=.18;g.add(sc);
 return {labels:[{t:'ONE SHARED LIST',p:[0,4.9,0],tone:'lav'}]}},
chat:(T,g)=>{const A=B(T),{M,box,tex,THREE,tube}=T;
 const items=[['Patient text',M.lav,-1.6,3.7],['Fax from Dr. Chen',M.white,1.4,2.45],['Call with payer',M.lav,-1.4,1.2],['Email: auth reply',M.white,1.5,-0.05]];
 items.forEach(([t,m,x,y],i)=>{const b=box(3.6,1.0,.34,.34,m);b.position.set(x,y,0);g.add(b);const tx=tex(720,200,(c,w,h)=>{c.clearRect(0,0,w,h);c.fillStyle='#1B1430';c.font='700 64px Urbanist';c.fillText(t,50,125)});const f=new THREE.Mesh(new THREE.PlaneGeometry(3.4,.95),new THREE.MeshBasicMaterial({map:tx,transparent:true,toneMapped:false}));f.position.set(x,y,.18);g.add(f)});
 g.add(tube([0,-.6,-.3],[0,4.5,-.3],.07,M.violet));
 return {labels:[{t:'ONE TIMELINE PER ORDER',p:[0,5.4,0],tone:'lav'}]}},
flow:(T,g)=>{const A=B(T),{M,box,tex,THREE,tube}=T;
 const names=['Order in','Coverage','Booked','Auth','Paid'];const xs=[-5.2,-2.6,0,2.6,5.2];
 names.forEach((n,i)=>{const b=box(2.0,1.3,.5,.3,i==4?M.green:M.white);b.position.set(xs[i],1.4+(i%2?.5:0),0);g.add(b);const tx=tex(400,260,(c,w,h)=>{c.clearRect(0,0,w,h);c.fillStyle=i==4?'#052e22':'#1B1430';c.font='700 62px Urbanist';c.textAlign='center';c.fillText(n,200,155)});const f=new THREE.Mesh(new THREE.PlaneGeometry(1.9,1.2),new THREE.MeshBasicMaterial({map:tx,transparent:true,toneMapped:false}));f.position.set(xs[i],1.4+(i%2?.5:0),.26);g.add(f);
  if(i<4){g.add(tube([xs[i]+1.0,1.4+(i%2?.5:0),0],[xs[i+1]-1.0,1.4+((i+1)%2?.5:0),0],.09,M.violet))}});
 const ck=A.check(M.green,.8);ck.position.set(5.2,3.3,0);g.add(ck);
 return {labels:[{t:'RUNS ITSELF · STAFF HANDLE EXCEPTIONS',p:[0,3.4,0],tone:'lav'}]}},
shield:(T,g)=>{const A=B(T),{M,box,THREE}=T;
 const s=A.shield(M.violet,1.5);s.position.set(0,2.4,0);g.add(s);
 const lk=box(1.4,1.1,.5,.2,M.white);lk.position.set(0,2.2,.9);g.add(lk);const sh=new THREE.Mesh(new THREE.TorusGeometry(.42,.12,16,40,PI),M.white);sh.position.set(0,2.8,.9);sh.castShadow=true;g.add(sh);
 return {labels:[{t:'SINGLE SIGN-ON',p:[-2.6,3.2,0],tone:'lav'},{t:'FULL AUDIT TRAIL',p:[2.6,1.2,0],tone:'ok'}]}},
dashboard:(T,g)=>{const A=B(T),{M}=T;
 const mon=A.monitor((x,w,h)=>{x.fillStyle='#1B1430';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='700 48px Urbanist';x.fillText('Orders this week',40,80);
  [60,110,90,160,140,200].forEach((v,i)=>{x.fillStyle=i%2?'#8E67EA':'#C9B3FF';T.rr(x,50+i*100,h-60-v,70,v,12);x.fill()});x.strokeStyle='#10B981';x.lineWidth=8;x.beginPath();x.moveTo(60,h-140);[[160,h-190],[260,h-170],[360,h-250],[460,h-230],[560,h-310]].forEach(p=>x.lineTo(p[0],p[1]));x.stroke()},3.9,2.6);
 mon.position.set(0,0,0);mon.rotation.y=-.12;g.add(mon);
 return {labels:[{t:'LIVE · NO SPREADSHEET',p:[0,4.4,0],tone:'ok'}]}},
kiosk:(T,g)=>{const A=B(T),{M,box,cyl,THREE}=T;
 const st=cyl(.9,1.1,.2,M.lav);st.position.y=.1;g.add(st);const ps=box(.5,2.6,.4,.15,M.lav);ps.position.set(0,1.5,0);g.add(ps);
 const tb=box(3.2,2.4,.24,.25,M.white);tb.position.set(0,3.5,.2);tb.rotation.x=-.12;g.add(tb);
 const sc=T.screen(2.9,2.1,T.tex(870,630,(x,w,h)=>{x.fillStyle='#1B1430';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='700 76px Urbanist';x.fillText('Check in',60,130);x.fillStyle='#B4A8D6';x.font='500 38px Inter';x.fillText('Scan your driver license',60,200);x.fillStyle='#10B981';T.rr(x,60,300,w-120,150,34);x.fill();x.fillStyle='#052e22';x.font='700 60px Urbanist';x.textAlign='center';x.fillText('Start',w/2,400);x.textAlign='left'}));
 sc.position.set(0,3.5,.33);sc.rotation.x=-.12;g.add(sc);
 const cd=box(2.2,1.4,.08,.14,M.white);cd.position.set(2.9,.6,1.4);cd.rotation.set(-PI/2+.1,0,.4);g.add(cd);
 return {labels:[{t:'NO LINE AT THE DESK',p:[0,5.2,.2],tone:'ok'}]}},
form:(T,g)=>{const A=B(T),{M}=T;
 const ph=A.phone((x,w,h)=>{x.fillStyle='#1B1430';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='700 54px Urbanist';x.fillText('Before your visit',44,120);
  ['Consent signed','ID uploaded','Insurance added','Copay paid'].forEach((t,i)=>{x.fillStyle='rgba(255,255,255,.1)';T.rr(x,44,170+i*150,424,120,26);x.fill();x.fillStyle='#10B981';x.beginPath();x.arc(104,230+i*150,30,0,7);x.fill();x.strokeStyle='#052e22';x.lineWidth=7;x.beginPath();x.moveTo(90,230+i*150);x.lineTo(101,242+i*150);x.lineTo(120,216+i*150);x.stroke();x.fillStyle='#fff';x.font='600 36px Inter';x.fillText(t,156,242+i*150)});
  x.fillStyle='#C9B3FF';T.rr(x,44,790,424,100,28);x.fill();x.fillStyle='#1B1430';x.font='700 40px Urbanist';x.textAlign='center';x.fillText('All set',256,853);x.textAlign='left'});
 ph.position.set(0,2.15,0);ph.rotation.y=.14;g.add(ph);
 return {labels:[{t:'DONE FROM THE COUCH',p:[0,4.8,0],tone:'ok'}]}},
monday:(T,g)=>{const A=B(T),{M,box,THREE}=T;
 for(let i=0;i<14;i++){const d=A.doc(2.2,2.9,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);A.lines(x,w,h,7,'#B4A8D6',.12)});d.rotation.x=-PI/2;d.rotation.z=Math.sin(i*2.7)*.35;d.position.set(Math.sin(i*1.9)*.25-1.8,.06+i*.11,Math.cos(i*1.1)*.2);g.add(d)}
 [[-.2,1.3,.9,'#F59E0B'],[.9,.9,1.1,'#C9B3FF'],[-1.0,1.7,1.4,'#F59E0B'],[1.3,1.4,.5,'#C9B3FF'],[.2,.6,1.5,'#F59E0B']].forEach(([x,y,z,c],i)=>{const n=box(.9,.9,.05,.02,new THREE.MeshPhysicalMaterial({color:c,roughness:.6}));n.position.set(2.3+x,.45+y*1.2,z-.6);n.rotation.z=(i-2)*.15;g.add(n)});
 const hs=new THREE.Mesh(new THREE.CapsuleGeometry(.3,2.2,16,32),M.violet);hs.castShadow=true;hs.rotation.z=PI/2-.4;hs.position.set(3.8,.5,2.2);g.add(hs);
 return {labels:[{t:'FRIDAY\'S FAXES',p:[-1.8,2.4,0],tone:'amber'},{t:'PHONE RINGING',p:[3.8,1.8,2.2],tone:'lav'}]}}
});

Object.assign(SCENES,{
checklist:(T,g)=>{const A=B(T),{M,box,cyl,THREE}=T;
 const bd=box(3.8,5.0,.2,.2,M.lav);bd.position.set(0,2.6,0);bd.rotation.set(-.12,.2,0);g.add(bd);
 const pp=A.doc(3.2,4.4,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#1B1430';x.font='700 54px Urbanist';x.fillText('Checklist',w*.1,h*.09);
  for(let i=0;i<6;i++){x.strokeStyle='#6B3FE4';x.lineWidth=6;x.strokeRect(w*.1,h*.17+i*h*.12,w*.07,w*.07);if(i<4){x.strokeStyle='#10B981';x.lineWidth=9;x.beginPath();x.moveTo(w*.115,h*.2+i*h*.12);x.lineTo(w*.14,h*.225+i*h*.12);x.lineTo(w*.185,h*.165+i*h*.12);x.stroke()}x.fillStyle='#B4A8D6';x.fillRect(w*.26,h*.19+i*h*.12,w*.55,h*.025)}});pp.position.set(0,2.55,.16);pp.rotation.set(-.12,.2,0);g.add(pp);
 const clip=box(1.2,.55,.3,.12,M.steel);clip.position.set(0,5.0,.25);clip.rotation.set(-.12,.2,0);g.add(clip);
 const pen=cyl(.09,.09,2.4,M.violet);pen.position.set(3.0,.4,1.3);pen.rotation.set(PI/2,0,.9);g.add(pen);
 return {labels:[{t:'15 QUESTIONS · 10 MINUTES',p:[0,5.9,0],tone:'lav'}]}},
trace:(T,g)=>{const A=B(T),{M,box,sph,cyl,THREE}=T;
 const bar=box(11,.28,.5,.14,M.ink);bar.position.set(0,.5,0);g.add(bar);
 [[-4.6,'Referral'],[-1.5,'Order'],[1.5,'Exam'],[4.6,'Paid']].forEach(([x],i)=>{const s=sph(.55,i==3?M.green:M.white);s.position.set(x,1.2,0);g.add(s)});
 [-3.05,0,3.05].forEach(x=>{const c=new THREE.Mesh(new THREE.ConeGeometry(.42,.9,32),M.amber);c.rotation.x=PI;c.position.set(x,1.55,0);c.castShadow=true;g.add(c);const b=sph(.3,M.amber);b.position.set(x,2.3,0);g.add(b)});
 const mg=new THREE.Mesh(new THREE.TorusGeometry(.9,.15,24,64),M.lav);mg.position.set(-1.5,3.5,1.0);mg.castShadow=true;g.add(mg);g.add(T.tube([-.9,2.9,1.0],[-.2,2.2,1.0],.18,M.lav));
 return {az:-12,el:16,labels:[{t:'REFERRAL',p:[-4.6,2.3,0],tone:'lav'},{t:'ORDER',p:[-1.5,1.9,0],tone:'lav'},{t:'EXAM',p:[1.5,1.9,0],tone:'lav'},{t:'PAID',p:[4.6,2.3,0],tone:'ok'},{t:'3 PLACES IT STALLED',p:[0,4.2,0],tone:'amber'}]}}
});
