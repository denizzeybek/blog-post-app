<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end items-center gap-2">
      <FSelect
        name="filterCategory"
        :placeholder="t('pages.blogs.blogType.placeholder')"
        :options="blogTypeOptions"
        v-model="selectedFilter"
        class="!h-full"
      />
      <FInput
        name="filterName"
        v-model="typedName"
        :placeholder="t('pages.blogs.name')"
      />
      <Button
        v-if="usersStore.isAuthenticated"
        :label="t('pages.blogs.button_text')"
        @click="showBlogModal = true"
      />
    </div>
    <div
      v-if="productList?.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
    >
      <Card
        v-for="(blog, idx) in productList"
        :key="blog._id"
        @click="
          router.push({
            name: ERouteNames.BlogDetails,
            params: { id: blog._id! },
          })
        "
        class="cursor-pointer"
      >
        <template #content>
          <CardContent
            :name="getCBlogName(blog)"
            :tag="getCategoryName(blog.category)"
          />
        </template>
      </Card>
    </div>
    <div v-else class="flex justify-center items-center h-96">
      <Card class="flex items-center justify-center">
        <template #content>
          <span class="text-2xl">{{ t('pages.blogs.no_blog') }}</span>
        </template>
      </Card>
    </div>
  </div>
  <BlogModal
    v-if="showBlogModal"
    v-model:open="showBlogModal"
    @fetchBlogs="filterBlogs"
  />
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import { useBlogsStore } from '@/stores/blogs';
import { ERouteNames } from '@/router/routeNames.enum';
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import BlogModal from '@/views/blogs/_modals/BlogModal.vue';
import { useCategoriesStore } from '@/stores/categories';
import { useFToast } from '@/composables/useFToast';
import CardContent from '@/components/ui/local/CardContent.vue';
import type { IBlog, IBlogFilterDTO } from '@/interfaces/blog/blog.interface';
import { useI18n } from 'vue-i18n';
import type { ICategory } from '@/interfaces/category/category.interface';

const { t, locale } = useI18n();
const usersStore = useUsersStore();
const categoriesStore = useCategoriesStore();
const blogsStore = useBlogsStore();
const router = useRouter();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);
const showBlogModal = ref(false);
const selectedFilter = ref({
  name: t('pages.blogs.all_categories'),
  value: null,
});
const typedName = ref();

const productList = computed(() => {
  return blogsStore.list;
});

const blogTypeOptions = computed(() => {
  const categoriesList = categoriesStore.list?.map((category) => ({
    name:
      locale.value === 'tr' ? category.categoryName : category.enCategoryName,
    value: category._id,
  }));

  return [
    { name: t('pages.blogs.all_categories'), value: null },
    ...categoriesList,
  ];
});

const getCBlogName = (blog: IBlog) => {
  if (locale.value === 'tr') {
    return blog.name;
  }
  return blog.enName;
};

const getCategoryName = (category: ICategory) => {
  if (locale.value === 'tr') {
    return category.categoryName;
  }
  return category.enCategoryName;
};

const filterBlogs = async () => {
  try {
    // isLoading.value = true;
    const payload = {} as IBlogFilterDTO;
    if (typedName.value) {
      payload.name = typedName.value;
    }
    if (selectedFilter.value.value) {
      payload.category = selectedFilter.value.value;
    }
    await blogsStore.filter(payload);

    isLoading.value = false;
  } catch (error: any) {
    showErrorMessage(error?.response?.data?.message as any);
  }
};

watch([selectedFilter, typedName], filterBlogs, { immediate: true });

watch(locale, () => {
  selectedFilter.value.name = t('pages.blogs.all_categories');
});

onMounted(async () => {
  await categoriesStore.fetch();
});
</script>
