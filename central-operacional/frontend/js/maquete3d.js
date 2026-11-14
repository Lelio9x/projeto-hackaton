/* CAPIM DOURADO — maquete geométrica demonstrativa 3D.
   Geometria ilustrativa em canvas com projeção espacial real e rotação livre.
   Lojas aproximadas a partir das plantas; não é BIM nem planta executiva. */
(function(){
'use strict';
const palette={bg:'#071323',gold:'#e6b54c',floor:'#d7d7cd',glass:'#77b5d3',front:'#c8e5df'};
const shops=[
// térreo: coordenadas normalizadas 0..100 x 0..70 (lotes aproximados)
{f:0,n:'RENNER',x:11,z:50,w:13,d:12,c:'#a82936',h:6.2},
{f:0,n:'POLO WEAR',x:24,z:37,w:9,d:5,c:'#283f50'},
{f:0,n:'C&A',x:43,z:29,w:13,d:10,c:'#2287ae',h:7},
{f:0,n:'RIACHUELO',x:41,z:45,w:15,d:11,c:'#c18b48',h:7},
{f:0,n:'CENTAURO',x:29,z:61,w:12,d:6,c:'#c34a44'},
{f:0,n:'CINEMARK',x:71,z:49,w:14,d:16,c:'#ad2639',h:8},
{f:0,n:'MOROFIT',x:73,z:13,w:14,d:5,c:'#485e67'},
{f:0,n:'WOW PARK',x:73,z:20,w:14,d:6,c:'#8163b5'},
{f:0,n:'BIG',x:73,z:27,w:14,d:5,c:'#9f4535'},
{f:0,n:'ZIG ZAG',x:73,z:33,w:14,d:4,c:'#9e7b40'},
{f:0,n:'PERNAMBUCANAS',x:73,z:38,w:14,d:5,c:'#7b82b9'},
{f:0,n:'STZ',x:73,z:44,w:14,d:4,c:'#485868'},
{f:0,n:'OUTBACK',x:48,z:59,w:9,d:6,c:'#864332'},
{f:0,n:'MADERO',x:60,z:61,w:6,d:5,c:'#5c4433'},
{f:0,n:'MARISA',x:68,z:63,w:8,d:4,c:'#95465c'},
// segunda faixa de pequenas lojas nas bordas dos corredores
{f:0,n:'STILO',x:30,z:50,w:6,d:5,c:'#927c69'},
{f:0,n:'CAMICADO',x:39,z:59,w:7,d:5,c:'#a3785c'},
{f:0,n:'LEITURA',x:59,z:37,w:8,d:5,c:'#456d8e'},
{f:0,n:'Brookfield',x:60,z:45,w:7,d:5,c:'#6b8190'},
// superior: localização e forma mais específicas da planta do piso 2
{f:1,n:'MUNDO IMERSIVO',x:19,z:10,w:18,d:15,c:'#5750a8',h:7},
{f:1,n:'McDONALDS',x:39,z:12,w:12,d:9,c:'#be9139',h:6.2},
{f:1,n:'SPOLETO',x:52,z:12,w:6,d:9,c:'#3b7586'},
{f:1,n:'PIZZA HUT',x:59,z:12,w:6,d:9,c:'#9f3947'},
{f:1,n:'EXPRESS',x:66,z:12,w:7,d:9,c:'#a88446'},
{f:1,n:'DIVINO FOGÃO',x:74,z:12,w:10,d:9,c:'#995d3c'},
{f:1,n:'KIN SUI',x:31,z:48,w:10,d:10,c:'#71879c'},
{f:1,n:'GIRAFFAS',x:42,z:51,w:8,d:9,c:'#ae7544'},
{f:1,n:'SUBWAY',x:60,z:51,w:9,d:9,c:'#4c966c'},
{f:1,n:'EXPRESS GRILL',x:70,z:51,w:9,d:9,c:'#a94345'},
{f:1,n:'EVENTOS',x:19,z:50,w:11,d:13,c:'#6a628e'},
];
// área de corredores livre; acrescenta lojas menores em faixas não ocupadas
const small=[];
let seed=19;function rand(){ seed=(seed*1664525+1013904223)>>>0;return seed/4294967296; }
for(let i=0;i<34;i++){
 const band=i%4;
 let x,z,w,d;
 if(band===0){x=27+(i%9)*4.7;z=38+rand()*3;w=3.9;d=4.5;}
 else if(band===1){x=24+(i%9)*4.5;z=54+rand()*2;w=3.6;d=3.6;}
 else if(band===2){x=34+(i%10)*3.2;z=23+rand()*2;w=2.8;d=3.7;}
 else{x=34+(i%10)*3.2;z=66+rand()*1.2;w=2.6;d=2.8;}
 if(shops.some(s=>s.f===0&&x<s.x+s.w+1&&x+w>s.x-1&&z<s.z+s.d+1&&z+d>s.z-1))continue;
 small.push({f:0,n:'LOJA '+(101+i),x,z,w,d,c:['#658c97','#9f8267','#759a88','#6c7f9a'][i%4],h:3.6+rand()*1.2});
}
for(let i=0;i<15;i++){
 let x=32+i*3.2,z=i%2?60:24;
 if(shops.some(s=>s.f===1&&x<s.x+s.w+1&&x+2.9>s.x-1&&z<s.z+s.d+1&&z+3.5>s.z-1))continue;
 small.push({f:1,n:'LOJA '+(201+i),x,z,w:2.9,d:3.5,c:['#677f8c','#868b74','#977d8a'][i%3],h:3.8});
}
const allShops=shops.concat(small);
function vec(x,y,z){return {x,y,z};}
function hex(rgb){let h=rgb.replace('#','');return [parseInt(h.substring(0,2),16),parseInt(h.substring(2,4),16),parseInt(h.substring(4,6),16)];}
function tint(c,m){let v=hex(c);return 'rgb('+v.map(x=>Math.max(0,Math.min(255,Math.floor(x*m)))).join(',')+')';}
function renderScene(canvas, options){
 let state={yaw:-0.50,pitch:0.86,zoom:1.0,offX:0,offY:0,focus:'all',xray:false,mode:'riscos',hover:null};
 const ctx=canvas.getContext('2d',{alpha:false});
 const img0=new Image(),img1=new Image();img0.src='img/terreo.jpg';img1.src='img/piso2.jpg';
 const png=[img0,img1];
 const el=canvas.parentElement;
 const selected=document.getElementById('lab3d-selected');
 const labels=[];
 let w=900,h=570,dpr=1,drag=null,dirty=true;
 const resize=()=>{const rect=el.getBoundingClientRect();w=Math.max(300,rect.width);h=Math.max(300,rect.height);dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';dirty=true;draw();};
 function xy(p){
  // world-centered coordinates, horizontal x and depth z, vertical y
  const x=(p.x-50),z=(p.z-36),y=p.y;
  const cy=Math.cos(state.yaw), sy=Math.sin(state.yaw), cp=Math.cos(state.pitch), sp=Math.sin(state.pitch);
  const rx=x*cy-z*sy,rz=x*sy+z*cy;
  const ry=y*cp-rz*sp;
  const depth=y*sp+rz*cp;
  const scale=Math.min(w/132,h/101)*state.zoom;
  return {x:w/2+rx*scale+state.offX,y:h*.66-ry*scale+state.offY,depth:depth};
 }
 const floorY=f=>f===0?1:21;
 function poly(points, fill, stroke, width=1){const q=points.map(xy);ctx.beginPath();ctx.moveTo(q[0].x,q[0].y);for(let i=1;i<q.length;i++)ctx.lineTo(q[i].x,q[i].y);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
 function line(points,color,width=1){const q=points.map(xy);ctx.beginPath();ctx.moveTo(q[0].x,q[0].y);for(let i=1;i<q.length;i++)ctx.lineTo(q[i].x,q[i].y);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
 function ptxt(text,pt,color,sz=11,bold=false){const v=xy(pt); ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=(bold?'700 ':'600 ')+sz+'px Inter,system-ui,sans-serif';ctx.shadowColor='#04121f';ctx.shadowBlur=5;ctx.lineWidth=3;ctx.strokeStyle='#091321cc'; ctx.strokeText(text,v.x,v.y);ctx.shadowBlur=0;ctx.fillStyle=color;ctx.fillText(text,v.x,v.y);ctx.restore();}
 function box3D(s,fy){const y=fy;const hh=s.h||4.5;const x=s.x,z=s.z,X=x+s.w,Z=z+s.d;
  const v=[vec(x,y,z),vec(X,y,z),vec(X,y,Z),vec(x,y,Z)],u=v.map(p=>vec(p.x,y+hh,p.z));
  poly([v[0],v[1],u[1],u[0]],tint(s.c,.60),'#6e849688',.6);poly([v[1],v[2],u[2],u[1]],tint(s.c,.55),'#6e849688',.6);
  poly([v[2],v[3],u[3],u[2]],tint(s.c,.72),'#7c8b8b',.7);poly([v[3],v[0],u[0],u[3]],tint(s.c,.87),'#9eb0ac88',.7);
  // building top rim, glossy roof, shop-front fenestration
  poly(u,state.xray?'#65bdcd28':tint(s.c,1.16),state.xray?'#37a8ecdd':'#f1dcaf9c',1.4);
  const q1=[vec(x+.5,y+.6,Z+.03),vec(X-.5,y+.6,Z+.03),vec(X-.5,y+hh-1.2,Z+.03),vec(x+.5,y+hh-1.2,Z+.03)];
  poly(q1,'#8ed5ed66','#d6efff66',.5);
  // mullions
  for(let i=1;i<Math.min(7,Math.floor(s.w/2.5));i++){const tx=x+i*s.w/Math.min(7,Math.floor(s.w/2.5));line([vec(tx,y+.6,Z+.06),vec(tx,y+hh-1.2,Z+.06)],'#b1edf39a',.65);}
  if(s.n.indexOf('LOJA ')!==0){let center=vec(x+s.w/2,y+hh+.6,z+s.d/2);const pp=xy(center); if(pp.x>0&&pp.x<w&&pp.y>5&&pp.y<h){const fontSize=Math.max(8,Math.min(12,w/80)); ptxt(s.n,center,'#fff7dc',fontSize,true);}}
  const center=xy(vec(x+s.w/2,y+hh/2,z+s.d/2));labels.push({x:center.x,y:center.y,shop:s,level:s.f});
 }
 function slab(f,y){let z0=6,z1=69,x0=4,x1=96;if(f===1){x0=15;x1=91;z0=8;z1=65;}const v=[vec(x0,y,z0),vec(x1,y,z0),vec(x1,y,z1),vec(x0,y,z1)];
  poly([vec(x0,y-1.5,z1),vec(x1,y-1.5,z1),v[2],v[3]],'#987431','#e7c16d',1.2);
  poly([vec(x1,y-1.5,z0),vec(x1,y-1.5,z1),v[2],v[1]],'#5a452c','#cda75c',1);
  poly(v,'#d5d6ce','#e6b85e',2);
  const img=png[f];if(img.complete&&img.naturalWidth){const q0=xy(v[0]),q1=xy(v[1]),q3=xy(v[3]);ctx.save();ctx.beginPath();ctx.moveTo(q0.x,q0.y);ctx.lineTo(q1.x,q1.y);const q2=xy(v[2]);ctx.lineTo(q2.x,q2.y);ctx.lineTo(q3.x,q3.y);ctx.closePath();ctx.clip();ctx.globalAlpha=.30;ctx.setTransform((q1.x-q0.x)/img.width*dpr,(q1.y-q0.y)/img.width*dpr,(q3.x-q0.x)/img.height*dpr,(q3.y-q0.y)/img.height*dpr,q0.x*dpr,q0.y*dpr);ctx.drawImage(img,0,0);ctx.restore();ctx.setTransform(dpr,0,0,dpr,0,0);}
 }
 function decor(f,y){if(f===0){
   // main central plaza and little landscaped round island
   ellipse3D(51,y+.08,51,6.5,3.3,'#cda4507a');
   for(let i=0;i<12;i++){let a=i*Math.PI/6; let x=50+Math.cos(a)*12,z=50+Math.sin(a)*9; line([vec(x,y+.2,z),vec(x,y+1.5,z)],'#dbc58a',1);}
  }else{
   ellipse3D(52,y+.15,38,12,6,'#2e5574a8');ellipse3D(52,y+.2,38,7,4,'#9bbbc0b8');
   for(let i=0;i<5;i++) {let tx=81+i*1.1;line([vec(tx,y+.3,33),vec(tx,y+3.0,42)],'#ffd78e',1.6);}
  }
 }
 function ellipse3D(cx,y,cz,rx,rz,fill){let pts=[];for(let i=0;i<=40;i++){let a=i*Math.PI*2/40;pts.push(vec(cx+Math.cos(a)*rx,y,cz+Math.sin(a)*rz));}poly(pts,fill,'#efd799a3',1.0);}
 function marker(a,y){const col=(typeof options.areaStatus==='function'?options.areaStatus(a.id).c:'#e9b949');let pt=xy(vec(a.x,a.z?y+5:y+6, a.y*.70));const r=6;ctx.save();ctx.shadowBlur=13;ctx.shadowColor=col;ctx.fillStyle=col;ctx.beginPath();ctx.arc(pt.x,pt.y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#fff';ctx.lineWidth=1.7;ctx.stroke();ctx.restore();labels.push({x:pt.x,y:pt.y,area:a,level:a.floorId});}
 function draw(){if(!dirty)return;dirty=false;ctx.setTransform(dpr,0,0,dpr,0,0);
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#07101e');g.addColorStop(.64,'#102741');g.addColorStop(1,'#07101a');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  // subtle floor/grid background
  ctx.strokeStyle='#42759b17';ctx.lineWidth=1;for(let gx=0;gx<w;gx+=32){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,h);ctx.stroke();}for(let gy=0;gy<h;gy+=32){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(w,gy);ctx.stroke();}
  labels.length=0;
  let visible=state.focus==='all'?[0,1]:[+state.focus];
  // floor order back-to-front derived projected depth
  let floors=visible.map(f=>({f,y:floorY(f),depth:xy(vec(50,floorY(f),36)).depth})).sort((a,b)=>a.depth-b.depth);
  for(const floor of floors){let f=floor.f,fy=floor.y;
    slab(f,fy);
    decor(f,fy);
    const subset=allShops.filter(s=>s.f===f);
    subset.sort((a,b)=>xy(vec(a.x+a.w/2,fy,a.z+a.d/2)).depth-xy(vec(b.x+b.w/2,fy,b.z+b.d/2)).depth);
    // reverse painting front: painter based depth projection
    subset.forEach(s=>box3D(s,fy));
    if(options.getAreas&&state.mode==='riscos'){let list=options.getAreas().filter(a=>(f===0?a.floorId===options.floorIds[0]:a.floorId===options.floorIds[1])); for(const a of list){marker(a,fy);}}
  }
  if(state.focus==='all'){
    // vertical guide lines between floor edges
    const corners=[[6,9],[94,9],[6,68],[94,68]];corners.forEach(([x,z])=>{let q0=xy(vec(x,4,z)),q1=xy(vec(x,20,z));ctx.save();ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(q0.x,q0.y);ctx.lineTo(q1.x,q1.y);ctx.strokeStyle='#f2c96955';ctx.lineWidth=1.3;ctx.stroke();ctx.restore();});
  }
  const title=state.focus==='all'?'DOIS PAVIMENTOS':state.focus==='0'?'TÉRREO · PARTE DE BAIXO':'2º PAVIMENTO · PARTE DE CIMA';
  ctx.fillStyle='#f4c75e';ctx.font='700 12px Inter,system-ui,sans-serif';ctx.fillText(title,18,h-25);
 }
 function onDown(e){if(e.target.closest&&e.target.closest('button'))return;drag={x:e.clientX,y:e.clientY,yaw:state.yaw,pitch:state.pitch,moved:false};if(canvas.setPointerCapture)canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';}
 function onMove(e){if(!drag)return;let dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>5)drag.moved=true;state.yaw=drag.yaw+dx*.008;state.pitch=Math.max(.25,Math.min(1.48,drag.pitch-dy*.006));dirty=true;draw();}
 function onUp(e){if(!drag)return;let wasMoved=drag.moved;drag=null;canvas.style.cursor='grab';if(!wasMoved){const r=canvas.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;let q=null,dist=16;for(const a of labels){const d=Math.hypot(a.x-px,a.y-py);if(d<dist){q=a;dist=d;}}if(q&&selected){const title=q.shop?q.shop.n:q.area.name;const level=q.shop?q.shop.f:q.level===options.floorIds[0]?0:1;selected.innerHTML='<strong>'+esc(title)+'</strong> · '+(level===0?'Térreo':'Piso superior')+'<small> Localização ilustrativa na maquete</small>';selected.hidden=false;if(q.area&&options.onArea)options.onArea(q.area.id);}}}
 function esc(s){return String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));}
 canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointermove',onMove);canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointercancel',()=>{drag=null;});
 canvas.addEventListener('wheel',e=>{e.preventDefault();state.zoom=Math.max(.65,Math.min(2.3,state.zoom+(e.deltaY<0?.08:-.08)));dirty=true;draw();},{passive:false});
 for(let i=0;i<png.length;i++)png[i].onload=()=>{dirty=true;draw();};
 window.addEventListener('resize',()=>{if(canvas.isConnected)resize();},{passive:true});
 resize();
 return {setFocus(f){state.focus=f==='all'?'all':String(f);dirty=true;draw();},setXray(v){state.xray=!!v;dirty=true;draw();},rotate(delta){state.yaw+=delta;dirty=true;draw();},reset(){state.yaw=-.50;state.pitch=.86;state.zoom=1;state.offX=0;state.offY=0;dirty=true;draw();},zoom(delta){state.zoom=Math.max(.65,Math.min(2.3,state.zoom+delta));dirty=true;draw();},render(){dirty=true;draw();}};
}
window.CapimMaquete3D={init:renderScene};
})();
