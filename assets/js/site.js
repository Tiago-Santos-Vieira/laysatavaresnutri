/* Laysa Tavares Nutricionista: movimento e interações do site principal.
   Sem GSAP ou com "menos movimento" ligado, tudo aparece parado e funcionando. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var comGsap = !!(window.gsap && window.ScrollTrigger && window.SplitText && window.Lenis);
  var movimento = comGsap && !reduz;
  if (!movimento) doc.classList.add('sem-movimento');

  var lenis = null;
  var ui = $('.ui'), progresso = $('.progresso');

  /* ---------- Cor da interface fixa conforme o fundo da seção ---------- */
  function tema(t) {
    if (!ui || doc.classList.contains('menu-aberto')) return;
    ui.setAttribute('data-ui', t); progresso && progresso.setAttribute('data-ui', t);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target.getAttribute('data-tema');
        if (e.target.id === 'visita') { if (movimento) return; t = 'claro'; }
        tema(t);
      });
    }, { rootMargin: '0px 0px -92% 0px' });
    $$('[data-tema]').forEach(function (s) { io.observe(s); });
  }

  /* ---------- Cena do topo: só entra se os arquivos existirem ---------- */
  (function () {
    var box = $('.topo_cena'); if (!box || !box.hasAttribute('data-ligada')) return;
    var dia = new Image(); dia.alt = ''; dia.decoding = 'async';
    dia.onload = function () {
      box.appendChild(dia); $('.topo').classList.add('tem-cena');
      var noite = new Image(); noite.alt = ''; noite.decoding = 'async'; noite.setAttribute('data-off', '');
      noite.onload = function () {
        box.appendChild(noite);
        var clima = $('.clima'); clima.hidden = false;
        $$('button', clima).forEach(function (b) {
          b.addEventListener('click', function () {
            var n = b.getAttribute('data-clima') === 'noite';
            $$('button', clima).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
            if (n) { noite.removeAttribute('data-off'); } else { noite.setAttribute('data-off', ''); }
          });
        });
      };
      noite.src = box.getAttribute('data-cena-noite');
    };
    dia.src = box.getAttribute('data-cena-dia');
  })();

  /* ---------- Poeira de luz no topo (pausa fora da tela) ---------- */
  (function () {
    var c = $('.poeira');
    if (!c || !c.getContext || reduz) return;
    var g = c.getContext('2d'), d = Math.min(devicePixelRatio || 1, 2), w = 0, h = 0, pts = [], ativo = true, raf = 0;
    function tam() { var r = c.getBoundingClientRect(); w = c.width = Math.round(r.width * d); h = c.height = Math.round(r.height * d); }
    tam(); addEventListener('resize', tam);
    for (var i = 0; i < 46; i++) pts.push({ x: Math.random(), y: Math.random(), r: .5 + Math.random() * 1.6, s: .00016 + Math.random() * .00045, a: .18 + Math.random() * .5, p: Math.random() * 6.3 });
    function quadro(t) {
      g.clearRect(0, 0, w, h);
      for (var i = 0; i < pts.length; i++) {
        var q = pts[i]; q.y -= q.s; if (q.y < -.02) { q.y = 1.02; q.x = Math.random(); }
        g.beginPath(); g.arc(q.x * w + Math.sin(t / 3400 + q.p) * 12 * d, q.y * h, q.r * d, 0, 6.3);
        g.fillStyle = 'rgba(227,207,159,' + (q.a * (.55 + .45 * Math.sin(t / 950 + q.p))).toFixed(3) + ')'; g.fill();
      }
      if (ativo) raf = requestAnimationFrame(quadro);
    }
    raf = requestAnimationFrame(quadro);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
      ativo = es[0].isIntersecting; cancelAnimationFrame(raf); if (ativo) raf = requestAnimationFrame(quadro);
    }).observe($('.topo'));
  })();

  /* ---------- Formulário: monta a mensagem e abre o WhatsApp ---------- */
  (function () {
    var f = $('#form-contato'); if (!f) return;
    function erro(campo, msg, ligado) {
      var el = $('#' + msg); campo.setAttribute('aria-invalid', String(ligado)); if (el) el.hidden = !ligado;
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = f.nome.value.trim(), interesse = f.interesse.value, mod = (f.querySelector('input[name="modalidade"]:checked') || {}).value || 'presencial', msg = f.mensagem.value.trim();
      erro(f.nome, 'e-nome', !nome); erro(f.interesse, 'e-interesse', !interesse);
      if (!nome) { f.nome.focus(); return; }
      if (!interesse) { f.interesse.focus(); return; }
      var texto = 'Olá, Laysa! Meu nome é ' + nome + '. Tenho interesse em ' + interesse.toLowerCase() + ' (atendimento ' + mod + ').' + (msg ? '\n\n' + msg : '');
      if (window.fbq) window.fbq('track', 'Contact');
      window.open('https://wa.me/5573982141269?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    });
    ['nome', 'interesse'].forEach(function (n) {
      f[n].addEventListener('input', function () { if (f[n].value.trim()) erro(f[n], 'e-' + n, false); });
      f[n].addEventListener('change', function () { if (f[n].value.trim()) erro(f[n], 'e-' + n, false); });
    });
  })();

  /* Todo clique que leva ao WhatsApp conta como contato (quando houver Pixel da Meta). */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (a && window.fbq) window.fbq('track', 'Contact');
  }, true);

  /* ---------- Menu em tela cheia ---------- */
  var menu = $('#menu'), menuBtn = $('.menu_btn');
  function abreMenu() {
    menu.hidden = false; doc.classList.add('menu-aberto');
    ui.setAttribute('data-ui', 'escuro'); progresso && progresso.setAttribute('data-ui', 'escuro');
    menuBtn.setAttribute('aria-expanded', 'true'); $('.menu_btn_t').textContent = 'Fechar';
    if (lenis) lenis.stop();
    if (movimento) gsap.fromTo($$('.menu_links a, .menu_pe'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .05, ease: 'expo.out' });
    var p = $('.menu_links a'); p && p.focus();
  }
  function fechaMenu(volta) {
    menu.hidden = true; doc.classList.remove('menu-aberto');
    menuBtn.setAttribute('aria-expanded', 'false'); $('.menu_btn_t').textContent = 'Menu';
    if (lenis) lenis.start();
    if (volta) menuBtn.focus();
  }
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', function () { menu.hidden ? abreMenu() : fechaMenu(true); });
    document.addEventListener('keydown', function (e) {
      if (menu.hidden) return;
      if (e.key === 'Escape') { fechaMenu(true); return; }
      if (e.key === 'Tab') {
        var foco = [menuBtn].concat($$('a, button', menu)), i = foco.indexOf(document.activeElement);
        e.preventDefault();
        foco[(i + (e.shiftKey ? -1 : 1) + foco.length) % foco.length].focus();
      }
    });
  }

  /* ---------- Âncoras (rolagem suave e foco no destino) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var alvo = document.getElementById(id.slice(1)); if (!alvo) return;
    e.preventDefault();
    if (menu && !menu.hidden) fechaMenu(false);
    var foca = function () { alvo.setAttribute('tabindex', '-1'); alvo.focus({ preventScroll: true }); };
    if (lenis) lenis.scrollTo(alvo, { duration: 1.4, onComplete: foca });
    else { alvo.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' }); foca(); }
    history.replaceState(null, '', id);
  });

  /* ---------- No celular, a interface fixa some ao descer e volta ao subir ---------- */
  (function () {
    var ultimo = scrollY;
    addEventListener('scroll', function () {
      var y = scrollY, desce = y > ultimo + 4, sobe = y < ultimo - 4;
      if (desce && y > 160 && !doc.classList.contains('menu-aberto')) ui.classList.add('recolhida');
      else if (sobe || y < 160) ui.classList.remove('recolhida');
      if (desce || sobe) ultimo = y;
    }, { passive: true });
  })();

  /* ---------- WhatsApp flutuante no celular: depois do topo, some no contato ---------- */
  (function () {
    var b = $('.wa-flutua'), topo = $('.topo'), contato = $('#contato'), rodape = $('.rodape'); if (!b) return;
    function ve() {
      var h = innerHeight, passou = topo.getBoundingClientRect().bottom < h * .2;
      var c = contato.getBoundingClientRect(), r = rodape.getBoundingClientRect();
      var perto = (c.top < h && c.bottom > 0) || r.top < h;
      b.classList.toggle('on', passou && !perto);
    }
    addEventListener('scroll', ve, { passive: true }); ve();
  })();

  if (!movimento) {
    $$('.topo [data-entrada], .topo_logo img').forEach(function (el) { el.style.opacity = 1; });
    return;
  }

  /* ================= A partir daqui, só com movimento ================= */
  gsap.registerPlugin(ScrollTrigger, SplitText);

  lenis = new Lenis({ lerp: .1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);

  /* ---------- Entrada do topo ---------- */
  var entrada = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' }, onComplete: function () { doc.classList.add('entrou'); } })
    .fromTo('.topo_arco', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.4 }, 0)
    .fromTo('.topo_arco img', { scale: 1.16 }, { scale: 1, duration: 1.9 }, 0)
    .fromTo('.topo_logo_serifa', { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 1.2 }, .35)
    .fromTo('.topo_logo_escrita', { autoAlpha: 1, clipPath: 'inset(-10% 100% -10% 0%)' }, { clipPath: 'inset(-10% 0% -10% 0%)', duration: 1.7, ease: 'power2.inOut' }, .8)
    .fromTo('.topo_lado, .topo_frase', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, stagger: .08 }, 1)
    .fromTo('.topo_pe [data-entrada]', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1, stagger: .1 }, 1.15);

  var abertura = $('.abertura');
  if (doc.classList.contains('sem-abertura') || !abertura) {
    entrada.play();
  } else {
    try { sessionStorage.setItem('lt-abertura', '1'); } catch (e) {}
    lenis.stop();
    var circ = $('.abertura_marca circle'), L = 2 * Math.PI * 56;
    gsap.set(circ, { strokeDasharray: L, strokeDashoffset: L });
    gsap.timeline()
      .to(circ, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' })
      .from('.abertura_marca span', { autoAlpha: 0, y: 10, duration: .6, ease: 'power2.out' }, .35)
      .to('.abertura_marca', { autoAlpha: 0, scale: .92, duration: .45, ease: 'power2.in' }, 1.2)
      .to(abertura, { yPercent: -100, borderBottomLeftRadius: '50% 22vh', borderBottomRightRadius: '50% 22vh', duration: 1.15, ease: 'expo.inOut' }, 1.25)
      .add(function () { entrada.play(); }, 1.7)
      .add(function () { abertura.style.display = 'none'; lenis.start(); });
  }

  /* ---------- Títulos: sobem; a palavra manuscrita se escreve ---------- */
  $$('main .titulo').forEach(function (t) {
    if (t.closest('.visita')) return;
    var em = $('em', t);
    var tl = gsap.timeline({ scrollTrigger: { trigger: t, start: 'top 86%', once: true } })
      .from(t, { y: 50, autoAlpha: 0, duration: 1.1, ease: 'expo.out' });
    if (em) tl.fromTo(em, { clipPath: 'inset(-40% 100% -40% -10%)' }, { clipPath: 'inset(-40% -10% -40% -10%)', duration: 1.2, ease: 'power2.inOut' }, .35);
  });

  /* ---------- Manifesto: as palavras acendem com a rolagem ---------- */
  var frase = $('[data-palavras]');
  if (frase) {
    var sp = SplitText.create(frase, { type: 'words', wordsClass: 'palavra' });
    gsap.to(sp.words, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 62%', end: 'bottom 72%', scrub: true } });
  }

  /* ---------- Método: trilho horizontal no computador ---------- */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', function () {
    doc.classList.add('horizontal');
    var trilho = $('.metodo_trilho');
    var dist = function () { return Math.max(0, trilho.scrollWidth - innerWidth); };
    var anda = gsap.to(trilho, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: '.metodo', start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true } });
    $$('.pilar').forEach(function (p) {
      gsap.from($$('.pilar_n, .pilar_i, h3, p', p), { y: 46, autoAlpha: 0, duration: 1, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: p, containerAnimation: anda, start: 'left 82%', toggleActions: 'play none none reverse' } });
    });
    return function () { doc.classList.remove('horizontal'); };
  });

  /* ---------- Bioimpedância: o anel se desenha, um indicador por vez ---------- */
  (function () {
    var arcos = $$('.bio_arco'), itens = $$('.bio_i'); if (!arcos.length) return;
    var tl = gsap.timeline({ scrollTrigger: { trigger: '.bio_anel', start: 'top 78%', end: 'bottom 62%', scrub: 1 } });
    arcos.forEach(function (a, i) {
      var l = a.getTotalLength(); gsap.set(a, { strokeDasharray: l, strokeDashoffset: l });
      tl.to(a, { strokeDashoffset: 0, duration: 1, ease: 'none' }, i)
        .fromTo(itens[i], { autoAlpha: .15, y: 10 }, { autoAlpha: 1, y: 0, duration: .6, ease: 'none' }, i + .3);
    });
    tl.fromTo('.bio_centro', { autoAlpha: 0, scale: .92 }, { autoAlpha: 1, scale: 1, duration: 1, ease: 'none' }, 0);
  })();

  /* ---------- Caminho: a linha se desenha e acende cada etapa ---------- */
  mm.add('(min-width: 1024px)', function () {
    var caixa = $('.caminho_linha'), path = $('.caminho_linha path'), passos = $$('.caminho_passos li'); if (!path) return;
    var L = path.getTotalLength(), pontos = [];
    passos.forEach(function (li, i) {
      var alvo = 1200 * (i + .5) / passos.length, lo = 0, hi = L;
      for (var k = 0; k < 24; k++) { var m = (lo + hi) / 2; if (path.getPointAtLength(m).x < alvo) lo = m; else hi = m; }
      var pt = path.getPointAtLength(lo), dot = document.createElement('span');
      dot.className = 'caminho_ponto'; dot.style.left = (pt.x / 12) + '%'; dot.style.top = (pt.y / 140 * 100) + '%';
      caixa.appendChild(dot); pontos.push({ f: lo / L, dot: dot, li: li });
    });
    gsap.set(path, { strokeDasharray: L, strokeDashoffset: L });
    gsap.set(passos, { autoAlpha: .25 });
    gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.caminho', start: 'top 55%', end: 'bottom 85%', scrub: 1, onUpdate: function (s) {
      pontos.forEach(function (p) { var on = s.progress >= p.f - .01; p.dot.classList.toggle('on', on); gsap.to(p.li, { autoAlpha: on ? 1 : .25, duration: .4, overwrite: 'auto' }); });
    } } });
    return function () { pontos.forEach(function (p) { p.dot.remove(); }); gsap.set(passos, { clearProps: 'all' }); };
  });
  mm.add('(max-width: 1023px)', function () {
    $$('.caminho_passos li').forEach(function (li) {
      gsap.from(li, { y: 30, autoAlpha: 0, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 88%', once: true } });
    });
  });

  /* ---------- Sobre: a foto se abre do centro ---------- */
  gsap.fromTo('.sobre_foto img', { clipPath: 'inset(16% 16% 16% 16% round 4px)', scale: 1.12 }, { clipPath: 'inset(0% 0% 0% 0% round 4px)', scale: 1, ease: 'none', scrollTrigger: { trigger: '.sobre_foto', start: 'top 88%', end: 'center 52%', scrub: 1 } });

  /* ---------- Visita: o círculo cresce e revela a cidade ----------
     Sem anticipatePin: com a rolagem suave ele travava a seção cedo e o círculo pulava ~110px.
     A interface fixa só fica escura quando o círculo creme já passou por baixo dela. */
  var circulo = $('.visita_circulo');
  gsap.set('.visita_texto', { autoAlpha: 0 });
  gsap.timeline({ scrollTrigger: { trigger: '.visita', start: 'top top', end: '+=110%', pin: true, scrub: 1,
      onUpdate: function () {
        var raio = gsap.getProperty(circulo, 'scale') * circulo.offsetWidth / 2;
        tema(raio > Math.hypot(innerWidth / 2, innerHeight / 2) * .92 ? 'claro' : 'escuro');
      } } })
    .to(circulo, { scale: 1, ease: 'power1.in', duration: 1 })
    .fromTo('.visita_texto', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .3, ease: 'power2.out' }, .52);

  /* ---------- Barra de progresso ---------- */
  var barra = $('.progresso b');
  if (barra) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) { barra.style.transform = 'scaleY(' + s.progress.toFixed(3) + ')'; } });

  /* Fontes e imagens mudam as alturas: recalcula quando tudo carregar. */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
