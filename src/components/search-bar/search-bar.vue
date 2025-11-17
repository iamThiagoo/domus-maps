<template>
  <div class="z-50 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-1 px-4 py-2 bg-[#F8FBFD] rounded-full shadow-lg">
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
          type="search"
          placeholder="Filtrar por ponto ou bairro de coleta..."
          class="outline-none flex-1 min-w-0 text-[13px] md:text-sm items-center justify-center text-gray-700"
        />

        <button
          @click="toggleFilters"
          class="flex-shrink-0 p-2 btn-scale text-gray-500 transition-colors rounded-full hover:bg-gray-100"
          aria-label="Filtros"
        >
          <BadgeInfo class="size-6 text-sky-500" />
        </button>
      </div>

      <transition name="slide-fade">
        <div
          v-if="showFilters"
          class="mt-4 bg-white rounded-2xl !z-50 max-h-[60vh] text-xs !overflow-y-auto shadow-lg px-5 pt-5 pb-2"
        >
          <h2 class="font-semibold text-lg !text-gray-800">Sobre o Projeto Re.Ciclo</h2>
          <div class="flex justify-center">
            <img src="/app/image.png" alt="Recycle Logo" class="w-11/12 my-4" />
          </div>
          <p class="!text-gray-800 mt-2">
            O objetivo do <strong>Projeto Re.Ciclo</strong>, criado pela <strong>DOMUS</strong>, é
            arrecadar, coletar e vender esses materiais para recicladoras. Os valores arrecadados
            têm destino certo! Eles são direcionados:
          </p>

          <ul class="list-disc list-outside ml-5 mt-2 !text-gray-800">
            <li>À manutenção da casa, para que as despesas fiquem sempre em dia;</li>
            <li>Na compra de medicamentos;</li>
            <li>Ao pagamento de consultas com especialistas;</li>
            <li>Ao pagamento de exames especiais.</li>
          </ul>

          <p class="mt-2 !text-gray-800">
            Todos os valores visam melhorar os serviços prestados às nossas crianças e adolescentes
            com câncer e suas famílias, durante e após o tratamento.
          </p>

          <h3 class="mt-4 font-semibold text-lg !text-gray-800">Como ajudar</h3>
          <p class="mt-1 !text-gray-800">
            Primeiro, comece por você e depois, espalhe essa corrente de empatia, solidariedade e
            consciência ambiental para sua família, amigos e vizinhos! Compartilhe o Projeto
            Re.Ciclo com a comunidade!
          </p>

          <ul class="list-disc list-outside ml-5 mt-2 !text-gray-800">
            <li>
              Junte materiais plásticos e lacres de alumínio das latinhas! Traga até a Domus ou leve
              até o ponto de coleta mais próximo de você!
            </li>
            <li>
              Além de juntar os materiais, torne-se um ponto de coleta! Para isso, solicite a caixa
              de coleta e o material educativo da campanha!
            </li>
          </ul>

          <h3 class="mt-4 font-semibold text-lg !text-gray-800">
            Códigos dos materiais plásticos que aceitamos
          </h3>
          <div class="flex justify-center">
            <img src="/app/materials.png" class="w-8/12 my-6" />
          </div>
          <ul class="list-disc list-outside ml-5 mb-3 !text-gray-800">
            <li>PP (P5 ou somente 5)</li>
            <li>PEAD (P2 ou somente 2)</li>
            <li>PVC (P3 ou somente 3)</li>
            <li>PEBD (P4 ou somente 4)</li>
          </ul>

          <p class="mt-2 !text-gray-800">
            <strong>ATENÇÃO:</strong> confira se a embalagem que deseja enviar apresenta um dos
            códigos acima. No caso de dúvidas, envie para avaliarmos.
          </p>

          <h3 class="mt-4 font-semibold text-lg !text-gray-800">Exemplos de materiais</h3>
          <ul class="list-disc list-outside ml-5 my-3 !text-gray-800">
            <li>Tampinhas plásticas: refrigerante, água mineral, maionese, etc.</li>
            <li>
              Embalagens com tampa: requeijão, margarina, sorvete, amaciante, água sanitária, água
              oxigenada, sabonete líquido, sabonete íntimo, etc.
            </li>
          </ul>

          <h3 class="mt-4 font-semibold text-lg !text-gray-800">
            Tipos de materiais que <span class="text-red-600 font-bold">NÃO</span> aceitamos
          </h3>
          <ul class="list-disc list-outside ml-5 mt-2 mb-5 !text-gray-800">
            <li>Acrílico</li>
            <li>Metal</li>
            <li>Cartelas de medicamentos</li>
            <li>Lacres plásticos</li>
            <li>Tampas de metal</li>
            <li>Cortiça</li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue'
  import { useSearchStore } from '../../utils/store/search'
  import { BadgeInfo } from 'lucide-vue-next'

  const showFilters = ref(false)
  const searchStore = useSearchStore()
  const search = ref(searchStore.search)
  const bairroLocation = ref(searchStore.bairroSearch)
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
</script>
