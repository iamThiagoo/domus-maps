<template>
  <div id="map" class="w-full h-full" />
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'

  const map = ref(null)
  const mapIsReady = ref(false)

  onMounted(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

    map.value = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-51.17, -29.19],
      zoom: 12,
      minZoom: 2,
      bearing: 0,
      antialias: true,
    })

    map.value.addControl(new mapboxgl.NavigationControl())

    map.value.on('style.load', () => {
      map.value.setProjection('mercator')
      map.value.setFog(null)
    })

    map.value.on('load', () => {
      mapIsReady.value = true

      const numberOfMarkers = 20
      const minLng = -51.23
      const maxLng = -51.13
      const minLat = -29.23
      const maxLat = -29.14

      for (let i = 0; i < numberOfMarkers; i++) {
        const lng = Math.random() * (maxLng - minLng) + minLng
        const lat = Math.random() * (maxLat - minLat) + minLat

        new mapboxgl.Marker({ color: '#E77C36' }).setLngLat([lng, lat]).addTo(map.value)
      }
    })
  })
</script>

<style scoped>
  #map {
    width: 100%;
    height: 100%;
  }
</style>
