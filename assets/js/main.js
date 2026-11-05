// Интерактив поверх собранной страницы: валюта, вкладки цен, калькулятор со ссылкой в бота, демо Кордона, меню.
// Контент уже в HTML (tools/build.mjs), поэтому без JS страница тоже читается и все ссылки в бота работают.
(() => {
  'use strict';
  const C = window.CONFIG, K = window.KCalc, CALC = window.CALC;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const t = (o) => (o && typeof o === 'object' ? (o[lang] ?? o.ru) : o);
  const BOT = (payload) => `https://t.me/${C.bot}?start=${payload}`;
  // «2–4 дня», «1–5 дней», «21 день»: склоняем по последнему числу.
  const daysWord = (n) => {
    if (lang === 'en') return n === 1 ? 'day' : 'days';
    const a = n % 10, b = n % 100;
    return a === 1 && b !== 11 ? 'день' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'дня' : 'дней';
  };

  const UI = {
    ru: {
      base: 'База', urgent: 'Срочно', days: 'дней', briefFound: 'Похоже на: ', briefNone: 'Не понял задачу: выберите тип ниже или просто отправьте как есть.',
      copied: 'Описание скопировано. В боте нажмите «Запустить» и вставьте его в чат.',
      copiedCalc: 'Описание скопировано. В боте нажмите «Отправить заявку» и вставьте его в чат.', opening: 'Открываю бота в Telegram…',
      demoHi: 'Привет! Я Кордон. Пришлите сообщение из чата, скажу, похоже ли оно на скам.',
      scam: 'Похоже на скам', sus: 'Стоит проверить', clean: 'Явных признаков скама нет',
      cleanText: 'Обычное сообщение. В группе с Кордоном оно прошло бы без задержек.',
      scamText: 'В группе с Кордоном это сообщение удалилось бы, а чат получил бы предупреждение.',
      susText: 'Один подозрительный признак. Кордон отдал бы это на проверку AI.',
      presets: ['Раздаю 500 USDT первым 10, пишите в лс t.me/+abcXYZ', 'Подработка без опыта, от 300$ в день! Пиши мне срочно', 'Ребята, кто идёт завтра на митап по Python?'],
      mbar: 'Бесплатное демо в Telegram',
    },
    en: {
      base: 'Base', urgent: 'Rush', days: 'days', briefFound: 'Looks like: ', briefNone: 'Couldn\'t tell the task: pick a type below or just send it as is.',
      copied: 'Description copied. In the bot, tap Start and paste it into the chat.',
      copiedCalc: 'Description copied. In the bot, tap Send request and paste it into the chat.', opening: 'Opening the bot in Telegram…',
      demoHi: 'Hi! I\'m Kordon. Send me a message from a chat and I\'ll tell you if it looks like a scam.',
      scam: 'Looks like a scam', sus: 'Worth a check', clean: 'No obvious scam signs',
      cleanText: 'A normal message. In a group with Kordon it would go through without delay.',
      scamText: 'In a group with Kordon this message would be deleted and the chat warned.',
      susText: 'One suspicious sign. Kordon would pass this to AI for a closer look.',
      presets: ['Giving away 500 USDT to the first 10, DM me t.me/+abcXYZ', 'Side job, no experience, $300 a day! Write me now', 'Anyone going to the Python meetup tomorrow?'],
      mbar: 'Free demo on Telegram',
    },
  }[lang];

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 5000);
  }
  function copy(text) {
    if (!text || !navigator.clipboard?.writeText) return Promise.resolve(false);
    return navigator.clipboard.writeText(text).then(() => true, () => false);
  }

  // ---------- валюта ----------
  let cur = store.get('cur:' + lang);
  if (!C.rates[cur]) cur = lang === 'en' ? 'USD' : 'BYN';
  function money(byn) {
    const v = byn * C.rates[cur];
    const step = cur === 'RUB' ? 100 : cur === 'USD' ? 5 : 10;
    const n = String(Math.max(step, Math.round(v / step) * step)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return cur === 'USD' ? `$${n}` : `${n} ${cur === 'RUB' ? '₽' : 'BYN'}`;
  }
  const m = (byn) => `<span class="m" data-byn="${byn}">${money(byn)}</span>`;
  function moneyRange(lo, hi) {
    const [a, b] = [money(lo), money(hi)];
    return cur === 'USD' ? `${a}–${b.slice(1)}` : `${a.replace(/ (BYN|₽)$/, '')}–${b}`;
  }
  function paintMoney() {
    $$('.m[data-byn]').forEach((el) => { el.textContent = money(Number(el.dataset.byn)); });
    $$('.m[data-byn-range]').forEach((el) => { const [lo, hi] = el.dataset.bynRange.split(',').map(Number); el.textContent = moneyRange(lo, hi); });
    $$('.cur button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cur === cur)));
  }
  $$('.cur').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cur]');
    if (!b) return;
    cur = b.dataset.cur; store.set('cur:' + lang, cur); paintMoney();
  }));

  // ---------- вкладки цен (ARIA tabs) ----------
  const tabs = $$('[role="tab"]');
  function selectTab(tab, focus) {
    tabs.forEach((x) => {
      const on = x === tab;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      $('#' + x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  if (tabs.length) {
    selectTab(tabs.find((x) => x.getAttribute('aria-selected') === 'true') || tabs[0]);
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (e) => {
        const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (k === undefined) return;
        e.preventDefault();
        selectTab(tabs[(k + tabs.length) % tabs.length], true);
      });
    });
  }

  // ---------- калькулятор ----------
  const state = { svc: $('#typeGrid input:checked')?.value || 'site', n: 1, opts: new Set(), urgent: false };
  const order = () => ({ svc: state.svc, n: state.n, opts: CALC[state.svc].options.map((o) => o.id).filter((id) => state.opts.has(id)), urgent: state.urgent, lang: lang === 'en' ? 'en' : null });
  const svcTitle = (id) => t(window.SERVICES.find((s) => s.calc === id).title);

  function renderType() {
    const c = CALC[state.svc];
    $$('#typeGrid input').forEach((x) => { x.checked = x.value === state.svc; });
    $('#optGrid').innerHTML = c.options.map((o) => `<label><input type="checkbox" value="${o.id}"${state.opts.has(o.id) ? ' checked' : ''}><span>${esc(t(o.label))}<em>+${m(o.add[0])}</em></span></label>`).join('');
    const r = c.range, inp = $('#rangeInput');
    $('#rangeWrap').hidden = !r;
    if (r) {
      inp.min = r.min; inp.max = r.max; inp.step = r.step || 1; inp.value = state.n;
      $('#rangeLabel').textContent = t(r.label);
    }
  }
  function update() {
    const o = order(), e = K.estimate(CALC, o), c = CALC[o.svc];
    const lo = K.roundByn(e.lo), hi = K.roundByn(e.hi);
    $('#resPrice').innerHTML = `<span class="m" data-byn-range="${lo},${hi}">${moneyRange(lo, hi)}</span>`;
    $('#resDays').textContent = e.d0 === e.d1 ? e.d0 : `${e.d0}–${e.d1}`;
    $('#resDaysWord').textContent = daysWord(e.d1);
    const lines = [[`${UI.base}: ${svcTitle(o.svc)}`, c.base[0]]];
    if (c.range) {
      const steps = Math.round((o.n - c.range.min) / (c.range.step || 1));
      lines.push([`${t(c.range.label)}: ${o.n}`, steps > 0 ? steps * c.range.per[0] : null]);
    }
    c.options.forEach((x) => { if (state.opts.has(x.id)) lines.push([t(x.label), x.add[0]]); });
    if (o.urgent) lines.push([UI.urgent, '+30%']);
    $('#resList').innerHTML = lines.map(([l, v]) => `<li><span>${esc(l)}</span><span>${v === null ? '' : typeof v === 'string' ? v : '+' + m(v)}</span></li>`).join('');
    $('#rangeOut').textContent = o.n;
    $('#sendOrder').href = BOT(K.encodeOrder(o));
  }
  function setType(id, keepOpts) {
    if (!CALC[id]) return;
    if (!keepOpts) state.opts.clear();
    state.svc = id;
    state.n = CALC[id].range ? CALC[id].range.value : 0;
    renderType(); update();
  }
  $('#typeGrid').addEventListener('change', (e) => { if (e.target.name === 'type') setType(e.target.value); });
  $('#optGrid').addEventListener('change', (e) => { e.target.checked ? state.opts.add(e.target.value) : state.opts.delete(e.target.value); update(); });
  $('#rangeInput').addEventListener('input', (e) => { state.n = Number(e.target.value); update(); });
  $('#urgent').addEventListener('change', (e) => { state.urgent = e.target.checked; update(); });

  // «Опишите задачу» → тип, опции и количество по ключевым словам (ключ ищем с начала слова: «бот» ≠ «работа»).
  const has = (text, k) => new RegExp('(^|[^a-zа-яё0-9])' + k).test(text);
  let briefTimer;
  $('#brief').addEventListener('input', () => { clearTimeout(briefTimer); briefTimer = setTimeout(detectBrief, 350); });
  function detectBrief() {
    const text = $('#brief').value.toLowerCase(), hint = $('#briefHint');
    if (text.trim().length < 6) { hint.textContent = ''; return; }
    let best = null, score = 0;
    Object.entries(window.SERVICE_KW).forEach(([id, kws]) => {
      const s = kws.reduce((n, k) => n + (has(text, k) ? 1 : 0), 0);
      if (s > score) { best = id; score = s; }
    });
    if (!best) { hint.textContent = UI.briefNone; return; }
    state.opts.clear();
    const c = CALC[best];
    c.options.forEach((o) => { if (o.kw?.some((k) => has(text, k))) state.opts.add(o.id); });
    setType(best, true);
    if (c.range) {
      const mm = text.match(/(\d{1,3})\s*(стр|page|сайт|site|ролик|видео|video|изображ|картин|фото|image|photo|источник|source)/);
      if (mm) {
        // К шагу ползунка, как в боте: иначе «35 фото» на сайте и в боте давали разную смету.
        const step = c.range.step || 1, v = Math.min(c.range.max, Math.max(c.range.min, Number(mm[1])));
        state.n = c.range.min + Math.floor((v - c.range.min) / step) * step;
        renderType(); update();
      }
    }
    const picked = c.options.filter((o) => state.opts.has(o.id)).map((o) => t(o.label));
    hint.textContent = UI.briefFound + svcTitle(best) + (picked.length ? ' + ' + picked.join(', ') : '');
  }
  // Описание в диплинк не влезает (64 символа): копируем его, клиент вставит в чат с ботом.
  $('#sendOrder').addEventListener('click', () => {
    const brief = $('#brief').value.trim();
    if (brief) copy(brief).then((ok) => toast(ok ? UI.copiedCalc : UI.opening)); else toast(UI.opening);
  });

  // ?o=… — вернулись из бота по «Изменить смету»: восстанавливаем калькулятор.
  const back = K.parseOrder(CALC, new URLSearchParams(location.search).get('o'));
  if (back) {
    state.opts = new Set(back.opts); state.urgent = back.urgent;
    setType(back.svc, true);
    state.n = back.n || state.n; $('#urgent').checked = back.urgent;
    renderType(); update();
  } else {
    // Браузер мог восстановить форму (перезагрузка, «назад»): берём тип и «срочно» из неё и перерисовываем опции.
    state.n = CALC[state.svc].range ? CALC[state.svc].range.value : 0;
    state.urgent = $('#urgent').checked;
    renderType(); update();
  }

  // Финальная форма: текст в буфер, бот в новой вкладке.
  $('#finalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = $('#finalText').value.trim();
    const copied = copy(text);   // до window.open: после ухода фокуса в новую вкладку браузер буфер не даст
    window.open(e.target.action, '_blank', 'noopener');
    copied.then((ok) => toast(ok ? UI.copied : UI.opening));
  });

  // ---------- демо Кордона ----------
  const RULES = [
    [/(заработ|доход|прибыл|earn|profit|income|\$\s?\d+\s?(a|per|в)\s?(day|день))/i, { ru: 'обещает лёгкие деньги', en: 'promises easy money' }],
    [/(usdt|крипт|btc|bitcoin|\bton\b|crypto|бирж|airdrop)/i, { ru: 'криптовалюта', en: 'crypto' }],
    [/(в лс|в личк|пиши(те)? мне|write me|dm me|\bdm\b|в директ)/i, { ru: 'зовёт в личку', en: 'lures you to DMs' }],
    [/(t\.me\/\+|joinchat|bit\.ly|clck\.ru|tinyurl)/i, { ru: 'скрытая ссылка-приглашение', en: 'hidden invite link' }],
    [/(раздаю|раздач|бесплатн|giveaway|giving away|бонус|подар|free)/i, { ru: 'раздача или «подарок»', en: 'giveaway or "gift"' }],
    [/(срочно|только сегодня|успей|осталось \d|urgent|right now|\bnow\b|today only|limited)/i, { ru: 'давит срочностью', en: 'pushes urgency' }],
    [/(подработк|без опыта|удал[её]нн\w* работ|no experience|side job)/i, { ru: '«работа» без опыта', en: '"job" with no experience' }],
    [/(инвест|invest|пассивн|passive)/i, { ru: 'инвестиции', en: 'investments' }],
  ];
  const chat = $('#demoChat');
  function addMsg(html, cls) {
    const el = document.createElement('div');
    el.className = 'msg ' + cls; el.innerHTML = html;
    chat.appendChild(el); chat.scrollTop = chat.scrollHeight;
    return el;
  }
  function check(text) {
    if (!text.trim()) return;
    addMsg(esc(text), 'user');
    const typing = addMsg('<span class="typing"><i></i><i></i><i></i></span>', 'bot');
    const reasons = RULES.filter(([re]) => re.test(text)).map(([, r]) => t(r));
    setTimeout(() => {
      typing.remove();
      if (reasons.length >= 2) addMsg(`<b>⚠️ ${UI.scam}</b>${UI.scamText}<ul>${reasons.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`, 'bot bad');
      else if (reasons.length === 1) addMsg(`<b>🔎 ${UI.sus}</b>${UI.susText}<ul><li>${esc(reasons[0])}</li></ul>`, 'bot');
      else addMsg(`<b>✅ ${UI.clean}</b>${UI.cleanText}`, 'bot ok');
    }, reduce ? 50 : 800);
  }
  addMsg(UI.demoHi, 'bot');
  $('#demoChips').innerHTML = UI.presets.map((p, i) => `<button type="button" data-i="${i}">${esc(p.length > 34 ? p.slice(0, 32) + '…' : p)}</button>`).join('');
  $('#demoChips').addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (b) check(UI.presets[b.dataset.i]); });
  $('#demoForm').addEventListener('submit', (e) => { e.preventDefault(); const inp = $('#demoMsg'); check(inp.value.slice(0, 300)); inp.value = ''; });
  let demoPlayed = false;
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting || demoPlayed) return;
    demoPlayed = true; obs.disconnect();
    setTimeout(() => check(UI.presets[0]), reduce ? 0 : 900);
  }, { threshold: 0.6 }).observe($('#demo'));

  // ---------- шапка, меню, активный раздел ----------
  const header = $('.top');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('.burger'), nav = $('#nav');
  const closeNav = () => { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); };
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeNav(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeNav(); burger.focus(); } });
  const links = $$('#nav a');
  const navIO = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => { const s = document.getElementById(a.getAttribute('href').slice(1)); if (s) navIO.observe(s); });

  // ---------- плавающая кнопка на телефоне: после первого экрана, но не поверх калькулятора и финальной формы ----------
  const bar = document.createElement('div');
  bar.className = 'mbar';
  bar.innerHTML = `<a class="btn btn-accent btn-lg" href="${BOT(lang === 'en' ? 'demo_en' : 'demo')}" target="_blank" rel="noopener">${esc(UI.mbar)}</a>`;
  document.body.appendChild(bar);
  const seen = new Map();
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => seen.set(en.target.id, en.isIntersecting));
    bar.classList.toggle('show', !seen.get('top') && !seen.get('calc') && !seen.get('contact'));
  });
  ['top', 'calc', 'contact'].forEach((id) => barIO.observe(document.getElementById(id)));

  paintMoney();
})();
