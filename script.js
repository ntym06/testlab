const text = document.getElementById('text');
const bg   = document.getElementById('bg');
const langs = document.querySelectorAll('.lang');
const buttons = document.querySelectorAll('.ui span');

/* 言語ごとのグラデーション */
const gradients = {
  en: [
    'rgb(238,243,250)',
    'rgb(232,237,245)',
    'rgb(245,247,251)'
  ],
  ja: [
    'rgb(246,241,231)',
    'rgb(239,233,222)',
    'rgb(250,247,240)'
  ],
  de: [
    'rgb(245,245,245)',
    'rgb(235,235,235)',
    'rgb(255,255,255)'
  ]
};

function setLang(lang) {
  langs.forEach(l => l.classList.remove('active'));
  const target = document.querySelector('.lang.' + lang);
  if (target) target.classList.add('active');

  const [c1, c2, c3] = gradients[lang];
  bg.style.background =
    `linear-gradient(120deg, ${c1}, ${c2}, ${c3})`;

  text.style.opacity = 1;
  text.style.filter = 'blur(0px)';
}

const initial =
  navigator.language.startsWith('ja') ? 'ja' :
  navigator.language.startsWith('de') ? 'de' : 'en';

setLang(initial);

buttons.forEach(b => {
  b.addEventListener('click', () => {
    setLang(b.dataset.lang);
  });
});

window.addEventListener('scroll', () => {
  const t = Math.min(scrollY / 400, 1);
  text.style.opacity = 1 - t;
  text.style.filter = `blur(${t * 6}px)`;
});
