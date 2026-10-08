/**
 * Visitor Telemetry & Privacy Consent Tracker
 * Handles:
 * - Cookie / Privacy Consent Popup & Policy Modal
 * - Multilingual Support (8 languages: EN, BN, ES, DE, FR, AR, JA, HI) with RTL support
 * - Automatic Location-Based Language Suggestion on First Visit
 * - Anonymous Geo-IP country & city lookup (with graceful fallbacks)
 * - Real-time staying time (session duration heartbeat & beforeunload flush)
 * - Device, OS, browser, referrer, and section navigation analytics
 * - Seamless integration with PortfolioDataService
 */
(function () {
  'use strict';

  // Comprehensive i18n Translation Dictionary for Consent UI, Policy & Navigation
  const COOKIE_I18N = {
    en: {
      langName: 'English',
      nativeName: 'English (US)',
      title: 'Privacy & Cookie Preferences',
      desc: 'We use minimal cookies and anonymous visitor telemetry (approx. country, device, staying time) to analyze portfolio traffic and elevate user experience. No personal ad tracking.',
      readPolicy: 'Read Policy',
      rejectBtn: 'Reject All',
      acceptBtn: 'Accept All',
      suggestTemplate: 'Visiting from {country}? Switch to {native} ({name})?',
      switchBtn: 'Switch to {native}',
      keepBtn: 'Keep English',
      statusAccepted: 'Consent Accepted (Full Analytics Active)',
      statusRejected: 'Consent Rejected (Anonymous / Opted Out)',
      statusPending: 'Not Decided (Pending Decision)',
      modalTitle: 'Privacy, Cookie & Visitor Telemetry Policy',
      policyH1: '1. Commitment to Ethical Transparency',
      policyIntro: 'Welcome to the professional portfolio of <strong>Hamim Mahamud Hamy</strong> (<em>hamilio.netlify.app</em>). We value your privacy and believe in radical transparency regarding how visitor telemetry is processed.',
      policyKeyTag: 'Key Takeaway:',
      policyKeyText: 'We do NOT sell data, do NOT use third-party advertising cookies, and do NOT track you across the web. You have total freedom to Accept or Reject telemetry at any time.',
      policyH2: '2. What Data We Collect',
      policyP2Intro: 'When you browse this portfolio with your consent, we record anonymous, non-personally identifiable metrics:',
      policyP2List: [
        '<strong>Approximate Geolocation:</strong> Country and city inferred from non-identifying IP lookup to understand international audience reach. We do not store your exact IP address.',
        '<strong>Session Staying Time:</strong> Duration spent actively reading portfolio sections, case studies, and resume details.',
        '<strong>Device &amp; Browser Architecture:</strong> Device category (Desktop, Mobile, Tablet), operating system, browser engine, and screen resolution to optimize responsiveness.',
        '<strong>Referral Channels:</strong> Traffic origin (e.g. LinkedIn, GitHub, Google, WhatsApp, Direct) to measure outreach effectiveness.',
        '<strong>Direct Contact Submissions:</strong> If you intentionally fill out the contact form, your name, email, subject, and message are securely relayed to Hamim.'
      ],
      policyH3: '3. What We Strictly Do NOT Collect',
      policyP3List: [
        'No tracking across external websites or social profiles.',
        'No personal identification numbers, financial info, or cookies sold to data brokers.',
        'No marketing remarketing pixels or cross-domain ad profiling.'
      ],
      policyH4: '4. Cookies &amp; Local Storage Usage',
      policyP4Intro: 'We use browser <code>localStorage</code> and <code>sessionStorage</code> solely for essential functionality:',
      policyP4List: [
        'Saving your consent choice (Accept or Reject) so you are not prompted repeatedly.',
        'Persisting dynamic portfolio customization and real-time administrative edits.',
        'Maintaining an active session duration timer while you browse.'
      ],
      policyH5: '5. Your Rights &amp; Preference Control',
      policyP5Text: 'You are in full control. If you choose <strong>Reject All</strong>, external IP queries and active duration telemetry are immediately disabled, and your choice is honored. You can reopen this policy and modify your decision at any time via the <em>"Privacy &amp; Policy"</em> link in the site footer.',
      policyH6: '6. Contact for Privacy Inquiries',
      policyP6Intro: 'If you have questions regarding this policy or wish to request data deletion, contact Hamim directly:',
      modalPreferenceLabel: 'Your Preference:',
      nav: {
        home: 'Home',
        about: 'About',
        resume: 'Resume',
        services: 'Services',
        portfolio: 'Portfolio',
        contact: 'Contact'
      },
      footerPolicy: 'Privacy & Policy',
      footerSettings: 'Cookie & Language Settings'
    },
    bn: {
      langName: 'Bengali',
      nativeName: 'বাংলা',
      title: 'গোপনীয়তা ও কুকি সেটিংস',
      desc: 'আমরা পোর্টফোলিও ট্র্যাফিক বিশ্লেষণ ও অভিজ্ঞতা উন্নত করতে ন্যূনতম কুকি এবং বেনামী ভিজিটর ডেটা (আনুমানিক দেশ, ডিভাইস, দেখার সময়) ব্যবহার করি। কোনো বাণিজ্যিক বিজ্ঞাপন ট্র্যাকিং নেই।',
      readPolicy: 'নীতিমালা পড়ুন',
      rejectBtn: 'সব প্রত্যাখ্যান',
      acceptBtn: 'সব গ্রহণ করুন',
      suggestTemplate: 'বাংলাদেশ থেকে দেখছেন? ভাষা পরিবর্তন করে বাংলা করবেন?',
      switchBtn: 'বাংলায় দেখুন',
      keepBtn: 'ইংরেজি রাখুন',
      statusAccepted: 'সম্মতি গৃহীত (সম্পূর্ণ অ্যানালিটিক্স সক্রিয়)',
      statusRejected: 'সম্মতি প্রত্যাখ্যাত (বেনামী / অপ্ট-আউট)',
      statusPending: 'সিদ্ধান্ত অনির্ধারিত (অপেক্ষমাণ)',
      modalTitle: 'গোপনীয়তা, কুকি ও ভিজিটর টেলিমেট্রি পলিসি',
      policyH1: '১. স্বচ্ছতা ও সততার অঙ্গীকার',
      policyIntro: '<strong>হামিম মাহমুদ হামি</strong>-এর প্রফেশনাল পোর্টফোলিওতে (<em>hamilio.netlify.app</em>) স্বাগতম। আমরা আপনার গোপনীয়তাকে সম্মান করি এবং স্বচ্ছ ডেটা প্রক্রিয়াকরণে বিশ্বাস করি।',
      policyKeyTag: 'প্রধান বার্তা:',
      policyKeyText: 'আমরা কোনো ডেটা বিক্রি করি না, তৃতীয় পক্ষের ট্র্যাকিং কুকি ব্যবহার করি না এবং বিভিন্ন ওয়েবসাইটে আপনাকে ট্র্যাক করি না। যেকোনো সময় ডেটা গ্রহণ বা প্রত্যাখ্যান করার সম্পূর্ণ স্বাধীনতা আপনার রয়েছে।',
      policyH2: '২. আমরা কী ধরনের তথ্য সংগ্রহ করি',
      policyP2Intro: 'আপনার সম্মতিতে যখন আপনি এই পোর্টফোলিও পরিদর্শন করেন, আমরা সম্পূর্ণ বেনামী মেট্রিক্স রেকর্ড করি:',
      policyP2List: [
        '<strong>আনুমানিক ভৌগোলিক অবস্থান:</strong> আন্তর্জাতিক দর্শক পরিমাপের জন্য সাধারণ আইপি থেকে অনুমানকৃত দেশ ও শহর। আমরা আপনার সঠিক আইপি ঠিকানা সংরক্ষণ করি না।',
        '<strong>ওয়েবসাইটে থাকার সময়:</strong> পোর্টফোলিওর বিভিন্ন সেকশন, কেস স্টাডি ও সিভি পড়ার জন্য ব্যয়কৃত সময়।',
        '<strong>ডিভাইস ও ব্রাউজার আর্কিটেকচার:</strong> ইন্টারফেস উন্নত করতে ডিভাইস ক্যাটাগরি (ডেস্কটপ, মোবাইল, ট্যাবলেট), অপারেটিং সিস্টেম ও ব্রাউজার।',
        '<strong>রেফারেল চ্যানেল:</strong> ট্র্যাফিকের উৎস (যেমন লিঙ্কডইন, গিটহাব, গুগল, হোয়াটসঅ্যাপ বা ডিরেক্ট)।',
        '<strong>যোগাযোগ ফর্মের তথ্য:</strong> আপনি নিজে যোগাযোগ ফর্মে নাম, ইমেইল ও বার্তা লিখলে তা নিরাপদে হামিমের কাছে পৌঁছায়।'
      ],
      policyH3: '৩. আমরা যা কখনই সংগ্রহ করি না',
      policyP3List: [
        'বাহ্যিক ওয়েবসাইট বা সামাজিক প্ল্যাটফর্মে কোনো ট্র্যাকিং নেই।',
        'কোনো ব্যক্তিগত পরিচয়পত্র, ব্যাংকিং তথ্য বা ডেটা ব্রোকারদের কাছে তথ্য বিক্রয় নেই।',
        'কোনো বিজ্ঞাপন রিমার্কেটিং পিক্সেল বা ক্রস-ডোমেন প্রোফাইলিং নেই।'
      ],
      policyH4: '৪. কুকি ও লোকাল স্টোরেজ ব্যবহার',
      policyP4Intro: 'আমরা ব্রাউজারের <code>localStorage</code> এবং <code>sessionStorage</code> কেবল প্রয়োজনীয় কাজের জন্য ব্যবহার করি:',
      policyP4List: [
        'আপনার সম্মতির সিদ্ধান্ত (গ্রহণ বা প্রত্যাখ্যান) সংরক্ষণ করা যাতে বারবার পপআপ না আসে।',
        'ডায়নামিক পোর্টফোলিও কনফিগারেশন সংরক্ষণ।',
        'ভিজিটর সেশনের সক্রিয় সময় গণনা।'
      ],
      policyH5: '৫. আপনার অধিকার ও পছন্দের নিয়ন্ত্রণ',
      policyP5Text: 'নিয়ন্ত্রণ সম্পূর্ণ আপনার হাতে। আপনি <strong>সব প্রত্যাখ্যান</strong> নির্বাচন করলে বাইরের আইপি অনুসন্ধান এবং সময় ট্র্যাকিং তৎক্ষণাৎ বন্ধ হয়ে যাবে। আপনি সাইটের ফুটারের <em>"Privacy &amp; Policy"</em> লিঙ্কে ক্লিক করে যেকোনো সময় সিদ্ধান্ত পরিবর্তন করতে পারবেন।',
      policyH6: '৬. গোপনীয়তা সংক্রান্ত যোগাযোগ',
      policyP6Intro: 'নীতিমালা সম্পর্কে কোনো প্রশ্ন থাকলে সরাসরি হামিমের সাথে যোগাযোগ করুন:',
      modalPreferenceLabel: 'আপনার পছন্দ:',
      nav: {
        home: 'হোম',
        about: 'পরিচিতি',
        resume: 'সিভি',
        services: 'সেবাসমূহ',
        portfolio: 'পোর্টফোলিও',
        contact: 'যোগাযোগ'
      },
      footerPolicy: 'গোপনীয়তা নীতিমালা',
      footerSettings: 'কুকি ও ভাষা সেটিংস'
    },
    es: {
      langName: 'Spanish',
      nativeName: 'Español',
      title: 'Privacidad y Preferencias de Cookies',
      desc: 'Utilizamos cookies mínimas y telemetría de visitas anónima (país aproximado, dispositivo, tiempo de permanencia) para optimizar el portafolio. Cero anuncios personales.',
      readPolicy: 'Leer Política',
      rejectBtn: 'Rechazar todo',
      acceptBtn: 'Aceptar todo',
      suggestTemplate: '¿Nos visitas desde {country}? ¿Cambiar a Español?',
      switchBtn: 'Cambiar a Español',
      keepBtn: 'Mantener inglés',
      statusAccepted: 'Consentimiento Aceptado (Analítica Completa)',
      statusRejected: 'Consentimiento Rechazado (Anónimo / Excluido)',
      statusPending: 'No decidido (Pendiente)',
      modalTitle: 'Política de Privacidad, Cookies y Telemetría',
      policyH1: '1. Compromiso con la Transparencia Ética',
      policyIntro: 'Bienvenido al portafolio profesional de <strong>Hamim Mahamud Hamy</strong> (<em>hamilio.netlify.app</em>). Valoramos su privacidad y creemos en la transparencia total.',
      policyKeyTag: 'Punto Clave:',
      policyKeyText: 'NO vendemos datos, NO usamos cookies de publicidad de terceros y NO rastreamos su actividad en la web. Puede Aceptar o Rechazar en cualquier momento.',
      policyH2: '2. Qué datos recopilamos',
      policyP2Intro: 'Cuando navega con su consentimiento, recopilamos métricas anónimas:',
      policyP2List: [
        '<strong>Ubicación aproximada:</strong> País y ciudad deducidos de IP para comprender el alcance internacional sin almacenar su IP exacta.',
        '<strong>Tiempo de permanencia:</strong> Duración de lectura en secciones del portafolio, proyectos y currículum.',
        '<strong>Dispositivo y Navegador:</strong> Categoría (escritorio, móvil, tableta), sistema operativo y navegador para mejorar la experiencia.',
        '<strong>Fuentes de referencia:</strong> Origen del tráfico (LinkedIn, GitHub, Google, WhatsApp, Directo).',
        '<strong>Formulario de contacto:</strong> Nombre, correo y mensaje enviados voluntariamente a Hamim.'
      ],
      policyH3: '3. Lo que estrictamente NO recopilamos',
      policyP3List: [
        'Sin seguimiento en sitios externos o redes sociales.',
        'Sin datos financieros ni venta de información a terceros.',
        'Sin píxeles de remarketing publicitario.'
      ],
      policyH4: '4. Uso de Cookies y Almacenamiento Local',
      policyP4Intro: 'Utilizamos <code>localStorage</code> y <code>sessionStorage</code> solo para funciones esenciales:',
      policyP4List: [
        'Guardar su elección de consentimiento para evitar avisos repetitivos.',
        'Mantener la personalización dinámica del portafolio.',
        'Medir la duración de la sesión activa.'
      ],
      policyH5: '5. Sus derechos y control',
      policyP5Text: 'Usted tiene el control total. Si elige <strong>Rechazar todo</strong>, las consultas externas de IP se desactivan de inmediato. Puede modificar su preferencia en cualquier momento desde el pie de página.',
      policyH6: '6. Consultas sobre privacidad',
      policyP6Intro: 'Si tiene preguntas o desea solicitar eliminación de datos, contacte a Hamim:',
      modalPreferenceLabel: 'Su preferencia:',
      nav: {
        home: 'Inicio',
        about: 'Sobre mí',
        resume: 'Currículum',
        services: 'Servicios',
        portfolio: 'Portafolio',
        contact: 'Contacto'
      },
      footerPolicy: 'Política de Privacidad',
      footerSettings: 'Configuración de Cookies e Idioma'
    },
    de: {
      langName: 'German',
      nativeName: 'Deutsch',
      title: 'Datenschutz- & Cookie-Einstellungen',
      desc: 'Wir verwenden minimale Cookies und anonyme Besuchermetriken (Land, Gerät, Verweildauer), um das Portfolio-Erlebnis zu optimieren. Keine Werbetracker.',
      readPolicy: 'Richtlinie lesen',
      rejectBtn: 'Alle ablehnen',
      acceptBtn: 'Alle akzeptieren',
      suggestTemplate: 'Besuch aus {country}? Zu Deutsch wechseln?',
      switchBtn: 'Auf Deutsch wechseln',
      keepBtn: 'Englisch behalten',
      statusAccepted: 'Einwilligung erteilt (Vollständige Analytik)',
      statusRejected: 'Einwilligung abgelehnt (Anonym / Deaktiviert)',
      statusPending: 'Nicht entschieden (Ausstehend)',
      modalTitle: 'Datenschutz-, Cookie- und Telemetrie-Richtlinie',
      policyH1: '1. Verpflichtung zu ethischer Transparenz',
      policyIntro: 'Willkommen im professionellen Portfolio von <strong>Hamim Mahamud Hamy</strong> (<em>hamilio.netlify.app</em>). Wir schätzen Ihre Privatsphäre und setzen auf absolute Transparenz.',
      policyKeyTag: 'Wichtigste Erkenntnis:',
      policyKeyText: 'Wir verkaufen KEINE Daten, verwenden KEINE Werbe-Cookies von Drittanbietern und verfolgen Sie NICHT im Internet. Sie können jederzeit zustimmen oder ablehnen.',
      policyH2: '2. Welche Daten wir erfassen',
      policyP2Intro: 'Wenn Sie mit Ihrer Zustimmung surfen, erfassen wir anonyme Metriken:',
      policyP2List: [
        '<strong>Ungefährer Standort:</strong> Land und Stadt zur Reichweitenanalyse ohne Speicherung Ihrer genauen IP.',
        '<strong>Verweildauer:</strong> Zeit, die Sie mit dem Lesen von Abschnitten, Projekten und Lebenslauf verbringen.',
        '<strong>Gerät &amp; Browser:</strong> Gerätekategorie, Betriebssystem und Browser für optimale Darstellung.',
        '<strong>Verweisquellen:</strong> Herkunft des Datenverkehrs (LinkedIn, GitHub, Google, WhatsApp, Direkt).',
        '<strong>Kontaktformular:</strong> Freiwillig übermittelte Angaben (Name, E-Mail, Nachricht) an Hamim.'
      ],
      policyH3: '3. Was wir strikt NICHT erfassen',
      policyP3List: [
        'Kein websiteübergreifendes Tracking oder Social-Media-Profiling.',
        'Keine Finanzdaten und kein Verkauf von Informationen.',
        'Keine Werbe-Remarketing-Pixel.'
      ],
      policyH4: '4. Verwendung von Cookies &amp; Local Storage',
      policyP4Intro: 'Wir nutzen <code>localStorage</code> und <code>sessionStorage</code> ausschließlich für essenzielle Funktionen:',
      policyP4List: [
        'Speichern Ihrer Einwilligungswahl zur Vermeidung wiederholter Popups.',
        'Dynamische Personalisierung der Portfolioinhalte.',
        'Messung der aktiven Sitzungsdauer.'
      ],
      policyH5: '5. Ihre Rechte und Präferenzen',
      policyP5Text: 'Sie haben die volle Kontrolle. Wenn Sie <strong>Alle ablehnen</strong> wählen, werden externe IP-Abfragen sofort deaktiviert. Sie können Ihre Auswahl jederzeit in der Fußzeile ändern.',
      policyH6: '6. Kontakt für Datenschutzfragen',
      policyP6Intro: 'Bei Fragen zum Datenschutz kontaktieren Sie Hamim direkt:',
      modalPreferenceLabel: 'Ihre Präferenz:',
      nav: {
        home: 'Start',
        about: 'Über mich',
        resume: 'Lebenslauf',
        services: 'Leistungen',
        portfolio: 'Portfolio',
        contact: 'Kontakt'
      },
      footerPolicy: 'Datenschutzrichtlinie',
      footerSettings: 'Cookie- & Spracheinstellungen'
    },
    fr: {
      langName: 'French',
      nativeName: 'Français',
      title: 'Confidentialité et Préférences de Cookies',
      desc: 'Nous utilisons des cookies minimaux et une télémétrie anonyme (pays approximatif, appareil, temps de visite) pour optimiser l’expérience. Aucun ciblage publicitaire.',
      readPolicy: 'Lire la politique',
      rejectBtn: 'Tout refuser',
      acceptBtn: 'Tout accepter',
      suggestTemplate: 'Visite depuis {country} ? Passer au français ?',
      switchBtn: 'Passer au Français',
      keepBtn: 'Garder l’anglais',
      statusAccepted: 'Consentement accepté (Analytique active)',
      statusRejected: 'Consentement refusé (Anonyme / Désactivé)',
      statusPending: 'Non décidé (En attente)',
      modalTitle: 'Politique de Confidentialité, Cookies et Télémétrie',
      policyH1: '1. Engagement de Transparence Éthique',
      policyIntro: 'Bienvenue sur le portfolio professionnel de <strong>Hamim Mahamud Hamy</strong> (<em>hamilio.netlify.app</em>). Nous respectons votre vie privée et garantissons une transparence totale.',
      policyKeyTag: 'Point Clé :',
      policyKeyText: 'Nous ne vendons AUCUNE donnée, n’utilisons aucun cookie publicitaire tiers et ne vous suivons pas sur le web. Vous pouvez accepter ou refuser à tout moment.',
      policyH2: '2. Données collectées',
      policyP2Intro: 'Lorsque vous naviguez avec votre consentement, nous collectons des données anonymes :',
      policyP2List: [
        '<strong>Géolocalisation approximative :</strong> Pays et ville estimés pour évaluer l’audience sans enregistrer votre IP exacte.',
        '<strong>Temps passé sur le site :</strong> Durée de lecture des sections, projets et CV.',
        '<strong>Appareil et Navigateur :</strong> Type d’appareil (ordinateur, mobile, tablette), OS et navigateur.',
        '<strong>Canaux de provenance :</strong> Origine du trafic (LinkedIn, GitHub, Google, WhatsApp, Direct).',
        '<strong>Formulaire de contact :</strong> Informations transmises volontairement (nom, e-mail, message).'
      ],
      policyH3: '3. Ce que nous ne collectons STRICTEMENT PAS',
      policyP3List: [
        'Aucun suivi intersite ou sur les réseaux sociaux.',
        'Aucune donnée financière ou vente d’informations à des courtiers.',
        'Aucun pixel publicitaire de reciblage.'
      ],
      policyH4: '4. Utilisation des cookies et du stockage local',
      policyP4Intro: 'Nous utilisons <code>localStorage</code> et <code>sessionStorage</code> uniquement pour le fonctionnement essentiel :',
      policyP4List: [
        'Enregistrer votre choix de consentement pour ne pas réafficher le bandeau.',
        'Sauvegarder les personnalisations dynamiques du portfolio.',
        'Calculer la durée de session active.'
      ],
      policyH5: '5. Vos droits et contrôle de vos préférences',
      policyP5Text: 'Vous gardez le contrôle absolu. Si vous choisissez <strong>Tout refuser</strong>, les requêtes IP externes sont immédiatement interrompues. Vous pouvez modifier votre choix à tout moment en bas de page.',
      policyH6: '6. Contact pour toute question',
      policyP6Intro: 'Pour toute question sur vos données, contactez directement Hamim :',
      modalPreferenceLabel: 'Votre choix :',
      nav: {
        home: 'Accueil',
        about: 'À propos',
        resume: 'CV',
        services: 'Services',
        portfolio: 'Portfolio',
        contact: 'Contact'
      },
      footerPolicy: 'Politique de Confidentialité',
      footerSettings: 'Paramètres Cookies et Langue'
    },
    ar: {
      langName: 'Arabic',
      nativeName: 'العربية',
      title: 'الخصوصية وتفضيلات ملفات تعريف الارتباط',
      desc: 'نستخدم الحد الأدنى من ملفات تعريف الارتباط والقياس المجهول (البلد التقريبي، الجهاز، مدة البقاء) لتحسين تجربة المعرض. لا توجد إعلانات أو تتبع شخصي.',
      readPolicy: 'قراءة السياسة',
      rejectBtn: 'رفض الكل',
      acceptBtn: 'قبول الكل',
      suggestTemplate: 'هل تزورنا من {country}؟ هل ترغب في التبديل إلى العربية؟',
      switchBtn: 'التحويل إلى العربية',
      keepBtn: 'الإبقاء على الإنجليزية',
      statusAccepted: 'تمت الموافقة (التحليلات الكاملة نشطة)',
      statusRejected: 'تم الرفض (مجهول / تم إلغاء الاشتراك)',
      statusPending: 'لم يتم الاختيار (قيد الانتظار)',
      modalTitle: 'سياسة الخصوصية وملفات تعريف الارتباط والقياس عن بعد',
      policyH1: '١. الالتزام بالشفافية الأخلاقية',
      policyIntro: 'مرحبًا بك في المعرض المهني لـ <strong>Hamim Mahamud Hamy</strong> (<em>hamilio.netlify.app</em>). نحن نقدر خصوصيتك ونؤمن بالشفافية التامة.',
      policyKeyTag: 'الخلاصة الأساسية:',
      policyKeyText: 'نحن لا نبيع أي بيانات، ولا نستخدم ملفات تعريف ارتباط إعلانية، ولا نتتبع نشاطك عبر الإنترنت. لديك كامل الحرية في القبول أو الرفض في أي وقت.',
      policyH2: '٢. البيانات التي نجمعها',
      policyP2Intro: 'عند تصفحك لهذا المعرض بموافقتك، نسجل مقاييس مجهولة المصدر تمامًا:',
      policyP2List: [
        '<strong>الموقع الجغرافي التقريبي:</strong> تحديد البلد والمدينة دون تخزين عنوان IP الفعلي.',
        '<strong>مدة البقاء في الجلسة:</strong> الوقت المستغرق في قراءة أقسام المعرض والمشاريع والسيرة الذاتية.',
        '<strong>بنية الجهاز والمتصفح:</strong> فئة الجهاز ونظام التشغيل ونوع المتصفح لتحسين التجاوب.',
        '<strong>قنوات الإحالة:</strong> مصدر الزيارة (مثل LinkedIn أو GitHub أو Google أو WhatsApp أو مباشر).',
        '<strong>بيانات نموذج الاتصال:</strong> الاسم والبريد الإلكتروني والرسالة المرسلة باختيارك إلى حاميم.'
      ],
      policyH3: '٣. ما لا نجمعه على الإطلاق',
      policyP3List: [
        'لا يوجد تتبع عبر مواقع خارجية أو شبكات اجتماعية.',
        'لا نجمع أي معلومات مصرفية أو بيانات شخصية للبيع.',
        'لا نستخدم أي بكسلات لإعادة الاستهداف الإعلاني.'
      ],
      policyH4: '٤. استخدام ملفات تعريف الارتباط والتخزين المحلي',
      policyP4Intro: 'نستخدم <code>localStorage</code> و <code>sessionStorage</code> فقط للوظائف الأساسية:',
      policyP4List: [
        'حفظ اختيارك للموافقة لتفادي إظهار الإشعار بشكل متكرر.',
        'الحفاظ على التخصيصات الحية لمعرض الأعمال.',
        'احتساب توقيت الجلسة النشطة أثناء التصفح.'
      ],
      policyH5: '٥. حقوقك والتحكم في التفضيلات',
      policyP5Text: 'أنت المتحكم الكامل. إذا اخترت <strong>رفض الكل</strong>، فسيتم إيقاف استعلامات IP الخارجية فورًا. يمكنك تعديل قرارك في أي وقت عبر رابط أسفل الموقع.',
      policyH6: '٦. الاستفسارات والاتصال',
      policyP6Intro: 'إذا كانت لديك أسئلة حول هذه السياسة، يمكنك التواصل مع حاميم مباشرة:',
      modalPreferenceLabel: 'تفضيلك الحالي:',
      nav: {
        home: 'الرئيسية',
        about: 'نبذة عني',
        resume: 'السيرة الذاتية',
        services: 'الخدمات',
        portfolio: 'معرض الأعمال',
        contact: 'اتصل بي'
      },
      footerPolicy: 'سياسة الخصوصية',
      footerSettings: 'إعدادات الكوكيز واللغة'
    },
    ja: {
      langName: 'Japanese',
      nativeName: '日本語',
      title: 'プライバシーとCookieの設定',
      desc: '当サイトでは、ポートフォリオ体験向上のため、最小限のCookieと匿名テレメトリ（概算の国、デバイス、滞在時間）のみを使用します。広告追跡は一切行いません。',
      readPolicy: 'ポリシーを読む',
      rejectBtn: 'すべて拒否',
      acceptBtn: 'すべて同意',
      suggestTemplate: '{country}からのアクセスですか？ 日本語に切り替えますか？',
      switchBtn: '日本語に切り替え',
      keepBtn: '英語のままにする',
      statusAccepted: '同意済み（完全な解析が有効）',
      statusRejected: '拒否済み（匿名／オプトアウト）',
      statusPending: '未決定（保留中）',
      modalTitle: 'プライバシー・Cookieおよびテレメトリポリシー',
      policyH1: '1. 倫理的透明性への取り組み',
      policyIntro: '<strong>Hamim Mahamud Hamy</strong> のプロフェッショナルポートフォリオ（<em>hamilio.netlify.app</em>）へようこそ。私たちはプライバシーを尊重し、完全な透明性を約束します。',
      policyKeyTag: '重要なポイント:',
      policyKeyText: 'データの販売、サードパーティ広告Cookieの使用、外部サイトにまたがる追跡は一切行いません。いつでも自由に同意または拒否できます。',
      policyH2: '2. 収集するデータ',
      policyP2Intro: 'お客様の同意のもとで閲覧された場合、以下の匿名データを記録します:',
      policyP2List: [
        '<strong>おおよその地域情報:</strong> 正確なIPを保存せず、国や都市を推定して国際的なアクセス傾向を把握します。',
        '<strong>セッション滞在時間:</strong> ポートフォリオの各セクションや履歴書の閲覧時間。',
        '<strong>デバイス・ブラウザ環境:</strong> デバイス種別（PC、モバイル、タブレット）、OS、ブラウザ。',
        '<strong>リファラー（参照元）:</strong> アクセス元経路（LinkedIn、GitHub、Google、WhatsApp、直接アクセス）。',
        '<strong>お問い合わせフォーム:</strong> お客様が入力したお名前、メールアドレス、メッセージ。'
      ],
      policyH3: '3. 収集しないデータ',
      policyP3List: [
        '外部サイトやSNSを横断するトラッキング。',
        '個人識別番号、金融情報、またはデータブローカーへの情報提供。',
        'リマーケティング用広告ピクセルの設置。'
      ],
      policyH4: '4. Cookieおよびローカルストレージの利用',
      policyP4Intro: 'ブラウザの <code>localStorage</code> および <code>sessionStorage</code> は必須機能のみに利用されます:',
      policyP4List: [
        'ポップアップの再表示を防ぐための同意状況の保存。',
        '動的なポートフォリオ設定の保持。',
        'セッション滞在時間の計測。'
      ],
      policyH5: '5. お客様の権利と設定の管理',
      policyP5Text: '管理権はお客様にあります。「すべて拒否」を選択すると、外部IP取得と滞在時間測定は直ちに無効化されます。フッターのリンクからいつでも変更可能です。',
      policyH6: '6. プライバシーに関するお問い合わせ',
      policyP6Intro: '本ポリシーに関するご質問やデータ削除のご要望は、Hamimまで直接お問い合わせください:',
      modalPreferenceLabel: '現在の設定:',
      nav: {
        home: 'ホーム',
        about: '私について',
        resume: '経歴・履歴書',
        services: 'サービス',
        portfolio: 'ポートフォリオ',
        contact: 'お問い合わせ'
      },
      footerPolicy: 'プライバシーポリシー',
      footerSettings: 'Cookieと言語の設定'
    },
    hi: {
      langName: 'Hindi',
      nativeName: 'हिन्दी',
      title: 'गोपनीयता और कुकी प्राथमिकताएँ',
      desc: 'हम पोर्टफोलियो अनुभव को बेहतर बनाने के लिए न्यूनतम कुकीज़ और अज्ञात विज़िटर मेट्रिक्स (अनुमानित देश, डिवाइस, रहने का समय) का उपयोग करते हैं। कोई व्यक्तिगत विज्ञापन ट्रैकिंग नहीं।',
      readPolicy: 'नीति पढ़ें',
      rejectBtn: 'सभी अस्वीकार करें',
      acceptBtn: 'सभी स्वीकार करें',
      suggestTemplate: 'क्या आप {country} से देख रहे हैं? क्या आप हिन्दी में बदलना चाहते हैं?',
      switchBtn: 'हिन्दी में बदलें',
      keepBtn: 'अंग्रेज़ी रखें',
      statusAccepted: 'सहमति स्वीकृत (पूर्ण एनालिटिक्स सक्रिय)',
      statusRejected: 'सहमति अस्वीकृत (अज्ञात / बाहर निकले)',
      statusPending: 'अनिर्णित (निर्णय लंबित)',
      modalTitle: 'गोपनीयता, कुकी और विज़िटर टेलीमेट्री नीति',
      policyH1: '1. नैतिक पारदर्शिता के प्रति प्रतिबद्धता',
      policyIntro: '<strong>Hamim Mahamud Hamy</strong> के पेशेवर पोर्टफोलियो (<em>hamilio.netlify.app</em>) में आपका स्वागत है। हम आपकी गोपनीयता का सम्मान करते हैं और पूर्ण पारदर्शिता में विश्वास करते हैं।',
      policyKeyTag: 'मुख्य बिंदु:',
      policyKeyText: 'हम कोई डेटा नहीं बेचते हैं, तीसरे पक्ष के विज्ञापन कुकीज़ का उपयोग नहीं करते हैं, और वेब पर आपको ट्रैक नहीं करते हैं। आपको किसी भी समय स्वीकार या अस्वीकार करने की पूर्ण स्वतंत्रता है।',
      policyH2: '2. हम कौन सा डेटा एकत्र करते हैं',
      policyP2Intro: 'आपकी सहमति से विज़िट करने पर, हम केवल अज्ञात मेट्रिक्स रिकॉर्ड करते हैं:',
      policyP2List: [
        '<strong>अनुमानित भौगोलिक स्थान:</strong> सटीक आईपी सहेजे बिना देश और शहर का अनुमान ताकि अंतरराष्ट्रीय पहुंच समझी जा सके।',
        '<strong>सत्र में बिताया गया समय:</strong> पोर्टफोलियो के अनुभागों, केस स्टडीज और रिज्यूमे को पढ़ने में लगा समय।',
        '<strong>डिवाइस और ब्राउज़र जानकारी:</strong> डिवाइस श्रेणी (डेस्कटॉप, मोबाइल, टैबलेट), ऑपरेटिंग सिस्टम और ब्राउज़र।',
        '<strong>रेफरल चैनल:</strong> ट्रैफ़िक का स्रोत (जैसे लिंक्डइन, गिटहब, गूगल, व्हाट्सएप या डायरेक्ट)।',
        '<strong>संपर्क फ़ॉर्म प्रविष्टियाँ:</strong> आपके द्वारा फ़ॉर्म में स्वेच्छा से भेजा गया नाम, ईमेल और संदेश।'
      ],
      policyH3: '3. हम क्या बिल्कुल एकत्र नहीं करते',
      policyP3List: [
        'बाहरी वेबसाइटों या सोशल मीडिया पर कोई ट्रैकिंग नहीं।',
        'कोई वित्तीय जानकारी या डेटा ब्रोकरों को डेटा की बिक्री नहीं।',
        'कोई विज्ञापन रीमार्केटिंग पिक्सेल नहीं।'
      ],
      policyH4: '4. कुकीज़ और स्थानीय संग्रहण का उपयोग',
      policyP4Intro: 'हम ब्राउज़र <code>localStorage</code> और <code>sessionStorage</code> का उपयोग केवल आवश्यक कार्यों के लिए करते हैं:',
      policyP4List: [
        'आपकी सहमति (स्वीकार या अस्वीकार) को सहेजना ताकि बार-बार पॉपअप न दिखे।',
        'डायनामिक पोर्टफोलियो कस्टमाइज़ेशन को बनाए रखना।',
        'सक्रिय सत्र की अवधि रिकॉर्ड करना।'
      ],
      policyH5: '5. आपके अधिकार और वरीयता नियंत्रण',
      policyP5Text: 'नियंत्रण पूरी तरह से आपके हाथ में है। यदि आप <strong>सभी अस्वीकार करें</strong> चुनते हैं, तो बाहरी आईपी प्रश्न और सक्रिय अवधि ट्रैकिंग तुरंत बंद हो जाएगी। आप फुटर में दिए गए लिंक से कभी भी अपना निर्णय बदल सकते हैं।',
      policyH6: '6. गोपनीयता संबंधी पूछताछ',
      policyP6Intro: 'इस नीति के संबंध में किसी भी प्रश्न के लिए सीधे हमीम से संपर्क करें:',
      modalPreferenceLabel: 'आपकी प्राथमिकता:',
      nav: {
        home: 'होम',
        about: 'परिचय',
        resume: 'बायोडाटा',
        services: 'सेवाएँ',
        portfolio: 'पोर्टफोलियो',
        contact: 'संपर्क'
      },
      footerPolicy: 'गोपनीयता नीति',
      footerSettings: 'कुकी और भाषा सेटिंग्स'
    }
  };

  // Country Code to Supported Language Mapping
  const COUNTRY_TO_LANG_MAP = {
    // Bengali
    'BD': 'bn',
    // Spanish
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es',
    'VE': 'es', 'EC': 'es', 'GT': 'es', 'CU': 'es', 'BO': 'es', 'DO': 'es',
    'HN': 'es', 'PY': 'es', 'SV': 'es', 'NI': 'es', 'CR': 'es', 'PR': 'es',
    'PA': 'es', 'UY': 'es',
    // German
    'DE': 'de', 'AT': 'de', 'CH': 'de', 'LI': 'de',
    // French
    'FR': 'fr', 'BE': 'fr', 'MC': 'fr', 'SN': 'fr', 'CI': 'fr', 'CM': 'fr',
    'CD': 'fr', 'LU': 'fr',
    // Arabic
    'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'QA': 'ar', 'KW': 'ar', 'OM': 'ar',
    'BH': 'ar', 'IQ': 'ar', 'JO': 'ar', 'LB': 'ar', 'DZ': 'ar', 'MA': 'ar',
    'TN': 'ar', 'LY': 'ar', 'SD': 'ar', 'YE': 'ar', 'PS': 'ar',
    // Japanese
    'JP': 'ja',
    // Hindi
    'IN': 'hi'
  };

  // Helper: Country code to Unicode flag emoji
  function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2 || countryCode === 'UNK' || countryCode === 'DIR') {
      return '🌐';
    }
    try {
      const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch (e) {
      return '🌐';
    }
  }

  // Device Detector
  function detectDevice() {
    const width = window.innerWidth || screen.width;
    const ua = navigator.userAgent || '';
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet';
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua) || width <= 768) {
      return 'Mobile';
    }
    if (width <= 1024) {
      return 'Tablet';
    }
    return 'Desktop';
  }

  // OS Detector
  function detectOS() {
    const ua = navigator.userAgent || '';
    if (/Windows/i.test(ua)) {
      if (/Windows NT 10.0/i.test(ua)) return 'Windows 10/11';
      return 'Windows';
    }
    if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Other OS';
  }

  // Browser Detector
  function detectBrowser() {
    const ua = navigator.userAgent || '';
    if (/Edg\//i.test(ua)) return 'Edge';
    if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return 'Opera';
    if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return 'Chrome';
    if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return 'Safari';
    if (/Firefox\//i.test(ua)) return 'Firefox';
    return 'Browser';
  }

  // Referrer Cleaner
  function parseReferrer() {
    const ref = document.referrer;
    if (!ref) return 'Direct';
    try {
      const url = new URL(ref);
      const host = url.hostname.toLowerCase();
      if (host.includes('linkedin')) return 'LinkedIn';
      if (host.includes('google')) return 'Google Search';
      if (host.includes('github')) return 'GitHub';
      if (host.includes('facebook') || host.includes('fb.com')) return 'Facebook';
      if (host.includes('twitter') || host.includes('t.co') || host.includes('x.com')) return 'Twitter / X';
      if (host.includes('whatsapp')) return 'WhatsApp';
      if (host.includes('upwork')) return 'Upwork';
      if (host.includes('fiverr')) return 'Fiverr';
      if (host.includes('youtube')) return 'YouTube';
      return url.hostname.replace(/^www\./, '');
    } catch (e) {
      return 'Direct';
    }
  }

  class VisitorTracker {
    constructor() {
      this.sessionId = null;
      this.startTime = Date.now();
      this.lastHeartbeatTime = Date.now();
      this.stayingTimeSeconds = 0;
      this.sectionsViewed = new Set(['hero']);
      this.currentGeo = null;
      this.heartbeatTimer = null;
      this.hasFlushed = false;
      this.currentLang = 'en';
      this.suggestedLang = null;

      this.init();
    }

    async init() {
      this.initSession();
      this.initLanguage();
      this.bindConsentUI();
      this.observeSections();
      this.setupHeartbeat();
      this.checkConsentAndTrack();
    }

    initSession() {
      let sId = sessionStorage.getItem('hamilio_session_id');
      let sStart = sessionStorage.getItem('hamilio_session_start');
      
      if (!sId) {
        sId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        sStart = Date.now().toString();
        sessionStorage.setItem('hamilio_session_id', sId);
        sessionStorage.setItem('hamilio_session_start', sStart);
      }

      this.sessionId = sId;
      this.startTime = parseInt(sStart, 10) || Date.now();
    }

    initLanguage() {
      let langToUse = 'en';
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && COOKIE_I18N[urlLang]) {
          langToUse = urlLang;
        } else {
          const savedLang = localStorage.getItem('hamilio_user_lang');
          if (savedLang && COOKIE_I18N[savedLang]) {
            langToUse = savedLang;
          }
        }
      } catch (e) {
        const savedLang = localStorage.getItem('hamilio_user_lang');
        if (savedLang && COOKIE_I18N[savedLang]) {
          langToUse = savedLang;
        }
      }
      this.applyLanguage(langToUse, false);
    }

    detectSuggestedLanguage() {
      // 1. Detect from resolved country code
      const countryCode = this.currentGeo?.countryCode?.toUpperCase();
      if (countryCode && COUNTRY_TO_LANG_MAP[countryCode]) {
        return COUNTRY_TO_LANG_MAP[countryCode];
      }

      // 2. Secondary fallback: check browser navigator.languages
      try {
        const browserLangs = navigator.languages || [navigator.language || ''];
        for (const bLang of browserLangs) {
          const prefix = (bLang || '').split('-')[0].toLowerCase();
          if (COOKIE_I18N[prefix] && prefix !== 'en') {
            return prefix;
          }
        }
      } catch (e) {
        // ignore
      }

      return null;
    }

    checkAndSuggestLanguage() {
      // Only suggest on first visit:
      // Must NOT have a saved language preference yet, must NOT have dismissed suggestion,
      // and current language must be 'en'
      if (localStorage.getItem('hamilio_user_lang')) return;
      if (localStorage.getItem('hamilio_lang_suggest_dismissed')) return;
      if (this.currentLang !== 'en') return;

      const suggested = this.detectSuggestedLanguage();
      if (!suggested || suggested === 'en' || suggested === this.currentLang || !COOKIE_I18N[suggested]) return;

      this.suggestedLang = suggested;
      const langData = COOKIE_I18N[suggested];
      const country = this.currentGeo?.country || 'your country';
      const flag = this.currentGeo?.flag || '🌐';

      const bar = document.getElementById('cookie-lang-suggestion-bar');
      const flagEl = document.getElementById('cookie-lang-flag');
      const msgEl = document.getElementById('cookie-lang-suggestion-msg');
      const switchBtn = document.getElementById('btn-accept-lang-suggestion');
      const dismissBtn = document.getElementById('btn-dismiss-lang-suggestion');

      if (bar && msgEl && switchBtn && dismissBtn) {
        if (flagEl) flagEl.textContent = flag;
        msgEl.textContent = `Visiting from ${country}? Prefer ${langData.nativeName}?`;
        switchBtn.textContent = `Switch to ${langData.nativeName}`;
        dismissBtn.textContent = 'Keep English';
        bar.style.display = 'flex';
      }
    }

    acceptLanguageSuggestion() {
      if (this.suggestedLang && COOKIE_I18N[this.suggestedLang]) {
        this.applyLanguage(this.suggestedLang, true);
      }
      this.dismissLanguageSuggestion();
    }

    dismissLanguageSuggestion() {
      const bar = document.getElementById('cookie-lang-suggestion-bar');
      if (bar) {
        bar.style.transition = 'opacity 0.2s ease, max-height 0.25s ease, padding 0.25s ease';
        bar.style.overflow = 'hidden';
        bar.style.maxHeight = bar.scrollHeight + 'px';
        requestAnimationFrame(() => {
          bar.style.opacity = '0';
          bar.style.maxHeight = '0';
          bar.style.paddingTop = '0';
          bar.style.paddingBottom = '0';
          setTimeout(() => {
            bar.style.display = 'none';
          }, 260);
        });
      }
      localStorage.setItem('hamilio_lang_suggest_dismissed', 'true');
    }

    applyLanguage(langCode, persist = true) {
      if (!COOKIE_I18N[langCode]) {
        langCode = 'en';
      }
      this.currentLang = langCode;
      if (persist) {
        localStorage.setItem('hamilio_user_lang', langCode);
      }

      if (window.SiteI18n) {
        window.SiteI18n.applyLanguage(langCode, persist);
      }

      const t = COOKIE_I18N[langCode];

      // Sync select dropdown
      const langSelect = document.getElementById('cookie-lang-select');
      if (langSelect && langSelect.value !== langCode) {
        langSelect.value = langCode;
      }

      // Handle RTL support for Arabic
      const popup = document.getElementById('cookie-consent-popup');
      const modal = document.getElementById('privacy-policy-modal');
      if (langCode === 'ar') {
        if (popup) popup.classList.add('is-rtl');
        if (modal) modal.classList.add('is-rtl');
      } else {
        if (popup) popup.classList.remove('is-rtl');
        if (modal) modal.classList.remove('is-rtl');
      }

      // Update Cookie Consent Banner
      const titleEl = document.getElementById('cookie-popup-title');
      if (titleEl) titleEl.textContent = t.title;

      const descTextEl = document.getElementById('cookie-popup-desc-text');
      if (descTextEl) descTextEl.textContent = t.desc;

      const viewPolicyEl = document.getElementById('btn-view-privacy-policy');
      if (viewPolicyEl) viewPolicyEl.textContent = t.readPolicy;

      const rejectBtn = document.getElementById('btn-reject-cookies');
      if (rejectBtn) rejectBtn.textContent = t.rejectBtn;

      const acceptBtn = document.getElementById('btn-accept-cookies');
      if (acceptBtn) acceptBtn.textContent = t.acceptBtn;

      // Update Policy Modal
      const modalTitleEl = document.getElementById('policy-modal-title');
      if (modalTitleEl) modalTitleEl.textContent = t.modalTitle;

      const h1El = document.getElementById('policy-heading-1');
      if (h1El) h1El.textContent = t.policyH1;

      const introEl = document.getElementById('policy-intro-text');
      if (introEl) introEl.innerHTML = t.policyIntro;

      const keyTagEl = document.getElementById('policy-highlight-tag');
      if (keyTagEl) keyTagEl.textContent = t.policyKeyTag;

      const keyTextEl = document.getElementById('policy-highlight-text');
      if (keyTextEl) keyTextEl.textContent = t.policyKeyText;

      const h2El = document.getElementById('policy-heading-2');
      if (h2El) h2El.textContent = t.policyH2;

      const p2IntroEl = document.getElementById('policy-p2-intro');
      if (p2IntroEl) p2IntroEl.textContent = t.policyP2Intro;

      const p2ListEl = document.getElementById('policy-p2-list');
      if (p2ListEl && t.policyP2List) {
        p2ListEl.innerHTML = t.policyP2List.map(item => `<li>${item}</li>`).join('');
      }

      const h3El = document.getElementById('policy-heading-3');
      if (h3El) h3El.textContent = t.policyH3;

      const p3ListEl = document.getElementById('policy-p3-list');
      if (p3ListEl && t.policyP3List) {
        p3ListEl.innerHTML = t.policyP3List.map(item => `<li>${item}</li>`).join('');
      }

      const h4El = document.getElementById('policy-heading-4');
      if (h4El) h4El.textContent = t.policyH4;

      const p4IntroEl = document.getElementById('policy-p4-intro');
      if (p4IntroEl) p4IntroEl.innerHTML = t.policyP4Intro;

      const p4ListEl = document.getElementById('policy-p4-list');
      if (p4ListEl && t.policyP4List) {
        p4ListEl.innerHTML = t.policyP4List.map(item => `<li>${item}</li>`).join('');
      }

      const h5El = document.getElementById('policy-heading-5');
      if (h5El) h5El.textContent = t.policyH5;

      const p5TextEl = document.getElementById('policy-p5-text');
      if (p5TextEl) p5TextEl.innerHTML = t.policyP5Text;

      const h6El = document.getElementById('policy-heading-6');
      if (h6El) h6El.textContent = t.policyH6;

      const p6IntroEl = document.getElementById('policy-p6-intro');
      if (p6IntroEl) p6IntroEl.textContent = t.policyP6Intro;

      const prefLabelEl = document.getElementById('modal-preference-label');
      if (prefLabelEl) prefLabelEl.textContent = t.modalPreferenceLabel;

      const modalRejectBtn = document.getElementById('btn-modal-reject');
      if (modalRejectBtn) modalRejectBtn.textContent = t.rejectBtn;

      const modalAcceptBtn = document.getElementById('btn-modal-accept');
      if (modalAcceptBtn) modalAcceptBtn.textContent = t.acceptBtn;

      // Update Footer Links
      const footerPolicyEl = document.getElementById('open-privacy-policy-link');
      if (footerPolicyEl) footerPolicyEl.textContent = t.footerPolicy;

      const footerSettingsEl = document.getElementById('open-cookie-preferences-link');
      if (footerSettingsEl) footerSettingsEl.textContent = t.footerSettings;

      // Update Navigation Links (Desktop and Mobile)
      if (t.nav) {
        const navMap = {
          '#header': t.nav.home,
          '#about': t.nav.about,
          '#resume': t.nav.resume,
          '#services': t.nav.services,
          '#portfolio': t.nav.portfolio,
          '#contact': t.nav.contact
        };
        Object.entries(navMap).forEach(([hash, label]) => {
          document.querySelectorAll(`.nav-menu a[href="${hash}"], .mobile-nav a[href="${hash}"]`).forEach(link => {
            link.textContent = label;
          });
        });
      }

      // Re-render badges with updated locale strings
      const currentConsent = window.PortfolioDataService ? window.PortfolioDataService.getConsentStatus() : localStorage.getItem('hamilio_privacy_consent');
      this.updateConsentBadges(currentConsent);
    }

    async checkConsentAndTrack() {
      const consent = window.PortfolioDataService ? window.PortfolioDataService.getConsentStatus() : localStorage.getItem('hamilio_privacy_consent');

      // Update Consent Badges
      this.updateConsentBadges(consent);

      if (consent === 'rejected') {
        // Record anonymous opt-out without external IP calls
        this.currentGeo = {
          country: "Anonymous Visitor",
          countryCode: "UNK",
          city: "Protected",
          flag: "🛡️"
        };
        this.flushSessionRecord('rejected');
        return;
      }

      // If user hasn't made a choice, show popup with friendly delay
      if (!consent) {
        setTimeout(() => {
          this.showCookiePopup();
        }, 800);
      }

      // Fetch Geo IP (cached per session)
      await this.resolveGeoLocation();

      // Check and suggest language on first visit based on detected location
      this.checkAndSuggestLanguage();

      this.flushSessionRecord(consent || 'pending');
    }

    async resolveGeoLocation() {
      const cached = sessionStorage.getItem('hamilio_visitor_geo');
      if (cached) {
        try {
          this.currentGeo = JSON.parse(cached);
          return;
        } catch (e) {
          // ignore
        }
      }

      try {
        // Fetch geo-location with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          if (json && json.country_name) {
            this.currentGeo = {
              country: json.country_name,
              countryCode: json.country_code || 'UNK',
              city: json.city || '',
              flag: getFlagEmoji(json.country_code)
            };
            sessionStorage.setItem('hamilio_visitor_geo', JSON.stringify(this.currentGeo));
            return;
          }
        }
      } catch (err) {
        // Ignore network failure / ad-blocker
      }

      // Timezone heuristic fallback
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        let inferredCountry = 'Global Visitor';
        let inferredCode = 'GLO';
        let inferredFlag = '🌐';

        if (tz.includes('Dhaka') || tz.includes('Asia/Dhaka')) {
          inferredCountry = 'Bangladesh';
          inferredCode = 'BD';
          inferredFlag = '🇧🇩';
        } else if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago')) {
          inferredCountry = 'United States';
          inferredCode = 'US';
          inferredFlag = '🇺🇸';
        } else if (tz.includes('London')) {
          inferredCountry = 'United Kingdom';
          inferredCode = 'GB';
          inferredFlag = '🇬🇧';
        } else if (tz.includes('Berlin') || tz.includes('Frankfurt')) {
          inferredCountry = 'Germany';
          inferredCode = 'DE';
          inferredFlag = '🇩🇪';
        } else if (tz.includes('Toronto') || tz.includes('Vancouver')) {
          inferredCountry = 'Canada';
          inferredCode = 'CA';
          inferredFlag = '🇨🇦';
        } else if (tz.includes('Dubai')) {
          inferredCountry = 'United Arab Emirates';
          inferredCode = 'AE';
          inferredFlag = '🇦🇪';
        } else if (tz.includes('Singapore')) {
          inferredCountry = 'Singapore';
          inferredCode = 'SG';
          inferredFlag = '🇸🇬';
        } else if (tz.includes('Madrid')) {
          inferredCountry = 'Spain';
          inferredCode = 'ES';
          inferredFlag = '🇪🇸';
        } else if (tz.includes('Paris')) {
          inferredCountry = 'France';
          inferredCode = 'FR';
          inferredFlag = '🇫🇷';
        } else if (tz.includes('Tokyo')) {
          inferredCountry = 'Japan';
          inferredCode = 'JP';
          inferredFlag = '🇯🇵';
        } else if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('Delhi')) {
          inferredCountry = 'India';
          inferredCode = 'IN';
          inferredFlag = '🇮🇳';
        }

        this.currentGeo = {
          country: inferredCountry,
          countryCode: inferredCode,
          city: tz.split('/')[1]?.replace(/_/g, ' ') || 'Direct',
          flag: inferredFlag
        };
      } catch (e) {
        this.currentGeo = {
          country: 'Direct Visitor',
          countryCode: 'DIR',
          city: 'Local',
          flag: '🌐'
        };
      }

      sessionStorage.setItem('hamilio_visitor_geo', JSON.stringify(this.currentGeo));
    }

    flushSessionRecord(consentStatus) {
      if (!window.PortfolioDataService) return;

      const duration = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
      this.stayingTimeSeconds = duration;

      const sessionObj = {
        id: this.sessionId,
        timestamp: new Date(this.startTime).toISOString(),
        country: this.currentGeo?.country || 'Direct Visitor',
        countryCode: this.currentGeo?.countryCode || 'DIR',
        city: this.currentGeo?.city || 'Local',
        flag: this.currentGeo?.flag || '🌐',
        stayingTimeSeconds: this.stayingTimeSeconds,
        device: detectDevice(),
        os: detectOS(),
        browser: detectBrowser(),
        referrer: parseReferrer(),
        consent: consentStatus || 'pending',
        sectionsViewed: Array.from(this.sectionsViewed),
        lastActive: new Date().toISOString()
      };

      window.PortfolioDataService.recordVisitorSession(sessionObj);
    }

    setupHeartbeat() {
      // Periodic heartbeat every 6 seconds while active
      this.heartbeatTimer = setInterval(() => {
        if (document.visibilityState === 'visible') {
          const duration = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
          this.stayingTimeSeconds = duration;
          if (window.PortfolioDataService) {
            window.PortfolioDataService.updateVisitorStayingTime(this.sessionId, duration);
          }
        }
      }, 6000);

      // Window unloading flush
      const handleUnload = () => {
        if (this.hasFlushed) return;
        this.hasFlushed = true;
        const duration = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
        if (window.PortfolioDataService) {
          window.PortfolioDataService.updateVisitorStayingTime(this.sessionId, duration);
        }
      };

      window.addEventListener('beforeunload', handleUnload, { capture: true });
      window.addEventListener('pagehide', handleUnload, { capture: true });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          handleUnload();
        } else {
          this.hasFlushed = false;
        }
      });
    }

    observeSections() {
      const sectionIds = ['about', 'skills', 'services', 'resume', 'portfolio', 'contact'];
      if (!('IntersectionObserver' in window)) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            const id = entry.target.getAttribute('id');
            if (id && !this.sectionsViewed.has(id)) {
              this.sectionsViewed.add(id);
              // Update session record
              if (window.PortfolioDataService) {
                const currentConsent = window.PortfolioDataService.getConsentStatus() || 'pending';
                this.flushSessionRecord(currentConsent);
              }
            }
          }
        });
      }, { threshold: [0.3] });

      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }

    // ==========================================
    // UI: Cookie Popup & Privacy Policy Modal
    // ==========================================

    showCookiePopup() {
      const popup = document.getElementById('cookie-consent-popup');
      if (popup) {
        popup.classList.add('visible');
      }
      document.body.classList.add('has-cookie-popup');
    }

    hideCookiePopup() {
      const popup = document.getElementById('cookie-consent-popup');
      if (popup) {
        popup.classList.remove('visible');
      }
      document.body.classList.remove('has-cookie-popup');
    }

    showPolicyModal() {
      const modal = document.getElementById('privacy-policy-modal');
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }

    hidePolicyModal() {
      const modal = document.getElementById('privacy-policy-modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }

    updateConsentBadges(status) {
      const badge = document.getElementById('modal-current-consent-badge');
      if (!badge) return;

      const t = COOKIE_I18N[this.currentLang] || COOKIE_I18N.en;

      badge.classList.remove('status-accepted', 'status-rejected', 'status-pending');
      if (status === 'accepted') {
        badge.textContent = t.statusAccepted;
        badge.classList.add('status-accepted');
      } else if (status === 'rejected') {
        badge.textContent = t.statusRejected;
        badge.classList.add('status-rejected');
      } else {
        badge.textContent = t.statusPending;
        badge.classList.add('status-pending');
      }
    }

    handleConsentChoice(choice) {
      if (window.PortfolioDataService) {
        window.PortfolioDataService.setConsentStatus(choice);
      } else {
        localStorage.setItem('hamilio_privacy_consent', choice);
      }

      this.updateConsentBadges(choice);
      this.hideCookiePopup();
      this.hidePolicyModal();

      if (choice === 'accepted') {
        this.resolveGeoLocation().then(() => {
          this.flushSessionRecord('accepted');
        });
      } else {
        this.currentGeo = {
          country: "Anonymous Visitor",
          countryCode: "UNK",
          city: "Protected",
          flag: "🛡️"
        };
        this.flushSessionRecord('rejected');
      }
    }

    bindConsentUI() {
      // Language Switcher Dropdown
      const langSelect = document.getElementById('cookie-lang-select');
      if (langSelect) {
        langSelect.addEventListener('change', (e) => {
          this.applyLanguage(e.target.value, true);
          this.dismissLanguageSuggestion();
        });
      }

      // Location Language Suggestion Buttons
      const acceptSuggestBtn = document.getElementById('btn-accept-lang-suggestion');
      if (acceptSuggestBtn) {
        acceptSuggestBtn.addEventListener('click', () => {
          this.acceptLanguageSuggestion();
        });
      }

      const dismissSuggestBtn = document.getElementById('btn-dismiss-lang-suggestion');
      if (dismissSuggestBtn) {
        dismissSuggestBtn.addEventListener('click', () => {
          this.dismissLanguageSuggestion();
        });
      }

      // Cookie & Language Settings Footer Button
      const cookiePrefLink = document.getElementById('open-cookie-preferences-link');
      if (cookiePrefLink) {
        cookiePrefLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.showCookiePopup();
        });
      }

      // Accept buttons
      const acceptBtn = document.getElementById('btn-accept-cookies');
      const modalAcceptBtn = document.getElementById('btn-modal-accept');
      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => this.handleConsentChoice('accepted'));
      }
      if (modalAcceptBtn) {
        modalAcceptBtn.addEventListener('click', () => this.handleConsentChoice('accepted'));
      }

      // Reject buttons
      const rejectBtn = document.getElementById('btn-reject-cookies');
      const modalRejectBtn = document.getElementById('btn-modal-reject');
      if (rejectBtn) {
        rejectBtn.addEventListener('click', () => this.handleConsentChoice('rejected'));
      }
      if (modalRejectBtn) {
        modalRejectBtn.addEventListener('click', () => this.handleConsentChoice('rejected'));
      }

      // Close popup cross
      const closePopupBtn = document.getElementById('btn-close-cookie-popup');
      if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => this.hideCookiePopup());
      }

      // View Policy triggers
      const viewPolicyBtn = document.getElementById('btn-view-privacy-policy');
      const footerPolicyLink = document.getElementById('open-privacy-policy-link');
      if (viewPolicyBtn) {
        viewPolicyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showPolicyModal();
        });
      }
      if (footerPolicyLink) {
        footerPolicyLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.showPolicyModal();
        });
      }

      // Check URL hash on load and change
      if (window.location.hash === '#privacy-policy-modal') {
        setTimeout(() => this.showPolicyModal(), 200);
      }
      window.addEventListener('hashchange', () => {
        if (window.location.hash === '#privacy-policy-modal') {
          this.showPolicyModal();
        }
      });

      // Close Modal triggers
      const closeModalBtn = document.getElementById('btn-close-privacy-modal');
      const modalBackdrop = document.getElementById('privacy-modal-backdrop');
      if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => this.hidePolicyModal());
      }
      if (modalBackdrop) {
        modalBackdrop.addEventListener('click', () => this.hidePolicyModal());
      }

      // Close with ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.hidePolicyModal();
        }
      });
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.HamimVisitorTracker = new VisitorTracker();
    });
  } else {
    window.HamimVisitorTracker = new VisitorTracker();
  }
})();
