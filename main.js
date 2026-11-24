(function () {
  'use strict';

  var COURSES = {
    'meta-ads': { n: '01', title: 'Meta Ads', color: 'green', open: true },
    'estrategia-de-contenidos': { n: '02', title: 'Estrategia de contenidos', color: 'coral', open: false },
    'google-analytics': { n: '03', title: 'Google Analytics 4', color: 'sun', open: false },
    'google-tag-manager': { n: '04', title: 'Google Tag Manager con Claude', color: 'lila', open: false }
  };
  var WA = '56951179298';
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
    else if (href === '#inscribete' || href.indexOf('/inscripcion') === 0) track('click_inscribirme', null, { ubicacion: a.getAttribute('data-cta') || 'otro', curso: pageCurso });
    else if (a.hasAttribute('data-curso')) track('click_curso', null, { curso: a.getAttribute('data-curso') });
  });

  /* ---------- WhatsApp flotante: aparece al pasar el hero ---------- */
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

  /* ---------- Videollamada: reloj y mensajes ---------- */
  var clock = document.getElementById('live-clock');
  if (clock && !reduce) {
    var t = 42 * 60 + 10;
    setInterval(function () {
      t++;
      var h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60;
      clock.textContent = [h, m, s].map(function (x) { return (x < 10 ? '0' : '') + x; }).join(':');
    }, 1000);
  }
  var toast = document.getElementById('live-chat');
  if (toast && !reduce) {
    var msgs = [
      ['Camila', '¿Por qué me subió el CPM?'],
      ['Osvaldo', 'Mira la frecuencia: ahí está la respuesta 👀'],
      ['Diego', '¡Ahora entendí el ROAS!'],
      ['Fran', '¿Publicamos la campaña hoy?']
    ];
    var mi = 0;
    setInterval(function () {
      mi = (mi + 1) % msgs.length;
      var d = toast.cloneNode(false);
      var b = document.createElement('b'); b.textContent = msgs[mi][0];
      d.appendChild(b); d.appendChild(document.createTextNode(msgs[mi][1]));
      toast.parentNode.replaceChild(d, toast);
      toast = d;
    }, 3000);
  }

  /* ---------- Formularios de inscripción ---------- */
  var startCurso = new URLSearchParams(location.search).get('curso');

  function cursoOf(form) {
    var f = form.querySelector('[name="curso_slug"]');
    return f && COURSES[f.value] ? f.value : 'meta-ads';
  }

  /* Página /inscripcion: el panel izquierdo toma el color y texto del curso */
  function paintPage(slug) {
    var c = COURSES[slug];
    document.body.className = 'c-' + c.color;
    document.getElementById('ins-n').textContent = c.n;
    document.getElementById('ins-title').textContent = c.title + '.';
    document.getElementById('ins-h1').firstChild.textContent = c.open ? 'Inscríbete en ' : 'Lista de espera: ';
    document.getElementById('ins-p').textContent = c.open
      ? 'Completa tus datos y te confirmamos por WhatsApp la fecha, el horario, el valor y tu cupo. Respondemos en menos de 24 h.'
      : 'Estamos preparando la primera edición. Déjanos tus datos y te avisamos primero cuando abran las inscripciones.';
    document.getElementById('ins-back').href = '/' + slug;
  }

  function paintForm(form) {
    var slug = cursoOf(form), c = COURSES[slug];
    form.querySelector('[name="tipo"]').value = c.open ? 'Inscripción' : 'Lista de espera';
    form.querySelector('[name="_subject"]').value = (c.open ? 'Inscripción: ' : 'Lista de espera: ') + c.title + ' — cuando quieras';
    form.querySelector('button[type="submit"]').textContent = c.open ? 'Enviar inscripción →' : 'Unirme a la lista →';
    if (document.getElementById('ins-l')) paintPage(slug);
  }

  document.querySelectorAll('form.js-ins').forEach(function (form) {
    var sel = form.querySelector('select[name="curso_slug"]');
    if (sel) {
      if (startCurso && COURSES[startCurso]) sel.value = startCurso;
      sel.addEventListener('change', function () { paintForm(form); });
    }
    paintForm(form);

    var card = form.closest('.fcard');
    var err = form.querySelector('.err');
    var btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      var bad = Array.prototype.filter.call(form.querySelectorAll('[required]'), function (f) { return !f.checkValidity(); });
      if (bad.length) {
        err.textContent = 'Revisa tu nombre, WhatsApp y correo para poder contactarte.';
        err.hidden = false; bad[0].focus(); return;
      }
      err.hidden = true;
      var slug = cursoOf(form), c = COURSES[slug];
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      delete data.curso_slug;
      data.curso = c.title;
      data.pagina = location.pathname;
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Enviando…';
      fetch(form.getAttribute('action').replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('send');
        var done = card.querySelector('.done');
        var first = (data.nombre || '').trim().split(' ')[0];
        done.querySelector('.done-h').textContent = '¡Listo' + (first ? ', ' + first : '') + '!';
        done.querySelector('.done-p').textContent = c.open
          ? 'Recibimos tu inscripción a ' + c.title + '. Te escribimos por WhatsApp en menos de 24 h para confirmar fecha, horario, valor y tu cupo.'
          : 'Quedaste en la lista de espera de ' + c.title + '. Te avisamos primero cuando abran las inscripciones.';
        done.querySelector('.done-wa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Hola, soy ' + (data.nombre || '') + '. Acabo de inscribirme en ' + c.title);
        form.hidden = true;
        var head = card.querySelector('.fcard-h'); if (head) head.hidden = true;
        done.hidden = false;
        card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        track('generate_lead', 'Lead', { form: 'inscripcion', curso: slug, tipo: data.tipo, pagina: location.pathname });
      }).catch(function () {
        err.textContent = 'No pudimos enviar el formulario. Escríbenos por WhatsApp al +56 9 5117 9298 o a osvaldo.hernandez.o@gmail.com.';
        err.hidden = false;
        btn.disabled = false; btn.textContent = label;
      });
    });
  });
})();
