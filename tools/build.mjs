// Сборка страниц: index.html (RU) и en/index.html (EN) из assets/js/config.js + data.js + calc.js.
// Весь текст, цены, FAQ и JSON-LD оказываются прямо в HTML: поисковик видит их без JS, первый экран рисуется сразу.
// Запуск после правки config.js или data.js:   node tools/build.mjs
// Проверка, что страницы свежие (для CI):      node tools/build.mjs --check
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { S } from './strings.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(ROOT + p, 'utf8');
const W = {};
vm.runInNewContext(['config', 'data', 'calc'].map((f) => read(`assets/js/${f}.js`)).join('\n;\n'), { window: W, globalThis: W });
const { CONFIG: C, SERVICES, CALC, PACKAGES, PROJECTS, PROCESS, FAQ, DIARY, KCalc } = W;

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? `{${k}}`);
const BOT = (payload) => `https://t.me/${C.bot}?start=${payload}`;
const CUR = { ru: 'BYN', en: 'USD' };
const SVG = {
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  tg: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.5 4.2 18.4 19c-.2 1-.9 1.3-1.8.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.2 12.7l-4.7-1.5c-1-.3-1-1 .2-1.5L20.1 2.6c.9-.3 1.6.2 1.4 1.6z"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

// Деньги как в main.js: BYN до 10, ₽ до 100, $ до 5.
function money(byn, cur) {
  const v = byn * C.rates[cur];
  const step = cur === 'RUB' ? 100 : cur === 'USD' ? 5 : 10;
  const r = Math.max(step, Math.round(v / step) * step);
  const n = String(r).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return cur === 'USD' ? `$${n}` : `${n} ${cur === 'RUB' ? '₽' : 'BYN'}`;
}
const m = (byn, lang) => `<span class="m" data-byn="${byn}">${money(byn, CUR[lang])}</span>`;
// Диапазон одной строкой: «460–720 BYN», «$140–215».
function moneyRange(lo, hi, cur) {
  const [a, b] = [money(lo, cur), money(hi, cur)];
  return cur === 'USD' ? `${a}–${b.slice(1)}` : `${a.replace(/ (BYN|₽)$/, '')}–${b}`;
}
const mr = (lo, hi, lang) => `<span class="m" data-byn-range="${lo},${hi}">${moneyRange(lo, hi, CUR[lang])}</span>`;
const t = (o, lang) => (o && typeof o === 'object' ? (o[lang] ?? o.ru) : o);
const svcFrom = (id) => SERVICES.find((s) => s.calc === id).from;

function head(lang, L) {
  const url = lang === 'en' ? `${C.site}en/` : C.site;
  const v = { bot: money(svcFrom('bot'), CUR[lang]), site: money(svcFrom('site'), CUR[lang]), parser: money(svcFrom('parser'), CUR[lang]) };
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(L.title)}</title>
<meta name="description" content="${esc(fill(L.desc, v))}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ru" href="${C.site}">
<link rel="alternate" hreflang="en" href="${C.site}en/">
<link rel="alternate" hreflang="x-default" href="${C.site}">
<meta name="theme-color" content="#f6f5f1">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(t(C.name, lang))}">
<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'ru_RU'}">
<meta property="og:title" content="${esc(L.ogTitle)}">
<meta property="og:description" content="${esc(L.ogDesc)}">
<meta property="og:image" content="${C.site}assets/img/og.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(L.ogTitle)}">
<meta name="twitter:description" content="${esc(L.ogDesc)}">
<meta name="twitter:image" content="${C.site}assets/img/og.png">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&amp;display=optional" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&amp;display=optional"></noscript>
<link rel="stylesheet" href="/assets/css/style.css">
${lang === 'ru' ? '<script>if(/[?&]lang=en\\b/.test(location.search))location.replace("/en/"+location.hash)</script>\n' : ''}<script type="application/ld+json">${jsonLd(lang, L, url)}</script>
</head>`;
}

function jsonLd(lang, L, url) {
  const person = { '@type': 'Person', '@id': `${C.site}#person`, name: t(C.name, lang), jobTitle: lang === 'en' ? 'Web and Telegram bot developer' : 'Разработчик сайтов и Telegram-ботов',
    address: { '@type': 'PostalAddress', addressLocality: lang === 'en' ? 'Minsk' : 'Минск', addressCountry: 'BY' }, url: C.site,
    sameAs: [`https://github.com/${C.github}`, `https://t.me/${C.bot}`] };
  const service = { '@type': 'ProfessionalService', '@id': `${C.site}#service`, name: L.ogTitle, url, image: `${C.site}assets/img/og.png`,
    description: L.ogDesc, founder: { '@id': `${C.site}#person` }, areaServed: ['BY', 'RU', 'KZ'],
    address: { '@type': 'PostalAddress', addressLocality: lang === 'en' ? 'Minsk' : 'Минск', addressCountry: 'BY' },
    priceRange: `${Math.min(...SERVICES.map((s) => s.from))}+ BYN`,
    hasOfferCatalog: { '@type': 'OfferCatalog', name: L.pricesH, itemListElement: SERVICES.map((s) => ({
      '@type': 'Offer', itemOffered: { '@type': 'Service', name: t(s.title, lang), description: t(s.lead, lang) },
      priceSpecification: { '@type': 'PriceSpecification', minPrice: s.from, priceCurrency: 'BYN' } })) } };
  const faq = { '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: t(f, lang)[0], acceptedAnswer: { '@type': 'Answer', text: t(f, lang)[1] } })) };
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [person, service, faq] }).replace(/</g, '\\u003c');
}

function header(lang, L) {
  const other = lang === 'en' ? '/' : '/en/';
  return `<header class="top">
  <div class="wrap top-in">
    <a class="logo" href="${lang === 'en' ? '/en/' : '/'}"><span class="logo-mark" aria-hidden="true">ЯК</span><span class="logo-name">${esc(t(C.name, lang))}</span></a>
    <nav class="nav" id="nav" aria-label="${esc(L.navLabel)}">
      ${L.nav.map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join('\n      ')}
    </nav>
    <div class="top-actions">
      <a class="lang" href="${other}" hreflang="${lang === 'en' ? 'ru' : 'en'}" lang="${lang === 'en' ? 'ru' : 'en'}">${lang === 'en' ? 'RU' : 'EN'}</a>
      <a class="btn btn-sm btn-dark" href="${BOT(lang === 'en' ? 'site_en' : 'site')}" target="_blank" rel="noopener" aria-label="${esc(L.writeLabel)}">${SVG.tg}<span>${esc(L.write)}</span></a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="${esc(L.menu)}"><span></span><span></span></button>
    </div>
  </div>
</header>`;
}

function hero(lang, L) {
  const v = { bot: money(svcFrom('bot'), CUR[lang]), site: money(svcFrom('site'), CUR[lang]) };
  const g = { prepay: C.payments.prepayPercent, days: C.supportDays };
  return `<section class="hero" id="top">
  <div class="wrap hero-in">
    <div class="hero-copy">
      ${C.openForOrders ? `<p class="pill"><span class="dot" aria-hidden="true"></span>${esc(L.status)}</p>` : ''}
      <h1>${esc(L.h1a)} <span class="hl">${esc(L.h1b)}</span></h1>
      <p class="lead">${esc(fill(L.lead, v))}</p>
      <div class="cta-row">
        <a class="btn btn-accent btn-lg" href="${BOT(lang === 'en' ? 'demo_en' : 'demo')}" target="_blank" rel="noopener" data-goal="demo"><span>${esc(L.ctaDemo)}</span>${SVG.arrow}</a>
        <a class="btn btn-ghost btn-lg" href="#calc">${esc(L.ctaCalc)}</a>
      </div>
      <ul class="guarantees">
        ${L.guarantees.map((x) => `<li>${SVG.check}<span>${esc(fill(x, g))}</span></li>`).join('\n        ')}
      </ul>
    </div>
    <div class="demo" id="demo">
      <div class="demo-head">
        <span class="demo-ava" aria-hidden="true">K</span>
        <div><b>${esc(L.demoTitle)}</b><small>${esc(L.demoSub)}</small></div>
        <span class="live-dot" aria-hidden="true"></span>
      </div>
      <div class="demo-chat" id="demoChat" aria-live="polite"></div>
      <div class="demo-chips" id="demoChips"></div>
      <form class="demo-input" id="demoForm">
        <label class="vh" for="demoMsg">${esc(L.demoLabel)}</label>
        <input id="demoMsg" name="msg" autocomplete="off" maxlength="300" placeholder="${esc(L.demoPh)}">
        <button type="submit" aria-label="${esc(L.demoCheck)}">${SVG.arrow}</button>
      </form>
      <p class="demo-note">${esc(L.demoNote)} <a href="https://t.me/KordonAIBot" target="_blank" rel="noopener">@KordonAIBot</a></p>
    </div>
  </div>
  <div class="wrap">
    <dl class="proof">
      ${L.proof.map(([n, label]) => `<div><dt>${esc(n)}</dt><dd>${esc(label)}</dd></div>`).join('\n      ')}
    </dl>
  </div>
</section>`;
}

const secHead = (eye, h, lead) => `<div class="sec-head">
      <p class="eyebrow">${esc(eye)}</p>
      <h2>${esc(h)}</h2>${lead ? `\n      <p class="sec-lead">${esc(lead)}</p>` : ''}
    </div>`;

function work(lang, L) {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);
  const link = (l, i) => `<a class="${i === 0 ? 'btn btn-sm btn-dark' : 'link'}" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(t(l.label, lang))}</a>`;
  return `<section class="sec" id="work">
  <div class="wrap">
    ${secHead(L.workEye, L.workH, L.workLead)}
    <div class="cases">
      ${featured.map((p) => `<article class="case reveal">
        <div class="case-img"><img src="/${p.img}" srcset="/${p.img.replace('.webp', '-640.webp')} 640w, /${p.img} 960w" sizes="(max-width: 960px) 92vw, 560px" alt="${esc(t(p.title, lang))}: ${esc(t(p.tag, lang))}" loading="lazy" decoding="async" width="960" height="600"></div>
        <div class="case-body">
          <p class="case-tag"><span class="badge ${p.status}">${esc(L[p.status])}</span>${esc(t(p.tag, lang))}</p>
          <h3>${esc(t(p.title, lang))}</h3>
          <p>${esc(t(p.text, lang))}</p>
          ${p.facts ? `<ul class="facts">${t(p.facts, lang).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
          <p class="stack">${p.stack.map(esc).join(' · ')}</p>
          <div class="case-links">${p.links.map(link).join('')}</div>
        </div>
      </article>`).join('\n      ')}
    </div>
    <h3 class="more-h">${esc(L.moreH)}</h3>
    <div class="more">
      ${rest.map((p) => `<article class="mini reveal">
        <p class="mini-top"><b>${esc(t(p.title, lang))}</b><span class="badge ${p.status}">${esc(L[p.status])}</span></p>
        <p class="mini-tag">${esc(t(p.tag, lang))}</p>
        <p class="mini-text">${esc(t(p.text, lang))}</p>
        <p class="stack">${p.stack.map(esc).join(' · ')}</p>
        ${p.links.length ? p.links.map((l) => `<a class="link" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(t(l.label, lang))} →</a>`).join(' ') : ''}
      </article>`).join('\n      ')}
    </div>
    <p class="center"><a class="link" href="https://github.com/${C.github}" target="_blank" rel="noopener">${esc(L.github)} →</a></p>
  </div>
</section>`;
}

function prices(lang, L) {
  const ids = Object.keys(PACKAGES);
  return `<section class="sec" id="prices">
  <div class="wrap">
    ${secHead(L.pricesEye, L.pricesH, fill(L.pricesLead, { discount: C.firstClientsDiscount }))}
    <div class="price-bar">
      <div class="tabs" role="tablist" aria-label="${esc(L.tabsLabel)}">
        ${ids.map((id, i) => `<button type="button" role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}>${esc(L.tabs[id])}</button>`).join('\n        ')}
      </div>
      <div class="cur" role="group" aria-label="${esc(L.cur)}">
        ${['BYN', 'RUB', 'USD'].map((c) => `<button type="button" data-cur="${c}" aria-pressed="${c === CUR[lang]}">${c === 'RUB' ? '₽' : c === 'USD' ? '$' : 'BYN'}</button>`).join('')}
      </div>
    </div>
    ${ids.map((id) => `<div class="panel" role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}" tabindex="0">
      <h3 class="vh">${esc(L.tabs[id])}</h3>
      <div class="packs">
        ${PACKAGES[id].map((p) => {
          const e = KCalc.estimate(CALC, { svc: id, ...p.order, urgent: false });
          const href = BOT(KCalc.encodeOrder({ svc: id, ...p.order, lang: lang === 'en' ? 'en' : null }));
          return `<article class="pack${p.best ? ' best' : ''}">
          ${p.best ? `<p class="pack-badge">${esc(L.best)}</p>` : ''}
          <h4>${esc(t(p.name, lang))}</h4>
          <p class="pack-for">${esc(t(p.for, lang))}</p>
          <p class="pack-price"><small>${esc(L.from)}</small> ${m(KCalc.roundByn(e.lo), lang)}</p>
          <p class="pack-days">${e.d0}–${e.d1} ${esc(L.daysWord)}</p>
          <ul class="inc">${t(p.inc, lang).map((x) => `<li>${SVG.check}<span>${esc(x)}</span></li>`).join('')}</ul>
          <p class="exc"><b>${esc(L.excl)}</b> ${esc(t(p.exc, lang).join(', '))}</p>
          <a class="btn ${p.best ? 'btn-accent' : 'btn-ghost'} btn-block" href="${href}" target="_blank" rel="noopener" data-goal="pack">${esc(L.order)}</a>
        </article>`;
        }).join('\n        ')}
      </div>
    </div>`).join('\n    ')}
    <p class="price-note">${esc(L.pricesNote)} <a class="link" href="#calc">${esc(L.pricesNoteLink)} →</a></p>
  </div>
</section>`;
}

function offer(lang, L) {
  return `<section class="band" id="demo-offer">
  <div class="wrap band-in">
    ${secHead(L.offerEye, L.offerH)}
    <div class="band-grid">
      ${L.offer.map(([h, p], i) => `<div class="band-item reveal"><span class="band-num">0${i + 1}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('\n      ')}
    </div>
    <a class="btn btn-accent btn-lg" href="${BOT(lang === 'en' ? 'demo_en' : 'demo')}" target="_blank" rel="noopener" data-goal="demo">${SVG.tg}<span>${esc(L.offerCta)}</span></a>
  </div>
</section>`;
}

function calc(lang, L) {
  const first = SERVICES[0];
  const c = CALC[first.calc];
  const o = { svc: first.calc, n: c.range ? c.range.value : 0, opts: [], urgent: false, lang: lang === 'en' ? 'en' : null };
  const e = KCalc.estimate(CALC, o);
  return `<section class="sec" id="calc">
  <div class="wrap">
    ${secHead(L.calcEye, L.calcH, L.calcLead)}
    <div class="calc">
      <div class="calc-left">
        <div class="field">
          <label for="brief" class="field-label">${esc(L.brief)}</label>
          <textarea id="brief" name="brief" rows="3" maxlength="800" placeholder="${esc(L.briefPh)}"></textarea>
          <p class="hint" id="briefHint" aria-live="polite"></p>
        </div>
        <fieldset class="field">
          <legend class="field-label">${esc(L.type)}</legend>
          <div class="types" id="typeGrid">
            ${SERVICES.map((s, i) => `<label><input type="radio" name="type" value="${s.calc}"${i === 0 ? ' checked' : ''}><span>${esc(t(s.title, lang))}</span></label>`).join('\n            ')}
          </div>
        </fieldset>
        <div class="field range" id="rangeWrap"${c.range ? '' : ' hidden'}>
          <div class="range-top"><label for="rangeInput" id="rangeLabel">${esc(t(c.range?.label, lang) || '')}</label><output id="rangeOut" for="rangeInput">${o.n}</output></div>
          <input type="range" id="rangeInput" min="${c.range?.min ?? 1}" max="${c.range?.max ?? 10}" step="${c.range?.step ?? 1}" value="${o.n}">
        </div>
        <fieldset class="field">
          <legend class="field-label">${esc(L.opts)}</legend>
          <div class="opts" id="optGrid">
            ${c.options.map((x) => `<label><input type="checkbox" value="${x.id}"><span>${esc(t(x.label, lang))}<em>+${m(x.add[0], lang)}</em></span></label>`).join('\n            ')}
          </div>
        </fieldset>
        <label class="switch"><input type="checkbox" id="urgent"><span class="sw" aria-hidden="true"></span><span>${esc(L.urgent)}</span></label>
      </div>
      <aside class="calc-right" aria-live="polite">
        <p class="res-label">${esc(L.result)}</p>
        <p class="res-price" id="resPrice">${mr(KCalc.roundByn(e.lo), KCalc.roundByn(e.hi), lang)}</p>
        <p class="res-days">${esc(L.days)}: <b id="resDays">${e.d0}–${e.d1}</b> ${esc(L.daysWord)}</p>
        <ul class="res-list" id="resList"><li><span>${esc(L.base)}: ${esc(t(first.title, lang))}</span></li></ul>
        <a class="btn btn-accent btn-lg btn-block" id="sendOrder" href="${BOT(KCalc.encodeOrder(o))}" target="_blank" rel="noopener" data-goal="calc">${SVG.tg}<span>${esc(L.send)}</span></a>
        <p class="res-note">${esc(L.sendNote)}</p>
      </aside>
    </div>
  </div>
</section>`;
}

function steps(lang, L) {
  return `<section class="sec" id="process">
  <div class="wrap">
    ${secHead(L.procEye, L.procH, L.procLead)}
    <ol class="steps">
      ${PROCESS.map((s) => `<li class="step reveal"><h3>${esc(t(s, lang)[0])}</h3><p>${esc(t(s, lang)[1])}</p></li>`).join('\n      ')}
    </ol>
  </div>
</section>`;
}

function about(lang, L) {
  return `<section class="sec" id="about">
  <div class="wrap about">
    <div class="about-main">
      ${secHead(L.aboutEye, L.aboutH)}
      ${L.about.map((p) => `<p class="about-p">${esc(p)}</p>`).join('\n      ')}
      <p><a class="link" href="https://github.com/${C.github}" target="_blank" rel="noopener">github.com/${C.github} →</a></p>
    </div>
    <div class="about-side">
      <div class="not reveal">
        <h3>${esc(L.notH)}</h3>
        <ul>${L.not.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>
      <div class="pay reveal">
        <h3>${esc(L.payH)}</h3>
        <dl>${L.pay.map(([h, p]) => `<div><dt>${esc(h)}</dt><dd>${esc(p)}</dd></div>`).join('')}</dl>
        ${C.payments.npdRegistered ? `<p class="npd">${esc(L.npd)}</p>` : ''}
      </div>
    </div>
  </div>
</section>`;
}

function faq(lang, L) {
  return `<section class="sec" id="faq">
  <div class="wrap faq-in">
    ${secHead(L.faqEye, L.faqH)}
    <div class="faq">
      ${FAQ.map((f) => `<details><summary>${esc(t(f, lang)[0])}</summary><p>${esc(t(f, lang)[1])}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function diary(lang, L) {
  const fmt = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return `<section class="sec sec-tight" id="diary">
  <div class="wrap diary-in">
    ${secHead(L.diaryEye, L.diaryH, L.diaryLead)}
    <ol class="timeline">
      ${DIARY.slice(0, 5).map((d) => `<li><time datetime="${d.date}">${esc(fmt.format(new Date(d.date + 'T12:00:00Z')))}</time><h3>${esc(t(d.title, lang))}</h3><p>${esc(t(d.text, lang))}</p></li>`).join('\n      ')}
    </ol>
  </div>
</section>`;
}

function final(lang, L) {
  return `<section class="final" id="contact">
  <div class="wrap final-in">
    <p class="eyebrow">${esc(L.finalEye)}</p>
    <h2>${esc(L.finalH)}</h2>
    <p class="sec-lead">${esc(L.finalLead)}</p>
    <form class="final-form" id="finalForm" action="${BOT(lang === 'en' ? 'demo_en' : 'demo')}" target="_blank">
      <label class="vh" for="finalText">${esc(L.finalLabel)}</label>
      <textarea id="finalText" rows="3" maxlength="800" placeholder="${esc(L.finalPh)}"></textarea>
      <button class="btn btn-accent btn-lg" type="submit" data-goal="final">${SVG.tg}<span>${esc(L.finalBtn)}</span></button>
    </form>
    <a class="link" href="${BOT(lang === 'en' ? 'site_en' : 'site')}" target="_blank" rel="noopener">${esc(L.finalAlt)} @${C.bot}</a>
  </div>
</section>`;
}

function footer(lang, L) {
  return `<footer class="foot">
  <div class="wrap foot-in">
    <p>© ${new Date().getFullYear()} ${esc(t(C.name, lang))} · ${esc(L.city)}</p>
    <p class="foot-links">
      <a href="${BOT(lang === 'en' ? 'site_en' : 'site')}" target="_blank" rel="noopener">${esc(L.footBot)}</a>
      <a href="https://github.com/${C.github}" target="_blank" rel="noopener">GitHub</a>
      <a href="https://yarik002.github.io/kordon-site/${lang === 'en' ? '' : 'ru/'}" target="_blank" rel="noopener">${lang === 'en' ? 'Kordon' : 'Кордон'}</a>
      <a href="https://yarik002.github.io/offer-site/" target="_blank" rel="noopener">${lang === 'en' ? 'Offer' : 'Оффер'}</a>
    </p>
  </div>
</footer>`;
}

export function page(lang) {
  const L = S[lang];
  return `<!doctype html>
<!-- Собрано tools/build.mjs из assets/js/data.js и config.js. Правки вносить там и пересобирать: node tools/build.mjs -->
<html lang="${lang}">
${head(lang, L)}
<body>
<a class="skip" href="#main">${esc(L.skip)}</a>
${header(lang, L)}
<main id="main">
${hero(lang, L)}
${work(lang, L)}
${prices(lang, L)}
${offer(lang, L)}
${calc(lang, L)}
${steps(lang, L)}
${about(lang, L)}
${faq(lang, L)}
${diary(lang, L)}
${final(lang, L)}
</main>
${footer(lang, L)}
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<noscript><p class="noscript">${esc(L.noscript)} <a href="${BOT('site')}">@${C.bot}</a></p></noscript>
<script src="/assets/js/config.js" defer></script>
<script src="/assets/js/data.js" defer></script>
<script src="/assets/js/calc.js" defer></script>
<script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

const sitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['', 'en/'].map((p) => `  <url>
    <loc>${C.site}${p}</loc>
    <lastmod>${DIARY[0].date}</lastmod>
    <xhtml:link rel="alternate" hreflang="ru" href="${C.site}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${C.site}en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${C.site}"/>
  </url>`).join('\n')}
</urlset>
`;

const robots = () => `User-agent: *
Allow: /

Sitemap: ${C.site}sitemap.xml
Sitemap: ${C.site}kordon-site/sitemap.xml
Sitemap: ${C.site}offer-site/sitemap.xml
`;

const OUT = { 'index.html': () => page('ru'), 'en/index.html': () => page('en'), 'sitemap.xml': sitemap, 'robots.txt': robots };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const check = process.argv.includes('--check');
  let stale = 0;
  for (const [file, make] of Object.entries(OUT)) {
    const html = make();
    const path = ROOT + file;
    const old = existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';   // git на Windows ставит CRLF
    if (old === html) continue;
    stale++;
    if (check) { console.error('устарел: ' + file); continue; }
    mkdirSync(path.replace(/[\\/][^\\/]+$/, ''), { recursive: true });
    writeFileSync(path, html);
    console.log('собран: ' + file);
  }
  if (check && stale) process.exit(1);
  if (!stale) console.log('всё свежее');
}
