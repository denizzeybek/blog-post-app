<template>
  <div class="flex-1 flex items-center justify-center py-20">
    <div class="w-1/2 flex flex-col lg:flex-row gap-12">
      <template v-for="item in itemList">
        <BannerText
          :title="item.title"
          :text="item.text"
          :sub-text="item.subText"
          center
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import BannerText from "@/views/about/_components/banner/BannerText.vue";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const itemList = [
  {
    title: t('pages.contact.title'),
    text: t('pages.contact.address'),
    subText: t('pages.contact.phone'),
  },
];
</script>

<style scoped></style>
