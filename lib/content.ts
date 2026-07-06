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
  // Scrise pe tema Luceafărului. Schimbă datele/textele cu amintirile voastre reale.
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
      date: "Prima privire",
      title: "Te-am recunoscut",
      text: "Nu știam nimic despre tine, dar ceva în mine te aștepta deja de mult.",
    },
    {
      x: 0.32,
      y: 0.58,
      date: "Prima noapte de vorbe",
      title: "Până în zori",
      text: "Am vorbit până s-au stins stelele și tot mi-a părut prea puțin.",
    },
    {
      x: 0.84,
      y: 0.52,
      date: "Primul „te iubesc”",
      title: "Două cuvinte",
      text: "Le-am spus cu jumătate de gură și cu toată inima deodată.",
    },
    {
      x: 0.5,
      y: 0.36,
      date: "Zilele grele",
      title: "Am rămas",
      text: "Au fost și nori pe cerul nostru. Te-am ales de fiecare dată, și-n furtună.",
    },
    {
      x: 0.6,
      y: 0.76,
      date: "Azi",
      title: "Aici, cu tine",
      text: "Sub același cer, cu o poveste care abia și-a desenat conturul.",
    },
  ],

  lock: {
    // Adaugă oricâte întrebări vrei în acest array — se deblochează pe rând,
    // în ordinea de mai jos. Exemplu pentru a doua întrebare (necomentează
    // și completează cu răspunsul real când ești gata):
    //
    // {
    //   question: "A doua întrebare a ta aici?",
    //   answers: ["răspuns", "variantă fără diacritice"],
    //   encouragement: "Mai încearcă, o știi tu.",
    // },
    questions: [
      {
        question: "Cum îmi spui tu mie când nimeni nu aude?",
        // Verificarea ignoră majusculele/spațiile; acceptăm și varianta fără diacritice.
        answers: ["puta", "puța", "puță"],
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
  },

  letter: {
    greeting: "Draga mea Ariana,",
    paragraphs: [
      "Povestea a început ca-n Luceafărul: o fată prea frumoasă și o stea care o privea de departe. Diferența e că eu n-am vrut să rămân o stea rece pe cer.",
      "Dacă ai ajuns până aici, înseamnă că ai unit toate punctele — exact cum ai făcut cu viața mea, fără să-ți dai seama.",
      "Eminescu i-a dat luceafărului nemurirea, dar l-a lăsat singur. Eu aleg altfel: mai bine muritor, dar cu tine.",
      "Tot ce a fost până acum a fost doar conturul. De aici încolo, desenăm restul.",
    ],
    signature: "Al tău luceafăr, dar de data asta rămas lângă tine",
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
