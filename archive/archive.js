// ------------------------------------
// Archive Index Script
// CSV → Genre → Year(desc)
// Hover preview in fixed pane
// ------------------------------------
console.log("archive.js loaded");

// DOM
const indexEl = document.getElementById("index");
const previewEl = document.getElementById("hoverPreview");
const previewImg = previewEl.querySelector(".image");
const previewMeta = previewEl.querySelector(".meta");

// CSV読み込み
Papa.parse("./portfolio.csv?ts=" + Date.now(), {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function (results) {
    const data = results.da
