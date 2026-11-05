// Контакты и условия. Меняй только здесь, потом: node tools/build.mjs (пересобрать страницы).
// Реальные реквизиты, токены и номера счетов сюда НЕ вписывать: сайт публичный.
// Реквизиты ЕРИП и карты задаются в боте командой /setpay и уходят клиенту только по кнопке Ярослава.
window.CONFIG = {
  brand: 'Kirdun.dev',                // так подписан сайт и бот
  name: { ru: 'Ярослав Кирдун', en: 'Yaroslav Kirdun' },   // настоящее имя: только в разметке для поисковиков
  bot: 'KirdunSupportBot',            // все заказы, вопросы и оплата идут через этого бота
  github: 'Yarik002',
  site: 'https://yarik002.github.io/',

  // Коды подтверждения Search Console и Яндекс Вебмастера (только значение content="..."), потом node tools/build.mjs.
  verify: { google: 'PkqgeCby6MEHFJXLASaqW0HoQ-eZGgN4Kmd9hIhYxgI', yandex: '' },

  openForOrders: true,               // плашка «Принимаю заказы»

  // Цель в «Дневнике пути». Скрыта: нулевой счётчик клиенту говорит «у него никто не заказывал».
  goal: { show: false, earned: 0, target: 3000, currency: 'BYN' },

  // Курсы для переключателя валют (примерные, только для ориентира).
  rates: { BYN: 1, USD: 0.30, RUB: 25 },

  firstClientsDiscount: 20,           // % первым клиентам в обмен на честный отзыв
  supportDays: 14,                    // дней бесплатных правок после сдачи

  payments: {
    npdRegistered: false,             // true после регистрации самозанятым (НПД) -> покажется «выдаю чек»
    prepayPercent: 50
  }
};
