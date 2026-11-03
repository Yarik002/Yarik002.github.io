(() => {
  'use strict';
  const C = window.CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  document.documentElement.classList.add('js');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } }
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- i18n ----------
  // Русский текст берётся прямо из разметки, здесь только английский.
  const EN = {
    'skip': 'Skip to content',
    'nav.work': 'Work', 'nav.services': 'Services', 'nav.calc': 'Calculator', 'nav.process': 'Process', 'nav.diary': 'Diary',
    'cta.write': 'Message me', 'cta.calc': 'Estimate my project', 'cta.tg': 'Message on Telegram',
    'hero.status': 'Taking orders · Minsk & remote',
    'hero.t1': 'Websites, bots', 'hero.t2': 'and videos that', 'hero.t3': 'bring you clients',
    'hero.sub': 'I\'m Yaroslav, a developer from Minsk. I build things turnkey, from idea to launch. My projects already run in Telegram, and you can try them right here.',
    'stat.live': 'projects live in production', 'stat.port': 'projects in the portfolio', 'stat.tests': 'automated tests in Kordon',
    'demo.title': 'Kordon · live demo', 'demo.sub': 'check a message for scams', 'demo.label': 'Message to check', 'demo.ph': 'Paste a suspicious message…',
    'demo.note': 'A simplified in-browser version. The real bot also checks a spammer database and asks AI: <a href="https://t.me/KordonAIBot" target="_blank" rel="noopener">@KordonAIBot</a>',
    'work.h': 'Not mockups. Things that already work', 'work.lead': 'Message the bots, open the sites, read the code on GitHub. I add new projects here as I go.',
    'f.all': 'All', 'f.bots': 'Bots', 'f.sites': 'Sites', 'f.auto': 'Automation',
    'srv.h': 'What I can build for your business', 'srv.lead': 'Starting prices: the exact amount depends on the task. First clients get 20% off in exchange for an honest review.',
    'calc.h': 'Estimate your project in a minute', 'calc.lead': 'Describe the task in your own words or build the estimate with buttons. One tap sends it to me on Telegram.',
    'calc.brief': 'Describe your task', 'calc.briefPh': 'E.g.: a booking bot for a salon with payments and reminders',
    'calc.type': 'What are we building', 'calc.opts': 'Add-ons', 'calc.urgent': 'Rush (40% faster, price +30%)',
    'calc.result': 'Rough estimate', 'calc.days': 'Time:', 'calc.daysUnit': 'days',
    'calc.contact': 'Your name (optional)', 'calc.contactPh': 'Name or business name', 'calc.send': 'Send estimate on Telegram', 'calc.mail': 'or by email',
    'calc.bar': 'To the request ↓',
    'calc.note': 'This is a guide, not an offer. I\'ll give an exact price after a couple of questions.',
    'proc.h': 'How we\'ll work', 'proc.lead': 'No surprises: you see the result before paying and at every step.',
    'pay.eye': 'Payment', 'pay.h': 'How to pay', 'pay.lead': 'First we agree on Telegram, then you pay the way that suits you. I share payment details personally, after we agree.',
    'diary.h': 'Journey diary', 'diary.lead': 'I study, build projects and grow my business in the open. Only things that actually happened.', 'diary.goal': 'Earned through the platform',
    'faq.h': 'FAQ',
    'final.eye': 'Ready to start?', 'final.t1': 'Drop me a few words', 'final.t2': 'about your task', 'final.lead': 'I reply within a day and tell you honestly whether I can help and what it will cost.',
    'foot.city': 'Minsk'
  };
  const UI = {
    ru: {
      title: 'Ярослав Кирдун · сайты, Telegram-боты, автоматизация',
      desc: 'Делаю сайты под ключ, Telegram-ботов, парсеры, видеоролики и AI-визуал. Живые проекты, честные цены, калькулятор стоимости и заказ в Telegram.',
      live: 'работает', code: 'код', private: 'личный', privateNote: 'Покажу на созвоне',
      from: 'от', calcBtn: 'Рассчитать', base: 'База', urgentLine: 'Срочность', dayWord: 'дн.',
      briefFound: 'Похоже на: ', briefNone: 'Не понял задачу, выберите тип ниже — или просто отправьте как есть.',
      copied: 'Открываю Telegram: смета уже в поле сообщения. На всякий случай она ещё и скопирована.',
      copyFail: 'Открываю Telegram. Опишите задачу в чате, смету я пришлю.',
      msgHello: 'Привет! Хочу заказать: ', msgOpts: 'Опции: ', msgNone: 'без доп. опций', msgUrgent: 'Срочно: да',
      msgEst: 'Смета с сайта: ', msgTask: 'Задача: ', msgDays: 'дней',
      demoHi: 'Привет! Я Кордон. Пришли сообщение из чата, скажу, похоже ли оно на скам.',
      scam: 'Похоже на скам', sus: 'Стоит проверить', clean: 'Явных признаков скама нет',
      cleanText: 'Обычное сообщение. В группе с Кордоном оно прошло бы без задержек.',
      scamText: 'В группе с Кордоном это сообщение удалилось бы, а чат получил бы предупреждение.',
      susText: 'Один подозрительный признак. Кордон отдал бы это на проверку AI.',
      presets: ['Раздаю 500 USDT первым 10, пишите в лс t.me/+abcXYZ', 'Подработка без опыта, от 300$ в день! Пиши мне срочно', 'Ребята, кто идёт завтра на митап по Python?'],
      pay: [
        ['TG', 'Сначала договорённость', 'Обсуждаем задачу в Telegram, фиксирую цену и срок в переписке. Предоплата {p}%, остаток после сдачи.'],
        ['ЕРИП', 'ЕРИП', 'Счёт в ЕРИП, оплата из любого банка Беларуси.'],
        ['BYN', 'Перевод на карту', 'Для клиентов из Беларуси. Реквизиты присылаю лично после согласования.'],
        ['★', 'Telegram Stars', 'Оплата прямо в Telegram, удобно из любой страны.'],
        ['RU/KZ', 'Другие страны', 'Россия, Казахстан и не только: подберём удобный способ в чате.']
      ],
      soon: 'скоро', npd: 'Работаю как самозанятый, выдаю чек.', eripNote: 'Код в ЕРИП: ',
      marquee: ['Сайты под ключ', 'Telegram-боты', 'Парсеры', 'Автоматизация', 'Видеомонтаж', 'AI-визуал', 'Mini Apps', 'Домены']
    },
    en: {
      title: 'Yaroslav Kirdun · websites, Telegram bots, automation',
      desc: 'Turnkey websites, Telegram bots, scrapers, videos and AI visuals. Live projects, fair prices, a cost calculator and ordering via Telegram.',
      live: 'live', code: 'code', private: 'private', privateNote: 'Demo on a call',
      from: 'from', calcBtn: 'Estimate', base: 'Base', urgentLine: 'Rush', dayWord: 'd',
      briefFound: 'Looks like: ', briefNone: 'Couldn\'t tell the task. Pick a type below, or just send it as is.',
      copied: 'Opening Telegram: the estimate is already in the message box. It\'s also copied, just in case.',
      copyFail: 'Opening Telegram. Describe the task in the chat and I\'ll send an estimate.',
      msgHello: 'Hi! I\'d like to order: ', msgOpts: 'Add-ons: ', msgNone: 'no add-ons', msgUrgent: 'Rush: yes',
      msgEst: 'Estimate from the site: ', msgTask: 'Task: ', msgDays: 'days',
      demoHi: 'Hi! I\'m Kordon. Send me a message from a chat and I\'ll tell you if it looks like a scam.',
      scam: 'Looks like a scam', sus: 'Worth a check', clean: 'No obvious scam signs',
      cleanText: 'A normal message. In a group with Kordon it would go through without delay.',
      scamText: 'In a group with Kordon this message would be deleted and the chat warned.',
      susText: 'One suspicious sign. Kordon would pass this to AI for a closer look.',
      presets: ['Giving away 500 USDT to the first 10, DM me t.me/+abcXYZ', 'Side job, no experience, $300 a day! Write me now', 'Anyone going to the Python meetup tomorrow?'],
      pay: [
        ['TG', 'Agree first', 'We discuss the task on Telegram, I fix price and deadline in writing. {p}% upfront, the rest on delivery.'],
        ['ERIP', 'ERIP', 'An ERIP invoice you can pay from any Belarusian bank.'],
        ['BYN', 'Card transfer', 'For clients in Belarus. I share details personally after we agree.'],
        ['★', 'Telegram Stars', 'Pay right inside Telegram, works from any country.'],
        ['RU/KZ', 'Other countries', 'Russia, Kazakhstan and beyond: we\'ll pick a convenient way in the chat.']
      ],
      soon: 'soon', npd: 'Registered self-employed, receipts provided.', eripNote: 'ERIP code: ',
      marquee: ['Turnkey websites', 'Telegram bots', 'Scrapers', 'Automation', 'Video editing', 'AI visuals', 'Mini Apps', 'Domains']
    }
  };

  const RU = {};
  $$('[data-i18n]').forEach((el) => { RU[el.dataset.i18n] = el.innerHTML; });
  $$('[data-i18n-ph]').forEach((el) => { RU['ph:' + el.dataset.i18nPh] = el.placeholder; });

  const params = new URLSearchParams(location.search);
  let lang = params.get('lang') || store.get('lang') || ((navigator.language || 'ru').match(/^(ru|be|uk|kk)/i) ? 'ru' : 'en');
  if (!['ru', 'en'].includes(lang)) lang = 'ru';
  let cur = store.get('cur') || (lang === 'en' ? 'USD' : 'BYN');
  if (!C.rates[cur]) cur = 'BYN';
  const t = (o) => (o && typeof o === 'object' ? (o[lang] ?? o.ru) : o);
  const T = (k) => UI[lang][k];

  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => {
      const k = el.dataset.i18n;
      el.innerHTML = lang === 'en' ? (EN[k] ?? RU[k]) : RU[k];
    });
    $$('[data-i18n-ph]').forEach((el) => {
      const k = el.dataset.i18nPh;
      el.placeholder = lang === 'en' ? (EN[k] ?? RU['ph:' + k]) : RU['ph:' + k];
    });
    document.title = T('title');
    $('meta[name="description"]').content = T('desc');
    $$('.langs button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $('#fname').textContent = t(C.name);
  }

  // ---------- money ----------
  function money(byn, withCur = true) {
    const v = byn * C.rates[cur];
    const step = cur === 'RUB' ? 100 : cur === 'USD' ? 5 : 10;
    const r = Math.max(step, Math.round(v / step) * step);
    return r.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU').replace(/,/g, ' ') + (withCur ? ' ' + curLabel() : '');
  }
  const curLabel = () => ({ BYN: 'BYN', USD: '$', RUB: '₽' }[cur]);

  // ---------- links ----------
  const tgUrl = (text) => `https://t.me/${C.telegram}` + (text ? `?text=${encodeURIComponent(text)}` : '');
  $$('.tg-link').forEach((a) => { a.href = tgUrl(); });
  $('#mailBtn').href = `mailto:${C.email}`;
  $('#mailBtn').textContent = C.email;
  $('#year').textContent = new Date().getFullYear();
  if (!C.openForOrders) { $('#status').classList.add('closed'); }

  // ---------- projects ----------
  let filter = 'all';
  const codeArt = {
    smartcoin: '<b>@bot</b>.message(F.voice)\nasync def spend(m):\n  total = <em>gemini</em>.parse(m)\n  → 12.50 BYN · Кафе',
    voice: 'voice.ogg → <em>whisper</em>\n→ <em>llama3</em>.summary()\n<b>✓</b> 3 пункта за 4 сек',
    profibot: '/weather Минск\n/image "кот в космосе"\n/admin → <b>stats</b>',
    deribit: '<em>celery</em> beat · every 60s\nGET deribit/index\n<b>INSERT</b> btc_usd 68 210.5',
    csvrec: 'steps.csv → <em>playwright</em>\nclick · type · wait\n<b>●REC</b> run_01.mp4',
    cards: '<em>llm</em>.draft(card)\nvalidate(specs)\n<b>✓</b> без выдумок',
    jobsearch: 'sources: 7\nmatch_score: <b>87%</b>\n→ cover_letter.docx'
  };
  function renderProjects() {
    const list = window.PROJECTS.filter((p) => filter === 'all' || p.cat === filter);
    $('#projects').innerHTML = list.map((p) => {
      const img = p.img
        ? `<div class="proj-img"><img src="${p.img}" alt="${esc(t(p.title))}" loading="lazy" width="960" height="600"></div>`
        : `<div class="proj-img code" aria-hidden="true"><pre>${codeArt[p.id] || ''}</pre></div>`;
      const links = p.links.length
        ? `<div class="proj-links">${p.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${esc(t(l.label))}</a>`).join('')}</div>`
        : `<p class="proj-private">${T('privateNote')}</p>`;
      return `<article class="proj${p.featured && filter === 'all' ? ' featured' : ''}" style="view-transition-name:p-${p.id}">
        ${img}
        <div class="proj-body">
          <div class="proj-top"><h3>${esc(t(p.title))}</h3><span class="badge ${p.status}">${T(p.status)}</span></div>
          <p class="tag">${esc(t(p.tag))}</p>
          <p class="text">${esc(t(p.text))}</p>
          <ul class="stack">${p.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
          ${links}
        </div>
      </article>`;
    }).join('');
    bindSpotlight($$('.proj'));
  }
  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-f]');
    if (!b || b.dataset.f === filter) return;
    filter = b.dataset.f;
    $$('#filters button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    if (document.startViewTransition && !reduce) document.startViewTransition(renderProjects);
    else renderProjects();
  });

  // ---------- services ----------
  function renderServices() {
    $('#servicesList').innerHTML = window.SERVICES.map((s, i) => `
      <article class="srv reveal">
        <div class="srv-num"><span class="srv-ico"><svg aria-hidden="true"><use href="#i-${s.icon}"/></svg></span></div>
        <div><h3>${esc(t(s.title))}</h3><p class="srv-lead">${esc(t(s.lead))}</p></div>
        <ul>${t(s.includes).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="srv-price">
          <span class="from">0${i + 1} · ${T('from')}</span>
          <span class="sum">${money(s.from)}</span>
          <span class="days">${esc(t(s.days))}</span>
          <button type="button" data-calc="${s.calc}">${T('calcBtn')} →</button>
        </div>
      </article>`).join('');
    bindSpotlight($$('.srv'));
    observeReveal($$('#servicesList .reveal'));
  }
  $('#servicesList').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-calc]');
    if (!b) return;
    setType(b.dataset.calc, true);
    $('#calc').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  $('#cur').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cur]');
    if (!b) return;
    cur = b.dataset.cur; store.set('cur', cur);
    syncCur(); renderServices(); updateCalc();
  });
  function syncCur() { $$('#cur button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.cur === cur))); }

  // ---------- calculator ----------
  const state = { type: 'site', opts: new Set(), range: 1, urgent: false };
  const svc = (id) => window.SERVICES.find((s) => s.calc === id);
  function renderTypes() {
    $('#typeGrid').innerHTML = window.SERVICES.map((s) => `
      <label><input type="radio" name="type" value="${s.calc}" ${s.calc === state.type ? 'checked' : ''}>
        <span class="type-card"><svg aria-hidden="true"><use href="#i-${s.icon}"/></svg>${esc(t(s.title))}</span></label>`).join('');
  }
  function renderOpts() {
    const c = window.CALC[state.type];
    $('#optGrid').innerHTML = c.options.map((o) => `
      <label><input type="checkbox" value="${o.id}" ${state.opts.has(o.id) ? 'checked' : ''}>
        <span class="opt-card"><span class="box" aria-hidden="true"></span>${esc(t(o.label))}<span class="add">+${money(o.add[0], false)}</span></span></label>`).join('');
    const r = c.range;
    $('#rangeWrap').hidden = !r;
    if (r) {
      const inp = $('#rangeInput');
      inp.min = r.min; inp.max = r.max; inp.step = r.step || 1;
      inp.value = state.range;
      $('#rangeLabel').textContent = t(r.label);
    }
  }
  function setType(id, resetOpts) {
    if (!window.CALC[id]) return;
    if (id !== state.type || resetOpts) state.opts.clear();
    state.type = id;
    const r = window.CALC[id].range;
    if (r && (state.range < r.min || state.range > r.max || resetOpts || id !== state._last)) state.range = r.value;
    state._last = id;
    renderTypes(); renderOpts(); updateCalc();
  }
  function estimate() {
    const c = window.CALC[state.type];
    let lo = c.base[0], hi = c.base[1], d0 = c.days[0], d1 = c.days[1];
    const lines = [[`${T('base')}: ${t(svc(state.type).title)}`, c.base[0]]];
    if (c.range) {
      const n = Math.round((state.range - c.range.min) / (c.range.step || 1));
      if (n > 0) {
        lo += n * c.range.per[0]; hi += n * c.range.per[1];
        const dd = Math.ceil(n * c.range.perDays); d0 += dd; d1 += dd;
        lines.push([`${t(c.range.label)}: ${state.range}`, n * c.range.per[0]]);
      }
    }
    c.options.forEach((o) => {
      if (!state.opts.has(o.id)) return;
      lo += o.add[0]; hi += o.add[1]; d0 += Math.ceil(o.days / 2); d1 += o.days;
      lines.push([t(o.label), o.add[0]]);
    });
    if (state.urgent) {
      lines.push([T('urgentLine'), Math.round(lo * 0.3)]);
      lo *= 1.3; hi *= 1.3; d0 = Math.max(1, Math.ceil(d0 * 0.6)); d1 = Math.max(d0, Math.ceil(d1 * 0.6));
    }
    return { lo, hi, d0, d1, lines };
  }
  const shown = { lo: 0, hi: 0 };
  function tween(el, from, to, key) {
    const tok = (el._tok = (el._tok || 0) + 1);
    if (reduce || from === 0) { el.textContent = money(to, false); shown[key] = to; return; }
    const start = performance.now(), dur = 550;
    const step = (now) => {
      if (tok !== el._tok) return;
      const k = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = money(from + (to - from) * e, false);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // в фоновой вкладке rAF не идёт: всё равно показываем итог
    setTimeout(() => { if (tok === el._tok) el.textContent = money(to, false); }, dur + 80);
  }
  function updateCalc() {
    const e = estimate();
    tween($('#pMin'), shown.lo, e.lo, 'lo');
    tween($('#pMax'), shown.hi, e.hi, 'hi');
    shown.lo = e.lo; shown.hi = e.hi;
    $('#pCur').textContent = curLabel();
    $('#barPrice').textContent = `${money(e.lo, false)}–${money(e.hi)}`;
    $('#pDays').textContent = e.d0 === e.d1 ? e.d0 : `${e.d0}–${e.d1}`;
    $('#resList').innerHTML = e.lines.map(([l, v]) => `<li><span>${esc(l)}</span><span>+${money(v)}</span></li>`).join('');
    const out = $('#rangeOut'), inp = $('#rangeInput');
    out.textContent = state.range;
    inp.setAttribute('aria-valuetext', `${state.range}`);
    inp.style.setProperty('--val', ((inp.value - inp.min) / ((inp.max - inp.min) || 1)) * 100 + '%');
    const price = $('.res-price');
    if (!reduce) { price.classList.remove('bump'); void price.offsetWidth; price.classList.add('bump'); }
    updateMail();
  }
  function updateMail() {
    $('#mailLink').href = `mailto:${C.email}?subject=${encodeURIComponent(t(svc(state.type).title))}&body=${encodeURIComponent(orderText())}`;
  }
  function orderText() {
    const e = estimate();
    const c = window.CALC[state.type];
    const opts = c.options.filter((o) => state.opts.has(o.id)).map((o) => t(o.label));
    const rows = [T('msgHello') + t(svc(state.type).title) + '.'];
    rows.push(T('msgOpts') + (opts.length ? opts.join(', ') : T('msgNone')) + '.');
    if (c.range) rows.push(`${t(c.range.label)}: ${state.range}`);
    if (state.urgent) rows.push(T('msgUrgent'));
    rows.push(`${T('msgEst')}${money(e.lo, false)}–${money(e.hi)}, ${e.d0}–${e.d1} ${T('msgDays')}.`);
    const brief = $('#brief').value.trim();
    if (brief) rows.push(T('msgTask') + brief);
    const who = $('#contact').value.trim();
    if (who) rows.push('— ' + who);
    return rows.join('\n');
  }
  $('#typeGrid').addEventListener('change', (e) => { if (e.target.name === 'type') setType(e.target.value, true); });
  $('#optGrid').addEventListener('change', (e) => {
    const v = e.target.value;
    e.target.checked ? state.opts.add(v) : state.opts.delete(v);
    updateCalc();
  });
  $('#rangeInput').addEventListener('input', (e) => { state.range = Number(e.target.value); updateCalc(); });
  $('#urgent').addEventListener('change', (e) => { state.urgent = e.target.checked; updateCalc(); });
  $('#contact').addEventListener('input', updateMail);
  $('#brief').addEventListener('change', updateMail);

  // «Опиши задачу» → тип, опции и количество по ключевым словам
  let briefTimer;
  $('#brief').addEventListener('input', () => {
    clearTimeout(briefTimer);
    briefTimer = setTimeout(detectBrief, 350);
  });
  // ключ ищем только с начала слова: «бот» не должен ловиться в «работа»
  // в ключах нет спецсимволов регулярок, поэтому подставляем как есть
  const has = (text, k) => new RegExp('(^|[^a-zа-яё0-9])' + k).test(text);
  function detectBrief() {
    const text = $('#brief').value.toLowerCase();
    const hint = $('#briefHint');
    if (text.trim().length < 6) { hint.textContent = ''; return; }
    let best = null, bestScore = 0;
    Object.entries(window.SERVICE_KW).forEach(([id, kws]) => {
      const score = kws.reduce((n, k) => n + (has(text, k) ? 1 : 0), 0);
      if (score > bestScore) { best = id; bestScore = score; }
    });
    if (!best) { hint.textContent = T('briefNone'); return; }
    setType(best, true); // опции каждый раз заново по тексту
    const c = window.CALC[best];
    c.options.forEach((o) => { if (o.kw.some((k) => has(text, k))) state.opts.add(o.id); });
    if (c.range) {
      const m = text.match(/(\d{1,3})\s*(стр|page|сайт|site|ролик|видео|video|изображ|картин|фото|image|photo|источник|source)/);
      if (m) state.range = Math.min(c.range.max, Math.max(c.range.min, Number(m[1])));
    }
    renderOpts(); updateCalc();
    const picked = c.options.filter((o) => state.opts.has(o.id)).map((o) => t(o.label));
    hint.textContent = T('briefFound') + t(svc(best).title) + (picked.length ? ' + ' + picked.join(', ') : '');
  }

  $('#orderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = orderText();
    let copied = false;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => { copied = true; toast(T('copied')); }, () => toast(T('copyFail')));
    } else toast(T('copyFail'));
    window.open(tgUrl(text), '_blank', 'noopener');
    setTimeout(() => { if (!copied) toast(T('copied')); }, 1200);
  });

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 4500);
  }

  // ---------- process, pay, diary, faq, marquee ----------
  function renderStatic() {
    $('#steps').innerHTML = window.PROCESS.map((s) => `<li class="step reveal"><h3>${esc(t(s)[0])}</h3><p>${esc(t(s)[1])}</p></li>`).join('');

    const P = C.payments;
    $('#payList').innerHTML = T('pay').map(([ico, h, p], i) => {
      let extra = '';
      if (i === 1) extra = P.erip ? ` ${T('eripNote')}${esc(P.erip)}.` : '';
      if ((i === 1 || i === 2) && P.npdRegistered) extra += ' ' + T('npd');
      const soon = i === 3 && !P.starsBot ? ` <span class="soon">${T('soon')}</span>` : '';
      const link = i === 3 && P.starsBot ? ` <a href="https://t.me/${esc(P.starsBot)}" target="_blank" rel="noopener">@${esc(P.starsBot)}</a>` : '';
      return `<div class="pay-card reveal"><span class="eyebrow" style="margin:0">${esc(ico)}</span><h3>${esc(h)}${soon}</h3><p>${esc(p.replace('{p}', P.prepayPercent))}${extra}${link}</p></div>`;
    }).join('');

    const fmt = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    $('#timeline').innerHTML = window.DIARY.map((d) => `
      <li class="entry reveal"><time datetime="${d.date}">${fmt.format(new Date(d.date + 'T12:00:00'))}</time>
      <h3>${esc(t(d.title))}</h3><p>${esc(t(d.text))}</p></li>`).join('');

    const g = C.goal;
    $('#goal').hidden = !g.show;
    $('#goalText').textContent = `${g.earned.toLocaleString('ru-RU')} / ${g.target.toLocaleString('ru-RU')} ${g.currency}`;

    $('#faqList').innerHTML = window.FAQ.map((f) => `<details class="reveal"><summary>${esc(t(f)[0])}</summary><p>${esc(t(f)[1])}</p></details>`).join('');

    const words = T('marquee');
    const row = words.map((w) => `<span>${esc(w)}</span>`).join('');
    $('#marquee').innerHTML = row + row.replace(/<span>/g, '<span data-dup>');

    observeReveal($$('#steps .reveal, #payList .reveal, #timeline .reveal, #faqList .reveal'));
  }

  // ---------- Kordon demo ----------
  const RULES = [
    [/(заработ|доход|прибыл|earn|profit|income|\$\s?\d+\s?(a|per|в)\s?(day|день))/i, { ru: 'обещает лёгкие деньги', en: 'promises easy money' }],
    [/(usdt|крипт|btc|bitcoin|\bton\b|crypto|бирж|airdrop)/i, { ru: 'криптовалюта', en: 'crypto' }],
    [/(в лс|в личк|пиши(те)? мне|write me|dm me|\bdm\b|в директ)/i, { ru: 'зовёт в личку', en: 'lures you to DMs' }],
    [/(t\.me\/\+|joinchat|bit\.ly|clck\.ru|tinyurl)/i, { ru: 'скрытая ссылка-приглашение', en: 'hidden invite link' }],
    [/(раздаю|раздач|бесплатн|giveaway|giving away|бонус|подар|free)/i, { ru: 'раздача или «подарок»', en: 'giveaway or "gift"' }],
    [/(срочно|только сегодня|успей|осталось \d|urgent|right now|\bnow\b|today only|limited)/i, { ru: 'давит срочностью', en: 'pushes urgency' }],
    [/(подработк|без опыта|удал[её]нн\w* работ|no experience|side job)/i, { ru: '«работа» без опыта', en: '"job" with no experience' }],
    [/(инвест|invest|пассивн|passive)/i, { ru: 'инвестиции', en: 'investments' }]
  ];
  const chat = $('#demoChat');
  function addMsg(html, cls) {
    const el = document.createElement('div');
    el.className = 'msg ' + cls;
    el.innerHTML = html;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
    return el;
  }
  function check(text) {
    if (!text.trim()) return;
    addMsg(esc(text), 'user');
    const typing = addMsg('<span class="typing"><i></i><i></i><i></i></span>', 'bot');
    typing.style.padding = '0';
    const reasons = RULES.filter(([re]) => re.test(text)).map(([, r]) => t(r));
    setTimeout(() => {
      typing.remove();
      if (reasons.length >= 2) addMsg(`<b>⚠️ ${T('scam')}</b>${T('scamText')}<ul>${reasons.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`, 'bot bad');
      else if (reasons.length === 1) addMsg(`<b>🔎 ${T('sus')}</b>${T('susText')}<ul><li>${esc(reasons[0])}</li></ul>`, 'bot');
      else addMsg(`<b>✅ ${T('clean')}</b>${T('cleanText')}`, 'bot ok');
    }, reduce ? 50 : 900);
  }
  function renderDemo() {
    chat.innerHTML = '';
    addMsg(T('demoHi'), 'bot');
    $('#demoChips').innerHTML = T('presets').map((p, i) => `<button type="button" data-i="${i}">${esc(p.length > 34 ? p.slice(0, 32) + '…' : p)}</button>`).join('');
  }
  $('#demoChips').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-i]');
    if (b) check(T('presets')[b.dataset.i]);
  });
  $('#demoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('#demoMsg');
    check(inp.value.slice(0, 300));
    inp.value = '';
  });
  let demoPlayed = false;
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting || demoPlayed) return;
    demoPlayed = true; obs.disconnect();
    setTimeout(() => check(T('presets')[0]), reduce ? 0 : 1200);
  }, { threshold: 0.6 }).observe($('#demo'));

  // ---------- effects ----------
  const nativeReveal = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  const io = (!nativeReveal && !reduce && 'IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' })
    : null;
  function observeReveal(els) {
    els.forEach((el) => { if (io) io.observe(el); else el.classList.add('in'); });
  }
  observeReveal($$('.reveal'));

  if (!CSS.supports('animation-timeline', 'scroll()') && !reduce) {
    const bar = $('.progress');
    addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    }, { passive: true });
  }

  const header = $('.top');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const burger = $('.burger'), nav = $('#nav');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); } });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { burger.click(); burger.focus(); } });

  // активный пункт меню
  const links = $$('#nav a');
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['work', 'services', 'calc', 'process', 'diary'].forEach((id) => navIO.observe(document.getElementById(id)));

  function bindSpotlight(els) {
    if (!finePointer) return;
    els.forEach((el) => el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--x', `${e.clientX - r.left}px`);
      el.style.setProperty('--y', `${e.clientY - r.top}px`);
    }));
  }

  if (finePointer && !reduce) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${(e.clientX - r.left - r.width / 2) * 0.18}px`);
        el.style.setProperty('--my', `${(e.clientY - r.top - r.height / 2) * 0.3}px`);
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); });
    });
  }

  // счётчики и цель
  const counterIO = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      obs.unobserve(en.target);
      const el = en.target, to = Number(el.dataset.to);
      if (reduce) { el.textContent = to; return; }
      const start = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - start) / 1400);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      setTimeout(() => { el.textContent = to; }, 1500);
    });
  }, { threshold: 0.6 });
  $$('.count').forEach((el) => { if (!reduce) el.textContent = '0'; counterIO.observe(el); });

  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    const g = C.goal;
    $('#goalBar').style.width = Math.min(100, (g.earned / g.target) * 100) + '%';
  }, { threshold: 0.5 }).observe($('#goal'));

  // плашка с ценой на телефоне: видна, пока калькулятор на экране, а блок сметы ещё нет
  const bar = $('#calcBar'), vis = { calc: false, res: false };
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { vis[en.target.id === 'calc' ? 'calc' : 'res'] = en.isIntersecting; });
    bar.classList.toggle('show', vis.calc && !vis.res);
  }, { threshold: 0 });
  barIO.observe($('#calc')); barIO.observe($('.calc-right'));

  // ---------- language ----------
  function renderAll() {
    applyLang(); syncCur(); renderProjects(); renderServices(); renderTypes(); renderOpts(); updateCalc(); renderStatic(); renderDemo();
  }
  $('.langs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-lang]');
    if (!b || b.dataset.lang === lang) return;
    lang = b.dataset.lang; store.set('lang', lang);
    const u = new URL(location.href);
    u.searchParams.set('lang', lang);
    history.replaceState(null, '', u);
    shown.lo = 0; shown.hi = 0;
    renderAll();
    if (demoPlayed) check(T('presets')[0]);
  });

  renderAll();
})();
