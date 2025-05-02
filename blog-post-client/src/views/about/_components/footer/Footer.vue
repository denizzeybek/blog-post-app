<template>
  <div
    class="relative left-0 right-0 bottom-0 -mx-2 lg:-mx-9 -mb-6 flex-1 py-12"
  >
    <!-- <img src="/umit-mobilya-logo-beyaz.png" /> -->
    <div class="text-md text-center">
      {{ t('pages.footer.title') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped></style>
