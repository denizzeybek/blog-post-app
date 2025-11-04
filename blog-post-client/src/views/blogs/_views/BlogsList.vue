<template>
  <div class="flex flex-col gap-8 w-full min-h-screen">
    <!-- Hero Section with Filters -->
    <template v-if="showFilters">
      <!-- Sticky Filter Bar -->
      <div
        class="sticky top-0 z-10 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 backdrop-blur-lg bg-opacity-95 -mx-8 px-8 py-6 shadow-md border-b-2 border-blue-900"
      >
        <div class="flex flex-col gap-4">
          <!-- Title Section -->
          <div class="flex justify-center mb-2">
            <div class="text-center">
              <h1 class="text-4xl md:text-5xl font-bold text-blue-900 mb-2">
                {{ t("pages.blogs.title") }}
              </h1>
              <div class="flex items-center justify-center gap-2">
                <div class="w-12 h-0.5 bg-accent-400"></div>
                <p class="text-gray-600 text-sm font-medium">
                  {{ productList?.length || 0 }}
                  {{ t("pages.blogs.found_count") }}
                </p>
                <div class="w-12 h-0.5 bg-accent-400"></div>
              </div>
            </div>
          </div>

          <!-- Filter Controls -->
          <div
            class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3"
          >
            <div class="flex flex-col sm:flex-row gap-3 flex-1">
              <FInput
                name="filterName"
                v-model="typedName"
                :placeholder="t('pages.blogs.name')"
                class="flex-1"
              >
                <template #prefix>
                  <i class="pi pi-search text-gray-400"></i>
                </template>
              </FInput>

              <FSelect
                name="filterCategory"
                :placeholder="t('pages.blogs.blogType.placeholder')"
                :options="blogTypeOptions"
                v-model="selectedFilter"
                class="!h-full flex-1 md:max-w-xs"
              />
            </div>

            <Button
              v-if="usersStore.isAuthenticated"
              :label="t('pages.blogs.button_text')"
              @click="showBlogModal = true"
              class="!px-6 !py-2 !bg-primary-900 hover:!bg-primary-800 !border-primary-900 hover:!border-primary-800 !text-white !shadow-md hover:!shadow-lg transition-all duration-300"
            >
              <template #icon>
                <i class="pi pi-plus mr-2"></i>
              </template>
            </Button>
          </div>
        </div>
      </div>
    </template>

    <!-- Loading State with Enhanced Skeletons -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
    >
      <div v-for="i in 8" :key="i" class="animate-pulse">
        <div class="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Blog Grid with Stagger Animation -->
    <TransitionGroup
      v-else-if="productList?.length"
      name="blog-list"
      tag="div"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
    >
      <div
        v-for="(blog, idx) in productList"
        :key="blog._id"
        :style="{ animationDelay: `${idx * 50}ms` }"
        class="blog-item"
      >
        <Card
          @click="
            router.push({
              name: ERouteNames.BlogDetails,
              params: { id: blog._id! },
            })
          "
          class="group cursor-pointer h-full overflow-hidden border-2 border-gray-200 hover:border-primary-900 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-white"
        >
          <template #content>
            <div class="relative min-h-[250px]">
              <!-- Professional overlay on hover -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-primary-900/0 to-accent-500/0 group-hover:from-primary-900/5 group-hover:to-accent-500/5 transition-all duration-500 rounded-lg"
              ></div>

              <CardContent
                :name="getBlogName(blog)"
                :tag="getCategoryName(blog.category)"
              />
            </div>
          </template>
        </Card>
      </div>
    </TransitionGroup>

    <!-- Empty State -->
    <div v-else class="flex justify-center items-center min-h-[400px]">
      <Card
        class="max-w-md w-full shadow-xl border-2 border-dashed border-gray-300"
      >
        <template #content>
          <div
            class="flex flex-col items-center justify-center p-8 text-center"
          >
            <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-2xl font-bold text-gray-700 mb-2">
              {{ t("pages.blogs.no_blog") }}
            </h3>
            <p class="text-gray-500 mb-6">
              {{ t("pages.blogs.empty_state.message") }}
            </p>
            <Button
              v-if="usersStore.isAuthenticated"
              :label="t('pages.blogs.empty_state.create_first')"
              @click="showBlogModal = true"
              icon="pi pi-plus"
              class="!bg-primary-900 hover:!bg-primary-800 !border-primary-900 hover:!border-primary-800 !text-white"
            />
          </div>
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
import { onMounted, computed, ref, watch } from "vue";
import { useBlogsStore } from "@/stores/blogs";
import { ERouteNames } from "@/router/routeNames.enum";
import { useRouter } from "vue-router";
import { useUsersStore } from "@/stores/users";
import BlogModal from "@/views/blogs/_modals/BlogModal.vue";
import { useCategoriesStore } from "@/stores/categories";
import { useFToast } from "@/composables/useFToast";
import CardContent from "@/components/ui/local/CardContent.vue";
import type { IBlogFilterDTO } from "@/interfaces/blog/blog.interface";
import { useI18n } from "vue-i18n";
import { useName } from "@/composables/useName";

interface IProps {
  categoryId?: string;
  showFilters?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  showFilters: true,
});

const { t, locale } = useI18n();
const usersStore = useUsersStore();
const categoriesStore = useCategoriesStore();
const blogsStore = useBlogsStore();
const router = useRouter();
const { showErrorMessage } = useFToast();
const { getCategoryName, getBlogName } = useName();

const isLoading = ref(false);
const showBlogModal = ref(false);
const selectedFilter = ref({
  name: t("pages.blogs.all_blogs"),
  value: null,
});
const typedName = ref();

const productList = computed(() => {
  return blogsStore.list;
});

const blogTypeOptions = computed(() => {
  const categoriesList = categoriesStore.list?.map((category) => ({
    name:
      locale.value === "tr" ? category.categoryName : category.enCategoryName,
    value: category._id,
  }));

  return [{ name: t("pages.blogs.all_blogs"), value: null }, ...categoriesList];
});

const filterBlogs = async () => {
  try {
    isLoading.value = true;
    const payload = {} as IBlogFilterDTO;
    if (typedName.value) {
      payload.name = typedName.value;
    }
    if (selectedFilter.value.value) {
      payload.category = selectedFilter.value.value;
    }
    if (props.categoryId) {
      payload.category = props.categoryId;
    }
    await blogsStore.filter(payload);

    isLoading.value = false;
  } catch (error: any) {
    showErrorMessage(error?.response?.data?.message as any);
  }
};

watch([selectedFilter, typedName], filterBlogs, { immediate: true });

watch(locale, () => {
  selectedFilter.value.name = t("pages.blogs.all_blogs");
});

onMounted(async () => {
  await categoriesStore.fetch();
});
</script>

<style scoped>
/* Blog List Animations */
.blog-item {
  animation: fadeInUp 0.6s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* TransitionGroup animations */
.blog-list-enter-active {
  transition: all 0.5s ease;
}

.blog-list-leave-active {
  transition: all 0.3s ease;
}

.blog-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.blog-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.blog-list-move {
  transition: transform 0.5s ease;
}
</style>
