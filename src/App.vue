<template>
  <div class="h-[100dvh] overflow-hidden">
    <UApp :toaster="{ position: 'top-center' }">
      <div v-if="isMobile">
        <transition name="fade" appear @after-leave="onSplashLeave">
          <SplashScreenAlternative v-if="showSplash" />
        </transition>
        <DomusMapGoogle
          :points="filteredPoints"
          :selected-point="selectedPoint"
          v-show="!showSplash"
          class="absolute inset-0 z-0"
          @map-click-marker="handlePointSelected"
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
          v-if="!showSplash"
          ref="bottomSheet"
          v-model="open"
          :blocking="false"
          content-class="overflow-x-hidden overflow-y-auto"
          :snap-points="['13%', '80%']"
          @closed="handleClosed"
          @dragging-up="handleDraggingUp"
        >
          <section ref="bottomSheetContent" class="min-h-screen">
            <div v-if="selectedPoint" class="overflow-x-hidden">
              <CollectionPointDetails :ponto="selectedPoint" @back="handlePointSelected" />
            </div>
            <div v-else>
              <h1
                class="flex items-center justify-center mb-5 text-sm font-medium text-center text-gray-600 gap-x-2"
              >
                {{ headerText }}
              </h1>

              <div :class="{ 'mt-5': !fullSnapped }">
                <div class="flex flex-col mb-6">
                  <div class="space-y-4">
                    <CollectionPointCard
                      v-for="point in displayedPoints"
                      :key="point.id"
                      :ponto="point"
                      @select="handlePointSelected"
                    />
                    <div v-if="isLoading" class="flex justify-center py-4">
                      <div
                        class="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </BottomSheet>
      </div>

      <div v-else class="bg-[#0fc1cb]">
        <div
          class="container grid items-center justify-center flex-1 w-full h-screen grid-cols-2 px-4 pr-10 mx-auto overflow-auto bg-white"
          style="grid-template-columns: 0.8fr 0.5fr"
        >
          <div class="flex flex-col flex-1 w-full h-[96vh] p-5 !bg-white">
            <div
              class="grid items-center justify-between w-full grid-cols-2 pb-6 mb-4 border-b border-gray-300"
            >
              <div>
                <img src="/logo.png" alt="Domus Logo" class="w-24 mb-2" />
                <h2 class="mb-0 text-2xl font-semibold text-gray-800">Pontos de Coleta</h2>
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span>{{ headerText }}</span>
                </div>
              </div>
              <div class="flex items-end justify-end flex-1 w-full">
                <SearchBarDesktop
                  @focus="onFocus"
                  @toggle-filters="onClose"
                  class="relative z-40 flex-1 top-4"
                />
              </div>
            </div>
            <div class="flex-1 pr-2 overflow-y-auto custom-scroll">
              <div class="grid grid-cols-1 gap-x-6 gap-y-10 xl:grid-cols-2">
                <CollectionPointCardDesktop
                  v-for="(point, index) in points"
                  :key="index"
                  :ponto="point"
                  @select="handleSelected"
                />
              </div>
            </div>
          </div>
          <div class="relative flex items-center justify-center w-full h-[90vh]">
            <DomusMapGoogleDesktop
              :points="filteredPoints"
              :selected-point="selectedPoint"
              class="absolute inset-0 z-0"
            />
          </div>
        </div>
      </div>
    </UApp>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onBeforeMount, onMounted, ref, shallowRef, watch } from 'vue'
  import BottomSheet from '@douxcode/vue-spring-bottom-sheet'
  import '@douxcode/vue-spring-bottom-sheet/dist/style.css'
  import CollectionPointCard from './components/card/collection-point-card.vue'
  import DomusMapGoogle from './components/map/domus-map-google.vue'
  import DomusMapGoogleDesktop from './components/map/domus-map-google-desktop.vue'
  import SplashScreenAlternative from './components/splash-screen/splash-screen-alternative.vue'
  import SearchBar from './components/search-bar/search-bar.vue'
  import { useSearchStore } from './store/search'
  import { usePontosColetaApi } from './api/pontos-coleta'
  import CollectionPointCardDesktop from './components/card/collection-point-card-desktop.vue'
  import SearchBarDesktop from './components/search-bar/search-bar-desktop.vue'
  import CollectionPointDetails from './components/card/collection-point-details.vue'

  const allPoints = shallowRef<any[]>([])
  const filteredPoints = ref<any[]>([])
  const displayedPoints = ref<any[]>([])
  const currentPage = ref(0)
  const pageSize = 10
  const isLoading = ref(false)

  const bottomSheet = ref<InstanceType<typeof BottomSheet>>()
  const bottomSheetContent = ref<HTMLElement | null>(null)

  const searchStore = useSearchStore()
  const search = computed(() => searchStore.search)
  const bairroLocation = ref(searchStore.bairroSearch)
  const pointsCount = computed(() => points.value.length)
  const points = computed(() => filteredPoints.value)

  const open = ref(false)
  const isMobile = ref(false)
  const fullSnapped = ref(false)
  const showSplash = ref(true)
  const selectedPoint = ref(null)

  const headerText = computed(() => {
    const count = pointsCount.value
    const ponto = count === 1 ? 'ponto' : 'pontos'
    const encontrado = count === 1 ? 'encontrado' : 'encontrados'
    return `${count} ${ponto} de coleta ${encontrado}`
  })

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target || isLoading.value) return

    const scrollTop = target.scrollTop
    const scrollHeight = target.scrollHeight
    const clientHeight = target.clientHeight

    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMore()
    }
  }

  const setupScrollListener = () => {
    nextTick(() => {
      const contentEl = document.querySelector('[data-vsbs-scroll]') as HTMLElement
      if (contentEl) {
        contentEl.addEventListener('scroll', handleScroll)
      }
    })
  }

  const loadMore = () => {
    if (isLoading.value) return

    const start = currentPage.value * pageSize
    const end = start + pageSize

    if (start < filteredPoints.value.length) {
      isLoading.value = true
      setTimeout(() => {
        const nextBatch = filteredPoints.value.slice(start, end)
        displayedPoints.value.push(...nextBatch)
        currentPage.value++
        isLoading.value = false
      }, 300)
    }
  }

  const resetPagination = () => {
    currentPage.value = 0
    displayedPoints.value = []
    const scrollContainer = document.querySelector('[data-vsbs-scroll]') as HTMLElement
    scrollContainer.scrollTop = 0
    loadMore()
  }

  watch(
    [search, bairroLocation],
    ([searchTerm, bairro]) => {
      const term = searchTerm?.toLowerCase().trim() || ''
      const bairroTerm = bairro?.toLowerCase().trim() || ''
      filteredPoints.value = allPoints.value.filter(p => {
        const matchSearch =
          (!term ||
            (p.nome?.toLowerCase() || '').includes(term) ||
            (p.endereco?.toLowerCase() || '').includes(term) ||
            (p.bairro?.toLowerCase() || '').includes(term)) &&
          p.ativo === true
        const matchBairro = !bairroTerm || (p.bairro?.toLowerCase() || '').includes(bairroTerm)
        return matchSearch && matchBairro
      })
      nextTick(() => resetPagination())
    },
    { immediate: true }
  )

  const handleDraggingUp = () => {
    fullSnapped.value = true
  }

  const checkIsMobile = async () => {
    if (window.innerWidth <= 768) {
      bottomSheet.value?.open()
      isMobile.value = true
      await nextTick()
    } else {
      bottomSheet.value?.close()
      isMobile.value = false
      await nextTick()
    }
  }

  const handlePointSelected = async (item?: any) => {
    if (item) {
      selectedPoint.value = item
      await nextTick()
      open.value = true
      bottomSheet.value?.snapToPoint(1)
      fullSnapped.value = true
      const scrollContainer = document.querySelector('[data-vsbs-scroll]') as HTMLElement
      if (scrollContainer) scrollContainer.scrollTop = 0
    } else {
      selectedPoint.value = null
    }
  }

  const onSplashLeave = async () => {
    await nextTick()
    bottomSheet.value?.open()
    setTimeout(setupScrollListener, 500)
  }

  const onFocus = async () => {
    await nextTick()
    open.value = true
    bottomSheet.value?.snapToPoint(1)
    fullSnapped.value = true
    const scrollContainer = document.querySelector('[data-vsbs-scroll]') as HTMLElement
    scrollContainer.scrollTop = 0
  }

  const onClose = async () => {
    await nextTick()
    open.value = true
    bottomSheet.value?.snapToPoint(0)
    fullSnapped.value = false
    nextTick(() => resetPagination())
  }

  const handleClosed = () => {
    fullSnapped.value = false
    bottomSheet.value?.close()
    nextTick(() => resetPagination())
    setTimeout(() => {
      bottomSheet.value?.open()
    }, 500)
  }

  const handleSelected = (item: any) => {
    if (item) selectedPoint.value = item
  }

  const fetchPoints = async () => {
    try {
      allPoints.value = await usePontosColetaApi().getAll()
      filteredPoints.value = allPoints.value.filter(p => p.ativo === true)
      await nextTick()
      loadMore()
    } catch (error) {
      console.error('Failed to fetch points data', error)
    }
  }

  onBeforeMount(async () => {
    await fetchPoints()
  })

  onMounted(() => {
    setTimeout(() => {
      showSplash.value = false
    }, 3500)
    checkIsMobile()
    setupScrollListener()
  })
</script>
