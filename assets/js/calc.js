// Расчёт сметы и ссылка на заказ. Одна формула для калькулятора, пакетов, сборщика страниц и бота
// (бот сверяет себя с этим файлом тестом). Работает от window.CALC из data.js.
(function (root) {
  'use strict';

  // Смета: база + шаги ползунка + опции; «срочно» = цена +30%, срок на 40% короче.
  function estimate(CALC, o) {
    var c = CALC[o.svc];
    var lo = c.base[0], hi = c.base[1], d0 = c.days[0], d1 = c.days[1];
    if (c.range) {
      var n = Math.round((o.n - c.range.min) / (c.range.step || 1));
      if (n > 0) {
        lo += n * c.range.per[0]; hi += n * c.range.per[1];
        var dd = Math.ceil(n * c.range.perDays); d0 += dd; d1 += dd;
      }
    }
    c.options.forEach(function (opt) {
      if (o.opts.indexOf(opt.id) === -1) return;
      lo += opt.add[0]; hi += opt.add[1]; d0 += Math.ceil(opt.days / 2); d1 += opt.days;
    });
    if (o.urgent) {
      lo = Math.round(lo * 1.3); hi = Math.round(hi * 1.3);
      d0 = Math.max(1, Math.ceil(d0 * 0.6)); d1 = Math.max(d0, Math.ceil(d1 * 0.6));
    }
    return { lo: lo, hi: hi, d0: d0, d1: d1 };
  }

  // start-параметр бота (≤64 символа, A-Za-z0-9_-): o_<услуга>_<кол-во>_<опция-опция>_<флаги u=срочно e=англ>
  function encodeOrder(o) {
    var parts = ['o', o.svc, String(o.n || 0), (o.opts || []).join('-'), (o.urgent ? 'u' : '') + (o.lang === 'en' ? 'e' : '')];
    while (parts.length > 3 && !parts[parts.length - 1]) parts.pop();
    return parts.join('_');
  }

  function parseOrder(CALC, s) {
    var m = String(s || '').match(/^o_([a-z]+)(?:_(\d{1,3})(?:_([a-z0-9-]*)(?:_([a-z]*))?)?)?$/);
    if (!m || !CALC[m[1]]) return null;
    var c = CALC[m[1]], r = c.range, asked = (m[3] || '').split('-');
    var n = 0;
    if (r) {
      var v = Math.min(r.max, Math.max(r.min, Number(m[2] || 0) || r.value));
      n = r.min + Math.floor((v - r.min) / (r.step || 1)) * (r.step || 1);
    }
    return {
      svc: m[1], n: n,
      opts: c.options.map(function (x) { return x.id; }).filter(function (id) { return asked.indexOf(id) !== -1; }),
      urgent: (m[4] || '').indexOf('u') !== -1, lang: (m[4] || '').indexOf('e') !== -1 ? 'en' : null
    };
  }

  // Округление как в боте: BYN до 10.
  function roundByn(v) { return Math.max(10, Math.round(v / 10) * 10); }

  root.KCalc = { estimate: estimate, encodeOrder: encodeOrder, parseOrder: parseOrder, roundByn: roundByn };
})(typeof window !== 'undefined' ? window : globalThis);
