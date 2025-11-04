<template>
  <div
    class="relative min-h-[20rem] left-0 right-0 -mx-9 flex flex-col items-center justify-center rounded-md text-white"
  >
    <div
      class="absolute inset-0 bg-cover bg-center blur-sm"
      style="background-image: url(&quot;/images/banner2.jpeg&quot;)"
    ></div>
    <div class="relative z-10 flex flex-col gap-8 items-center">
      <div class="text-4xl">{{ t("pages.contact.banner.title") }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped></style>
