/* =====================================================================
   CAPIM DOURADO | CENTRAL OPERACIONAL — Tela de acesso
   Login de demonstração (projeto acadêmico). A verificação acontece
   no navegador, então serve para apresentação, não como segurança real.
   ===================================================================== */
(function () {
  'use strict';

  var KEY = 'cd_auth_v1';
  var CRED = 'c79a5497';          // assinatura de usuário + senha (FNV-1a)
  var MAX_TRIES = 5, LOCK_MS = 30000;

  function sign(s) {
    var x = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; }
    return x.toString(16);
  }
  function store(remember, user) {
    var v = JSON.stringify({ u: user, t: Date.now() });
    try { (remember ? localStorage : sessionStorage).setItem(KEY, v); } catch (e) {}
  }
  function session() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }

  window.CDAuth = {
    /* Para trocar usuário/senha: no console do navegador rode CDAuth.hash('usuario','senha')
       e cole o resultado na constante CRED no topo deste arquivo. */
    hash: function (u, p) { return sign(String(u).trim().toLowerCase() + '|' + p); },
    user: function () { var s = session(); return s && s.u ? s.u : ''; },
    logout: function () {
      try { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); } catch (e) {}
      location.reload();
    }
  };

  if (session()) return;

  document.documentElement.classList.add('cd-locked');

  var logo =
    '<svg viewBox="0 0 120 70" aria-hidden="true"><defs><linearGradient id="lgG" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#fff1b8"/><stop offset=".55" stop-color="#f2c14e"/><stop offset="1" stop-color="#a8761a"/></linearGradient></defs>' +
    (function () {
      var s = '';
      for (var i = 0; i < 13; i++) {
        var a = (-80 + i * (160 / 12)) * Math.PI / 180, len = 52 - Math.abs(6 - i) * 2.6;
        var x = 60 + Math.sin(a) * len, y = 66 - Math.cos(a) * len;
        s += '<path d="M60 66 Q' + (60 + Math.sin(a) * len * .5 + 3) + ' ' + (66 - Math.cos(a) * len * .55) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + '" stroke="url(#lgG)" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
      }
      return s;
    })() + '</svg>';

  var el = document.createElement('div');
  el.id = 'cd-login';
  el.innerHTML =
    '<canvas id="cdl-bg" aria-hidden="true"></canvas>' +
    '<div class="cdl-vignette"></div>' +
    '<div class="cdl-topbar"><span><i class="cdl-dot"></i>SISTEMA ONLINE</span><span class="cdl-hide-sm">CONEXÃO SEGURA · TLS</span><span id="cdl-clock">--:--:--</span></div>' +
    '<main class="cdl-wrap">' +
    '  <form class="cdl-card" id="cdl-form" autocomplete="on" novalidate>' +
    '    <span class="cdl-corner tl"></span><span class="cdl-corner tr"></span><span class="cdl-corner bl"></span><span class="cdl-corner br"></span>' +
    '    <div class="cdl-scan"></div>' +
    '    <div class="cdl-logo">' + logo + '</div>' +
    '    <div class="cdl-brand">CAPIM DOURADO <small>SHOPPING · PALMAS – TO</small></div>' +
    '    <h1>Central Operacional</h1>' +
    '    <p class="cdl-sub">Smart Operations · Acesso restrito à equipe</p>' +
    '    <label class="cdl-field"><span class="cdl-ico"><svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/></svg></span>' +
    '      <input id="cdl-user" name="username" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder=" " required><em>Usuário</em></label>' +
    '    <label class="cdl-field"><span class="cdl-ico"><svg viewBox="0 0 24 24"><path d="M6 10V7a6 6 0 0 1 12 0v3M5 10h14v11H5zM12 14v3"/></svg></span>' +
    '      <input id="cdl-pass" name="password" type="password" autocomplete="current-password" inputmode="text" placeholder=" " required><em>Senha</em>' +
    '      <button type="button" class="cdl-eye" id="cdl-eye" aria-label="Mostrar senha"><svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></button></label>' +
    '    <div class="cdl-row"><label class="cdl-check"><input type="checkbox" id="cdl-remember"><span></span>Manter conectado neste dispositivo</label></div>' +
    '    <div class="cdl-msg" id="cdl-msg" role="alert" aria-live="polite"></div>' +
    '    <button type="submit" class="cdl-btn" id="cdl-btn"><span class="cdl-btn-txt">ACESSAR SISTEMA</span><span class="cdl-btn-bar"></span></button>' +
    '    <div class="cdl-steps" id="cdl-steps"></div>' +
    '  </form>' +
    '  <p class="cdl-foot">Projeto acadêmico · Ambiente de simulação · v5.2</p>' +
    '</main>';
  document.body.appendChild(el);

  var form = el.querySelector('#cdl-form'), user = el.querySelector('#cdl-user'), pass = el.querySelector('#cdl-pass');
  var msg = el.querySelector('#cdl-msg'), btn = el.querySelector('#cdl-btn'), steps = el.querySelector('#cdl-steps');
  var tries = 0, lockedUntil = 0, busy = false;

  try { var lk = +sessionStorage.getItem(KEY + '_lock') || 0; if (lk > Date.now()) lockedUntil = lk; } catch (e) {}

  setTimeout(function () { user.focus(); }, 350);

  el.querySelector('#cdl-eye').addEventListener('click', function () {
    var show = pass.type === 'password';
    pass.type = show ? 'text' : 'password';
    this.classList.toggle('on', show);
    this.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
    pass.focus();
  });
  pass.addEventListener('keyup', function (e) {
    if (e.getModifierState && e.getModifierState('CapsLock')) say('Caps Lock está ativado.', 'warn');
    else if (msg.dataset.kind === 'warn') say('');
  });

  function say(t, kind) { msg.textContent = t || ''; msg.dataset.kind = kind || ''; msg.className = 'cdl-msg' + (t ? ' show ' + (kind || '') : ''); }

  function lockTick() {
    var left = Math.ceil((lockedUntil - Date.now()) / 1000);
    if (left > 0) {
      say('Muitas tentativas. Aguarde ' + left + 's para tentar de novo.', 'err');
      btn.disabled = true;
      setTimeout(lockTick, 500);
    } else {
      lockedUntil = 0; tries = 0; btn.disabled = false; say('');
    }
  }
  if (lockedUntil) lockTick();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy || lockedUntil > Date.now()) return;
    var u = user.value.trim(), p = pass.value;
    if (!u || !p) { say('Informe usuário e senha.', 'err'); shake(); (u ? pass : user).focus(); return; }
    busy = true; btn.disabled = true; form.classList.add('busy'); say('');
    var ok = sign(u.toLowerCase() + '|' + p) === CRED;
    var seq = ok
      ? ['Verificando credenciais…', 'Sincronizando gêmeo digital…', 'Carregando setores monitorados…', 'Acesso autorizado']
      : ['Verificando credenciais…'];
    var i = 0;
    (function next() {
      steps.innerHTML = seq.slice(0, i + 1).map(function (s, k) {
        var done = k < i || (ok && k === seq.length - 1);
        return '<div class="' + (done ? 'done' : 'run') + '"><i></i>' + s + '</div>';
      }).join('');
      i++;
      if (i < seq.length) { setTimeout(next, 420); return; }
      setTimeout(function () { ok ? success(u) : fail(); }, ok ? 420 : 650);
    })();
  });

  function shake() { form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake'); }

  function fail() {
    busy = false; form.classList.remove('busy'); steps.innerHTML = ''; btn.disabled = false;
    tries++;
    pass.value = ''; pass.focus(); shake();
    if (tries >= MAX_TRIES) {
      lockedUntil = Date.now() + LOCK_MS;
      try { sessionStorage.setItem(KEY + '_lock', String(lockedUntil)); } catch (e) {}
      lockTick();
    } else {
      say('Usuário ou senha inválidos. Tentativa ' + tries + ' de ' + MAX_TRIES + '.', 'err');
    }
  }

  function success(u) {
    var name = u.charAt(0).toUpperCase() + u.slice(1);
    store(el.querySelector('#cdl-remember').checked, name);
    form.classList.remove('busy'); form.classList.add('granted');
    btn.querySelector('.cdl-btn-txt').textContent = 'BEM-VINDO, ' + name.toUpperCase();
    var n = document.querySelector('.user-n');
    if (n && n.firstChild) n.firstChild.textContent = name;
    setTimeout(function () {
      el.classList.add('out');
      document.documentElement.classList.remove('cd-locked');
      setTimeout(function () { stop = true; if (el.parentNode) el.parentNode.removeChild(el); }, 900);
    }, 650);
  }

  /* Relógio */
  var clock = el.querySelector('#cdl-clock');
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  (function tick() {
    if (!el.parentNode) return;
    var d = new Date();
    clock.textContent = pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    setTimeout(tick, 1000);
  })();

  /* Fundo animado: grade em perspectiva + partículas douradas */
  var cv = el.querySelector('#cdl-bg'), ctx = cv.getContext('2d'), W = 0, H = 0, dpr = 1, stop = false;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var parts = [];
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, W * H / 16000));
    parts = [];
    for (var i = 0; i < n; i++) parts.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + .4, v: Math.random() * .35 + .08, p: Math.random() * 6.28 });
  }
  window.addEventListener('resize', size);
  size();
  var t0 = performance.now();
  function frame(now) {
    if (stop) return;
    var t = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    var hz = H * 0.58;
    // brilho do horizonte
    var g = ctx.createRadialGradient(W / 2, hz, 0, W / 2, hz, Math.max(W, H) * .7);
    g.addColorStop(0, 'rgba(233,185,73,.22)'); g.addColorStop(.35, 'rgba(94,242,255,.06)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // grade do piso
    ctx.lineWidth = 1;
    var off = reduce ? 0 : (t * .35) % 1;
    for (var i = 0; i < 22; i++) {
      var z = (i + off) / 22, y = hz + Math.pow(z, 2.2) * (H - hz) * 1.05;
      ctx.strokeStyle = 'rgba(233,185,73,' + (0.04 + z * .22).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (var k = -18; k <= 18; k++) {
      var xb = W / 2 + k * (W / 13);
      ctx.strokeStyle = 'rgba(94,242,255,' + (0.1 - Math.abs(k) * .004).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(W / 2 + k * 6, hz); ctx.lineTo(xb, H); ctx.stroke();
    }
    // linha do horizonte
    var hl = ctx.createLinearGradient(0, 0, W, 0);
    hl.addColorStop(0, 'rgba(233,185,73,0)'); hl.addColorStop(.5, 'rgba(255,214,120,.75)'); hl.addColorStop(1, 'rgba(233,185,73,0)');
    ctx.strokeStyle = hl; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, hz); ctx.lineTo(W, hz); ctx.stroke();
    // partículas
    for (var j = 0; j < parts.length; j++) {
      var q = parts[j];
      if (!reduce) { q.y -= q.v; if (q.y < -5) { q.y = H + 5; q.x = Math.random() * W; } }
      var a = .25 + .45 * (0.5 + 0.5 * Math.sin(t * 1.6 + q.p));
      ctx.fillStyle = j % 4 ? 'rgba(247,215,122,' + a.toFixed(2) + ')' : 'rgba(94,242,255,' + (a * .8).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 6.283); ctx.fill();
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
