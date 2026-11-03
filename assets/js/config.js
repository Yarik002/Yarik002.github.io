// Контакты и оплата. Меняй только здесь.
// Реальные реквизиты, токены и номера счетов сюда НЕ вписывать: сайт публичный.
window.CONFIG = {
  name: { ru: 'Ярослав Кирдун', en: 'Yaroslav Kirdun' },
  telegram: 'usernaaamer',            // личка для заказов: t.me/usernaaamer
  email: 'erder101@gmail.com',
  github: 'Yarik002',

  openForOrders: true,                // плашка «Принимаю заказы»

  // Цель в «Дневнике пути». earned обновляй руками после каждой оплаты.
  goal: { show: true, earned: 0, target: 3000, currency: 'BYN' },

  // Курсы для переключателя валют (примерные, только для ориентира).
  rates: { BYN: 1, USD: 0.30, RUB: 25 },

  payments: {
    npdRegistered: false,             // true после регистрации самозанятым (НПД) -> покажется «выдаю чек»
    erip: '',                         // код услуги / путь в ЕРИП, напр. 'Экспресс Платежи → ...' (пусто = «присылаю счёт»)
    starsBot: '',                     // username бота для оплаты Stars (пусто = «скоро»)
    prepayPercent: 50
  }
};
