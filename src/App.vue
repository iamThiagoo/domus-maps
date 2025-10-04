<template>
  <div class="h-screen">
    <UApp :toaster="{ position: 'top-center' }">
      <!--  -->
      <transition name="fade" appear @after-leave="onSplashLeave">
        <SplashScreen v-if="showSplash" />
      </transition>
      <!--  -->

      <!--  -->
      <DomusMapGoogle
        :selected-point="selectedPoint"
        v-show="!showSplash"
        class="absolute inset-0 z-0"
      />

      <transition name="fade" appear>
        <SearchBar
          v-if="!showSplash"
          :change="fullSnapped"
          @focus="onFocus"
          @toggle-filters="onClose"
          class="absolute z-40 w-full max-w-2xl px-4 transform -translate-x-1/2 top-5 left-1/2"
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
        <h1 class="flex items-center justify-center mb-5 text-sm font-medium text-center gap-x-2">
          {{ headerText }}
        </h1>

        <div :class="{ 'mt-5': !fullSnapped }">
          <div class="flex flex-col gap-5 mb-6">
            <CollectionPointCard
              v-for="(point, index) in points"
              :key="index"
              :ponto="point"
              @select="
                item => {
                  ;(onClose(), handleSelected(item))
                }
              "
            />
          </div>
        </div>
      </BottomSheet>
      <!--  -->
    </UApp>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import BottomSheet from '@douxcode/vue-spring-bottom-sheet'
  import '@douxcode/vue-spring-bottom-sheet/dist/style.css'
  import CollectionPointCard from './components/card/collection-point-card.vue'
  import DomusMapGoogle from './components/map/domus-map-google.vue'
  import SplashScreen from './components/splash-screen/splash-screen.vue'
  import SearchBar from './components/search-bar/search-bar.vue'
  import { points as allPoints } from './mocks/pontos'
  import { useSearchStore } from './store/search'

  const bottomSheet = ref<InstanceType<typeof BottomSheet>>()

  const open = ref(false)
  const isMobile = ref(false)
  const fullSnapped = ref(false)
  const showSplash = ref(true)
  const selectedPoint = ref(null)

  const searchStore = useSearchStore()
  const search = computed(() => searchStore.search)
  const bairroLocation = ref(searchStore.bairroSearch)
  const pointsCount = computed(() => points.value.length)
  const points = ref([...allPoints])

  const headerText = computed(() => {
    const count = pointsCount.value
    const ponto = count === 1 ? 'ponto' : 'pontos'
    const encontrado = count === 1 ? 'encontrado' : 'encontrados'
    return `${count} ${ponto} de coleta ${encontrado}`
  })

  watch(
    [search, bairroLocation],
    ([searchTerm, bairro]) => {
      const term = searchTerm?.toLowerCase().trim() || ''
      const bairroTerm = bairro?.toLowerCase().trim() || ''

      points.value = allPoints.filter(p => {
        const matchSearch =
          !term ||
          p.nome.toLowerCase().includes(term) ||
          p.endereco.toLowerCase().includes(term) ||
          p.bairro.toLowerCase().includes(term)

        const matchBairro = !bairroTerm || p.bairro.toLowerCase().includes(bairroTerm)

        return matchSearch && matchBairro
      })
    },
    { immediate: true }
  )

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
    // headerText.value = 'Explore nossos pontos de coleta...'
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
    fullSnapped.value = false
    setTimeout(() => {
      bottomSheet.value?.open()
    }, 500)
  }

  const handleSelected = (item: any) => {
    if (item) {
      selectedPoint.value = item
    }
  }

  onMounted(() => {
    setTimeout(() => {
      showSplash.value = false
    }, 3500)
    checkIsMobile()
  })
</script>
