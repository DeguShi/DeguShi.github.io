// Everything the terminal knows. Edit this file to change the site's content.

export const PROFILE = {
  name: "felipe azambuja",
  line: "computer science @ usp  ·  são carlos, br",
  about: [
    "CS undergrad at the University of São Paulo (ICMC-USP).",
    "I split my time between research and building things, and I like both about equally.",
    "",
    "research   object-centric world models for embodied agents (visiting, Aalto Robot Learning Lab)",
    "           LLM agents + GNNs + SEIR for epidemic early warning (FAPESP, ICMC-USP)",
    "building   products, web and mobile apps, and the tools I wish existed",
  ],
  contact: [
    ["github", "https://github.com/DeguShi"],
    ["linkedin", "https://www.linkedin.com/in/azambuja-felipe"],
    ["email", "mailto:felipe.azamba@usp.br"],
  ],
};

const gh = (repo) => ({
  label: `github.com/${repo}`,
  url: `https://github.com/${repo}`,
});

// area: research | building | class | collab | stealth  (drives colours)
export const PROJECTS = [
  {
    path: "research/ULRMEEUD",
    area: "research",
    year: 2025,
    private: true,
    title: "ULRMEEUD",
    oneliner:
      "unsupervised learning of risk matrices for epidemic events from unstructured data",
    about: [
      "Autonomous LLM agents read open web sources and extract epidemiological risk events.",
      "Events become temporal and geographic graphs; GNNs estimate contextual risk.",
      "Learned risk signals feed time-varying SEIR models for outbreak simulation and early alerts.",
    ],
    stack: ["Python", "PyTorch", "PyG", "LLM agents", "SEIR"],
    role: "FAPESP undergraduate research · Computational Intelligence Lab (LABIC), ICMC-USP",
  },
  {
    path: "research/Slt-Att-Le-WM",
    area: "research",
    year: 2026,
    private: true,
    title: "Slt-Att-Le-WM",
    oneliner: "object-centric world models for embodied agents",
    about: [
      "Object-centric representation learning combined with world models for embodied agents.",
      "Controlled experiments spanning 135,000 simulated episode evaluations.",
      "Found a configuration lifting task success from 69.0% to 78.4% (+9.4 pp) over 100 seeds.",
    ],
    stack: ["Python", "PyTorch", "PyTorch Lightning", "world models"],
    role: "visiting researcher (remote) · Aalto Robot Learning Lab",
  },
  {
    path: "building/what-manga",
    area: "building",
    year: 2025,
    title: "What-Manga",
    oneliner:
      "tracker for a manga and light novel list too big to enter by hand",
    about: [
      "Started because my reading list was too large to add to MyAnimeList manually.",
      "Web: parser for a custom .txt notation plus CSV, preview before commit, quick +1/-1 edits.",
      "Android: offline-first port with Room, Jetpack Compose, CSV import/export.",
      "Optional Google Drive backup (OAuth 2.0); APK published in Releases.",
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "Prisma",
      "PostgreSQL",
      "Kotlin",
      "Jetpack Compose",
      "Room",
    ],
    links: [gh("DeguShi/What-Manga"), gh("DeguShi/What-Manga-APP")],
  },
  {
    path: "building/habitacion",
    area: "building",
    year: 2025,
    title: "Habitacion",
    oneliner:
      "mobile-first reservation manager for my mom's guest room business",
    about: [
      "Replaces paper notebooks and spreadsheets for guest bookings.",
      "Flow: request → confirm (dates, pricing, payments) → checkout → review.",
      "Occupancy calendar, contact search, CSV/NDJSON export and restore.",
      "Generates shareable 1080×1920 confirmation cards; Google sign-in allowlist.",
    ],
    stack: ["TypeScript", "Next.js 14", "NextAuth", "Vercel"],
    links: [gh("DeguShi/Habitacion-Management")],
  },
  {
    path: "building/organisiani",
    area: "building",
    year: 2026,
    private: true,
    title: "Organisiani",
    oneliner: "an app to make my mom's work routine easier",
    about: ["A second tool for my mom's day-to-day work, after Habitacion."],
    stack: ["TypeScript"],
  },
  {
    path: "building/collab/vote-consciente",
    area: "collab",
    year: 2026,
    title: "Vote Consciente",
    oneliner: "track how brazilian federal deputies vote, spend and propose",
    about: [
      "Pulls official Chamber of Deputies open data: votes, bills, expenses, committees.",
      "'Meu Match' scores your agreement with each deputy on real bills.",
      "Only definitive vote results count; nothing is estimated to fill gaps.",
    ],
    stack: ["TypeScript", "Next.js", "Prisma", "PostgreSQL", "Tailwind"],
    role: "main contributor (46 of 50 commits): front-end, match feature, auth, vote-seeding fixes",
    links: [gh("JuliaOrlando/vote-consciente")],
  },
  {
    path: "building/collab/agents4gov",
    area: "collab",
    year: 2025,
    title: "Agents4Gov",
    oneliner: "local-LLM tools for public sector services · LABIC",
    about: [
      "LABIC (ICMC-USP) project: LLM-based tools for government use.",
      "Focus on local LLMs, data anonymization and tool evaluation; tools run inside Open WebUI.",
    ],
    stack: ["Python", "Open WebUI", "LLMs", "Docker"],
    role: "added a SEIR epidemiological simulator tool, its docs and dependencies",
    links: [gh("Labic-ICMC-USP/agents4gov")],
  },
  {
    path: "building/collab/naja",
    area: "collab",
    year: 2025,
    title: "Naja",
    oneliner:
      "snake game grown collaboratively as an open-source course exercise",
    about: [
      "Python snake game (formerly KobraPy) built by students through issues and PRs.",
      "Teaches open-source workflow: CI, linting, pre-commit, code review.",
    ],
    stack: ["Python", "pygame", "uv", "GitHub Actions"],
    role: "10 PRs: speed-up on eating, customization menu, moving-apple and cheese modes, autoplay, win screen, sprites",
    links: [gh("fossguild/naja"), gh("DeguShi/naja_old")],
  },
  {
    path: "building/class/orquidea",
    area: "class",
    year: 2025,
    private: true,
    title: "Orquidea",
    oneliner: "researcher analytics interface",
    about: [
      "Searches, aggregates and compares academic metadata through the ORCID and OpenAlex APIs.",
    ],
    stack: ["ORCID API", "OpenAlex API"],
  },
  {
    path: "building/class/angelin-htr",
    area: "class",
    year: 2026,
    title: "HTR for a 19th-century law register",
    oneliner:
      "handwritten text recognition for são carlos' 1892–1894 law register",
    about: [
      "Reads the Livro de Registro de Leis nº 1 (1892–1894) of the São Carlos city council.",
      "Kraken recognizer fine-tuned on 2,425 aligned lines; runs locally, no API.",
      "Post-correction: period dictionary + CTC rescoring + Viterbi over word trigrams.",
      "Config chosen by conditional greedy search (~2,300 evals, 92 h of compute).",
      "Held-out WER 64.57% → 18.74%, CER 21.71% → 4.43%. Paper in pt-BR.",
    ],
    stack: ["Python", "Kraken", "PyTorch", "n-gram LM"],
    role: "started as the OCR part of SCC0287 with Fundação Pró-Memória de São Carlos; top contributor to the team repo",
    links: [
      gh("DeguShi/OCR-pipeline-historical-data"),
      gh("fabiolobato/hackathon_ocr_historico"),
    ],
  },
  {
    path: "building/class/ai-notebooks",
    area: "class",
    year: 2025,
    title: "AI notebooks",
    oneliner: "notebooks from AI classes and personal experiments",
    about: [
      "A* search for a drone, crime data analysis, classic models vs MLP for engagement prediction,",
      "unsupervised semantic clustering, and a copilot agent for drafting social media posts.",
    ],
    stack: ["Python", "Jupyter"],
    links: [gh("DeguShi/AI-notebooks")],
  },
  {
    path: "building/class/roshi-island",
    area: "class",
    year: 2026,
    title: "Master Roshi's Island",
    oneliner:
      "explorable OpenGL scene, then lit and shadowed (computer graphics)",
    about: [
      "Part 2: island and house from textured .obj models; free camera, transformable objects.",
      "Part 3: ambient/diffuse/specular lighting, three lights, indoor/outdoor zones, sun shadow map.",
      "Bonus 'blackout' mode with an adjustable flashlight cone. With Luiz Fellipe Hotoshi.",
    ],
    stack: ["Python", "OpenGL", "GLSL"],
    links: [gh("DeguShi/Projeto_2_CG"), gh("DeguShi/Projeto_3_CG")],
  },
  {
    path: "building/class/potion-shop",
    area: "class",
    year: 2026,
    title: "Poções & Soluções",
    oneliner: "REST service and storefront for a fictional potion shop",
    about: [
      "SCC0219 (Intro to Web Development): REST API to create, list and delete potions.",
      "Shop and admin pages in plain HTML/CSS/JS over AJAX; in-memory SQLite via Sequelize.",
    ],
    stack: ["JavaScript", "Node.js", "Express", "Sequelize", "SQLite"],
    links: [gh("DeguShi/Atividade2-Web")],
  },
  {
    path: "building/class/svd-music",
    area: "class",
    year: 2024,
    title: "Music genre clustering with SVD",
    oneliner: "SVD + k-means over Spotify audio features",
    about: [
      "523 subgenres mapped to 15 groups; 9 audio features standardized.",
      "SVD keeps ≥ 80% variance (22 → 5 dims); k-means with k = 2, silhouette 0.37.",
    ],
    stack: ["Python", "NumPy", "scikit-learn", "pandas"],
    links: [gh("DeguShi/Projeto_Algebra-Linear")],
  },
  {
    path: "building/class/numerical-calculus",
    area: "class",
    year: 2025,
    title: "Numerical Calculus (SME0104)",
    oneliner: "five numerical methods exercises in one notebook",
    about: [
      "LU decomposition at n = 2000, bisection and Newton for systems.",
      "SVD via Francis' QR applied to image compression; interpolation; least squares on Covid-19 data.",
    ],
    stack: ["Python", "NumPy", "SciPy", "Matplotlib"],
    links: [gh("DeguShi/Trabalho_Calculo-Numerico")],
  },
  {
    path: "building/class/airport-sim",
    area: "class",
    year: 2024,
    title: "Airport simulation",
    oneliner:
      "threaded airport with semaphores guarding the runways (operating systems)",
    about: [
      "Each plane is a thread that lands, unloads and takes off; runways are guarded by semaphores.",
      "Configurable timings, runways and planes; SDL2 graphical view.",
    ],
    stack: ["C++17", "SDL2", "threads", "semaphores"],
    links: [gh("DeguShi/Projeto_SO-Aeroporto")],
  },
  {
    path: "building/class/crime-time-series",
    area: "class",
    year: 2025,
    title: "Crime time series in São Paulo",
    oneliner: "time series analysis of são paulo crime indicators, in R",
    about: [
      "Smoothing, ACF/PACF, Holt-Winters and SARIMA on robbery series, rendered from R Markdown.",
    ],
    stack: ["R", "R Markdown"],
    role: "group member",
    links: [gh("FelipeCarneiroMachado/Series-Temporais-e-Diversao-")],
  },
  {
    path: "building/class/voltage-source",
    area: "class",
    year: 2023,
    title: "Adjustable voltage source, 3–12 V",
    oneliner:
      "a 3–12 V / 100 mA power supply designed for an electronics class",
    about: [
      "Transformer, rectifier, 1000 µF filter, zener, NPN transistor, 10k pot.",
      "Simulated in Falstad, PCB schematic in EAGLE; parts cost R$ 43.16.",
    ],
    stack: ["Falstad", "EAGLE", "analog electronics"],
    links: [gh("DeguShi/fonte_tensao")],
  },
];

export const FILES = [
  // each file: lines → segments of [text, colour]
  { path: "README", lines: [
    [["welcome. this is a small, real-ish shell over my work.", "text"]],
    [["type ", "dim"], ["help", "mint"], [" for commands, or just click around.", "dim"]],
  ] },
  { path: "building/.stealth/README", lines: [
    [["pehnaporta", "amber"], ["  ·  not yet. soon.", "soft"]],
  ] },
];

// The intro replays the same script as the GitHub profile card.
export const INTRO = [
  "whoami",
  "ls research/",
  "ls building/",
  "cat building/.stealth/README",
];

export const CHIPS = [
  "help",
  "whoami",
  "ls research",
  "ls building",
  "ls building/class",
  "projects",
  "contact",
  "clear",
];
