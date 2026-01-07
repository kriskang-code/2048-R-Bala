// js/time_pressure.js
(function () {

  const MOVE_LIMIT_MS = 5000

  let remainingMs = MOVE_LIMIT_MS
  let timer = null
  let lastTick = null
  let enabled = true

  function getRandomDirection() {
    return Math.floor(Math.random() * 4)
  }

  function ensureTimerUI() {
    let el = document.getElementById("timePressureTimer")
    if (!el) {
      el = document.createElement("div")
      el.id = "timePressureTimer"
      el.style.marginTop = "8px"
      el.style.fontSize = "16px"
      el.style.fontWeight = "600"
      el.textContent = "Next move in: 5.0s"
      const container = document.querySelector(".scores-container") || document.body
      container.parentNode.insertBefore(el, container.nextSibling)
    }
    return el
  }

  function setUI(ms) {
    const el = ensureTimerUI()
    el.textContent = `Next move in: ${(ms / 1000).toFixed(1)}s`
  }

  function reset() {
    remainingMs = MOVE_LIMIT_MS
    lastTick = performance.now()
    setUI(remainingMs)
  }

  function tick(inputManager) {
    if (!enabled) return
    const now = performance.now()
    const dt = now - (lastTick ?? now)
    lastTick = now
    remainingMs -= dt

    if (remainingMs <= 0) {
      // Force a RANDOM move via the game's own event system
      inputManager.emit("move", getRandomDirection())
      reset()
      return
    }

    setUI(remainingMs)
  }

  window.attachTimePressure = function (inputManager) {

    inputManager.on("move", function () {
      reset()
    })

    inputManager.on("restart", function () {
      reset()
    })

    reset()
    clearInterval(timer)
    timer = setInterval(function () {
      tick(inputManager)
    }, 100)
  }
})()
