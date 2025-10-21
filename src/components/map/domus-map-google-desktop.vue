<template>
  <div ref="mapDiv" class="w-full h-full rounded-3xl"></div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { Loader } from '@googlemaps/js-api-loader'
  import { styles } from '@/utils/map-styles'
  import { getMapsLink } from '../../utils/helpers'

  let map = null
  let activeInfoWindow = null
  const markers = []
  const mapDiv = ref(null)

  const props = defineProps(['selectedPoint', 'points'])
  const emit = defineEmits(['mapReady'])

  const updateMarkers = (points, google, directionsService, directionsRenderer) => {
    if (!map || !google) return
    markers.forEach(m => m.marker.setMap(null))
    markers.length = 0

    if (!points || !points.length) return

    const bounds = new google.maps.LatLngBounds()

    points.forEach(ponto => {
      const marker = new google.maps.Marker({
        position: { lat: ponto.latitude, lng: ponto.longitude },
        icon: { url: '/map-marker.svg', scaledSize: new google.maps.Size(35, 35) },
        map,
        title: ponto.nome,
      })

      const infoWindowContent = document.createElement('div')
      infoWindowContent.className = 'pb-1 px-1 max-w-sm'

      infoWindowContent.innerHTML = `
      <div class="relative max-w-sm px-1 pb-1">
        <h3 class="mb-2 text-sm font-semibold text-gray-800 truncate">${ponto.nome}</h3>

        <p class="mb-2 text-xs leading-relaxed text-gray-600">
          ${ponto.endereco}, ${ponto.numero_endereco}<br/>
          ${ponto.nome_bairro} - CEP ${ponto.cep}
        </p>

        <a href="tel:${ponto.telefone?.replace(/\D/g, '')}" 
          class="block mb-2 text-xs font-medium text-blue-600 outline-none hover:text-blue-700">
          ${ponto.telefone || 'Sem contato'}
        </a>

        <div class="flex gap-2 mt-3">
          <button class="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded shadow text-nowrap rota-btn hover:bg-green-700">
            Ver rota
          </button>
          <a href="${getMapsLink(ponto)}" target="_blank" rel="noopener noreferrer"
            class="flex-1 px-3 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded shadow text-nowrap hover:bg-blue-700">
            Google Maps
          </a>
        </div>
      </div>
    `

      const info = new google.maps.InfoWindow({ content: infoWindowContent })
      markers.push({ ponto, marker, infoWindow: info })

      marker.addListener('click', () => {
        if (activeInfoWindow) activeInfoWindow.close()
        info.open(map, marker)
        activeInfoWindow = info

        const btn = infoWindowContent.querySelector('.rota-btn')
        if (btn) {
          btn.onclick = () => {
            if (!navigator.geolocation) {
              alert('Geolocalização não suportada pelo navegador.')
              return
            }

            navigator.geolocation.getCurrentPosition(
              pos => {
                const userPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude }

                directionsService.route(
                  {
                    origin: userPosition,
                    destination: { lat: ponto.latitude, lng: ponto.longitude },
                    travelMode: google.maps.TravelMode.DRIVING,
                  },
                  (result, status) => {
                    if (status === 'OK') directionsRenderer.setDirections(result)
                    else alert('Não foi possível calcular a rota: ' + status)
                  }
                )
              },
              err => alert('Não foi possível obter sua localização: ' + err.message)
            )
          }
        }
      })

      bounds.extend(marker.getPosition())
    })
  }

  watch(
    () => props.selectedPoint,
    newVal => {
      if (!newVal) return
      const selected = markers.find(
        m => m.ponto.nome === newVal.nome && m.ponto.endereco === newVal.endereco
      )
      if (selected) {
        if (activeInfoWindow) activeInfoWindow.close()
        selected.infoWindow.open(map, selected.marker)
        activeInfoWindow = selected.infoWindow
        map.panTo(selected.marker.getPosition())
      }
    }
  )

  let google = null
  let directionsService = null
  let directionsRenderer = null

  watch(
    () => props.points,
    newPoints => {
      updateMarkers(newPoints, google, directionsService, directionsRenderer)
    },
    { deep: true, immediate: true }
  )

  onMounted(async () => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    })
    google = await loader.load()
    const isMobile = window.innerWidth <= 650

    map = new google.maps.Map(mapDiv.value, {
      center: { lat: -29.2, lng: -51.18 },
      zoom: 12.5,
      styles,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      gestureHandling: 'greedy',
      restriction: {
        latLngBounds: {
          north: -29.1,
          south: -29.25,
          west: -51.25,
          east: -51.1,
        },
        strictBounds: false,
      },
    })

    emit('mapReady', map)

    directionsService = new google.maps.DirectionsService()
    directionsRenderer = new google.maps.DirectionsRenderer({ map })
    updateMarkers(props.points, google, directionsService, directionsRenderer)
  })
</script>
