// ------------------------------------
// Archive Index Script
// CSV → Genre → Year(desc)
// Hover preview on title
// ------------------------------------

const indexEl = document.getElementById("index");
const previewEl = document.getElementById("hoverPreview");

// ------------------------------------
// Load CSV with PapaParse
// ------------------------------------
Papa.parse("./portfolio.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function (results) {
    const data = results.data.filter(d => d.Title && d.Type && d.Year);
    buildIndex(data);
  },
  error: function (err) {
    console.error("CSV load error:", err);
  }
});

// ------------------------------------
// Build index grouped by genre
// ------------------------------------
function buildIndex(data) {
  const grouped = {};

  data.forEach(item => {
    const type = item.Type.trim();
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(item);
  });

  Object.keys(grouped).forEach(type => {
    const section = document.createElement("section");
    section.className = "genre";

    const heading = document.createElement("h2");
    heading.textContent = type;
    section.appendChild(heading);

    grouped[type]
      .sort((a, b) => Number(b.Year) - Number(a.Year))
      .forEach(item => {
        const work = document.createElement("div");
        work.className = "work";
        work.dataset.image = item["Main Project Image"];
        work.dataset.link = item.Link || "";

        work.innerHTML = `
          <span class="year">${item.Year}</span>
          <span class="title">${item.Title}</span>
        `;

        section.appendChild(work);
      });

    indexEl.appendChild(section);
  });

  bindHover();
}

// ------------------------------------
// Hover preview logic
// ------------------------------------
function bindHover() {
  const works = document.querySelectorAll(".work");

  works.forEach(work => {
    work.addEventListener("mouseenter", () => {
      const rect = work.getBoundingClientRect();
      const img = work.dataset.image;

      if (img) {
        previewEl.style.backgroundImage = `url("${img}")`;
      }

      previewEl.style.left = `${rect.left}px`;
      previewEl.style.top = `${rect.top - previewEl.offsetHeight - 12}px`;
      previewEl.style.opacity = 1;
    });

    work.addE

