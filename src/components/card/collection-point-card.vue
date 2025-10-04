<template>
  <div class="w-full mx-auto overflow-hidden bg-white border shadow-md border-gray-50 rounded-2xl">
    <div class="px-3 py-4">
      <h2 class="mb-2 text-base font-bold text-slate-800">
        <div class="flex gap-1 h-10 w-10 mb-1.5 items-center justify-center rounded-xl bg-sky-100">
          <MapPin class="size-6 text-sky-900" />
        </div>
        {{ ponto.nome }}
      </h2>

      <p class="mb-1 text-xs text-gray-600">
        <span class="font-semibold">Endereço:</span> {{ ponto.endereco }}, {{ ponto.numero }} -
        {{ ponto.bairro }}, {{ ponto.cep }}
      </p>

      <p class="mb-3 text-xs text-gray-600">
        <span class="font-semibold">Contato:</span> {{ ponto.telefone }}
      </p>

      <div class="flex flex-row gap-3">
        <button
          @click.stop="handleSelect"
          class="w-full bg-white gap-1.5 flex items-center justify-center border border-slate-600 text-slate-600 text-sm font-medium py-2 px-2 rounded-lg transition-colors btn-scale"
        >
          <Map class="size-5 text-slate-600" />
          Selecionar
        </button>
        <button
          @click.stop="handleOpenGoogleMaps"
          class="w-full bg-white gap-1.5 flex items-center justify-center text-gray-500 border text-sm font-medium py-2 px-2 rounded-lg transition-colors btn-scale"
        >
          <img src="/google-maps.png" class="size-5" />
          Google Maps
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Map } from 'lucide-vue-next'
  import { MapPin } from 'lucide-vue-next'

  const emit = defineEmits<{
    (e: 'select', ponto: any): void
    (e: 'open-google-maps'): void
  }>()

  const props = defineProps<{
    ponto: any
  }>()

  const handleSelect = () => {
    emit('select', props.ponto)
  }

  const handleOpenGoogleMaps = () => {
    if (props.ponto.mapsLink) {
      window.open(props.ponto.mapsLink, '_blank')
    } else {
      alert('Link do Google Maps não disponível para este ponto.')
    }
  }
</script>
