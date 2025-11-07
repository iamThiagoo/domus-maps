<template>
  <div v-if="isVisible" class="h-[100dvh] flex flex-col items-center justify-around bg-[#17BECD]">
    <div class="container items-center px-10 content">
      <div class="flex justify-center mt-2 logo-container gap-x-5">
        <img src="/app/landing.svg" class="w-7/12" alt="Landing Logo" />
      </div>
      <div>
        <div>
          <img src="/app/logo.png" class="w-20 mb-3" alt="Domus Logo" />
          <h2 class="!text-white text-3xl font-bold">Leve felicidade <br />para o mundo</h2>
        </div>
        <div>
          <p class="mt-4 font-normal text-white">
            Visite um ponto de coleta Domus e faça a diferença
          </p>
        </div>
        <div class="flex flex-col items-center justify-center w-full mt-8 mb-10">
          <div class="loader"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
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
        }, 600)
      }
    }, 250)
  })
</script>

<style scoped>
  .loader {
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    background:
      radial-gradient(farthest-side, #fff 94%, #0000) top/8px 8px no-repeat,
      conic-gradient(#0000 30%, #fff);
    -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
    animation: l13 1s infinite linear;
  }
  @keyframes l13 {
    100% {
      transform: rotate(1turn);
    }
  }
</style>
