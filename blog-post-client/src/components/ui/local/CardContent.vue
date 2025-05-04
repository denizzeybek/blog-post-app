<template>
  <div
    :class="[tag ? 'justify-start' : 'justify-center']"
    class="flex items-center flex-col justify-between gap-1 w-full"
  >
    <IconWrapper v-if="icon" :icon="icon" />
    <div
      class="font-semibold uppercase text-xl leading-8 text-black center text-center"
    >
      {{ name }}
    </div>
    <Tag v-if="tag" severity="info">
      <span class="uppercase">{{ tag }}</span>
    </Tag>
  </div>
</template>

<script setup lang="ts">
import IconWrapper from '@/components/ui/local/IconWrapper.vue';

interface IProps {
  name: string;
  tag?: string;
  icon?: string;
}
defineProps<IProps>();
</script>
