/* CAPIM DOURADO — visualização artística interativa.
 * A arte é uma imagem de conceito; este visual permite zoom, pan e seleção
 * de regiões. Não representa geometria BIM. Para rotação real, use Modelo 3D. */
(function(){
'use strict';
const SOURCE='img/maquete_colorida.png';
const markers=[
 {n:'Mundo Imersivo',x:.307,y:.165,f:1,aliases:['Mundo']},
 {n:'McDonald’s',x:.397,y:.127,f:1,aliases:['McDonalds','McDonald']},
 {n:'Praça de Alimentação',x:.525,y:.247,f:1,aliases:['Praça de Alimentação','Alimentação']},
 {n:'Escadas rolantes',x:.706,y:.205,f:1,aliases:['Escada','Escadas']},
 {n:'Piso superior',x:.617,y:.348,f:1,aliases:['Piso Superior']},
 {n:'Renner',x:.220,y:.721,f:0,aliases:['Renner']},
 {n:'Riachuelo',x:.492,y:.637,f:0,aliases:['Riachuelo']},
 {n:'Cinemark',x:.736,y:.744,f:0,aliases:['Cinemark','Cinema']},
 {n:'C&A',x:.491,y:.538,f:0,aliases:['C&A']},
 {n:'Outback',x:.533,y:.775,f:0,aliases:['Outback']},
 {n:'Centauro',x:.362,y:.796,f:0,aliases:['Centauro']},
 {n:'Praça central',x:.491,y:.707,f:0,aliases:['Praça','Mall','Corredor']},
 {n:'Pernambucanas',x:.742,y:.577,f:0,aliases:['Pernambucanas']}
];
const image=new Image();image.src=SOURCE;
const viewers=new Set();
image.onload=()=>viewers.forEach(v=>v.redraw());
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function init(canvas,options){
 const ctx=canvas.getContext('2d',{alpha:false});
 const parent=canvas.parentElement;
 let focus='all',zoom=1,ox=0,oy=0,w=800,h=450,dpr=1,down=null,scale=1,source={x:0,y:0,w:1672,h:941},dest={x:0,y:0,w:800,h:450};
 const preview=!!options.preview;
 function crop(){
   const iw=image.naturalWidth||1672,ih=image.naturalHeight||941;
   if(focus==='1')return {x:iw*.105,y:ih*.015,w:iw*.80,h:ih*.435};
   if(focus==='0')return {x:iw*.075,y:ih*.395,w:iw*.86,h:ih*.555};
   return {x:0,y:0,w:iw,h:ih};
 }
 function bounds(){const r=parent.getBoundingClientRect();w=Math.max(150,r.width);h=Math.max(135,r.height);dpr=Math.min(2,devicePixelRatio||1);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}canvas.style.width=w+'px';canvas.style.height=h+'px';}
 function project(mx,my){return {x:dest.x+(mx*image.width-source.x)*scale,y:dest.y+(my*image.height-source.y)*scale};}
 function mapPoint(m){return {x:dest.x+(m.x*image.width-source.x)*scale,y:dest.y+(m.y*image.height-source.y)*scale};}
 function draw(){
  bounds();ctx.setTransform(dpr,0,0,dpr,0,0);
  const grad=ctx.createLinearGradient(0,0,w,h);grad.addColorStop(0,'#08182d');grad.addColorStop(.58,'#10304b');grad.addColorStop(1,'#06111e');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#739dce0e';ctx.lineWidth=1;for(let x=0;x<w;x+=25){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=25){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  if(!image.complete||!image.naturalWidth){ctx.fillStyle='#e8c06a';ctx.font='600 13px Inter,sans-serif';ctx.textAlign='center';ctx.fillText('Carregando maquete colorida…',w/2,h/2);return;}
  source=crop();scale=Math.min(w/source.w,h/source.h)*zoom;
  const dw=source.w*scale,dh=source.h*scale;
  // prevent the image from being dragged off-screen entirely
  ox=clamp(ox,-Math.max(50,dw*.38),Math.max(50,dw*.38));
  oy=clamp(oy,-Math.max(50,dh*.38),Math.max(50,dh*.38));
  dest={x:(w-dw)/2+ox,y:(h-dh)/2+oy,w:dw,h:dh};
  ctx.save();ctx.shadowColor='#d9ac4d70';ctx.shadowBlur=26;
  ctx.drawImage(image,source.x,source.y,source.w,source.h,dest.x,dest.y,dw,dh);
  ctx.restore();
  if(!preview){
   markers.filter(m=>focus==='all'||String(m.f)===focus).forEach((m,i)=>{
    const p=mapPoint(m);if(p.x<12||p.x>w-12||p.y<20||p.y>h-13)return;
    ctx.beginPath();ctx.arc(p.x,p.y,8,0,Math.PI*2);ctx.fillStyle='#061524cf';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#f3c55b';ctx.stroke();
    ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle='#f5ce6c';ctx.fill();
   });
   ctx.fillStyle='#e7c268';ctx.font='700 11px Inter,system-ui,sans-serif';ctx.fillText(focus==='all'?'DOIS PAVIMENTOS · ARTE CONCEITUAL':focus==='0'?'TÉRREO · FOCO NA PARTE DE BAIXO':'PISO SUPERIOR · FOCO NA PARTE DE CIMA',15,h-16);
  }
 }
 function hit(x,y){let found=null,best=19;for(const m of markers){if(focus!=='all'&&String(m.f)!==focus)continue;const p=mapPoint(m);let dd=Math.hypot(x-p.x,y-p.y);if(dd<best){best=dd;found=m;}}return found;}
 function select(m){
  const status=document.getElementById('lab3d-selected');
  const areas=options.getAreas?options.getAreas():[];
  const area=areas.find(a=>m.aliases.some(v=>a.name.toLowerCase().includes(v.toLowerCase())) && (!options.floorIds||a.floorId===options.floorIds[m.f]))||null;
  if(status){status.hidden=false;status.innerHTML='<b>'+m.n+'</b><small>Localização ilustrativa sobre a arte conceitual'+(area?' · Área encontrada nos cadastros':' · Região demonstrativa')+'</small>'+(area?'<small>Selecione a área no Mapa Operacional para consultar ocorrências.</small>':'');}
  if(area&&options.onArea)options.onArea(area.id);
 }
 function downEvt(e){down={x:e.clientX,y:e.clientY,ox,oy,moved:false};if(canvas.setPointerCapture)try{canvas.setPointerCapture(e.pointerId);}catch(ex){}}
 function moveEvt(e){if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)+Math.abs(dy)>5)down.moved=true;ox=down.ox+dx;oy=down.oy+dy;draw();}
 function upEvt(e){if(!down)return;let wasMoved=down.moved;down=null;if(!wasMoved){let rect=canvas.getBoundingClientRect(),m=hit(e.clientX-rect.left,e.clientY-rect.top);if(m&&!preview)select(m);else if(preview&&options.onArea)options.onArea(null);}}
 canvas.addEventListener('pointerdown',downEvt);canvas.addEventListener('pointermove',moveEvt);canvas.addEventListener('pointerup',upEvt);canvas.addEventListener('pointercancel',()=>{down=null;});
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=clamp(zoom+(e.deltaY<0?.12:-.12),.80,3.0);draw();},{passive:false});
 // allow keyboard zoom as well
 canvas.tabIndex=0;canvas.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='='){e.preventDefault();zoom=clamp(zoom+.14,.8,3);draw();}else if(e.key==='-'){e.preventDefault();zoom=clamp(zoom-.14,.8,3);draw();}});
 const obs=typeof ResizeObserver!=='undefined'?new ResizeObserver(draw):null;if(obs)obs.observe(parent);
 const api={setFocus(f){focus=f==='all'?'all':String(f);zoom=1;ox=oy=0;draw();},zoom(d){zoom=clamp(zoom+d,.8,3);draw();},reset(){zoom=1;ox=oy=0;draw();},rotate(){/* imagem conceitual fixa: rotação não disponível */},setXray(){},redraw:draw};
 viewers.add(api);draw();return api;
}
window.CapimPremiumViewer={init};
})();
