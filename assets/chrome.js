/* Karla & Jonty — shared chrome: nav + footer injected on every page.
   Set <body data-page="home|story|rsvp|venue|stay|gallery|registry|quiz">. */
(function () {
  'use strict';

  var LINKS = [
    { key: 'home',     label: 'Home',        href: 'index.html' },
    { key: 'story',    label: 'Our Story',   href: 'our-story.html' },
    { key: 'rsvp',     label: 'RSVP',        href: 'rsvp.html' },
    { key: 'venue',    label: 'Venue',       href: 'venue.html' },
    { key: 'stay',     label: 'Stay',        href: 'accommodation.html' },
    { key: 'registry', label: 'Registry',    href: 'registry.html' },
    { key: 'quiz',     label: 'Quiz',        href: 'quiz.html' },
    { key: 'faq',      label: 'FAQ',         href: 'faq.html' }
  ];

  var active = document.body.getAttribute('data-page') || '';
  var BRAND = 'Jonty&nbsp;<span class="amp">&amp;</span>&nbsp;Karla';

  function linksHTML(cls) {
    return LINKS.map(function (l) {
      var cur = l.key === active ? ' aria-current="page"' : '';
      return '<a href="' + l.href + '"' + cur + '>' + l.label + '</a>';
    }).join('');
  }

  /* ---- NAV ---- */
  var navHost = document.getElementById('site-nav');
  if (navHost) {
    navHost.innerHTML =
      '<header class="nav" data-scrolled="false">' +
        '<a class="nav__brand" href="index.html">' + BRAND + '</a>' +
        '<nav class="nav__links">' + linksHTML() + '</nav>' +
        '<button class="nav__toggle" aria-label="Open menu"><span></span><span></span><span></span></button>' +
      '</header>' +
      '<div class="nav__drawer" data-open="false">' +
        linksHTML() +
        '<p class="eyebrow">5 December 2026 &middot; Robertson</p>' +
      '</div>';
  }

  /* ---- FOOTER ---- */
  var footHost = document.getElementById('site-foot');
  if (footHost) {
    footHost.innerHTML =
      '<footer class="foot">' +
        '<p class="eyebrow eyebrow--sage" style="margin-bottom:1.4rem;">Hou ons datum oop</p>' +
        '<p class="foot__mono display">Jonty <span class="amp" style="font-style:italic;">&amp;</span> Karla</p>' +
        '<nav class="foot__links">' + linksHTML() + '</nav>' +
        '<p class="foot__fine">5 December 2026 &middot; Duvon Wine Estate &middot; Robertson</p>' +
      '</footer>';
  }

  /* ---- Nav behaviour ---- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.dataset.scrolled = window.scrollY > 40 ? 'true' : 'false';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector('.nav__toggle');
  var drawer = document.querySelector('.nav__drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.dataset.open === 'true';
      drawer.dataset.open = open ? 'false' : 'true';
      toggle.classList.toggle('is-open', !open);
      document.body.style.overflow = open ? '' : 'hidden';
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.dataset.open = 'false';
        toggle.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }
})();
