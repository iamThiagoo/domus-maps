<template>
  <div class="h-screen">
    <UApp :toaster="{ position: 'top-center' }">
      <transition name="fade" appear @after-leave="onSplashLeave">
        <SplashScreen v-if="showSplash" />
      </transition>
      <transition name="fade-map" appear>
        <DomusMapGoogle v-if="!showSplash" class="absolute inset-0 z-0" />
      </transition>
      <transition name="fade" appear>
        <SearchBar
          v-if="!showSplash"
          :change="fullSnapped"
          @focus="onFocus"
          @toggle-filters="onClose"
          class="absolute top-5 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4"
        />
      </transition>
      <BottomSheet
        v-if="isMobile && !showSplash"
        ref="bottomSheet"
        v-model="open"
        :blocking="false"
        :snap-points="['13%', '80%']"
        @closed="handleClosed"
        @dragging-up="handleDraggingUp"
        class="dark:bg-gray-800"
      >
        <h1 class="text-sm text-center font-medium flex items-center justify-center gap-x-2 mb-5">
          {{ headerText }}
        </h1>

        <div :class="{ 'mt-5': !fullSnapped }">
          <div class="flex flex-col gap-5 mb-6">
            <CollectionPointCard v-for="n in 5" :key="n" :ponto="ponto" @select="onClose" />
          </div>
        </div>
      </BottomSheet>
    </UApp>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, ref } from 'vue'
  import BottomSheet from '@douxcode/vue-spring-bottom-sheet'
  import '@douxcode/vue-spring-bottom-sheet/dist/style.css'
  import CollectionPointCard from './components/card/collection-point-card.vue'
  import DomusMapGoogle from './components/map/domus-map-google.vue'
  import SplashScreen from './components/splash-screen.vue'
  import SearchBar from './components/search-bar/search-bar.vue'

  const bottomSheet = ref<InstanceType<typeof BottomSheet>>()
  const open = ref(false)
  const isMobile = ref(false)
  const headerText = ref('88 pontos de coleta encontrados')
  const fullSnapped = ref(false)
  const showSplash = ref(true)

  const ponto = {
    nome: 'Ponto de Coleta Central',
    endereco: 'Rua Felisberto Soares',
    numero: '1234',
    bairro: 'Centro',
    cep: '95010-000',
    telefone: '(54) 1234-5678',
  }

  const checkIsMobile = async () => {
    if (window.innerWidth <= 650) {
      isMobile.value = true
      await nextTick()
      bottomSheet.value?.open()
    } else {
      isMobile.value = false
      await nextTick()
      bottomSheet.value?.close()
    }
  }

  const handleDraggingUp = () => {
    headerText.value = 'Explore nossos pontos de coleta...'
    fullSnapped.value = true
  }

  const onSplashLeave = async () => {
    await nextTick()
    bottomSheet.value?.open()
  }

  const onFocus = async () => {
    await nextTick()
    open.value = true
    bottomSheet.value?.snapToPoint(1)
    fullSnapped.value = true
  }

  const onClose = async () => {
    await nextTick()
    open.value = true
    bottomSheet.value?.snapToPoint(0)
    fullSnapped.value = false
  }

  const handleClosed = () => {
    headerText.value = '88 pontos de coleta encontrados'
    fullSnapped.value = false
    setTimeout(() => {
      bottomSheet.value?.open()
    }, 500)
  }

  onMounted(() => {
    setTimeout(() => {
      showSplash.value = false
    }, 3500)
    checkIsMobile()
  })
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 0.5s ease,
      transform 0.8s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
    transform: translateY(0);
  }

  .fade-map-enter-active {
    transition: opacity 0s ease;
  }
  .fade-map-enter-from {
    opacity: 0;
  }
  .fade-map-enter-to {
    opacity: 1;
  }
</style>
