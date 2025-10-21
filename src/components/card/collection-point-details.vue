<template>
  <div class="max-w-sm mx-auto overflow-x-hidden text-gray-700">
    <header class="flex items-center justify-between px-4 py-3">
      <button @click="() => emit('back')" class="text-sky-500">
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="font-medium text-sky-500">Detalhes do Ponto</h1>
      <span class="w-6"></span>
    </header>

    <div class="p-5 space-y-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">{{ ponto.nome }}</h2>
        <p class="mt-1 text-sm leading-relaxed text-gray-600">
          <span class="font-semibold">Endereço:</span>
          {{ ponto.endereco }}, {{ ponto.numero_endereco }} - {{ ponto.nome_bairro }},
          {{ ponto.nome_cidade }} ({{ ponto.sigla_estado }})
        </p>
      </div>
      <USeparator />
      <div>
        <h3 class="mb-2 text-lg font-semibold text-gray-800">Instruções para visita</h3>
        <p class="mb-2 text-sm leading-relaxed text-gray-600">
          Venha como se sentir à vontade e traga muito amor e paciência para dar.
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-5 px-5 pb-6">
      <div class="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <img
          :src="googleMapsImageUrl"
          alt="Mapa do ponto"
          class="object-cover w-full h-40 rounded-xl"
        />
        <button
          class="w-full py-3 text-sm font-medium text-center transition border-t border-gray-100 text-sky-600 hover:bg-sky-50"
          @click="openMaps"
        >
          Ver rotas no Google Maps
        </button>
      </div>

      <button
        v-if="ponto.telefone"
        @click="openWhatsapp(ponto.telefone)"
        class="flex items-center justify-center w-full gap-3 py-3 font-medium text-white transition bg-green-500 shadow-md hover:bg-green-600 rounded-xl"
      >
        <img src="/whatsapp.webp" class="w-6 h-6" />
        Entrar em contato
      </button>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import mapboxgl from 'mapbox-gl'
  import { ChevronLeft } from 'lucide-vue-next'

  const props = defineProps({
    ponto: {
      type: Object,
      required: true,
    },
  })

  const mapContainer = ref(null)
  const emit = defineEmits(['back'])

  const openMaps = () => {
    const { latitude, longitude } = props.ponto
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`
    window.open(url, '_blank')
  }

  const openWhatsapp = telefone => {
    if (!telefone) return
    const numeroLimpo = telefone.replace(/\D/g, '')
    const numeroComDDI = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`
    const url = `https://wa.me/${numeroComDDI}`
    window.open(url, '_blank')
  }

  const googleMapsImageUrl = computed(() => {
    const { latitude, longitude } = props.ponto
    return `https://maps.googleapis.com/maps/api/streetview?size=250x120&location=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
  })
</script>
