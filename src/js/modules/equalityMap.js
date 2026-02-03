/**
 * Interaktive JS Equality Map Demo
 * Visualisiert == vs === Vergleiche in JavaScript
 */
export const setupEqualityMap = () => {
  const mapElement = document.getElementById("equality-map");
  const operatorSelect = document.getElementById("equality-operator");
  const scoreDisplay = document.getElementById("equality-score");
  
  if (!mapElement) return;

  let score = 0;
  let currentOperator = "==";

  const factories = [
    () => true,
    () => false,
    () => 1,
    () => 0,
    () => -1,
    () => "true",
    () => "false",
    () => "1",
    () => "0",
    () => "-1",
    () => "",
    () => null,
    () => undefined,
    () => Infinity,
    () => -Infinity,
    () => [],
    () => ({}),
    () => [[]],
    () => [0],
    () => [1],
    () => NaN,
  ];

  const axis = factories;
  const size = axis.length;
  const map = mapElement;

  const renderMap = () => {
    map.innerHTML = "";
    map.className = "equality-grid";
    map.style.gridTemplateColumns = `repeat(${size + 1}, 28px)`;

    const frag = document.createDocumentFragment();

    // Header
    frag.appendChild(document.createElement("div"));
    axis.forEach((f, x) => {
      const el = document.createElement("div");
      el.className = "equality-label equality-label-col-header";
      el.textContent = format(f());
      el.dataset.x = x;
      frag.appendChild(el);
    });

    // Body
    axis.forEach((rowFactory, y) => {
      const rowLabel = document.createElement("div");
      rowLabel.className = "equality-label equality-label-row-header";
      rowLabel.textContent = format(rowFactory());
      rowLabel.dataset.y = y;
      frag.appendChild(rowLabel);

      axis.forEach((_, x) => {
        const cell = document.createElement("div");
        cell.className = "equality-cell";
        cell.dataset.x = x;
        cell.dataset.y = y;
        frag.appendChild(cell);
      });
    });

    map.appendChild(frag);
    attachEventListeners();
  };

  const attachEventListeners = () => {
    const clearHover = () => {
      map.querySelectorAll(".equality-cell.hover").forEach((c) => {
        c.classList.remove("hover");
      });
      map.querySelectorAll(".equality-label.hover").forEach((l) => {
        l.classList.remove("hover");
      });
    };

    const applyHover = (x, y) => {
      map.querySelectorAll(".equality-cell").forEach((c) => {
        const cx = Number(c.dataset.x);
        const cy = Number(c.dataset.y);
        if (cx === x || cy === y) {
          c.classList.add("hover");
        }
      });

      const header = map.querySelector(`.equality-label-col-header[data-x="${x}"]`);
      if (header) header.classList.add("hover");

      const row = map.querySelector(`.equality-label-row-header[data-y="${y}"]`);
      if (row) row.classList.add("hover");
    };

    map.addEventListener("mouseover", (e) => {
      const cell = e.target.closest(".equality-cell");
      if (!cell) return;
      clearHover();
      applyHover(Number(cell.dataset.x), Number(cell.dataset.y));
    });

    map.addEventListener("mouseleave", () => {
      clearHover();
    });

    // Event Delegation (1 Handler für alle Zellen)
    map.addEventListener("mousedown", (e) => {
      const cell = e.target.closest(".equality-cell");
      if (!cell) return;

      // Zelle wurde bereits beantwortet
      if (cell.classList.contains("correct") || cell.classList.contains("wrong")) {
        return;
      }

      e.preventDefault();

      const x = +cell.dataset.x;
      const y = +cell.dataset.y;

      const rowVal = axis[y]();
      const colVal = axis[x]();
      
      // Berechne das Ergebnis basierend auf selectedem Operator
      const actual = currentOperator === "=="
        ? rowVal == colVal
        : rowVal === colVal;

      const userSaysTrue = e.button === 0;
      const isCorrect = userSaysTrue === actual;

      if (isCorrect) {
        score++;
      } else {
        score--;
      }
      updateScore();

      cell.classList.add(isCorrect ? "correct" : "wrong");
    });

    map.addEventListener("contextmenu", (e) => e.preventDefault());
  };

  const updateScore = () => {
    if (scoreDisplay) {
      scoreDisplay.textContent = `Punkte: ${score}`;
    }
  };

  const resetMap = () => {
    score = 0;
    updateScore();
    renderMap();
  };

  // Operator Auswahl Handler
  if (operatorSelect) {
    operatorSelect.addEventListener("change", (e) => {
      currentOperator = e.target.value;
      resetMap();
    });
  }

  function format(v) {
    if (typeof v === "string") return `"${v}"`;
    if (Number.isNaN(v)) return "NaN";
    if (Array.isArray(v)) return JSON.stringify(v);
    if (typeof v === "object" && v !== null) return "{}";
    return String(v);
  }

  // Initial render
  renderMap();
  updateScore();
};
