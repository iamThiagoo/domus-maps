<template>
  <div ref="mapDiv" class="w-full h-[100dvh]"></div>
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

  const props = defineProps(['selectedPoint', 'points', 'mapClickMarker'])
  const emit = defineEmits(['mapReady'])

  const updateMarkers = (points, google, directionsService, directionsRenderer) => {
    if (!map || !google) return
    markers.forEach(m => m.marker.setMap(null))
    markers.length = 0

    if (!points || !points.length) return
    const bounds = new google.maps.LatLngBounds()
    const size = 24

    points.forEach(ponto => {
      const marker = new google.maps.Marker({
        position: { lat: ponto.latitude, lng: ponto.longitude },
        icon: { url: '/map-marker.svg', scaledSize: new google.maps.Size(size, size) },
        map,
        title: ponto.nome,
      })
      markers.push({ marker, ponto })
      marker.addListener('click', () => {
        emit('mapClickMarker', ponto)
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
      center: { lat: -29.1, lng: -51.18 },
      zoom: isMobile ? 12.5 : 14,
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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          map.setCenter(userLocation)

          new google.maps.Marker({
            position: userLocation,
            map,
            icon: {
              url: '/marker.png',
              scaledSize: new google.maps.Size(25, 25),
            },
          })
        },
        error => {
          console.warn('Erro ao pegar localização:', error)
          updateMarkers(props.points, google, directionsService, directionsRenderer)
        }
      )
    }

    updateMarkers(props.points, google, directionsService, directionsRenderer)
  })
</script>
