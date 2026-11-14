/* Capim Dourado | Central Operacional
   Gestão de infraestrutura e serviços do shopping.
   - Dentro do Claude (artefato): os dados são salvos na própria página.
   - Fora (VS Code / navegador): os dados ficam no localStorage. */
(function(){
"use strict";

/* ================= CONFIGURAÇÃO ================= */
var DEFAULT_PLANS = { f1:'img/terreo.jpg', f2:'img/piso2.jpg' };
var CATS = ['Elétrica','Hidráulica','Climatização','Limpeza','Segurança','Elevadores/Escadas','Estrutura','TI/Rede','Outros'];
var PRIOS = ['Baixa','Média','Alta','Crítica'];
var STATUS = ['Aberta','Em andamento','Resolvida'];
var SLA_H = { 'Crítica':1.5, 'Alta':4, 'Média':24, 'Baixa':48 };
var PRIO_C = { 'Baixa':'#3b82f6', 'Média':'#facc15', 'Alta':'#f97316', 'Crítica':'#ef4444' };
var STATUS_C = { 'Aberta':'#ef4444', 'Em andamento':'#f59e0b', 'Resolvida':'#22c55e' };
var CAT_C = { 'Elétrica':'#22c55e','Hidráulica':'#06b6d4','Climatização':'#3b82f6','Limpeza':'#f59e0b','Segurança':'#a855f7','Elevadores/Escadas':'#ef4444','Estrutura':'#f97316','TI/Rede':'#14b8a6','Outros':'#94a3b8' };
var CAT_I = { 'Elétrica':'zap','Hidráulica':'drop','Climatização':'thermo','Limpeza':'broom','Segurança':'shield','Elevadores/Escadas':'escal','Estrutura':'bldg','TI/Rede':'wifi','Outros':'alert' };
var ITEM_CAT = { 'Limpeza':'Limpeza','Iluminação':'Elétrica','Climatização':'Climatização','Sinalização':'Estrutura','Segurança':'Segurança' };
var DAY = 86400000, HOUR = 3600000, LS_KEY = 'capimDourado.ops.v2';

/* ================= ÍCONES ================= */
var IC = {
  logout:'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3',
  home:'M3 10.5 12 3l9 7.5V21H3z M9 21v-6h6v6',
  map:'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z M9 4v14 M15 6v14',
  siren:'M7 18v-6a5 5 0 0 1 10 0v6 M5 21h14 M12 3v2 M4.2 6.2l1.4 1.4 M19.8 6.2l-1.4 1.4 M2 12h2 M20 12h2 M5 18h14',
  alert:'M12 3 2 21h20L12 3z M12 10v5 M12 18h.01',
  calc:'M4 5h16v16H4z M4 9h16 M8 3v4 M16 3v4 M9 15l2 2 4-4',
  wrench:'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  list:'M10 6h11 M10 12h11 M10 18h11 M3 6l1.5 1.5L7 5 M3 12l1.5 1.5L7 11 M3 18l1.5 1.5L7 17',
  broom:'M20 3 12 11 M9.5 10.5l4 4 M9.5 10.5C6 11 3.5 14 3 21c7-.5 10-3 10.5-6.5 M6.5 17.5 9 15',
  shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
  thermo:'M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z M12 9v7',
  zap:'M13 2 3 14h9l-1 8 10-12h-9z',
  layers:'M12 3 2 8l10 5 10-5-10-5z M2 13l10 5 10-5 M2 18l10 5 10-5',
  car:'M5 17h14v-5l-2-5H7l-2 5z M3 12h18 M7 17v2 M17 17v2 M7.5 14h.01 M16.5 14h.01',
  users:'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 20v-2a4 4 0 0 0-3-3.9 M16 2.1a4 4 0 0 1 0 7.8',
  chart:'M4 20V10 M10 20V4 M16 20v-7 M22 20H2',
  spark:'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
  gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M21 21l-4.3-4.3',
  bell:'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.9 1.9 0 0 0 3.4 0',
  user:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M6 19a7 7 0 0 1 12 0',
  cal:'M4 5h16v16H4z M4 9h16 M8 3v4 M16 3v4 M8 13h2 M14 13h2 M8 17h2',
  monitor:'M3 4h18v12H3z M8 20h8 M12 16v4',
  ext:'M14 3h7v7 M10 14 21 3 M19 14v6H4V5h6',
  refresh:'M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5',
  clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
  timer:'M10 2h4 M12 14l3-3 M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  check:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M8 12l3 3 5-6',
  tools:'M3 21l7-7 M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94 M5 3l4 4-2 2-4-4z M14 14l6 6',
  chevr:'M9 6l6 6-6 6', chevl:'M15 6l-6 6 6 6', chevd:'M6 9l6 6 6-6',
  menu:'M4 6h16 M4 12h16 M4 18h16', x:'M6 6l12 12 M18 6 6 18', plus:'M12 5v14 M5 12h14',
  drop:'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  wifi:'M5 12.5a10 10 0 0 1 14 0 M8.5 16a5 5 0 0 1 7 0 M2 9a15 15 0 0 1 20 0 M12 20h.01',
  escal:'M2 20h5l9-12h6 M8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M6.5 14 9 11',
  bldg:'M4 21V4h10v17 M14 9h6v12 M8 8h2 M8 12h2 M8 16h2 M2 21h20',
  store:'M4 9l1-5h14l1 5 M4 9h16v11H4z M9 20v-6h6v6',
  food:'M7 3v8 M5 3v4a2 2 0 0 0 4 0V3 M7 11v10 M17 3c-2 0-3 2-3 5s1 4 3 4v9',
  door:'M13 4h6v16h-6 M3 12h12 M11 8l4 4-4 4',
  film:'M3 4h18v16H3z M7 4v16 M17 4v16 M3 9h4 M17 9h4 M3 15h4 M17 15h4',
  wc:'M7 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M17 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 22v-6H3l2-7h4l2 7H9v6 M15 22V9h4v13 M12 2v20',
  copy:'M9 9h11v11H9z M5 15H4V4h11v1',
  info:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 16v-5 M12 8h.01',
  upload:'M12 15V3 M7 8l5-5 5 5 M4 15v5h16v-5',
  pin:'M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  play:'M6 4l14 8-14 8z', trash:'M4 7h16 M10 11v6 M14 11v6 M6 7l1 13h10l1-13 M9 7V4h6v3'
};
function ic(n,cls){ return '<svg class="i'+(cls?' '+cls:'')+'" viewBox="0 0 24 24"><path d="'+(IC[n]||IC.alert)+'"/></svg>'; }
function areaIcon(name){ var n=(name||'').toLowerCase();
  if (/estaciona/.test(n)) return 'car'; if (/wc|banheir/.test(n)) return 'wc'; if (/escada|elevador/.test(n)) return 'escal';
  if (/aliment|food/.test(n)) return 'food'; if (/entrada|acesso/.test(n)) return 'door'; if (/cinema|cinemark|imers|evento/.test(n)) return 'film';
  if (/máquina|maquina|doca|servi/.test(n)) return 'tools'; if (/adm|sala/.test(n)) return 'bldg'; return 'store'; }

/* ================= UTIL ================= */
function uid(){ return Math.random().toString(36).slice(2,9); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function pad(n){ return String(n).padStart(2,'0'); }
function todayKey(d){ d=d||new Date(); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
function ago(ts){ var m=Math.round((Date.now()-ts)/60000); if(m<1) return 'agora'; if(m<60) return 'há '+m+' min'; var h=Math.round(m/60); if(h<24) return 'há '+h+' h'; var d=Math.round(h/24); return 'há '+d+(d>1?' dias':' dia'); }
function fdate(ts){ var d=new Date(ts); return pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()+' às '+pad(d.getHours())+':'+pad(d.getMinutes()); }
function fshort(ts){ var d=new Date(ts); return pad(d.getDate())+'/'+pad(d.getMonth()+1)+' '+pad(d.getHours())+':'+pad(d.getMinutes()); }
function fday(ts){ var d=new Date(ts); return pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear(); }
function hms(ms){ var s=Math.floor(Math.abs(ms)/1000); return pad(Math.floor(s/3600))+':'+pad(Math.floor(s%3600/60))+':'+pad(s%60); }
function fmtH(h){ return h>=1 ? (h%1? h.toFixed(1).replace('.',','):h)+'h' : Math.round(h*60)+'min'; }
function num(n){ return n.toLocaleString('pt-BR'); }

/* ================= DADOS INICIAIS ================= */
function seed(){
  var n = Date.now();
  var floors = [{id:'f1',name:'Térreo',plan:DEFAULT_PLANS.f1},{id:'f2',name:'Praça de Alimentação',plan:DEFAULT_PLANS.f2}];
  var areas = [
    {id:'t1',name:'Estacionamento',floorId:'f1',x:51.3,y:29.6},
    {id:'t2',name:'Estacionamento frontal',floorId:'f1',x:30,y:95},
    {id:'t3',name:'Acesso Principal',floorId:'f1',x:47.4,y:93},
    {id:'t4',name:'Praça de eventos',floorId:'f1',x:47.4,y:76.1},
    {id:'t5',name:'Circulação central',floorId:'f1',x:47.4,y:63.4},
    {id:'t6',name:'C&A',floorId:'f1',x:46.2,y:46.5},
    {id:'t7',name:'Renner',floorId:'f1',x:15.4,y:81.7},
    {id:'t8',name:'Corredor oeste',floorId:'f1',x:32.1,y:76.1},
    {id:'t9',name:'Corredor leste',floorId:'f1',x:62.8,y:81.7},
    {id:'t10',name:'Cinemark',floorId:'f1',x:76.9,y:77.5},
    {id:'t11',name:'Lojas âncora',floorId:'f1',x:78.2,y:53.5},
    {id:'t12',name:'Morofit / Wow Park',floorId:'f1',x:76.9,y:23.9},
    {id:'t13',name:'Doca e serviço',floorId:'f1',x:88.5,y:60.6},
    {id:'s1',name:'Praça de alimentação',floorId:'f2',x:55,y:46},
    {id:'s2',name:'Lojas de alimentação norte',floorId:'f2',x:52,y:25},
    {id:'s3',name:'Lojas de alimentação sul',floorId:'f2',x:52,y:71},
    {id:'s4',name:'Mundo Imersivo',floorId:'f2',x:30,y:28},
    {id:'s5',name:'Evento Imerso Mar',floorId:'f2',x:32,y:73},
    {id:'s6',name:'Escadas rolantes',floorId:'f2',x:77,y:49},
    {id:'s7',name:'Banheiros masculinos',floorId:'f2',x:67,y:19},
    {id:'s8',name:'Banheiros femininos',floorId:'f2',x:69,y:75},
    {id:'s9',name:'Casa de máquinas A.C',floorId:'f2',x:60,y:11},
    {id:'s10',name:'Administração',floorId:'f2',x:46,y:11}
  ];
  function o(title,ar,cat,prio,status,agoMs,resolvedAfter,resp,desc){
    var c=n-agoMs, a=areas.filter(function(x){return x.id===ar;})[0];
    return {id:uid(),title:title,areaId:ar,cat:cat,prio:prio,status:status,resp:resp,desc:desc||'',created:c,updated:c,
      resolved:status==='Resolvida'?c+resolvedAfter:null,x:+(a.x+(Math.random()*4-2)).toFixed(2),y:+(a.y+(Math.random()*4-2)).toFixed(2)};
  }
  return {
    v:3, floors:floors, areas:areas,
    team:['Manutenção Predial','Limpeza','Segurança','Climatização','TI','Operações'],
    items:['Limpeza','Iluminação','Climatização','Sinalização','Segurança'],
    occ:[
      o('Escada rolante parada','t5','Elevadores/Escadas','Crítica','Em andamento',48*60000,0,'Manutenção Predial','Escada de subida isolada com cones; técnico a caminho.'),
      o('Escada rolante com ruído','s6','Elevadores/Escadas','Alta','Aberta',70*60000,0,'Manutenção Predial',''),
      o('Vazamento na pia','s8','Hidráulica','Alta','Aberta',3*HOUR,0,'Manutenção Predial','2ª pia da bancada.'),
      o('Temperatura alta nas mesas','s1','Climatização','Média','Aberta',5*HOUR,0,'Climatização',''),
      o('Lâmpadas queimadas','t1','Elétrica','Média','Aberta',20*HOUR,0,'Manutenção Predial',''),
      o('Piso molhado sem sinalização','t8','Limpeza','Baixa','Em andamento',40*60000,0,'Limpeza',''),
      o('Lixeiras cheias','s1','Limpeza','Baixa','Resolvida',9*HOUR,50*60000,'Limpeza',''),
      o('Porta de emergência travada','t10','Segurança','Crítica','Resolvida',18*HOUR,80*60000,'Segurança',''),
      o('Wi-Fi instável','t5','TI/Rede','Média','Resolvida',22*HOUR,6*HOUR,'TI',''),
      o('Disjuntor desarmado','t11','Elétrica','Alta','Resolvida',2*DAY,2*HOUR,'Manutenção Predial',''),
      o('Câmera sem imagem','t2','Segurança','Média','Resolvida',3*DAY,5*HOUR,'Segurança','')
    ],
    equip:[
      {id:uid(),name:'Escadas rolantes – praça de alimentação',areaId:'s6',freq:15,last:n-16*DAY,resp:'Manutenção Predial',log:[]},
      {id:uid(),name:'Central de ar-condicionado',areaId:'s9',freq:30,last:n-28*DAY,resp:'Climatização',log:[]},
      {id:uid(),name:'Exaustores da praça',areaId:'s2',freq:15,last:n-14*DAY,resp:'Manutenção Predial',log:[]},
      {id:uid(),name:'Gerador de emergência',areaId:'t13',freq:7,last:n-3*DAY,resp:'Manutenção Predial',log:[]},
      {id:uid(),name:'Bombas de recalque',areaId:'t13',freq:30,last:n-5*DAY,resp:'Manutenção Predial',log:[]},
      {id:uid(),name:'Hidrantes e extintores',areaId:'t4',freq:90,last:n-60*DAY,resp:'Segurança',log:[]},
      {id:uid(),name:'Iluminação do estacionamento',areaId:'t1',freq:30,last:n-10*DAY,resp:'Manutenção Predial',log:[]},
      {id:uid(),name:'Elevadores sociais',areaId:'t6',freq:30,last:n-29*DAY,resp:'Manutenção Predial',log:[]}
    ],
    rounds:{}
  };
}

/* ================= ESTADO / PERSISTÊNCIA ================= */
/* ================= ESTADO / PERSISTÊNCIA (INTEGRADO AO FASTAPI + MYSQL) ================= */
var APP_EL = document.getElementById('app'), STATE_EL = document.getElementById('state');
var APP_SRC = APP_EL ? APP_EL.textContent : null, HEAD_HTML = document.head.outerHTML;
var S = null;
if (STATE_EL) { try { S = JSON.parse(STATE_EL.textContent); } catch(e) {} }
if (!S || !S.areas) {
  var local = null;
  try { local = JSON.parse(localStorage.getItem(LS_KEY)); } catch(e) {}
  if (local && local.areas) S = local;
  else {
    var P0 = S && S.plans;
    S = seed();
    if (P0) S.floors.forEach(function(f){ if (P0[f.id]) f.plan = P0[f.id]; });
  }
}

var artifactApi = null, capResolved = true, readOnly = false, saveState = 'local', saveTimer = null, dirty = false;

function cleanState(){
  var c = JSON.parse(JSON.stringify(S));
  c.occ = c.occ.filter(function(o){ return !o.demo; });
  return c;
}
function saveLocal(){
  try { localStorage.setItem(LS_KEY, JSON.stringify(cleanState())); return true; }
  catch(e) { return false; }
}
function prune(){
  var k = Object.keys(S.rounds).sort();
  while(k.length > 31) delete S.rounds[k.shift()];
  S.equip.forEach(function(e){ if(e.log && e.log.length > 20) e.log = e.log.slice(-20); });
}
function commit(delay){
  if (readOnly) { toast('Modo somente leitura.'); return; }
  dirty = true; saveState = 'pending'; updSave();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, delay == null ? 600 : delay);
}
function flush(){
  if (!capResolved) return;
  if (ui.modal) { saveTimer = setTimeout(flush, 1000); return; }
  prune();
  saveLocal();

  if (window.CapimAPI) {
    saveState = 'saving'; updSave();
    window.CapimAPI.saveState(cleanState()).then(function(res){
      dirty = false;
      if (res && res.ok) {
        saveState = res.db_mode === 'mysql' ? 'saved' : 'local';
      } else {
        saveState = 'local';
      }
      updSave();
    }).catch(function(){
      dirty = false; saveState = 'local'; updSave();
    });
  } else {
    dirty = false; saveState = 'local'; updSave();
  }
}
function updSave(){
  var el = document.getElementById('save'); if(!el) return;
  var t = {
    saved: 'Salvo no MySQL',
    pending: 'Alterações…',
    saving: 'Sincronizando…',
    error: 'Erro ao salvar',
    ro: 'Somente leitura',
    local: 'Salvo no navegador'
  }[saveState];
  el.className = 'save ' + saveState;
  el.innerHTML = '<i></i>' + t;
}

// Ao iniciar, busca os dados do MySQL via FastAPI (ou popula o MySQL se estiver vazio)
if (window.CapimAPI) {
  window.CapimAPI.loadState().then(function(remote){
    if (remote && remote.areas && remote.areas.length) {
      S.floors = remote.floors || S.floors;
      S.areas = remote.areas || S.areas;
      S.occ = remote.occ || [];
      S.equip = remote.equip || S.equip;
      S.rounds = remote.rounds || {};
      S.team = remote.team || S.team;
      S.items = remote.items || S.items;
      saveLocal();
      saveState = remote.db_mode === 'mysql' ? 'saved' : 'local';
      render();
    } else if (remote && remote.empty) {
      // Se o banco MySQL acabou de ser criado e está vazio, envia o seed() inicial do app.js para o MySQL
      window.CapimAPI.saveState(cleanState()).then(function(r){
        if (r && r.ok && r.db_mode === 'mysql') { saveState = 'saved'; updSave(); }
      });
    }
  });
}
/* ================= ESTADO DA INTERFACE ================= */
var NAV = [
  ['visao','Visão Geral','home'],['ocorrencias','Ocorrências','alert'],['emergencias','Central de Emergências','siren'],['mapa','Mapa Operacional','map'],
  ['vivo','Shopping Vivo','zap'],['futuro','Modo Futuro','clock'],['laboratorio','Laboratório Digital','spark'],['domino','Efeito Dominó','layers'],['comandante','Modo Comandante','shield'],['raiox','Raio-X Operacional','map'],['investigador','Investigador Digital','search'],['dna','DNA Operacional','chart'],['passaportes','Passaporte Digital','copy'],['missoes','Central de Missões','check'],['executivo','Modo Executivo','monitor'],
  ['preventiva','Manutenção Preventiva','calc'],['corretiva','Manutenção Corretiva','wrench'],['rondas','Rondas Diárias','list'],['limpeza','Limpeza','broom'],['seguranca','Segurança','shield'],['climatizacao','Climatização','thermo'],['energia','Energia','zap'],['equipamentos','Equipamentos','layers'],['estacionamento','Estacionamento','car'],['equipes','Equipes Operacionais','users'],['relatorios','Relatórios','chart'],['simulacao','Simulação Inteligente','spark'],['config','Configurações','gear']
];
var CATVIEW = {
  corretiva:{t:'Manutenção Corretiva',i:'wrench',d:'Chamados de reparo em instalações e equipamentos.',cats:['Elétrica','Hidráulica','Estrutura','Elevadores/Escadas','Outros']},
  limpeza:{t:'Limpeza',i:'broom',d:'Conservação e higiene das áreas comuns.',cats:['Limpeza'],item:'Limpeza'},
  seguranca:{t:'Segurança',i:'shield',d:'Ocorrências de segurança patrimonial e de pessoas.',cats:['Segurança'],item:'Segurança'},
  climatizacao:{t:'Climatização',i:'thermo',d:'Conforto térmico e sistema de ar-condicionado.',cats:['Climatização'],item:'Climatização'},
  energia:{t:'Energia',i:'zap',d:'Instalações elétricas e iluminação.',cats:['Elétrica'],item:'Iluminação'},
  estacionamento:{t:'Estacionamento',i:'car',d:'Ocorrências nas áreas de estacionamento.',area:/estaciona/i}
};
var ui = { view:'visao', floor:S.floors[0].id, sel:null, fStatus:'abertas', q:'', modal:null, posArea:null, labels:window.innerWidth>=700, zoom:1, armed:null, demo:false, menu:false };
function readHash(){ var h=(location.hash||'').slice(1); if (NAV.some(function(n){return n[0]===h;})) ui.view=h; }
readHash();
window.addEventListener('hashchange', function(){ readHash(); render(); });

/* ================= DERIVADOS ================= */
function floor(id){ for(var i=0;i<S.floors.length;i++) if(S.floors[i].id===id) return S.floors[i]; return null; }
function curFloor(){ var f=floor(ui.floor); if(!f){ f=S.floors[0]; ui.floor=f&&f.id; } return f; }
function area(id){ for(var i=0;i<S.areas.length;i++) if(S.areas[i].id===id) return S.areas[i]; return null; }
function aname(id){ var a=area(id); return a?a.name:'—'; }
function fname(id){ var f=floor(id); return f?f.name:''; }
function occById(id){ for(var i=0;i<S.occ.length;i++) if(S.occ[i].id===id) return S.occ[i]; return null; }
function isOpen(o){ return o.status!=='Resolvida'; }
function openOcc(){ return S.occ.filter(isOpen); }
function sev(o){ return PRIOS.indexOf(o.prio); }
function bySev(a,b){ return sev(b)-sev(a) || (a.status==='Aberta'?-1:0)-(b.status==='Aberta'?-1:0) || a.created-b.created; }
function slaLeft(o){ return o.created + SLA_H[o.prio]*HOUR - (o.resolved||Date.now()); }
function equipStatus(e){ var next=e.last+e.freq*DAY, left=Math.ceil((next-Date.now())/DAY);
  if(left<0) return {k:'Vencida',c:'#ef4444',left:left,next:next}; if(left<=3) return {k:'Vence em breve',c:'#a855f7',left:left,next:next}; return {k:'Em dia',c:'#22c55e',left:left,next:next}; }
function areaStatus(id){
  var list=openOcc().filter(function(o){return o.areaId===id;}), w=-1, anyOpen=false;
  list.forEach(function(o){ if(o.prio==='Crítica'||o.prio==='Alta'||o.status==='Aberta') w=Math.max(w,sev(o)); if(o.status==='Aberta') anyOpen=true; });
  if (w>=3) return {c:'#ef4444',k:'Crítico',n:list.length};
  if (w===2) return {c:'#f97316',k:'Pendente',n:list.length};
  if (w>=0) return {c:'#facc15',k:'Atenção',n:list.length};
  if (list.length) return {c:'#3b82f6',k:'Em atendimento',n:list.length};
  if (S.equip.some(function(e){return e.areaId===id && equipStatus(e).left<=3;})) return {c:'#a855f7',k:'Manutenção programada',n:0};
  return {c:'#22c55e',k:'Operacional',n:0};
}
function roundStats(item){ var r=S.rounds[todayKey()]||{}, t=0,d=0,nok=0; S.areas.forEach(function(a){ var m=r[a.id]||{}; (item?[item]:S.items).forEach(function(it){ t++; if(m[it]) d++; if(m[it]==='nok') nok++; }); }); return {t:t,d:d,nok:nok,pct:t?Math.round(d*100/t):0}; }

/* fluxo estimado de visitantes (simulação para fins acadêmicos) */
function flowAt(ts){ var d=new Date(ts), h=d.getHours()+d.getMinutes()/60, dow=d.getDay();
  if (h<9.5||h>22.5) return 8; var base=Math.sin(Math.PI*(h-9.5)/13); base=Math.pow(Math.max(base,0),.8);
  var lunch=Math.exp(-Math.pow(h-12.8,2)/1.2)*.35, eve=Math.exp(-Math.pow(h-19.5,2)/2)*.45;
  var wk=(dow===0||dow===6)?1.35:(dow===5?1.15:1); var seedv=Math.sin(Math.floor(ts/HOUR)*12.9898)*43758.5453; var noise=(seedv-Math.floor(seedv))*.18+.91;
  return Math.round((120+520*(base+lunch+eve))*wk*noise); }
function flowSeries(end){ var a=[]; for(var i=23;i>=0;i--) a.push(flowAt(end-i*HOUR)); return a; }

/* ================= RENDER ================= */
function logoSVG(){ var r=''; for(var i=0;i<13;i++){ var a=Math.PI*(1-i/12), x2=29+Math.cos(a)*27, y2=30-Math.sin(a)*27, x1=29+Math.cos(a)*9, y1=30-Math.sin(a)*9; r+='<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="url(#lg)" stroke-width="'+(i%2?1.4:2.4)+'" stroke-linecap="round"/>'; }
  return '<svg viewBox="0 0 58 34"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d77a"/><stop offset="1" stop-color="#b98a1d"/></linearGradient></defs>'+r+'<path d="M2 31 Q29 26 56 31" stroke="#e9b949" stroke-width="1.6" fill="none"/></svg>'; }
function buildingSVG(){ var w=''; for(var i=0;i<9;i++) w+='<rect x="'+(18+i*22)+'" y="74" width="14" height="30" fill="#f7d77a" opacity="'+(.35+.4*((i*37)%10)/10)+'"/>';
  return '<svg viewBox="0 0 230 140"><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1426"/><stop offset="1" stop-color="#2a1f08"/></linearGradient></defs><rect width="230" height="140" fill="url(#sk)"/><polygon points="10,60 200,40 220,48 220,112 10,112" fill="#141d30" stroke="#e9b949" stroke-width="1.2"/>'+w+'<text x="120" y="62" fill="#f7d77a" font-size="11" font-family="Inter" font-weight="700" text-anchor="middle" letter-spacing="2">CAPIM DOURADO</text><rect x="0" y="112" width="230" height="28" fill="#0a0f1a"/><g fill="#1f6b3a">'+[24,70,150,205].map(function(x){return '<path d="M'+x+' 116 l0 -22 M'+x+' 94 q-10 -2 -14 6 M'+x+' 94 q10 -2 14 6 M'+x+' 94 q-6 -8 -12 -6 M'+x+' 94 q6 -8 12 -6" stroke="#2f8f52" stroke-width="2" fill="none"/>';}).join('')+'</g></svg>'; }

/* V5 — módulos de inteligência demonstrativa, sem rede e sem telemetria real. */
var V5QR={"Escadas rolantes – praça de alimentação": "img/qr/ativo-01.png", "Central de ar-condicionado": "img/qr/ativo-02.png", "Exaustores da praça": "img/qr/ativo-03.png", "Gerador de emergência": "img/qr/ativo-04.png", "Bombas de recalque": "img/qr/ativo-05.png", "Hidrantes e extintores": "img/qr/ativo-06.png", "Iluminação do estacionamento": "img/qr/ativo-07.png", "Elevadores sociais": "img/qr/ativo-08.png"};
var V5={horizon:0,focus:'',layer:'Elétrica',scenario:'energia',command:null,passport:'',missions:{}};
try { V5.missions=JSON.parse(localStorage.getItem('capim.v5.missions')||'{}')||{}; } catch(e){}
function v5save(){try{localStorage.setItem('capim.v5.missions',JSON.stringify(V5.missions));}catch(e){}}
function v5issues(aid){return S.occ.filter(function(o){return isOpen(o)&&(!aid||o.areaId===aid);});}
function v5risk(aid,h){var l=v5issues(aid), now=Date.now();var s=l.reduce(function(n,o){return n+({'Baixa':9,'Média':18,'Alta':32,'Crítica':48}[o.prio]||10)+(o.status==='Aberta'?7:0)+(o.created+SLA_H[o.prio]*HOUR<now?14:0);},0);return Math.min(100,Math.round(s+h*(l.length?2+l.length*1.6:0)));}
function v5health(aid){var l=S.occ.filter(function(o){return o.areaId===aid&&!o.demo;}),o=l.filter(isOpen), late=o.filter(function(x){return slaLeft(x)<0;}).length;var repeats={};l.forEach(function(x){repeats[x.cat]=(repeats[x.cat]||0)+1;});var r=Object.keys(repeats).filter(function(k){return repeats[k]>=2;}).length;return Math.max(0,100-Math.min(90,o.reduce(function(n,x){return n+({'Baixa':5,'Média':10,'Alta':17,'Crítica':26}[x.prio]||10);},0)+late*9+r*6));}
function v5tone(n){return n>=65?'bad':n>=32?'warn':'good';}
function v5section(title,sub,actions){return '<div class="v5-head"><div><span class="v5-kicker">SMART OPERATIONS <i>V5.0</i></span><h2>'+title+'</h2><p>'+sub+'</p></div><div class="v5-actions">'+(actions||'')+'</div></div>';}
function v5tag(s){return '<span class="v5-tag">'+esc(s)+'</span>';}
function v5area(a){var r=v5risk(a.id,V5.horizon);return '<button class="v5-sector '+v5tone(r)+(V5.focus===a.id?' selected':'')+'" style="left:'+Math.max(3,Math.min(97,a.x))+'%;top:'+Math.max(5,Math.min(95,a.y))+'%" data-a="v5focus" data-id="'+esc(a.id)+'" title="'+esc(a.name)+' | risco '+r+'">'+(r>0?r:'·')+'</button>';}
function v5map(opts){opts=opts||{};var active=V5.focus&&area(V5.focus),floors=S.floors.slice(0,2);return '<div class="v5-mapgrid">'+floors.map(function(f){var list=S.areas.filter(function(a){return a.floorId===f.id;});return '<div class="v5-map"><div class="v5-maplabel">'+esc(f.name)+' · '+list.length+' setores</div><div class="v5-mapimage"><img alt="Planta do '+esc(f.name)+'" src="'+esc(f.plan||DEFAULT_PLANS[f.id]||'')+'">'+list.map(v5area).join('')+'</div></div>';}).join('')+'</div>'+(active?'<div class="v5-selected"><strong>'+esc(active.name)+'</strong><span>'+esc(fname(active.floorId))+' · Saúde: '+v5health(active.id)+'/100 · Risco: '+v5risk(active.id,V5.horizon)+'/100</span><button data-a="labarea" data-id="'+esc(active.id)+'" class="btn sm">Abrir no mapa operacional →</button></div>':'');}
function v5time(){return '<div class="v5-time"><b>Horizonte simulado</b>'+[0,2,6,12,24].map(function(h){return '<button class="'+(V5.horizon===h?'active':'')+'" data-a="v5time" data-v="'+h+'">'+(h?'+'+h+'h':'Agora')+'</button>';}).join('')+'</div>';}
function v5metrics(){var high=v5issues().filter(function(o){return o.prio==='Crítica'||o.prio==='Alta';}).length;var health=S.areas.length?Math.round(S.areas.reduce(function(s,a){return s+v5health(a.id);},0)/S.areas.length):100;return '<div class="v5-metrics"><div><span>SAÚDE GLOBAL</span><strong>'+health+'<small>/100</small></strong><em>Índice calculado</em></div><div><span>PENDÊNCIAS</span><strong>'+v5issues().length+'</strong><em>Ocorrências em aberto</em></div><div><span>ALTA PRIORIDADE</span><strong>'+high+'</strong><em>Altas e críticas</em></div><div><span>ÁREAS</span><strong>'+S.areas.length+'</strong><em>Áreas cadastradas</em></div></div>';}
function v5top(){return S.areas.map(function(a){return {a:a,r:v5risk(a.id,V5.horizon),h:v5health(a.id)};}).sort(function(x,y){return y.r-x.r;}).slice(0,6);}
function v5ranking(byHealth){var items=S.areas.map(function(a){return {a:a,r:(ui.view==='futuro'?v52risk:v5risk)(a.id,V5.horizon),h:v5health(a.id)};}).sort(function(x,y){return byHealth?x.h-y.h:y.r-x.r;}).slice(0,10);return '<div class="v5-list">'+items.map(function(x,i){var n=byHealth?x.h:x.r;return '<button data-a="v5focus" data-id="'+esc(x.a.id)+'" class="v5-listrow'+(V5.focus===x.a.id?' selected':'')+(ui.view==='futuro'&&V5.mitig[x.a.id]?' mit':'')+'"><span class="v5-index">'+pad(i+1)+'</span><span class="v5-grow"><b>'+esc(x.a.name)+'</b><small>'+esc(fname(x.a.floorId))+' · '+v5issues(x.a.id).length+' pendência(s)</small></span><span class="v5-pill '+v5tone(byHealth?100-n:n)+'">'+n+'/100</span></button>';}).join('')+'</div>';}
function v5cause(o){var rel={'Elétrica':['Alimentação elétrica','Iluminação e sistemas conectados','Desconforto e interrupções'], 'Climatização':['Falha de refrigeração','Temperatura e conforto','Reclamações e demanda técnica'], 'Hidráulica':['Vazamento ou fluxo anormal','Piso ou equipamentos próximos','Interdição preventiva'], 'Segurança':['Ocorrência de segurança','Acesso e circulação','Necessidade de resposta coordenada'], 'Elevadores/Escadas':['Falha de mobilidade vertical','Rotas alternativas e filas','Possível restrição de acesso'], 'Limpeza':['Falha na conservação','Condições de uso da área','Reclamações ou risco de queda']};return rel[o.cat]||['Origem a investigar','Área e recursos relacionados','Impactos operacionais potenciais'];}
function v5domino(){var incidents=v5issues().slice().sort(bySev).slice(0,7);return '<div class="v5-panel"><h3>Correntes de impacto <small>Hipóteses e não causalidade comprovada</small></h3>'+(incidents.length?incidents.map(function(o){var steps=v5cause(o);return '<div class="v5-flow"><div class="v5-flowtop"><b>'+esc(o.title)+'</b>'+v5tag(o.prio+' · '+aname(o.areaId))+'</div><div class="v5-chain"><span>'+esc(steps[0])+'</span><i>→</i><span>'+esc(steps[1])+'</span><i>→</i><span>'+esc(steps[2])+'</span></div><button class="btn sm" data-a="labocc" data-id="'+esc(o.id)+'">Inspecionar ocorrência</button></div>';}).join(''):'<p>Não há ocorrências abertas para análise de propagação.</p>')+'</div>';}
var v5scenarios={energia:{name:'Pane elétrica',risk:90,decisions:[['isolar','Isolar setor e acionar manutenção',95,'Ação inicial prudente em cenário didático'],['aguardar','Aguardar confirmação sem intervenção',28,'Maior exposição simulada'],['transferir','Apenas transferir a equipe',54,'Reduz capacidade de resposta']]},agua:{name:'Vazamento',risk:73,decisions:[['isolar','Isolar e sinalizar a área',94,'Controle inicial e acionamento técnico'],['aguardar','Manter circulação aberta',18,'Exposição elevada a incidentes'],['registrar','Registrar chamado sem sinalização',45,'Atendimento incompleto']]},clima:{name:'Falha de climatização',risk:62,decisions:[['acionar','Acionar equipe técnica e monitorar',96,'Resposta proativa'],['aguardar','Aguardar o próximo turno',36,'Risco de agravamento operacional'],['ignorar','Encerrar sem verificação',12,'Falha de acompanhamento']]},incendio:{name:'Alarme de incêndio',risk:100,decisions:[['protocolo','Acionar protocolo oficial e emergência',100,'Prioriza segurança e autoridades responsáveis'],['ignorar','Ignorar o alarme',0,'Resposta inadequada'],['investigar','Apenas investigar sem acionar protocolo',15,'Ação insuficiente']]}};
function v5commander(){var s=v5scenarios[V5.scenario]||v5scenarios.energia,c=s.decisions.filter(function(d){return d[0]===V5.command;})[0];return '<div class="v5-panel"><h3>Simulador de decisões <small>Exercício pedagógico, não protocolo operacional</small></h3><div class="v5-scenarios">'+Object.keys(v5scenarios).map(function(k){return '<button class="'+(V5.scenario===k?'active':'')+'" data-a="v5scenario" data-id="'+k+'">'+v5scenarios[k].name+'</button>';}).join('')+'</div><div class="v5-emergency"><span class="v5-pulse"></span><div><small>CENÁRIO EM EXECUÇÃO</small><h3>'+s.name+'</h3><p>Índice fictício de exposição inicial: '+s.risk+'/100</p></div></div><h4>Qual decisão você tomaria primeiro?</h4><div class="v5-decisions">'+s.decisions.map(function(d){return '<button class="'+(V5.command===d[0]?'active':'')+'" data-a="v5command" data-id="'+d[0]+'"><span>'+esc(d[1])+'</span><b>Selecionar →</b></button>';}).join('')+'</div>'+(c?'<div class="v5-result"><b>Resultado do exercício: '+c[2]+'/100</b><div class="v5-progress"><i style="width:'+c[2]+'%"></i></div><p>'+esc(c[3])+'</p></div>':'<p class="v5-hint">Selecione uma decisão para receber o resultado e a pontuação.</p>')+'</div>';}
function v5insights(){var groups={},recent=Date.now()-30*DAY;S.occ.filter(function(o){return !o.demo&&o.created>=recent;}).forEach(function(o){var k=o.areaId+'|'+o.cat;groups[k]=groups[k]||{a:o.areaId,cat:o.cat,n:0,open:0};groups[k].n++;if(isOpen(o))groups[k].open++;});var repeats=Object.keys(groups).map(function(k){return groups[k];}).filter(function(x){return x.n>=2;}).sort(function(a,b){return b.n-a.n;});return '<div class="v5-panel"><h3>Correlação por regras <small>Sem IA externa ou diagnóstico automático</small></h3>'+(repeats.length?repeats.map(function(g){return '<div class="v5-insight"><div><b>Reincidência possível · '+esc(g.cat)+'</b><p>'+esc(aname(g.a))+' registrou '+g.n+' chamados da mesma categoria nos últimos 30 dias ('+g.open+' ainda abertos).</p><small>Evidência: histórico da central · Hipótese: verificar causa recorrente e manutenção do setor.</small></div><button class="btn sm" data-a="labarea" data-id="'+esc(g.a)+'">Ver área</button></div>';}).join(''):'<div class="v5-empty">Sem reincidências suficientes nos últimos 30 dias. O sistema identifica padrões quando houver registros comparáveis.</div>')+'</div>';}
function v5passport(){var eq=S.equip,selected=eq.filter(function(e){return e.id===V5.passport;})[0]||eq[0];if(!selected)return '<div class="v5-empty">Cadastre um equipamento para gerar o passaporte.</div>';var st=equipStatus(selected);return '<div class="v5-passports"><div class="v5-panel"><h3>Ativos cadastrados</h3>'+eq.map(function(e){return '<button class="v5-asset '+(selected.id===e.id?'active':'')+'" data-a="v5passport" data-id="'+esc(e.id)+'">'+ic('layers')+'<span><b>'+esc(e.name)+'</b><small>'+esc(aname(e.areaId))+'</small></span>'+ic('chevr')+'</button>';}).join('')+'</div><div class="v5-panel"><div class="v5-passport-head"><span>PASSAPORTE DIGITAL · '+esc(selected.id.toUpperCase())+'</span><h3>'+esc(selected.name)+'</h3></div><div class="v5-passport-body"><div><small>ÁREA</small><strong>'+esc(aname(selected.areaId))+'</strong></div><div><small>RESPONSÁVEL</small><strong>'+esc(selected.resp||'Não atribuído')+'</strong></div><div><small>STATUS</small><strong style="color:'+st.c+'">'+st.k+'</strong></div><div><small>PRÓXIMA MANUTENÇÃO</small><strong>'+fday(st.next)+'</strong></div><div><small>FREQUÊNCIA</small><strong>'+selected.freq+' dias</strong></div><div><small>EXECUÇÕES REGISTRADAS</small><strong>'+(selected.log||[]).length+'</strong></div></div><div class="v5-qr" id="v5qr"><div class="v5-qrbox" id="v5qrcode">'+(V5QR[selected.name]?'<img alt="QR de identificação do equipamento" src="'+esc(V5QR[selected.name])+'">':'<span>Sem QR cadastrado</span>')+'</div><p>QR de identificação do ativo demonstrativo. A leitura exibe sua identificação; abrir a ficha automaticamente em outro dispositivo requer publicação do site e banco de dados sincronizado.</p></div><div class="v5-actions"><button class="btn g" data-a="editequip" data-id="'+esc(selected.id)+'">Editar equipamento</button><button class="btn" data-a="v5copy">Copiar link do painel</button></div></div></div>';}
function v5missions(){var tasks=v5issues().slice().sort(bySev).slice(0,12),done=tasks.filter(function(o){return !!V5.missions[o.id];}).length;return '<div class="v5-panel"><div class="v5-missiontop"><h3>Missões sugeridas a partir dos chamados</h3><button class="btn sm" data-a="v5resetmissions">Reiniciar checklist</button></div><p class="v5-hint">Checklist de demonstração separado do status oficial dos chamados. Marcar aqui não encerra a ocorrência.</p><div class="v5-progress"><i style="width:'+(tasks.length?Math.round(done*100/tasks.length):100)+'%"></i></div><p>'+done+' de '+tasks.length+' missões marcadas · '+(tasks.length?Math.round(done*100/tasks.length):100)+'% concluído no checklist</p>'+tasks.map(function(o,i){return '<div class="v5-mission '+(V5.missions[o.id]?'done':'')+'"><button data-a="v5mission" data-id="'+esc(o.id)+'" aria-label="Marcar missão">'+(V5.missions[o.id]?'✓':'○')+'</button><div class="v5-grow"><b>MISSÃO '+pad(i+1)+' · '+esc(o.title)+'</b><small>'+esc(aname(o.areaId))+' · '+esc(o.prio)+' · '+esc(o.resp||'Equipe não atribuída')+'</small></div><button class="btn sm" data-a="labocc" data-id="'+esc(o.id)+'">Abrir chamado</button></div>';}).join('')+(tasks.length?'':'<div class="v5-empty">Sem chamados abertos para gerar missões.</div>')+'</div>';}
function v5executive(){var bad=v5top().filter(function(x){return x.r>0;});return '<div class="v5-panel"><h3>Resumo gerencial</h3><p>O painel traduz chamados e equipamentos em indicadores de apresentação. Sem alegações de economia comprovada, sensores reais ou previsão certificada.</p><div class="v5-exegrid"><div><b>'+S.equip.length+'</b><span>Ativos cadastrados</span></div><div><b>'+S.occ.filter(function(o){return o.status==='Resolvida';}).length+'</b><span>Chamados resolvidos</span></div><div><b>'+v5issues().filter(function(o){return slaLeft(o)<0;}).length+'</b><span>SLA vencido</span></div><div><b>'+bad.length+'</b><span>Setores prioritários (top 6)</span></div></div><button class="btn g" data-a="v5print">Imprimir / salvar PDF do resumo</button></div>';}
function v5xray(){var categories=['Elétrica','Hidráulica','Climatização','Segurança','Elevadores/Escadas','Limpeza'];var occ=S.occ.filter(function(o){return isOpen(o)&&o.cat===V5.layer;});return '<div class="v5-panel"><h3>Camadas operacionais <small>Camadas de dados sobre a planta, não redes técnicas reais</small></h3><div class="v5-scenarios">'+categories.map(function(c){return '<button class="'+(V5.layer===c?'active':'')+'" data-a="v5layer" data-id="'+esc(c)+'">'+esc(c)+'</button>';}).join('')+'</div><div class="v5-xmap">'+S.floors.slice(0,2).map(function(f){return '<div><img alt="Planta ilustrativa" src="'+esc(f.plan||DEFAULT_PLANS[f.id]||'')+'">'+occ.filter(function(o){return (area(o.areaId)||{}).floorId===f.id;}).map(function(o){var a=area(o.areaId);return '<button class="v5-layerpoint" data-a="labocc" data-id="'+esc(o.id)+'" style="left:'+a.x+'%;top:'+a.y+'%" title="'+esc(o.title)+'">!</button>';}).join('')+'</div>';}).join('')+'</div><p class="v5-hint">'+occ.length+' chamados abertos da categoria '+esc(V5.layer)+'. A visualização não contém rotas de evacuação homologadas, tubulações, fios ou sensores.</p></div>';}
function v5entry(){return '<div class="v5-entry"><div><span>CAPIM DOURADO · SMART OPERATIONS V5</span><h2>Seu shopping. Uma central de comando.</h2><p>Dez novos módulos demonstrativos conectados aos chamados, equipamentos e plantas.</p></div><div><button class="btn g" data-a="go" data-id="ocorrencias">Ver ocorrências →</button><button class="btn" data-a="go" data-id="emergencias">Central de Emergências</button><button class="btn" data-a="go" data-id="vivo">Shopping Vivo</button><button class="btn" data-a="go" data-id="comandante">Simular crise</button><button class="btn" data-a="go" data-id="executivo">Visão executiva</button></div></div>';}

/* V5.1 — Maquete artística enviada pelo usuário, compartilhada entre Shopping Vivo e Modo Futuro. */
var V51_ART='img/maquete_futurista_usuario.png';
var V51_POINTS=[
 {name:'Renner',x:22,y:70}, {name:'C&A',x:74,y:69}, {name:'Cinemark',x:74,y:83},
 {name:'Praça de alimentação',x:50,y:24}, {name:'Escadas rolantes',x:61,y:20},
 {name:'Circulação central',x:49,y:69}, {name:'Estacionamento',x:49,y:51},
 {name:'Mundo Imersivo',x:28,y:17}, {name:'Lojas âncora',x:77,y:59},
 {name:'Praça de eventos',x:48,y:80}, {name:'Acesso Principal',x:48,y:87},
 {name:'Morofit / Wow Park',x:73,y:55}
];
/* ================= V5.2 — MODO FUTURO INTERATIVO + MODELO 3D =================
   O modelo 3D (mapa3d.html) roda num iframe criado uma única vez e mantido fora
   do #root: render() não o recarrega; ele apenas acompanha o espaço reservado.
   Sistema e modelo conversam por postMessage (source 'cdapp' <-> 'cd3d'). */
var V52_3D={frame:null,raf:0,loaded:false,ready:false,full:false,armed:false,lastLock:null};
var V52_COARSE=!!(window.matchMedia&&matchMedia('(pointer: coarse)').matches);
V5.mitig={};V5.playT=null;
function v52risk(id,h){var r=v5risk(id,h);return V5.mitig[id]?Math.round(r*0.2):r;}
function v52hlabel(h){h=Math.round(h);return h?'+'+h+'h':'Agora';}
function v52payload(fly){var h=V5.horizon;return {source:'cdapp',type:'data',horizon:h,playing:!!V5.playT,full:V52_3D.full,focus:V5.focus||'',fly:!!fly,
  areas:S.areas.map(function(a){var iss=v5issues(a.id).slice().sort(bySev),r=v52risk(a.id,h);return {id:a.id,name:a.name,floorName:fname(a.floorId),risk:r,raw:v5risk(a.id,h),tone:v5tone(r),health:v5health(a.id),mit:!!V5.mitig[a.id],n:iss.length,issues:iss.slice(0,3).map(function(o){return {t:o.title,p:o.prio};})};})};}
function v52post(m){var f=V52_3D.frame;if(f&&f.contentWindow&&V52_3D.ready){try{f.contentWindow.postMessage(m,'*');}catch(e){}}}
function v52send(fly){if(document.getElementById('v51-3d-slot'))v52post(v52payload(fly));}
function v52frame(){
  if(V52_3D.frame)return V52_3D.frame;
  var f=document.createElement('iframe');
  f.src='mapa3d.html';f.title='Modelo 3D interativo do Capim Dourado Shopping';f.className='v52-3d-frame';
  f.setAttribute('allow','fullscreen');
  f.addEventListener('load',function(){V52_3D.loaded=true;var l=document.querySelector('.v51-3d-loading');if(l)l.style.display='none';});
  document.body.appendChild(f);V52_3D.frame=f;return f;
}
function v52sync(){
  var slot=document.getElementById('v51-3d-slot'),f=V52_3D.frame;
  if(!slot){
    if(f){f.style.visibility='hidden';f.style.pointerEvents='none';}
    if(V52_3D.full){V52_3D.full=false;document.body.classList.remove('v52-fullscreen');}
    V52_3D.armed=false;V52_3D.raf=0;return;
  }
  f=v52frame();
  if(V52_3D.loaded){var l=slot.querySelector('.v51-3d-loading');if(l)l.style.display='none';}
  var r=slot.getBoundingClientRect(),hidden=r.width<2;
  f.style.left=r.left+'px';f.style.top=r.top+'px';f.style.width=r.width+'px';f.style.height=r.height+'px';
  if(V52_3D.full){f.style.clipPath='none';}
  else{
    var m=document.querySelector('.main'),mr=m?m.getBoundingClientRect():{top:0,left:0,right:innerWidth,bottom:innerHeight};
    var hdr=document.querySelector('.hdr'),top=Math.max(mr.top,hdr?hdr.getBoundingClientRect().bottom:0);
    var ct=Math.max(0,top-r.top),cb=Math.max(0,r.bottom-Math.min(mr.bottom,innerHeight)),cl=Math.max(0,mr.left-r.left),cr=Math.max(0,r.right-mr.right);
    hidden=hidden||ct>=r.height||cb>=r.height;
    f.style.clipPath='inset('+ct+'px '+cr+'px '+cb+'px '+cl+'px)';
  }
  var lock=V52_COARSE&&!V52_3D.full&&!V52_3D.armed;
  if(V52_3D.ready&&lock!==V52_3D.lastLock){V52_3D.lastLock=lock;v52post({source:'cdapp',type:'touchlock',on:lock});}
  f.style.visibility=hidden?'hidden':'visible';f.style.pointerEvents=(hidden||lock)?'none':'auto';
  V52_3D.raf=requestAnimationFrame(v52sync);
}
function v52watch(){if(!V52_3D.raf)V52_3D.raf=requestAnimationFrame(v52sync);v52send(false);}
function v52full(on){
  var slot=document.getElementById('v51-3d-slot');
  V52_3D.full=slot?(on===undefined?!V52_3D.full:!!on):false;
  document.body.classList.toggle('v52-fullscreen',V52_3D.full);
  if(slot)slot.classList.toggle('v52-full',V52_3D.full);
  var b=document.getElementById('v52-fullbtn');if(b)b.innerHTML=V52_3D.full?'✕ Sair da tela cheia':'⛶ Tela cheia';
  v52send(false);
}
function v52play(){
  if(V5.playT){clearInterval(V5.playT);V5.playT=null;v52live(false);return;}
  if(V5.horizon>=24)V5.horizon=0;
  V5.playT=setInterval(function(){
    if(ui.view!=='futuro'){clearInterval(V5.playT);V5.playT=null;return;}
    V5.horizon=Math.min(24,Math.round(V5.horizon)+1);
    if(V5.horizon>=24){clearInterval(V5.playT);V5.playT=null;}
    v52live(false);
  },380);
  v52live(false);
}
function v52stop(){if(V5.playT){clearInterval(V5.playT);V5.playT=null;}}
function v52time(){var h=Math.round(V5.horizon);return '<div class="v52-time"><div class="v52-time-head"><b>Horizonte simulado</b><span class="v52-hval" id="v52-hval">'+v52hlabel(h)+'</span><button class="v52-play'+(V5.playT?' on':'')+'" data-a="v52play" id="v52-play">'+(V5.playT?'❚❚ Pausar':'▶ Reproduzir 24h')+'</button></div>'+
  '<input type="range" id="v52-range" min="0" max="24" step="1" value="'+h+'" aria-label="Horizonte simulado em horas">'+
  '<div class="v52-presets">'+[0,2,6,12,24].map(function(x){return '<button data-a="v52h" data-v="'+x+'" class="'+(h===x?'active':'')+'">'+v52hlabel(x)+'</button>';}).join('')+'</div></div>';}
function v52summary(){var h=V5.horizon,rs=S.areas.map(function(a){return v52risk(a.id,h);}),avg=rs.length?Math.round(rs.reduce(function(s,n){return s+n;},0)/rs.length):0,
  warn=rs.filter(function(n){return n>=32&&n<65;}).length,bad=rs.filter(function(n){return n>=65;}).length,m=Object.keys(V5.mitig).filter(function(k){return V5.mitig[k];}).length;
  return '<div><span>Exposição média</span><b class="'+v5tone(avg)+'">'+avg+'<small>/100</small></b></div><div><span>Setores em atenção</span><b class="warn">'+warn+'</b></div><div><span>Prioridade elevada</span><b class="bad">'+bad+'</b></div><div><span>Ações simuladas</span><b class="mit">'+m+'</b>'+(m?'<button data-a="v52clear">Limpar</button>':'')+'</div>';}
function v52focusHTML(){var future=ui.view==='futuro',focus=V5.focus&&area(V5.focus);
  if(!focus)return future?'<div class="v52-focus-empty">'+ic('info')+'<span>'+(V52_COARSE?'Toque':'Clique')+' em um farol colorido no 3D ou em um setor do ranking para ver o risco projetado e simular a ação da equipe.</span></div>':'';
  var r=future?v52risk(focus.id,V5.horizon):v5risk(focus.id,0),pend=v5issues(focus.id).length;
  return '<div class="v51-focus"><div><strong>'+esc(focus.name)+'</strong><small>'+esc(fname(focus.floorId))+' · Saúde '+v5health(focus.id)+'/100 · Risco projetado <b class="v52-r '+v5tone(r)+'">'+r+'/100</b> · '+pend+' pendência(s)'+(future&&V5.mitig[focus.id]?' · <b class="v52-r mit">ação simulada</b>':'')+'</small></div><div class="v52-focus-act">'+
    (future&&pend?'<button class="btn sm '+(V5.mitig[focus.id]?'':'g')+'" data-a="v52mit" data-id="'+esc(focus.id)+'">'+(V5.mitig[focus.id]?'↺ Desfazer ação':'⚡ Simular envio da equipe')+'</button>':'')+
    '<button class="btn sm" data-a="labarea" data-id="'+esc(focus.id)+'">Abrir ocorrências '+ic('chevr')+'</button></div></div>';}
function v52live(fly){
  if(ui.view!=='futuro')return;
  if(V5.view3d===false){render();return;}
  var h=Math.round(V5.horizon),set=function(id,html){var e=document.getElementById(id);if(e)e.innerHTML=html;};
  var hv=document.getElementById('v52-hval');if(hv)hv.textContent=v52hlabel(h);
  var rg=document.getElementById('v52-range');if(rg&&document.activeElement!==rg)rg.value=h;
  Array.prototype.forEach.call(document.querySelectorAll('.v52-presets button'),function(b){b.classList.toggle('active',+b.getAttribute('data-v')===h);});
  var pl=document.getElementById('v52-play');if(pl){pl.classList.toggle('on',!!V5.playT);pl.textContent=V5.playT?'❚❚ Pausar':'▶ Reproduzir 24h';}
  var chip=document.getElementById('v52-chip');if(chip)chip.innerHTML='<i></i>CENÁRIO '+(h?'+'+h+'H':'AGORA');
  set('v52-sum',v52summary());set('v52-rank',v5ranking(false));set('v52-focus',v52focusHTML());
  v52send(fly);
}
window.addEventListener('message',function(ev){
  var m=ev.data;if(!m||m.source!=='cd3d')return;
  if(m.type==='ready'){V52_3D.ready=true;V52_3D.lastLock=null;v52send(!!V5.focus);}
  else if(m.type==='focus'){V5.focus=m.id||'';v52live(false);}
  else if(m.type==='mitigate'){V5.mitig[m.id]=!!m.on;if(m.on)toast('Ação da equipe simulada em “'+aname(m.id)+'”');v52live(false);}
  else if(m.type==='open'){v52full(false);var b=document.createElement('button');b.setAttribute('data-a','labarea');b.setAttribute('data-id',m.id);b.style.display='none';document.body.appendChild(b);b.click();b.parentNode.removeChild(b);}
  else if(m.type==='horizon'){v52stop();V5.horizon=Math.max(0,Math.min(24,+m.h||0));v52live(false);}
  else if(m.type==='play'){v52play();}
  else if(m.type==='full'){v52full();}
});
document.addEventListener('input',function(ev){if(ev.target&&ev.target.id==='sim-staff'){lab.sim.staff=+ev.target.value;var sv=document.getElementById('sim-staff-v');if(sv)sv.textContent=lab.sim.staff+' pessoas';}});
document.addEventListener('change',function(ev){if(ev.target&&ev.target.id==='sim-staff'){lab.sim.staff=+ev.target.value;labSimReset();}});
document.addEventListener('input',function(ev){if(ev.target&&ev.target.id==='v52-range'){v52stop();V5.horizon=+ev.target.value;v52live(false);}});
document.addEventListener('click',function(ev){if(V52_COARSE&&ev.target.closest&&ev.target.closest('#v51-3d-slot'))V52_3D.armed=true;});
document.addEventListener('touchstart',function(ev){if(V52_3D.armed&&!(ev.target.closest&&ev.target.closest('#v51-3d-slot')))V52_3D.armed=false;},{passive:true,capture:true});
document.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&V52_3D.full)v52full(false);});
function v51pointArea(n){return S.areas.find(function(a){return a.name.toLowerCase()===n.toLowerCase();})||null;}
function v51hero(mode){var future=mode==='futuro',three=future&&V5.view3d!==false,h=future?V5.horizon:0,hr=Math.round(h);
 var points=three?'':V51_POINTS.map(function(p){var a=v51pointArea(p.name);if(!a)return '';var risk=future?v52risk(a.id,h):v5risk(a.id,0);return '<button class="v51-pin '+v5tone(risk)+(V5.focus===a.id?' selected':'')+'" style="left:'+p.x+'%;top:'+p.y+'%" data-a="v5focus" data-id="'+esc(a.id)+'" title="'+esc(a.name)+' · risco '+risk+'/100"><span>'+(risk||'·')+'</span></button>';}).join('');
 var hint=three?(V52_COARSE?'Toque no 3D para interagir · toque nos faróis coloridos para ver cada setor':'Arraste para girar · roda do mouse para zoom · clique nos faróis coloridos'):'Clique nos pontos para ver o risco projetado de cada setor';
 return '<div class="v51-hero"><div class="v51-hero-top"><div><div class="v51-eyebrow">DIGITAL TWIN <span>·</span> MODELO ILUSTRATIVO</div><h3>'+(future?'Visão de exposição futura':'Visão viva do shopping')+'</h3><p>'+(three?'Modelo 3D com faróis de risco vinculados aos setores cadastrados.':'Maquete conceitual com pontos operacionais vinculados aos setores cadastrados.')+'</p></div><div class="v51-live" id="v52-chip"><i></i>'+(future?'CENÁRIO '+(hr?'+'+hr+'H':'AGORA'):'MONITOR DEMONSTRATIVO')+'</div></div>'+
 (future?'<div class="v52-sum" id="v52-sum">'+v52summary()+'</div><div class="v51-viewtabs"><button data-a="v51view" data-id="3d" class="'+(three?'active':'')+'">◈ Modelo 3D interativo</button><button data-a="v51view" data-id="2d" class="'+(!three?'active':'')+'">▦ Maquete com pontos</button>'+(three?'<button data-a="v52full" id="v52-fullbtn" class="v52-fullbtn">'+(V52_3D.full?'✕ Sair da tela cheia':'⛶ Tela cheia')+'</button>':'')+'<span>'+hint+'</span></div>':'')+
 (three?'<div class="v51-scene v51-scene-3d'+(V52_3D.full?' v52-full':'')+'" id="v51-3d-slot"><div class="v51-3d-loading">Carregando modelo 3D…</div></div>'
   :'<div class="v51-scene"><img src="'+V51_ART+'" alt="Maquete futurista colorida com dois pavimentos do Capim Dourado Shopping">'+points+'<div class="v51-scene-caption"><span>2 PAVIMENTOS</span><span>SETORES MONITORADOS</span><span>RISCO SIMULADO</span></div></div>')+
 '<div class="v51-legend"><span><i class="green"></i>Sem alerta relevante</span><span><i class="amber"></i>Atenção</span><span><i class="red"></i>Prioridade elevada</span>'+(future?'<span><i class="cyan"></i>Ação simulada</span>':'')+'<small>'+(three?'Altura e cor dos faróis indicam o risco projetado · posições aproximadas.':'Os pontos são aproximações visuais sobre uma arte ilustrativa.')+'</small></div>'+
 '<div id="v52-focus">'+v52focusHTML()+'</div></div>';}
function v51details(){return '<details class="v51-details"><summary>'+ic('map')+' Inspecionar plantas técnicas de referência <span>Expandir</span></summary><div class="v51-detailinner">'+v5map()+'</div></details>';}

function vNext(kind){var titles={vivo:['Shopping Vivo','As plantas reagem visualmente à criticidade das ocorrências.'],domino:['Efeito Dominó','Explore impactos potenciais entre sistemas do shopping.'],futuro:['Máquina do Tempo','Faça uma projeção hipotética das pendências e dos riscos.'],comandante:['Modo Comandante','Treine decisões com cenários e resultados simulados.'],raiox:['Raio-X Operacional','Filtros técnicos de ocorrências por categoria, sobre as plantas.'],investigador:['Investigador Digital','Detecte reincidências a partir do histórico de registros.'],dna:['DNA Operacional','Índice ilustrativo de saúde para cada setor cadastrado.'],passaportes:['Passaporte Digital','Inventário, manutenção e ficha individual dos equipamentos.'],missoes:['Central de Missões','Transforme ocorrências abertas em um checklist de prioridades.'],executivo:['Modo Executivo','Indicadores resumidos e apresentação estratégica.']};var spec=titles[kind];var head='<div class="v5-page">'+v5section(spec[0],spec[1],'<button class="btn" data-a="go" data-id="laboratorio">'+ic('spark')+' Laboratório</button>')+v5metrics();var main='';
 if(kind==='vivo'){main=v51hero('vivo')+'<div class="v5-panel"><h3>Setores prioritários</h3>'+v5ranking(false)+'</div>'+v51details();}
 if(kind==='domino'){main=v5domino()+'<div class="v5-panel"><h3>Princípio de simulação</h3><p>As sequências apresentam hipóteses didáticas definidas por categoria. Para evidência de causalidade real seria necessário correlacionar ativos, sensores, registros técnicos e inspeções.</p></div>';}
 if(kind==='futuro'){main='<div class="v51-timepanel">'+v52time()+'</div>'+v51hero('futuro')+'<div class="v5-panel"><h3>Projeção de risco por setor <small>'+(V52_COARSE?'Toque':'Clique')+' em um setor para localizá-lo no 3D</small></h3><div id="v52-rank">'+v5ranking(false)+'</div></div>'+v51details();}
 if(kind==='comandante'){main=v5commander();}
 if(kind==='raiox'){main=v5xray();}
 if(kind==='investigador'){main=v5insights()+'<div class="v5-panel"><h3>Próximas investigações</h3>'+v5ranking(false)+'</div>';}
 if(kind==='dna'){var all=S.areas.map(function(a){return {a:a,h:v5health(a.id)};}),avg=all.length?Math.round(all.reduce(function(n,x){return n+x.h;},0)/all.length):100;main='<div class="v5-panel"><h3>Mapa de saúde <small>Média dos setores: '+avg+'/100</small></h3>'+v5map()+'</div><div class="v5-panel"><h3>Ranking de saúde operacional</h3>'+v5ranking(true)+'</div>';}
 if(kind==='passaportes'){main=v5passport();}
 if(kind==='missoes'){main=v5missions();}
 if(kind==='executivo'){main=v5executive()+'<div class="v5-panel"><h3>Setores em atenção</h3>'+v5ranking(false)+'</div>';}
 return head+main+'<div class="v5-footnote">SIMULAÇÃO ACADÊMICA · Dados locais e indicadores heurísticos · Não usar para decisões emergenciais reais.</div></div>';}

function render(){
  var root=document.getElementById('root'); var crit=openOcc().filter(function(o){return o.prio==='Crítica'||o.prio==='Alta';}).length, now=new Date();
  var nav=NAV.map(function(n,i){ var b=''; if(n[0]==='ocorrencias'){ var c=openOcc().filter(function(o){return o.status==='Aberta';}).length; if(c) b='<span class="b">'+c+'</span>'; } if(n[0]==='emergencias'&&crit) b='<span class="b">'+crit+'</span>';
    var group=i===0?'<div class="nav-group nav-group-first">CENTRAL OPERACIONAL <span>PRIORIDADE</span></div>':i===4?'<div class="nav-group">INTELIGÊNCIA & FUTURO</div>':i===15?'<div class="nav-group">GESTÃO & SERVIÇOS</div>':'';
    return group+'<button class="nv'+(i<4?' nv-priority':'')+(n[0]==='emergencias'&&crit?' nv-urgent':'')+(ui.view===n[0]?' on':'')+'" data-a="go" data-id="'+n[0]+'">'+ic(n[2])+'<span>'+n[1]+'</span>'+b+'</button>'; }).join('');
  var views={vivo:function(){return vNext("vivo");},domino:function(){return vNext("domino");},futuro:function(){return vNext("futuro");},comandante:function(){return vNext("comandante");},raiox:function(){return vNext("raiox");},investigador:function(){return vNext("investigador");},dna:function(){return vNext("dna");},passaportes:function(){return vNext("passaportes");},missoes:function(){return vNext("missoes");},executivo:function(){return vNext("executivo");},visao:vVisao,laboratorio:vLab,mapa:vMapa,emergencias:vEmerg,ocorrencias:vOcc,preventiva:vPrev,rondas:vRondas,equipamentos:vEquip,equipes:vEquipes,relatorios:vRel,simulacao:vSim,config:vConfig};
  var body = views[ui.view] ? views[ui.view]() : vCat(ui.view);
  if(ui.view==='visao') body=v5entry()+body;
  var fab = ['mapa','config','simulacao','rondas','relatorios','preventiva','equipamentos'].indexOf(ui.view)<0 ? '<button class="fab" data-a="newocc">'+ic('plus')+'Nova ocorrência</button>' : '';
  root.innerHTML =
  '<div class="app'+(ui.menu?' open':'')+'">'+
  '<header class="hdr"><button class="menu-btn" data-a="menu">'+ic('menu')+'</button>'+
    '<div class="logo">'+logoSVG()+'<div class="lt"><div class="l1">CAPIM DOURADO</div><div class="l2">SHOPPING</div><div class="l3">Palmas – TO</div></div></div>'+
    '<div class="ttl"><h1><span class="t1">CAPIM DOURADO</span><span>|</span>CENTRAL OPERACIONAL</h1><p>Gestão inteligente de infraestrutura e serviços.</p></div>'+
    '<label class="srch">'+ic('search')+'<input id="hq" placeholder="Buscar área, loja, ocorrência…" value="'+esc(ui.q)+'"></label>'+
    '<button class="hbtn" data-a="go" data-id="emergencias" title="Alertas">'+ic('bell')+(crit?'<span class="cnt">'+crit+'</span>':'')+'</button><span class="sep"></span>'+
    '<div class="hbtn" title="Usuário">'+ic('user')+'<span class="user-n">'+esc((window.CDAuth&&CDAuth.user())||'Administrador')+'<br><span id="save" class="save"></span></span></div><button class="hbtn logout-btn" data-a="logout" title="Sair do sistema">'+ic('logout')+'</button><span class="sep"></span>'+
    '<div class="clock">'+ic('cal')+'<div><span id="cdate">'+fday(now)+'</span><b id="ctime">'+pad(now.getHours())+':'+pad(now.getMinutes())+'</b></div></div>'+
    '<button class="demo'+(ui.demo?' on':'')+'" data-a="demo">'+ic('monitor')+'<span class="dl">'+(ui.demo?'Demonstração ativa':'Modo demonstração')+'</span></button>'+
  '</header>'+
  '<aside class="side">'+nav+'<div class="bld">'+buildingSVG()+'</div></aside><div class="scrim" data-a="menu"></div>'+
  '<main class="main">'+body+'</main>'+
  '<footer class="foot">'+ic('info')+' SIMULAÇÃO ACADÊMICA — NÃO REPRESENTA OCORRÊNCIAS REAIS DO SHOPPING.</footer>'+
  '</div>'+fab+(ui.modal?modalHTML():'');
  updSave(); tick(); initLab3D(); v52watch();
}
function viewHead(icon,t,d,act){ return '<div class="vh"><div class="ic">'+ic(icon)+'</div><div><h2>'+t+'</h2><p>'+d+'</p></div>'+(act?'<div class="act">'+act+'</div>':'')+'</div>'; }

/* ---------- mapa ---------- */
function pinSVG(c){ return '<svg class="p" viewBox="0 0 34 44"><defs><linearGradient id="pg'+c.slice(1)+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c+'"/><stop offset="1" stop-color="'+c+'" stop-opacity=".75"/></linearGradient></defs><path d="M17 43C17 43 2 27 2 16.5A15 15 0 0 1 32 16.5C32 27 17 43 17 43z" fill="url(#pg'+c.slice(1)+')" stroke="#fff" stroke-width="2"/></svg>'; }
function defaultSVG(){ return '<svg class="bg" viewBox="0 0 1000 650"><rect width="1000" height="650" fill="#fff"/><text x="500" y="325" text-anchor="middle" font-size="22" fill="#555" font-family="Inter">Carregue a planta deste piso em Configurações</text></svg>'; }
function mapHTML(){
  var F=curFloor(); if(!F) return '<div class="empty">Cadastre um piso em Configurações.</div>';
  var fa={}; S.areas.forEach(function(a){ if(a.floorId===F.id) fa[a.id]=a; });
  var bg = F.plan ? '<img src="'+F.plan+'" alt="Planta – '+esc(F.name)+'" draggable="false">' : defaultSVG();
  var ads = Object.keys(fa).map(function(id){ var a=fa[id], st=areaStatus(id); return '<button class="ad'+(ui.posArea===id?' sel':'')+'" data-a="area" data-id="'+id+'" style="left:'+a.x+'%;top:'+a.y+'%;--c:'+st.c+'"><span class="lb">'+ic(areaIcon(a.name))+esc(a.name)+'</span><span class="dt"></span></button>'; }).join('');
  var eq = S.equip.filter(function(e){ return fa[e.areaId] && equipStatus(e).left<=3; }).map(function(e,i){ var a=fa[e.areaId]; return '<button class="pin eq" data-a="editequip" data-id="'+e.id+'" title="'+esc(e.name)+'" style="left:'+(a.x+2.5)+'%;top:'+(a.y-1)+'%;--c:#a855f7">'+pinSVG('#a855f7')+ic('wrench')+'</button>'; }).join('');
  var sel = selOcc();
  var pins = openOcc().filter(function(o){ return fa[o.areaId] && o.x!=null; }).sort(function(a,b){return sev(a)-sev(b);}).map(function(o){ var c=PRIO_C[o.prio], s=sel&&sel.id===o.id;
    return '<button class="pin'+(s?' sel':'')+'" data-a="selocc" data-id="'+o.id+'" title="'+esc(o.title)+'" style="left:'+o.x+'%;top:'+o.y+'%;--c:'+c+'">'+pinSVG(c)+ic(o.prio==='Crítica'?'alert':CAT_I[o.cat])+'</button>'; }).join('');
  var tabs = S.floors.map(function(f){ return '<button class="ftab'+(f.id===F.id?' on':'')+'" data-a="floor" data-id="'+f.id+'">'+esc(f.name)+'</button>'; }).join('');
  var ban = ui.posArea ? '<div class="banner">'+ic('pin')+'<span>Toque na planta para posicionar <b>'+esc(aname(ui.posArea))+'</b></span><button class="btn sm" style="margin-left:auto" data-a="cancelpos">Cancelar</button></div>' : '';
  return '<div class="mapbox"><div class="mapbar">'+tabs+'<div class="mtools"><button data-a="zoom" data-v="1" title="Aproximar">+</button><button data-a="zoom" data-v="-1" title="Afastar">−</button><button data-a="labels" title="Nomes das áreas">Aa</button></div></div>'+
    '<div class="mapscroll"><div class="map'+(ui.labels?'':' nolbl')+'" id="map" style="width:'+(ui.zoom*100)+'%">'+bg+ads+eq+pins+'</div></div>'+ban+'</div>';
}
function selOcc(){ var o=ui.sel&&occById(ui.sel); if(o) return o; var l=openOcc().sort(bySev); return l[0]||null; }
function openList(){ return openOcc().sort(bySev); }
function detailPanel(){
  var o=selOcc();
  if(!o) return '<div class="pn g okpanel">'+ic('check')+'<h3 style="margin:12px 0 6px">Tudo operacional</h3><p class="s">Nenhuma ocorrência aberta no momento.</p></div>';
  var c=PRIO_C[o.prio], a=area(o.areaId), L=openList(), idx=L.indexOf(o), left=slaLeft(o), resolved=o.status==='Resolvida';
  var slaCls = resolved ? (left>=0?'ok':'') : (left<0?'':left<SLA_H[o.prio]*HOUR*.3?'warn':'ok');
  var stBtn = o.status==='Aberta' ? '<button class="bstat org" data-a="setst" data-id="'+o.id+'" data-v="Em andamento">'+ic('users')+'Acionar equipe</button>'
    : o.status==='Em andamento' ? '<button class="bstat grn" data-a="setst" data-id="'+o.id+'" data-v="Resolvida" title="Tocar para concluir">'+ic('check')+'Equipe acionada</button>'
    : '<div class="bstat grn">'+ic('check')+'Resolvida</div>';
  return '<div class="dp" style="--c:'+c+'"><div class="dh">'+ic(o.prio==='Crítica'||o.prio==='Alta'?'alert':CAT_I[o.cat])+'<span>'+esc(o.title)+'</span><button class="x" data-a="occ" data-id="'+o.id+'" title="Abrir chamado">'+ic('ext')+'</button></div>'+
    '<div class="rw">'+ic('layers')+'<div><div class="k">Localização</div><div class="v">'+esc(a?fname(a.floorId)+' – '+a.name:'—')+'</div></div></div>'+
    '<div class="rw hl">'+ic('alert')+'<div><div class="k">Criticidade</div><div class="v">'+o.prio+'</div></div></div>'+
    '<div class="rw">'+ic('tools')+'<div><div class="k">Equipe responsável</div><div class="v">'+esc(o.resp||'—')+'</div></div></div>'+
    '<div class="rw">'+ic('refresh')+'<div><div class="k">Status</div><div class="v" style="color:'+STATUS_C[o.status]+';font-weight:700">'+o.status+'</div></div></div>'+
    '<div class="rw">'+ic('clock')+'<div><div class="k">Aberto em</div><div class="v">'+fdate(o.created)+'</div></div></div>'+
    '<div class="rw">'+ic('timer')+'<div><div class="k">SLA</div><div class="v"><span class="sla '+slaCls+'" id="sla" data-id="'+o.id+'">'+(left<0?'-':'')+hms(left)+'</span> <span class="s">(prazo: '+fmtH(SLA_H[o.prio])+')</span></div></div></div>'+
    '<div class="ft">'+stBtn+'<button class="bgold" data-a="occ" data-id="'+o.id+'">Ver chamado '+ic('chevr')+'</button></div>'+
    (L.length>1&&idx>=0?'<div class="nav2"><button data-a="cyc" data-v="-1">'+ic('chevl')+'</button><span>Ocorrência '+(idx+1)+' de '+L.length+' em aberto</span><button data-a="cyc" data-v="1">'+ic('chevr')+'</button></div>':'')+'</div>';
}
function legendCard(){ var L=[['#22c55e','Operacional'],['#facc15','Atenção'],['#f97316','Pendente'],['#ef4444','Crítico'],['#a855f7','Manutenção programada'],['#3b82f6','Em atendimento']];
  return '<div class="pn"><h3>Legenda de status <small>(áreas e ativos)</small></h3><div class="lg">'+L.map(function(l){return '<span><i style="--c:'+l[0]+'"></i>'+l[1]+'</span>';}).join('')+'</div></div>'; }
function indCard(){ var F=curFloor(), fa=S.areas.filter(function(a){return a.floorId===F.id;}), ids={}; fa.forEach(function(a){ids[a.id]=1;});
  var okA=fa.filter(function(a){ var k=areaStatus(a.id).k; return k==='Operacional'||k==='Manutenção programada'; }).length;
  var op=S.occ.filter(function(o){return ids[o.areaId];}), ab=op.filter(function(o){return o.status==='Aberta';}).length, at=op.filter(function(o){return o.status==='Em andamento';}).length,
    rs=op.filter(function(o){return o.status==='Resolvida'&&o.resolved>Date.now()-DAY;}).length;
  function c(color,icon,v,l){ return '<div style="--c:'+color+'">'+ic(icon)+'<b>'+v+'</b><small>'+l+'</small></div>'; }
  return '<div class="pn"><h3>Indicadores operacionais <small>('+esc(F.name.toLowerCase())+')</small></h3><div class="ind">'+
    c('#22c55e','check',(fa.length?Math.round(okA*100/fa.length):100)+'%','Áreas operacionais')+c('#ef4444','alert',ab,'Ocorrências abertas')+c('#e9b949','tools',at,'Em atendimento')+c('#3b82f6','calc',rs,'Chamados resolvidos (24h)')+'</div></div>'; }
function sectorCard(days){ days=days||7; var since=Date.now()-days*DAY, by={}, tot=0; S.occ.forEach(function(o){ if(o.created>=since){ by[o.cat]=(by[o.cat]||0)+1; tot++; } });
  var ks=Object.keys(by).sort(function(a,b){return by[b]-by[a];}).slice(0,6);
  return '<div class="pn"><h3>Ocorrências por setor <small>(últimos '+days+' dias)</small></h3>'+(ks.map(function(k){ var p=Math.round(by[k]*100/tot); return '<div class="sb" style="--c:'+CAT_C[k]+'"><span>'+esc(k)+'</span><div class="tr"><span style="width:'+p+'%"></span></div><b>'+p+'%</b></div>'; }).join('')||'<div class="empty">Sem ocorrências no período.</div>')+'</div>'; }
function flowCard(){ var now=Date.now(), a=flowSeries(now), b=flowSeries(now-DAY), sa=a.reduce(function(s,x){return s+x;},0), sb=b.reduce(function(s,x){return s+x;},0), pct=Math.round((sa-sb)*100/Math.max(sb,1));
  var mx=Math.max.apply(null,a)*1.1, W=300, H=96, pts=a.map(function(v,i){ return [i*W/23, H-6-(v/mx)*(H-14)]; });
  var line=pts.map(function(p,i){return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' ');
  var dots=pts.filter(function(p,i){return i%3===2;}).map(function(p){return '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="2.6" fill="#f7d77a"/>';}).join('');
  return '<div class="pn"><h3>Fluxo operacional <small>(últimas 24h · estimativa)</small></h3><div class="flow"><svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9b949" stop-opacity=".55"/><stop offset="1" stop-color="#e9b949" stop-opacity="0"/></linearGradient></defs>'+
    [24,48,72].map(function(y){return '<line x1="0" x2="'+W+'" y1="'+y+'" y2="'+y+'" stroke="rgba(148,163,184,.12)"/>';}).join('')+'<path d="'+line+' L'+W+' '+H+' L0 '+H+'z" fill="url(#fg)"/><path d="'+line+'" fill="none" stroke="#f7d77a" stroke-width="2.2" vector-effect="non-scaling-stroke"/>'+dots+'</svg>'+
    '<div class="fx"><b>'+num(sa)+'</b><small>pessoas</small><div class="up" style="color:'+(pct>=0?'#22c55e':'#ef4444')+'">'+(pct>=0?'▲ +':'▼ ')+pct+'%</div><small>vs. dia anterior</small></div></div></div>'; }

function vMapa(){ return '<div class="mapgrid">'+mapHTML()+detailPanel()+'</div><div class="cards4">'+legendCard()+indCard()+sectorCard()+flowCard()+'</div>'; }

/* ---------- visão geral ---------- */
function kp(c,icon,t,v,s){ return '<div class="kp" style="--c:'+c+'"><div class="t">'+ic(icon)+t+'</div><b>'+v+'</b><small>'+s+'</small></div>'; }
function vVisao(){
  var o=openOcc(), cr=o.filter(function(x){return x.prio==='Crítica';}).length, res=S.occ.filter(function(x){return x.status==='Resolvida'&&x.resolved;});
  var avg=res.length?res.reduce(function(s,x){return s+(x.resolved-x.created);},0)/res.length/HOUR:0;
  var inSla=res.length?Math.round(res.filter(function(x){return slaLeft(x)>=0;}).length*100/res.length):100;
  var venc=S.equip.filter(function(e){return equipStatus(e).left<0;}).length, rp=roundStats();
  var floors=S.floors.map(function(f){ var ar=S.areas.filter(function(a){return a.floorId===f.id;}), ok=ar.filter(function(a){var k=areaStatus(a.id).k;return k==='Operacional'||k==='Manutenção programada';}).length, p=ar.length?Math.round(ok*100/ar.length):100;
    return '<div class="row" data-a="gofloor" data-id="'+f.id+'" style="cursor:pointer">'+ic('layers')+'<div class="grow"><b>'+esc(f.name)+'</b><div class="bar" style="margin-top:6px"><span style="width:'+p+'%"></span></div></div><b>'+p+'%</b></div>'; }).join('');
  var att=S.areas.map(function(a){return {a:a,st:areaStatus(a.id)};}).filter(function(x){return x.st.n;}).sort(function(x,y){return ['Crítico','Pendente','Atenção','Em atendimento'].indexOf(x.st.k)-['Crítico','Pendente','Atenção','Em atendimento'].indexOf(y.st.k);}).slice(0,6)
    .map(function(x){ return '<div class="row" data-a="area" data-id="'+x.a.id+'" style="cursor:pointer"><span class="bd" style="--c:'+x.st.c+'">'+x.st.n+'</span><div class="grow"><b>'+esc(x.a.name)+'</b><div class="s">'+esc(fname(x.a.floorId))+' · '+x.st.k+'</div></div>'+ic('chevr')+'</div>'; }).join('')||'<div class="empty">Todas as áreas operacionais.</div>';
  var recent=S.occ.slice().sort(function(a,b){return b.updated-a.updated;}).slice(0,6).map(function(x){ return '<div class="row" data-a="occ" data-id="'+x.id+'" style="cursor:pointer"><span class="bd" style="--c:'+STATUS_C[x.status]+'">'+x.status+'</span><div class="grow"><b>'+esc(x.title)+'</b><div class="s">'+esc(aname(x.areaId))+' · '+ago(x.updated)+'</div></div></div>'; }).join('');
  return viewHead('home','Visão Geral','Resumo da operação do shopping em tempo real.','<button class="btn" data-a="copyreport">'+ic('copy')+'Copiar resumo do dia</button>')+
    '<div class="kpis">'+kp('#ef4444','alert','Ocorrências abertas',o.length,cr+' crítica(s)')+kp('#e9b949','clock','Tempo médio de solução',res.length?fmtH(avg):'—',res.length+' chamados resolvidos')+kp('#22c55e','check','Dentro do SLA',inSla+'%','dos chamados resolvidos')+
    kp('#a855f7','calc','Manutenções vencidas',venc,S.equip.length+' equipamentos')+kp('#3b82f6','list','Ronda de hoje',rp.pct+'%',rp.nok+' problema(s) encontrados')+'</div>'+
    '<div class="g2"><div class="pn"><h3>Situação por piso</h3>'+floors+'</div><div class="pn"><h3>Áreas que precisam de atenção</h3>'+att+'</div>'+sectorCard(7)+flowCard()+'<div class="pn"><h3>Atividade recente</h3>'+recent+'</div>'+prevMini()+'</div>';
}
function prevMini(){ var l=S.equip.map(function(e){return {e:e,st:equipStatus(e)};}).sort(function(a,b){return a.st.left-b.st.left;}).slice(0,5);
  return '<div class="pn"><h3>Próximas manutenções</h3>'+l.map(function(x){ return '<div class="row" data-a="editequip" data-id="'+x.e.id+'" style="cursor:pointer"><span class="bd" style="--c:'+x.st.c+'">'+(x.st.left<0?Math.abs(x.st.left)+'d atraso':x.st.left===0?'hoje':'em '+x.st.left+'d')+'</span><div class="grow"><b>'+esc(x.e.name)+'</b><div class="s">'+esc(aname(x.e.areaId))+'</div></div></div>'; }).join('')+'</div>'; }

/* ---------- listas de ocorrências ---------- */
function occCard(o){
  var c=PRIO_C[o.prio], left=slaLeft(o), open=isOpen(o);
  var acts = o.status==='Aberta' ? '<button class="btn sm g" data-a="setst" data-id="'+o.id+'" data-v="Em andamento">'+ic('users')+'Acionar equipe</button>' : o.status==='Em andamento' ? '<button class="btn sm g" data-a="setst" data-id="'+o.id+'" data-v="Resolvida">'+ic('check')+'Concluir</button>' : '<button class="btn sm" data-a="setst" data-id="'+o.id+'" data-v="Aberta">Reabrir</button>';
  return '<div class="oc" style="--c:'+c+'"><div class="ic">'+ic(CAT_I[o.cat])+'</div><div class="grow"><div><span class="bd" style="--c:'+c+'">'+o.prio+'</span><span class="bd o" style="--c:'+STATUS_C[o.status]+'">'+o.status+'</span>'+(o.demo?'<span class="bd o" style="--c:#e9b949">SIMULADO</span>':'')+'</div>'+
    '<div class="tt" style="margin-top:6px">'+esc(o.title)+'</div><div class="mt">'+esc(fname((area(o.areaId)||{}).floorId))+' · '+esc(aname(o.areaId))+' · '+esc(o.cat)+' · '+esc(o.resp||'sem equipe')+'</div>'+
    '<div class="mt">Aberto '+fshort(o.created)+' · '+(open?(left<0?'<b style="color:#ef4444">SLA estourado há '+fmtH(-left/HOUR)+'</b>':'SLA restante '+fmtH(left/HOUR)):(o.resolved?'resolvido '+fshort(o.resolved)+(left>=0?' · <span style="color:#22c55e">dentro do SLA</span>':' · <span style="color:#ef4444">fora do SLA</span>'):''))+'</div>'+
    '<div class="ac">'+acts+'<button class="btn sm" data-a="occ" data-id="'+o.id+'">Ver chamado</button><button class="btn sm" data-a="showmap" data-id="'+o.id+'">'+ic('map')+'Ver no mapa</button></div></div></div>'; }
function filterList(list){
  var f=ui.fStatus, q=ui.q.trim().toLowerCase();
  return list.filter(function(o){
    if(f==='abertas'&&!isOpen(o)) return false; if(f==='andamento'&&o.status!=='Em andamento') return false; if(f==='resolvidas'&&isOpen(o)) return false; if(f==='criticas'&&(o.prio!=='Crítica'||!isOpen(o))) return false;
    if(q&&(o.title+' '+aname(o.areaId)+' '+o.cat+' '+o.resp+' '+o.desc).toLowerCase().indexOf(q)<0) return false; return true;
  }).sort(function(a,b){ if(isOpen(a)!==isOpen(b)) return isOpen(a)?-1:1; return isOpen(a)?bySev(a,b):b.updated-a.updated; });
}
function chipsHTML(){ return '<div class="chips">'+[['abertas','Em aberto'],['criticas','Críticas'],['andamento','Em atendimento'],['resolvidas','Resolvidas'],['todas','Todas']].map(function(c){ return '<button class="chip'+(ui.fStatus===c[0]?' on':'')+'" data-a="fst" data-id="'+c[0]+'">'+c[1]+'</button>'; }).join('')+'</div>'; }
function vOcc(){ var l=filterList(S.occ); return viewHead('alert','Ocorrências','Registro e acompanhamento de todos os chamados.','<button class="btn g" data-a="newocc">'+ic('plus')+'Nova ocorrência</button>')+
  '<input class="search" id="q" placeholder="Buscar por título, área, categoria, equipe…" value="'+esc(ui.q)+'">'+chipsHTML()+'<div>'+(l.map(occCard).join('')||'<div class="empty">Nenhuma ocorrência neste filtro.</div>')+'</div>'; }
function vEmerg(){ var l=openOcc().filter(function(o){return o.prio==='Crítica'||o.prio==='Alta';}).sort(bySev), st=openOcc().filter(function(o){return slaLeft(o)<0;}).length;
  return viewHead('siren','Central de Emergências','Ocorrências críticas e de alta prioridade em aberto.','<button class="btn g" data-a="newocc" data-v="Crítica">'+ic('plus')+'Registrar emergência</button>')+
    '<div class="kpis">'+kp('#ef4444','alert','Críticas',l.filter(function(o){return o.prio==='Crítica';}).length,'em aberto')+kp('#f97316','alert','Alta prioridade',l.filter(function(o){return o.prio==='Alta';}).length,'em aberto')+kp('#e9b949','timer','SLA estourado',st,'chamados abertos')+kp('#3b82f6','users','Equipes acionadas',l.filter(function(o){return o.status==='Em andamento';}).length,'em atendimento')+kp('#22c55e','clock','Prazo crítico',fmtH(SLA_H['Crítica']),'para atendimento')+'</div>'+
    (l.map(occCard).join('')||'<div class="pn g okpanel">'+ic('check')+'<h3 style="margin:12px 0 4px">Nenhuma emergência em aberto</h3></div>'); }
function vCat(key){ var cv=CATVIEW[key]; if(!cv){ ui.view='mapa'; return vMapa(); }
  var all=S.occ.filter(function(o){ return cv.area ? cv.area.test(aname(o.areaId)) : cv.cats.indexOf(o.cat)>=0; });
  var ab=all.filter(function(o){return o.status==='Aberta';}).length, at=all.filter(function(o){return o.status==='Em andamento';}).length, rs=all.filter(function(o){return o.status==='Resolvida'&&o.resolved>Date.now()-7*DAY;}).length;
  var extra='';
  if(cv.item){ var r=roundStats(cv.item); extra='<div class="pn" style="margin-bottom:14px"><h3>Ronda de hoje – '+esc(cv.item)+' <small>'+r.d+' de '+r.t+' áreas verificadas'+(r.nok?' · '+r.nok+' com problema':'')+'</small></h3><div class="bar"><span style="width:'+r.pct+'%"></span></div><div style="margin-top:10px"><button class="btn sm" data-a="go" data-id="rondas">'+ic('list')+'Abrir rondas</button></div></div>'; }
  if(cv.area){ var ar=S.areas.filter(function(a){return cv.area.test(a.name);}); extra='<div class="pn" style="margin-bottom:14px"><h3>Áreas</h3>'+ar.map(function(a){var st=areaStatus(a.id);return '<div class="row" data-a="area" data-id="'+a.id+'" style="cursor:pointer"><span class="bd" style="--c:'+st.c+'">'+st.k+'</span><b class="grow">'+esc(a.name)+'</b>'+ic('chevr')+'</div>';}).join('')+'</div>'; }
  var l=filterList(all);
  return viewHead(cv.i,cv.t,cv.d,'<button class="btn g" data-a="newocc" data-cat="'+esc(cv.cats?cv.cats[0]:'')+'">'+ic('plus')+'Nova ocorrência</button>')+
    '<div class="kpis" style="grid-template-columns:repeat(3,1fr)">'+kp('#ef4444','alert','Abertas',ab,'aguardando equipe')+kp('#e9b949','tools','Em atendimento',at,'equipe acionada')+kp('#22c55e','check','Resolvidas',rs,'últimos 7 dias')+'</div>'+extra+chipsHTML()+(l.map(occCard).join('')||'<div class="empty">Nenhuma ocorrência neste filtro.</div>'); }

/* ---------- manutenção / equipamentos ---------- */
function equipCard(e){ var st=equipStatus(e); return '<div class="oc" style="--c:'+st.c+'"><div class="ic">'+ic('layers')+'</div><div class="grow"><span class="bd" style="--c:'+st.c+'">'+st.k+'</span><div class="tt" style="margin-top:6px">'+esc(e.name)+'</div><div class="mt">'+esc(aname(e.areaId))+' · a cada '+e.freq+' dias · '+esc(e.resp||'')+'</div><div class="mt">Última: '+fday(e.last)+' · Próxima: '+fday(st.next)+(st.left<0?' <b style="color:#ef4444">('+Math.abs(st.left)+' dias de atraso)</b>':'')+'</div><div class="ac"><button class="btn sm g" data-a="doequip" data-id="'+e.id+'">'+ic('check')+'Registrar execução</button><button class="btn sm" data-a="editequip" data-id="'+e.id+'">Editar</button></div></div></div>'; }
function vPrev(){ var l=S.equip.slice().sort(function(a,b){return equipStatus(a).left-equipStatus(b).left;}), v=0,b=0,d=0; l.forEach(function(e){var x=equipStatus(e).left; if(x<0)v++; else if(x<=3)b++; else d++;});
  return viewHead('calc','Manutenção Preventiva','Cronograma de manutenção dos equipamentos.','<button class="btn g" data-a="newequip">'+ic('plus')+'Novo equipamento</button>')+'<div class="kpis" style="grid-template-columns:repeat(3,1fr)">'+kp('#ef4444','alert','Vencidas',v,'precisam de execução')+kp('#a855f7','calc','Vencem em até 3 dias',b,'manutenção programada')+kp('#22c55e','check','Em dia',d,'equipamentos')+'</div>'+(l.map(equipCard).join('')||'<div class="empty">Nenhum equipamento.</div>'); }
function vEquip(){ var h=viewHead('layers','Equipamentos','Inventário de ativos por piso e área.','<button class="btn g" data-a="newequip">'+ic('plus')+'Novo equipamento</button>');
  return h+S.floors.map(function(f){ var eq=S.equip.filter(function(e){var a=area(e.areaId);return a&&a.floorId===f.id;}); if(!eq.length) return ''; return '<div class="pn" style="margin-bottom:14px"><h3>'+esc(f.name)+' <small>'+eq.length+' equipamento(s)</small></h3><table class="t"><tr><th>Equipamento</th><th>Área</th><th>Status</th><th>Próxima</th></tr>'+eq.map(function(e){var st=equipStatus(e);return '<tr data-a="editequip" data-id="'+e.id+'" style="cursor:pointer"><td><b>'+esc(e.name)+'</b></td><td>'+esc(aname(e.areaId))+'</td><td><span class="bd" style="--c:'+st.c+'">'+st.k+'</span></td><td>'+fday(st.next)+'</td></tr>';}).join('')+'</table></div>'; }).join(''); }

/* ---------- rondas ---------- */
function vRondas(){ var r=S.rounds[todayKey()]||{}, rp=roundStats();
  var cards=S.floors.map(function(f){ var ar=S.areas.filter(function(a){return a.floorId===f.id;}); return '<h3 style="margin:18px 0 10px">'+esc(f.name)+'</h3><div class="g3">'+ar.map(function(a){ var m=r[a.id]||{}, all=S.items.every(function(it){return m[it];});
    return '<div class="pn"><div style="display:flex;align-items:center;gap:8px">'+ic(areaIcon(a.name))+'<b class="grow">'+esc(a.name)+'</b>'+(all?'<span class="bd" style="--c:#22c55e">OK</span>':'<button class="btn sm" data-a="ckall" data-id="'+a.id+'">Tudo OK</button>')+'</div><div class="chips" style="margin:10px 0 0">'+S.items.map(function(it){var v=m[it];return '<button class="tg '+(v||'')+'" data-a="ck" data-id="'+a.id+'" data-v="'+esc(it)+'">'+(v==='ok'?'✓ ':v==='nok'?'✕ ':'')+esc(it)+'</button>';}).join('')+'</div></div>'; }).join('')+'</div>'; }).join('');
  return viewHead('list','Rondas Diárias','Checklist de condições dos ambientes – '+fday(Date.now())+'.')+'<div class="pn g"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><b>'+rp.d+' de '+rp.t+' verificações</b><span>'+rp.pct+'%'+(rp.nok?' · <span style="color:#fca5a5">'+rp.nok+' problema(s)</span>':'')+'</span></div><div class="bar"><span style="width:'+rp.pct+'%"></span></div><p class="s" style="margin:10px 0 0">Toque em cada item: 1× OK · 2× problema (abre uma ocorrência) · 3× limpar.</p></div>'+cards; }

/* ---------- equipes ---------- */
function vEquipes(){ return viewHead('users','Equipes Operacionais','Carga de trabalho e desempenho por equipe.','<button class="btn" data-a="settings">'+ic('gear')+'Editar equipes</button>')+'<div class="g3">'+S.team.map(function(t){
  var l=S.occ.filter(function(o){return o.resp===t;}), ab=l.filter(function(o){return o.status==='Aberta';}), at=l.filter(function(o){return o.status==='Em andamento';}), rs=l.filter(function(o){return o.status==='Resolvida'&&o.resolved;});
  var avg=rs.length?rs.reduce(function(s,o){return s+o.resolved-o.created;},0)/rs.length/HOUR:0, eq=S.equip.filter(function(e){return e.resp===t;}).length;
  var stt = at.length?['#3b82f6','Em atendimento']:ab.length?['#f97316','Chamados aguardando']:['#22c55e','Disponível'];
  return '<div class="pn"><div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div class="ic" style="width:40px;height:40px;border-radius:10px;background:rgba(233,185,73,.1);display:flex;align-items:center;justify-content:center;color:#e9b949">'+ic('users')+'</div><div class="grow"><b>'+esc(t)+'</b><div class="s"><span style="color:'+stt[0]+'">● '+stt[1]+'</span></div></div></div>'+
    '<div class="ind" style="grid-template-columns:repeat(3,1fr)"><div style="--c:#ef4444"><b>'+ab.length+'</b><small>Abertas</small></div><div style="--c:#e9b949"><b>'+at.length+'</b><small>Em atend.</small></div><div style="--c:#22c55e"><b>'+rs.length+'</b><small>Resolvidas</small></div></div>'+
    '<p class="s" style="margin:10px 0 0">Tempo médio: '+(rs.length?fmtH(avg):'—')+' · '+eq+' equipamento(s) sob responsabilidade</p>'+
    ab.concat(at).sort(bySev).slice(0,3).map(function(o){return '<div class="row" data-a="occ" data-id="'+o.id+'" style="cursor:pointer"><span class="bd" style="--c:'+PRIO_C[o.prio]+'">'+o.prio+'</span><span class="grow">'+esc(o.title)+'</span></div>';}).join('')+'</div>'; }).join('')+'</div>'; }

/* ---------- relatórios ---------- */
function vRel(){ var res=S.occ.filter(function(o){return o.status==='Resolvida'&&o.resolved;});
  var rows=CATS.map(function(c){ var l=S.occ.filter(function(o){return o.cat===c;}); if(!l.length) return ''; var r=l.filter(function(o){return o.status==='Resolvida'&&o.resolved;}), avg=r.length?r.reduce(function(s,o){return s+o.resolved-o.created;},0)/r.length/HOUR:0, sla=r.length?Math.round(r.filter(function(o){return slaLeft(o)>=0;}).length*100/r.length)+'%':'—';
    return '<tr><td><span style="color:'+CAT_C[c]+'">●</span> '+c+'</td><td>'+l.length+'</td><td>'+l.filter(isOpen).length+'</td><td>'+(r.length?fmtH(avg):'—')+'</td><td>'+sla+'</td></tr>'; }).join('');
  var top=S.areas.map(function(a){return {a:a,n:S.occ.filter(function(o){return o.areaId===a.id;}).length};}).filter(function(x){return x.n;}).sort(function(a,b){return b.n-a.n;}).slice(0,6);
  var mx=top.length?top[0].n:1;
  return viewHead('chart','Relatórios','Indicadores para acompanhamento da eficiência operacional.','<button class="btn g" data-a="copyreport">'+ic('copy')+'Copiar resumo</button><button class="btn" data-a="copycsv">'+ic('copy')+'Copiar planilha (CSV)</button>')+
    '<div class="g2"><div class="pn" style="grid-column:1/-1"><h3>Desempenho por categoria</h3><div style="overflow:auto"><table class="t"><tr><th>Categoria</th><th>Total</th><th>Em aberto</th><th>Tempo médio</th><th>Dentro do SLA</th></tr>'+rows+'</table></div></div>'+
    '<div class="pn"><h3>Áreas com mais ocorrências</h3>'+top.map(function(x){return '<div class="sb" style="--c:#e9b949;grid-template-columns:150px 1fr 30px"><span>'+esc(x.a.name)+'</span><div class="tr"><span style="width:'+(x.n*100/mx)+'%"></span></div><b>'+x.n+'</b></div>';}).join('')+'</div>'+sectorCard(30)+'</div>'; }

/* ---------- simulação ---------- */
var SCEN = [
  {k:'eletrica',t:'Queda de energia parcial',i:'zap',d:'Disjuntores desarmam em áreas do térreo.',occ:[['Queda de energia em lojas','t9','Elétrica','Crítica'],['Iluminação apagada no corredor','t8','Elétrica','Alta']]},
  {k:'chuva',t:'Chuva forte',i:'drop',d:'Infiltrações e piso molhado nas entradas.',occ:[['Infiltração no teto','t5','Hidráulica','Alta'],['Piso molhado na entrada','t3','Limpeza','Média'],['Alagamento no estacionamento','t2','Hidráulica','Alta']]},
  {k:'pico',t:'Pico de movimento',i:'users',d:'Fim de semana com grande fluxo na praça de alimentação.',occ:[['Mesas sujas acumuladas','s1','Limpeza','Média'],['Fila excessiva nos banheiros','s8','Limpeza','Baixa'],['Temperatura elevada','s1','Climatização','Alta']]},
  {k:'seg',t:'Alarme de incêndio',i:'siren',d:'Detector aciona alarme no cinema.',occ:[['Alarme de incêndio acionado','t10','Segurança','Crítica']]}
];
function vSim(){ var d=S.occ.filter(function(o){return o.demo;}).length;
  return viewHead('spark','Simulação Inteligente','Teste como a central responde a cenários. As ocorrências simuladas não são salvas.',d?'<button class="btn dg" data-a="clearsim">'+ic('trash')+'Limpar simulação ('+d+')</button>':'')+
    '<div class="g2">'+SCEN.map(function(s){ return '<div class="pn g"><div style="display:flex;gap:12px;align-items:center"><div class="ic" style="width:44px;height:44px;border-radius:12px;background:rgba(233,185,73,.12);display:flex;align-items:center;justify-content:center;color:#e9b949">'+ic(s.i)+'</div><div class="grow"><b style="font-size:15px">'+s.t+'</b><div class="s">'+s.d+'</div></div></div><div class="s" style="margin:10px 0">Gera '+s.occ.length+' ocorrência(s): '+s.occ.map(function(o){return esc(o[0]);}).join(', ')+'.</div><button class="btn g" data-a="scen" data-id="'+s.k+'">'+ic('play')+'Simular cenário</button></div>'; }).join('')+'</div>'+
    '<div class="pn" style="margin-top:14px"><h3>Modo demonstração</h3><p class="s" style="margin:0 0 10px">Com o modo demonstração ligado (botão no topo), uma nova ocorrência simulada aparece a cada 25 segundos.</p><button class="btn'+(ui.demo?' g':'')+'" data-a="demo">'+ic('monitor')+(ui.demo?'Desligar demonstração':'Ligar demonstração')+'</button></div>'; }

/* Laboratório Digital — cenários acadêmicos, nenhuma telemetria real */
var lab = {visualMode:'premium',floor:'all',horizon:0,xray:false,layer:'riscos',scenario:'energia',choice:'imediata',budget:60000,challenge:false,angle:0,yaw:-28,pitch:58,panX:0,panY:0,zoom:1};
function labOpen(){return S.occ.filter(function(o){return isOpen(o);});}
function labStats(fid){var areas=S.areas.filter(function(a){return !fid||a.floorId===fid;}), ids={};areas.forEach(function(a){ids[a.id]=1;});var incidents=labOpen().filter(function(o){return ids[o.areaId];});return {areas:areas,incidents:incidents,critical:incidents.filter(function(o){return o.prio==='Crítica'||o.prio==='Alta';}).length,overdue:incidents.filter(function(o){return slaLeft(o)<0;}).length};}
function labFuture(){var h=lab.horizon, st=labStats(lab.floor==='all'?null:lab.floor);var unresolved=st.incidents.filter(function(o){return o.status!=='Em andamento';}).length;return {exposure:Math.min(100,Math.round(12+st.critical*11+st.overdue*7+h*(unresolved*1.5+1.9))),pending:st.incidents.length+Math.round(h*unresolved/16),critical:st.critical+Math.floor(h*st.critical/12)};}
function labTone(n){return n>=65?'danger':n>=35?'warning':'ok';}
function labScenario(){return {energia:{title:'Falha elétrica',cost:14500,delay:42000,urgent:91,impact:'iluminação e operações conectadas',tasks:['Isolar a área afetada','Acionar equipe elétrica','Verificar alimentação de emergência']},clima:{title:'Sobrecarga de climatização',cost:8800,delay:23500,urgent:68,impact:'conforto térmico e consumo',tasks:['Inspecionar equipamentos','Realocar equipe técnica','Acompanhar temperaturas']},agua:{title:'Vazamento hidráulico',cost:6200,delay:19800,urgent:74,impact:'circulação e áreas próximas',tasks:['Isolar vazamento','Sinalizar piso','Inspecionar tubulações']},incendio:{title:'Alarme de incêndio',cost:21000,delay:65000,urgent:98,impact:'segurança e acesso às áreas',tasks:['Aplicar protocolo real de emergência','Acionar responsáveis e serviços de emergência','Verificar rotas homologadas']}}[lab.scenario];}
function labMoney(x){return 'R$ '+Math.round(x).toLocaleString('pt-BR');}
function labBuilding(){
  var premium=lab.visualMode==='premium';
  var ids=S.floors.slice(0,2).map(function(f){return f.id;});
  return '<div class="maquette-shell">'+
  '<div class="maquette-view-tabs"><button data-a="labvisual" data-id="premium" class="'+(premium?'active':'')+'">✦ Maquete colorida</button><button data-a="labvisual" data-id="modelo" class="'+(!premium?'active':'')+'">▧ Modelo 3D giratório</button><span>'+(premium?'Imagem de referência interativa':'Geometria demonstrativa navegável')+'</span></div>'+
  '<div class="maquette-bar"><span class="maquette-led"></span><b>'+(premium?'MAQUETE COLORIDA · VISÃO DIGITAL':'GÊMEO DIGITAL · MODELO 3D')+'</b><span class="maquette-tag">DEMONSTRAÇÃO ARQUITETÔNICA</span></div>'+
  (premium?'<div class="maquette-stage premium-stage" id="lab3d-stage"><canvas id="labpremium-main" aria-label="Maquete colorida interativa do Capim Dourado, com os dois andares e pontos clicáveis"></canvas><div class="maquette-stage-help">Arraste para explorar · Use a roda do mouse para aproximar · Clique nas lojas destacadas</div><div class="maquette-stage-status" id="lab3d-selected" hidden></div></div>':
  '<div class="maquette-stage" id="lab3d-stage"><canvas id="lab3d-main" aria-label="Modelo geométrico 3D navegável"></canvas><div class="maquette-stage-help">Arraste para girar · Roda do mouse para zoom · Toque nos volumes</div><div class="maquette-stage-status" id="lab3d-selected" hidden></div></div>')+
  '<div class="maquette-options"><button data-a="labfloor" data-id="all" class="'+(lab.floor==='all'?'active':'')+'">Dois pisos</button>'+S.floors.slice(0,2).map(function(f,i){return '<button data-a="labfloor" data-id="'+esc(f.id)+'" class="'+(lab.floor===f.id?'active':'')+'">'+(i?'Piso superior':'Térreo')+'</button>';}).join('')+'<button data-a="labreset">↺ Centralizar</button><button data-a="labzoom" data-v="1">+ Zoom</button><button data-a="labzoom" data-v="-1">− Zoom</button></div>'+
  '<div class="lab-split-wrap"><div class="lab-section-head"><h3>Explore cada pavimento</h3><span>'+(premium?'Visualizações ampliadas do conceito colorido':'Maquetes geométricas independentes')+'</span></div><div class="maquette-split">'+S.floors.slice(0,2).map(function(f,i){return '<div class="maquette-split-card"><div class="maquette-split-title"><b>'+(i?'PARTE DE CIMA':'PARTE DE BAIXO')+'</b><span>'+esc(f.name)+'</span></div><div class="maquette-preview '+(premium?'premium-preview':'')+'"><canvas id="'+(premium?'labpremium-piso':'lab3d-piso')+i+'" aria-label="'+(premium?'Vista colorida':'Modelo geométrico')+' do '+esc(f.name)+'"></canvas></div><button data-a="labfloor" data-id="'+esc(f.id)+'">Ver este piso no mapa principal →</button></div>';}).join('')+'</div></div></div>';
}
function labRadar(){var groups={},count=0;labOpen().forEach(function(o){var ar=area(o.areaId);if(!ar)return;var key=ar.id;groups[key]=groups[key]||{ar:ar,inc:[],late:0};groups[key].inc.push(o);if(slaLeft(o)<0)groups[key].late++;});var vals=Object.keys(groups).map(function(k){var x=groups[k];x.score=Math.min(100,x.inc.reduce(function(n,o){return n+(o.prio==='Crítica'?37:o.prio==='Alta'?24:12);},0)+x.late*14+(x.inc.length>1?18:0));return x;}).sort(function(a,b){return b.score-a.score;}).slice(0,5);return '<div class="lab-section-head"><h3>Radar de riscos combinados</h3><span>Modelo demonstrativo, baseado nos chamados cadastrados</span></div>'+(vals.length?vals.map(function(x){return '<button class="lab-risk" data-a="labarea" data-id="'+x.ar.id+'"><span class="lab-risk-mark '+labTone(x.score)+'">'+x.score+'</span><span class="lab-grow"><b>'+esc(x.ar.name)+'</b><small>'+x.inc.length+' ocorrência(s) · '+x.late+' prazo(s) vencido(s)'+(x.inc.length>1?' · combinação detectada':'')+'</small></span><span class="lab-meter"><i style="width:'+x.score+'%"></i></span></button>';}).join(''):'<p class="lab-muted">Nenhuma ocorrência em aberto para correlacionar.</p>');}
function labHistory(){var groups={};S.occ.forEach(function(o){if(o.demo)return;var k=o.areaId+'|'+o.cat;groups[k]=groups[k]||{count:0,area:o.areaId,cat:o.cat};groups[k].count++;});var rep=Object.keys(groups).map(function(k){return groups[k];}).filter(function(x){return x.count>=2;}).sort(function(a,b){return b.count-a.count;}).slice(0,4);return '<div class="lab-section-head"><h3>Memória de falhas</h3><span>Recorrências por área e categoria</span></div>'+(rep.length?rep.map(function(x){return '<div class="lab-memory"><span>'+ic('refresh')+'</span><div><b>'+esc(aname(x.area))+'</b><small>'+esc(x.cat)+' · '+x.count+' registros no histórico</small></div></div>';}).join(''):'<p class="lab-muted">Ainda não há ocorrências repetidas suficientes.</p>');}
function labRecommendations(){var a=labOpen().slice().sort(function(x,y){return (sev(y)*25+(slaLeft(y)<0?30:0))-(sev(x)*25+(slaLeft(x)<0?30:0));}).slice(0,3);return a.length?a.map(function(o,i){return '<button class="lab-advice" data-a="labocc" data-id="'+o.id+'"><span class="lab-index">0'+(i+1)+'</span><span><b>'+esc(o.title)+'</b><small>'+esc(aname(o.areaId))+' · '+esc(o.prio)+' · '+(slaLeft(o)<0?'SLA vencido':'SLA em acompanhamento')+'</small></span>'+ic('chevr')+'</button>';}).join(''):'<p class="lab-muted">Nenhuma ocorrência aberta exige priorização.</p>';}
function labCompare(){var sc=labScenario(), early=lab.choice==='imediata';var cost=early?sc.cost:sc.delay;var risk=early?Math.max(8,sc.urgent-62):Math.min(100,sc.urgent+Math.round(lab.horizon*0.7));return '<div class="lab-section-head"><h3>Universo paralelo de decisões</h3><span>Custos e impactos hipotéticos para demonstração</span></div><div class="lab-pills">'+[['energia','Falha elétrica'],['clima','Climatização'],['agua','Vazamento'],['incendio','Alarme de incêndio']].map(function(x){return '<button data-a="labscenario" data-id="'+x[0]+'" class="'+(lab.scenario===x[0]?'active':'')+'">'+x[1]+'</button>';}).join('')+'</div><div class="lab-two">'+[['imediata','Intervenção imediata',sc.cost,Math.max(8,sc.urgent-62)],['adiada','Adiar intervenção',sc.delay,Math.min(100,sc.urgent+Math.round(lab.horizon*.7))]].map(function(x){return '<button data-a="labchoice" data-id="'+x[0]+'" class="lab-option '+(lab.choice===x[0]?'chosen':'')+'"><span>'+ic(x[0]==='imediata'?'check':'clock')+' '+x[1]+'</span><strong>'+labMoney(x[2])+'</strong><small>Índice relativo de risco: '+x[3]+'/100</small><div class="lab-meter"><i style="width:'+x[3]+'%"></i></div></button>';}).join('')+'</div><p class="lab-compare-note">'+(early?'A resposta antecipada reduz o impacto hipotético sobre '+sc.impact+'.':'O adiamento pode ampliar danos e interrupções em '+sc.impact+'.')+' Estes valores não são orçamentos reais.</p>';
}
function labChallenge(){var sc=labScenario(), leftover=lab.budget-(lab.choice==='imediata'?sc.cost:sc.delay), score=Math.max(0,Math.min(100,Math.round(100-(lab.choice==='adiada'?38:7)-(leftover<0?35:0)-lab.horizon*1.2)));return '<div class="lab-section-head"><h3>Desafio do gestor</h3><span>Modo de decisão com orçamento fictício</span></div><div class="lab-budget"><label for="lab-budget-range">Orçamento disponível</label><strong>'+labMoney(lab.budget)+'</strong></div><input id="lab-budget-range" class="lab-range" type="range" min="5000" max="100000" step="5000" value="'+lab.budget+'"><div class="lab-challenge-result"><div><span>Saldo após decisão</span><b class="'+(leftover<0?'lab-negative':'')+'">'+labMoney(leftover)+'</b></div><div><span>Pontuação simulada</span><b>'+score+'/100</b></div></div><p class="lab-muted">Escolha o cenário e a decisão no painel ao lado. A pontuação muda conforme o orçamento, a urgência e o tempo projetado.</p>';
}
/* ================= V5.2 — LABORATÓRIO: SIMULADOR DE CRISES "E SE…?" =================
   Teste de estresse do shopping: escolha um evento, ajuste as condições e veja a
   reação em cadeia, o índice de resiliência e o que fazer. Valores ilustrativos. */
var SIM_SCN={
  energia:{n:'Queda de energia',ic:'zap',c:'#facc15',d:'A concessionária corta o fornecimento no horário de funcionamento.',sev:62,rec:95,req:9,reach:1,cost:42000,gen:24,plan:16,
    chain:[[0,'Energia','Queda total no Térreo e na Praça de Alimentação','Elétrica'],[1,'Gerador','#GEN',''],[4,'Escadas e elevadores','Equipamentos param — risco de pessoas presas entre pavimentos','Elevadores/Escadas'],[10,'Climatização','Ar-condicionado desliga; a temperatura sobe cerca de 1 °C a cada 10 min','Climatização'],[18,'Lojas e caixas','Lojas ficam sem sistema de pagamento e rede','TI/Rede'],[30,'Estacionamento','Cancelas travadas e fila na saída','Segurança']],
    areas:['Escadas rolantes','Circulação central','Praça de alimentação','Casa de máquinas A.C','Estacionamento'],
    tips:['Priorizar resgate em elevadores e escadas rolantes','Abrir cancelas manualmente e orientar a saída de veículos']},
  chuva:{n:'Chuva forte e alagamento',ic:'drop',c:'#06b6d4',d:'Temporal de 80 mm em 1 hora sobre Palmas.',sev:52,rec:120,req:8,reach:.7,cost:26000,gen:0,plan:20,
    chain:[[0,'Cobertura','Infiltração na claraboia da Praça de Alimentação','Estrutura'],[6,'Circulação','Piso molhado nos corredores — risco de queda','Limpeza'],[15,'Estacionamento','Alagamento no estacionamento frontal','Segurança'],[22,'Elétrica','Umidade em quadros elétricos da doca','Elétrica'],[35,'Acessos','Acesso principal com fila e guarda-chuvas pingando','Limpeza']],
    areas:['Praça de alimentação','Corredor oeste','Estacionamento frontal','Doca e serviço','Acesso Principal'],
    tips:['Instalar tapetes absorventes e cavaletes em todos os acessos','Desligar preventivamente quadros expostos à água']},
  publico:{n:'Pico de público (Black Friday)',ic:'users',c:'#a855f7',d:'Fluxo três vezes maior que um sábado comum.',sev:44,rec:180,req:12,reach:1.2,cost:18000,gen:0,plan:22,
    chain:[[0,'Acessos','Fluxo de entrada 3× acima do normal no acesso principal','Segurança'],[20,'Estacionamento','Estacionamento lotado; fila chega à avenida','Segurança'],[35,'Praça de Alimentação','Mesas esgotadas e filas longas nos balcões','Outros'],[50,'Banheiros','Banheiros sobrecarregados e falta de insumos','Limpeza'],[70,'Limpeza','Lixeiras cheias em toda a circulação','Limpeza']],
    areas:['Acesso Principal','Estacionamento','Praça de alimentação','Banheiros femininos','Banheiros masculinos','Lojas âncora'],
    tips:['Reforçar orientadores de fluxo no acesso e no estacionamento','Aumentar a frequência de reposição nos banheiros']},
  calor:{n:'Falha do ar-condicionado no calor',ic:'thermo',c:'#f97316',d:'O chiller principal desarma num dia de 40 °C.',sev:48,rec:140,req:6,reach:.9,cost:21000,gen:0,plan:18,
    chain:[[0,'Casa de máquinas','Chiller principal desarma por sobrecarga','Climatização'],[15,'Praça de Alimentação','Temperatura passa de 30 °C','Climatização'],[25,'Cinema','Clientes reclamam nas salas do Cinemark','Climatização'],[40,'Público','Casos de mal-estar — brigada acionada','Segurança'],[60,'Lojas','Lojas começam a fechar as portas','Outros']],
    areas:['Casa de máquinas A.C','Praça de alimentação','Cinemark','Circulação central'],
    tips:['Distribuir água e abrir pontos de descanso climatizados','Acionar a manutenção do fabricante do chiller']},
  incendio:{n:'Alarme de incêndio',ic:'siren',c:'#ef4444',d:'Detector de fumaça dispara numa cozinha da Praça de Alimentação.',sev:74,rec:75,req:14,reach:1.1,cost:55000,gen:6,plan:28,
    chain:[[0,'Alarme','Detector de fumaça dispara numa cozinha','Segurança'],[2,'Brigada','Brigada confirma o foco e aciona os extintores','Segurança'],[5,'Evacuação','Evacuação parcial da Praça de Alimentação','Segurança'],[8,'Escadas e elevadores','Elevadores recolhidos; escadas rolantes paradas','Elevadores/Escadas'],[25,'Bombeiros','Corpo de Bombeiros vistoria a área','Segurança'],[60,'Retomada','Liberação gradual do pavimento','Outros']],
    areas:['Praça de alimentação','Lojas de alimentação norte','Escadas rolantes','Acesso Principal'],
    tips:['Conferir a contagem de pessoas nos pontos de encontro','Bloquear o acesso à cozinha até a vistoria']}
};
var SIM_PER={madrugada:{n:'Madrugada',pub:150,f:.1,cost:.05},manha:{n:'Manhã',pub:2500,f:.4,cost:.5},pico:{n:'Sábado à tarde',pub:9000,f:.8,cost:1},evento:{n:'Data especial',pub:16000,f:1,cost:1.8}};
var SIM_INT=[null,{n:'Leve',m:.7},{n:'Moderada',m:1},{n:'Severa',m:1.35}];
lab.sim={scn:'energia',int:2,per:'pico',staff:8,gen:true,plan:false,ran:false,step:0,timer:null,runs:[]};
function simCalc(){var s=lab.sim,sc=SIM_SCN[s.scn],p=SIM_PER[s.per],im=SIM_INT[s.int].m;
  var req=Math.round(sc.req*im*(.6+p.f*.5)),cov=Math.min(1,s.staff/req);
  var impact=sc.sev*im*(.75+p.f*.5),mit=(s.gen?sc.gen:0)+(s.plan?sc.plan:0)+(cov-.6)*35;
  var score=Math.max(5,Math.min(98,Math.round(100-impact+mit)));
  var rec=Math.round(sc.rec*im*(1.45-cov*.6)*(s.plan?.75:1)*(s.gen&&sc.gen?.7:1));
  var people=Math.round(p.pub*(.25+.25*s.int)*sc.reach/10)*10;
  var loss=Math.round(sc.cost*p.cost*im*rec/60/100)*100;
  var g=score>=80?['A','Preparado','#22c55e']:score>=60?['B','Aceitável','#84cc16']:score>=40?['C','Vulnerável','#f59e0b']:['D','Crítico','#ef4444'];
  var recs=[];
  if(cov<1)recs.push('Faltam <b>'+(req-s.staff)+' profissional(is)</b> para cobrir o evento — convoque a equipe de sobreaviso.');
  if(sc.gen&&!s.gen)recs.push('Mantenha o <b>gerador de emergência</b> testado e ativo: reduz o tempo de recuperação em cerca de 30%.');
  if(!s.plan)recs.push('Acione o <b>plano de contingência</b>: comunicação, rotas e responsáveis definidos antes da crise.');
  sc.tips.forEach(function(t){recs.push(t+'.');});
  var hit=sc.areas.map(function(n){return S.areas.find(function(a){return a.name.toLowerCase()===n.toLowerCase();});}).filter(Boolean);
  return {sc:sc,p:p,req:req,cov:cov,score:score,rec:rec,people:people,loss:loss,g:g,recs:recs,hit:hit};}
function simMoney(n){return 'R$ '+n.toLocaleString('pt-BR');}
function simChainTxt(s,sc,x){if(x[2]!=='#GEN')return x[2];return s.gen?'Gerador de emergência assume as cargas críticas em cerca de 15 segundos':'Sem gerador: só a iluminação de emergência por bateria (≈1 h)';}
function labSimHTML(){var s=lab.sim,r=simCalc(),sc=r.sc,timeK=s.plan?.8:1;
  var gauge=(function(){var R=52,C=2*Math.PI*R,f=r.score/100;return '<svg viewBox="0 0 130 130" class="sim-gauge"><circle cx="65" cy="65" r="'+R+'" class="bg"/><circle cx="65" cy="65" r="'+R+'" class="fg" style="stroke:'+r.g[2]+';stroke-dasharray:'+(C*f).toFixed(1)+' '+C.toFixed(1)+'"/><text x="65" y="62" class="n">'+(s.ran?r.score:'—')+'</text><text x="65" y="84" class="l">RESILIÊNCIA</text></svg>';})();
  var chain=sc.chain.map(function(x,i){var shown=s.ran&&i<s.step,mitig=(x[1]==='Gerador'&&s.gen);return '<li class="'+(shown?'on':'')+(mitig?' ok':'')+'" style="--d:'+i+'"><span class="t">T+'+Math.round(x[0]*timeK)+' min</span><span class="dot"></span><div><b>'+esc(x[1])+'</b><p>'+esc(simChainTxt(s,sc,x))+'</p></div></li>';}).join('');
  return '<div class="lab-section-head"><h3>Simulador de crises · “E se…?”</h3><span>Teste de estresse do shopping · valores ilustrativos</span></div>'+
  '<div class="sim-scn">'+Object.keys(SIM_SCN).map(function(k){var x=SIM_SCN[k];return '<button data-a="simscn" data-id="'+k+'" class="'+(s.scn===k?'active':'')+'" style="--c:'+x.c+'">'+ic(x.ic)+'<span>'+x.n+'</span></button>';}).join('')+'</div>'+
  '<p class="sim-desc" style="--c:'+sc.c+'">'+ic(sc.ic)+esc(sc.d)+'</p>'+
  '<div class="sim-ctrl">'+
    '<div><label>Intensidade</label><div class="sim-seg">'+[1,2,3].map(function(i){return '<button data-a="simint" data-v="'+i+'" class="'+(s.int===i?'active':'')+'">'+SIM_INT[i].n+'</button>';}).join('')+'</div></div>'+
    '<div><label>Quando acontece</label><div class="sim-seg">'+Object.keys(SIM_PER).map(function(k){return '<button data-a="simper" data-id="'+k+'" class="'+(s.per===k?'active':'')+'">'+SIM_PER[k].n+'</button>';}).join('')+'</div></div>'+
    '<div><label>Equipe disponível <b id="sim-staff-v">'+s.staff+' pessoas</b></label><input type="range" id="sim-staff" min="2" max="24" value="'+s.staff+'"><small>Necessário para este cenário: <b class="'+(r.cov<1?'bad':'ok')+'">'+r.req+'</b></small></div>'+
    '<div class="sim-tg"><button data-a="simgen" class="'+(s.gen?'on':'')+'"><i></i>Gerador de emergência</button><button data-a="simplan" class="'+(s.plan?'on':'')+'"><i></i>Plano de contingência</button></div>'+
  '</div>'+
  '<div class="sim-run"><button class="btn g" data-a="simrun">'+ic('play')+(s.ran?'Rodar de novo':'Executar simulação')+'</button>'+(s.ran?'<button class="btn" data-a="simgen2">'+ic('plus')+'Lançar ocorrências no sistema</button>':'')+'</div>'+
  '<div class="sim-out'+(s.ran?' ran':'')+'">'+
    '<div class="sim-score">'+gauge+'<div class="sim-grade" style="--c:'+r.g[2]+'"><b>'+(s.ran?r.g[0]:'?')+'</b><span>'+(s.ran?r.g[1]:'Aguardando simulação')+'</span></div></div>'+
    '<div class="sim-kpis"><div><span>Recuperação estimada</span><b>'+(s.ran?fmtH(r.rec/60):'—')+'</b></div><div><span>Pessoas impactadas</span><b>'+(s.ran?'≈ '+r.people.toLocaleString('pt-BR'):'—')+'</b></div><div><span>Vendas em risco</span><b>'+(s.ran?simMoney(r.loss):'—')+'</b></div><div><span>Cobertura da equipe</span><b class="'+(r.cov<1?'bad':'ok')+'">'+(s.ran?Math.round(r.cov*100)+'%':'—')+'</b><i class="sim-cov"><em style="width:'+(s.ran?Math.round(r.cov*100):0)+'%"></em></i></div></div>'+
  '</div>'+
  '<div class="sim-grid2"><div><h4>Reação em cadeia</h4><ol class="sim-chain">'+chain+'</ol>'+(!s.ran?'<p class="sim-hint">Clique em <b>Executar simulação</b> para ver o efeito dominó minuto a minuto.</p>':'')+'</div>'+
  '<div><h4>Setores afetados</h4><div class="sim-areas">'+(r.hit.length?r.hit.map(function(a){return '<button data-a="labarea" data-id="'+esc(a.id)+'" class="'+(s.ran?'on':'')+'">'+esc(a.name)+'<small>'+esc(fname(a.floorId))+'</small></button>';}).join(''):'<p class="sim-hint">Nenhuma área cadastrada corresponde a este cenário.</p>')+'</div>'+
  '<h4>O que fazer</h4><ul class="sim-recs">'+r.recs.map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul></div></div>'+
  (s.runs.length?'<div class="sim-hist"><h4>Comparar testes</h4>'+s.runs.map(function(x){return '<div><span class="g" style="--c:'+x.c+'">'+x.g+'</span><b>'+esc(x.n)+'</b><small>'+esc(x.cfg)+'</small><em>'+x.score+'/100</em></div>';}).join('')+'</div>':'');}
function labSimRefresh(){var el=document.getElementById('lab-sim');if(el)el.innerHTML=labSimHTML();}
function labSimReset(){var s=lab.sim;if(s.timer){clearInterval(s.timer);s.timer=null;}s.ran=false;s.step=0;labSimRefresh();}
function labSimRun(){var s=lab.sim,sc=SIM_SCN[s.scn];if(s.timer)clearInterval(s.timer);s.ran=true;s.step=0;labSimRefresh();
  var r=simCalc();s.runs.unshift({n:sc.n,g:r.g[0],c:r.g[2],score:r.score,cfg:SIM_INT[s.int].n+' · '+SIM_PER[s.per].n+' · '+s.staff+' pessoas'+(s.gen?' · gerador':'')+(s.plan?' · plano':'')});s.runs=s.runs.slice(0,5);
  s.timer=setInterval(function(){if(ui.view!=='laboratorio'){clearInterval(s.timer);s.timer=null;return;}s.step++;var li=document.querySelectorAll('.sim-chain li')[s.step-1];if(li)li.classList.add('on');if(s.step>=sc.chain.length){clearInterval(s.timer);s.timer=null;labSimRefresh();}},650);}
function labSimLaunch(){var s=lab.sim,sc=SIM_SCN[s.scn],r=simCalc(),prio=r.score<40?'Crítica':r.score<60?'Alta':'Média',n=0;
  sc.chain.forEach(function(x,i){if(!x[3]||x[2]==='#GEN')return;var a=r.hit[n%Math.max(1,r.hit.length)];if(!a)return;var o=addDemo([x[1]+' — '+sc.n.toLowerCase(),a.id,x[3],i===0?prio:(prio==='Crítica'?'Alta':'Média')]);o.desc=simChainTxt(s,sc,x)+' (gerado pelo Simulador de crises do Laboratório Digital).';o.log=[{t:o.created,k:'open',txt:'Chamado aberto pela simulação “'+sc.n+'”'}];n++;});
  render();toast(n+' ocorrência(s) simulada(s) lançadas · veja em Ocorrências');}
function vLab(){var st=labStats(lab.floor==='all'?null:lab.floor),f=labFuture();return '<div class="lab-page">'+viewHead('spark','Laboratório Digital','Gêmeo digital conceitual, riscos e decisões interativas · Simulação acadêmica')+'<div class="lab-hero"><div><span class="lab-eyebrow">CAPIM DOURADO / SMART OPERATIONS</span><h2>Enxergue o presente.<br><em>Explore o que pode acontecer.</em></h2><p>Teste de estresse com crises simuladas, riscos combinados e decisões de gestão — tudo a partir dos dados da central.</p></div><span class="lab-demo-badge">AMBIENTE DE SIMULAÇÃO</span></div><div class="lab-summary"><div><span>Áreas monitoradas</span><strong>'+st.areas.length+'</strong><small>Plantas cadastradas</small></div><div><span>Ocorrências abertas</span><strong>'+st.incidents.length+'</strong><small>Dados da central</small></div><div><span>Alertas altos/críticos</span><strong>'+st.critical+'</strong><small>Prioridade operacional</small></div><div><span>Exposição projetada</span><strong>'+f.exposure+'<sup>/100</sup></strong><small>Índice ilustrativo</small></div></div><div class="lab-layout"><section class="lab-visual" id="lab-sim">'+labSimHTML()+'</section><aside class="lab-insights"><div class="lab-panel">'+labRadar()+'</div><div class="lab-panel"><div class="lab-section-head"><h3>Conselheiro operacional</h3><span>Priorização por urgência e SLA</span></div>'+labRecommendations()+'</div><div class="lab-panel">'+labHistory()+'</div></aside></div><div class="lab-bottom"><div class="lab-panel">'+labCompare()+'</div><div class="lab-panel">'+labChallenge()+'</div></div><div class="lab-panel lab-action"><div><b>Central de simulações</b><p>Para lançar ocorrências fictícias no mapa, use os cenários que já existem no projeto.</p></div><button class="btn g" data-a="go" data-id="simulacao">'+ic('play')+' Abrir simulações</button></div></div>';}

/* ---------- configurações ---------- */
function vConfig(){ var F=curFloor();
  var fl=S.floors.map(function(f){ return '<div class="row"><span class="grow"><b>'+esc(f.name)+'</b><div class="s">'+S.areas.filter(function(a){return a.floorId===f.id;}).length+' áreas · '+(f.plan?'planta carregada':'sem planta')+'</div></span><button class="btn sm" data-a="floorcfg" data-id="'+f.id+'">Selecionar</button><button class="btn sm" data-a="editfloor" data-id="'+f.id+'">Renomear</button></div>'; }).join('');
  var ar=S.areas.filter(function(a){return a.floorId===F.id;}).map(function(a){ var st=areaStatus(a.id); return '<div class="row"><span class="bd" style="--c:'+st.c+'">'+st.k+'</span><b class="grow">'+esc(a.name)+'</b><button class="btn sm" data-a="posarea" data-id="'+a.id+'">'+ic('pin')+'Posicionar</button><button class="btn sm" data-a="editarea" data-id="'+a.id+'">Editar</button></div>'; }).join('');
  return viewHead('gear','Configurações','Pisos, plantas, áreas, equipes e dados.')+'<div class="g2">'+
    '<div class="pn"><h3>Pisos</h3>'+fl+'<div class="btns" style="margin-top:12px"><button class="btn" data-a="newfloor">'+ic('plus')+'Novo piso</button></div></div>'+
    '<div class="pn"><h3>Planta – '+esc(F.name)+'</h3><p class="s" style="margin-top:0">Envie a planta como imagem (JPG/PNG). Depois posicione as áreas.</p><div class="btns"><label class="btn g">'+ic('upload')+(F.plan?'Trocar planta':'Carregar planta')+'<input type="file" accept="image/*" id="planfile" style="display:none"></label>'+(F.plan?'<button class="btn dg'+(ui.armed==='rmplan'?' arm':'')+'" data-a="rmplan">'+(ui.armed==='rmplan'?'Confirmar remoção':'Remover planta')+'</button>':'')+'</div></div>'+
    '<div class="pn" style="grid-column:1/-1"><h3 style="display:flex;align-items:center">Áreas – '+esc(F.name)+'<button class="btn sm g" style="margin-left:auto" data-a="newarea">'+ic('plus')+'Nova área</button></h3>'+ar+'</div>'+
    '<div class="pn"><h3>Equipes e rondas</h3><button class="btn" data-a="settings">'+ic('users')+'Editar equipes e itens da ronda</button></div>'+
    '<div class="pn"><h3>Dados</h3><p class="s" style="margin-top:0">Os dados de exemplo servem para testes. Para usar de verdade, apague as ocorrências de exemplo.</p><div class="btns"><button class="btn dg'+(ui.armed==='clearocc'?' arm':'')+'" data-a="clearocc">'+(ui.armed==='clearocc'?'Confirmar':'Apagar ocorrências e rondas')+'</button><button class="btn dg'+(ui.armed==='reset'?' arm':'')+'" data-a="reset">'+(ui.armed==='reset'?'Confirmar':'Restaurar exemplo')+'</button></div></div></div>'; }

/* ================= MODAIS ================= */
function sel(name,opts,val){ return '<select name="'+name+'">'+opts.map(function(o){ var v=Array.isArray(o)?o[0]:o, l=Array.isArray(o)?o[1]:o; return '<option value="'+esc(v)+'"'+(String(v)===String(val)?' selected':'')+'>'+esc(l)+'</option>'; }).join('')+'</select>'; }
function areaOpts(){ return S.areas.map(function(a){return [a.id,a.name+' · '+fname(a.floorId)];}); }
function delBtn(k,label){ return '<button type="button" class="btn dg'+(ui.armed===k?' arm':'')+'" data-a="'+k+'">'+(ui.armed===k?'Confirmar':label)+'</button>'; }
/* ---------- V5.2 — Ficha detalhada do chamado ("Ver chamado") ---------- */
var OCC_STEPS={
  'Elétrica':['Isolar o circuito e sinalizar a área','Verificar disjuntores e quadro de distribuição','Substituir componente e testar a carga'],
  'Hidráulica':['Fechar o registro mais próximo','Conter e secar a água (acionar Limpeza)','Reparar a conexão e testar a vazão'],
  'Climatização':['Medir a temperatura no local','Verificar fan-coil, filtros e termostato','Ajustar a central e acompanhar por 1h'],
  'Limpeza':['Sinalizar piso/área com cavaletes','Executar a limpeza e secagem','Retirar a sinalização e registrar foto'],
  'Segurança':['Enviar vigilante ao local','Verificar câmeras (CFTV) do setor','Registrar ocorrência e informar a gerência'],
  'Elevadores/Escadas':['Isolar o equipamento com cones','Acionar a empresa de manutenção','Testar o equipamento antes de liberar'],
  'Estrutura':['Isolar a área afetada','Avaliar o dano (engenharia)','Executar o reparo e liberar o local'],
  'TI/Rede':['Confirmar o alcance da falha','Reiniciar equipamento / checar cabeamento','Validar a conexão com os usuários'],
  'Outros':['Avaliar a situação no local','Definir a equipe responsável','Executar e registrar a solução']
};
function occLog(o){
  var l=(o.log||[]).slice();
  if(!l.some(function(e){return e.k==='open';})) l.push({t:o.created,k:'open',txt:'Chamado aberto'+(o.demo?' pela simulação':'')});
  if(o.status!=='Aberta'&&!l.some(function(e){return e.k==='team';})) l.push({t:Math.max(o.created,Math.min(o.updated||o.created,o.resolved||Infinity)),k:'team',txt:'Equipe '+(o.resp||'responsável')+' acionada'});
  if(o.status==='Resolvida'&&o.resolved&&!l.some(function(e){return e.k==='done'&&e.t===o.resolved;})) l.push({t:o.resolved,k:'done',txt:'Chamado concluído'});
  return l.sort(function(a,b){return b.t-a.t;});
}
function occAddLog(o,k,txt){ if(!o.log) o.log=[]; o.log.push({t:Date.now(),k:k,txt:txt}); }
function occNow(o){
  var left=slaLeft(o), late=left<0, since=fmtH((Date.now()-o.created)/HOUR), team=esc(o.resp||'sem equipe definida');
  if(o.status==='Aberta') return {c:'#ef4444',t:'Aguardando atendimento',d:'Chamado aberto há '+since+' e ainda sem equipe em campo. '+(late?'<b>O prazo (SLA) já estourou há '+fmtH(-left/HOUR)+'</b> — acione a equipe '+team+' agora.':'Restam '+fmtH(left/HOUR)+' do prazo para a equipe '+team+' iniciar e concluir o atendimento.')};
  if(o.status==='Em andamento') return {c:'#f59e0b',t:'Equipe em atendimento',d:'A equipe '+team+' está trabalhando no local. Chamado aberto há '+since+'. '+(late?'<b>SLA estourado há '+fmtH(-left/HOUR)+'</b> — considere escalar para a supervisão.':'Prazo restante: '+fmtH(left/HOUR)+'.')};
  return {c:'#22c55e',t:'Chamado resolvido',d:'Concluído em '+(o.resolved?fdate(o.resolved):'—')+' pela equipe '+team+(o.resolved?', '+(left>=0?'<b style="color:#22c55e">dentro do prazo</b>':'<b style="color:#ef4444">fora do prazo</b>')+' (tempo total: '+fmtH((o.resolved-o.created)/HOUR)+').':'.')};
}
function occViewHTML(o){
  var c=PRIO_C[o.prio]||'#94a3b8', open=isOpen(o), left=slaLeft(o), slaMs=SLA_H[o.prio]*HOUR, used=Math.min(100,Math.max(0,Math.round(((o.resolved||Date.now())-o.created)/slaMs*100)));
  var a=area(o.areaId)||{}, now=occNow(o), si=STATUS.indexOf(o.status), steps=OCC_STEPS[o.cat]||OCC_STEPS['Outros'];
  var stepDone=o.status==='Resolvida'?3:o.status==='Em andamento'?1:0;
  var act=o.status==='Aberta'?'<button class="btn g" data-a="setst" data-id="'+o.id+'" data-v="Em andamento">'+ic('users')+'Acionar equipe</button>':o.status==='Em andamento'?'<button class="btn g" data-a="setst" data-id="'+o.id+'" data-v="Resolvida">'+ic('check')+'Concluir chamado</button>':'<button class="btn" data-a="setst" data-id="'+o.id+'" data-v="Aberta">'+ic('refresh')+'Reabrir</button>';
  var LOGC={open:'#ef4444',team:'#f59e0b',done:'#22c55e',note:'#60a5fa',edit:'#a78bfa',reopen:'#ef4444'};
  return '<div class="ov">'+
    '<div class="ov-head" style="--c:'+c+'"><div class="ov-ic">'+ic(CAT_I[o.cat]||'alert')+'</div><div class="grow"><div class="ov-id">CHAMADO #'+esc(String(o.id).slice(-6).toUpperCase())+'</div>'+
      '<div><span class="bd" style="--c:'+c+'">'+esc(o.prio)+'</span><span class="bd o" style="--c:'+(STATUS_C[o.status]||'#94a3b8')+'">'+esc(o.status)+'</span>'+(o.demo?'<span class="bd o" style="--c:#e9b949">SIMULADO</span>':'')+'</div>'+
      '<h2>'+esc(o.title)+'</h2><div class="ov-loc">'+ic('pin')+esc(fname(a.floorId)||'—')+' · '+esc(a.name||'Área não encontrada')+' · '+esc(o.cat)+'</div></div><button class="x" data-a="close" aria-label="Fechar">✕</button></div>'+
    '<div class="ov-steps">'+STATUS.map(function(s,i){return '<div class="'+(i<si?'done':i===si?'cur':'')+'"><i>'+(i<si||(i===si&&s==='Resolvida')?'✓':i+1)+'</i><span>'+s+'</span></div>';}).join('<b></b>')+'</div>'+
    '<div class="ov-now" style="--c:'+now.c+'"><div class="ov-now-t"><span class="ov-pulse"></span>'+now.t+'</div><p>'+now.d+'</p></div>'+
    '<div class="ov-grid">'+
      '<div class="ov-sla"><span>'+(open?'Prazo (SLA) restante':'Tempo de atendimento')+'</span>'+(open?'<div id="sla" data-id="'+o.id+'" class="sla '+(left<0?'':left<slaMs*.3?'warn':'ok')+'">'+(left<0?'-':'')+hms(left)+'</div>':'<div class="sla '+(left>=0?'ok':'')+'">'+fmtH(((o.resolved||Date.now())-o.created)/HOUR)+'</div>')+
        '<div class="ov-bar"><i style="width:'+used+'%;background:'+(used>=100?'#ef4444':used>=70?'#facc15':'#22c55e')+'"></i></div><small>'+used+'% do prazo de '+fmtH(SLA_H[o.prio])+' ('+esc(o.prio)+') · limite '+fshort(o.created+slaMs)+'</small></div>'+
      '<div class="ov-info"><div><span>Equipe responsável</span><b>'+esc(o.resp||'—')+'</b></div><div><span>Aberto em</span><b>'+fdate(o.created)+'</b><small>'+ago(o.created)+'</small></div><div><span>Última atualização</span><b>'+ago(o.updated||o.created)+'</b></div>'+(o.resolved?'<div><span>Resolvido em</span><b>'+fdate(o.resolved)+'</b></div>':'')+'</div>'+
    '</div>'+
    '<div class="ov-sec"><h4>Detalhes informados</h4><p class="ov-desc">'+(o.desc?esc(o.desc):'<i>Nenhum detalhe foi informado na abertura.</i>')+'</p></div>'+
    '<div class="ov-sec"><h4>Procedimento sugerido · '+esc(o.cat)+'</h4><ol class="ov-proc">'+steps.map(function(s,i){return '<li class="'+(i<stepDone?'ok':'')+'"><i>'+(i<stepDone?'✓':i+1)+'</i>'+esc(s)+'</li>';}).join('')+'</ol></div>'+
    '<div class="ov-sec"><h4>Histórico do chamado</h4><div class="ov-tl">'+occLog(o).map(function(e){return '<div style="--c:'+(LOGC[e.k]||'#94a3b8')+'"><i></i><div><b>'+esc(e.txt)+'</b><small>'+fdate(e.t)+' · '+ago(e.t)+'</small></div></div>';}).join('')+'</div>'+
      '<div class="ov-note"><textarea id="occnote-txt" rows="2" placeholder="Registrar atualização (ex.: técnico chegou ao local, peça solicitada…)"></textarea><button class="btn" data-a="occnote" data-id="'+o.id+'">'+ic('plus')+'Registrar</button></div></div>'+
    '<div class="ov-actions">'+act+'<button class="btn" data-a="occedit" data-id="'+o.id+'">'+ic('wrench')+'Editar</button><button class="btn" data-a="showmap" data-id="'+o.id+'">'+ic('map')+'Ver no mapa</button></div>'+
  '</div>';
}
function modalHTML(){
  var m=ui.modal, b='';
  if(m.k==='occview'){ var ov=occById(m.id); if(!ov){ return ''; } return '<div class="mbg" data-a="bg"><div class="md md-ov">'+occViewHTML(ov)+'</div></div>'; }
  if(m.k==='occ'){ var o=m.o;
    b='<h3>'+ic(CAT_I[o.cat]||'alert')+(m.isNew?'Nova ocorrência':'Chamado')+'<button class="x" data-a="close">✕</button></h3><form id="mf">'+
      '<label class="f">O que aconteceu?<input name="title" required value="'+esc(o.title)+'" placeholder="Ex.: Vazamento no banheiro"></label>'+
      '<div class="two"><label class="f">Área'+sel('areaId',areaOpts(),o.areaId)+'</label><label class="f">Categoria'+sel('cat',CATS,o.cat)+'</label></div>'+
      '<div class="two"><label class="f">Criticidade'+sel('prio',PRIOS,o.prio)+'</label><label class="f">Equipe responsável'+sel('resp',S.team,o.resp)+'</label></div>'+
      (m.isNew?'':'<label class="f">Status'+sel('status',STATUS,o.status)+'</label>')+
      '<label class="f">Detalhes<textarea name="desc" placeholder="Local exato, observações…">'+esc(o.desc)+'</textarea></label>'+
      (m.isNew?'<p class="s">Prazo de atendimento (SLA) pela criticidade: Crítica 1h30 · Alta 4h · Média 24h · Baixa 48h.</p>':'<p class="s">Aberto em '+fdate(o.created)+(o.resolved?' · Resolvido em '+fdate(o.resolved):'')+(o.demo?' · ocorrência simulada':'')+'</p>')+
      '<div class="btns"><button class="btn g" type="submit">Salvar</button>'+(m.isNew?'':delBtn('delocc','Excluir'))+'</div></form>';
  } else if(m.k==='area'){ var a=area(m.id), st=areaStatus(a.id);
    var oc=openOcc().filter(function(o){return o.areaId===a.id;}).sort(bySev).map(function(o){return '<div class="row" data-a="occ" data-id="'+o.id+'" style="cursor:pointer"><span class="bd" style="--c:'+PRIO_C[o.prio]+'">'+o.prio+'</span><span class="grow">'+esc(o.title)+'<div class="s">'+o.status+' · '+ago(o.created)+'</div></span></div>';}).join('')||'<div class="empty">Sem ocorrências abertas.</div>';
    var eq=S.equip.filter(function(e){return e.areaId===a.id;}).map(function(e){var s=equipStatus(e);return '<div class="row" data-a="editequip" data-id="'+e.id+'" style="cursor:pointer"><span class="bd" style="--c:'+s.c+'">'+s.k+'</span><span class="grow">'+esc(e.name)+'</span></div>';}).join('');
    b='<h3>'+ic(areaIcon(a.name))+esc(a.name)+'<button class="x" data-a="close">✕</button></h3><p class="s" style="margin-top:-8px">'+esc(fname(a.floorId))+' · <span style="color:'+st.c+'">● '+st.k+'</span></p>'+oc+(eq?'<h3 style="margin-top:14px;font-size:14px">Equipamentos</h3>'+eq:'')+
      '<div class="btns" style="margin-top:14px"><button class="btn g" data-a="newocc" data-id="'+a.id+'">'+ic('plus')+'Ocorrência aqui</button><button class="btn" data-a="editarea" data-id="'+a.id+'">Editar área</button></div>';
  } else if(m.k==='editarea'){ var ea=m.isNew?{name:'',floorId:ui.floor}:area(m.id);
    b='<h3>'+(m.isNew?'Nova área':'Editar área')+'<button class="x" data-a="close">✕</button></h3><form id="mf"><label class="f">Nome<input name="name" required value="'+esc(ea.name)+'"></label><label class="f">Piso'+sel('floorId',S.floors.map(function(f){return [f.id,f.name];}),ea.floorId)+'</label>'+
      '<div class="btns"><button class="btn g" type="submit">Salvar</button>'+(m.isNew?'':'<button type="button" class="btn" data-a="posarea" data-id="'+m.id+'">Posicionar na planta</button>'+delBtn('delarea','Excluir'))+'</div></form>';
  } else if(m.k==='equip'){ var e=m.e;
    b='<h3>'+ic('layers')+(m.isNew?'Novo equipamento':'Equipamento')+'<button class="x" data-a="close">✕</button></h3><form id="mf"><label class="f">Nome<input name="name" required value="'+esc(e.name)+'" placeholder="Ex.: Elevador de serviço"></label>'+
      '<div class="two"><label class="f">Área'+sel('areaId',areaOpts(),e.areaId)+'</label><label class="f">Equipe'+sel('resp',S.team,e.resp)+'</label></div>'+
      '<div class="two"><label class="f">Periodicidade (dias)<input name="freq" type="number" min="1" required value="'+e.freq+'"></label><label class="f">Última execução<input name="last" type="date" value="'+todayKey(new Date(e.last))+'"></label></div>'+
      (e.log&&e.log.length?'<p class="s">Histórico: '+e.log.slice().reverse().slice(0,6).map(fday).join(' · ')+'</p>':'')+
      '<div class="btns"><button class="btn g" type="submit">Salvar</button>'+(m.isNew?'':'<button type="button" class="btn" data-a="doequip" data-id="'+e.id+'">Registrar execução hoje</button>'+delBtn('delequip','Excluir'))+'</div></form>';
  } else if(m.k==='floor'){ var fl=m.isNew?{name:''}:floor(m.id);
    b='<h3>'+(m.isNew?'Novo piso':'Editar piso')+'<button class="x" data-a="close">✕</button></h3><form id="mf"><label class="f">Nome do piso<input name="name" required value="'+esc(fl.name)+'" placeholder="Ex.: Subsolo 1"></label><div class="btns"><button class="btn g" type="submit">Salvar</button>'+(m.isNew||S.floors.length<2?'':delBtn('delfloor','Excluir piso e suas áreas'))+'</div></form>';
  } else if(m.k==='settings'){
    b='<h3>Equipes e rondas<button class="x" data-a="close">✕</button></h3><form id="mf"><label class="f">Equipes (uma por linha)<textarea name="team" rows="6">'+esc(S.team.join('\n'))+'</textarea></label><label class="f">Itens da ronda (um por linha)<textarea name="items" rows="5">'+esc(S.items.join('\n'))+'</textarea></label><div class="btns"><button class="btn g" type="submit">Salvar</button></div></form>';
  }
  return '<div class="mbg" data-a="bg"><div class="md">'+b+'</div></div>';
}

/* ================= AÇÕES ================= */
function nearestArea(x,y,fid){ var best=null,bd=1e9; S.areas.forEach(function(a){ if(fid&&a.floorId!==fid) return; var d=(a.x-x)*(a.x-x)+(a.y-y)*(a.y-y); if(d<bd){bd=d;best=a;} }); return best; }
function newOcc(areaId,x,y,cat,prio){ var a=areaId?area(areaId):null;
  ui.modal={k:'occ',isNew:true,o:{title:'',areaId:areaId||(S.areas[0]&&S.areas[0].id),cat:cat||'Outros',prio:prio||'Média',resp:S.team[0],desc:'',x:x!=null?x:(a?a.x:null),y:y!=null?y:(a?a.y:null)}};
  ui.armed=null; render(); setTimeout(function(){ var i=document.querySelector('#mf input[name=title]'); if(i) i.focus(); },50); }
function closeModal(){ ui.modal=null; ui.armed=null; render(); }
function go(v){ ui.view=v; ui.menu=false; ui.modal=null; try{ history.replaceState(null,'','#'+v); }catch(e){} render(); window.scrollTo(0,0); }
function addDemo(spec){ var a=area(spec[1])||S.areas[Math.floor(Math.random()*S.areas.length)], n=Date.now();
  var o={id:uid(),title:spec[0],areaId:a.id,cat:spec[2],prio:spec[3],status:'Aberta',resp:teamFor(spec[2]),desc:'Ocorrência gerada pela simulação.',created:n,updated:n,resolved:null,x:+(a.x+(Math.random()*5-2.5)).toFixed(2),y:+(a.y+(Math.random()*5-2.5)).toFixed(2),demo:true};
  S.occ.push(o); return o; }
function teamFor(cat){ var m={'Limpeza':'Limpeza','Segurança':'Segurança','Climatização':'Climatização','TI/Rede':'TI'}; var t=m[cat]; return S.team.indexOf(t)>=0?t:S.team[0]; }
var DEMO_POOL=[['Lâmpada piscando','Elétrica','Baixa'],['Vazamento no forro','Hidráulica','Alta'],['Ar-condicionado desligado','Climatização','Alta'],['Derramamento de bebida','Limpeza','Média'],['Criança perdida','Segurança','Crítica'],['Elevador parado','Elevadores/Escadas','Crítica'],['Sinalização danificada','Estrutura','Baixa'],['Totem sem conexão','TI/Rede','Média']];
var demoTimer=null;
function setDemo(on){ ui.demo=on; clearInterval(demoTimer); if(on){ demoTick(); demoTimer=setInterval(demoTick,25000); toast('Modo demonstração ligado'); } else toast('Modo demonstração desligado'); render(); }
function demoTick(){ var p=DEMO_POOL[Math.floor(Math.random()*DEMO_POOL.length)], a=S.areas[Math.floor(Math.random()*S.areas.length)];
  var o=addDemo([p[0],a.id,p[1],p[2]]); ui.sel=o.id; if(!ui.modal){ if(ui.view==='mapa') ui.floor=a.floorId; render(); } toast('Nova ocorrência: '+o.title+' – '+a.name); }


var maquetteMain=null;
function initLab3D(){
  if(ui.view!=='laboratorio')return;
  var ids=S.floors.slice(0,2).map(function(f){return f.id;});
  var status=document.getElementById('lab3d-selected');
  var onArea=function(id){
    var a=area(id);if(!a)return;
    var o=labOpen().filter(function(x){return x.areaId===id;}).sort(bySev)[0];
    if(status){status.hidden=false;status.innerHTML='<b>'+esc(a.name)+'</b> · '+(o?esc(o.prio)+' · '+esc(o.title):'Sem ocorrência aberta')+'<small>Área cadastrada no painel operacional · <a href="#mapa" style="color:#f0c565" data-a="labarea" data-id="'+esc(id)+'">Abrir mapa operacional</a></small>';}
  };
  var options={floorIds:ids,areaStatus:areaStatus,getAreas:function(){return S.areas;},onArea:onArea};
  if(lab.visualMode==='premium'){
    if(!window.CapimPremiumViewer)return;
    var main=document.getElementById('labpremium-main'); if(!main)return;
    maquetteMain=CapimPremiumViewer.init(main,options);
    maquetteMain.setFocus(lab.floor==='all'?'all':(lab.floor===ids[0]?'0':'1'));
    ids.forEach(function(id,i){var c=document.getElementById('labpremium-piso'+i);if(c){var view=CapimPremiumViewer.init(c,Object.assign({},options,{preview:true,onArea:function(){lab.floor=id;render();}}));view.setFocus(String(i));}});
  }else{
    if(!window.CapimMaquete3D)return;
    var scene=document.getElementById('lab3d-main');if(!scene)return;
    maquetteMain=CapimMaquete3D.init(scene,options);
    maquetteMain.setFocus(lab.floor==='all'?'all':(lab.floor===ids[0]?'0':'1'));maquetteMain.setXray(lab.xray);
    ids.forEach(function(id,i){var c=document.getElementById('lab3d-piso'+i);if(c){var v=CapimMaquete3D.init(c,options);v.setFocus(String(i));v.setXray(lab.xray);}});
  }
}
document.addEventListener('click', function(ev){
  var t=ev.target.closest('[data-a]'), map=ev.target.closest('#map');
  if(map&&(!t||t.id==='map')){ var r=map.getBoundingClientRect(), x=+((ev.clientX-r.left)/r.width*100).toFixed(2), y=+((ev.clientY-r.top)/r.height*100).toFixed(2);
    if(ui.posArea){ var pa=area(ui.posArea); pa.x=x; pa.y=y; toast('“'+pa.name+'” posicionada'); ui.posArea=null; render(); commit(); }
    else { var na=nearestArea(x,y,ui.floor); newOcc(na&&na.id,x,y); } return; }
  if(!t) return;
  var a=t.getAttribute('data-a'), id=t.getAttribute('data-id'), v=t.getAttribute('data-v');
  if(a==='bg'){ if(ev.target===t) closeModal(); return; }
  if(['delocc','delarea','delequip','rmplan','clearocc','reset','delfloor'].indexOf(a)>=0 && ui.armed!==a){ ui.armed=a; render(); return; }
  switch(a){
    case 'go': go(id); break;
    case 'v5time': V5.horizon=+v;render();break;
    case 'v5focus': V5.focus=id; if(ui.view==='futuro'&&V5.view3d!==false){ v52live(true); var s52=document.getElementById('v51-3d-slot'); if(s52&&s52.scrollIntoView) s52.scrollIntoView({behavior:'smooth',block:'center'}); } else render(); break;
    case 'v51view': V5.view3d=(id==='3d'); if(!V5.view3d) v52full(false); render(); break;
    case 'v52h': v52stop(); V5.horizon=+v; v52live(false); break;
    case 'v52play': v52play(); break;
    case 'v52full': v52full(); break;
    case 'v52mit': V5.mitig[id]=!V5.mitig[id]; if(V5.mitig[id]) toast('Ação da equipe simulada em “'+aname(id)+'”'); v52live(false); break;
    case 'v52clear': V5.mitig={}; v52live(false); break;
    case 'logout': if(window.CDAuth) CDAuth.logout(); break;
    case 'v5layer': V5.layer=id;render();break;
    case 'v5scenario': V5.scenario=id; V5.command=null;render();break;
    case 'v5command': V5.command=id;render();break;
    case 'v5passport': V5.passport=id;render();break;
    case 'v5mission': V5.missions[id]=!V5.missions[id]; v5save();render();break;
    case 'v5resetmissions': V5.missions={};v5save();render();break;
    case 'v5copy': copyText(location.href.split('#')[0]+'#passaportes','Link do painel copiado');break;
    case 'v5print': window.print();break;
    case 'labvisual': lab.visualMode=id==='modelo'?'modelo':'premium';render();break;
    case 'labfloor': lab.floor=id; render(); break;
    case 'labxray': lab.xray=!lab.xray; if(lab.visualMode==='premium'){lab.visualMode='modelo';} render(); break;
    case 'labrotate': if(maquetteMain)maquetteMain.rotate((+v)*.22); break;
    case 'labreset': if(maquetteMain)maquetteMain.reset(); break;
    case 'labzoom': if(maquetteMain)maquetteMain.zoom((+v)*.14); break;
    case 'labtime': lab.horizon=+v; render(); break;
    case 'simscn': lab.sim.scn=id; labSimReset(); break;
    case 'simint': lab.sim.int=+v; labSimReset(); break;
    case 'simper': lab.sim.per=id; labSimReset(); break;
    case 'simgen': lab.sim.gen=!lab.sim.gen; labSimReset(); break;
    case 'simplan': lab.sim.plan=!lab.sim.plan; labSimReset(); break;
    case 'simrun': labSimRun(); break;
    case 'simgen2': labSimLaunch(); break;
    case 'labscenario': lab.scenario=id; render(); break;
    case 'labchoice': lab.choice=id; render(); break;
    case 'labocc': var lo=occById(id); if(lo){ui.sel=lo.id;var la=area(lo.areaId);if(la)ui.floor=la.floorId;go('mapa');} break;
    case 'labarea': var la2=area(id); if(la2){ui.floor=la2.floorId;var lo2=labOpen().filter(function(o){return o.areaId===id;}).sort(bySev)[0];if(lo2)ui.sel=lo2.id;go('mapa');} break;
    case 'menu': ui.menu=!ui.menu; render(); break;
    case 'close': closeModal(); break;
    case 'newocc': newOcc(id, null, null, t.getAttribute('data-cat')||null, v||null); break;
    case 'selocc': ui.sel=id; render(); if(window.innerWidth<1100){ var dp=document.querySelector('.dp'); if(dp) dp.scrollIntoView({behavior:'smooth',block:'start'}); } break;
    case 'cyc': var L=openList(), cur=selOcc(), i=L.indexOf(cur); if(L.length){ var nx=L[(i+(+v)+L.length)%L.length]; ui.sel=nx.id; var ar=area(nx.areaId); if(ar) ui.floor=ar.floorId; render(); } break;
    case 'showmap': var so=occById(id); if(so){ ui.sel=id; var sa=area(so.areaId); if(sa) ui.floor=sa.floorId; go('mapa'); } break;
    case 'occ': if(occById(id)){ ui.modal={k:'occview',id:id}; ui.armed=null; render(); } break;
    case 'occedit': var o=occById(id); if(o){ ui.modal={k:'occ',isNew:false,fromView:true,o:JSON.parse(JSON.stringify(o))}; ui.armed=null; render(); } break;
    case 'occnote': var on=occById(id), nt=document.getElementById('occnote-txt'), txt=nt?nt.value.trim():''; if(on&&txt){ occAddLog(on,'note',txt); on.updated=Date.now(); render(); if(!on.demo) commit(); toast('Atualização registrada'); } else if(nt){ nt.focus(); toast('Escreva a atualização antes de registrar'); } break;
    case 'area': if(ui.posArea) return; ui.modal={k:'area',id:id}; render(); break;
    case 'gofloor': ui.floor=id; go('mapa'); break;
    case 'floor': ui.floor=id; ui.posArea=null; var so2=selOcc(); if(so2&&(area(so2.areaId)||{}).floorId!==id){ var fl=openList().filter(function(x){return (area(x.areaId)||{}).floorId===id;})[0]; if(fl) ui.sel=fl.id; } render(); break;
    case 'floorcfg': ui.floor=id; render(); break;
    case 'zoom': ui.zoom=Math.max(1,Math.min(4,ui.zoom+(+v))); render(); break;
    case 'labels': ui.labels=!ui.labels; render(); break;
    case 'editarea': ui.modal={k:'editarea',id:id}; ui.armed=null; render(); break;
    case 'newarea': ui.modal={k:'editarea',isNew:true}; render(); break;
    case 'posarea': ui.posArea=id; ui.floor=area(id).floorId; ui.modal=null; go('mapa'); break;
    case 'cancelpos': ui.posArea=null; render(); break;
    case 'newfloor': ui.modal={k:'floor',isNew:true}; ui.armed=null; render(); break;
    case 'editfloor': ui.modal={k:'floor',id:id}; ui.armed=null; render(); break;
    case 'delfloor': var fid=ui.modal.id, gone={}; S.areas.forEach(function(x){if(x.floorId===fid) gone[x.id]=1;}); S.areas=S.areas.filter(function(x){return !gone[x.id];}); S.floors=S.floors.filter(function(x){return x.id!==fid;}); ui.floor=S.floors[0].id; closeModal(); commit(); break;
    case 'rmplan': curFloor().plan=null; ui.armed=null; render(); commit(); break;
    case 'fst': ui.fStatus=id; render(); break;
    case 'setst': var s=occById(id); if(s){ occAddLog(s, v==='Resolvida'?'done':v==='Em andamento'?'team':'reopen', v==='Resolvida'?'Chamado concluído':v==='Em andamento'?'Equipe '+(s.resp||'responsável')+' acionada':'Chamado reaberto'); s.status=v; s.updated=Date.now(); s.resolved=v==='Resolvida'?Date.now():null; if(v==='Resolvida'&&ui.sel===id) ui.sel=null; render(); if(!s.demo) commit(); toast(v==='Resolvida'?'Ocorrência resolvida ✓':v==='Em andamento'?'Equipe acionada: '+s.resp:'Ocorrência reaberta'); } break;
    case 'delocc': var did=ui.modal.o.id, wasDemo=(occById(did)||{}).demo; S.occ=S.occ.filter(function(x){return x.id!==did;}); closeModal(); if(!wasDemo) commit(); break;
    case 'delarea': var da=ui.modal.id; S.areas=S.areas.filter(function(x){return x.id!==da;}); closeModal(); commit(); break;
    case 'newequip': ui.modal={k:'equip',isNew:true,e:{name:'',areaId:S.areas[0]&&S.areas[0].id,resp:S.team[0],freq:30,last:Date.now(),log:[]}}; ui.armed=null; render(); break;
    case 'editequip': var ee=S.equip.filter(function(x){return x.id===id;})[0]; if(ee){ ui.modal={k:'equip',isNew:false,e:JSON.parse(JSON.stringify(ee))}; ui.armed=null; render(); } break;
    case 'delequip': var de=ui.modal.e.id; S.equip=S.equip.filter(function(x){return x.id!==de;}); closeModal(); commit(); break;
    case 'doequip': var dq=S.equip.filter(function(x){return x.id===id;})[0]; dq.last=Date.now(); dq.log=(dq.log||[]).concat([Date.now()]); ui.modal=null; render(); commit(); toast('Execução registrada: '+dq.name); break;
    case 'ck': var rr=S.rounds[todayKey()]||(S.rounds[todayKey()]={}); rr[id]=rr[id]||{}; var cur2=rr[id][v], nv=!cur2?'ok':cur2==='ok'?'nok':null; if(nv) rr[id][v]=nv; else delete rr[id][v];
      commit(2500); if(nv==='nok'){ var aa=area(id); ui.modal={k:'occ',isNew:true,o:{title:'Problema de '+v.toLowerCase()+' – '+aa.name,areaId:id,cat:ITEM_CAT[v]||'Outros',prio:'Média',resp:teamFor(ITEM_CAT[v]),desc:'Identificado na ronda de '+fday(Date.now())+'.',x:aa.x,y:aa.y}}; } render(); break;
    case 'ckall': var r2=S.rounds[todayKey()]||(S.rounds[todayKey()]={}); r2[id]=r2[id]||{}; S.items.forEach(function(it){ if(!r2[id][it]) r2[id][it]='ok'; }); render(); commit(2500); break;
    case 'settings': ui.modal={k:'settings'}; render(); break;
    case 'clearocc': S.occ=[]; S.rounds={}; ui.sel=null; closeModal(); commit(); toast('Ocorrências e rondas apagadas'); break;
    case 'reset': var keep={}; S.floors.forEach(function(f){keep[f.id]=f.plan;}); S=seed(); S.floors.forEach(function(f){ if(keep[f.id]) f.plan=keep[f.id]; }); ui.floor=S.floors[0].id; ui.sel=null; closeModal(); commit(); toast('Dados de exemplo restaurados'); break;
    case 'demo': setDemo(!ui.demo); break;
    case 'scen': var sc=SCEN.filter(function(x){return x.k===id;})[0], last=null; sc.occ.forEach(function(o){ last=addDemo(o); }); ui.sel=last.id; ui.floor=area(last.areaId).floorId; toast('Cenário simulado: '+sc.t); go('mapa'); break;
    case 'clearsim': S.occ=S.occ.filter(function(o){return !o.demo;}); ui.sel=null; render(); toast('Simulação limpa'); break;
    case 'copyreport': copyText(reportText(),'Resumo copiado'); break;
    case 'copycsv': copyText(csvText(),'Planilha copiada – cole no Excel'); break;
  }
});

document.addEventListener('submit', function(ev){
  ev.preventDefault(); var d={}; Array.prototype.forEach.call(ev.target.elements,function(el){ if(el.name) d[el.name]=el.value; }); var m=ui.modal; if(!m) return; var skipSave=false;
  if(m.k==='occ'){ var o=m.o, now=Date.now(); if(m.isNew){ o.id=uid(); o.status='Aberta'; o.created=now; o.resolved=null; }
    var prev=o.status; o.title=d.title.trim(); if(o.areaId!==d.areaId){ var na=area(d.areaId); if(na){ o.x=na.x; o.y=na.y; } } o.areaId=d.areaId; o.cat=d.cat; o.prio=d.prio; o.resp=d.resp; o.desc=d.desc; o.updated=now;
    if(!m.isNew){ o.status=d.status; if(o.status==='Resolvida'&&prev!=='Resolvida') o.resolved=now; if(o.status!=='Resolvida') o.resolved=null; }
    if(m.isNew){ o.log=[{t:now,k:'open',txt:'Chamado aberto'}]; } else { var orig=occById(o.id)||{}, chg=[]; if(o.status!==prev) chg.push('status: '+prev+' → '+o.status); if(orig.prio&&orig.prio!==o.prio) chg.push('criticidade: '+orig.prio+' → '+o.prio); if(orig.resp&&orig.resp!==o.resp) chg.push('equipe: '+o.resp); if(orig.areaId&&orig.areaId!==o.areaId) chg.push('área: '+aname(o.areaId)); if(orig.title&&orig.title!==o.title) chg.push('título'); if((orig.desc||'')!==(o.desc||'')) chg.push('detalhes'); if(orig.cat&&orig.cat!==o.cat) chg.push('categoria: '+o.cat); if(chg.length) occAddLog(o,o.status==='Resolvida'&&prev!=='Resolvida'?'done':o.status!==prev&&o.status==='Aberta'?'reopen':'edit','Chamado editado ('+chg.join(', ')+')'); }
    if(m.isNew) S.occ.push(o); else S.occ=S.occ.map(function(x){return x.id===o.id?o:x;}); skipSave=!!o.demo; if(isOpen(o)) ui.sel=o.id;
    toast(m.isNew?'Ocorrência registrada':'Chamado atualizado');
  } else if(m.k==='editarea'){
    if(m.isNew){ var nar={id:uid(),name:d.name.trim(),floorId:d.floorId,x:50,y:50}; S.areas.push(nar); ui.modal=null; ui.posArea=nar.id; ui.floor=nar.floorId; commit(); go('mapa'); toast('Toque na planta para posicionar a área'); return; }
    var ar=area(m.id); ar.name=d.name.trim(); ar.floorId=d.floorId;
  } else if(m.k==='equip'){ var e=m.e; e.name=d.name.trim(); e.areaId=d.areaId; e.resp=d.resp; e.freq=Math.max(1,parseInt(d.freq,10)||30);
    if(d.last){ var p=d.last.split('-'); e.last=new Date(+p[0],+p[1]-1,+p[2],12).getTime(); }
    if(m.isNew){ e.id=uid(); S.equip.push(e); } else S.equip=S.equip.map(function(x){return x.id===e.id?e:x;});
  } else if(m.k==='floor'){ if(m.isNew){ var nf={id:uid(),name:d.name.trim(),plan:null}; S.floors.push(nf); ui.floor=nf.id; } else floor(m.id).name=d.name.trim();
  } else if(m.k==='settings'){ var tm=d.team.split('\n').map(function(s){return s.trim();}).filter(Boolean), it=d.items.split('\n').map(function(s){return s.trim();}).filter(Boolean); if(tm.length) S.team=tm; if(it.length) S.items=it; }
  ui.modal=(m.k==='occ'&&!m.isNew&&m.fromView)?{k:'occview',id:m.o.id}:null; ui.armed=null; render(); if(!skipSave) commit();
});

document.addEventListener('input', function(ev){
  var id=ev.target.id; if(id!=='q'&&id!=='hq') return; ui.q=ev.target.value;
  if(id==='hq'&&ui.view!=='ocorrencias'){ ui.fStatus='todas'; go('ocorrencias'); var q=document.getElementById('hq'); if(q){ q.focus(); q.setSelectionRange(q.value.length,q.value.length);} return; }
  var pos=ev.target.selectionStart; render(); var el=document.getElementById(id); if(el){ el.focus(); try{ el.setSelectionRange(pos,pos); }catch(e){} }
});
document.addEventListener('change', function(ev){
  if(ev.target.id!=='planfile'||!ev.target.files||!ev.target.files[0]) return; var file=ev.target.files[0]; toast('Processando planta…');
  var url=URL.createObjectURL(file), img=new Image();
  img.onload=function(){ var mx=1900, sc=Math.min(1,mx/Math.max(img.width,img.height)), c=document.createElement('canvas'); c.width=Math.round(img.width*sc); c.height=Math.round(img.height*sc);
    var g=c.getContext('2d'); g.fillStyle='#fff'; g.fillRect(0,0,c.width,c.height); g.drawImage(img,0,0,c.width,c.height); curFloor().plan=c.toDataURL('image/jpeg',.78); URL.revokeObjectURL(url); render(); commit(); toast('Planta carregada'); };
  img.onerror=function(){ toast('Não consegui ler essa imagem. Use JPG ou PNG.'); }; img.src=url;
});

/* ================= RELATÓRIOS (texto) ================= */
function reportText(){ var o=openOcc().filter(function(x){return !x.demo;}), rp=roundStats();
  var L=['CAPIM DOURADO SHOPPING – RESUMO OPERACIONAL','Data: '+fday(Date.now()),'','Ocorrências em aberto: '+o.length+' (críticas: '+o.filter(function(x){return x.prio==='Crítica';}).length+')'];
  o.sort(bySev).forEach(function(x){ L.push('• ['+x.prio+'] '+x.title+' – '+aname(x.areaId)+' ('+x.status+', '+x.resp+')'+(slaLeft(x)<0?' – SLA ESTOURADO':'')); });
  L.push('','Manutenções vencidas:'); S.equip.filter(function(e){return equipStatus(e).left<0;}).forEach(function(e){ L.push('• '+e.name+' – '+Math.abs(equipStatus(e).left)+' dias de atraso'); });
  L.push('','Ronda de hoje: '+rp.pct+'% concluída, '+rp.nok+' problema(s).'); return L.join('\n'); }
function csvText(){ var h=['Título','Piso','Área','Categoria','Criticidade','Status','Equipe','Aberto em','Resolvido em','Dentro do SLA'];
  return [h.join(';')].concat(S.occ.filter(function(o){return !o.demo;}).map(function(o){ var a=area(o.areaId)||{}; return [o.title,fname(a.floorId),a.name,o.cat,o.prio,o.status,o.resp,fshort(o.created),o.resolved?fshort(o.resolved):'',isOpen(o)?'':(slaLeft(o)>=0?'Sim':'Não')].map(function(v){return '"'+String(v||'').replace(/"/g,'""')+'"';}).join(';'); })).join('\n'); }
function copyText(t,msg){ if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function(){toast(msg);},function(){toast('Não foi possível copiar');}); else toast('Não foi possível copiar'); }

var toastT; function toast(msg){ var t=document.getElementById('toast'); if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); } t.textContent=msg; t.style.display='block'; clearTimeout(toastT); toastT=setTimeout(function(){ t.style.display='none'; },2800); }

/* ================= RELÓGIO / SLA AO VIVO ================= */
function tick(){ var n=new Date(), ct=document.getElementById('ctime'), cd=document.getElementById('cdate');
  if(ct) ct.textContent=pad(n.getHours())+':'+pad(n.getMinutes()); if(cd) cd.textContent=fday(n);
  var sl=document.getElementById('sla'); if(sl){ var o=occById(sl.getAttribute('data-id')); if(o&&isOpen(o)){ var l=slaLeft(o); sl.textContent=(l<0?'-':'')+hms(l); sl.className='sla '+(l<0?'':l<SLA_H[o.prio]*HOUR*.3?'warn':'ok'); } } }
setInterval(tick,1000);

// Controles de projeção acadêmica
document.addEventListener('change',function(ev){if(ev.target && ev.target.id==='lab-budget-range'){lab.budget=+ev.target.value;render();}});
render();
})();
