// DOM Queries
const byId = (id) => document.getElementById(id);
const qs = (root) => (sel) => root.querySelector(sel);
const qsa = (root) => (sel) => [...root.querySelectorAll(sel)];

// Game Logic Helpers
const compareBy = (op) => (a, b) => (op === "==" ? a == b : a === b);
const isAnswered = (el) => el.classList.contains("correct") || el.classList.contains("wrong");
const nextScore = (isCorrect) => (score) => score + (isCorrect ? 1 : -1);

// State
const createState = ({ score = 0, operator = "==" } = {}) => {
  let _score = score;
  let _operator = operator;

  return {
    get: () => ({ score: _score, operator: _operator }),
    setScore: (s) => (_score = s),
    setOperator: (op) => (_operator = op),
    resetScore: () => (_score = 0),
  };
};

// DOM Builders
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

const headerLabel = (x) => (label) => {
  const n = el("div", "equality-label equality-label-col-header", label);
  n.dataset.x = x;
  return n;
};

const rowLabel = (y) => (label) => {
  const n = el("div", "equality-label equality-label-row-header", label);
  n.dataset.y = y;
  return n;
};

const cellAt = (x, y) => {
  const n = el("div", "equality-cell");
  n.dataset.x = x;
  n.dataset.y = y;
  return n;
};

// Renderer
const createRenderer = (map) => (axis) => () => {
  map.replaceChildren();
  map.className = "equality-grid";
  map.style.gridTemplateColumns = `repeat(${axis.length + 1}, 28px)`;

  const frag = document.createDocumentFragment();
  frag.appendChild(document.createElement("div"));

  axis.forEach((v, x) => frag.appendChild(headerLabel(x)(v.label)));

  axis.forEach((row, y) => {
    frag.appendChild(rowLabel(y)(row.label));
    axis.forEach((_, x) => frag.appendChild(cellAt(x, y)));
  });

  map.appendChild(frag);
};

// Hover (pre-cached queries, kein DOM-Scan pro Event) ----------
const createHover = (map) => {
  const cells = () => qsa(map)(".equality-cell");
  const clear = () => qsa(map)(".hover").forEach((n) => n.classList.remove("hover"));

  const highlight = (x, y) => {
    cells().forEach((c) => {
      const cx = +c.dataset.x;
      const cy = +c.dataset.y;
      c.classList.toggle("hover", cx === x || cy === y);
    });

    qs(map)(`.equality-label-col-header[data-x="${x}"]`)?.classList.add("hover");
    qs(map)(`.equality-label-row-header[data-y="${y}"]`)?.classList.add("hover");
  };

  return { clear, highlight };
};

// Game Logic
const createAnswerHandler = (state) => (axis) => (scoreDisplay) => (e) => {
  const cell = e.target.closest(".equality-cell");
  if (!cell || isAnswered(cell)) return;

  e.preventDefault();

  const { operator, score } = state.get();
  const x = +cell.dataset.x;
  const y = +cell.dataset.y;

  const actual = compareBy(operator)(axis[y].make(), axis[x].make());
  const userTrue = e.button === 0;
  const correct = userTrue === actual;

  const newScore = nextScore(correct)(score);
  state.setScore(newScore);
  if (scoreDisplay) scoreDisplay.textContent = `Punkte: ${newScore}`;

  cell.classList.add(correct ? "correct" : "wrong");
};

// Init ----------
const initEvents = (map) => (hover) => (answer) => () => {
  map.addEventListener("mouseover", (e) => {
    const cell = e.target.closest(".equality-cell");
    if (!cell) return;
    hover.clear();
    hover.highlight(+cell.dataset.x, +cell.dataset.y);
  });

  map.addEventListener("mouseleave", hover.clear);
  map.addEventListener("mousedown", answer);
  map.addEventListener("contextmenu", (e) => e.preventDefault());
};

const initOperator = (select) => (state) => (render) => (init) => () => {
  if (!select) return;
  select.addEventListener("change", (e) => {
    state.setOperator(e.target.value);
    state.resetScore();
    render();
    init();
  });
};

// Entry
export const setupEqualityMap = () => {
  const map = byId("equality-map");
  const operatorSelect = byId("equality-operator");
  const scoreDisplay = byId("equality-score");
  if (!map) return;

  const axis = [
    { label: "true", make: () => true },
    { label: "false", make: () => false },
    { label: "1", make: () => 1 },
    { label: "0", make: () => 0 },
    { label: "-1", make: () => -1 },
    { label: '"true"', make: () => "true" },
    { label: '"false"', make: () => "false" },
    { label: '"1"', make: () => "1" },
    { label: '"0"', make: () => "0" },
    { label: '"-1"', make: () => "-1" },
    { label: '""', make: () => "" },
    { label: "null", make: () => null },
    { label: "undefined", make: () => undefined },
    { label: "Infinity", make: () => Infinity },
    { label: "-Infinity", make: () => -Infinity },
    { label: "[]", make: () => [] },
    { label: "{}", make: () => ({}) },
    { label: "[[]]", make: () => [[]] },
    { label: "[0]", make: () => [0] },
    { label: "[1]", make: () => [1] },
    { label: "NaN", make: () => NaN },
  ];

  const state = createState();
  const render = createRenderer(map)(axis);
  const hover = createHover(map);
  const answer = createAnswerHandler(state)(axis)(scoreDisplay);

  const init = initEvents(map)(hover)(answer);
  const bindOperator = initOperator(operatorSelect)(state)(render)(init);
  render();
  init();
  bindOperator();
};
