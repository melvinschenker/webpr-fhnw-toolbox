/**
 * Main entry point for the Web Programming Toolbox application.
 * Orchestrates the initialization of all modules.
 */

import { loadSections, setupSectionToggles } from './modules/sectionLoader.js';
import { buildTableOfContents } from './modules/tocBuilder.js';
import { setupScrollTracking } from './modules/scrollTracker.js';
import { setupObserverDemo } from './modules/observable.js';

/**
 * Initialize the application when the page loads.
 * Loads all sections and sets up interactive features.
 */
const init = async () => {
  await loadSections();
  setupSectionToggles();
  buildTableOfContents();
  setupScrollTracking();
  setupObserverDemo();
};

// Start Application
init();
