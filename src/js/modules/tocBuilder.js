/**
 * Builds the table of contents based on loaded sections.
 * Creates navigation links with smooth scroll functionality.
 */
export const buildTableOfContents = () => {
  const tocList = document.getElementById("toc-list");
  const sections = document.querySelectorAll("section");

  sections.forEach((section, index) => {
    const h2 = section.querySelector("h2");
    if (!h2) return;

    // Assign unique ID to each section
    const sectionId = `section-${index}`;
    section.id = sectionId;

    // Create TOC link
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${sectionId}`;
    a.textContent = h2.textContent.replace("▼", "").trim();

    // Add smooth scroll on click
    a.addEventListener("click", (e) => {
      e.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    li.appendChild(a);
    tocList.appendChild(li);
  });
};
