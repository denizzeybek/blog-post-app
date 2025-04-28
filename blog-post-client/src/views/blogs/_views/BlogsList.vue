<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end items-center gap-2">
      <FSelect
        name="filterCategory"
        placeholder="Kategori Adı Seçin"
        :options="categoryTypeOptions"
        v-model="selectedFilter"
        class="!h-full"
      />
      <FInput
        name="filterName"
        v-model="typedName"
        placeholder="Makale ismi girin"
      />
      <Button
        v-if="usersStore.isAuthenticated"
        label="Makale Ekle"
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
        <template #header>
        </template>
        <template #content>
          <BlogItemContent :blog="blog" />
        </template>
      </Card>
    </div>
    <div v-else class="flex justify-center items-center h-96">
      <Card class="flex items-center justify-center">
        <template #content>
          <span class="text-2xl">No blogs found</span>
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
import BlogItemContent from "../_components/BlogItemContent.vue";
import { useCategoriesStore } from "@/stores/categories";
import { useFToast } from "@/composables/useFToast";
import type { IBlogFilterDTO } from "@/interfaces/blog/blog.interface";

const usersStore = useUsersStore();
const categoriesStore = useCategoriesStore();
const blogsStore = useBlogsStore();
const router = useRouter();
const { showErrorMessage } = useFToast();

const isLoading = ref(false);
const showBlogModal = ref(false);
const selectedFilter = ref({
  name: "Tüm Categoriler",
  value: null,
});
const typedName = ref();

// Her ürün için yükleme durumlarını takip etmek için bir obje
const imageLoadingStates = ref<Record<string, boolean>>({});

// Resim yüklenirken skeleton gösterimi için
const handleImageLoad = (id: string) => {
  imageLoadingStates.value[id] = false; // Yükleme tamamlandı
};

const handleImageError = (id: string) => {
  imageLoadingStates.value[id] = false; // Hata durumunda da skeleton kaldırılır
};

const productList = computed(() => {
  return blogsStore.list;
});

const categoryTypeOptions = computed(() => {
  const categoriesList = categoriesStore.list?.map((category) => ({
    name: category.name,
    value: category._id,
  }));

  return [{ name: "Tüm Categoriler", value: null }, ...categoriesList];
});

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

    // Makale yüklendikten sonra tüm ürünler için yükleme durumunu true olarak ayarla
    // blogsStore.list?.forEach((blog) => {
    //   imageLoadingStates.value[blog._id!] = true;
    // });

    isLoading.value = false;
  } catch (error: any) {
    showErrorMessage(error?.response?.data?.message as any);
  }
};

watch([selectedFilter, typedName], filterBlogs, { immediate: true });

onMounted(async () => {
  await categoriesStore.fetch();
  blogsStore.list?.forEach((blog) => {
    imageLoadingStates.value[blog._id!] = true;
  });
});
</script>
