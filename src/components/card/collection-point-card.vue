<template>
    <div class="w-full mx-auto border border-gray-50 bg-white rounded-2xl shadow-md overflow-hidden">
  <div class="px-3 py-4">

    <h2 class="text-base font-bold text-slate-800 mb-2">
        <div class="flex gap-1 items-center">
          <MapPin class="mb-2 size-6" />
        </div>
        Ponto de Coleta Central
    </h2>

    <p class="text-gray-600 mb-1 text-xs">
      <span class="font-semibold">Endereço:</span> Rua Exemplo, 123 - Centro, 95000-000
    </p>

    <p class="text-gray-600 mb-3 text-xs">
      <span class="font-semibold">Contato:</span> (54) 1234-5678
    </p>

     <div class="flex flex-row gap-3">
       <button class="w-full bg-white gap-2 flex items-center justify-center hover:bg-green-600 border border-green-600 text-green-600 text-sm font-medium py-2 px-2 rounded-lg transition-colors">
        <Map class="size-5 text-green-600" />
         Ver no Mapa
       </button>
       <button class="w-full bg-white gap-2 flex items-center justify-center text-gray-500 border text-sm font-medium py-2 px-2 rounded-lg transition-colors">
        <img src="/google-maps.png" class="size-5" />
         Google Maps
       </button>
      </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { Map } from 'lucide-vue-next';
import { MapPin } from 'lucide-vue-next';
</script>