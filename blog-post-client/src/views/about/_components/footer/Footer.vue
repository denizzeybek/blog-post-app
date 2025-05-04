<template>
  <div class="w-full py-6 text-center text-sm text-gray-600">
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
