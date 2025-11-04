<template>
  <div class="flex flex-col items-start justify-between gap-1 w-full max-w-sm">
    <div
      class="font-semibold uppercase text-xl leading-8 text-black max-[550px]:text-center"
    >
      {{ blog?.name }}
    </div>
    <Tag>
      <span class="uppercase">{{ getCategoryName(blog?.category) }}</span>
    </Tag>
  </div>
</template>

<script setup lang="ts">
import type { IBlog, IBlogModule } from "@/interfaces/blog/blog.interface";
import { useName } from "@/composables/useName";

interface IProps {
  blog: IBlog | IBlogModule;
}

defineProps<IProps>();
const { getCategoryName } = useName();
</script>

<style scoped></style>
