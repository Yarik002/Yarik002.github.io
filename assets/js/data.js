// Всё содержимое платформы. Новый проект = новый объект в PROJECTS, новая запись в DIARY.
// status: 'live' — работает, можно открыть; 'code' — код на GitHub; 'private' — личный инструмент.
// cat: 'bots' | 'sites' | 'auto'

window.PROJECTS = [
  {
    id: 'kordon', cat: 'bots', status: 'live', img: 'assets/img/kordon.webp', featured: true,
    title: { ru: 'Кордон', en: 'Kordon' },
    tag: { ru: 'AI-страж Telegram-групп', en: 'AI guard for Telegram groups' },
    text: {
      ru: 'Встречает новичков анкетой, проверяет ответы через AI и базу спамеров, ловит скам. Работает 24/7 в облаке Telegram, оплата в Stars. Есть сайт и Mini App.',
      en: 'Greets newcomers with a short form, checks answers with AI and a spammer database, catches scams. Runs 24/7 in Telegram\'s cloud, paid in Stars. Has a site and a Mini App.'
    },
    stack: ['Telegram Serverless', 'JavaScript', 'SQLite', 'Gemini', '150+ tests'],
    links: [
      { label: '@KordonAIBot', href: 'https://t.me/KordonAIBot' },
      { label: { ru: 'Сайт', en: 'Website' }, href: 'https://yarik002.github.io/kordon-site/' }
    ]
  },
  {
    id: 'offer', cat: 'bots', status: 'live', img: 'assets/img/offer.webp', featured: true,
    title: { ru: 'Оффер', en: 'Offer' },
    tag: { ru: 'AI-разбор резюме за 2 минуты', en: 'AI resume review in 2 minutes' },
    text: {
      ru: 'Бот разбирает резюме, даёт правки «было → стало», пишет письмо работодателю и подбирает свежие вакансии с rabota.by и hh.ru. Бот, сайт, админка, 4 тарифа.',
      en: 'The bot reviews a resume, suggests before/after edits, writes a cover letter and finds fresh jobs from rabota.by and hh.ru. Bot, website, admin panel, 4 plans.'
    },
    stack: ['Telegram Serverless', 'JavaScript', 'Gemini', 'GitHub Pages'],
    links: [
      { label: '@OfferCareerBot', href: 'https://t.me/OfferCareerBot' },
      { label: { ru: 'Сайт', en: 'Website' }, href: 'https://yarik002.github.io/offer-site/' }
    ]
  },
  {
    id: 'kvarta', cat: 'sites', status: 'live', img: 'assets/img/kvarta.webp',
    title: { ru: 'Кварта', en: 'Kvarta' },
    tag: { ru: 'Лендинг обжарки кофе, тестовое', en: 'Coffee roastery landing, test task' },
    text: {
      ru: 'Тестовое задание для VitAi World. Форма заявки с маской телефона и UTM-метками, заявки сразу приходят в Telegram. Lighthouse Mobile 95.',
      en: 'Test task for VitAi World. Lead form with phone mask and UTM tags, leads go straight to Telegram. Lighthouse Mobile 95.'
    },
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    links: [
      { label: { ru: 'Сайт', en: 'Website' }, href: 'https://kvarta-landing-psi.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/Yarik002/kvarta-landing' }
    ]
  },
  {
    id: 'smartcoin', cat: 'bots', status: 'code',
    title: { ru: 'SmartCoin AI', en: 'SmartCoin AI' },
    tag: { ru: 'Бот учёта расходов', en: 'Expense tracking bot' },
    text: {
      ru: 'Трата голосом, текстом или фото чека: AI сам ставит сумму и категорию. Баланс, история, Premium-советник по финансам.',
      en: 'Log expenses by voice, text or receipt photo: AI picks the amount and category. Balance, history, Premium finance advisor.'
    },
    stack: ['Python', 'aiogram', 'PostgreSQL', 'Docker', 'Gemini'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yarik002/ai-expense-tracker' }]
  },
  {
    id: 'voice', cat: 'bots', status: 'code',
    title: { ru: 'Voice Summary Bot', en: 'Voice Summary Bot' },
    tag: { ru: 'Голосовые в текст и выжимку', en: 'Voice notes to text and summary' },
    text: {
      ru: 'Расшифровывает голосовые сообщения и присылает короткую выжимку, чтобы не слушать пятиминутные аудио.',
      en: 'Transcribes voice messages and sends a short summary, so you never have to listen to a five-minute audio.'
    },
    stack: ['Python', 'Groq', 'Llama 3', 'ffmpeg'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yarik002/Voice-Summary-Bot' }]
  },
  {
    id: 'profibot', cat: 'bots', status: 'code',
    title: { ru: 'ProfiBot', en: 'ProfiBot' },
    tag: { ru: 'AI-ассистент в Telegram', en: 'AI assistant in Telegram' },
    text: {
      ru: 'Отвечает на вопросы, показывает погоду, генерирует картинки. Есть админ-панель.',
      en: 'Answers questions, shows the weather, generates images. Comes with an admin panel.'
    },
    stack: ['Python', 'OpenRouter', 'SQLite'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yarik002/ProfiBot' }]
  },
  {
    id: 'deribit', cat: 'auto', status: 'code',
    title: { ru: 'Deribit Price Service', en: 'Deribit Price Service' },
    tag: { ru: 'Сбор цен BTC/ETH каждую минуту', en: 'BTC/ETH prices every minute' },
    text: {
      ru: 'Сервис сам забирает цены с биржи, хранит историю в PostgreSQL и отдаёт её по API. 6 контейнеров, 120+ тестов.',
      en: 'Pulls prices from the exchange on schedule, keeps history in PostgreSQL and serves it via API. 6 containers, 120+ tests.'
    },
    stack: ['FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'Docker'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yarik002/deribit-price-service' }]
  },
  {
    id: 'csvrec', cat: 'auto', status: 'code',
    title: { ru: 'CSV Video Recorder', en: 'CSV Video Recorder' },
    tag: { ru: 'Автоматизация браузера', en: 'Browser automation' },
    text: {
      ru: 'Берёт сценарий из CSV, сам проходит его в браузере и записывает видео. Удобно для демо и проверки сайтов.',
      en: 'Takes a script from CSV, walks through it in a browser and records a video. Handy for demos and site checks.'
    },
    stack: ['Python', 'Playwright'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yarik002/csv-video-recorder' }]
  },
  {
    id: 'cards', cat: 'auto', status: 'code',
    title: { ru: 'Product Card Assistant', en: 'Product Card Assistant' },
    tag: { ru: 'Карточки товаров через LLM', en: 'LLM product cards' },
    text: {
      ru: 'Черновик карточки товара для магазина: LLM пишет текст, код проверяет, чтобы модель не выдумывала характеристики.',
      en: 'Drafts product cards for a store: the LLM writes, code checks it so the model never invents specs.'
    },
    stack: ['Python', 'LLM'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yarik002/product-card-assistant' }]
  },
  {
    id: 'jobsearch', cat: 'auto', status: 'private',
    title: { ru: 'Job Search AI', en: 'Job Search AI' },
    tag: { ru: 'Свой парсер вакансий', en: 'My own job parser' },
    text: {
      ru: 'Собирает вакансии с 7 сайтов, считает совпадение с резюме и готовит письмо под каждую. Личный инструмент, показываю на созвоне.',
      en: 'Collects jobs from 7 sites, scores the match with a resume and drafts a letter for each one. Personal tool, I can demo it on a call.'
    },
    stack: ['Python', 'requests', 'BeautifulSoup', 'pandas'],
    links: []
  }
];

// Услуги. price.from — цена «от» в BYN. Цены нужно подтвердить Ярославу.
window.SERVICES = [
  {
    id: 'site', icon: 'site', calc: 'site',
    title: { ru: 'Сайты под ключ', en: 'Websites, turnkey' },
    lead: { ru: 'Лендинг или сайт-визитка, который продаёт, а не просто висит.', en: 'A landing page or business site that sells, not just sits there.' },
    includes: {
      ru: ['Структура и тексты под вашу аудиторию', 'Дизайн и адаптив под телефон', 'Заявки сразу в Telegram', 'Домен, хостинг, SSL, подключение', 'Базовое SEO и аналитика'],
      en: ['Structure and copy for your audience', 'Design that works on phones', 'Leads straight to Telegram', 'Domain, hosting, SSL setup', 'Basic SEO and analytics']
    },
    days: { ru: '3–10 дней', en: '3–10 days' }, from: 250
  },
  {
    id: 'bot', icon: 'bot', calc: 'bot',
    title: { ru: 'Telegram-боты', en: 'Telegram bots' },
    lead: { ru: 'Бот, который принимает заявки, отвечает клиентам и берёт оплату, пока вы спите.', en: 'A bot that takes orders, answers clients and collects payments while you sleep.' },
    includes: {
      ru: ['Меню, заявки, запись, FAQ', 'AI-ответы (Gemini, GPT)', 'Оплата в Telegram Stars', 'Админка и рассылки', 'Хостинг 24/7 без вашего сервера'],
      en: ['Menus, orders, booking, FAQ', 'AI replies (Gemini, GPT)', 'Telegram Stars payments', 'Admin panel and broadcasts', '24/7 hosting, no server needed']
    },
    days: { ru: '3–14 дней', en: '3–14 days' }, from: 200
  },
  {
    id: 'parser', icon: 'parser', calc: 'parser',
    title: { ru: 'Парсеры и автоматизация', en: 'Scrapers & automation' },
    lead: { ru: 'Соберу данные с сайтов и уберу ручную рутину: таблицы, отчёты, уведомления.', en: 'I collect data from websites and remove manual routine: sheets, reports, alerts.' },
    includes: {
      ru: ['Сбор цен, товаров, вакансий, контактов', 'Выгрузка в Excel / Google Таблицы', 'Запуск по расписанию', 'Уведомления в Telegram', 'Скрипты под ваши процессы'],
      en: ['Prices, products, jobs, contacts', 'Export to Excel / Google Sheets', 'Scheduled runs', 'Telegram alerts', 'Scripts for your workflows']
    },
    days: { ru: '1–5 дней', en: '1–5 days' }, from: 120
  },
  {
    id: 'video', icon: 'video', calc: 'video',
    title: { ru: 'Видеомонтаж и реклама', en: 'Video editing & ads' },
    lead: { ru: 'Короткие ролики для Reels, Shorts и TikTok, которые досматривают до конца.', en: 'Short videos for Reels, Shorts and TikTok that people watch till the end.' },
    includes: {
      ru: ['Монтаж из ваших исходников', 'Субтитры, музыка, переходы', 'Рекламные ролики 15–60 секунд', 'AI-озвучка и AI-кадры', 'Форматы 9:16, 1:1, 16:9'],
      en: ['Editing from your footage', 'Subtitles, music, transitions', 'Ad videos, 15–60 seconds', 'AI voice-over and AI shots', '9:16, 1:1, 16:9 formats']
    },
    days: { ru: '1–3 дня', en: '1–3 days' }, from: 40
  },
  {
    id: 'visual', icon: 'visual', calc: 'visual',
    title: { ru: 'AI-фото и визуал', en: 'AI photos & visuals' },
    lead: { ru: 'Картинки для соцсетей, карточек товаров и рекламы без фотостудии.', en: 'Images for social media, product cards and ads without a photo studio.' },
    includes: {
      ru: ['Фото товаров и интерьеров', 'Обложки, аватарки, баннеры', 'Карточки для маркетплейсов', 'Единый стиль для бренда', 'Ретушь и доработка'],
      en: ['Product and interior shots', 'Covers, avatars, banners', 'Marketplace product cards', 'One consistent brand style', 'Retouching and fixes']
    },
    days: { ru: '1–3 дня', en: '1–3 days' }, from: 50
  }
];

// Калькулятор. Цена = база + опции, всё в BYN, диапазон [мин, макс].
// range: ползунок, per — доплата за каждую единицу сверх min.
window.CALC = {
  site: {
    base: [250, 400], days: [3, 6],
    range: { id: 'pages', min: 1, max: 10, value: 1, per: [60, 90], perDays: 1, label: { ru: 'Страниц', en: 'Pages' } },
    options: [
      { id: 'design', add: [150, 250], days: 3, label: { ru: 'Анимации и дизайн «вау»', en: 'Animations & wow design' }, kw: ['анимац', 'дизайн', 'красив', 'animation', 'design'] },
      { id: 'lang', add: [100, 150], days: 2, label: { ru: 'Второй язык', en: 'Second language' }, kw: ['язык', 'англ', 'english', 'language', 'перевод'] },
      { id: 'form', add: [40, 60], days: 1, label: { ru: 'Заявки в Telegram', en: 'Leads to Telegram' }, kw: ['заявк', 'форм', 'lead', 'form'] },
      { id: 'domain', add: [40, 60], days: 0, label: { ru: 'Домен и хостинг под ключ', en: 'Domain & hosting setup' }, kw: ['домен', 'хостинг', 'domain', 'hosting'] },
      { id: 'cms', add: [200, 350], days: 4, label: { ru: 'Админка для правок', en: 'Admin to edit content' }, kw: ['админ', 'cms', 'редакт', 'admin'] }
    ]
  },
  bot: {
    base: [200, 300], days: [3, 5],
    options: [
      { id: 'pay', add: [150, 250], days: 3, label: { ru: 'Приём оплаты', en: 'Payments' }, kw: ['оплат', 'плат', 'stars', 'pay', 'деньг'] },
      { id: 'ai', add: [150, 300], days: 3, label: { ru: 'AI-ответы', en: 'AI replies' }, kw: ['ai', 'ии', 'нейро', 'искусств', 'gpt', 'gemini', 'умн'] },
      { id: 'admin', add: [150, 250], days: 3, label: { ru: 'Админка и рассылки', en: 'Admin & broadcasts' }, kw: ['админ', 'рассыл', 'admin', 'broadcast'] },
      { id: 'miniapp', add: [300, 500], days: 5, label: { ru: 'Mini App внутри Telegram', en: 'Telegram Mini App' }, kw: ['mini app', 'мини', 'приложен', 'webapp'] },
      { id: 'crm', add: [100, 200], days: 2, label: { ru: 'Связка с таблицей / CRM', en: 'Sheets / CRM integration' }, kw: ['crm', 'таблиц', 'sheet', 'битрикс', 'amo'] }
    ]
  },
  parser: {
    base: [120, 200], days: [1, 3],
    range: { id: 'sources', min: 1, max: 10, value: 1, per: [60, 100], perDays: 1, label: { ru: 'Сайтов-источников', en: 'Source sites' } },
    options: [
      { id: 'schedule', add: [80, 120], days: 1, label: { ru: 'Запуск по расписанию', en: 'Scheduled runs' }, kw: ['расписан', 'каждый день', 'регуляр', 'ежеднев', 'schedule', 'daily'] },
      { id: 'sheets', add: [40, 60], days: 0, label: { ru: 'Выгрузка в Google Таблицы', en: 'Export to Google Sheets' }, kw: ['таблиц', 'excel', 'sheet', 'эксель'] },
      { id: 'notify', add: [40, 60], days: 0, label: { ru: 'Уведомления в Telegram', en: 'Telegram alerts' }, kw: ['уведомл', 'оповещ', 'alert', 'notify'] },
      { id: 'hard', add: [100, 200], days: 2, label: { ru: 'Сложный сайт (защита, JS)', en: 'Hard site (protection, JS)' }, kw: ['защит', 'капч', 'cloudflare', 'авториз', 'login'] }
    ]
  },
  video: {
    base: [40, 70], days: [1, 2],
    range: { id: 'count', min: 1, max: 20, value: 1, per: [35, 60], perDays: 0.5, label: { ru: 'Роликов', en: 'Videos' } },
    options: [
      { id: 'ad', add: [100, 180], days: 2, label: { ru: 'Рекламный ролик со сценарием', en: 'Ad video with a script' }, kw: ['реклам', 'сценар', 'ad', 'promo'] },
      { id: 'aivo', add: [60, 120], days: 1, label: { ru: 'AI-озвучка и AI-кадры', en: 'AI voice & AI shots' }, kw: ['озвуч', 'голос', 'voice'] },
      { id: 'subs', add: [20, 40], days: 0, label: { ru: 'Субтитры', en: 'Subtitles' }, kw: ['субтитр', 'subtit', 'caption'] }
    ]
  },
  visual: {
    base: [50, 80], days: [1, 2],
    range: { id: 'images', min: 10, max: 100, value: 10, step: 10, per: [4, 6], perDays: 0.1, label: { ru: 'Изображений', en: 'Images' } },
    options: [
      { id: 'cards', add: [60, 120], days: 1, label: { ru: 'Карточки для маркетплейсов', en: 'Marketplace cards' }, kw: ['карточ', 'маркетплейс', 'wildberries', 'ozon', 'wb'] },
      { id: 'style', add: [50, 100], days: 1, label: { ru: 'Единый стиль бренда', en: 'Consistent brand style' }, kw: ['стиль', 'бренд', 'brand', 'style'] },
      { id: 'retouch', add: [30, 60], days: 1, label: { ru: 'Ретушь ваших фото', en: 'Retouch your photos' }, kw: ['ретуш', 'обработ', 'retouch'] }
    ]
  }
};

// Ключевые слова для «опиши задачу → смета».
window.SERVICE_KW = {
  site: ['сайт', 'лендинг', 'визитк', 'страниц', 'интернет-магазин', 'site', 'website', 'landing', 'web'],
  bot: ['бот', 'телеграм', 'telegram', 'bot', 'чат-бот'],
  parser: ['парс', 'собрать', 'сбор', 'конкурент', 'мониторинг', 'цены', 'каждый день', 'ежеднев', 'выгруз', 'автоматиз', 'скрипт', 'scrap', 'pars', 'automat'],
  video: ['видео', 'ролик', 'монтаж', 'reels', 'рилс', 'tiktok', 'тикток', 'shorts', 'video'],
  visual: ['фото', 'картин', 'изображ', 'визуал', 'баннер', 'обложк', 'логотип', 'image', 'photo', 'visual']
};

// Дневник пути: только реальные события. Новые записи добавляй сверху.
window.DIARY = [
  {
    date: '2026-11-03',
    title: { ru: 'Запустил эту платформу', en: 'Launched this platform' },
    text: { ru: 'Собрал все проекты и услуги в одном месте. Дальше: первые заказы и предложения бизнесам.', en: 'Put all projects and services in one place. Next: first orders and offers to businesses.' }
  },
  {
    date: '2026-10-27',
    title: { ru: 'Кордон: пробный Pro в проде', en: 'Kordon: Pro trial is live' },
    text: { ru: 'Добавил бесплатные 7 дней Pro. Бот работает в настоящих группах.', en: 'Added a free 7-day Pro trial. The bot runs in real groups.' }
  },
  {
    date: '2026-10-24',
    title: { ru: 'За день: исследование рынка и Кордон', en: 'One day: market research and Kordon' },
    text: { ru: '7 исследований рынка, выбор идеи, бот с 79 тестами и деплой в облако Telegram. Вечером поймал первый скам в живой группе.', en: '7 market studies, picked the idea, built a bot with 79 tests and deployed it to Telegram\'s cloud. Caught the first scam in a live group that evening.' }
  },
  {
    date: '2026-10-21',
    title: { ru: 'Запустил «Оффер» и получил урок', en: 'Launched Offer and learned a lesson' },
    text: { ru: 'Бот, сайт, 4 тарифа. За 3 дня ноль внешних пользователей. Вывод: продукт без трафика не продаёт, поэтому теперь пишу бизнесам сам.', en: 'Bot, website, 4 plans. Zero outside users in 3 days. Lesson: a product without traffic doesn\'t sell, so now I reach out to businesses myself.' }
  }
];

window.PROCESS = [
  { ru: ['Заявка', 'Пишете в Telegram или собираете смету в калькуляторе. Отвечаю в течение дня.'], en: ['Request', 'Message me on Telegram or build an estimate in the calculator. I reply within a day.'] },
  { ru: ['Бесплатное демо', 'Делаю первый экран сайта или прототип бота, чтобы вы увидели результат до оплаты.'], en: ['Free demo', 'I build the first screen of the site or a bot prototype, so you see the result before paying.'] },
  { ru: ['Договор и предоплата', 'Фиксируем объём, цену и срок в переписке. Предоплата 50%.'], en: ['Agreement & deposit', 'We fix scope, price and deadline in writing. 50% upfront.'] },
  { ru: ['Работа на виду', 'Показываю промежуточные версии, правки обсуждаем сразу, а не в конце.'], en: ['Work in the open', 'I show work-in-progress versions; we discuss edits as we go, not at the end.'] },
  { ru: ['Сдача и поддержка', 'Запускаю, передаю доступы и исходники. 14 дней бесплатно правлю ошибки.'], en: ['Launch & support', 'I launch, hand over access and source code. 14 days of free bug fixes.'] }
];

window.FAQ = [
  { ru: ['Почему у тебя дешевле, чем в студиях?', 'Я работаю один, без менеджеров и офиса. Платите за работу, а не за накладные расходы. Взамен прошу честный отзыв.'], en: ['Why are you cheaper than agencies?', 'I work solo, without managers or an office. You pay for the work, not overhead. In return I ask for an honest review.'] },
  { ru: ['А если результат не понравится?', 'Поэтому сначала бесплатное демо. Если не зашло, расходимся без оплаты. Дальше правки входят в цену.'], en: ['What if I don\'t like the result?', 'That\'s why there is a free demo first. If it doesn\'t click, we part ways with no payment. After that, edits are included.'] },
  { ru: ['Исходники и доступы будут мои?', 'Да. Домен, хостинг, бот и код оформляются на вас, я передаю всё после оплаты.'], en: ['Will I own the code and accounts?', 'Yes. Domain, hosting, bot and code are registered to you; I hand everything over after payment.'] },
  { ru: ['Работаешь с другими странами?', 'Да, с Беларусью, Россией, Казахстаном и не только. Общаемся в Telegram, способ оплаты обсудим.'], en: ['Do you work with other countries?', 'Yes: Belarus, Russia, Kazakhstan and beyond. We talk on Telegram and agree on a payment method.'] },
  { ru: ['Что нужно от меня, чтобы начать?', 'Пара предложений о задаче и примеры того, что нравится. Остальное спрошу сам.'], en: ['What do you need from me to start?', 'A couple of sentences about the task and examples you like. I\'ll ask the rest.'] }
];
