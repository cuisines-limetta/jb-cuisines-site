// Administration — Cuisines Limetta
import { initTheme } from './theme.js'
initTheme()

// ── Date ──────────────────────────────────────────────────────────────────────
const dateEl = document.getElementById('current-date')
if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

// ── Navigation sidebar ────────────────────────────────────────────────────────
const navLinks   = document.querySelectorAll('.db-nav__link[data-view]')
const views      = document.querySelectorAll('.db-view')
const topbarTitle = document.getElementById('db-topbar-title')

const VIEW_LABELS = {
  dashboard:  'Vue d\'ensemble',
  clients:    'Clients',
  projets:    'Projets',
  messagerie: 'Messagerie',
  devis:      'Demandes de devis',
  galerie:    'Galerie',
}

function switchView (viewId) {
  views.forEach(v => v.classList.remove('active'))
  navLinks.forEach(l => l.classList.remove('active'))

  const target = document.getElementById('view-' + viewId)
  const link   = document.querySelector(`.db-nav__link[data-view="${viewId}"]`)

  if (target) target.classList.add('active')
  if (link)   link.classList.add('active')
  if (topbarTitle) topbarTitle.textContent = VIEW_LABELS[viewId] || viewId

  // Fermer sidebar mobile
  document.getElementById('db-sidebar')?.classList.remove('open')
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault()
    switchView(link.dataset.view)
  })
})

// Liens "Tout voir →" dans les cartes du dashboard
document.querySelectorAll('[data-view-link]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault()
    switchView(el.dataset.viewLink)
  })
})

// ── Burger mobile ─────────────────────────────────────────────────────────────
document.getElementById('db-burger')?.addEventListener('click', () => {
  document.getElementById('db-sidebar')?.classList.toggle('open')
})

// ── Modal fiche client ────────────────────────────────────────────────────────
const modalClient = document.getElementById('modal-client')

const CLIENTS = {
  'Martin Dubois':   { email: 'martin.dubois@gmail.com',  tel: '06 12 34 56 78', status: 'En cours', statusClass: 'status-badge--active' },
  'Claire Morin':    { email: 'claire.morin@yahoo.fr',    tel: '07 89 01 23 45', status: 'En cours', statusClass: 'status-badge--active' },
  'Paul Leroy':      { email: 'p.leroy@orange.fr',        tel: '06 45 67 89 01', status: 'En cours', statusClass: 'status-badge--active' },
  'Isabelle Faure':  { email: 'isabelle.faure@gmail.com', tel: '06 22 33 44 55', status: 'Pose',     statusClass: 'status-badge--success' },
  'Sophie Renard':   { email: 's.renard@hotmail.fr',      tel: '07 66 77 88 99', status: 'Devis envoyé', statusClass: '' },
  'Thomas Petit':    { email: 'thomas.petit@gmail.com',   tel: '06 11 22 33 44', status: 'Terminé',  statusClass: 'status-badge--grey' },
  'Anne Bernard':    { email: 'anne.bernard@sfr.fr',      tel: '06 99 88 77 66', status: 'Terminé',  statusClass: 'status-badge--grey' },
}

document.querySelectorAll('.adm-table__action[data-client]').forEach(btn => {
  btn.addEventListener('click', () => {
    const name   = btn.dataset.client
    const data   = CLIENTS[name]
    if (!data || !modalClient) return

    document.getElementById('modal-client-name').textContent = name
    document.getElementById('fiche-email').textContent  = data.email
    document.getElementById('fiche-tel').textContent    = data.tel
    document.getElementById('fiche-login').textContent  = data.email
    const statusEl = document.getElementById('fiche-status')
    statusEl.textContent = data.status
    statusEl.className   = 'status-badge ' + data.statusClass

    modalClient.style.display = 'flex'
  })
})

document.getElementById('modal-close')?.addEventListener('click', () => {
  modalClient.style.display = 'none'
})
document.getElementById('modal-backdrop')?.addEventListener('click', () => {
  modalClient.style.display = 'none'
})

// ── Modal nouveau client ──────────────────────────────────────────────────────
const modalNew = document.getElementById('modal-new-client')

document.getElementById('btn-new-client')?.addEventListener('click', () => {
  modalNew.style.display = 'flex'
})

function closeModalNew () { modalNew.style.display = 'none' }
document.getElementById('modal-new-close')?.addEventListener('click', closeModalNew)
document.getElementById('modal-new-backdrop')?.addEventListener('click', closeModalNew)
document.getElementById('btn-cancel-new')?.addEventListener('click', closeModalNew)

document.getElementById('form-new-client')?.addEventListener('submit', e => {
  e.preventDefault()
  closeModalNew()
  // Toast de confirmation
  showToast('Client créé — invitation envoyée par email.')
})

// ── Filtre projets ────────────────────────────────────────────────────────────
document.querySelectorAll('.adm-filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.adm-filter-tab').forEach(t => t.classList.remove('active'))
    tab.classList.add('active')
    const filter = tab.dataset.filter
    document.querySelectorAll('.adm-project-card').forEach(card => {
      if (filter === 'all' || card.dataset.status === filter) {
        card.style.display = ''
      } else {
        card.style.display = 'none'
      }
    })
  })
})

// ── Chat admin ────────────────────────────────────────────────────────────────
const admChatForm   = document.getElementById('adm-chat-form')
const admChatInput  = document.getElementById('adm-chat-input')
const admChatMsgs   = document.getElementById('adm-chat-messages')

admChatInput?.addEventListener('input', () => {
  admChatInput.style.height = 'auto'
  admChatInput.style.height = Math.min(admChatInput.scrollHeight, 120) + 'px'
})

admChatForm?.addEventListener('submit', e => {
  e.preventDefault()
  const text = admChatInput.value.trim()
  if (!text) return
  const bubble = document.createElement('div')
  bubble.className = 'db-chat__msg db-chat__msg--me'
  bubble.innerHTML = `<div class="db-chat__msg-bubble"><p>${text}</p><time>${new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</time></div>`
  admChatMsgs.appendChild(bubble)
  admChatInput.value = ''
  admChatInput.style.height = 'auto'
  admChatMsgs.scrollTop = admChatMsgs.scrollHeight
})

// Sélection conversation
document.querySelectorAll('.adm-chat-list__item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.adm-chat-list__item').forEach(i => i.classList.remove('active'))
    item.classList.add('active')
    item.querySelector('.adm-chat-list__unread')?.remove()
    item.classList.remove('adm-chat-list__item--unread')
  })
})

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast (msg) {
  const t = document.createElement('div')
  t.className = 'adm-toast'
  t.textContent = msg
  document.body.appendChild(t)
  requestAnimationFrame(() => { t.classList.add('adm-toast--visible') })
  setTimeout(() => {
    t.classList.remove('adm-toast--visible')
    setTimeout(() => t.remove(), 400)
  }, 3000)
}

// Styles toast injectés dynamiquement
const toastStyle = document.createElement('style')
toastStyle.textContent = `
.adm-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%) translateY(12px);
  background: var(--marine);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 9999;
  pointer-events: none;
}
.adm-toast--visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
`
document.head.appendChild(toastStyle)
