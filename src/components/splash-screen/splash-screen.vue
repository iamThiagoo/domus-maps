<template>
  <div v-if="isVisible" class="splash-screen">
    <div class="stripes-container">
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
</script>
