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
  contenu:    'Contenu du site',
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

// ── Éditeur de contenu ────────────────────────────────────────────────────────

// Onglets contenu
document.querySelectorAll('.adm-content-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.adm-content-tab').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('.adm-content-panel').forEach(p => p.classList.remove('active'))
    tab.classList.add('active')
    document.getElementById('tab-' + tab.dataset.tab)?.classList.add('active')
  })
})

// Marquer les champs modifiés
document.querySelectorAll('[data-field]').forEach(field => {
  const original = field.value
  field.addEventListener('input', () => {
    field.classList.toggle('is-modified', field.value !== original)
    updatePublishBtn()
  })
})

function updatePublishBtn () {
  const hasChanges = document.querySelectorAll('.is-modified').length > 0
  const btn = document.getElementById('btn-publish')
  if (btn) btn.classList.toggle('btn--has-changes', hasChanges)
}

// Compteur de caractères SEO
document.querySelectorAll('[data-max]').forEach(hint => {
  const field = hint.previousElementSibling
  if (!field) return
  const max = parseInt(hint.dataset.max)
  const update = () => {
    const len = field.value.length
    hint.textContent = `${len} / ${max} caractères recommandés`
    hint.classList.toggle('over', len > max)
  }
  field.addEventListener('input', update)
  update()
})

// ── Publication réelle via /api/content ───────────────────────────────────────

function buildPayload () {
  const payload = {}
  document.querySelectorAll('[data-field].is-modified').forEach(field => {
    const keys = field.dataset.field.split('.')
    let node = payload
    for (let i = 0; i < keys.length - 1; i++) {
      node[keys[i]] = node[keys[i]] || {}
      node = node[keys[i]]
    }
    node[keys[keys.length - 1]] = field.value
  })
  return payload
}

async function publishContent (token) {
  const payload = buildPayload()
  const res = await fetch('/api/content', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  return res
}

// Modal de mot de passe admin
const modalAuth = document.getElementById('modal-auth')
const modalAuthForm = document.getElementById('modal-auth-form')
const modalAuthClose = document.getElementById('modal-auth-close')
const modalAuthError = document.getElementById('modal-auth-error')

function openAuthModal () { if (modalAuth) modalAuth.style.display = 'flex' }
function closeAuthModal () { if (modalAuth) modalAuth.style.display = 'none' }

modalAuthClose?.addEventListener('click', closeAuthModal)
document.getElementById('modal-auth-backdrop')?.addEventListener('click', closeAuthModal)

modalAuthForm?.addEventListener('submit', async e => {
  e.preventDefault()
  const password = document.getElementById('admin-password').value
  if (modalAuthError) modalAuthError.style.display = 'none'

  try {
    const res = await fetch('/api/admin-login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password }),
    })
    if (!res.ok) {
      if (modalAuthError) modalAuthError.style.display = 'block'
      return
    }
    const { token } = await res.json()
    sessionStorage.setItem('admin_token', token)
    closeAuthModal()
    document.getElementById('admin-password').value = ''
    // Relancer la publication maintenant qu'on a le token
    doPublish(token)
  } catch {
    if (modalAuthError) modalAuthError.style.display = 'block'
  }
})

async function doPublish (token) {
  const modified = document.querySelectorAll('[data-field].is-modified')
  if (modified.length === 0) {
    showToast('Aucune modification à publier.')
    return
  }
  try {
    const res = await publishContent(token)
    if (res.status === 401) {
      // Token expiré ou invalide
      sessionStorage.removeItem('admin_token')
      openAuthModal()
      return
    }
    if (!res.ok) {
      showToast('Erreur serveur — veuillez réessayer.')
      return
    }
    modified.forEach(f => f.classList.remove('is-modified'))
    updatePublishBtn()
    showToast(`${modified.length} modification${modified.length > 1 ? 's' : ''} publiée${modified.length > 1 ? 's' : ''} avec succès.`)
  } catch {
    showToast('Impossible de joindre le serveur.')
  }
}

document.getElementById('btn-publish')?.addEventListener('click', () => {
  const modified = document.querySelectorAll('[data-field].is-modified')
  if (modified.length === 0) {
    showToast('Aucune modification à publier.')
    return
  }
  const token = sessionStorage.getItem('admin_token')
  if (!token) {
    openAuthModal()
  } else {
    doPublish(token)
  }
})

// Preview photo au changement
document.querySelectorAll('.adm-upload-input').forEach(input => {
  input.addEventListener('change', () => {
    if (!input.files?.length) return
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = e => {
      const preview = input.closest('.adm-photo-editor, .adm-gallery-editor__add')
                          ?.querySelector('.adm-photo-preview, .adm-gallery-editor__thumb')
      if (!preview) return
      preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;">`
      showToast('Photo sélectionnée — cliquez sur "Publier" pour l\'appliquer.')
    }
    reader.readAsDataURL(file)
  })
})

// Suppression photos galerie
document.querySelectorAll('.adm-gallery-editor__del').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.adm-gallery-editor__item')
    item.style.transition = 'opacity 0.2s, transform 0.2s'
    item.style.opacity = '0'
    item.style.transform = 'translateX(8px)'
    setTimeout(() => item.remove(), 200)
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
