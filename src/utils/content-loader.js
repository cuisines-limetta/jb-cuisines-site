// Chargement et application du contenu dynamique depuis /api/content
// Les éléments du DOM avec data-content="section.key" sont mis à jour automatiquement.
// Les attributs href et src utilisent data-content-href et data-content-src.

export async function loadContent () {
  let data
  try {
    const res = await fetch('/api/content')
    if (!res.ok) return
    data = await res.json()
  } catch {
    return // pas de serveur (dev local / build statique) → contenu HTML par défaut
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function resolve (path) {
    return path.split('.').reduce((obj, key) => obj?.[key], data)
  }

  // ── Texte (data-content="section.key") ────────────────────────────────────
  document.querySelectorAll('[data-content]').forEach(el => {
    const val = resolve(el.dataset.content)
    if (val != null) el.textContent = val
  })

  // ── Href (data-content-href="section.key") ────────────────────────────────
  // Valeur spéciale "site.emailContactHref" → construit mailto: automatiquement
  document.querySelectorAll('[data-content-href]').forEach(el => {
    const key = el.dataset.contentHref
    if (key === 'site.emailContactHref') {
      const email = resolve('site.emailContact')
      if (email) el.href = `mailto:${email}`
    } else {
      const val = resolve(key)
      if (val != null) el.href = val
    }
  })

  // ── Src (data-content-src="section.key") ──────────────────────────────────
  document.querySelectorAll('[data-content-src]').forEach(el => {
    const val = resolve(el.dataset.contentSrc)
    if (val != null) el.src = val
  })

  // ── <title> et <meta description> ─────────────────────────────────────────
  if (data.seo?.title)       document.title = data.seo.title
  if (data.seo?.description) {
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.content = data.seo.description
  }
}
