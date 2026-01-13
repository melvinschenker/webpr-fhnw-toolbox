// ============================================================================
// Configuration
// ============================================================================

/**
 * List of section files to be loaded dynamically.
 * Add new section HTML files here to include them in the toolbox.
 */
const sections = [
  'scopingAndIIFE.html',
  'closures.html',
  'arrow-functions.html',
  'destructuring.html',
  'promises.html',
  'async-await.html',
];

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize the application when the page loads.
 * Loads all sections and sets up interactive features.
 */
const init = async () => {
  await loadSections();
  setupSectionToggles();
  buildTableOfContents();
  setupScrollTracking();
}

// ============================================================================
// Section Loading
// ============================================================================

/**
 * Dynamically loads all section HTML files and appends them to the container.
 * Also triggers Prism.js syntax highlighting after loading.
 */
const loadSections = async () => {
  const container = document.getElementById('sections-container');

  for (const sectionFile of sections) {
    try {
      const response = await fetch(`sections/${sectionFile}`);
      const html = await response.text();

      const section = document.createElement('section');
      section.innerHTML = html;
      container.appendChild(section);

    } catch (error) {
      console.error(`Error loading section ${sectionFile}:`, error);
    }
  }

  // Activate Prism.js syntax highlighting
  if (window.Prism) {
    Prism.highlightAll();
  }
}

// ============================================================================
// Section Toggle (Collapse/Expand)
// ============================================================================

/**
 * Sets up click handlers on section headers to toggle collapse/expand state.
 */
const setupSectionToggles = () => {
  document.querySelectorAll('section h2').forEach(header => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('collapsed');
    });
  });
}

// ============================================================================
// Table of Contents (TOC)
// ============================================================================

/**
 * Builds the table of contents based on loaded sections.
 * Creates navigation links with smooth scroll functionality.
 */
const buildTableOfContents = () => {
  const tocList = document.getElementById('toc-list');
  const sections = document.querySelectorAll('section');

  sections.forEach((section, index) => {
    const h2 = section.querySelector('h2');
    if (!h2) return;

    // Assign unique ID to each section
    const sectionId = `section-${index}`;
    section.id = sectionId;

    // Create TOC link
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${sectionId}`;
    a.textContent = h2.textContent.replace('▼', '').trim();

    // Add smooth scroll on click
    a.addEventListener('click', (e) => {
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    li.appendChild(a);
    tocList.appendChild(li);
  });
}

// ============================================================================
// Scroll Tracking
// ============================================================================

/**
 * Monitors scroll position and highlights the currently active section in the TOC.
 * Uses requestAnimationFrame for optimized performance.
 */
const setupScrollTracking = () => {
  const sections = document.querySelectorAll('section');
  const tocLinks = document.querySelectorAll('#toc-list a');

  if (sections.length === 0 || tocLinks.length === 0) return;

  // Initial highlight on page load
  updateActiveSection();

  // Throttled scroll listener for better performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  });

  /**
   * Updates the active state of TOC links based on scroll position.
   * Handles edge cases for top and bottom of page.
   */
  const updateActiveSection = () => {
    const scrollPosition = window.scrollY + 150; // Offset for better UX

    // Edge case: User scrolled to top
    if (window.scrollY < 100) {
      setActiveLink(0);
      return;
    }

    // Edge case: User scrolled to bottom
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
      setActiveLink(tocLinks.length - 1);
      return;
    }

    // Normal case: Find current section based on scroll position
    let currentIndex = -1;
    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentIndex = index;
      }
    });

    if (currentIndex !== -1) {
      setActiveLink(currentIndex);
    }
  }

  /**
   * Helper function to set the active state on a specific TOC link.
   * @param {number} index - Index of the link to activate
   */
  const setActiveLink = (index) => {
    tocLinks.forEach(link => link.classList.remove('active'));
    if (tocLinks[index]) {
      tocLinks[index].classList.add('active');
    }
  }
}

// ============================================================================
// Start Application
// ============================================================================

init();