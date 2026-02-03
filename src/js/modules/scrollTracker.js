/**
 * Monitors scroll position and highlights the currently active section in the TOC.
 * Uses requestAnimationFrame for optimized performance.
 */
export const setupScrollTracking = () => {
  const sections = document.querySelectorAll("section");
  const tocLinks = document.querySelectorAll("#toc-list a");

  if (sections.length === 0 || tocLinks.length === 0) return;

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
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 50
    ) {
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
  };

  /**
   * Helper function to set the active state on a specific TOC link.
   * @param {number} index - Index of the link to activate
   */
  const setActiveLink = (index) => {
    tocLinks.forEach((link) => link.classList.remove("active"));
    if (tocLinks[index]) {
      tocLinks[index].classList.add("active");
    }
  };

  // Initial highlight on page load
  updateActiveSection();

  // Throttled scroll listener for better performance
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  });
};
