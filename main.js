(function () {
  'use strict';

  var COURSES = {
    'meta-ads': { n: '01', title: 'Meta Ads', color: 'green', open: true },
    'estrategia-de-contenidos': { n: '02', title: 'Estrategia de contenidos', color: 'coral', open: false },
    'google-analytics': { n: '03', title: 'Google Analytics 4', color: 'sun', open: false },
    'google-tag-manager': { n: '04', title: 'Google Tag Manager con Claude', color: 'lila', open: false }
  };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Medición: GTM (dataLayer) + Meta Pixel ---------- */
  function track(gaEvent, fbEvent, params) {
    try { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: gaEvent }, params || {})); } catch (e) {}
    try { if (window.fbq && fbEvent) window.fbq('track', fbEvent, params || {}); } catch (e) {}
  }
  var mainCurso = document.querySelector('main[data-curso]');
  var pageCurso = mainCurso ? mainCurso.getAttribute('data-curso') : '';
  if (pageCurso) track('view_curso', 'ViewContent', { curso: pageCurso });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') > -1) track('whatsapp_click', 'Contact', { ubicacion: a.getAttribute('data-ubicacion') || 'otro', curso: pageCurso });
    else if (href.indexOf('/inscripcion') === 0) track('click_inscribirme', null, { ubicacion: a.getAttribute('data-cta') || 'otro', curso: pageCurso });
    else if (a.hasAttribute('data-curso')) track('click_curso', null, { curso: a.getAttribute('data-curso') });
  });

  /* ---------- WhatsApp flotante: se muestra al pasar el hero ---------- */
  var wa = document.querySelector('.wa');
  var heroEl = document.querySelector('.hero, .lhero');
  if (wa && heroEl) {
    var onScroll = function () {
      var limit = heroEl.offsetTop + heroEl.offsetHeight - window.innerHeight * 0.4;
      wa.classList.toggle('off', window.scrollY < limit);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ---------- Palabra que rota en el hero ---------- */
  var rot = document.getElementById('rot');
  if (rot && !reduce) {
    var words = [['Meta Ads', '#00E07A'], ['Analytics', '#FFC83D'], ['Tag Manager', '#9B8CFF'], ['contenidos', '#FF6B4A']];
    var wi = 0;
    setInterval(function () {
      wi = (wi + 1) % words.length;
      rot.style.background = words[wi][1];
      rot.innerHTML = '<span class="rot-word">' + words[wi][0] + '</span>';
    }, 2200);
  }

  /* ---------- Clase en vivo: reloj y chat ---------- */
  var clock = document.getElementById('live-clock');
  if (clock && !reduce) {
    var t = 42 * 60 + 10;
    setInterval(function () {
      t++;
      var h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60;
      clock.textContent = [h, m, s].map(function (x) { return (x < 10 ? '0' : '') + x; }).join(':');
    }, 1000);
  }
  var chat = document.getElementById('live-chat');
  if (chat) {
    var msgs = [
      ['Camila', '¿Por qué me subió tanto el CPM?', false],
      ['Osvaldo', 'Buena. Comparte pantalla y lo vemos en tu cuenta 👀', true],
      ['Diego', '¡Ahora sí entendí la frecuencia!', false],
      ['Osvaldo', 'Mañana publicamos la campaña en vivo 🚀', true]
    ];
    var mi = 0;
    var add = function () {
      var m = msgs[mi % msgs.length];
      var d = document.createElement('div');
      d.className = 'bub' + (m[2] ? ' me' : '');
      var b = document.createElement('b'); b.textContent = m[0];
      d.appendChild(b); d.appendChild(document.createTextNode(m[1]));
      chat.appendChild(d);
      while (chat.children.length > 2) chat.removeChild(chat.firstChild);
      mi++;
    };
    add(); add();
    if (!reduce) setInterval(add, 2600);
  }

  /* ---------- Inscripción ---------- */
  var form = document.getElementById('ins-form');
  if (!form) return;
  var sel = document.getElementById('f-curso');
  var start = new URLSearchParams(location.search).get('curso');
  if (start && COURSES[start]) sel.value = start;

  function paint() {
    var c = COURSES[sel.value];
    document.body.className = 'c-' + c.color;
    document.getElementById('ins-n').textContent = c.n;
    document.getElementById('ins-title').textContent = c.title + '.';
    document.getElementById('ins-h1').firstChild.textContent = c.open ? 'Inscríbete en ' : 'Lista de espera: ';
    document.getElementById('ins-p').textContent = c.open
      ? 'Completa tus datos y te confirmamos por WhatsApp la fecha, el horario, el valor y tu cupo. Respondemos en menos de 24 h.'
      : 'Estamos preparando la primera edición. Déjanos tus datos y te avisamos primero cuando abran las inscripciones.';
    document.getElementById('ins-back').href = '/' + sel.value;
    document.getElementById('f-tipo').value = c.open ? 'Inscripción' : 'Lista de espera';
    document.getElementById('f-subject').value = (c.open ? 'Inscripción: ' : 'Lista de espera: ') + c.title + ' — cuando quieras';
    document.getElementById('ins-send').textContent = c.open ? 'Enviar inscripción →' : 'Unirme a la lista →';
  }
  sel.addEventListener('change', paint);
  paint();

  var err = document.getElementById('ins-err');
  var btn = document.getElementById('ins-send');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (btn.disabled) return;
    var bad = Array.prototype.filter.call(form.querySelectorAll('[required]'), function (f) { return !f.checkValidity(); });
    if (bad.length) {
      err.textContent = 'Revisa tu nombre, WhatsApp y correo para poder contactarte.';
      err.hidden = false; bad[0].focus(); return;
    }
    err.hidden = true;
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    var c = COURSES[sel.value];
    data.curso = c.title;
    var label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Enviando…';
    fetch(form.getAttribute('action').replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error('send');
      form.hidden = true;
      var first = (data.nombre || '').trim().split(' ')[0];
      document.getElementById('done-h').textContent = '¡Listo' + (first ? ', ' + first : '') + '!';
      document.getElementById('done-p').textContent = c.open
        ? 'Recibimos tu inscripción a ' + c.title + '. Te escribimos por WhatsApp en menos de 24 h para confirmar fecha, horario, valor y tu cupo.'
        : 'Quedaste en la lista de espera de ' + c.title + '. Te avisamos primero cuando abran las inscripciones.';
      document.getElementById('done-wa').href = 'https://wa.me/56951179298?text=' + encodeURIComponent('Hola, soy ' + (data.nombre || '') + '. Acabo de inscribirme en ' + c.title);
      document.getElementById('ins-done').hidden = false;
      track('generate_lead', 'Lead', { form: 'inscripcion', curso: sel.value, tipo: data.tipo });
    }).catch(function () {
      err.textContent = 'No pudimos enviar el formulario. Escríbenos por WhatsApp al +56 9 5117 9298 o a osvaldo.hernandez.o@gmail.com.';
      err.hidden = false;
      btn.disabled = false; btn.textContent = label;
    });
  });
})();
