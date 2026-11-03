import * as data from "./data.js";
import { FS } from "./fs.js";
import { startNet } from "./net.js";
import { Shell, Term } from "./shell.js";

const $ = (id) => document.getElementById(id);
const TYPE_MS = 55;

const term = new Term($("out"), $("screen"));
const fs = new FS(data.PROJECTS, data.FILES);
const shell = new Shell(fs, term, data, renderPrompt);
const input = $("input");
let busy = true; // true while the intro plays
let skipping = false;
let histIdx = 0;

function renderPrompt() {
  $("ps").replaceChildren(...shell.prompt().map((s) => term.seg(s)));
}

function renderInput() {
  const pos = input.selectionStart ?? input.value.length;
  $("before").textContent = input.value.slice(0, pos);
  $("after").textContent = input.value.slice(pos);
  term.scroll();
}

function exec(cmd) {
  input.value = "";
  renderInput();
  shell.run(cmd);
  histIdx = shell.history.length;
  renderPrompt();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, skipping ? 0 : ms));

async function typeOut(cmd) {
  $("promptLine").classList.add("typing");
  for (let i = 1; i <= cmd.length; i++) {
    input.value = cmd.slice(0, i);
    renderInput();
    await sleep(TYPE_MS + Math.random() * 40);
  }
  $("promptLine").classList.remove("typing");
  await sleep(250);
  exec(cmd);
}

async function intro() {
  renderPrompt();
  $("promptLine").hidden = false;
  await sleep(900);
  for (const cmd of data.INTRO) {
    await typeOut(cmd);
    await sleep(700);
  }
  shell.history = [];
  term.line("");
  term.line(
    ["  this one's real. type ", "faint"],
    { text: "help", cls: "mint", cmd: "help" },
    [", or try ", "faint"],
    { text: "projects", cls: "mint", cmd: "projects" },
    [".", "faint"],
  );
  term.line("");
  busy = false;
  $("skip").classList.add("gone");
  input.focus({ preventScroll: true });
}

function skip() {
  if (busy) skipping = true;
}

function onKey(e) {
  if (busy) {
    skip();
    e.preventDefault();
    return;
  }
  if (e.key === "Enter") {
    e.preventDefault();
    exec(input.value);
  } else if (e.key === "Tab") {
    e.preventDefault();
    const { value, options } = shell.complete(input.value);
    if (options.length > 1) {
      shell.run(input.value, { record: false });
      term.line(...options.flatMap((o) => [[o, "soft"], "   "]));
    }
    input.value = value;
  } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    histIdx = Math.max(
      0,
      Math.min(shell.history.length, histIdx + (e.key === "ArrowUp" ? -1 : 1)),
    );
    input.value = shell.history[histIdx] ?? "";
  } else if (e.key === "l" && e.ctrlKey) {
    e.preventDefault();
    term.clear();
  } else if (
    e.key === "c" &&
    e.ctrlKey &&
    !input.value.slice(input.selectionStart, input.selectionEnd)
  ) {
    e.preventDefault();
    term.line(...shell.prompt(), [input.value + "^C", "text"]);
    input.value = "";
  }
  requestAnimationFrame(renderInput);
}

function runFromUi(cmd) {
  if (busy) {
    skip();
    return;
  }
  exec(cmd);
  input.focus({ preventScroll: true });
}

// `cd ..` from ~ — not in help, not in completion. For the curious.
async function escapeHome() {
  busy = true;
  skipping = false;
  term.line(["cd: permission denied: ..", "err"]);
  await sleep(900);
  term.line(["  ...", "faint"]);
  await sleep(900);
  term.line(["  fine. you were curious enough to try.", "amber"]);
  await sleep(1100);
  document.body.classList.add("leaving");
  await sleep(500);
  location.href = "cv/";
  return false;
}

function wire() {
  term.onCommand = runFromUi;
  shell.onEscape = () => { escapeHome(); return false; };
  input.addEventListener("keydown", onKey);
  input.addEventListener("input", renderInput);
  document.addEventListener("keydown", (e) => {
    if (busy) skip();
    else if (document.activeElement !== input && !e.metaKey)
      input.focus({ preventScroll: true });
  });
  $("screen").addEventListener("click", () => {
    if (busy) skip();
    if (!getSelection().toString()) input.focus({ preventScroll: true });
  });
  for (const c of data.CHIPS) {
    const b = document.createElement("button");
    b.textContent = c;
    b.addEventListener("click", () => runFromUi(c));
    $("chips").append(b);
  }
}

wire();
// Coming back with the browser's back button restores this page from cache: undo the exit animation.
addEventListener("pageshow", (e) => {
  if (!e.persisted) return;
  document.body.classList.remove("leaving");
  busy = false;
  term.line(["  welcome back.", "faint"]);
  renderPrompt();
});
startNet($("net"));
intro();
