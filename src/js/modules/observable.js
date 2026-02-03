/**
 * Observable-Klasse für das Observer Pattern
 * Verwaltet einen Wert und benachrichtigt alle registrierten Subscriber bei Änderungen
 */
export class Observable {
  constructor(initialValue = null) {
    this.value = initialValue;
    this.subscribers = [];
  }

  /**
   * Registriert einen Observer (Callback-Funktion)
   * @param {Function} observer - Wird sofort aufgerufen und bei Wertänderung wieder aufgerufen
   * @returns {Function} Unsubscribe-Funktion
   */
  subscribe(observer) {
    this.subscribers.push(observer);
    return () => {
      this.subscribers = this.subscribers.filter((o) => o !== observer);
    };
  }

  /**
   * Neuen Wert setzen und alle Subscriber benachrichtigen
   * @param {*} newValue - Der neue Wert
   */
  setValue(newValue) {
    if (this.value !== newValue) {
      this.value = newValue;
      this.subscribers.forEach((observer) => observer(this.value));
    }
  }
}

/**
 * Setzt die interaktive Observer-Demo auf.
 * Wird aufgerufen nachdem alle Sections geladen wurden.
 */
export const setupObserverDemo = () => {
  const textObservable = new Observable("");
  const inputField = document.getElementById("observer-input");
  const textBox = document.getElementById("observer-text");
  const colorBox = document.getElementById("observer-color");
  const colors = ["red", "green", "blue", "yellow", "orange", "purple", "black", "pink", "brown"];

  const updateTextBox = (value) => {
    if (textBox) textBox.textContent = `Box 1: ${value}`;
  };

  const updateColorBox = (value) => {
    if (!colorBox) return;
    const input = String(value || "").toLowerCase();
    const found = colors.find((color) => input.includes(color));
    colorBox.style.backgroundColor = found || "";
  };

  textObservable.subscribe(updateTextBox);
  textObservable.subscribe(updateColorBox);

  if (inputField) {
    inputField.addEventListener("input", (e) => {
      textObservable.setValue(e.target.value);
    });
  }
};
