import './style.css'

document.documentElement.classList.add('js')

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const motionNodes = document.querySelectorAll('.bg__blob, .commball')
const promo = document.querySelector('.promo__video')

function setMotion(enabled) {
  document.documentElement.classList.toggle('motion-off', !enabled)
  motionNodes.forEach((node) => {
    node.style.animationPlayState = enabled ? 'running' : 'paused'
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

setMotion(!reduceMotion.matches)
tryPlayPromo()

if (promo) {
  promo.addEventListener('loadeddata', tryPlayPromo)
  promo.addEventListener('canplay', tryPlayPromo)
  window.addEventListener('pointerdown', onFirstGesture, { once: true })
  window.addEventListener('touchstart', onFirstGesture, { once: true })
  window.addEventListener('keydown', onFirstGesture, { once: true })
}

reduceMotion.addEventListener('change', (event) => {
  setMotion(!event.matches)
  tryPlayPromo()
})
