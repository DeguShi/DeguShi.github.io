// Virtual filesystem built from data.js. Paths are arrays of names relative to ~.

export class FS {
  constructor(projects, files) {
    this.root = dir("~");
    for (const p of projects) {
      const node = this.mkdirp(p.path.split("/"));
      node.project = p;
      node.children.set("ABOUT", { type: "file", name: "ABOUT", project: p });
    }
    for (const f of files) {
      const parts = f.path.split("/");
      const parent = this.mkdirp(parts.slice(0, -1));
      parent.children.set(parts.at(-1), {
        type: "file",
        name: parts.at(-1),
        lines: f.lines,
      });
    }
  }

  mkdirp(parts) {
    let node = this.root;
    for (const name of parts) {
      if (!node.children.has(name)) node.children.set(name, dir(name));
      node = node.children.get(name);
    }
    return node;
  }

  // Resolve `arg` against `cwd` (array). Returns the path array, or null if it escapes ~.
  resolve(cwd, arg = "") {
    let parts = arg.startsWith("~") || arg.startsWith("/") ? [] : [...cwd];
    for (const seg of arg.replace(/^~\/?|^\//, "").split("/")) {
      if (!seg || seg === ".") continue;
      if (seg === "..") {
        if (parts.length) parts.pop();
        continue;
      }
      parts.push(seg);
    }
    return parts;
  }

  // True if `arg` climbs above ~ (e.g. `cd ..` at home). Used for one quiet easter egg.
  escapes(cwd, arg = "") {
    if (arg.startsWith("~") || arg.startsWith("/")) return false;
    let depth = cwd.length;
    for (const seg of arg.split("/")) {
      if (seg === "..") depth--;
      else if (seg && seg !== ".") depth++;
      if (depth < 0) return true;
    }
    return false;
  }

  // Expand * and ? like a shell. Returns matching args (as typed, relative), [] if none.
  glob(cwd, pattern) {
    const lead = pattern.match(/^(~\/?|\/)?/)[0];
    const trailing = pattern.endsWith("/");
    const segs = pattern.slice(lead.length).split("/").filter(Boolean);
    let hits = [{ path: lead ? [] : [...cwd], text: lead }];
    for (const seg of segs) {
      const next = [];
      for (const { path, text } of hits) {
        const join = (name) => text + (text && !text.endsWith("/") ? "/" : "") + name;
        if (!/[*?]/.test(seg)) {
          const p = this.resolve(path, seg);
          if (seg === ".." || this.get(p)) next.push({ path: p, text: join(seg) });
          continue;
        }
        const node = this.get(path);
        if (node?.type !== "dir") continue;
        const re = new RegExp(`^${seg.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".")}$`);
        for (const name of node.children.keys())
          if (re.test(name) && (seg.startsWith(".") || !name.startsWith(".")))
            next.push({ path: [...path, name], text: join(name) });
      }
      hits = next;
    }
    if (trailing) hits = hits.filter((h) => this.get(h.path)?.type === "dir");
    return hits.map((h) => h.text + (trailing ? "/" : ""));
  }

  get(path) {
    let node = this.root;
    for (const name of path) {
      if (node.type !== "dir" || !node.children.has(name)) return null;
      node = node.children.get(name);
    }
    return node;
  }

  // Case-insensitive lookup of a project anywhere in the tree by folder name.
  findProject(name) {
    const want = name.replace(/\/$/, "").toLowerCase();
    const stack = [[this.root, []]];
    while (stack.length) {
      const [node, path] = stack.pop();
      if (node.type === "dir" && node.project && node.name.toLowerCase() === want)
        return { node, path };
      if (node.type === "dir")
        for (const [n, c] of node.children) stack.push([c, [...path, n]]);
    }
    return null;
  }

  allProjects() {
    const out = [];
    const walk = (node, path) => {
      if (node.type === "dir" && node.project) out.push({ node, path });
      if (node.type === "dir")
        for (const [n, c] of node.children) walk(c, [...path, n]);
    };
    walk(this.root, []);
    return out;
  }
}

function dir(name) {
  return { type: "dir", name, children: new Map() };
}

export const show = (path) => (path.length ? `~/${path.join("/")}` : "~");
