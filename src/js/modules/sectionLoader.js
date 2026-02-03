/**
 * Configuration: List of section files to be loaded dynamically.
 * Add new section HTML files here to include them in the toolbox.
 */
const SECTIONS = [
  { file: "scopingAndIIFE.html" },
  { file: "lambda.html" },
  { file: "evalVsFunction.html" },
  { file: "thisContext.html" },
  { file: "prototypeExtensions.html" },
  { file: "ambientTypeDefinitions.html" },
  { file: "asyncAwait.html" },
  { file: "es6Modules.html" },
  { file: "lazyCalculation.html" },
  { file: "iterators.html" },
  { file: "observer.html" },
];

/**
 * Dynamically loads all section HTML files and appends them to the container.
 * Also triggers Prism.js syntax highlighting after loading.
 */
export const loadSections = async () => {
  const container = document.getElementById("sections-container");

  for (const section of SECTIONS) {
    try {
      const response = await fetch(`src/sections/${section.file}`);
      const html = await response.text();

      const sectionElement = document.createElement("section");
      sectionElement.innerHTML = html;
      container.appendChild(sectionElement);
    } catch (error) {
      console.error(`Error loading section ${section.file}:`, error);
    }
  }

  // Activate Prism.js syntax highlighting
  if (window.Prism) {
    Prism.highlightAll();
  }
};

/**
 * Sets up click handlers on section headers to toggle collapse/expand state.
 */
export const setupSectionToggles = () => {
  document.querySelectorAll("section h2").forEach((header) => {
    header.addEventListener("click", () => {
      header.parentElement.classList.toggle("collapsed");
    });
  });
};
