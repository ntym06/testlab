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

  const columns = document.createElement("div");
  columns.className = "index-columns";

  // 左列（上に流れる）
  const colUp = document.createElement("div");
  colUp.className = "column up";

  // 右列（下に流れる）
  const colDown = document.createElement("div");
  colDown.className = "column down";

  const upInner = document.createElement("div");
  upInner.className = "column-inner";

  const downInner = document.createElement("div");
  downInner.className = "column-inner";

  Object.keys(grouped).forEach(type => {
    const makeSection = () => {
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
            section.closest(".column").classList.add("is-paused");
            showPreview(d);
          });

          item.addEventListener("mouseleave", () => {
            section.closest(".column").classList.remove("is-paused");
            hidePreview();
          });

          section.appendChild(item);
        });

      return section;
    };

    upInner.appendChild(makeSection());
    downInner.appendChild(makeSection());
  });

  // 2周分にしてループ
  colUp.appendChild(upInner);
  colUp.appendChild(upInner.cloneNode(true));

  colDown.appendChild(downInner);
  colDown.appendChild(downInner.cloneNode(true));

  columns.appendChild(colUp);
  columns.appendChild(colDown);
  indexEl.appendChild(columns);
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
