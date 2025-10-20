<template>
  <div v-if="isVisible" class="h-[100dvh] flex flex-col items-center justify-around bg-[#17BECD]">
    <div class="container items-center px-10 content">
      <div class="flex justify-center logo-container gap-x-5">
        <!-- <img src="/logo.png" class="w-full h-14" alt="Domus Logo" />
        <img src="/map-marker.svg" class="w-full h-8" alt="Map Marker Logo" /> -->
        <img src="/landing.svg" class="w-7/12" alt="Landing Logo" />
      </div>

      <div>
        <div>
          <h2 class="!text-white text-2xl font-bold">Leve a felicidade <br>para o mundo</h2>
        </div>
        
        <div>
          <p class="mt-4 font-normal text-white">
            Visite pontos de coleta Domus e ajuda a mudar o dia de muitas crianças.
          </p>
        </div>

        <div class="flex flex-col items-center justify-center w-full mt-5 mb-10">
          <div class="mt-2 mb-3 text-sm loading-text">
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
        <!-- <button class="bg-[#FFD666] text-nowrap text-sm w-full text-[#8D734B] flex items-center justify-center font-bold px-4 py-3 rounded-4xl mt-7 hover:bg-[#FFC133] transition-colors">
          Visualizar pontos de coleta
          <ChevronRight class="inline-block ml-1 size-7" />
        </button> -->
        <div class="flex items-center justify-center w-full mt-6 mb-4 text-sm gap-x-2">
          <p class="text-white">Uma realização</p>
          <img src="/logo.png" class="w-3/12" alt="Domus Logo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import Particles from '@tsparticles/vue3'
  import { ChevronRight } from 'lucide-vue-next'

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
        }, 300)
      }
    }, 250)
  })
</script>
