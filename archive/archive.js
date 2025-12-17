// ------------------------------------
// Archive Index Script
// CSV → Genre → Year(desc)
// Hover preview on title
// ------------------------------------
console.log("archive.js loaded");

const indexEl = document.getElementById("index");
const previewEl = document.getElementById("hoverPreview");

// --------------------
// CSV Load (cache bust)
// --------------------
Papa.parse("./portfolio.csv?cb=" + Date.now(), {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function (results) {
    const data = results.data.filter(
      d => d.Title && d.Type && d.Year
    );
    buildIndex(data);
  },
  error: function (err) {
    console.error("CSV load error:", err);
  }
});

// --------------------
// Build index by genre
// --------------------
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
        work.dataset.image = item["Main Project Image"] || "";
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

// --------------------
// Hover preview (Safari / Chrome safe)
// --------------------
function bindHover() {
  const works = document.querySelectorAll(".work");

  const preview = document.getElementById("hoverPreview");
  const previewImg = preview.querySelector(".image");
  const previewMeta = preview.querySelector(".meta");

  works.forEach(work => {
    work.addEventListener("mouseenter", () => {
      const rect = work.getBoundingClientRect();
      const img = work.dataset.image;
      const title = work.querySelector(".title")?.textContent || "";
      const year = work.querySelector(".year")?.textContent || "";

      // image
      previewImg.style.backgroundImage = `url("${img}")`;

      // meta
      previewMeta.innerHTML = `
        <strong>${title}</strong><br>
        ${year}
      `;

      // 該当タイトルだけ避ける位置調整
      preview.style.top = `${Math.max(64, rect.top - 40)}px`;

      // fade in
      preview.style.opacity = 1;
    });

    work.addEventListener("mouseleave", () => {
      preview.style.opacity = 0;
    });

    work.addEventListener("click", () => {
      // worksページ接続（今は無効でOK）
      // window.location.href = work.dataset.link;
    });
  });
}

