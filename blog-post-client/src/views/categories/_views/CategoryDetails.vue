<template>
  <div class="flex flex-col gap-4">
    <div
      v-if="blogList?.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
    >
      <template v-for="blog in blogList" :key="blog._id">
        <BlogCard :blog="blog" />
      </template>
    </div>
    <div v-else class="flex justify-center items-center h-96">
      <EmptyCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCategoriesStore } from '@/stores/categories';
import { useBlogsStore } from '@/stores/blogs';
import EmptyCard from '@/components/ui/local/EmptyCard.vue';
import { useBlogDetails } from '@/views/blogs/_composables/useBlogDetails';
import {useRoute} from 'vue-router';
import BlogCard from '@/views/blogs/_components/BlogCard.vue';

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

const categoriesStore = useCategoriesStore();
const blogsStore = useBlogsStore();
const { filterBlogs } = useBlogDetails();
const route = useRoute();

const blogList = computed(() => {
  return blogsStore.list;
});

onMounted(async () => {
  // await fetchCategoryDetails();
  filterBlogs(null, route.params.id);
});
</script>
