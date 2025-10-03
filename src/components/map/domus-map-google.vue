<template>
  <div ref="mapDiv" class="w-full h-[100vh]"></div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { Loader } from '@googlemaps/js-api-loader'
  import { styles as airbnbStyle } from '@/utils/map-styles'

  const mapDiv = ref(null)

  onMounted(async () => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    })

    const isMobile = window.innerWidth <= 650
    const google = await loader.load()

    const map = new google.maps.Map(mapDiv.value, {
      center: { lat: -29.18, lng: -51.18 },
      zoom: isMobile ? 12.6 : 14,
      styles: airbnbStyle,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
    })

    // pontosDeColeta.forEach(ponto => {
    //   const marker = new google.maps.Marker({
    //     position: { lat: ponto.lat, lng: ponto.lng },
    //     map,
    //     title: ponto.nome,
    //   })

    //   const info = new google.maps.InfoWindow({
    //     content: `<strong>${ponto.nome}</strong>`,
    //   })

    //   marker.addListener('click', () => {
    //     info.open(map, marker)
    //   })
    // })
  })
</script>
