/**
 * Comprehensive Site-Wide Internationalization (i18n) Engine
 * Translates every single section on the website:
 * - Hero & Tagline
 * - Navigation Menu
 * - About Me, Quote, Details, Bio, Stats, Skills, Interests & Testimonials
 * - Resume & Download Actions
 * - All Services Cards & Descriptions
 * - All Portfolio Items, Categories & Metadata
 * - Contact Information, Form Placeholders, Status Messages
 * - WhatsApp Action & Footer Credits
 * - Cookie Consent Banner & Privacy Policy Modal
 * - Full Bidirectional RTL Support for Arabic
 */
(function () {
  'use strict';

  const SITE_I18N = {
    en: {
      langName: 'English',
      nativeName: 'English (US)',
      dir: 'ltr',
      nav: {
        home: 'Home',
        about: 'About',
        resume: 'Resume',
        services: 'Services',
        portfolio: 'Portfolio',
        contact: 'Contact'
      },
      hero: {
        iam: 'I am',
        title: 'Head of Creative & HR | Business Management Executive',
        atCompany: 'at Omega Solution',
        tagline: 'Leading creative direction, technical web optimization, SEO strategy, and agile operations at Omega Solution.'
      },
      about: {
        title: 'About',
        subtitle: 'Learn more about me',
        headline: 'Head of Creative & HR | Business Management Executive | Digital Strategist',
        quote: '“Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.” — Antoine de Saint-Exupéry.',
        labelAge: 'Age:',
        labelWebsite: 'Website:',
        labelPhone: 'Phone:',
        labelCity: 'City:',
        valCity: 'Dhaka, Bangladesh',
        labelDegree: 'Degree:',
        valDegree: 'B.Sc. in CSE (Ongoing) | Diploma in CSE (CGPA 3.54)',
        labelEmail: 'Email:',
        labelFreelance: 'Freelance:',
        valFreelance: 'Available for Consulting & Leadership',
        bio: 'Serving as Head of Creative & HR and Business Management Executive at Omega Solution, I bridge technical execution, web optimization, SEO strategy, team administration, and B2B growth. Whether boosting enterprise web performance from 54 to 94 PageSpeed, driving organic visibility through topic clusters, managing client acquisition pipelines, or orchestrating day-to-day HR operations, I translate complex technical workflows into measurable business results.',
        statClients: 'Happy Clients',
        statProjects: 'Projects',
        statHours: 'Hours Of Support',
        statWorkers: 'Hard Workers',
        skillsTitle: 'Skills',
        skills: {
          s1: 'SEO & Content Clustering',
          s2: 'Web Management & Speed Optimization',
          s3: 'Creative Direction & Brand Design',
          s4: 'HR Operations & Team Management',
          s5: 'B2B Sales & Upwork Pipeline',
          s6: 'Multimedia & Video Production'
        },
        interestsTitle: 'Interests',
        interests: {
          i1: 'B2B Pipeline & Sales',
          i2: 'SEO & Growth Strategy',
          i3: 'HR & Operations',
          i4: 'Art & Design',
          i5: 'Web Performance',
          i6: 'Cycling',
          i7: 'Content Strategy',
          i8: 'Volunteering',
          i9: 'Automobile Technology',
          i10: 'Video Production',
          i11: 'Linux',
          i12: 'Database & SQL'
        },
        testimonialsTitle: 'Testimonials',
        testimonials: [
          {
            quote: 'He is a capable man with a lot of imagination and creative ideas!',
            role: 'CEO & Founder'
          },
          {
            quote: 'He never ceases to amaze me. He had a nick name of \'Scientist\' back in the days...',
            role: 'Co founder & CPM'
          },
          {
            quote: 'Kind and friendly behaviour of his always keeps the atmosphere warm around him.',
            role: 'Designer & Content Writer'
          },
          {
            quote: 'His works are more like Arts.',
            role: 'Artist'
          },
          {
            quote: 'When he works he works until he sees the finishing!',
            role: 'Engineer'
          }
        ]
      },
      resume: {
        title: 'Resume',
        subtitle: 'My Resume',
        downloadBtn: 'Download Resume (PDF)',
        pdfFallback: 'Your browser does not support PDFs.',
        pdfDownloadLink: 'Download the PDF instead.'
      },
      services: {
        title: 'Services',
        subtitle: 'My Services',
        inquireBtn: 'Inquire on WhatsApp',
        cards: [
          {
            title: 'SEO & Growth Strategy',
            desc: 'Data-driven organic search growth through topic cluster architecture, keyword-targeted content strategies, technical site audits (Semrush/Ahrefs), backlink planning, and Google Search Console indexing.'
          },
          {
            title: 'Web Management & Speed',
            desc: 'End-to-end website administration, landing page engineering, LiteSpeed cache configuration, and mobile speed optimization—elevating mobile PageSpeed from 54 to 94+.'
          },
          {
            title: 'Creative Direction & Branding',
            desc: 'Comprehensive brand identity systems, high-converting social media creatives, LinkedIn carousel decks, product packaging, and modern visual branding crafted in Photoshop and Illustrator.'
          },
          {
            title: 'HR Operations & Leadership',
            desc: 'Operational leadership, agile team monitoring, automated attendance & leave management, intern onboarding, recruitment workflows, and streamlined office administration.'
          },
          {
            title: 'B2B Business Development',
            desc: 'Direct client acquisition, high-converting Upwork proposal engineering, marketplace strategy (Fiverr & CodeCanyon), competitor market analysis, and Meta ad campaign management.'
          },
          {
            title: 'Multimedia & Video Production',
            desc: 'High-resolution 2K product feature walkthroughs, software demo recordings with OBS & Audacity, promotional video ads, and engaging multimedia storytelling.'
          }
        ]
      },
      portfolio: {
        title: 'Portfolio',
        subtitle: 'My Portfolio',
        labelCategory: 'Category:',
        labelClient: 'Client:',
        labelProjectDate: 'Project date:',
        labelProjectUrl: 'Project URL:',
        labelTools: 'Tools:',
        btnViewDoc: 'View Document',
        items: {
          p1: {
            title: 'Enterprise Web Optimization & Performance',
            desc: 'Technical website optimization, LiteSpeed caching configuration, and topic cluster deployment for high-growth software platforms. Successfully boosted mobile performance speed from 54 to 94 and established authoritative organic search visibility.',
            category: 'Web Management & SEO'
          },
          p2: {
            title: 'Youtube Intro',
            desc: 'Offensive Rhino Youtube Intro Video.',
            category: '3D Animation'
          },
          p3: {
            title: 'VFX',
            desc: 'The Lamborghini in this Video is part of VFX.',
            category: 'VFX'
          },
          p4: {
            title: 'Offensive Rhino March',
            desc: '3D walking T-shirt with Offensive Rhino Branding in it.',
            category: 'Product Advertising'
          },
          p5: {
            title: '3D Animation',
            desc: 'This is the biggest project I have done in 3D animation. My PC reached its limit with this project.',
            category: '3D Animation'
          }
        }
      },
      contact: {
        title: 'Contact',
        subtitle: 'Contact Me',
        addressTitle: 'My Address',
        addressVal: 'Dhaka, Bangladesh',
        socialTitle: 'Social Profiles',
        emailTitle: 'Email Me',
        callTitle: 'Call Me',
        placeholderName: 'Your Name',
        placeholderEmail: 'Your Email',
        placeholderSubject: 'Subject',
        placeholderMessage: 'Message',
        btnSend: 'Send Message',
        msgSending: 'Sending...',
        msgSent: 'Your message has been sent directly to Hamim! Thank you.',
        whatsappTooltip: 'Chat on WhatsApp'
      },
      credits: {
        author: 'Meet the Author',
        policy: 'Privacy & Policy',
        settings: 'Cookie & Language Settings'
      }
    },

    bn: {
      langName: 'Bengali',
      nativeName: 'বাংলা',
      dir: 'ltr',
      nav: {
        home: 'হোম',
        about: 'পরিচিতি',
        resume: 'সিভি',
        services: 'সেবাসমূহ',
        portfolio: 'পোর্টফোলিও',
        contact: 'যোগাযোগ'
      },
      hero: {
        iam: 'আমি',
        title: 'হেড অব ক্রিয়েটিভ অ্যান্ড এইচআর | বিজনেস ম্যানেজমেন্ট এক্সিকিউটিভ',
        atCompany: 'ওমেগা সলিউশন-এ',
        tagline: 'ওমেগা সলিউশন-এ ক্রিয়েটিভ দিকনির্দেশনা, কারিগরি ওয়েব অপ্টিমাইজেশন, এসইও কৌশল এবং অ্যাজাইল কার্যক্রম পরিচালনা করছি।'
      },
      about: {
        title: 'পরিচিতি',
        subtitle: 'আমার সম্পর্কে আরও জানুন',
        headline: 'হেড অব ক্রিয়েটিভ অ্যান্ড এইচআর | বিজনেস ম্যানেজমেন্ট এক্সিকিউটিভ | ডিজিটাল স্ট্র্যাটেজিস্ট',
        quote: '“পূর্ণতা তখন অর্জিত হয় না যখন আর কিছু যোগ করার থাকে না, বরং তখন অর্জিত হয় যখন আর কিছু বাদ দেওয়ার বাকি থাকে না।” — অঁতোয়ান দ্য সাঁ-তেগজ্যুপেরি।',
        labelAge: 'বয়স:',
        labelWebsite: 'ওয়েবসাইট:',
        labelPhone: 'ফোন:',
        labelCity: 'শহর:',
        valCity: 'ঢাকা, বাংলাদেশ',
        labelDegree: 'ডিগ্রি:',
        valDegree: 'বিএসসি ইন সিএসই (চলমান) | ডিপ্লোমা ইন সিএসই (সিজিপিএ ৩.৫৪)',
        labelEmail: 'ইমেইল:',
        labelFreelance: 'ফ্রিল্যান্সিং:',
        valFreelance: 'পরামর্শ ও নেতৃত্বের জন্য উপলব্ধ',
        bio: 'ওমেগা সলিউশন-এ হেড অব ক্রিয়েটিভ অ্যান্ড এইচআর এবং বিজনেস ম্যানেজমেন্ট এক্সিকিউটিভ হিসেবে আমি কারিগরি বাস্তবায়ন, ওয়েব অপ্টিমাইজেশন, এসইও কৌশল, দল পরিচালনা এবং বি২বি প্রবৃদ্ধির সমন্বয় সাধন করি। এন্টারপ্রাইজ ওয়েব পারফরম্যান্স ৫৪ থেকে ৯৪ পেজস্পিডে উন্নীত করা, টপিক ক্লাস্টারের মাধ্যমে অর্গানিক উপস্থিতি বৃদ্ধি, ক্লায়েন্ট অর্জনের পাইপলাইন পরিচালনা কিংবা প্রাত্যহিক এইচআর কার্যক্রম পরিচালনা—প্রতিটি ক্ষেত্রেই জটিল প্রযুক্তিগত প্রক্রিয়াকে আমি পরিমাপযোগ্য ব্যবসায়িক ফলাফলে রূপান্তর করি।',
        statClients: 'সন্তুষ্ট ক্লায়েন্ট',
        statProjects: 'প্রকল্প সম্পন্ন',
        statHours: 'সহায়তার সময় (ঘণ্টা)',
        statWorkers: 'টিম সদস্য',
        skillsTitle: 'দক্ষতাসমূহ',
        skills: {
          s1: 'এসইও ও কনটেন্ট ক্লাস্টারিং',
          s2: 'ওয়েব ব্যবস্থাপনা ও স্পিড অপ্টিমাইজেশন',
          s3: 'ক্রিয়েটিভ ডিরেকশন ও ব্র্যান্ড ডিজাইন',
          s4: 'এইচআর অপারেশনস ও টিম পরিচালনা',
          s5: 'বি২বি সেলস ও আপওয়ার্ক পাইপলাইন',
          s6: 'মাল্টিমিডিয়া ও ভিডিও প্রোডাকশন'
        },
        interestsTitle: 'আগ্রহ ও শখ',
        interests: {
          i1: 'বি২বি পাইপলাইন ও সেলস',
          i2: 'এসইও ও প্রবৃদ্ধি কৌশল',
          i3: 'এইচআর ও অপারেশনস',
          i4: 'আর্ট ও ডিজাইন',
          i5: 'ওয়েব পারফরম্যান্স',
          i6: 'সাইক্লিং',
          i7: 'কনটেন্ট কৌশল',
          i8: 'স্বেচ্ছাসেবা',
          i9: 'অটোমোবাইল প্রযুক্তি',
          i10: 'ভিডিও প্রোডাকশন',
          i11: 'লিনাক্স',
          i12: 'ডাটাবেস ও এসকিউএল'
        },
        testimonialsTitle: 'প্রশংসাপত্র',
        testimonials: [
          {
            quote: 'তিনি অসাধারণ কল্পনাশক্তি ও সৃজনশীল ধারণাসম্পন্ন একজন দক্ষ ব্যক্তি!',
            role: 'সিইও ও প্রতিষ্ঠাতা'
          },
          {
            quote: 'তিনি সবসময় আমাকে মুগ্ধ করেন। আগের দিনে তার ডাকনাম ছিল \'বিজ্ঞানী\'...',
            role: 'সহ-প্রতিষ্ঠাতা ও সিএফএম'
          },
          {
            quote: 'তার অমায়িক ও বন্ধুত্বপূর্ণ আচরণ চারপাশের পরিবেশকে সবসময় প্রাণবন্ত রাখে।',
            role: 'ডিজাইনার ও কনটেন্ট রাইটার'
          },
          {
            quote: 'তার কাজগুলো একদম শিল্পের মতো নিখুঁত।',
            role: 'শিল্পী'
          },
          {
            quote: 'কাজ শুরু করলে তিনি শেষ দেখে তবেই থামেন!',
            role: 'প্রকৌশলী'
          }
        ]
      },
      resume: {
        title: 'সিভি',
        subtitle: 'আমার জীবনবৃত্তান্ত',
        downloadBtn: 'সিভি ডাউনলোড করুন (পিডিএফ)',
        pdfFallback: 'আপনার ব্রাউজার পিডিএফ সমর্থন করে না।',
        pdfDownloadLink: 'পরিবর্তে পিডিএফ ডাউনলোড করুন।'
      },
      services: {
        title: 'সেবাসমূহ',
        subtitle: 'আমার বিশেষায়িত সেবাসমূহ',
        inquireBtn: 'হোয়াটসঅ্যাপে যোগাযোগ',
        cards: [
          {
            title: 'এসইও ও প্রবৃদ্ধি কৌশল',
            desc: 'টপিক ক্লাস্টার আর্কিটেকচার, কিওয়ার্ড-টার্গেটেড কনটেন্ট কৌশল, কারিগরি সাইট অডিট (সেমরাশ/আহরেফস), ব্যাকলিঙ্ক পরিকল্পনা এবং গুগল সার্চ কনসোল ইনডেক্সিংয়ের মাধ্যমে ডেটা-চালিত অর্গানিক সার্চ প্রবৃদ্ধি।'
          },
          {
            title: 'ওয়েব ব্যবস্থাপনা ও স্পিড',
            desc: 'ওয়েবসাইট প্রশাসন, ল্যান্ডিং পেজ ইঞ্জিনিয়ারিং, লাইটস্পিড ক্যাশ কনফিগারেশন এবং মোবাইল স্পিড অপ্টিমাইজেশন—মোবাইল পেজস্পিড ৫৪ থেকে ৯৪+ এ উন্নীত করা।'
          },
          {
            title: 'ক্রিয়েটিভ ডিরেকশন ও ব্র্যান্ডিং',
            desc: 'ফটোশপ ও ইলাস্ট্রেটরে তৈরি পূর্ণাঙ্গ ব্র্যান্ড পরিচিতি ব্যবস্থা, উচ্চ রূপান্তরকারী সোশ্যাল মিডিয়া ক্রিয়েটিভ, লিঙ্কডইন ক্যারোজেল ডেক, প্রোডাক্ট প্যাকেজিং এবং আধুনিক ভিজ্যুয়াল ব্র্যান্ডিং।'
          },
          {
            title: 'এইচআর অপারেশনস ও লিডারশিপ',
            desc: 'কার্যকরী নেতৃত্ব, অ্যাজাইল দল পর্যবেক্ষণ, স্বয়ংক্রিয় উপস্থিতি ও ছুটি ব্যবস্থাপনা, ইন্টার্ন অনবোর্ডিং, নিয়োগ প্রক্রিয়া এবং সুশৃঙ্খল অফিস প্রশাসন।'
          },
          {
            title: 'বি২বি বিজনেস ডেভেলপমেন্ট',
            desc: 'সরাসরি ক্লায়েন্ট অর্জন, উচ্চ রূপান্তরকারী আপওয়ার্ক প্রস্তাবনা তৈরি, মার্কেটপ্লেস কৌশল (ফাইভার ও কোডক্যানিয়ন), প্রতিযোগী বাজার বিশ্লেষণ এবং মেটা অ্যাড ক্যাম্পেইন পরিচালনা।'
          },
          {
            title: 'মাল্টিমিডিয়া ও ভিডিও প্রোডাকশন',
            desc: 'উচ্চ রেজোলিউশন ২কে প্রোডাক্ট ফিচার ওয়ার্কথ্রু, ওবিএস ও অডাসিটি দিয়ে সফটওয়্যার ডেমো রেকর্ডিং, প্রচারণামূলক ভিডিও বিজ্ঞাপন এবং আকর্ষণীয় মাল্টিমিডিয়া গল্পগাথা।'
          }
        ]
      },
      portfolio: {
        title: 'পোর্টফোলিও',
        subtitle: 'আমার কাজসমূহ',
        labelCategory: 'ক্যাটাগরি:',
        labelClient: 'ক্লায়েন্ট:',
        labelProjectDate: 'তারিখ:',
        labelProjectUrl: 'প্রকল্প লিংক:',
        labelTools: 'ব্যবহৃত টুলস:',
        btnViewDoc: 'নথি দেখুন',
        items: {
          p1: {
            title: 'এন্টারপ্রাইজ ওয়েব অপ্টিমাইজেশন ও পারফরম্যান্স',
            desc: 'উচ্চ প্রবৃদ্ধির সফটওয়্যার প্ল্যাটফর্মের জন্য কারিগরি অপ্টিমাইজেশন ও লাইটস্পিড ক্যাশিং। সফলভাবে মোবাইল গতি ৫৪ থেকে ৯৪ এ উন্নীত করা হয়েছে।',
            category: 'ওয়েব ব্যবস্থাপনা ও এসইও'
          },
          p2: {
            title: 'ইউটিউব ইন্ট্রো',
            desc: 'অফেনসিভ রাইনো ইউটিউব ইন্ট্রো ভিডিও।',
            category: 'থ্রিডি অ্যানিমেশন'
          },
          p3: {
            title: 'ভিএফএক্স (VFX)',
            desc: 'এই ভিডিওর ল্যাম্বরগিনি গাড়িটি ভিএফএক্সের মাধ্যমে তৈরি।',
            category: 'ভিএফএক্স'
          },
          p4: {
            title: 'অফেনসিভ রাইনো মার্চ',
            desc: 'অফেনসিভ রাইনো ব্র্যান্ডিং যুক্ত থ্রিডি হাঁটার টি-শার্ট অ্যানিমেশন।',
            category: 'প্রোডাক্ট বিজ্ঞাপন'
          },
          p5: {
            title: 'থ্রিডি অ্যানিমেশন',
            desc: 'থ্রিডি অ্যানিমেশনে আমার করা সবচেয়ে বড় ও জটিল প্রকল্প।',
            category: 'থ্রিডি অ্যানিমেশন'
          }
        }
      },
      contact: {
        title: 'যোগাযোগ',
        subtitle: 'আমার সাথে যোগাযোগ করুন',
        addressTitle: 'আমার ঠিকানা',
        addressVal: 'ঢাকা, বাংলাদেশ',
        socialTitle: 'সামাজিক যোগাযোগ',
        emailTitle: 'ইমেইল করুন',
        callTitle: 'কল করুন',
        placeholderName: 'আপনার নাম',
        placeholderEmail: 'আপনার ইমেইল',
        placeholderSubject: 'বিষয়',
        placeholderMessage: 'বার্তা লিখুন',
        btnSend: 'বার্তা পাঠান',
        msgSending: 'পাঠানো হচ্ছে...',
        msgSent: 'আপনার বার্তাটি সরাসরি হামিমের কাছে পৌঁছে গেছে! ধন্যবাদ।',
        whatsappTooltip: 'হোয়াটসঅ্যাপে চ্যাট করুন'
      },
      credits: {
        author: 'লেখক পরিচিতি',
        policy: 'গোপনীয়তা নীতিমালা',
        settings: 'কুকি ও ভাষা সেটিংস'
      }
    },

    es: {
      langName: 'Spanish',
      nativeName: 'Español',
      dir: 'ltr',
      nav: {
        home: 'Inicio',
        about: 'Sobre mí',
        resume: 'Currículum',
        services: 'Servicios',
        portfolio: 'Portafolio',
        contact: 'Contacto'
      },
      hero: {
        iam: 'Soy',
        title: 'Director Creativo y de RRHH | Ejecutivo de Gestión Empresarial',
        atCompany: 'en Omega Solution',
        tagline: 'Liderando la dirección creativa, optimización web técnica, estrategia SEO y operaciones ágiles en Omega Solution.'
      },
      about: {
        title: 'Sobre mí',
        subtitle: 'Conoce más sobre mí',
        headline: 'Director Creativo y de RRHH | Ejecutivo de Gestión Empresarial | Estratega Digital',
        quote: '“La perfección se logra, no cuando no hay nada más que añadir, sino cuando ya no queda nada que quitar.” — Antoine de Saint-Exupéry.',
        labelAge: 'Edad:',
        labelWebsite: 'Sitio web:',
        labelPhone: 'Teléfono:',
        labelCity: 'Ciudad:',
        valCity: 'Daca, Bangladés',
        labelDegree: 'Titulación:',
        valDegree: 'Grado en Informática (En curso) | Diploma en CSE (CGPA 3.54)',
        labelEmail: 'Correo:',
        labelFreelance: 'Freelance:',
        valFreelance: 'Disponible para Consultoría y Liderazgo',
        bio: 'Como Director Creativo y de RRHH y Ejecutivo de Gestión en Omega Solution, vinculo la ejecución técnica, la optimización web, la estrategia SEO, la administración de equipos y el crecimiento B2B. Ya sea elevando el PageSpeed empresarial de 54 a 94+, impulsando la visibilidad orgánica mediante clusters temáticos, gestionando canales de captación o coordinando las operaciones diarias de RRHH, transformo procesos técnicos complejos en resultados comerciales medibles.',
        statClients: 'Clientes Satisfechos',
        statProjects: 'Proyectos',
        statHours: 'Horas de Soporte',
        statWorkers: 'Colaboradores',
        skillsTitle: 'Habilidades',
        skills: {
          s1: 'SEO y Agrupación de Contenido',
          s2: 'Gestión Web y Optimización de Velocidad',
          s3: 'Dirección Creativa y Diseño de Marca',
          s4: 'Operaciones de RRHH y Gestión de Equipos',
          s5: 'Ventas B2B y Pipeline en Upwork',
          s6: 'Producción Multimedia y de Video'
        },
        interestsTitle: 'Intereses',
        interests: {
          i1: 'Pipeline y Ventas B2B',
          i2: 'Estrategia SEO y Crecimiento',
          i3: 'RRHH y Operaciones',
          i4: 'Arte y Diseño',
          i5: 'Rendimiento Web',
          i6: 'Ciclismo',
          i7: 'Estrategia de Contenido',
          i8: 'Voluntariado',
          i9: 'Tecnología Automotriz',
          i10: 'Producción de Video',
          i11: 'Linux',
          i12: 'Bases de Datos y SQL'
        },
        testimonialsTitle: 'Testimonios',
        testimonials: [
          {
            quote: '¡Es una persona muy capaz, con gran imaginación e ideas creativas!',
            role: 'CEO y Fundador'
          },
          {
            quote: 'Nunca deja de sorprenderme. En aquellos días tenía el apodo de \'Científico\'...',
            role: 'Cofundador y CPM'
          },
          {
            quote: 'Su trato amable y cercano siempre mantiene un ambiente cálido a su alrededor.',
            role: 'Diseñadora y Redactora'
          },
          {
            quote: 'Sus obras son auténtico arte.',
            role: 'Artista'
          },
          {
            quote: '¡Cuando trabaja, no para hasta ver la meta final!',
            role: 'Ingeniero'
          }
        ]
      },
      resume: {
        title: 'Currículum',
        subtitle: 'Mi Currículum',
        downloadBtn: 'Descargar CV (PDF)',
        pdfFallback: 'Tu navegador no soporta PDFs.',
        pdfDownloadLink: 'Descarga el archivo en su lugar.'
      },
      services: {
        title: 'Servicios',
        subtitle: 'Mis Servicios',
        inquireBtn: 'Consultar por WhatsApp',
        cards: [
          {
            title: 'Estrategia SEO y Crecimiento',
            desc: 'Crecimiento orgánico basado en datos mediante arquitectura de clusters temáticos, estrategias de contenido con palabras clave, auditorías técnicas (Semrush/Ahrefs) e indexación en Search Console.'
          },
          {
            title: 'Gestión Web y Velocidad',
            desc: 'Administración integral de sitios web, desarrollo de páginas de aterrizaje, configuración de LiteSpeed Cache y optimización móvil elevando PageSpeed de 54 a 94+.'
          },
          {
            title: 'Dirección Creativa y Branding',
            desc: 'Sistemas integrales de identidad de marca, creatividades para redes sociales de alta conversión, carruseles de LinkedIn, packaging y branding visual moderno.'
          },
          {
            title: 'Operaciones de RRHH y Liderazgo',
            desc: 'Liderazgo operativo, supervisión ágil de equipos, gestión automatizada de asistencia y permisos, incorporación de personal y flujos de contratación eficientes.'
          },
          {
            title: 'Desarrollo de Negocios B2B',
            desc: 'Captación directa de clientes, redacción de propuestas de alto impacto en Upwork, estrategia en marketplaces (Fiverr y CodeCanyon) y gestión de campañas publicitarias en Meta.'
          },
          {
            title: 'Producción Multimedia y de Video',
            desc: 'Recorridos de producto en alta resolución 2K, grabaciones de demostración de software con OBS y Audacity, anuncios en video y narrativa multimedia atractiva.'
          }
        ]
      },
      portfolio: {
        title: 'Portafolio',
        subtitle: 'Mi Portafolio',
        labelCategory: 'Categoría:',
        labelClient: 'Cliente:',
        labelProjectDate: 'Fecha:',
        labelProjectUrl: 'URL del proyecto:',
        labelTools: 'Herramientas:',
        btnViewDoc: 'Ver Documento',
        items: {
          p1: {
            title: 'Optimización y Rendimiento Web Empresarial',
            desc: 'Optimización técnica y configuración de LiteSpeed para plataformas de software. Elevó con éxito el PageSpeed móvil de 54 a 94.',
            category: 'Gestión Web y SEO'
          },
          p2: {
            title: 'Intro de YouTube',
            desc: 'Video de introducción para el canal de YouTube de Offensive Rhino.',
            category: 'Animación 3D'
          },
          p3: {
            title: 'Efectos Visuales (VFX)',
            desc: 'El Lamborghini en este video es parte de efectos visuales (VFX).',
            category: 'VFX'
          },
          p4: {
            title: 'Marcha Offensive Rhino',
            desc: 'Camiseta animada en 3D caminando con la marca Offensive Rhino.',
            category: 'Publicidad de Producto'
          },
          p5: {
            title: 'Animación 3D',
            desc: 'El proyecto de animación 3D más complejo y exigente que he realizado.',
            category: 'Animación 3D'
          }
        }
      },
      contact: {
        title: 'Contacto',
        subtitle: 'Contáctame',
        addressTitle: 'Mi Dirección',
        addressVal: 'Daca, Bangladés',
        socialTitle: 'Perfiles Sociales',
        emailTitle: 'Envíame un Correo',
        callTitle: 'Llámame',
        placeholderName: 'Tu Nombre',
        placeholderEmail: 'Tu Correo Electrónico',
        placeholderSubject: 'Asunto',
        placeholderMessage: 'Mensaje',
        btnSend: 'Enviar Mensaje',
        msgSending: 'Enviando...',
        msgSent: '¡Tu mensaje ha sido enviado directamente a Hamim! Gracias.',
        whatsappTooltip: 'Chatear por WhatsApp'
      },
      credits: {
        author: 'Conoce al Autor',
        policy: 'Política de Privacidad',
        settings: 'Configuración de Cookies e Idioma'
      }
    },

    de: {
      langName: 'German',
      nativeName: 'Deutsch',
      dir: 'ltr',
      nav: {
        home: 'Start',
        about: 'Über mich',
        resume: 'Lebenslauf',
        services: 'Leistungen',
        portfolio: 'Portfolio',
        contact: 'Kontakt'
      },
      hero: {
        iam: 'Ich bin',
        title: 'Leiter Kreation & Personal | Business Management Executive',
        atCompany: 'bei Omega Solution',
        tagline: 'Leitung von Creative Direction, technischer Web-Optimierung, SEO-Strategie und agilen Abläufen bei Omega Solution.'
      },
      about: {
        title: 'Über mich',
        subtitle: 'Erfahren Sie mehr über mich',
        headline: 'Leiter Kreation & Personal | Business Management Executive | Digitaler Stratege',
        quote: '„Perfektion ist nicht dann erreicht, wenn man nichts mehr hinzufügen kann, sondern wenn man nichts mehr weglassen kann.“ — Antoine de Saint-Exupéry.',
        labelAge: 'Alter:',
        labelWebsite: 'Webseite:',
        labelPhone: 'Telefon:',
        labelCity: 'Stadt:',
        valCity: 'Dhaka, Bangladesch',
        labelDegree: 'Abschluss:',
        valDegree: 'B.Sc. in Informatik (Laufend) | Diplom in CSE (CGPA 3.54)',
        labelEmail: 'E-Mail:',
        labelFreelance: 'Freiberuflich:',
        valFreelance: 'Verfügbar für Beratung & Führung',
        bio: 'Als Leiter Kreation & Personal und Business Management Executive bei Omega Solution verbinde ich technische Umsetzung, Web-Optimierung, SEO-Strategie, Team-Administration und B2B-Wachstum. Ob es darum geht, die PageSpeed von 54 auf 94+ zu steigern, organische Sichtbarkeit durch Themen-Cluster aufzubauen, Kundenakquise-Pipelines zu steuern oder das tägliche HR-Management zu koordinieren – ich übersetze komplexe technische Abläufe in messbare Geschäftserfolge.',
        statClients: 'Zufriedene Kunden',
        statProjects: 'Projekte',
        statHours: 'Stunden Support',
        statWorkers: 'Mitarbeiter',
        skillsTitle: 'Fähigkeiten',
        skills: {
          s1: 'SEO & Content-Clustering',
          s2: 'Web-Management & Geschwindigkeitsoptimierung',
          s3: 'Creative Direction & Brand-Design',
          s4: 'HR-Operationen & Team-Management',
          s5: 'B2B-Vertrieb & Upwork-Pipeline',
          s6: 'Multimedia & Videoproduktion'
        },
        interestsTitle: 'Interessen',
        interests: {
          i1: 'B2B-Pipeline & Vertrieb',
          i2: 'SEO & Wachstumsstrategie',
          i3: 'HR & Betriebsführung',
          i4: 'Kunst & Design',
          i5: 'Web-Performance',
          i6: 'Radfahren',
          i7: 'Content-Strategie',
          i8: 'Freiwilligenarbeit',
          i9: 'Automobiltechnik',
          i10: 'Videoproduktion',
          i11: 'Linux',
          i12: 'Datenbanken & SQL'
        },
        testimonialsTitle: 'Referenzen',
        testimonials: [
          {
            quote: 'Er ist ein fähiger Mann mit viel Fantasie und kreativen Ideen!',
            role: 'CEO & Gründer'
          },
          {
            quote: 'Er hört nie auf, mich zu überraschen. Früher hatte er den Spitznamen ‚Wissenschaftler‘...',
            role: 'Mitgründer & CPM'
          },
          {
            quote: 'Sein freundliches Wesen sorgt stets für eine herzliche Atmosphäre.',
            role: 'Designerin & Texterin'
          },
          {
            quote: 'Seine Arbeiten gleichen wahrer Kunst.',
            role: 'Künstler'
          },
          {
            quote: 'Wenn er arbeitet, arbeitet er, bis das Ziel perfekt erreicht ist!',
            role: 'Ingenieur'
          }
        ]
      },
      resume: {
        title: 'Lebenslauf',
        subtitle: 'Mein Lebenslauf',
        downloadBtn: 'Lebenslauf herunterladen (PDF)',
        pdfFallback: 'Ihr Browser unterstützt keine PDFs.',
        pdfDownloadLink: 'Bitte laden Sie die PDF-Datei herunter.'
      },
      services: {
        title: 'Leistungen',
        subtitle: 'Meine Leistungen',
        inquireBtn: 'Auf WhatsApp anfragen',
        cards: [
          {
            title: 'SEO & Wachstumsstrategie',
            desc: 'Datengetriebenes organisches Suchwachstum durch Themen-Cluster-Architektur, zielgerichtete Content-Strategien, technische Audits (Semrush/Ahrefs) und Google Search Console-Indexierung.'
          },
          {
            title: 'Web-Management & Speed',
            desc: 'Umfassende Website-Administration, Landing-Page-Engineering, LiteSpeed-Cache-Konfiguration und mobile Optimierung – Steigerung des mobilen PageSpeed von 54 auf 94+.'
          },
          {
            title: 'Creative Direction & Branding',
            desc: 'Umfassende Markenidentitätssysteme, hochkonvertierende Social-Media-Creatives, LinkedIn-Karussell-Decks, Produktverpackungen und modernes visuelles Branding.'
          },
          {
            title: 'HR-Operationen & Führung',
            desc: 'Operative Führung, agiles Team-Monitoring, automatisiertes Anwesenheits- und Urlaubsmanagement, Praktikanten-Onboarding und effiziente Rekrutierungsworkflows.'
          },
          {
            title: 'B2B-Geschäftsentwicklung',
            desc: 'Direkte Kundenakquise, hochkonvertierende Upwork-Angebote, Marktplatzstrategien (Fiverr & CodeCanyon), Wettbewerbsanalysen und Meta-Werbekampagnen.'
          },
          {
            title: 'Multimedia & Videoproduktion',
            desc: 'Hochauflösende 2K-Produktrundgänge, Software-Demos mit OBS & Audacity, Werbevideos und ansprechendes multimediales Storytelling.'
          }
        ]
      },
      portfolio: {
        title: 'Portfolio',
        subtitle: 'Mein Portfolio',
        labelCategory: 'Kategorie:',
        labelClient: 'Kunde:',
        labelProjectDate: 'Datum:',
        labelProjectUrl: 'Projekt-URL:',
        labelTools: 'Werkzeuge:',
        btnViewDoc: 'Dokument ansehen',
        items: {
          p1: {
            title: 'Enterprise Web-Optimierung & Performance',
            desc: 'Technische Website-Optimierung und LiteSpeed-Caching für Software-Plattformen. Steigerte den mobilen PageSpeed erfolgreich von 54 auf 94.',
            category: 'Web-Management & SEO'
          },
          p2: {
            title: 'YouTube-Intro',
            desc: 'YouTube-Intro-Video für Offensive Rhino.',
            category: '3D-Animation'
          },
          p3: {
            title: 'VFX',
            desc: 'Der Lamborghini in diesem Video wurde mittels visueller Effekte (VFX) realisiert.',
            category: 'VFX'
          },
          p4: {
            title: 'Offensive Rhino March',
            desc: '3D-animiertes gehendes T-Shirt mit Offensive Rhino-Branding.',
            category: 'Produktwerbung'
          },
          p5: {
            title: '3D-Animation',
            desc: 'Mein bislang anspruchsvollstes und aufwendigstes 3D-Animationsprojekt.',
            category: '3D-Animation'
          }
        }
      },
      contact: {
        title: 'Kontakt',
        subtitle: 'Kontaktieren Sie mich',
        addressTitle: 'Meine Adresse',
        addressVal: 'Dhaka, Bangladesch',
        socialTitle: 'Soziale Netzwerke',
        emailTitle: 'Schreiben Sie mir',
        callTitle: 'Rufen Sie mich an',
        placeholderName: 'Ihr Name',
        placeholderEmail: 'Ihre E-Mail',
        placeholderSubject: 'Betreff',
        placeholderMessage: 'Nachricht',
        btnSend: 'Nachricht senden',
        msgSending: 'Wird gesendet...',
        msgSent: 'Ihre Nachricht wurde direkt an Hamim gesendet! Vielen Dank.',
        whatsappTooltip: 'Auf WhatsApp chatten'
      },
      credits: {
        author: 'Über den Autor',
        policy: 'Datenschutzrichtlinie',
        settings: 'Cookie- & Spracheinstellungen'
      }
    },

    fr: {
      langName: 'French',
      nativeName: 'Français',
      dir: 'ltr',
      nav: {
        home: 'Accueil',
        about: 'À propos',
        resume: 'CV',
        services: 'Services',
        portfolio: 'Portfolio',
        contact: 'Contact'
      },
      hero: {
        iam: 'Je suis',
        title: 'Directeur de Création & RH | Responsable de la Gestion d\'Entreprise',
        atCompany: 'chez Omega Solution',
        tagline: 'Pilotage de la direction créative, de l\'optimisation web technique, de la stratégie SEO et des opérations agiles chez Omega Solution.'
      },
      about: {
        title: 'À propos',
        subtitle: 'En savoir plus sur moi',
        headline: 'Directeur de Création & RH | Responsable de la Gestion d\'Entreprise | Stratège Digital',
        quote: '« La perfection est atteinte, non pas lorsqu\'il n\'y a plus rien à ajouter, mais lorsqu\'il n\'y a plus rien à retirer. » — Antoine de Saint-Exupéry.',
        labelAge: 'Âge :',
        labelWebsite: 'Site web :',
        labelPhone: 'Téléphone :',
        labelCity: 'Ville :',
        valCity: 'Dacca, Bangladesh',
        labelDegree: 'Diplôme :',
        valDegree: 'Licence en informatique (En cours) | Diplôme en CSE (CGPA 3.54)',
        labelEmail: 'E-mail :',
        labelFreelance: 'Freelance :',
        valFreelance: 'Disponible pour Conseil & Leadership',
        bio: 'En tant que Directeur de Création & RH et Responsable de la Gestion d\'Entreprise chez Omega Solution, je fais le pont entre l\'exécution technique, l\'optimisation web, la stratégie SEO, l\'administration d\'équipe et la croissance B2B. Qu\'il s\'agisse d\'augmenter le PageSpeed de 54 à 94+, de stimuler la visibilité organique par des clusters thématiques, de gérer les pipelines d\'acquisition ou d\'orchestrer les opérations RH quotidiennes, je transforme des flux techniques complexes en résultats commerciaux mesurables.',
        statClients: 'Clients Satisfaits',
        statProjects: 'Projets',
        statHours: 'Heures d\'Assistance',
        statWorkers: 'Collaborateurs',
        skillsTitle: 'Compétences',
        skills: {
          s1: 'SEO & Clusters de Contenu',
          s2: 'Gestion Web & Optimisation de Vitesse',
          s3: 'Direction Créative & Design de Marque',
          s4: 'Opérations RH & Gestion d\'Équipe',
          s5: 'Ventes B2B & Pipeline Upwork',
          s6: 'Production Multimédia & Vidéo'
        },
        interestsTitle: 'Centres d\'intérêt',
        interests: {
          i1: 'Pipeline & Ventes B2B',
          i2: 'Stratégie SEO & Croissance',
          i3: 'RH & Opérations',
          i4: 'Art & Design',
          i5: 'Performance Web',
          i6: 'Cyclisme',
          i7: 'Stratégie de Contenu',
          i8: 'Bénévolat',
          i9: 'Technologie Automobile',
          i10: 'Production Vidéo',
          i11: 'Linux',
          i12: 'Bases de Données & SQL'
        },
        testimonialsTitle: 'Témoignages',
        testimonials: [
          {
            quote: 'C\'est un homme compétent avec beaucoup d\'imagination et d\'idées créatives !',
            role: 'PDG & Fondateur'
          },
          {
            quote: 'Il ne cesse de m\'étonner. Il avait le surnom de « Scientifique » à l\'époque...',
            role: 'Cofondateur & CPM'
          },
          {
            quote: 'Son comportement bienveillant et chaleureux apporte toujours une excellente ambiance.',
            role: 'Designer & Rédactrice'
          },
          {
            quote: 'Ses réalisations s\'apparentent à de l\'art.',
            role: 'Artiste'
          },
          {
            quote: 'Quand il travaille, il ne s\'arrête pas avant d\'avoir atteint l\'excellence !',
            role: 'Ingénieur'
          }
        ]
      },
      resume: {
        title: 'CV',
        subtitle: 'Mon CV',
        downloadBtn: 'Télécharger le CV (PDF)',
        pdfFallback: 'Votre navigateur ne prend pas en charge les PDF.',
        pdfDownloadLink: 'Téléchargez le fichier à la place.'
      },
      services: {
        title: 'Services',
        subtitle: 'Mes Services',
        inquireBtn: 'Contacter sur WhatsApp',
        cards: [
          {
            title: 'Stratégie SEO & Croissance',
            desc: 'Croissance organique basée sur les données via des architectures de clusters, des stratégies de contenu ciblées, des audits techniques (Semrush/Ahrefs) et l\'indexation Search Console.'
          },
          {
            title: 'Gestion Web & Vitesse',
            desc: 'Administration complète de sites web, conception de landing pages, configuration du cache LiteSpeed et optimisation mobile augmentant le PageSpeed de 54 à 94+.'
          },
          {
            title: 'Direction Créative & Branding',
            desc: 'Systèmes complets d\'identité de marque, créations pour réseaux sociaux à fort taux de conversion, carrousels LinkedIn, packaging et branding visuel moderne.'
          },
          {
            title: 'Opérations RH & Leadership',
            desc: 'Leadership opérationnel, suivi d\'équipe agile, gestion automatisée des présences et des congés, intégration des stagiaires et flux de recrutement optimisés.'
          },
          {
            title: 'Développement Commercial B2B',
            desc: 'Acquisition directe de clients, rédaction de propositions Upwork performantes, stratégie sur marketplaces (Fiverr & CodeCanyon) et gestion de campagnes Meta Ads.'
          },
          {
            title: 'Production Multimédia & Vidéo',
            desc: 'Présentations de produits en 2K haute résolution, démonstrations logicielles enregistrées avec OBS & Audacity, vidéos promotionnelles et storytelling multimédia captivant.'
          }
        ]
      },
      portfolio: {
        title: 'Portfolio',
        subtitle: 'Mon Portfolio',
        labelCategory: 'Catégorie :',
        labelClient: 'Client :',
        labelProjectDate: 'Date :',
        labelProjectUrl: 'URL du projet :',
        labelTools: 'Outils :',
        btnViewDoc: 'Voir le document',
        items: {
          p1: {
            title: 'Optimisation Web & Performance d\'Entreprise',
            desc: 'Optimisation technique et cache LiteSpeed pour plateformes à forte croissance. PageSpeed mobile amélioré avec succès de 54 à 94.',
            category: 'Gestion Web & SEO'
          },
          p2: {
            title: 'Intro YouTube',
            desc: 'Vidéo d\'introduction YouTube pour Offensive Rhino.',
            category: 'Animation 3D'
          },
          p3: {
            title: 'Effets Spéciaux (VFX)',
            desc: 'La Lamborghini dans cette vidéo est intégrée en VFX.',
            category: 'VFX'
          },
          p4: {
            title: 'Offensive Rhino March',
            desc: 'T-shirt animé en 3D en marche avec le branding Offensive Rhino.',
            category: 'Publicité Produit'
          },
          p5: {
            title: 'Animation 3D',
            desc: 'Le projet le plus complexe et ambitieux que j\'ai réalisé en animation 3D.',
            category: 'Animation 3D'
          }
        }
      },
      contact: {
        title: 'Contact',
        subtitle: 'Contactez-moi',
        addressTitle: 'Mon Adresse',
        addressVal: 'Dacca, Bangladesh',
        socialTitle: 'Réseaux Sociaux',
        emailTitle: 'Envoyez-moi un E-mail',
        callTitle: 'Appelez-moi',
        placeholderName: 'Votre Nom',
        placeholderEmail: 'Votre E-mail',
        placeholderSubject: 'Sujet',
        placeholderMessage: 'Message',
        btnSend: 'Envoyer le message',
        msgSending: 'Envoi en cours...',
        msgSent: 'Votre message a été envoyé directement à Hamim ! Merci.',
        whatsappTooltip: 'Discuter sur WhatsApp'
      },
      credits: {
        author: 'Rencontrez l\'Auteur',
        policy: 'Politique de Confidentialité',
        settings: 'Paramètres Cookies et Langue'
      }
    },

    ar: {
      langName: 'Arabic',
      nativeName: 'العربية',
      dir: 'rtl',
      nav: {
        home: 'الرئيسية',
        about: 'نبذة عني',
        resume: 'السيرة الذاتية',
        services: 'الخدمات',
        portfolio: 'معرض الأعمال',
        contact: 'اتصل بي'
      },
      hero: {
        iam: 'أنا',
        title: 'مدير الإبداع والموارد البشرية | مسؤول إدارة الأعمال',
        atCompany: 'في Omega Solution',
        tagline: 'قيادة التوجيه الإبداعي والتحسين التقني للمواقع واستراتيجيات تحسين محركات البحث والعمليات الرشيقة في Omega Solution.'
      },
      about: {
        title: 'نبذة عني',
        subtitle: 'تعرف أكثر عني',
        headline: 'مدير الإبداع والموارد البشرية | مسؤول إدارة الأعمال | استراتيجي رقمي',
        quote: '«لا يتحقق الكمال عندما لا يتبقى شيء يمكن إضافته، بل عندما لا يتبقى شيء يمكن حذفه.» — أنطوان دو سانت إكزوبيري.',
        labelAge: 'العمر:',
        labelWebsite: 'الموقع:',
        labelPhone: 'الهاتف:',
        labelCity: 'المدينة:',
        valCity: 'دكا، بنغلاديش',
        labelDegree: 'المؤهل:',
        valDegree: 'بكالوريوس في علوم الحاسوب (قيد الدراسة) | دبلوم في هندسة الحاسوب (CGPA 3.54)',
        labelEmail: 'البريد الإلكتروني:',
        labelFreelance: 'العمل الحر:',
        valFreelance: 'متاح للاستشارات والقيادة',
        bio: 'بصفتي مديراً للإبداع والموارد البشرية ومسؤولاً لإدارة الأعمال في Omega Solution، أربط بين التنفيذ التقني، تحسين المواقع، استراتيجيات السيو، إدارة الفرق، ونمو صفقات B2B. سواء كان ذلك عبر رفع سرعة تصفح المواقع من 54 إلى 94+ PageSpeed، أو تعزيز الظهور الطبيعي عبر المجموعات الموضوعية، أو إدارة مسارات استقطاب العملاء، أو قيادة العمليات اليومية للموارد البشرية، فإنني أحول الإجراءات التقنية المعقدة إلى نتائج أعمال ملموسة.',
        statClients: 'عملاء راضون',
        statProjects: 'مشاريع منجزة',
        statHours: 'ساعات الدعم',
        statWorkers: 'فريق العمل',
        skillsTitle: 'المهارات',
        skills: {
          s1: 'تحسين محركات البحث وتجميع المحتوى',
          s2: 'إدارة المواقع وتسريع الأداء',
          s3: 'التوجيه الإبداعي وتصميم الهوية',
          s4: 'عمليات الموارد البشرية وإدارة الفرق',
          s5: 'مبيعات B2B ومسار عمل Upwork',
          s6: 'الإنتاج المرئي والوسائط المتعددة'
        },
        interestsTitle: 'الاهتمامات',
        interests: {
          i1: 'مسار صفقات B2B والمبيعات',
          i2: 'استراتيجية السيو والنمو',
          i3: 'الموارد البشرية والعمليات',
          i4: 'الفن والتصميم',
          i5: 'أداء المواقع',
          i6: 'ركوب الدراجات',
          i7: 'استراتيجية المحتوى',
          i8: 'العمل التطوعي',
          i9: 'تكنولوجيا السيارات',
          i10: 'إنتاج الفيديو',
          i11: 'لينكس',
          i12: 'قواعد البيانات و SQL'
        },
        testimonialsTitle: 'آراء الزملاء والعملاء',
        testimonials: [
          {
            quote: 'إنه شخص كفء للغاية ويمتلك خيالاً واسعاً وأفكاراً إبداعية مميزة!',
            role: 'الرئيس التنفيذي والمؤسس'
          },
          {
            quote: 'إنه لا يتوقف أبداً عن إبهاري. كان يلقب بـ \'العالِم\' في السابق...',
            role: 'شريك مؤسس ومدير المشاريع'
          },
          {
            quote: 'أسلوبه اللطيف والودود يضفي دائماً أجواء من الدفء والراحة من حوله.',
            role: 'مصممة وكاتبة محتوى'
          },
          {
            quote: 'أعماله تشبه التحف الفنية الحقيقية.',
            role: 'فنان'
          },
          {
            quote: 'عندما يعمل، لا يتوقف حتى يرى الإنجاز مكتملاً في أبهى صورة!',
            role: 'مهندس'
          }
        ]
      },
      resume: {
        title: 'السيرة الذاتية',
        subtitle: 'سيرتي الذاتية',
        downloadBtn: 'تحميل السيرة الذاتية (PDF)',
        pdfFallback: 'متصفحك لا يدعم عرض ملفات PDF.',
        pdfDownloadLink: 'يرجى تحميل الملف مباشرة بدلاً من ذلك.'
      },
      services: {
        title: 'الخدمات',
        subtitle: 'خدماتي المتميزة',
        inquireBtn: 'استفسر عبر واتساب',
        cards: [
          {
            title: 'استراتيجية السيو والنمو',
            desc: 'نمو طبيعي مستند إلى البيانات عبر بنية المجموعات الموضوعية، استراتيجيات المحتوى المستهدفة، عمليات التدقيق التقني (Semrush/Ahrefs)، وفهرسة Google Search Console.'
          },
          {
            title: 'إدارة المواقع والسرعة',
            desc: 'إدارة متكاملة للمواقع، هندسة صفحات الهبوط، ضبط التخزين المؤقت LiteSpeed، وتسريع التصفح على الجوال لرفع PageSpeed من 54 إلى 94+.'
          },
          {
            title: 'التوجيه الإبداعي والعلامة التجارية',
            desc: 'أنظمة هوية بصرية متكاملة، تصاميم سوشيال ميديا ذات تحويل عالٍ، شرائح لينكد إن التفاعلية، تغليف المنتجات، وبراندينغ عصري احترافي.'
          },
          {
            title: 'عمليات الموارد البشرية والقيادة',
            desc: 'القيادة التشغيلية، متابعة الفرق بأساليب رشيقة، أتمتة سجلات الحضور والإجازات، تأهيل المتدربين، مسارات التوظيف، وتنظيم العمليات الإدارية.'
          },
          {
            title: 'تطوير أعمال B2B',
            desc: 'استقطاب العملاء المباشر، صياغة عروض Upwork ذات نسب القبول العالية، استراتيجيات منصات العمل (Fiverr و CodeCanyon)، وتحليل المنافسين وحملات إعلانات Meta.'
          },
          {
            title: 'الإنتاج المرئي والوسائط المتعددة',
            desc: 'عروض تفاعلية للمنتجات بدقة 2K عالية، تسجيل عروض توضيحية للبرمجيات باستخدام OBS و Audacity، إعلانات فيديو ترويجية، ورواية بصرية جذابة.'
          }
        ]
      },
      portfolio: {
        title: 'معرض الأعمال',
        subtitle: 'أبرز أعمالي',
        labelCategory: 'الفئة:',
        labelClient: 'العميل:',
        labelProjectDate: 'التاريخ:',
        labelProjectUrl: 'رابط المشروع:',
        labelTools: 'الأدوات المستعملة:',
        btnViewDoc: 'عرض المستند',
        items: {
          p1: {
            title: 'تحسين وتسريع أداء المواقع للمؤسسات',
            desc: 'تحسين تقني وضبط التخزين المؤقت LiteSpeed لمنصات البرمجيات. تم بنجاح رفع سرعة الجوال من 54 إلى 94.',
            category: 'إدارة المواقع والسيو'
          },
          p2: {
            title: 'مقدمة فيديو يوتيوب',
            desc: 'فيديو مقدمة يوتيوب لقناة Offensive Rhino.',
            category: 'رسوم ثلاثية الأبعاد'
          },
          p3: {
            title: 'المؤثرات البصرية (VFX)',
            desc: 'سيارة لامبورغيني في هذا الفيديو هي جزء من المؤثرات البصرية.',
            category: 'مؤثرات بصرية'
          },
          p4: {
            title: 'مسيرة Offensive Rhino',
            desc: 'قميص متحرك ثلاثي الأبعاد يحمل علامة Offensive Rhino.',
            category: 'إعلانات منتجات'
          },
          p5: {
            title: 'رسوم متحركة ثلاثية الأبعاد',
            desc: 'أكبر وأعقد مشروع أنجزته في مجال الرسوم المتحركة ثلاثية الأبعاد.',
            category: 'رسوم ثلاثية الأبعاد'
          }
        }
      },
      contact: {
        title: 'اتصل بي',
        subtitle: 'تواصل معي',
        addressTitle: 'عنواني',
        addressVal: 'دكا، بنغلاديش',
        socialTitle: 'حسابات التواصل',
        emailTitle: 'راسلني عبر البريد',
        callTitle: 'اتصل بي هاتفياً',
        placeholderName: 'اسمك الكريم',
        placeholderEmail: 'بريدك الإلكتروني',
        placeholderSubject: 'موضوع الرسالة',
        placeholderMessage: 'اكتب رسالتك هنا',
        btnSend: 'إرسال الرسالة',
        msgSending: 'جارٍ الإرسال...',
        msgSent: 'تم إرسال رسالتك مباشرة إلى حاميم! شكراً لتواصلك.',
        whatsappTooltip: 'محادثة عبر واتساب'
      },
      credits: {
        author: 'عن المطور',
        policy: 'سياسة الخصوصية',
        settings: 'إعدادات الكوكيز واللغة'
      }
    },

    ja: {
      langName: 'Japanese',
      nativeName: '日本語',
      dir: 'ltr',
      nav: {
        home: 'ホーム',
        about: '私について',
        resume: '履歴書',
        services: 'サービス',
        portfolio: 'ポートフォリオ',
        contact: 'お問い合わせ'
      },
      hero: {
        iam: '私は',
        title: 'クリエイティブ＆人事責任者 | 経営管理エグゼクティブ',
        atCompany: '（Omega Solution所属）',
        tagline: 'Omega Solutionにおいて、クリエイティブディレクション、テクニカルWeb最適化、SEO戦略、アジャイル運営をリード。'
      },
      about: {
        title: '私について',
        subtitle: '詳しいプロフィール',
        headline: 'クリエイティブ＆人事責任者 | 経営管理エグゼクティブ | デジタルストラテジスト',
        quote: '「完璧とは、これ以上付け加えるものがないときではなく、これ以上削ぎ落とすものがないときに達成される。」— アントワーヌ・ド・サン＝テグジュペリ',
        labelAge: '年齢:',
        labelWebsite: 'ウェブサイト:',
        labelPhone: '電話番号:',
        labelCity: '居住地:',
        valCity: 'バングラデシュ、ダッカ',
        labelDegree: '学位・資格:',
        valDegree: 'コンピュータサイエンス学士（在学中） | CSEディプロマ（CGPA 3.54）',
        labelEmail: 'メール:',
        labelFreelance: 'フリーランス:',
        valFreelance: 'コンサルティングおよびリーダーシップに対応可能',
        bio: 'Omega Solutionのクリエイティブ＆人事責任者兼経営管理エグゼクティブとして、技術的実行、Web最適化、SEO戦略、チーム管理、B2B成長を連携させています。企業のWeb表示速度をPageSpeed 54から94+へと引き上げ、トピッククラスターで自然検索流入を拡大し、案件獲得パイプラインを管理し、日常の人事運営を指揮するなど、複雑な技術ワークフローを測定可能なビジネス成果へと転換します。',
        statClients: '満足したクライアント',
        statProjects: 'プロジェクト実績',
        statHours: 'サポート時間',
        statWorkers: 'チームメンバー',
        skillsTitle: 'スキル',
        skills: {
          s1: 'SEO＆コンテンツクラスター',
          s2: 'Webサイト管理＆表示速度最適化',
          s3: 'クリエイティブディレクション＆ブランドデザイン',
          s4: '人事オペレーション＆チーム管理',
          s5: 'B2B営業＆Upwork案件パイプライン',
          s6: 'マルチメディア＆動画制作'
        },
        interestsTitle: '興味・関心',
        interests: {
          i1: 'B2Bパイプライン＆営業',
          i2: 'SEO＆グロース戦略',
          i3: '人事＆オペレーション',
          i4: 'アート＆デザイン',
          i5: 'Webパフォーマンス',
          i6: 'サイクリング',
          i7: 'コンテンツ戦略',
          i8: 'ボランティア活動',
          i9: '自動車技術',
          i10: '映像制作',
          i11: 'Linux',
          i12: 'データベース＆SQL'
        },
        testimonialsTitle: '推薦の声',
        testimonials: [
          {
            quote: '彼は豊かな想像力と創造的なアイデアに満ちた、非常に有能な人物です！',
            role: 'CEO 兼 創業者'
          },
          {
            quote: '彼はいつも私を驚かせてくれます。昔は『科学者』というニックネームで呼ばれていました...',
            role: '共同創業者 兼 CPM'
          },
          {
            quote: '彼の親切で温かい人柄は、常に周囲の雰囲気を明るくしてくれます。',
            role: 'デザイナー 兼 ライター'
          },
          {
            quote: '彼が手掛ける仕事は、まさに芸術のようです。',
            role: 'アーティスト'
          },
          {
            quote: '彼が仕事に取り掛かると、完成するまで決して妥協しません！',
            role: 'エンジニア'
          }
        ]
      },
      resume: {
        title: '履歴書',
        subtitle: '私の経歴書',
        downloadBtn: '履歴書をダウンロード (PDF)',
        pdfFallback: 'お使いのブラウザはPDF表示に対応していません。',
        pdfDownloadLink: 'PDFをダウンロードしてください。'
      },
      services: {
        title: '提供サービス',
        subtitle: '専門サービス一覧',
        inquireBtn: 'WhatsAppでお問い合わせ',
        cards: [
          {
            title: 'SEO＆グロース戦略',
            desc: 'トピッククラスター構成、キーワード別コンテンツ戦略、テクニカルサイト監査（Semrush/Ahrefs）、Google Search Consoleインデックス管理によるデータ主導の自然検索流入拡大。'
          },
          {
            title: 'Webサイト管理＆表示速度向上',
            desc: 'エンドツーエンドのサイト管理、LP構築、LiteSpeedキャッシュ設定、モバイル速度改善により、モバイルPageSpeedを54から94+へと向上。'
          },
          {
            title: 'クリエイティブ＆ブランディング',
            desc: 'PhotoshopやIllustratorを駆使した包括的なブランドID、高CVRのSNSクリエイティブ、LinkedInカルーセル、製品パッケージ、洗練されたビジュアル。'
          },
          {
            title: '人事オペレーション＆リーダーシップ',
            desc: '業務リーダーシップ、アジャイルなチーム進行管理、勤怠・休暇の自動化、インターン受け入れ、採用選考フロー、効率的なオフィス運営。'
          },
          {
            title: 'B2B事業開発・営業',
            desc: '直接的な顧客開拓、高採択率のUpworkプロポーザル作成、マーケットプレイス戦略（Fiverr/CodeCanyon）、競合分析、Meta広告運用。'
          },
          {
            title: 'マルチメディア＆映像制作',
            desc: '高解像度2Kの製品機能ウォークスルー、OBS・Audacityを用いたソフトウェアデモ収録、プロモーション動画、魅力的なマルチメディア制作。'
          }
        ]
      },
      portfolio: {
        title: 'ポートフォリオ',
        subtitle: '制作実績・作品集',
        labelCategory: 'カテゴリー:',
        labelClient: 'クライアント:',
        labelProjectDate: '制作日:',
        labelProjectUrl: 'プロジェクトURL:',
        labelTools: '使用ツール:',
        btnViewDoc: '資料を閲覧',
        items: {
          p1: {
            title: 'エンタープライズWeb最適化＆パフォーマンス向上',
            desc: '高成長プラットフォーム向けの技術的最適化とLiteSpeed設定。モバイル表示速度を54から94へと劇的に改善。',
            category: 'Web管理＆SEO'
          },
          p2: {
            title: 'YouTubeオープニング動画',
            desc: 'Offensive RhinoのYouTubeチャンネル用イントロ映像。',
            category: '3Dアニメーション'
          },
          p3: {
            title: 'VFX（視覚効果）',
            desc: '本映像内のランボルギーニは3D VFX技術によって制作。',
            category: 'VFX'
          },
          p4: {
            title: 'Offensive Rhino マーチ',
            desc: 'Offensive Rhinoのブランドロゴが入った3D歩行Tシャツアニメーション。',
            category: '製品プロモーション'
          },
          p5: {
            title: '3Dアニメーション',
            desc: 'これまでに手掛けた中で最も大規模で高負荷な3Dアニメーション制作。',
            category: '3Dアニメーション'
          }
        }
      },
      contact: {
        title: 'お問い合わせ',
        subtitle: 'ご連絡はこちらから',
        addressTitle: '所在地',
        addressVal: 'バングラデシュ、ダッカ',
        socialTitle: 'SNSアカウント',
        emailTitle: 'メールを送信',
        callTitle: 'お電話',
        placeholderName: 'お名前',
        placeholderEmail: 'メールアドレス',
        placeholderSubject: '件名',
        placeholderMessage: 'メッセージ本文',
        btnSend: 'メッセージを送信',
        msgSending: '送信中...',
        msgSent: 'メッセージがHamimに直接送信されました！ありがとうございます。',
        whatsappTooltip: 'WhatsAppでチャット'
      },
      credits: {
        author: '製作者について',
        policy: 'プライバシーポリシー',
        settings: 'Cookieと言語の設定'
      }
    },

    hi: {
      langName: 'Hindi',
      nativeName: 'हिन्दी',
      dir: 'ltr',
      nav: {
        home: 'होम',
        about: 'परिचय',
        resume: 'बायोडाटा',
        services: 'सेवाएँ',
        portfolio: 'पोर्टफोलियो',
        contact: 'संपर्क'
      },
      hero: {
        iam: 'मैं',
        title: 'हेड ऑफ क्रिएटिव एंड एचआर | बिजनेस मैनेजमेंट एग्जीक्यूटिव',
        atCompany: 'ओमेगा सॉल्यूशन में',
        tagline: 'ओमेगा सॉल्यूशन में क्रिएटिव निर्देशन, तकनीकी वेब अनुकूलन, एसईओ रणनीति और चुस्त संचालन का नेतृत्व।'
      },
      about: {
        title: 'परिचय',
        subtitle: 'मेरे बारे में और जानें',
        headline: 'हेड ऑफ क्रिएटिव एंड एचआर | बिजनेस मैनेजमेंट एग्जीक्यूटिव | डिजिटल रणनीतिकार',
        quote: '“पूर्णता तब नहीं मिलती जब जोड़ने के लिए कुछ न बचे, बल्कि तब मिलती है जब हटाने के लिए कुछ न बचे।” — एंटोनी डी सेंट-एक्सुपेरी।',
        labelAge: 'आयु:',
        labelWebsite: 'वेबसाइट:',
        labelPhone: 'फ़ोन:',
        labelCity: 'शहर:',
        valCity: 'ढाका, बांग्लादेश',
        labelDegree: 'डिग्री:',
        valDegree: 'कंप्यूटर साइंस में बी.एससी. (अध्ययनरत) | डिप्लोमा इन सीएसई (CGPA 3.54)',
        labelEmail: 'ईमेल:',
        labelFreelance: 'फ्रीलांस:',
        valFreelance: 'परामर्श और नेतृत्व के लिए उपलब्ध',
        bio: 'ओमेगा सॉल्यूशन में हेड ऑफ क्रिएटिव एंड एचआर और बिजनेस मैनेजमेंट एग्जीक्यूटिव के रूप में, मैं तकनीकी क्रियान्वयन, वेब अनुकूलन, एसईओ रणनीति, टीम प्रशासन और बी2बी विकास के बीच सामंजस्य स्थापित करता हूँ। चाहे एंटरप्राइज वेब परफॉर्मेंस को 54 से 94+ पेजस्पीड तक पहुंचाना हो, टॉपिक क्लस्टर्स के जरिए ऑर्गेनिक विजिबिलिटी बढ़ाना हो, क्लाइंट अधिग्रहण पाइपलाइन प्रबंधित करना हो या दैनिक एचआर संचालन का नेतृत्व करना हो, मैं जटिल तकनीकी प्रक्रियाओं को मापने योग्य व्यावसायिक परिणामों में बदलता हूँ।',
        statClients: 'संतुष्ट ग्राहक',
        statProjects: 'परियोजनाएं',
        statHours: 'समर्थन के घंटे',
        statWorkers: 'कर्मठ सदस्य',
        skillsTitle: 'कौशल',
        skills: {
          s1: 'एसईओ और सामग्री समूहन',
          s2: 'वेब प्रबंधन और गति अनुकूलन',
          s3: 'क्रिएटिव निर्देशन और ब्रांड डिज़ाइन',
          s4: 'एचआर संचालन और टीम प्रबंधन',
          s5: 'बी2बी बिक्री और अपवर्क पाइपलाइन',
          s6: 'मल्टीमीडिया और वीडियो निर्माण'
        },
        interestsTitle: 'रुचियाँ',
        interests: {
          i1: 'बी2बी पाइपलाइन और बिक्री',
          i2: 'एसईओ और विकास रणनीति',
          i3: 'एचआर और संचालन',
          i4: 'कला और डिज़ाइन',
          i5: 'वेब प्रदर्शन',
          i6: 'साइकिल चलाना',
          i7: 'सामग्री रणनीति',
          i8: 'स्वयंसेवा',
          i9: 'ऑटोमोबाइल प्रौद्योगिकी',
          i10: 'वीडियो निर्माण',
          i11: 'लिनक्स',
          i12: 'डेटाबेस और एसक्यूएल'
        },
        testimonialsTitle: 'प्रशंसापत्र',
        testimonials: [
          {
            quote: 'वह अद्भुत कल्पनाशीलता और रचनात्मक विचारों से भरपूर एक सक्षम व्यक्ति हैं!',
            role: 'सीईओ और संस्थापक'
          },
          {
            quote: 'वह मुझे कभी चकित करने से नहीं चूकते। पहले उनका उपनाम \'वैज्ञानिक\' हुआ करता था...',
            role: 'सह-संस्थापक और सीपीएम'
          },
          {
            quote: 'उनका विनम्र और मिलनसार व्यवहार हमेशा उनके आसपास के माहौल को सुखद बनाए रखता है।',
            role: 'डिज़ाइनर और सामग्री लेखक'
          },
          {
            quote: 'उनके काम किसी कलाकृति की तरह होते हैं।',
            role: 'कलाकार'
          },
          {
            quote: 'जब वह काम शुरू करते हैं, तो उसे पूरा अंजाम देकर ही दम लेते हैं!',
            role: 'इंजीनियर'
          }
        ]
      },
      resume: {
        title: 'बायोडाटा',
        subtitle: 'मेरा बायोडाटा',
        downloadBtn: 'बायोडाटा डाउनलोड करें (PDF)',
        pdfFallback: 'आपका ब्राउज़र पीडीएफ का समर्थन नहीं करता है।',
        pdfDownloadLink: 'इसके बजाय पीडीएफ डाउनलोड करें।'
      },
      services: {
        title: 'सेवाएँ',
        subtitle: 'मेरी सेवाएँ',
        inquireBtn: 'व्हाट्सएप पर पूछताछ करें',
        cards: [
          {
            title: 'एसईओ और विकास रणनीति',
            desc: 'विषय क्लस्टर संरचना, कीवर्ड-लक्षित सामग्री रणनीतियों, तकनीकी साइट ऑडिट (सेमरश/अह्रेफ्स), और गूगल सर्च कंसोल इंडेक्सिंग के माध्यम से डेटा-संचालित ऑर्गेनिक खोज वृद्धि।'
          },
          {
            title: 'वेब प्रबंधन और गति',
            desc: 'पूर्ण वेबसाइट प्रशासन, लैंडिंग पृष्ठ इंजीनियरिंग, लाइटस्पीड कैश कॉन्फ़िगरेशन और मोबाइल गति अनुकूलन—मोबाइल पेजस्पीड को 54 से 94+ तक बढ़ाना।'
          },
          {
            title: 'क्रिएटिव निर्देशन और ब्रांडिंग',
            desc: 'व्यापक ब्रांड पहचान प्रणालियाँ, उच्च-परिवर्तनीय सोशल मीडिया क्रिएटिव्स, लिंक्डइन हिंडोला डेक, उत्पाद पैकेजिंग, और आधुनिक दृश्य ब्रांडिंग।'
          },
          {
            title: 'एचआर संचालन और नेतृत्व',
            desc: 'परिचालन नेतृत्व, चुस्त टीम निगरानी, स्वचालित उपस्थिति और अवकाश प्रबंधन, प्रशिक्षु ऑनबोर्डिंग, भर्ती वर्कफ़्लो, और सुव्यवस्थित कार्यालय प्रशासन।'
          },
          {
            title: 'बी2बी व्यवसाय विकास',
            desc: 'प्रत्यक्ष ग्राहक अधिग्रहण, उच्च-परिवर्तनीय अपवर्क प्रस्ताव इंजीनियरिंग, मार्केटप्लेस रणनीति (फाइव्हर और कोडकैनियन), प्रतिस्पर्धी बाजार विश्लेषण, और मेटा विज्ञापन प्रबंधन।'
          },
          {
            title: 'मल्टीमीडिया और वीडियो निर्माण',
            desc: 'उच्च-रिज़ॉल्यूशन 2K उत्पाद सुविधा वॉकथ्रू, ओबीएस और ऑडेसिटी के साथ सॉफ्टवेयर डेमो रिकॉर्डिंग, प्रचारक वीडियो विज्ञापन, और सम्मोहक मल्टीमीडिया स्टोरीटेलिंग।'
          }
        ]
      },
      portfolio: {
        title: 'पोर्टफोलियो',
        subtitle: 'मेरा पोर्टफोलियो',
        labelCategory: 'श्रेणी:',
        labelClient: 'ग्राहक:',
        labelProjectDate: 'परियोजना तिथि:',
        labelProjectUrl: 'परियोजना लिंक:',
        labelTools: 'उपकरण:',
        btnViewDoc: 'दस्तावेज़ देखें',
        items: {
          p1: {
            title: 'एंटरप्राइज वेब अनुकूलन और प्रदर्शन',
            desc: 'उच्च-विकास सॉफ्टवेयर प्लेटफॉर्म के लिए तकनीकी वेबसाइट अनुकूलन और लाइटस्पीड कैशिंग। मोबाइल गति सफलतापूर्वक 54 से 94 तक बढ़ाई गई।',
            category: 'वेब प्रबंधन और एसईओ'
          },
          p2: {
            title: 'यूट्यूब इंट्रो',
            desc: 'ऑफेंसिव राइनो यूट्यूब इंट्रो वीडियो।',
            category: '3डी एनिमेशन'
          },
          p3: {
            title: 'वीएफएक्स (VFX)',
            desc: 'इस वीडियो में लेम्बोर्गिनी वीएफएक्स का हिस्सा है।',
            category: 'वीएफएक्स'
          },
          p4: {
            title: 'ऑफेंसिव राइनो मार्च',
            desc: 'ऑफेंसिव राइनो ब्रांडिंग के साथ 3डी वॉकिंग टी-शर्ट एनिमेशन।',
            category: 'उत्पाद विज्ञापन'
          },
          p5: {
            title: '3डी एनिमेशन',
            desc: '3डी एनिमेशन में मेरे द्वारा की गई अब तक की सबसे बड़ी और महत्वाकांक्षी परियोजना।',
            category: '3डी एनिमेशन'
          }
        }
      },
      contact: {
        title: 'संपर्क',
        subtitle: 'मुझसे संपर्क करें',
        addressTitle: 'मेरा पता',
        addressVal: 'ढाका, बांग्लादेश',
        socialTitle: 'सोशल प्रोफाइल',
        emailTitle: 'मुझे ईमेल करें',
        callTitle: 'मुझे कॉल करें',
        placeholderName: 'आपका नाम',
        placeholderEmail: 'आपका ईमेल',
        placeholderSubject: 'विषय',
        placeholderMessage: 'संदेश',
        btnSend: 'संदेश भेजें',
        msgSending: 'भेजा जा रहा है...',
        msgSent: 'आपका संदेश सीधे हमीम को भेज दिया गया है! धन्यवाद।',
        whatsappTooltip: 'व्हाट्सएप पर चैट करें'
      },
      credits: {
        author: 'लेखक से मिलें',
        policy: 'गोपनीयता नीति',
        settings: 'कुकी और भाषा सेटिंग्स'
      }
    }
  };

  class SiteI18nManager {
    constructor() {
      this.currentLang = 'en';
      this.catalog = SITE_I18N;
    }

    getLanguage() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.catalog[urlLang]) return urlLang;
      } catch (e) {}

      const saved = localStorage.getItem('hamilio_user_lang');
      if (saved && this.catalog[saved]) return saved;
      return 'en';
    }

    applyLanguage(langCode, persist = true) {
      if (!this.catalog[langCode]) {
        langCode = 'en';
      }
      this.currentLang = langCode;
      if (persist) {
        localStorage.setItem('hamilio_user_lang', langCode);
      }

      const t = this.catalog[langCode];

      // 1. Document Direction & Language
      document.documentElement.lang = langCode;
      document.documentElement.setAttribute('xml:lang', langCode);
      const isRtl = t.dir === 'rtl';
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

      if (isRtl) {
        document.body.classList.add('rtl-mode');
      } else {
        document.body.classList.remove('rtl-mode');
      }

      // Sync Cookie Popup Language Select
      const langSelect = document.getElementById('cookie-lang-select');
      if (langSelect && langSelect.value !== langCode) {
        langSelect.value = langCode;
      }

      // 2. Navigation Menu
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
          document.querySelectorAll(`.nav-menu a[href="${hash}"], .mobile-nav a[href="${hash}"]`).forEach(a => {
            a.textContent = label;
          });
        });
      }

      // 3. Hero Section
      if (t.hero) {
        const heroH2 = document.querySelector('#header h2');
        if (heroH2) {
          heroH2.innerHTML = `${t.hero.iam} <span class="hero-focus-title">${t.hero.title}</span> ${t.hero.atCompany}`;
        }
        const taglineEl = document.querySelector('#header .hero-tagline') || document.querySelector('#hero-tagline-text');
        if (taglineEl) {
          taglineEl.textContent = t.hero.tagline;
        }
      }

      // 4. About Section
      if (t.about) {
        const abTitle = document.querySelector('#about .section-title h2');
        if (abTitle) abTitle.textContent = t.about.title;
        const abSub = document.querySelector('#about .section-title p');
        if (abSub) abSub.textContent = t.about.subtitle;

        const headlineEl = document.querySelector('#about .about-me .content h3');
        if (headlineEl) headlineEl.textContent = t.about.headline;

        const quoteEl = document.querySelector('#about .about-me .content p.font-italic');
        if (quoteEl) quoteEl.textContent = t.about.quote;

        // Labels & values
        const infoItems = document.querySelectorAll('#about .about-me .content .row ul li');
        infoItems.forEach(li => {
          const strong = li.querySelector('strong');
          if (!strong) return;
          const text = strong.textContent.trim().toLowerCase();
          if (text.startsWith('age') || text.startsWith('বয়স') || text.startsWith('edad') || text.startsWith('alter') || text.startsWith('âge') || text.startsWith('العمر') || text.startsWith('年齢') || text.startsWith('आयु')) {
            strong.textContent = t.about.labelAge + ' ';
          } else if (text.startsWith('web') || text.startsWith('ওয়েব') || text.startsWith('sitio') || text.startsWith('الموقع')) {
            strong.textContent = t.about.labelWebsite + ' ';
          } else if (text.startsWith('phone') || text.startsWith('ফোন') || text.startsWith('tel') || text.startsWith('الهاتف') || text.startsWith('電話') || text.startsWith('फ़ोन')) {
            strong.textContent = t.about.labelPhone + ' ';
          } else if (text.startsWith('city') || text.startsWith('শহর') || text.startsWith('ciudad') || text.startsWith('stadt') || text.startsWith('ville') || text.startsWith('المدينة') || text.startsWith('居住地') || text.startsWith('शहर')) {
            strong.textContent = t.about.labelCity + ' ';
            const span = li.querySelector('#about-city') || li.querySelector('span');
            if (span) span.textContent = t.about.valCity;
          } else if (text.startsWith('degree') || text.startsWith('ডিগ্রি') || text.startsWith('titul') || text.startsWith('abschluss') || text.startsWith('dipl') || text.startsWith('المؤهل') || text.startsWith('学位') || text.startsWith('डिग्री')) {
            strong.textContent = t.about.labelDegree + ' ';
            const span = li.querySelector('#about-degree') || li.querySelector('span');
            if (span) span.textContent = t.about.valDegree;
          } else if (text.startsWith('email') || text.startsWith('ইমেইল') || text.startsWith('correo') || text.startsWith('البريد') || text.startsWith('メール')) {
            strong.textContent = t.about.labelEmail + ' ';
          } else if (text.startsWith('freelance') || text.startsWith('ফ্রিল্যান্স') || text.startsWith('freiberuflich') || text.startsWith('العمل') || text.startsWith('フリーランス') || text.startsWith('फ्रीलांस')) {
            strong.textContent = t.about.labelFreelance + ' ';
            const span = li.querySelector('#about-freelance') || li.querySelector('span');
            if (span) span.textContent = t.about.valFreelance;
          }
        });

        const bioEl = document.getElementById('about-bio');
        if (bioEl) bioEl.textContent = t.about.bio;

        // Stats (Counts)
        const statBoxes = document.querySelectorAll('#about .counts .count-box p');
        if (statBoxes.length >= 4) {
          statBoxes[0].textContent = t.about.statClients;
          statBoxes[1].textContent = t.about.statProjects;
          statBoxes[2].textContent = t.about.statHours;
          statBoxes[3].textContent = t.about.statWorkers;
        }

        // Skills Section Title & Items
        const skillsTitleEl = document.querySelector('#about .skills .section-title h2');
        if (skillsTitleEl) skillsTitleEl.textContent = t.about.skillsTitle;

        const skillSpans = document.querySelectorAll('#dynamic-skills-container .progress span.skill');
        const skillKeys = ['s1', 's2', 's3', 's4', 's5', 's6'];
        skillSpans.forEach((span, idx) => {
          const valEl = span.querySelector('.val');
          const valText = valEl ? valEl.textContent : '';
          const key = skillKeys[idx];
          if (key && t.about.skills[key]) {
            span.innerHTML = `${t.about.skills[key]} <i class="val">${valText}</i>`;
          }
        });

        // Interests Section Title & Items
        const intTitleEl = document.querySelector('#about .interests .section-title h2');
        if (intTitleEl) intTitleEl.textContent = t.about.interestsTitle;

        const intBoxes = document.querySelectorAll('#about .interests .icon-box h3');
        const intKeys = ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'i12'];
        intBoxes.forEach((h3, idx) => {
          const key = intKeys[idx];
          if (key && t.about.interests[key]) {
            h3.textContent = t.about.interests[key];
          }
        });

        // Testimonials
        const testTitleEl = document.querySelector('#about .testimonials .section-title h2');
        if (testTitleEl) testTitleEl.textContent = t.about.testimonialsTitle;

        const testItems = document.querySelectorAll('#about .testimonials .testimonial-item');
        testItems.forEach((item, idx) => {
          const data = t.about.testimonials[idx];
          if (!data) return;
          const p = item.querySelector('p');
          if (p) {
            p.innerHTML = `<i class="bx bxs-quote-alt-left quote-icon-left"></i> ${data.quote} <i class="bx bxs-quote-alt-right quote-icon-right"></i>`;
          }
          const h4 = item.querySelector('h4');
          if (h4) h4.textContent = data.role;
        });
      }

      // 5. Resume Section
      if (t.resume) {
        const resTitle = document.querySelector('#resume .section-title h2');
        if (resTitle) resTitle.textContent = t.resume.title;
        const resSub = document.querySelector('#resume .section-title p');
        if (resSub) resSub.textContent = t.resume.subtitle;

        const dlBtn = document.querySelector('#resume .resume-download-btn');
        if (dlBtn) {
          dlBtn.innerHTML = `<i class="icofont-download" aria-hidden="true"></i> ${t.resume.downloadBtn}`;
        }
      }

      // 6. Services Section
      if (t.services) {
        const srvTitle = document.querySelector('#services .section-title h2');
        if (srvTitle) srvTitle.textContent = t.services.title;
        const srvSub = document.querySelector('#services .section-title p');
        if (srvSub) srvSub.textContent = t.services.subtitle;

        const canonicalTitles = [
          'SEO & Growth Strategy',
          'Web Management & Speed',
          'Creative Direction & Branding',
          'HR Operations & Leadership',
          'B2B Business Development',
          'Multimedia & Video Production'
        ];

        const srvCards = document.querySelectorAll('#dynamic-services-container .icon-box');
        srvCards.forEach((card, idx) => {
          const cardData = t.services.cards[idx];
          if (!cardData) return;
          const h4Link = card.querySelector('h4 a');
          if (h4Link) h4Link.textContent = cardData.title;
          const p = card.querySelector('p');
          if (p) p.textContent = cardData.desc;

          // Keep WhatsApp preset inquiry link aligned
          const englishTitle = canonicalTitles[idx] || (window.SiteI18n.translations.en.services.cards[idx] ? window.SiteI18n.translations.en.services.cards[idx].title : cardData.title);
          const waMsg = `I am interested in your ${englishTitle} Service. When can we start?`;
          const waUrl = `https://wa.me/8801755069752?text=${encodeURIComponent(waMsg)}`;

          if (h4Link) {
            h4Link.href = waUrl;
            h4Link.target = '_blank';
            h4Link.rel = 'noopener noreferrer';
          }

          const waBtn = card.querySelector('.service-wa-btn');
          if (waBtn) {
            waBtn.href = waUrl;
            const btnSpan = waBtn.querySelector('.service-btn-text');
            if (btnSpan && t.services.inquireBtn) {
              btnSpan.textContent = t.services.inquireBtn;
            }
          }

          card.setAttribute('data-wa-url', waUrl);
        });
      }

      // 7. Portfolio Section
      if (t.portfolio) {
        const portTitle = document.querySelector('#portfolio .section-title h2');
        if (portTitle) portTitle.textContent = t.portfolio.title;
        const portSub = document.querySelector('#portfolio .section-title p');
        if (portSub) portSub.textContent = t.portfolio.subtitle;

        const pKeys = ['p1', 'p2', 'p3', 'p4', 'p5'];
        pKeys.forEach((key) => {
          const row = document.getElementById(`portfolio-${key}`);
          if (!row) return;
          const itemData = t.portfolio.items[key];
          if (!itemData) return;

          const h3 = row.querySelector('.content h3');
          if (h3) h3.textContent = itemData.title;

          const pDesc = row.querySelector('.content p.font-italic');
          if (pDesc) pDesc.textContent = itemData.desc;

          // Update Category inside list
          const lis = row.querySelectorAll('.content ul li');
          lis.forEach(li => {
            const strong = li.querySelector('strong');
            if (!strong) return;
            const text = strong.textContent.trim().toLowerCase();
            if (text.startsWith('category') || text.startsWith('ক্যাটাগরি') || text.startsWith('categoría') || text.startsWith('kategorie') || text.startsWith('catégorie') || text.startsWith('الفئة') || text.startsWith('カテゴリー') || text.startsWith('श्रेणी')) {
              strong.textContent = t.portfolio.labelCategory + ' ';
              li.innerHTML = `<strong>${t.portfolio.labelCategory}</strong> ${itemData.category}`;
            } else if (text.startsWith('client') || text.startsWith('ক্লায়েন্ট') || text.startsWith('cliente') || text.startsWith('kunde') || text.startsWith('العميل') || text.startsWith('クライアント') || text.startsWith('ग्राहक')) {
              strong.textContent = t.portfolio.labelClient + ' ';
            } else if (text.startsWith('project date') || text.startsWith('তারিখ') || text.startsWith('fecha') || text.startsWith('datum') || text.startsWith('date') || text.startsWith('التاريخ') || text.startsWith('制作日') || text.startsWith('परियोजना')) {
              strong.textContent = t.portfolio.labelProjectDate + ' ';
            } else if (text.startsWith('project url') || text.startsWith('প্রকল্প') || text.startsWith('url') || text.startsWith('رابط') || text.startsWith('プロジェクト') || text.startsWith('परियोजना')) {
              strong.textContent = t.portfolio.labelProjectUrl + ' ';
            } else if (text.startsWith('tools') || text.startsWith('টুলস') || text.startsWith('herramientas') || text.startsWith('werkzeuge') || text.startsWith('outils') || text.startsWith('الأدوات') || text.startsWith('使用') || text.startsWith('उपकरण')) {
              strong.textContent = t.portfolio.labelTools + ' ';
            }
          });
        });
      }

      // 8. Contact Section
      if (t.contact) {
        const conTitle = document.querySelector('#contact .section-title h2');
        if (conTitle) conTitle.textContent = t.contact.title;
        const conSub = document.querySelector('#contact .section-title p');
        if (conSub) conSub.textContent = t.contact.subtitle;

        // Info Boxes
        const infoBoxes = document.querySelectorAll('#contact .info-box');
        if (infoBoxes.length >= 4) {
          // Box 1: Address
          const h3_0 = infoBoxes[0].querySelector('h3');
          if (h3_0) h3_0.textContent = t.contact.addressTitle;
          const p_0 = infoBoxes[0].querySelector('p');
          if (p_0) p_0.textContent = t.contact.addressVal;

          // Box 2: Social
          const h3_1 = infoBoxes[1].querySelector('h3');
          if (h3_1) h3_1.textContent = t.contact.socialTitle;

          // Box 3: Email
          const h3_2 = infoBoxes[2].querySelector('h3');
          if (h3_2) h3_2.textContent = t.contact.emailTitle;

          // Box 4: Call
          const h3_3 = infoBoxes[3].querySelector('h3');
          if (h3_3) h3_3.textContent = t.contact.callTitle;
        }

        // Form inputs and button
        const inputName = document.querySelector('form.php-email-form input[name="name"]');
        if (inputName) inputName.placeholder = t.contact.placeholderName;

        const inputEmail = document.querySelector('form.php-email-form input[name="email"]');
        if (inputEmail) inputEmail.placeholder = t.contact.placeholderEmail;

        const inputSubject = document.querySelector('form.php-email-form input[name="subject"]');
        if (inputSubject) inputSubject.placeholder = t.contact.placeholderSubject;

        const inputMessage = document.querySelector('form.php-email-form textarea[name="message"]');
        if (inputMessage) inputMessage.placeholder = t.contact.placeholderMessage;

        const btnSend = document.querySelector('form.php-email-form button[type="submit"]');
        if (btnSend) btnSend.textContent = t.contact.btnSend;

        const loadingMsg = document.querySelector('form.php-email-form .loading');
        if (loadingMsg) loadingMsg.textContent = t.contact.msgSending;

        const sentMsg = document.querySelector('form.php-email-form .sent-message');
        if (sentMsg) sentMsg.textContent = t.contact.msgSent;

        // WhatsApp action tooltip
        const waTooltip = document.querySelector('.whatsapp-tooltip');
        if (waTooltip) waTooltip.textContent = t.contact.whatsappTooltip;
      }

      // 9. Credits
      if (t.credits) {
        const creditsDiv = document.querySelector('.credits');
        if (creditsDiv) {
          const policyLink = document.getElementById('open-privacy-policy-link');
          if (policyLink) policyLink.textContent = t.credits.policy;

          const cookieLink = document.getElementById('open-cookie-preferences-link');
          if (cookieLink) cookieLink.textContent = t.credits.settings;

          const authorLink = creditsDiv.querySelector('a[href*="github.com"]');
          if (authorLink && creditsDiv.firstChild) {
            creditsDiv.childNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('Meet the Author')) {
                node.textContent = `${t.credits.author} `;
              } else if (node.nodeType === Node.TEXT_NODE && (node.textContent.includes('লেখক') || node.textContent.includes('Conoce al') || node.textContent.includes('Über den') || node.textContent.includes('Rencontrez') || node.textContent.includes('عن المطور') || node.textContent.includes('製作者') || node.textContent.includes('लेखक'))) {
                node.textContent = `${t.credits.author} `;
              }
            });
          }
        }
      }

      // Notify other listeners (visitor tracker, dynamic renderer)
      window.dispatchEvent(new CustomEvent('siteLanguageChanged', { detail: { lang: langCode } }));
    }

    reapplyCurrentLanguage() {
      this.applyLanguage(this.getLanguage(), false);
    }
  }

  window.SiteI18n = new SiteI18nManager();

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.SiteI18n.applyLanguage(window.SiteI18n.getLanguage(), false);
    });
  } else {
    window.SiteI18n.applyLanguage(window.SiteI18n.getLanguage(), false);
  }
})();
