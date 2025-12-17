console.log("archive.js loaded");

const indexEl = document.getElementById("index");
const preview = document.getElementById("preview");
const previewImg = preview.querySelector(".image");
const previewMeta = preview.querySelector(".meta");

// CSV読み込み
Papa.parse("./portfolio.csv?ts=" + Date.now(), {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: res => buildIndex(res.data)
});

// --------------------
// Build index
// --------------------
function buildIndex(data) {
  const grouped = {};

  data.forEach(d => {
    if (!d.Title || !d.Type || !d.Year) return;
    grouped[d.Type] ||= [];
    grouped[d.Type].push(d);
  });

  const inner = document.createElement("div");
  inner.className = "index-inner";

  Object.keys(grouped).forEach(type => {
    const section = document.createElement("section");
    section.className = "genre";
    section.innerHTML = `<h2>${type}</h2>`;

    grouped[type]
      .sort((a, b) => Number(b.Year) - Number(a.Year))
      .forEach(d => {
        const item = document.createElement("div");
        item.className = "work";
        item.textContent = `${d.Year} ${d.Title}`;

        item.addEventListener("mouseenter", () => {
          inner.classList.add("is-paused");
          showPreview(d);
        });

        item.addEventListener("mouseleave", () => {
          inner.classList.remove("is-paused");
          hidePreview();
        });

        section.appendChild(item);
      });

    inner.appendChild(section);
  });

  // 2帯分にして無限ループ風
  indexEl.appendChild(inner);
  indexEl.appendChild(inner.cloneNode(true));
}

// --------------------
// Preview control
// --------------------
function showPreview(d) {
  if (!d["Main Project Image"]) return;

  previewImg.style.backgroundImage =
    `url("${d["Main Project Image"]}")`;

  previewMeta.innerHTML = `
    <strong>${d.Title}</strong><br>
    ${d.Year}
  `;

  preview.classList.add("is-visible");
}

function hidePreview() {
  preview.classList.remove("is-visible");
}
