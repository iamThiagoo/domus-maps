<template>
  <div class="px-4 z-50">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-full shadow-lg py-2 px-4 flex items-center gap-4">
        <button
          class="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Voltar"
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
          type="text"
          placeholder="Buscar por pontos de coleta"
          class="outline-none flex-1 min-w-0 text-[13px] md:text-sm items-center justify-center text-gray-700"
        />

        <button
          @click="toggleFilters"
          class="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
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
        </button>
      </div>

      <transition name="slide-fade">
        <div v-if="showFilters" class="mt-4 bg-white rounded-2xl !z-50 shadow-lg px-5 pt-5 pb-2">
          <UFormField label="Bairro" class="w-full mb-4">
            <UInput placeholder="Digite o bairro" class="w-full" v-model="bairroLocation" />
          </UFormField>

          <button
            @click="applyFilters"
            class="w-full bg-blue-600 text-sm text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Aplicar Filtros
          </button>
          <button
            @click="applyFilters"
            class="w-full my-2 text-slate-800 text-sm py-2 rounded-lg font-medium transition-colors"
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

  const bairroLocation = ref('')
  const showFilters = ref(false)
  const emit = defineEmits<{
    (e: 'toggle-filters'): void
    (e: 'focus'): void
  }>()

  const props = defineProps<{
    change: any
  }>()

  watch(
    () => props.change,
    () => {
      if (showFilters.value) return
      showFilters.value = false
    },
    { deep: true }
  )

  const toggleFilters = async () => {
    await nextTick()
    showFilters.value = !showFilters.value
    if (showFilters.value) emit('toggle-filters')
  }

  const applyFilters = () => {
    showFilters.value = false
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
