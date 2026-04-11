// Tableau de bord — interactions du portail client

document.addEventListener('DOMContentLoaded', () => {
  initAuth()
  initNav()
  initViews()
  initChat()
  initGalleryFilters()
  setCurrentDate()
})

// ─── Authentification simulée ───────────────────────────────────────────────

function initAuth() {
  const user = getUser()
  if (!user) {
    // Pas de session : rediriger vers connexion
    window.location.href = '/connexion.html'
    return
  }

  // Afficher le nom de l'utilisateur
  const nameEl = document.getElementById('db-user-name')
  const welcomeEl = document.getElementById('welcome-name')
  const avatarEl = document.querySelector('.db-user__avatar')

  if (nameEl) nameEl.textContent = user.nom
  if (welcomeEl) welcomeEl.textContent = user.nom.split(' ')[0]
  if (avatarEl) {
    const initials = user.nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    avatarEl.textContent = initials
  }

  // Déconnexion
  document.getElementById('db-logout')?.addEventListener('click', (e) => {
    e.preventDefault()
    sessionStorage.removeItem('cl_user')
    window.location.href = '/connexion.html'
  })
}

function getUser() {
  try {
    const raw = sessionStorage.getItem('cl_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// ─── Navigation entre vues ──────────────────────────────────────────────────

function initNav() {
  const sidebar = document.getElementById('db-sidebar')
  const burger = document.getElementById('db-burger')
  const navLinks = document.querySelectorAll('.db-nav__link')
  const topbarTitle = document.getElementById('db-topbar-title')

  // Bouton burger mobile
  burger?.addEventListener('click', () => {
    sidebar?.classList.toggle('open')
  })

  // Fermer sidebar au clic à l'extérieur (mobile)
  document.addEventListener('click', (e) => {
    if (sidebar?.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== burger) {
      sidebar.classList.remove('open')
    }
  })

  // Navigation entre vues
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const viewId = link.dataset.view
      if (viewId) {
        switchView(viewId)
        // Fermer sidebar mobile
        sidebar?.classList.remove('open')
      }
    })
  })

  // Liens "Tout voir" → messagerie depuis overview
  document.querySelectorAll('[data-view-link]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      switchView(el.dataset.viewLink)
    })
  })
}

function switchView(viewId) {
  // Désactiver tous les liens et cacher toutes les vues
  document.querySelectorAll('.db-nav__link').forEach(l => l.classList.remove('active'))
  document.querySelectorAll('.db-view').forEach(v => v.classList.remove('active'))

  // Activer la vue et le lien cible
  const targetView = document.getElementById(`view-${viewId}`)
  const targetLink = document.querySelector(`[data-view="${viewId}"]`)

  if (targetView) targetView.classList.add('active')
  if (targetLink) targetLink.classList.add('active')

  // Titre topbar mobile
  const titleEl = document.getElementById('db-topbar-title')
  if (titleEl && targetLink) {
    titleEl.textContent = targetLink.textContent.trim().replace(/\s+\d+$/, '')
  }

  // Si messagerie → marquer les messages comme lus
  if (viewId === 'messagerie') {
    setTimeout(() => markMessagesRead(), 500)
  }

  // Scroll en haut
  document.getElementById('db-main')?.scrollTo({ top: 0, behavior: 'smooth' })
}

// ─── Messagerie ─────────────────────────────────────────────────────────────

function initChat() {
  const form = document.getElementById('chat-form')
  const input = document.getElementById('chat-input')
  const messages = document.getElementById('chat-messages')

  if (!form || !input || !messages) return

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto'
    input.style.height = Math.min(input.scrollHeight, 120) + 'px'
  })

  // Envoyer avec Entrée (Shift+Entrée pour nouvelle ligne)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
  })

  function sendMessage() {
    const text = input.value.trim()
    if (!text) return

    // Créer la bulle du message
    const msg = document.createElement('div')
    msg.className = 'db-chat__msg db-chat__msg--me'
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    msg.innerHTML = `
      <div class="db-chat__msg-bubble">
        <p>${escapeHtml(text)}</p>
        <time>${time}</time>
      </div>
    `
    messages.appendChild(msg)

    // Vider l'input
    input.value = ''
    input.style.height = 'auto'

    // Scroll en bas
    messages.scrollTop = messages.scrollHeight

    // Simulation de réponse automatique après 2s
    setTimeout(() => simulateReply(messages), 2000)
  }

  // Scroll initial en bas des messages
  messages.scrollTop = messages.scrollHeight
}

function markMessagesRead() {
  document.querySelectorAll('.db-chat__msg--unread').forEach(el => {
    el.classList.remove('db-chat__msg--unread')
  })
  // Retirer le badge de messagerie
  const badge = document.querySelector('[data-view="messagerie"] .db-nav__badge')
  if (badge) badge.remove()
}

function simulateReply(container) {
  const replies = [
    "Je prends note, je vous reviens très vite !",
    "Bien reçu. Je vais vérifier cela avec l'atelier et vous tiens informé.",
    "Parfait, merci pour votre retour rapide !",
    "Je confirme, tout est bien noté. On avance comme prévu."
  ]
  const text = replies[Math.floor(Math.random() * replies.length)]
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const msg = document.createElement('div')
  msg.className = 'db-chat__msg db-chat__msg--them'
  msg.innerHTML = `
    <div class="db-chat__msg-avatar">JL</div>
    <div class="db-chat__msg-bubble">
      <p>${text}</p>
      <time>${time}</time>
    </div>
  `
  container.appendChild(msg)
  container.scrollTop = container.scrollHeight
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')
}

// ─── Filtres galerie (index.html) ───────────────────────────────────────────

function initGalleryFilters() {
  const filters = document.querySelectorAll('.gallery__filter')
  const items = document.querySelectorAll('.gallery__item[data-style]')

  if (!filters.length || !items.length) return

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'))
      btn.classList.add('active')

      const filter = btn.dataset.filter

      items.forEach(item => {
        if (filter === 'all' || item.dataset.style === filter) {
          item.style.display = ''
        } else {
          item.style.display = 'none'
        }
      })
    })
  })
}

// ─── Date du jour ───────────────────────────────────────────────────────────

function setCurrentDate() {
  const el = document.getElementById('current-date')
  if (!el) return
  el.textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}
