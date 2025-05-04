<template>
  <div class="flex flex-col justify-center gap-4 h-full">
    <div
      :class="center ? 'lg:text-center' : 'text-left'"
      class="text-3xl font-semibold"
    >
      {{ title }}
    </div>
    <div
      :class="center ? 'lg:text-center' : 'text-left'"
      v-html="text"
      class="text-lg"
    />
    <div
      v-if="subText"
      :class="center ? 'lg:text-center' : 'text-left'"
      class="text-lg"
    >
      {{ subText }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  title: string;
  text: string;
  subText?: string;
  center?: boolean;
}

withDefaults(defineProps<IProps>(), {
  center: false,
});
</script>

<style scoped></style>
