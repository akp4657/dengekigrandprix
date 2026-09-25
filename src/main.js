import './style.css'

document.documentElement.classList.add('js')

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const blobs = document.querySelectorAll('.bg__blob')
const promo = document.querySelector('.promo__video')

function setGradientMotion(enabled) {
  document.documentElement.classList.toggle('motion-off', !enabled)
  blobs.forEach((blob) => {
    blob.style.animationPlayState = enabled ? 'running' : 'paused'
  })
}

async function tryPlayPromo() {
  if (!promo || reduceMotion.matches) {
    promo?.pause()
    return
  }

  promo.muted = true
  promo.defaultMuted = true
  promo.setAttribute('muted', '')
  promo.playsInline = true

  try {
    await promo.play()
  } catch {
    // Autoplay may still fail until a gesture; retry on first interaction.
  }
}

function onFirstGesture() {
  tryPlayPromo()
  window.removeEventListener('pointerdown', onFirstGesture)
  window.removeEventListener('touchstart', onFirstGesture)
  window.removeEventListener('keydown', onFirstGesture)
}

setGradientMotion(!reduceMotion.matches)
tryPlayPromo()

if (promo) {
  promo.addEventListener('loadeddata', tryPlayPromo)
  promo.addEventListener('canplay', tryPlayPromo)
  window.addEventListener('pointerdown', onFirstGesture, { once: true })
  window.addEventListener('touchstart', onFirstGesture, { once: true })
  window.addEventListener('keydown', onFirstGesture, { once: true })
}

reduceMotion.addEventListener('change', (event) => {
  setGradientMotion(!event.matches)
  tryPlayPromo()
})
