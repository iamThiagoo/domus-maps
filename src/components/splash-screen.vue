<template>
  <div v-if="isVisible" class="splash-screen">
    <div class="stripes-container">
      <div
        v-for="i in 100"
        :key="i"
        class="stripe"
        :style="{
          left: `${(i - 1) * 10}%`,
          animationDelay: `${i * 0.05}s`,
          backgroundColor: stripeColors[i % stripeColors.length],
        }"
      ></div>
    </div>

    <div class="content">
      <div class="logo-container">
        <div class="logo-glow"></div>
        <img src="/logo.png" alt="Domus Logo" class="logo" />
      </div>

      <div class="loading-text">
        <span>Carregando Mapa</span>
        <span class="dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>

      <div class="progress-container">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <div class="corner-decoration top-left"></div>
    <div class="corner-decoration top-right"></div>
    <div class="corner-decoration bottom-left"></div>
    <div class="corner-decoration bottom-right"></div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  const isVisible = ref(true)
  const progress = ref(0)

  const stripeColors = [
    '#FF6B35', // Orange
    '#FFB627', // Yellow
    '#4CAF50', // Green
    '#FF5252', // Red
    '#FFA726', // Light orange
  ]

  onMounted(() => {
    const interval = setInterval(() => {
      progress.value += Math.random() * 15

      if (progress.value >= 100) {
        progress.value = 100
        clearInterval(interval)

        setTimeout(() => {
          isVisible.value = false
        }, 200)
      }
    }, 250)
  })
</script>

<style scoped>
  .splash-screen {
    position: fixed;
    inset: 0;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    overflow: hidden;
    animation: fadeIn 0.5s ease-out;
  }

  .stripes-container {
    position: absolute;
    inset: 0;
    opacity: 0.15;
  }

  .stripe {
    position: absolute;
    top: 0;
    width: 15%;
    height: 100%;
    animation: stripeMove 3s ease-in-out infinite;
  }

  .content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .logo-container {
    position: relative;
    animation: logoEntrance 1s ease-out;
  }

  .logo-glow {
    position: absolute;
    inset: -20px;
    background: radial-gradient(circle, rgba(255, 107, 53, 0.4) 0%, transparent 70%);
    animation: pulse 2s ease-in-out infinite;
    border-radius: 20px;
  }

  .logo {
    position: relative;
    width: 280px;
    height: auto;
    filter: drop-shadow(0 10px 30px rgba(255, 107, 53, 0.3));
    animation: logoFloat 3s ease-in-out infinite;
  }

  .loading-text {
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    letter-spacing: 0.05em;
  }

  .progress-container {
    width: 300px;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #ff6b35, #ffb627, #4caf50, #ff5252);
    background-size: 200% 100%;
    border-radius: 10px;
    transition: width 0.3s ease;
    animation: progressGradient 2s linear infinite;
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
  }

  .dots {
    display: flex;
  }

  .dots span {
    animation: dotBounce 1.5s ease-in-out infinite;
  }

  .dots span:nth-child(1) {
    animation-delay: 0s;
  }

  .dots span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .dots span:nth-child(3) {
    animation-delay: 0.4s;
  }

  .corner-decoration {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 3px solid;
    border-image: linear-gradient(135deg, #ff6b35, #ffb627) 1;
    opacity: 0.3;
  }

  .top-left {
    top: 20px;
    left: 20px;
    border-right: none;
    border-bottom: none;
    animation: cornerPulse 3s ease-in-out infinite;
  }

  .top-right {
    top: 20px;
    right: 20px;
    border-left: none;
    border-bottom: none;
    animation: cornerPulse 3s ease-in-out infinite 0.5s;
  }

  .bottom-left {
    bottom: 20px;
    left: 20px;
    border-right: none;
    border-top: none;
    animation: cornerPulse 3s ease-in-out infinite 1s;
  }

  .bottom-right {
    bottom: 20px;
    right: 20px;
    border-left: none;
    border-top: none;
    animation: cornerPulse 3s ease-in-out infinite 1.5s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes stripeMove {
    0%,
    100% {
      transform: translateY(0) scaleY(1);
    }
    50% {
      transform: translateY(-20px) scaleY(1.1);
    }
  }

  @keyframes logoEntrance {
    0% {
      transform: scale(0.5) rotate(-10deg);
      opacity: 0;
    }
    60% {
      transform: scale(1.1) rotate(5deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }

  @keyframes logoFloat {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes dotBounce {
    0%,
    60%,
    100% {
      transform: translateY(0);
      opacity: 1;
    }
    30% {
      transform: translateY(-10px);
      opacity: 0.7;
    }
  }

  @keyframes progressGradient {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 200% 50%;
    }
  }

  @keyframes cornerPulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.6;
    }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .logo {
      width: 200px;
    }

    .loading-text {
      font-size: 1.25rem;
    }

    .progress-container {
      width: 250px;
    }

    .corner-decoration {
      width: 60px;
      height: 60px;
    }
  }
</style>
