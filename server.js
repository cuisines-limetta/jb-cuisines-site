// Serveur Express — Cuisines Limetta
// Sert le site statique + traite le formulaire de contact via SMTP Infomaniak

import express         from 'express'
import nodemailer      from 'nodemailer'
import path            from 'path'
import { fileURLToPath } from 'url'
import { exec }          from 'child_process'
import { SITE, EMAIL_CLIENT, EMAIL_ADMIN } from './contenu.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app  = express()
const PORT = process.env.PORT || 3000

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'dist')))

// ─── Transporteur SMTP Infomaniak ─────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   'mail.infomaniak.com',
  port:   465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fill = (str, vars) =>
  str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')

// ─── Route POST /api/contact ──────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { prenom, nom, email, telephone, style, message } = req.body

  if (!prenom || !nom || !email || !message) {
    return res.status(400).json({ error: 'Champs obligatoires manquants.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide.' })
  }

  try {
    // ── Email reçu par Jordan ────────────────────────────────────────────────
    await transporter.sendMail({
      from:    `"Formulaire ${SITE.nom}" <${SITE.emailFormulaire}>`,
      to:      SITE.emailContact,
      replyTo: email,
      subject: fill(EMAIL_ADMIN.sujet, { prenom, nom }),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f7f6f1;">
          <div style="background:#24336a;padding:24px 32px;border-radius:8px 8px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:20px;font-weight:400;">Nouvelle demande de devis</h1>
            <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:14px;">${SITE.url}</p>
          </div>
          <div style="background:#fff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e8e7e0;border-top:none;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0efea;font-size:13px;color:#888880;width:140px;">Nom</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0efea;font-size:15px;color:#1a1a16;font-weight:500;">${prenom} ${nom}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0efea;font-size:13px;color:#888880;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0efea;font-size:15px;"><a href="mailto:${email}" style="color:#95c13b;">${email}</a></td>
              </tr>
              ${telephone ? `<tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0efea;font-size:13px;color:#888880;">Téléphone</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0efea;font-size:15px;color:#1a1a16;">${telephone}</td>
              </tr>` : ''}
              ${style ? `<tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0efea;font-size:13px;color:#888880;">Style souhaité</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0efea;font-size:15px;color:#1a1a16;text-transform:capitalize;">${style}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:10px 0;font-size:13px;color:#888880;vertical-align:top;">Message</td>
                <td style="padding:10px 0;font-size:15px;color:#1a1a16;line-height:1.6;">${message.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
            <div style="margin-top:28px;padding:16px 20px;background:#edf7df;border-radius:6px;border-left:3px solid #95c13b;">
              <p style="margin:0;font-size:13px;color:#3a6b0a;">${fill(EMAIL_ADMIN.note, { prenom, nom })}</p>
            </div>
          </div>
        </div>`,
    })

    // ── Email de confirmation au client ──────────────────────────────────────
    const LOGO_URL   = `${SITE.url}/logo%20minimaliste%20vectoris%C3%A9.svg`
    const styleData  = style ? (EMAIL_CLIENT.styles[style] || EMAIL_CLIENT.styles.autre) : null

    const styleBanner = styleData ? `
      <div style="margin:28px 0 0;border-radius:8px;overflow:hidden;">
        <div style="background:${styleData.bg};padding:28px 32px;text-align:center;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${styleData.text};opacity:0.7;">Style souhaité</p>
          <p style="margin:0;font-size:28px;font-weight:300;color:${styleData.text};font-family:Georgia,serif;font-style:italic;">${styleData.label}</p>
        </div>
        <div style="background:#f7f6f1;padding:14px 24px;text-align:center;">
          <p style="margin:0;font-size:13px;color:#888880;">${EMAIL_CLIENT.style_sous_titre}</p>
        </div>
      </div>` : ''

    const messageRecap = `
      <div style="margin-top:28px;background:#f7f6f1;border-radius:8px;padding:24px;">
        <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#95c13b;font-weight:600;">${EMAIL_CLIENT.recap_label}</p>
        <p style="margin:0;font-size:14px;color:#444;line-height:1.75;font-style:italic;">"${message.replace(/\n/g, '<br>')}"</p>
      </div>`

    await transporter.sendMail({
      from:    `"${SITE.nom}" <${SITE.emailFormulaire}>`,
      to:      email,
      subject: fill(EMAIL_CLIENT.sujet, { prenom }),
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0efe9;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0efe9;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- LOGO -->
  <tr><td style="text-align:center;padding-bottom:28px;">
    <img src="${LOGO_URL}" alt="${SITE.nom}" height="56" style="height:56px;display:inline-block;">
  </td></tr>

  <!-- CARTE -->
  <tr><td style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- EN-TÊTE -->
    <div style="background:#24336a;padding:40px 40px 32px;text-align:center;">
      <p style="margin:0 0 12px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.55);">Confirmation de demande</p>
      <h1 style="margin:0;font-size:32px;font-weight:300;color:#fff;font-family:Georgia,serif;line-height:1.2;">
        ${fill(EMAIL_CLIENT.titre_ligne1, { prenom })}<br>
        <em style="font-style:italic;color:#95c13b;">${EMAIL_CLIENT.titre_ligne2}</em>
      </h1>
    </div>

    <!-- CORPS -->
    <div style="padding:36px 40px;">
      <p style="margin:0 0 20px;font-size:16px;color:#1a1a16;line-height:1.7;">${EMAIL_CLIENT.paragraphe1}</p>
      <p style="margin:0 0 28px;font-size:15px;color:#888880;line-height:1.7;">${EMAIL_CLIENT.paragraphe2}</p>

      ${styleBanner}
      ${messageRecap}

      <div style="border-top:1px solid #e8e7e0;margin:36px 0;"></div>

      <!-- BOUTONS -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:8px;" width="50%">
            <a href="${SITE.url}/#realisations"
               style="display:block;text-align:center;padding:16px 20px;background:#24336a;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;letter-spacing:0.03em;">
              ${EMAIL_CLIENT.bouton_realisations}
            </a>
          </td>
          <td style="padding-left:8px;" width="50%">
            <a href="${SITE.telephoneHref}"
               style="display:block;text-align:center;padding:16px 20px;background:#95c13b;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;letter-spacing:0.03em;">
              ${EMAIL_CLIENT.bouton_appel}
            </a>
          </td>
        </tr>
      </table>

      <div style="border-top:1px solid #e8e7e0;margin:36px 0 28px;"></div>

      <!-- SIGNATURE -->
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:20px;vertical-align:top;">
            <div style="width:52px;height:52px;border-radius:50%;background:#24336a;text-align:center;line-height:52px;">
              <span style="color:#fff;font-size:18px;font-weight:600;font-family:Georgia,serif;">${SITE.initiales}</span>
            </div>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 3px;font-size:15px;color:#1a1a16;font-weight:600;">${SITE.prenom} ${SITE.nom_}</p>
            <p style="margin:0 0 3px;font-size:13px;color:#95c13b;">${SITE.nom}</p>
            <p style="margin:0;font-size:13px;color:#888880;">${SITE.telephone}</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- BANDE VERTE -->
    <div style="background:#95c13b;padding:16px 40px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#fff;letter-spacing:0.05em;font-style:italic;">${EMAIL_CLIENT.citation}</p>
    </div>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:24px 0;text-align:center;">
    <p style="margin:0 0 6px;font-size:12px;color:#aaa;">${SITE.adresse}</p>
    <p style="margin:0;font-size:12px;color:#aaa;">
      <a href="mailto:${SITE.emailContact}" style="color:#95c13b;text-decoration:none;">${SITE.emailContact}</a>
      &nbsp;·&nbsp;
      <a href="${SITE.url}" style="color:#aaa;text-decoration:none;">cuisines-limetta.com</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
    })

    res.json({ success: true })

  } catch (err) {
    console.error('[SMTP]', err.message)
    res.status(500).json({ error: "Erreur lors de l'envoi. Veuillez réessayer." })
  }
})

// ─── Route POST /deploy — déploiement automatique via webhook GitHub ──────────
app.post('/deploy', (req, res) => {
  if (req.query.token !== process.env.DEPLOY_TOKEN) {
    return res.status(401).end()
  }
  res.status(200).end()

  exec(`cd "${__dirname}" && git pull && npm run build`, (err, stdout) => {
    if (err) { console.error('[DEPLOY] Erreur:', err.message); return }
    console.log('[DEPLOY] Build terminé:\n', stdout.trim())
    process.exit(1) // Code 1 force le redémarrage automatique par Infomaniak
  })
})

// ─── Fallback — toutes les routes renvoient index.html ────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`✓ ${SITE.nom} — serveur démarré sur http://localhost:${PORT}`)
})
