<template>
  <div ref="mapDiv" class="w-full h-[100vh]"></div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { Loader } from '@googlemaps/js-api-loader'
  import { styles } from '@/utils/map-styles'
  import { points as pontosDeColeta } from '@/mocks/pontos'

  let map = null
  let activeInfoWindow = null
  const markers = []
  const mapDiv = ref(null)
  const userPosition = ref(null)

  const props = defineProps(['selectedPoint'])

  watch(
    () => props.selectedPoint,
    newVal => {
      if (newVal) {
        const selected = markers.find(
          m => m.ponto.nome == newVal.nome && m.ponto.endereco == newVal.endereco
        )
        if (selected) {
          if (activeInfoWindow) activeInfoWindow.close()
          selected.infoWindow.open(map, selected.marker)
          activeInfoWindow = selected.infoWindow
          map.panTo(selected.marker.getPosition())
        }
      }
    }
  )

  onMounted(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          userPosition.value = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }
        },
        err => {
          console.error('Error user location:', err)
        }
      )
    }

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    })

    const isMobile = window.innerWidth <= 650
    const google = await loader.load()

    map = new google.maps.Map(mapDiv.value, {
      center: { lat: -29.18, lng: -51.18 },
      zoom: isMobile ? 12.6 : 14,
      styles,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
    })

    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: false,
    })

    pontosDeColeta.forEach(ponto => {
      const marker = new google.maps.Marker({
        position: { lat: ponto.latitude, lng: ponto.longitude },
        map,
        title: ponto.nome,
      })

      const info = new google.maps.InfoWindow({
        content: `
      <div>
        <h3 class="mb-2 text-sm font-semibold text-gray-800 text-nowrap">
          ${ponto.nome}
        </h3>

        <div class="flex flex-col gap-2 text-xs text-gray-600">
          <div class="leading-relaxed">
            ${ponto.endereco}, ${ponto.numero}<br/>
            ${ponto.bairro} - CEP ${ponto.cep}
          </div>

          <div class="flex items-center gap-2">
            <a href="tel:${ponto.telefone.replace(/\D/g, '')}" 
              class="font-medium text-blue-600 outline-none hover:text-blue-700">
              ${ponto.telefone}
            </a>
          </div>
        </div>

        <div class="flex gap-2 mt-3">
          <button
            class="flex items-center justify-center w-full px-4 py-2 text-xs font-medium text-white transition-colors bg-green-600 rounded-md shadow rota-btn hover:bg-green-700">
            Ver rota
          </button>
          
          <a href="${ponto.mapsLink}" 
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center w-full px-4 py-2 text-xs font-medium text-white transition-colors bg-blue-600 rounded-md shadow text-nowrap hover:bg-blue-700">
            Google Maps
          </a>
        </div>
      </div>
    `,
      })

      markers.push({ ponto, marker, infoWindow: info })

      marker.addListener('click', () => {
        if (activeInfoWindow) activeInfoWindow.close()

        info.open(map, marker)
        activeInfoWindow = info

        google.maps.event.addListenerOnce(info, 'domready', () => {
          const infoWindowDiv =
            info.getContent() instanceof HTMLElement
              ? info.getContent()
              : document.querySelector('.gm-style-iw')

          if (infoWindowDiv) {
            const btn = infoWindowDiv.querySelector('.rota-btn')
            if (btn) {
              btn.addEventListener('click', () => {
                if (!userPosition.value) {
                  alert('Localização do usuário ainda não disponível.')
                  return
                }

                const origem = userPosition.value
                const destino = { lat: ponto.latitude, lng: ponto.longitude }

                directionsService.route(
                  {
                    origin: origem,
                    destination: destino,
                    travelMode: google.maps.TravelMode.DRIVING,
                  },
                  (result, status) => {
                    if (status === 'OK') {
                      directionsRenderer.setDirections(result)
                    } else {
                      alert('Não foi possível calcular a rota: ' + status)
                    }
                  }
                )
              })
            }
          }
        })
      })
    })
  })
</script>
