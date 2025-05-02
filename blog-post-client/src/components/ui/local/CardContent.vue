<template>
  <div
    :class="[tag ? 'justify-start' : 'justify-center']"
    class="flex items-center flex-col justify-between gap-1 w-full"
  >
    <div
      class="font-semibold uppercase text-xl leading-8 text-black center text-center"
    >
      {{ name }}
    </div>
    <Tag v-if="tag" severity="contrast">
      <span class="uppercase">{{ tag }}</span>
    </Tag>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  name: string;
  tag?: string;
}
defineProps<IProps>();
</script>
