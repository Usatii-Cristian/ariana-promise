/**
 * ┌───────────────────────────────────────────────────────────────────┐
 * │  CONSTELAȚIA NOASTRĂ — SINGURUL FIȘIER PE CARE ÎL EDITEZI          │
 * │                                                                     │
 * │  Aici pui: numele ei, data de început, cele 6 momente,             │
 * │  întrebarea personală + răspunsul, mesajul de promise și scrisoarea.│
 * │  Nu trebuie să atingi niciun alt fișier.                            │
 * └───────────────────────────────────────────────────────────────────┘
 */

export type Moment = {
  /** Poziția stelei pe cer, normalizată 0..1 (x = stânga→dreapta, y = sus→jos). */
  x: number;
  y: number;
  /** Data momentului, afișată în cărticică (ex. "12 august 2022"). */
  date: string;
  /** Titlul scurt al momentului. */
  title: string;
  /** 1–2 propoziții despre acel moment. */
  text: string;
};

export type Content = {
  /** Numele persoanei căreia îi este dedicată experiența. */
  herName: string;

  /** ETAPA 1 — cerul se trezește. */
  awaken: {
    /**
     * Versurile de deschidere (Luceafărul), afișate vers-cu-vers pe cer.
     * Un rând gol ("") = pauză între strofe.
     */
    poem: string[];
    /** Atribuirea de sub poem. */
    attribution: string;
    /** Puntea personalizată către Ariana, scrisă literă-cu-literă. */
    bridge: string;
    /** Butonul care deschide harta stelelor. */
    cta: string;
  };

  /** ETAPA 2 — instrucțiunea fixă de jos. */
  map: {
    hint: string;
  };

  /**
   * ETAPA 2/3 — cele 6 momente = cele 6 stele.
   * Pune exact 6. Pozițiile (x,y) sunt deja distribuite frumos; le poți ajusta.
   */
  moments: Moment[];

  /** ETAPA 4 — lacătul personal: una sau mai multe întrebări, în ordine. */
  lock: {
    /**
     * Întrebările la care doar ea știe răspunsul, în ordinea în care apar.
     * Adaugă oricâte vrei — se deblochează una câte una.
     */
    questions: {
      /** Întrebarea afișată. */
      question: string;
      /**
       * Răspunsul corect. Verificarea ignoră majuscule/minuscule și spațiile
       * de la capete. Poți pune mai multe variante acceptate.
       */
      answers: string[];
      /** Mesajul cald când răspunsul e greșit (fără presiune). */
      encouragement: string;
    }[];
    /** Placeholder-ul din câmpul de text. */
    placeholder: string;
    /** Butonul discret care apare după prea multe încercări greșite. */
    skip: string;
  };

  /** ETAPA 5 — reveal-ul inelului. */
  reveal: {
    /** Data de la care se numără timpul împreună. Format: an, lună (1-12), zi. */
    startDate: { year: number; month: number; day: number };
    /** Eticheta de deasupra counter-ului. */
    counterLabel: string;
    /** Mesajul central de "promise". */
    promise: string;
    /**
     * Momentul-cheie: ea atinge inelul de pe ecran — semnalul perfect ca tu
     * să-i dai inelul real chiar atunci, în persoană.
     */
    physicalCue: {
      /** Îndemnul discret, pulsant, de sub inel. */
      prompt: string;
      /** Mesajul care apare după ce atinge inelul. */
      message: string;
    };
  };

  /** ETAPA 6 — scrisoarea finală. */
  letter: {
    /** Formula de început (ex. "Draga mea,"). */
    greeting: string;
    /** Paragrafele scrisorii. Fiecare element = un paragraf. */
    paragraphs: string[];
    /** Semnătura. */
    signature: string;
    /** Butonul care resetează experiența. */
    restart: string;
  };

  /** Buton de sunet ambiental (comută un pad discret generat în browser). */
  audio: {
    on: string;
    off: string;
  };

  /** Joc bonus, accesibil dintr-un buton pe scrisoarea finală. */
  bonusGame: {
    /** Butonul de pe scrisoare care deschide jocul. */
    cta: string;
    /** Instrucțiunea afișată sus, în timpul jocului. */
    instructions: string;
    /** Câte stele trebuie prinse ca să câștige. */
    target: number;
    /** Mesajul care apare după ce a prins toate stelele. */
    successMessage: string;
    /** Butonul de reîncepere a jocului. */
    playAgain: string;
    /** Butonul de închidere a jocului. */
    close: string;
  };
};

export const content: Content = {
  herName: "Ariana",

  awaken: {
    // Deschiderea Luceafărului — o stea îndrăgostită de o „prea frumoasă fată".
    poem: [
      "A fost odată ca-n poveşti,",
      "A fost ca niciodată,",
      "Din rude mari împărăteşti,",
      "O prea frumoasă fată.",
      "",
      "Şi era una la părinţi",
      "Şi mândră-n toate cele,",
      "Cum e Fecioara între sfinţi",
      "Şi luna între stele.",
    ],
    attribution: "— Mihai Eminescu, „Luceafărul”",
    bridge:
      "Iar „prea frumoasa fată” are un nume: Ariana. Sub cerul ăsta sunt puncte care, unite, spun povestea noastră.",
    cta: "Privește cerul",
  },

  map: {
    hint: "Atinge fiecare stea",
  },

  // ── CELE 6 MOMENTE ────────────────────────────────────────────────
  moments: [
    {
      x: 0.18,
      y: 0.24,
      date: "8 octombrie 2025",
      title: "Ziua zero",
      text: "Ziua în care povestea din Luceafăr a primit un nume: al tău.",
    },
    {
      x: 0.72,
      y: 0.19,
      date: "Prima întâlnire",
      title: "Ne era rușine să ne pupăm",
      text: "Am ieșit afară, ne era rușine să ne sărutăm și am stat doar două ore — tu, în șortul roz de Pikmi Pop.",
    },
    {
      x: 0.32,
      y: 0.58,
      date: "1 februarie",
      title: "Pe ascuns, cu flori și ciocolată",
      text: "Prima dată la tine acasă, pe furiș, după o ceartă — am venit cu flori și ciocolată, ca să știi că nu renunț.",
    },
    {
      x: 0.84,
      y: 0.52,
      date: "31 decembrie",
      title: "Cadoul neașteptat",
      text: "Ai ieșit total nepregătită, fără să te aștepți la nimic — și tocmai asta a făcut cadoul perfect.",
    },
    {
      x: 0.5,
      y: 0.36,
      date: "Zilele noastre de naștere",
      title: "Sărbătorite împreună",
      text: "Am petrecut zilele noastre de naștere unul lângă altul — cele mai bune cadouri nu se despachetează.",
    },
    {
      x: 0.6,
      y: 0.76,
      date: "Când erai bolnavă",
      title: "Ciocolată și bilețele",
      text: "Când stăteai acasă bolnavă, îți lăsam mici surprize — ciocolată și bilețele, ca să știi că sunt cu tine chiar și de departe.",
    },
  ],

  lock: {
    // Adaugă oricâte întrebări vrei în acest array — se deblochează pe rând,
    // în ordinea de mai jos.
    questions: [
      {
        question: "Cum îmi spui tu mie când nimeni nu aude?",
        // Verificarea ignoră majusculele/spațiile; acceptăm și varianta fără diacritice.
        answers: ["puta", "puța", "puță"],
        encouragement: "Mai încearcă, o știi tu.",
      },
      {
        question: "Care e bomboana mea preferată?",
        answers: ["toate"],
        encouragement: "Mai încearcă, o știi tu.",
      },
      {
        question: "Când ne-am pus împreună?",
        answers: ["8 octombrie 2025", "8 octombrie", "8.10.2025", "08.10.2025"],
        encouragement: "Mai încearcă, o știi tu.",
      },
      {
        question: "Ce fac mereu când vrei să închizi apelul?",
        answers: ["intind timpul", "întind timpul"],
        encouragement: "Mai încearcă, o știi tu.",
      },
      {
        question: "Care e fraza mea preferată înainte să închidem apelul?",
        answers: ["te iubesc extrem de mult"],
        encouragement: "Mai încearcă, o știi tu.",
      },
      {
        question: "Câți pești am în acvariu?",
        answers: ["nu stiu", "nu știu"],
        encouragement: "Mai încearcă, o știi tu.",
      },
      {
        question: "Care e peștele meu preferat?",
        answers: ["al tau albastru", "al tău albastru", "albastru"],
        encouragement: "Mai încearcă, o știi tu.",
      },
      {
        question: "Care e mâncarea mea preferată?",
        answers: ["toate"],
        encouragement: "Mai încearcă, o știi tu.",
      },
      {
        question: "Care e băutura mea preferată?",
        answers: ["soc"],
        encouragement: "Mai încearcă, o știi tu.",
      },
    ],
    placeholder: "scrie aici…",
    skip: "Sari peste",
  },

  reveal: {
    // Data de când sunteți împreună (8 octombrie 2025).
    startDate: { year: 2025, month: 10, day: 8 },
    counterLabel: "Împreună de",
    promise:
      "Luceafărul a ales cerul și a rămas singur. Eu te aleg pe tine — și-ți promit că, oricâte stele vom mai număra, cobor din cer în fiecare noapte pentru tine.",
    physicalCue: {
      prompt: "Atinge inelul",
      message: "Acesta e doar semnul. Cel adevărat e chiar acum lângă tine.",
    },
  },

  letter: {
    greeting: "Draga mea Ariana, 🤍",
    paragraphs: [
      "Povestea a început ca-n Luceafărul 🌠: o fată prea frumoasă și o stea care o privea de departe. Diferența e că eu n-am vrut să rămân o stea rece pe cer — am vrut să cobor, să te ating, să te simt reală. 💫",
      "Dacă ai ajuns până aici, înseamnă că ai unit toate punctele — exact cum ai făcut cu viața mea, fără să-ți dai seama. 🌌 Fiecare stea de pe cerul ăsta e un pic din inima mea, pusă acolo pentru tine.",
      "Eminescu i-a dat luceafărului nemurirea, dar l-a lăsat singur, rece, departe. Eu aleg altfel: mai bine muritor, dar cu tine — cu mâna ta în mâna mea, cu inima ta lângă inima mea. ❤️‍🔥",
      "Tot ce a fost până acum a fost doar conturul. De aici încolo, desenăm restul — împreună, cu tot ce avem, pentru totdeauna. 💍✨",
    ],
    signature: "Al tău luceafăr, rămas lângă tine pentru totdeauna 🌙❤️",
    restart: "Revezi cerul",
  },

  audio: {
    on: "Pornește muzica",
    off: "Oprește muzica",
  },

  bonusGame: {
    cta: "Un mic joc pentru tine ✦",
    instructions: "Prinde stelele căzătoare",
    target: 12,
    successMessage: "Le-ai prins pe toate — exact cum m-ai prins și pe mine.",
    playAgain: "Joacă din nou",
    close: "Închide",
  },
};
