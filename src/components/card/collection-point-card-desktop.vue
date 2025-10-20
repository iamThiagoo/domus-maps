<template>
  <div class="w-full h-auto mx-auto overflow-hidden bg-white border border-gray-50 rounded-2xl">
    <div class="py-2">
      <h2 class="mb-2 text-sm font-bold text-slate-800">
        <div class="flex gap-1 h-8 w-8 mb-1.5 items-center justify-center rounded-xl bg-sky-100">
          <img src="/map-marker.svg" />
        </div>
        {{ ponto.nome }}
      </h2>

      <p class="mb-1 text-[11px] text-gray-600">
        <span class="font-semibold">Endereço:</span> {{ ponto.endereco }}, {{ ponto.numero_endereco }} -
        {{ ponto.nome_bairro }}, {{ ponto.cep }}
      </p>

      <p class="mb-3 text-xs text-gray-600">
        <span class="font-semibold">Contato:</span> {{ ponto.telefone ?? 'Não informado' }}
      </p>

      <div class="flex flex-row gap-3">
        <button
          @click.stop="handleSelect"
          class="w-full bg-white gap-1.5 flex items-center justify-center border border-slate-600 text-slate-600 text-xs font-medium py-2 px-2 rounded-lg transition-colors btn-scale"
        >
          <Map class="size-5 text-slate-600" />
          Selecionar
        </button>
        <button
          @click.stop="handleOpenGoogleMaps"
          class="w-full bg-white gap-1.5 flex items-center justify-center text-gray-500 text-nowrap border text-xs font-medium py-2 px-2 rounded-lg transition-colors btn-scale"
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
  import { getMapsLink } from '../../utils/helpers';

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
    window.open(getMapsLink(props.ponto), '_blank')
  }
</script>
