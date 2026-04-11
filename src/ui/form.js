// Gestion du formulaire de contact
// Envoie les données vers /api/contact (server.js → SMTP Infomaniak)

export function initForm() {
  const form = document.getElementById('contact-form')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const btn     = form.querySelector('button[type="submit"]')
    const btnText = btn.querySelector('.btn-text')

    // Validation côté client
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

    btn.disabled = true
    btnText.textContent = 'Envoi en cours…'

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom:    form.prenom.value.trim(),
          nom:       form.nom.value.trim(),
          email:     form.email.value.trim(),
          telephone: form.telephone?.value.trim() || '',
          style:     form.style?.value || '',
          message:   form.message.value.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erreur serveur')

      form.reset()
      showMessage(form, 'Votre demande a bien été envoyée ! Je vous recontacterai sous 24h.', 'success')

    } catch (err) {
      showMessage(form, err.message || 'Une erreur est survenue. Contactez-nous directement par téléphone.', 'error')
    } finally {
      btn.disabled = false
      btnText.textContent = 'Envoyer ma demande'
    }
  })

  // Retirer la classe error à la saisie
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'))
  })
}

function showMessage(form, text, type) {
  const existing = form.querySelector('.form-message')
  if (existing) existing.remove()

  const msg = document.createElement('p')
  msg.className = `form-message form-message--${type}`
  msg.textContent = text

  Object.assign(msg.style, {
    marginTop:    '16px',
    padding:      '14px 20px',
    borderRadius: '4px',
    fontSize:     '14px',
    textAlign:    'center',
    background:   type === 'success' ? '#edf7df' : '#fdecea',
    color:        type === 'success' ? '#3a6b0a' : '#c62828',
    border:       `1px solid ${type === 'success' ? '#95c13b' : '#f5a9a9'}`,
  })

  form.appendChild(msg)
  setTimeout(() => msg.remove(), 8000)
}
