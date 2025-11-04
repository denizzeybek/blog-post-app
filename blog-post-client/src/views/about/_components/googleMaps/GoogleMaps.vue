<template>
  <GoogleMap :api-key="apiKey" :style="style" :center="center" :zoom="15">
    <Marker :options="{ position: center }" />
  </GoogleMap>
</template>

<script setup lang="ts">
import { GoogleMap, Marker } from "vue3-google-map";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const center = { lat: 37.86248, lng: 27.26119 };

interface IProps {
  style?: Record<string, string>;
}

withDefaults(defineProps<IProps>(), {
  style: () => ({
    width: "100%",
    height: "300px",
  }),
});
</script>
