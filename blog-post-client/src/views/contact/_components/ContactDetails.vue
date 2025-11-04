<template>
  <div class="grid grid-cols-1 lg:grid-cols-3">
    <div
      v-for="item in itemList"
      class="col-span-1 flex items-center justify-center"
    >
      <BannerText
        :title="item.title"
        :text="item.text"
        :sub-text="item.subText"
        center
      />
    </div>
    <GoogleMaps class="col-span-2" />
  </div>
</template>

<script setup lang="ts">
import BannerText from "@/views/about/_components/banner/BannerText.vue";
import { useI18n } from "vue-i18n";
import GoogleMaps from "@/views/about/_components/googleMaps/GoogleMaps.vue";

const { t } = useI18n();

const itemList = [
  {
    title: t("pages.contact.title"),
    text: t("pages.contact.address"),
    subText: t("pages.contact.phone"),
  },
];
</script>

<style scoped></style>
