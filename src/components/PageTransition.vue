<template>
  <transition name="page" mode="out-in" @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <slot></slot>
  </transition>
  <transition name="fade">
    <div v-if="isTransitioning" class="preloader-overlay">
      <div class="preloader-content">
        <div class="fire-container">
          <svg class="dragon" viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="200" cy="380" rx="70" ry="50" fill="url(#neckGradient)" stroke="#2a1510" stroke-width="3" />
            <ellipse cx="200" cy="250" rx="95" ry="110" fill="url(#headGradient)" stroke="#2a1510" stroke-width="3"
              class="head" />
            <ellipse cx="140" cy="260" rx="40" ry="45" fill="url(#cheekBone)" opacity="0.7" />
            <ellipse cx="260" cy="260" rx="40" ry="45" fill="url(#cheekBone)" opacity="0.7" />
            <ellipse cx="200" cy="320" rx="55" ry="50" fill="url(#snoutGradient)" stroke="#2a1510" stroke-width="2.5" />
            <ellipse cx="180" cy="340" rx="8" ry="12" fill="#000" class="nostril" transform="rotate(-15 180 340)" />
            <ellipse cx="220" cy="340" rx="8" ry="12" fill="#000" class="nostril" transform="rotate(15 220 340)" />
            <ellipse cx="180" cy="338" rx="4" ry="6" fill="#1a0a05" opacity="0.8" />
            <ellipse cx="220" cy="338" rx="4" ry="6" fill="#1a0a05" opacity="0.8" />
            <g class="smoke">
              <ellipse cx="175" cy="345" rx="6" ry="8" fill="#666" opacity="0.3" class="smoke-puff" />
              <ellipse cx="170" cy="350" rx="8" ry="10" fill="#777" opacity="0.2" class="smoke-puff" />
              <ellipse cx="225" cy="345" rx="6" ry="8" fill="#666" opacity="0.3" class="smoke-puff" />
              <ellipse cx="230" cy="350" rx="8" ry="10" fill="#777" opacity="0.2" class="smoke-puff" />
            </g>
            <g class="scales" opacity="0.4">
              <circle cx="160" cy="220" r="8" fill="#8B4513" class="scale" />
              <circle cx="175" cy="225" r="7" fill="#723b13" class="scale" />
              <circle cx="190" cy="220" r="8" fill="#8B4513" class="scale" />
              <circle cx="210" cy="220" r="8" fill="#8B4513" class="scale" />
              <circle cx="225" cy="225" r="7" fill="#723b13" class="scale" />
              <circle cx="240" cy="220" r="8" fill="#8B4513" class="scale" />
              <circle cx="150" cy="240" r="9" fill="#5a2810" class="scale" />
              <circle cx="170" cy="245" r="8" fill="#8B4513" class="scale" />
              <circle cx="190" cy="240" r="9" fill="#5a2810" class="scale" />
              <circle cx="210" cy="240" r="9" fill="#5a2810" class="scale" />
              <circle cx="230" cy="245" r="8" fill="#8B4513" class="scale" />
              <circle cx="250" cy="240" r="9" fill="#5a2810" class="scale" />
              <circle cx="160" cy="270" r="8" fill="#723b13" class="scale" />
              <circle cx="180" cy="275" r="9" fill="#5a2810" class="scale" />
              <circle cx="200" cy="270" r="10" fill="#8B4513" class="scale" />
              <circle cx="220" cy="275" r="9" fill="#5a2810" class="scale" />
              <circle cx="240" cy="270" r="8" fill="#723b13" class="scale" />
            </g>
            <path d="M 170 160 Q 150 120 140 80 Q 135 50 145 30" stroke="#4a3530" stroke-width="14" fill="none"
              class="horn" stroke-linecap="round" />
            <path d="M 170 160 Q 150 120 140 80 Q 135 50 145 30" stroke="#6a5550" stroke-width="10" fill="none"
              opacity="0.7" />
            <path d="M 170 160 Q 150 120 140 80 Q 135 50 145 30" stroke="#8a7570" stroke-width="6" fill="none"
              opacity="0.5" />
            <path d="M 230 160 Q 250 120 260 80 Q 265 50 255 30" stroke="#4a3530" stroke-width="14" fill="none"
              class="horn" stroke-linecap="round" />
            <path d="M 230 160 Q 250 120 260 80 Q 265 50 255 30" stroke="#6a5550" stroke-width="10" fill="none"
              opacity="0.7" />
            <path d="M 230 160 Q 250 120 260 80 Q 265 50 255 30" stroke="#8a7570" stroke-width="6" fill="none"
              opacity="0.5" />
            <path d="M 150 180 Q 120 140 100 100 Q 90 70 95 45" stroke="#4a3530" stroke-width="16" fill="none"
              class="horn" stroke-linecap="round" />
            <path d="M 150 180 Q 120 140 100 100 Q 90 70 95 45" stroke="#6a5550" stroke-width="12" fill="none"
              opacity="0.7" />
            <path d="M 150 180 Q 120 140 100 100 Q 90 70 95 45" stroke="#8a7570" stroke-width="8" fill="none"
              opacity="0.5" />
            <path d="M 250 180 Q 280 140 300 100 Q 310 70 305 45" stroke="#4a3530" stroke-width="16" fill="none"
              class="horn" stroke-linecap="round" />
            <path d="M 250 180 Q 280 140 300 100 Q 310 70 305 45" stroke="#6a5550" stroke-width="12" fill="none"
              opacity="0.7" />
            <path d="M 250 180 Q 280 140 300 100 Q 310 70 305 45" stroke="#8a7570" stroke-width="8" fill="none"
              opacity="0.5" />
            <g class="horn-ridges" opacity="0.3">
              <line x1="152" y1="145" x2="148" y2="140" stroke="#2a1510" stroke-width="2" />
              <line x1="145" y1="125" x2="142" y2="120" stroke="#2a1510" stroke-width="2" />
              <line x1="142" y1="100" x2="139" y2="95" stroke="#2a1510" stroke-width="2" />
              <line x1="248" y1="145" x2="252" y2="140" stroke="#2a1510" stroke-width="2" />
              <line x1="255" y1="125" x2="258" y2="120" stroke="#2a1510" stroke-width="2" />
              <line x1="258" y1="100" x2="261" y2="95" stroke="#2a1510" stroke-width="2" />
            </g>
            <polygon points="120,280 115,270 125,278" fill="#3a2520" class="spike" />
            <polygon points="110,300 105,290 115,298" fill="#3a2520" class="spike" />
            <polygon points="280,280 285,270 275,278" fill="#3a2520" class="spike" />
            <polygon points="290,300 295,290 285,298" fill="#3a2520" class="spike" />
            <polygon points="140,350 135,340 145,348" fill="#3a2520" class="spike" />
            <polygon points="260,350 265,340 255,348" fill="#3a2520" class="spike" />
            <g class="eye-left">
              <ellipse cx="160" cy="230" rx="20" ry="25" fill="#000" transform="rotate(-10 160 230)" />
              <circle cx="160" cy="230" r="16" fill="#ff3300" class="eye-glow" />
              <circle cx="162" cy="228" r="10" fill="#ffaa00" class="eye-iris" />
              <rect x="156" y="220" width="8" height="20" fill="#000" class="pupil-slit" />
              <circle cx="165" cy="223" r="4" fill="#fff" opacity="0.8" class="eye-shine" />
            </g>
            <g class="eye-right">
              <ellipse cx="240" cy="230" rx="20" ry="25" fill="#000" transform="rotate(10 240 230)" />
              <circle cx="240" cy="230" r="16" fill="#ff3300" class="eye-glow" />
              <circle cx="238" cy="228" r="10" fill="#ffaa00" class="eye-iris" />
              <rect x="234" y="220" width="8" height="20" fill="#000" class="pupil-slit" />
              <circle cx="235" cy="223" r="4" fill="#fff" opacity="0.8" class="eye-shine" />
            </g>
            <path d="M 135 210 Q 155 205 175 210" fill="none" stroke="#2a1510" stroke-width="6"
              stroke-linecap="round" />
            <path d="M 225 210 Q 245 205 265 210" fill="none" stroke="#2a1510" stroke-width="6"
              stroke-linecap="round" />
            <polygon points="175,360 170,375 180,375" fill="#e8e8e8" class="tooth" />
            <polygon points="165,365 162,378 168,378" fill="#fff" class="tooth" />
            <polygon points="185,365 188,378 182,378" fill="#fff" class="tooth" />
            <polygon points="225,360 230,375 220,375" fill="#e8e8e8" class="tooth" />
            <polygon points="235,365 238,378 232,378" fill="#fff" class="tooth" />
            <polygon points="215,365 212,378 218,378" fill="#fff" class="tooth" />
            <path d="M 130 310 Q 140 330 160 345" fill="none" stroke="#1a0a05" stroke-width="3" opacity="0.5" />
            <path d="M 270 310 Q 260 330 240 345" fill="none" stroke="#1a0a05" stroke-width="3" opacity="0.5" />
            <g class="fire-breath" filter="url(#fireGlow)">
              <ellipse cx="200" cy="400" rx="40" ry="30" fill="#ff0000" opacity="0.95" />
              <ellipse cx="200" cy="420" rx="50" ry="35" fill="#ff3300" opacity="0.9" />
              <ellipse cx="200" cy="440" rx="55" ry="38" fill="#ff6600" opacity="0.85" />
              <ellipse cx="200" cy="460" rx="50" ry="35" fill="#ff9900" opacity="0.75" />
              <ellipse cx="200" cy="480" rx="40" ry="28" fill="#ffcc00" opacity="0.65" />
              <ellipse cx="180" cy="410" rx="15" ry="20" fill="#ff3300" opacity="0.7" class="fire-wisp" />
              <ellipse cx="220" cy="410" rx="15" ry="20" fill="#ff3300" opacity="0.7" class="fire-wisp" />
              <ellipse cx="190" cy="450" rx="12" ry="18" fill="#ff9900" opacity="0.6" class="fire-wisp" />
              <ellipse cx="210" cy="450" rx="12" ry="18" fill="#ff9900" opacity="0.6" class="fire-wisp" />
            </g>
            <circle cx="140" cy="380" r="3" fill="#ff6600" opacity="0.8" class="ember ember1" />
            <circle cx="260" cy="390" r="2.5" fill="#ff9900" opacity="0.7" class="ember ember2" />
            <circle cx="170" cy="420" r="3.5" fill="#ff3300" opacity="0.75" class="ember ember3" />
            <circle cx="230" cy="430" r="3" fill="#ffcc00" opacity="0.65" class="ember ember4" />
            <circle cx="200" cy="370" r="2" fill="#ff6600" opacity="0.6" class="ember ember5" />
            <circle cx="150" cy="350" r="2.5" fill="#ff9900" opacity="0.7" class="ember ember6" />
            <defs>
              <linearGradient id="darkScales" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#2a1a0a;stop-opacity:1" />
                <stop offset="30%" style="stop-color:#1a0a00;stop-opacity:1" />
                <stop offset="70%" style="stop-color:#0a0500;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="wingMembrane" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#8B0000;stop-opacity:0.3" />
                <stop offset="50%" style="stop-color:#5a0000;stop-opacity:0.5" />
                <stop offset="100%" style="stop-color:#2a0000;stop-opacity:0.7" />
              </linearGradient>
              <filter id="fireGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g class="flame-main">
              <path d="M 100 250 Q 80 200 85 150 Q 90 100 100 80 Q 110 100 115 150 Q 120 200 100 250 Z"
                fill="url(#fireGradient1)" class="flame flame-1" />
              <path d="M 100 250 Q 90 210 93 165 Q 95 120 100 100 Q 105 120 107 165 Q 110 210 100 250 Z"
                fill="url(#fireGradient2)" class="flame flame-2" />
              <path d="M 100 250 Q 95 220 97 180 Q 98 140 100 120 Q 102 140 103 180 Q 105 220 100 250 Z"
                fill="url(#fireGradient3)" class="flame flame-3" />
            </g>
            <g class="flame-sides">
              <path d="M 85 230 Q 70 190 73 160 Q 75 135 80 125 Q 83 140 85 165 Q 88 200 85 230 Z"
                fill="url(#fireGradient1)" opacity="0.8" class="flame flame-left" />
              <path d="M 115 230 Q 130 190 127 160 Q 125 135 120 125 Q 117 140 115 165 Q 112 200 115 230 Z"
                fill="url(#fireGradient1)" opacity="0.8" class="flame flame-right" />
            </g>
            <ellipse cx="100" cy="200" rx="15" ry="30" fill="url(#coreGradient)" class="fire-core" />
            <circle cx="95" cy="100" r="2" fill="#ffaa00" class="ember ember-1" />
            <circle cx="105" cy="80" r="1.5" fill="#ff6600" class="ember ember-2" />
            <circle cx="90" cy="120" r="2.5" fill="#ff8800" class="ember ember-3" />
            <circle cx="110" cy="110" r="2" fill="#ffaa00" class="ember ember-4" />
            <circle cx="100" cy="60" r="1" fill="#ff6600" class="ember ember-5" />
            <g class="smoke-wisps">
              <ellipse cx="100" cy="50" rx="8" ry="12" fill="#555" opacity="0.2" class="smoke-1" />
              <ellipse cx="95" cy="35" rx="10" ry="15" fill="#666" opacity="0.15" class="smoke-2" />
              <ellipse cx="105" cy="25" rx="12" ry="18" fill="#777" opacity="0.1" class="smoke-3" />
            </g>
            <g class="firewood">
              <rect x="70" y="245" width="60" height="12" rx="2" fill="#3a2010" stroke="#2a1510" stroke-width="1" />
              <rect x="75" y="255" width="50" height="10" rx="2" fill="#4a2515" stroke="#2a1510" stroke-width="1" />
              <rect x="80" y="263" width="40" height="8" rx="1" fill="#3a2010" stroke="#2a1510" stroke-width="1" />
              <line x1="75" y1="248" x2="125" y2="248" stroke="#2a1510" stroke-width="0.5" opacity="0.5" />
              <line x1="78" y1="258" x2="120" y2="258" stroke="#2a1510" stroke-width="0.5" opacity="0.5" />
              <line x1="82" y1="266" x2="115" y2="266" stroke="#2a1510" stroke-width="0.5" opacity="0.5" />
            </g>
            <defs>
              <linearGradient id="fireGradient1" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:#ff3300;stop-opacity:1" />
                <stop offset="40%" style="stop-color:#ff6600;stop-opacity:0.9" />
                <stop offset="70%" style="stop-color:#ff9900;stop-opacity:0.7" />
                <stop offset="100%" style="stop-color:#ffcc00;stop-opacity:0.3" />
              </linearGradient>
              <linearGradient id="fireGradient2" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:#ff4400;stop-opacity:0.95" />
                <stop offset="50%" style="stop-color:#ff7700;stop-opacity:0.85" />
                <stop offset="100%" style="stop-color:#ffaa00;stop-opacity:0.5" />
              </linearGradient>
              <linearGradient id="fireGradient3" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:#ff5500;stop-opacity:0.9" />
                <stop offset="60%" style="stop-color:#ff8800;stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:#ffff00;stop-opacity:0.6" />
              </linearGradient>
              <radialGradient id="coreGradient">
                <stop offset="0%" style="stop-color:#ffff99;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#ffcc00;stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:#ff8800;stop-opacity:0.7" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div class="loading-text">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { ref } from 'vue'
const isTransitioning = ref(false)
let transitionTimer = null
const beforeEnter = () => {
  isTransitioning.value = true
}
const enter = (el, done) => {
  transitionTimer = setTimeout(() => {
    isTransitioning.value = false
    done()
  }, 800)
}
const leave = (el, done) => {
  isTransitioning.value = true
  setTimeout(done, 400)
}
</script>
<style scoped lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.preloader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 10, 10, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  position: relative;
}

.dragon-container {
  position: relative;
  width: 200px;
  height: 150px;
  animation: dragonFly 3s ease-in-out infinite;
}

@keyframes dragonFly {

  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }

  25% {
    transform: translateY(-10px) translateX(-5px);
  }

  50% {
    transform: translateY(-20px) translateX(0px);
  }

  75% {
    transform: translateY(-10px) translateX(5px);
  }
}

.dragon {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.4));
}

.body {
  animation: breathe 2s ease-in-out infinite;
}

@keyframes breathe {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.wing {
  transform-origin: center;
  animation: flapWing 0.8s ease-in-out infinite;
}

.wing-left {
  animation-delay: 0s;
}

.wing-right {
  animation-delay: 0.4s;
}

@keyframes flapWing {

  0%,
  100% {
    opacity: 0.9;
    transform: scaleY(1);
  }

  50% {
    opacity: 0.6;
    transform: scaleY(0.8);
  }
}

.tail {
  animation: tailWag 1.5s ease-in-out infinite;
  transform-origin: right center;
}

@keyframes tailWag {

  0%,
  100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(-5deg);
  }
}

.flame-tip {
  animation: flameFlicker 0.3s ease-in-out infinite;
}

@keyframes flameFlicker {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(0.9);
  }
}

.fire-breath {
  animation: breatheFire 1.5s ease-in-out infinite;
}

@keyframes breatheFire {

  0%,
  100% {
    opacity: 0;
    transform: translateX(0);
  }

  20% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(10px);
  }
}

.eye {
  animation: blink 3s ease-in-out infinite;
}

@keyframes blink {

  0%,
  96%,
  100% {
    opacity: 1;
  }

  98% {
    opacity: 0;
  }
}

.horn {
  animation: hornGlow 2s ease-in-out infinite alternate;
}

@keyframes hornGlow {
  from {
    filter: drop-shadow(0 0 2px #D4AF37);
  }

  to {
    filter: drop-shadow(0 0 6px #D4AF37);
  }
}

.loading-text {
  display: flex;
  gap: 0.5rem;
  font-size: 2rem;
  color: #D4AF37;
  font-family: 'Times New Roman', serif;
  font-weight: bold;
  letter-spacing: 0.2rem;
}

.dot {
  animation: dotBounce 1.4s infinite;
  opacity: 0;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotBounce {

  0%,
  80%,
  100% {
    opacity: 0;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(-10px);
  }
}
</style>
