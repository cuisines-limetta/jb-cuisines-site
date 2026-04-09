// Gestion du formulaire de contact

export function initForm() {
  const form = document.getElementById('contact-form')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const btn = form.querySelector('button[type="submit"]')
    const btnText = btn.querySelector('.btn-text')

    // Validation simple
    const required = form.querySelectorAll('[required]')
    let valid = true

    required.forEach(field => {
      field.classList.remove('error')
      if (!field.value.trim()) {
        field.classList.add('error')
        valid = false
      }
    })

    if (!valid) {
      showMessage(form, 'Veuillez remplir tous les champs obligatoires.', 'error')
      return
    }

    // État chargement
    btn.disabled = true
    btnText.textContent = 'Envoi en cours…'

    // Simulation d'envoi (à remplacer par un vrai appel API / Formspree)
    await new Promise(resolve => setTimeout(resolve, 1400))

    btn.disabled = false
    btnText.textContent = 'Envoyer ma demande'
    form.reset()
    showMessage(form, 'Votre demande a bien été envoyée. Nous vous recontacterons sous 24h !', 'success')
  })
}

function showMessage(form, text, type) {
  const existing = form.querySelector('.form-message')
  if (existing) existing.remove()

  const msg = document.createElement('p')
  msg.className = `form-message form-message--${type}`
  msg.textContent = text

  // Style inline pour éviter une dépendance CSS supplémentaire
  Object.assign(msg.style, {
    marginTop: '16px',
    padding: '14px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '400',
    textAlign: 'center',
    background: type === 'success' ? '#edf7df' : '#fdecea',
    color: type === 'success' ? '#3a6b0a' : '#c62828',
    border: `1px solid ${type === 'success' ? '#95c13b' : '#f5a9a9'}`
  })

  form.appendChild(msg)

  // Disparaît après 6 secondes
  setTimeout(() => msg.remove(), 6000)
}
