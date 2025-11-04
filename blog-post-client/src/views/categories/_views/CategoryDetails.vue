<template>
  <div class="flex flex-col gap-12">
    <CategoryHeader
      v-if="usersStore.isAuthenticated"
      @handleUpdateCategory="showCategoryModal = true"
    />
    <Card>
      <template #content>
        <Skeleton v-if="isLoading" width="100%" height="12rem" />

        <div v-else class="flex flex-col gap-12">
          <div class="flex justify-center">
            <FText as="h2" :innerText="title" />
          </div>
          <div class="flex flex-col lg:flex-row gap-12">
            <div
              class="w-full lg:w-fit flex justify-center items-center lg:items-start"
            >
              <IconWrapper :icon="icon" />
            </div>
            <div class="flex-1 my-auto">
              <div
                v-html="cleanHtml"
                class="text-gray-800 leading-relaxed space-y-4"
              ></div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <div class="flex flex-col gap-8">
      <div class="flex justify-center">
        <FText as="h1" :innerText="t('pages.category.related_blogs')" />
      </div>
      <Card>
        <template #content>
          <BlogsList
            :categoryId="route.params.id?.toString()"
            :showFilters="false"
          />
        </template>
      </Card>
    </div>
  </div>
  <CategoryModal
    v-if="showCategoryModal"
    v-model:open="showCategoryModal"
    :data="categoriesStore.currentCategory"
    @fetchCategories="fetchAll"
  />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCategoriesStore } from "@/stores/categories";
import IconWrapper from "@/components/ui/local/IconWrapper.vue";
import { useBlogsStore } from "@/stores/blogs";
import type { IBlogFilterDTO } from "@/interfaces/blog/blog.interface";
import { useFToast } from "@/composables/useFToast";
import BlogsList from "@/views/blogs/_views/BlogsList.vue";
import CategoryHeader from "../_components/CategoryHeader.vue";
import { useUsersStore } from "@/stores/users";
import CategoryModal from "../_components/_modals/CategoryModal.vue";

const { locale, t } = useI18n();
const { showErrorMessage } = useFToast();
const route = useRoute();
const usersStore = useUsersStore();
const categoriesStore = useCategoriesStore();
const blogsStore = useBlogsStore();

const isLoading = ref(false);
const showCategoryModal = ref(false);

const icon = computed(() => categoriesStore.currentCategory.iconName);
const title = computed(() => {
  if (locale.value === "tr") {
    return categoriesStore.currentCategory.categoryName;
  }
  return categoriesStore.currentCategory.enCategoryName;
});

const currentDocument = computed(() => {
  if (locale.value === "tr") {
    return categoriesStore.currentCategory.categoryDetails;
  }
  return categoriesStore.currentCategory.enCategoryDetails;
});

const cleanHtml = computed(() => {
  const { styleContent, bodyContent } = extractStyleAndBody(
    currentDocument.value,
  );
  return inlineStyles(bodyContent, styleContent);
});

const inlineStyles = (bodyHtml, styleCss) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(bodyHtml, "text/html");

  const styleMap = {};

  // 1. Style içindeki classları parse et (.className { ... })
  const regex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(styleCss)) !== null) {
    const className = match[1];
    const styles = match[2].trim();
    styleMap[className] = styles;
  }

  // 2. Body içindeki elemanları bul
  Object.keys(styleMap).forEach((className) => {
    const elements = doc.querySelectorAll(`.${className}`);
    elements.forEach((el) => {
      // Var olan inline style varsa üstüne ekleyelim
      const existingStyle = el.getAttribute("style") || "";
      el.setAttribute(
        "style",
        `${existingStyle} ${styleMap[className]}`.trim(),
      );

      // İstersen eski class'ı silebilirsin, ya da bırakabilirsin
      el.classList.remove(className);
    });
  });

  return doc.body.innerHTML;
};

const extractStyleAndBody = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const styleTags = doc.querySelectorAll("style");
  let styleContent = "";

  styleTags.forEach((style) => {
    styleContent += style.innerHTML + "\n";
    style.remove(); // style tag'ı dokümandan çıkarıyoruz, body daha temiz olsun diye
  });

  const bodyContent = doc.body.innerHTML;

  return {
    styleContent,
    bodyContent,
  };
};

const fetchCategory = async () => {
  try {
    await categoriesStore.find(route.params.id?.toString());
  } catch (error: any) {
    showErrorMessage(error);
  }
};

const fetchRelatedBlogs = async () => {
  try {
    const payload = {
      category: route.params.id,
    } as IBlogFilterDTO;
    await blogsStore.filter(payload);
  } catch (error: any) {
    showErrorMessage(error);
  }
};

const fetchAll = async () => {
  isLoading.value = true;
  await fetchCategory();
  await fetchRelatedBlogs();
  isLoading.value = false;
};

onMounted(() => {
  fetchAll();
});
</script>

<style lang="scss" scoped></style>
