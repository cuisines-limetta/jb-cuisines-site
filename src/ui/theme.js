// Gestion du mode sombre — persistance via localStorage

const STORAGE_KEY = 'cl_theme'

export function initTheme() {
  applyTheme(getSavedTheme())
  initToggle()
}

function getSavedTheme() {
  return localStorage.getItem(STORAGE_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  updateToggleIcon(theme)
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme
  const next = current === 'dark' ? 'light' : 'dark'
  localStorage.setItem(STORAGE_KEY, next)
  applyTheme(next)
}

function updateToggleIcon(theme) {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre')
    const sun = btn.querySelector('.icon-sun')
    const moon = btn.querySelector('.icon-moon')
    if (sun) sun.style.display = theme === 'dark' ? 'block' : 'none'
    if (moon) moon.style.display = theme === 'dark' ? 'none' : 'block'
  })
}

function initToggle() {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme)
  })
}

// Script anti-flash à injecter dans le <head> (utilisé via attribut inline)
// Applique le thème avant le premier rendu
export const ANTI_FLASH_SCRIPT = `
(function(){
  var t = localStorage.getItem('cl_theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = t;
})();
`
