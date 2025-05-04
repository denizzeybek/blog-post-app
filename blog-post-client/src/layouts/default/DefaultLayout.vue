<template>
  <div class="flex flex-col min-h-screen lg:px-24">
    <div class="fixed top-0 left-0 w-full z-50">
      <PageHeader @drawerChange="visible = $event" />
    </div>
    <div class="mt-[101px] flex flex-col flex-grow w-full 3xl:items-center">
      <div class="w-full relative max-w-7xl flex-grow">
        <PageWrapper>
          <RouterView />
        </PageWrapper>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script lang="ts" setup>
import PageWrapper from "./_components/PageWrapper.vue";
import { ref } from "vue";
import Footer from '@/views/about/_components/footer/Footer.vue';
import PageHeader from "./_components/PageHeader.vue";

const visible = ref(false);
</script>
