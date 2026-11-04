// The shell: output rendering, commands, completion.
import { show } from "./fs.js";

const AREA_CLS = {
  research: "mint",
  building: "coral",
  collab: "violet",
  class: "sky",
  stealth: "amber",
};
const DIR_AREA = {
  research: "research",
  building: "building",
  collab: "collab",
  class: "class",
  ".stealth": "stealth",
};

// ── output ──────────────────────────────────────────────

export class Term {
  constructor(out, screen) {
    this.out = out;
    this.screen = screen;
    this.onCommand = () => {};
  }

  // segs: strings, [text, colour], or {text, cls, cmd, href}
  line(...segs) {
    const div = document.createElement("div");
    for (const s of segs) div.append(this.seg(s));
    this.out.append(div);
    this.scroll();
    return div;
  }

  seg(s) {
    if (s instanceof Node) return s;
    if (typeof s === "string") return document.createTextNode(s);
    if (Array.isArray(s)) s = { text: s[0], cls: s[1] };
    if (s.href) {
      const a = document.createElement("a");
      a.className = "link";
      a.href = s.href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = s.text;
      return a;
    }
    const span = document.createElement("span");
    span.textContent = s.text;
    if (s.cls)
      span.className = s.cls
        .split(" ")
        .map((c) => `t-${c}`)
        .join(" ");
    if (s.cmd) {
      span.classList.add("click");
      span.title = s.cmd;
      span.addEventListener("click", (e) => {
        e.stopPropagation();
        this.onCommand(s.cmd);
      });
    }
    return span;
  }

  block(el) {
    this.out.append(el);
    this.scroll();
  }
  clear() {
    this.out.replaceChildren();
  }
  scroll() {
    this.screen.scrollTop = this.screen.scrollHeight;
  }
}

// ── helpers ─────────────────────────────────────────────

const pad = (s, n) => s + " ".repeat(Math.max(1, n - s.length));

function areaOf(node, name) {
  if (node.project) return node.project.area;
  return DIR_AREA[name] ?? null;
}

function entrySeg(node, name, path) {
  const isDir = node.type === "dir";
  const area = areaOf(node, name);
  const cls = area ? AREA_CLS[area] : isDir ? "text" : "soft";
  const target = show(path);
  const cmd = node.project || !isDir ? `cat ${target}` : `ls ${target}`;
  return { text: name + (isDir ? "/" : ""), cls, cmd };
}

function projectCard(term, p) {
  const card = document.createElement("div");
  card.className = `card ${p.area === "research" ? "" : p.area === "stealth" ? "stealth" : "building"}`;
  const add = (...segs) => {
    const d = document.createElement("div");
    segs.forEach((s) => d.append(term.seg(s)));
    card.append(d);
  };
  add(
    [p.title, "bold"],
    ["  ·  ", "faint"],
    [String(p.year), "dim"],
    ...(p.private ? [["  ·  private", "amber"]] : []),
  );
  add([p.oneliner, AREA_CLS[p.area]]);
  add("");
  p.about.forEach((l) => add([l, "soft"]));
  if (p.role) {
    add("");
    add(["role  ", "faint"], [p.role, "dim"]);
  }
  const tags = document.createElement("div");
  tags.style.marginTop = "8px";
  for (const t of p.stack) {
    const s = document.createElement("span");
    s.className = "tag";
    s.textContent = t;
    tags.append(s);
  }
  card.append(tags);
  if (p.links?.length)
    p.links.forEach((l) =>
      add(["→ ", "faint"], { text: l.label, href: l.url }),
    );
  else
    add(["→ repo is private · happy to talk about it: ", "faint"], {
      text: "contact",
      cls: "mint",
      cmd: "contact",
    });
  term.block(card);
}

// ── shell ───────────────────────────────────────────────

export class Shell {
  constructor(fs, term, data, onCwd) {
    this.fs = fs;
    this.term = term;
    this.data = data;
    this.onCwd = onCwd;
    this.onEscape = () => false;
    this.cwd = [];
    this.history = [];
    this.commands = buildCommands(this);
  }

  prompt() {
    return [
      [show(this.cwd), "mint"],
      [" $ ", "faint"],
    ];
  }

  run(raw, { record = true } = {}) {
    const input = raw.trim();
    this.term.line(...this.prompt(), [raw, "text"]);
    if (!input) return;
    if (record) this.history.push(input);
    for (const part of input.split("&&")) {
      const [name, ...raw] = part.trim().split(/\s+/);
      const args = [];
      for (const a of raw) {
        if (!/[*?]/.test(a)) {
          args.push(a);
          continue;
        }
        const hits = this.fs.glob(this.cwd, a);
        if (!hits.length) {
          this.term.line([`zsh: no matches found: ${a}`, "err"]);
          return;
        }
        args.push(...hits);
      }
      const cmd = this.commands[name];
      if (!cmd) {
        this.term.line(
          [`zsh: command not found: ${name}`, "err"],
          ["  · try ", "faint"],
          { text: "help", cls: "mint", cmd: "help" },
        );
        return;
      }
      if (cmd.fn(args) === false) return;
    }
  }

  node(arg) {
    const path = this.fs.resolve(this.cwd, arg);
    return { path, node: this.fs.get(path) };
  }

  complete(value) {
    const parts = value.split(" ");
    const last = parts.at(-1);
    let options;
    if (parts.length === 1) {
      options = Object.keys(this.commands).filter(
        (c) => !this.commands[c].hidden && c.startsWith(last),
      );
    } else {
      const slash = last.lastIndexOf("/");
      const base = slash >= 0 ? last.slice(0, slash + 1) : "";
      const prefix = last.slice(slash + 1);
      const dir = this.fs.get(this.fs.resolve(this.cwd, base || "."));
      if (!dir || dir.type !== "dir") return { value, options: [] };
      options = [...dir.children]
        .filter(([n]) => n.toLowerCase().startsWith(prefix.toLowerCase()))
        .map(([n, c]) => base + n + (c.type === "dir" ? "/" : ""));
    }
    if (options.length === 1) {
      parts[parts.length - 1] = options[0];
      const end = parts.length === 1 || !options[0].endsWith("/") ? " " : "";
      return { value: parts.join(" ") + end, options: [] };
    }
    const common = options.reduce((a, b) => {
      let i = 0;
      while (i < a.length && a[i].toLowerCase() === b[i]?.toLowerCase()) i++;
      return a.slice(0, i);
    }, options[0] ?? last);
    parts[parts.length - 1] = common.length > last.length ? common : last;
    return { value: parts.join(" "), options };
  }
}

function buildCommands(sh) {
  const t = sh.term;
  const err = (msg) => {
    t.line([msg, "err"]);
    return false;
  };

  return {
    help: {
      desc: "this list",
      fn: () => {
        t.line(["commands", "bold"]);
        const rows = Object.entries(sh.commands).filter(([, c]) => !c.hidden);
        for (const [name, c] of rows)
          t.line(
            "  ",
            { text: pad(name, 11), cls: "mint", cmd: c.example ?? name },
            [c.desc, "dim"],
          );
        t.line("");
        t.line(
          ["start with ", "faint"],
          { text: "ls", cls: "mint", cmd: "ls" },
          [", then ", "faint"],
          { text: "cat", cls: "mint", cmd: "cat research/ULRMEEUD" },
          [" anything that looks interesting. ", "faint"],
          ["click works too.", "faint"],
        );
      },
    },

    whoami: {
      desc: "who's on the other side",
      fn: () => {
        t.line(
          [sh.data.PROFILE.name, "text"],
          ["  ·  " + sh.data.PROFILE.line, "dim"],
        );
      },
    },

    about: {
      desc: "a bit more than whoami",
      fn: () => {
        for (const l of sh.data.PROFILE.about)
          t.line([
            l,
            l.startsWith("research") || l.startsWith("building")
              ? "soft"
              : "text",
          ]);
      },
    },

    ls: {
      desc: "list a folder",
      example: "ls building",
      fn: (args) => {
        const targets = args.filter((a) => !a.startsWith("-"));
        if (!targets.length) targets.push(".");
        targets.forEach((arg, i) => {
          const { path, node } = sh.node(arg);
          if (!node) return err(`ls: ${arg}: no such file or directory`);
          if (node.type !== "dir") return t.line(entrySeg(node, path.at(-1), path));
          if (targets.length > 1) {
            if (i) t.line("");
            t.line([`${arg}:`, "faint"]);
          }
          const segs = [];
          for (const [name, child] of node.children)
            segs.push(entrySeg(child, name, [...path, name]), "  ");
          t.line(...segs);
        });
      },
    },

    cd: {
      desc: "change folder",
      example: "cd research",
      fn: (args) => {
        if (args[0] && sh.fs.escapes(sh.cwd, args[0])) return sh.onEscape();
        const { path, node } = sh.node(args[0] ?? "~");
        if (!node) return err(`cd: no such file or directory: ${args[0]}`);
        if (node.type !== "dir") return err(`cd: not a directory: ${args[0]}`);
        sh.cwd = path;
        sh.onCwd();
      },
    },

    pwd: { desc: "where am I", fn: () => t.line([show(sh.cwd), "text"]) },

    cat: {
      desc: "read a file or a project",
      example: "cat research/ULRMEEUD",
      fn: (args) => {
        if (!args.length) return err("cat: which file? try cat README");
        for (const arg of args) {
          let { node } = sh.node(arg);
          if (!node) {
            const hit = sh.fs.findProject(arg.split("/").at(-1));
            node = hit?.node;
          }
          if (!node) return err(`cat: ${arg}: no such file or directory`);
          if (node.project) {
            projectCard(t, node.project);
            continue;
          }
          if (node.type === "dir")
            return err(`cat: ${arg}: is a directory  (try ls ${arg})`);
          for (const segs of node.lines) t.line(...segs);
        }
      },
    },

    open: {
      desc: "open a project's repo",
      example: "open habitacion",
      fn: (args) => {
        if (!args[0]) return err("open: which project? e.g. open habitacion");
        const hit = sh.node(args[0]).node?.project
          ? sh.node(args[0]).node
          : sh.fs.findProject(args[0].split("/").at(-1))?.node;
        if (!hit?.project) return err(`open: ${args[0]}: no such project`);
        const p = hit.project;
        if (!p.links?.length) return err(`open: ${p.title} is private`);
        window.open(p.links[0].url, "_blank", "noopener");
        t.line(["opening ", "dim"], {
          text: p.links[0].label,
          href: p.links[0].url,
        });
      },
    },

    tree: {
      desc: "everything at once",
      example: "tree",
      fn: (args) => {
        const { path, node } = sh.node(args[0] ?? ".");
        if (!node || node.type !== "dir")
          return err(`tree: ${args[0] ?? "."}: not a directory`);
        t.line([show(path), "text"]);
        const walk = (dir, p, prefix) => {
          const kids = [...dir.children].filter(([n]) => n !== "ABOUT");
          kids.forEach(([name, child], i) => {
            const lastKid = i === kids.length - 1;
            t.line(
              [prefix + (lastKid ? "└── " : "├── "), "faint"],
              entrySeg(child, name, [...p, name]),
              ...(child.project
                ? [["  " + child.project.oneliner, "faint"]]
                : []),
            );
            if (child.type === "dir" && !child.project)
              walk(child, [...p, name], prefix + (lastKid ? "    " : "│   "));
          });
        };
        walk(node, path, "");
      },
    },

    projects: {
      desc: "every project, one line each",
      fn: () => {
        const groups = [
          ["research", "research"],
          ["building", "building"],
          ["with others", "collab"],
          ["class", "class"],
        ];
        const all = sh.fs.allProjects();
        for (const [label, area] of groups) {
          const items = all.filter(({ node }) => node.project.area === area);
          if (!items.length) continue;
          t.line([label, AREA_CLS[area] + " bold"]);
          for (const { node, path } of items)
            t.line(
              "  ",
              {
                text: pad(path.at(-1), 22),
                cls: AREA_CLS[area],
                cmd: `cat ${show(path)}`,
              },
              [node.project.oneliner, "dim"],
            );
        }
      },
    },

    contact: {
      desc: "how to reach me",
      fn: () => {
        for (const [k, url] of sh.data.PROFILE.contact)
          t.line(["  " + pad(k, 10), "dim"], {
            text: url.replace(/^mailto:|^https:\/\//, ""),
            href: url,
          });
      },
    },

    neofetch: { desc: "the obligatory one", fn: () => neofetch(sh) },
    history: {
      desc: "what you typed",
      fn: () =>
        sh.history.forEach((h, i) =>
          t.line([String(i + 1).padStart(3) + "  ", "faint"], {
            text: h,
            cls: "soft",
            cmd: h,
          }),
        ),
    },
    clear: { desc: "clean the screen", fn: () => t.clear() },

    echo: {
      hidden: true,
      desc: "",
      fn: (args) => t.line([args.join(" "), "text"]),
    },
    date: {
      hidden: true,
      desc: "",
      fn: () => t.line([new Date().toString(), "text"]),
    },
    sudo: {
      hidden: true,
      desc: "",
      fn: () => t.line(["nice try. this incident will be reported.", "amber"]),
    },
    exit: {
      hidden: true,
      desc: "",
      fn: () =>
        t.line(["there is no escape. but there is ", "dim"], {
          text: "contact",
          cls: "mint",
          cmd: "contact",
        }),
    },
    rm: {
      hidden: true,
      desc: "",
      fn: () =>
        t.line([
          "rm: read-only filesystem. the projects are staying.",
          "amber",
        ]),
    },
    vim: {
      hidden: true,
      desc: "",
      fn: () =>
        t.line(["you'd never get out. try ", "dim"], {
          text: "cat",
          cls: "mint",
          cmd: "cat README",
        }),
    },
  };
}

function neofetch(sh) {
  const t = sh.term;
  const art = [
    ["   ●───────●   ", "mint"],
    ["  ╱ ╲     ╱ ╲  ", "mint"],
    [" ●───●───●───● ", "faint"],
    ["  ╲ ╱     ╲ ╱  ", "coral"],
    ["   ●───────●   ", "coral"],
    ["               ", "faint"],
    ["               ", "faint"],
  ];
  const info = [
    [
      ["felipe", "mint"],
      ["@", "faint"],
      ["usp", "coral"],
    ],
    [["───────────", "faint"]],
    [
      ["os       ", "dim"],
      ["undergrad · ICMC-USP, São Carlos", "soft"],
    ],
    [
      ["shell    ", "dim"],
      ["research ⟷ building", "soft"],
    ],
    [
      ["focus    ", "dim"],
      ["world models · object-centric learning · epidemic intel", "soft"],
    ],
    [
      ["langs    ", "dim"],
      ["Python, TypeScript, Kotlin, C++", "soft"],
    ],
    [
      ["projects ", "dim"],
      [String(sh.fs.allProjects().length), "soft"],
    ],
  ];
  art.forEach((a, i) => t.line(a, "  ", ...(info[i] ?? [])));
  t.line(
    " ".repeat(17),
    ...["mint", "coral", "amber", "violet", "sky"].map((c) => ["███", c]),
  );
}
