(function () {
  'use strict';

  /* ---------- Medición: GTM (dataLayer) + Meta Pixel ---------- */
  function track(gaEvent, fbEvent, params) {
    try { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: gaEvent }, params || {})); } catch (e) {}
    try { if (window.fbq && fbEvent) window.fbq('track', fbEvent, params || {}); } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') > -1) track('whatsapp_click', 'Contact', { ubicacion: 'boton_flotante' });
    else if (href.indexOf('ejemplo-ecosistema') > -1) track('ver_ejemplo', null, { herramienta: 'monitor' });
    else if (href.indexOf('radarejemplo') > -1) track('ver_ejemplo', null, { herramienta: 'radar' });
  });

  /* ---------- Menú hamburguesa ---------- */
  var menu = document.getElementById('cq-menu');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    document.querySelectorAll('[data-menu-toggle]').forEach(function (b) {
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  document.querySelectorAll('[data-menu-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  });
  document.querySelectorAll('[data-menu-close]').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) setMenu(false);
  });

  /* ---------- Chat animado del hero ---------- */
  var chat = document.getElementById('cq-chat');
  var status = document.getElementById('cq-status');
  var lines = [
    { me: true, text: '¿Me pueden mandar el reporte?' },
    { me: false, text: 'Ya lo tienes en vivo, cuando quieras.' },
    { me: true, text: '¿Y si quiero cambiar la campaña?' },
    { me: false, text: 'La revisamos hoy mismo.' },
    { me: true, text: '¿Cuándo hablamos?' },
    { me: false, text: 'Cuando quieras.' }
  ];
  var CHECKS = '<svg width="16" height="11" viewBox="0 0 18 12" fill="none" aria-hidden="true"><path d="M1 6.5L4.5 10L11 2" stroke="#00A85A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 6.5L10.5 10L17 2" stroke="#00A85A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var step = 0, typing = false, hold = 0, typingEl = null;

  function bubble(line) {
    var d = document.createElement('div');
    d.className = 'cq-msg';
    if (line.me) {
      d.style.cssText = 'align-self:flex-end;max-width:80%;background:#2A2A2C;padding:11px 14px;font-size:15px;line-height:1.4;color:#E4E4DF';
      d.textContent = line.text;
    } else {
      d.style.cssText = 'align-self:flex-start;max-width:80%;background:#F3F3EF;color:#0B0B0C;padding:11px 14px;font-size:15px;line-height:1.4;font-weight:500;display:flex;align-items:center;gap:8px';
      var t = document.createElement('span');
      t.textContent = line.text;
      d.appendChild(t);
      d.insertAdjacentHTML('beforeend', CHECKS);
    }
    return d;
  }
  function showTyping(on) {
    typing = on;
    if (status) status.textContent = on ? 'escribiendo…' : 'en línea';
    if (on && !typingEl) {
      typingEl = document.createElement('div');
      typingEl.setAttribute('aria-label', 'escribiendo');
      typingEl.style.cssText = 'align-self:flex-start;display:flex;gap:5px;background:#F3F3EF;padding:13px 15px';
      typingEl.innerHTML = '<span class="cq-dot1" style="width:7px;height:7px;border-radius:50%;background:#0B0B0C"></span><span class="cq-dot2" style="width:7px;height:7px;border-radius:50%;background:#0B0B0C"></span><span class="cq-dot3" style="width:7px;height:7px;border-radius:50%;background:#0B0B0C"></span>';
      chat.appendChild(typingEl);
    } else if (!on && typingEl) {
      typingEl.remove();
      typingEl = null;
    }
  }
  function tick() {
    if (step >= lines.length) {
      if (hold >= 3) { chat.innerHTML = ''; typingEl = null; step = 0; hold = 0; showTyping(false); }
      else hold++;
      return;
    }
    var next = lines[step];
    if (!next.me && !typing) { showTyping(true); return; }
    showTyping(false);
    chat.appendChild(bubble(next));
    step++;
  }
  if (chat) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      lines.forEach(function (l) { chat.appendChild(bubble(l)); });
    } else {
      setInterval(tick, 1300);
    }
  }

  /* ---------- Formulario de contacto (FormSubmit) ---------- */
  var form = document.getElementById('cq-form');
  var sent = document.getElementById('cq-sent');
  var failed = document.getElementById('cq-failed');
  var btn = document.getElementById('cq-send');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn && btn.disabled) return;
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
      if (failed) failed.hidden = true;
      fetch(form.getAttribute('action').replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('send');
        form.hidden = true;
        if (sent) sent.hidden = false;
        track('generate_lead', 'Lead', { form: 'contacto', tema: data.tema || '' });
      }).catch(function () {
        if (failed) failed.hidden = false;
        if (btn) { btn.disabled = false; btn.textContent = 'Agendar mi reunión →'; }
      });
    });
  }
})();

/* ---------- Selector de especialidades ---------- */
(function () {
  var SV = [
    ['Marca', 'Creamos tu marca y cómo se comportará.', 'Estrategia de marca, estrategia de contenidos y social media.'],
    ['Performance', 'Te ayudamos a cumplir tus objetivos con performance.', 'Pauta full funnel en Meta, Google, TikTok y Pinterest. Diseño de anuncios para generar venta. Métricas con GA4, GTM, Clarity y más.'],
    ['E-commerce', 'Gestionamos y potenciamos tu tienda online.', 'Creación de tiendas, mailing, descuentos y promociones que mueven la venta.'],
    ['Auditoría', 'Analizamos tu negocio, tu marca y por dónde puede crecer, con una auditoría.', 'Te ayudamos en tu operación de marketing: revisamos todo lo que haces y encontramos mejoras, oportunidades y hallazgos.'],
    ['Clases', 'Enseñamos a todos quienes quieran potenciar sus negocios o carreras.', 'Clases a la medida de performance (Meta Ads), marcajes, estrategia y más.']
  ];
  var btns = document.querySelectorAll('[data-svc]');
  var nEl = document.getElementById('cq-svc-n'), nameEl = document.getElementById('cq-svc-name');
  var bEl = document.getElementById('cq-svc-bajada'), dEl = document.getElementById('cq-svc-detalle');
  function pick(i) {
    btns.forEach(function (b, k) {
      var on = k === i;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.opacity = on ? '1' : '0.45';
      var dot = b.querySelector('.cq-svc-dot');
      if (dot) dot.style.background = on ? '#00E07A' : 'transparent';
    });
    nEl.textContent = '0' + (i + 1);
    nameEl.textContent = SV[i][0];
    dEl.textContent = SV[i][2];
    bEl.textContent = SV[i][1];
    bEl.classList.remove('cq-msg'); void bEl.offsetWidth; bEl.classList.add('cq-msg');
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () { pick(+b.getAttribute('data-svc')); });
  });
})();
