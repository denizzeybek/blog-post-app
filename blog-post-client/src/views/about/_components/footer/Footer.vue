<template>
  <div class="w-full pt-18 text-center text-sm text-gray-600">
    <div class="text-md text-center">
      {{ t('pages.footer.title') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
