(function () {
  'use strict';

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
    { me: false, text: 'Ya está en tu Monitor. En vivo.' },
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
      }).catch(function () {
        if (failed) failed.hidden = false;
        if (btn) { btn.disabled = false; btn.textContent = 'Enviar, cuando quieras →'; }
      });
    });
  }
})();
