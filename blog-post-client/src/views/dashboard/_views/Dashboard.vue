<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div class="col-span-2">
      <div class="grid grid-cols-1 gap-4 md:gap-12">
        <FText
          :innerText="t('pages.about.banner.title')"
          as="span"
          className="text-6xl flex items-center w-full"
        />
        <FText as="info" className="flex items-center !text-2xl text-start">
          {{ t("pages.about.banner.description") }}
        </FText>
        <FText as="info" className="flex items-center !text-2xl text-start">
          {{ t("pages.about.banner.description_2") }}
        </FText>
        <div class="mt-8 md:mt-12">
          <div class="grid grid-cols-1 gap-8 md:gap-24">
            <div
              class="flex flex-col items-start md:flex-row"
              v-for="item in resumeList"
              :key="item.title"
            >
              <FText
                :innerText="item.title"
                as="ps"
                className="!text-xl flex mr-4 underline items-center min-w-[250px]"
              />
              <ul class="list-inside list-disc">
                <li v-for="li in item.items" :key="li" class="flex">
                  <FText :innerText="li" as="info" className="!text-xl" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-1 flex items-center">
      <img src="/images/banner2.jpeg" class="rounded-lg" alt="Banner" />
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref } from "vue";
import Footer from "@/views/about/_components/footer/Footer.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
