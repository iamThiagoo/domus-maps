<template>
  <div v-if="isVisible" class="splash-screen">
    <div class="stripes-container">
      <vue-particles id="tsparticles" class="particles" :options="particlesOptions" />
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
  import Particles from '@tsparticles/vue3'

  const isVisible = ref(true)
  const progress = ref(0)

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

  const particlesOptions = {
    fpsLimit: 60,
    interactivity: {
      events: { onHover: { enable: true, mode: 'repulse' }, resize: true },
      modes: { repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
      color: { value: ['#FF6B35', '#FFB627', '#4CAF50', '#FF5252', '#FFA726'] },
      links: { enable: true, distance: 120, opacity: 0.3, width: 1 },
      move: { enable: true, speed: 2, outModes: { default: 'bounce' } },
      number: { value: 120, density: { enable: true, area: 800 } },
      opacity: { value: 0.6 },
      shape: { type: 'circle' },
      size: { value: { min: 2, max: 6 } },
    },
    detectRetina: true,
  }
</script>
