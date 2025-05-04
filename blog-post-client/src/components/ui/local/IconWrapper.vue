<template>
  <div
    class="flex-shrink-0 flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full"
  >
    <i :class="icon" style="font-size: 40px" class="text-blue-600"></i>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  icon: string;
}

defineProps<IProps>();
</script>
