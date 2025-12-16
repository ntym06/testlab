const text = document.getElementById('text');
const langs = document.querySelectorAll('.lang');
const buttons = document.querySelectorAll('.ui span');
const bg = document.querySelector('.bg');

/* ===== 言語ごとの色 ===== */
const gradients = {
  en: ['#eef3fa', '#f5f5f5', '#e8eef7'],
  ja: ['#f6f1e7', '#efe7d8', '#f2ede2'],
  de: ['#f5f5f5', '#ffffff', '#eeeeee']
};

function setLang(lang) {
  langs.forEach(l => l.classList.remove('active'));
  document.querySelector('.lang.' + lang).classList.add('active');

  const g = gradients[lang];
  bg.style.background = `
    linear-gradient(
      120deg,
      ${g[0]},
      ${g[1]},
      ${g[2]}
    )
  `;

  text.style.opacity = 1;
  text.style.filter = 'blur(0px)';
}

/* 初期言語 */
const initial =
  navigator.language.startsWith('ja') ? 'ja' :
  navigator.language.startsWith('de') ? 'de' : 'en';
setLang(initial);

/* UI */
buttons.forEach(b => {
  b.addEventListener('click', () => {
    setLang(b.dataset.lang);
  });
});

/* ===== 背景グラデーションのゆっくり移動 ===== */
let t = 0;
function animateBg() {
  t += 0.0004;
  const x = Math.sin(t) * 50 + 50;
  const y = Math.cos(t) * 50 + 50;
  bg.style.backgroundPosition = `${x}% ${y}%`;
  requestAnimationFrame(animateBg);
}
animateBg();

/* ===== スクロールで溶ける ===== */
window.addEventListener('scroll', () => {
  const p =
    document.documentElement.scrollTop /
    (document.documentElement.scrollHeight -
     document.documentElement.clientHeight);

  const v = Math.min(p * 2, 1);
  text.style.opacity = 1 - v;
  text.style.filter = `blur(${v * 6}px)`;
});
