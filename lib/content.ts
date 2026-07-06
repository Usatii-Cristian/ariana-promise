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
    /** Textul scris literă-cu-literă. */
    intro: string;
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

  /** ETAPA 4 — lacătul personal. */
  lock: {
    /** Întrebarea la care doar ea știe răspunsul. */
    question: string;
    /**
     * Răspunsul corect. Verificarea ignoră majuscule/minuscule și spațiile
     * de la capete. Poți pune mai multe variante acceptate.
     */
    answers: string[];
    /** Placeholder-ul din câmpul de text. */
    placeholder: string;
    /** Mesajul cald când răspunsul e greșit (fără presiune). */
    encouragement: string;
    /** Butonul discret care apare după 3 încercări. */
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
};

export const content: Content = {
  herName: "Ariana",

  awaken: {
    intro:
      "Sub cerul ăsta sunt puncte care, unite, spun povestea noastră.",
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
      date: "Prima dată",
      title: "Când te-am văzut",
      text: "Nu știam încă nimic, dar ceva în mine a recunoscut ceva în tine.",
    },
    {
      x: 0.72,
      y: 0.19,
      date: "Prima discuție",
      title: "Până în zori",
      text: "Am vorbit ore în șir și tot mi se părea că n-am apucat să-ți spun nimic.",
    },
    {
      x: 0.32,
      y: 0.58,
      date: "Primul da",
      title: "Noi doi",
      text: "Din ziua aia, „eu” a început să sune ciudat fără „tu” lângă el.",
    },
    {
      x: 0.84,
      y: 0.52,
      date: "Prima călătorie",
      title: "Departe, împreună",
      text: "Oriunde mergeam, tu erai partea de „acasă” pe care o luam cu mine.",
    },
    {
      x: 0.5,
      y: 0.36,
      date: "Zilele grele",
      title: "Am rămas",
      text: "Am trecut și prin furtuni, și tot pe tine te-am ales, de fiecare dată.",
    },
    {
      x: 0.6,
      y: 0.76,
      date: "Azi",
      title: "Aici, acum",
      text: "Și uite-ne, sub același cer, cu o poveste care abia începe.",
    },
  ],

  lock: {
    question: "Cum îmi spui tu mie când nimeni nu aude?",
    answers: ["ursulețul meu"],
    placeholder: "scrie aici…",
    encouragement: "Mai încearcă, o știi tu.",
    skip: "Sari peste",
  },

  reveal: {
    // Data de când sunteți împreună (8 octombrie 2025).
    startDate: { year: 2025, month: 10, day: 8 },
    counterLabel: "Împreună de",
    promise:
      "Îți promit că, indiferent câte stele vom mai număra, pe tine te aleg în fiecare noapte.",
  },

  letter: {
    greeting: "Draga mea Ariana,",
    paragraphs: [
      "Dacă ai ajuns până aici, înseamnă că ai unit toate punctele — exact cum ai făcut cu viața mea, fără să-ți dai seama.",
      "Nu-ți promit un cer fără nori. Îți promit că, sub orice cer, o să caut mereu mâna ta ca să-l privim împreună.",
      "Tot ce a fost până acum a fost doar conturul. De aici încolo, desenăm restul.",
    ],
    signature: "Al tău, mereu",
    restart: "Revezi cerul",
  },

  audio: {
    on: "Pornește muzica",
    off: "Oprește muzica",
  },
};
