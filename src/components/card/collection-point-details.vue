<template>
  <div class="max-w-sm mx-auto overflow-x-hidden text-gray-700">
    <header class="flex items-center justify-between px-4 py-3">
      <button @click="() => emit('back')" class="text-sky-500">
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="font-medium text-sky-500">Detalhes do Ponto</h1>
      <span class="w-6"></span>
    </header>

    <div class="p-5 pb-4 space-y-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">{{ ponto.nome }}</h2>
        <p class="mt-1 text-sm leading-relaxed text-gray-600">
          <span class="font-semibold">Endereço:</span>
          {{ ponto.endereco }}, {{ ponto.numero_endereco }} - {{ ponto.nome_bairro }},
          {{ ponto.nome_cidade }} ({{ ponto.sigla_estado }})
        </p>
        <UBadge icon="i-lucide-recycle" size="md" color="success" variant="soft" class="mt-4"
          >Coletando tampinhas</UBadge
        >
      </div>
      <USeparator />
      <div>
        <h3 class="mb-2 text-lg font-semibold text-gray-800">Venha nos Visitar 🤗</h3>
        <p class="mb-2 text-sm leading-relaxed text-gray-600">
          Toda forma de ajuda é bem-vinda — traga o que puder e venha com o coração aberto para
          fazer o bem.
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-5 px-5 pb-6">
      <div class="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <img src="/domus.webp" alt="Mapa da Domus" class="object-cover w-full h-40 rounded-xl" />
        <button
          class="w-full py-3 text-sm font-medium text-center transition border-t border-gray-100 text-sky-600 hover:bg-sky-50"
          @click="openMaps"
        >
          Ver rotas no Google Maps
        </button>
      </div>

      <div class="grid flex-wrap items-start justify-center grid-cols-2 gap-3 my-3">
        <div
          class="flex flex-col justify-center h-40 pl-2 border shadow-sm items-left rounded-2xl border-cyan-300 bg-gradient-to-br from-cyan-50 to-white"
        >
          <div class="mb-2 text-cyan-400">
            <Clock class="w-8 h-8" />
          </div>
          <p class="text-base font-medium text-left text-gray-700">Segunda à Sexta</p>
          <p class="text-sm text-left text-gray-600">8h - 12h, 13:30h às 18h</p>
        </div>

        <div
          class="flex flex-col justify-center h-40 pl-2 border shadow-sm rounded-2xl border-rose-300 bg-gradient-to-br from-rose-50 to-white"
        >
          <div class="mb-2 text-rose-400">
            <Info class="w-8 h-8" />
          </div>
          <p class="text-base font-medium text-rose-700">Não atendemos</p>
          <p class="text-sm text-left text-rose-600">fim de semana</p>
        </div>
      </div>

      <a
        href="https://api.whatsapp.com/send?phone=5554992642147"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center w-full gap-3 py-3 font-medium text-white transition bg-green-500 shadow-md hover:bg-green-600 rounded-xl"
      >
        <img src="/whatsapp.webp" class="w-6 h-6" />
        Entrar em contato
      </a>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import mapboxgl from 'mapbox-gl'
  import { ChevronLeft, Clock, Info } from 'lucide-vue-next'

  const mapContainer = ref(null)
  const emit = defineEmits(['back'])
  const props = defineProps({
    ponto: {
      type: Object,
      required: true,
    },
  })

  const openMaps = () => {
    const latitude = -29.152446637815597
    const longitude = -51.17576162517297
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`
    window.open(url, '_blank')
  }

  const googleMapsImageUrlDomus = computed(() => {
    const latitude = -29.152446637815597
    const longitude = -51.17576162517297
    return `https://maps.googleapis.com/maps/api/streetview?size=250x120&location=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
  })
</script>
