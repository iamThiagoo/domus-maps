<template>
  <div class="z-50 flex justify-end">
    <div class="w-10/12">
      <div class="flex items-center gap-4 px-4 py-1 bg-white rounded-full shadow">
        <button
          class="flex-shrink-0 p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100"
          aria-label="Buscar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>

        <input
          @focus="$emit('focus')"
          v-model="search"
          type="text"
          placeholder="Filtre pelo nome do ponto ou bairro de coleta..."
          class="outline-none flex-1 min-w-0 text-[13px] md:text-sm items-center justify-center text-gray-700"
        />

        <!-- <button
          @click="toggleFilters"
          class="flex-shrink-0 p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100"
          aria-label="Filtros"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
            <circle cx="8" cy="6" r="2" />
            <circle cx="16" cy="12" r="2" />
            <circle cx="12" cy="18" r="2" />
          </svg>
        </button> -->
      </div>

      <transition name="slide-fade">
        <div v-if="showFilters" class="mt-4 bg-white rounded-2xl !z-50 shadow-lg px-5 pt-5 pb-2">
          <UFormField label="Bairro" class="w-full mb-4 text-gray-600 outline-none">
            <UInput placeholder="Digite o bairro" class="w-full" v-model="bairroLocation" />
          </UFormField>

          <button
            @click="applyFilters"
            class="w-full py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 btn-scale"
          >
            Aplicar Filtros
          </button>
          <button
            @click="resetFilters"
            class="w-full py-2 my-2 text-sm font-medium transition-colors rounded-lg text-slate-800 btn-scale"
          >
            Resetar Filtros
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue'
  import { useSearchStore } from '../../store/search'

  const showFilters = ref(false)
  const searchStore = useSearchStore()
  const search = ref(searchStore.search)
  const bairroLocation = ref(searchStore.bairroSearch)
  const emit = defineEmits<{
    (e: 'toggle-filters'): void
    (e: 'focus'): void
  }>()

  watch(search, newVal => {
    searchStore.setSearch(newVal)
  })

  watch(bairroLocation, newVal => {
    searchStore.setBairroSearch(newVal)
  })

  const toggleFilters = async () => {
    await nextTick()
    showFilters.value = !showFilters.value
    if (showFilters.value) emit('toggle-filters')
  }

  const applyFilters = () => {
    showFilters.value = false
    emit('focus')
  }

  const resetFilters = () => {
    search.value = ''
    bairroLocation.value = ''
    searchStore.clearSearch()
    searchStore.clearBairroSearch()
    toggleFilters()
  }
</script>

<style scoped>
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
</style>
