<template>
  <div
    :class="[tag ? 'justify-start' : 'justify-center']"
    class="flex items-center flex-col justify-between gap-3 w-full h-full p-6 transition-all duration-300"
  >
    <IconWrapper
      v-if="icon"
      :icon="icon"
      class="transform transition-transform duration-300 group-hover:scale-110"
    />

    <!-- Blog Title -->
    <div
      class="font-bold text-2xl leading-tight text-gray-900 text-center line-clamp-3 transition-colors duration-300 group-hover:text-primary-900"
    >
      {{ name }}
    </div>

    <!-- Category Tag -->
    <Tag
      v-if="tag"
      class="!px-4 !py-2 !rounded-full !bg-primary-900 !text-white shadow-sm group-hover:!bg-accent-700 transition-all duration-300"
    >
      <span class="uppercase text-xs font-semibold tracking-wider">{{ tag }}</span>
    </Tag>

    <!-- Optional metadata section -->
    <div v-if="description" class="text-sm text-gray-600 text-center line-clamp-2 mt-2">
      {{ description }}
    </div>

    <!-- Read more indicator -->
    <div class="mt-auto pt-4 flex items-center gap-2 text-primary-900 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <span>{{ t('pages.blogs.read_more') }}</span>
      <i class="pi pi-arrow-right text-xs"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconWrapper from '@/components/ui/local/IconWrapper.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface IProps {
  name: string;
  tag?: string;
  icon?: string;
  description?: string;
}
defineProps<IProps>();
</script>
