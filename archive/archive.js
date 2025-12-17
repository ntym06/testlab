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
let hoverTimer = null;
let lastHoveredData = null;

function buildIndex(data) {
  const grouped = {};

  data.forEach(d => {
    if (!d.Title || !d.Type || !d.Year) return;
    grouped[d.Type] ||= [];
    grouped[d.Type].push(d);
  });

  const columns = document.createElement("div");
  columns.className = "index-columns";

  const leftCol = document.createElement("div");
  leftCol.className = "column left-column";

  const rightCol = document.createElement("div");
  rightCol.className = "column right-column";

  const leftInner = document.createElement("div");
  leftInner.className = "column-inner";

  const rightInner = document.createElement("div");
  rightInner.className = "column-inner";

  Object.keys(grouped).forEach(type => {
    const makeSection = () => {
      const sec = document.createElement("section");
      sec.className = "genre";
      sec.innerHTML = `<h2>${type}</h2>`;

      grouped[type]
        .sort((a, b) => Number(b.Year) - Number(a.Year))
        .forEach(d => {
          const item = document.createElement("div");
          item.className = "work";
          item.textContent = `${d.Year} ${d.Title}`;

          // hover中：画像をパラパラ切り替える
          item.addEventListener("mouseenter", () => {
            lastHoveredData = d;
            startPreviewShuffle(d);
          });

          item.addEventListener("mouseleave", () => {
            stopPreviewShuffle();
          });

          // クリック（後でモーダル）
          item.addEventListener("click", () => {
            // openWorkModal(d);
          });

          sec.appendChild(item);
        });

      return sec;
    };

    leftInner.appendChild(makeSection());
    rightInner.appendChild(makeSection());
  });

  // 無限ループ用に複製
  leftCol.append(leftInner, leftInner.cloneNode(true));
  rightCol.append(rightInner, rightInner.cloneNode(true));

  columns.append(leftCol, rightCol);
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
