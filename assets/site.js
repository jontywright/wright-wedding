/* Karla & Jonty — shared behaviour */
(function () {
  'use strict';

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Countdown (supports multiple) ---- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var clocks = [].slice.call(document.querySelectorAll('[data-countdown]')).map(function (cd) {
    return {
      target: new Date(cd.getAttribute('data-countdown')).getTime(),
      d: cd.querySelector('[data-unit="days"]'),
      h: cd.querySelector('[data-unit="hours"]'),
      m: cd.querySelector('[data-unit="minutes"]'),
      s: cd.querySelector('[data-unit="seconds"]')
    };
  });
  if (clocks.length) {
    var tickAll = function () {
      var now = Date.now();
      clocks.forEach(function (c) {
        var diff = c.target - now;
        if (diff < 0) diff = 0;
        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        if (c.d) c.d.textContent = d;
        if (c.h) c.h.textContent = pad(h);
        if (c.m) c.m.textContent = pad(m);
        if (c.s) c.s.textContent = pad(s);
      });
    };
    tickAll();
    setInterval(tickAll, 1000);
  }

  /* ---- Copy to clipboard ([data-copy]) ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var val = btn.getAttribute('data-copy');
    var done = function () {
      var old = btn.textContent;
      btn.textContent = 'Copied';
      btn.classList.add('done');
      setTimeout(function () { btn.textContent = old; btn.classList.remove('done'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(val).then(done).catch(done);
    } else {
      var t = document.createElement('textarea');
      t.value = val; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(t); done();
    }
  });
  /* ---- Gallery lightbox ---- */
  var lb = document.querySelector('.lb');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var gimgs = [].slice.call(document.querySelectorAll('.gimg'));
    var idx = -1;
    var show = function (i) {
      idx = (i + gimgs.length) % gimgs.length;
      var src = gimgs[idx].getAttribute('data-full') || gimgs[idx].src;
      lbImg.src = src;
      lbImg.alt = gimgs[idx].alt || '';
    };
    var open = function (i) { show(i); lb.dataset.open = 'true'; document.body.style.overflow = 'hidden'; };
    var close = function () { lb.dataset.open = 'false'; document.body.style.overflow = ''; };
    gimgs.forEach(function (im, i) { im.addEventListener('click', function () { open(i); }); });
    lb.querySelector('.lb__close').addEventListener('click', close);
    lb.querySelector('.lb__nav.prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.lb__nav.next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.dataset.open !== 'true') return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
})();
