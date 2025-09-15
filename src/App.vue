<template>
  <div class="h-screen">
    <UApp :toaster="{ position: 'top-center' }">
      <DomusMap />
      <BottomSheet
        ref="bottomSheet"
        :blocking="false"
        :snap-points="['30%', '90%']"
        @closed="open = false"
      >
        <h1 class="text-xs text-center font-medium flex items-center justify-center gap-x-2 mb-4">+80 pontos de coleta <img src="/logo.png" class="w-1/6" /> encontrados</h1>
        <UInput icon="i-lucide-search" size="lg" variant="outline" placeholder="Pesquisar por Ponto de Coleta..." />

        <div class="mt-2">
          <USeparator icon="i-simple-icons-nuxtdotjs" />
        </div>

        <div class="mt-2">
          <h2 class="text-lg font-medium">Explore nossos Pontos de Coleta</h2>

          <div class="mt-5 flex flex-col gap-5 mb-6">
            <CollectionPointCard v-for="n in 5" :key="n" :ponto="ponto" />
          </div>
        </div>
      </BottomSheet>
    </UApp>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BottomSheet from "@douxcode/vue-spring-bottom-sheet";
import "@douxcode/vue-spring-bottom-sheet/dist/style.css";
import CollectionPointCard from './components/card/collection-point-card.vue';
import DomusMap from "./components/map/domus-map.vue";

const bottomSheet = ref<InstanceType<typeof BottomSheet>>()
const open = ref(false)

const ponto = {
  nome: 'Ponto de Coleta Central',
  endereco: 'Rua Felisberto Soares',
  numero: '1234',
  bairro: 'Centro',
  cep: '95010-000',
  telefone: '(54) 1234-5678'
}

const toggle = () => {
  open.value = !open.value

  if (open.value) {
    bottomSheet.value?.open()
  } else {
    bottomSheet.value?.close()
  }
}

onMounted(() => {
  toggle()
})
</script>