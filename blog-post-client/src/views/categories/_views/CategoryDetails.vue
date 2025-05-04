<template>
  <div class="flex flex-col gap-20">
    <Card>
      <template #content>
        <Skeleton v-if="isLoading" width="100%" height="12rem" />

        <div v-else class="flex gap-12">
          <IconWrapper :icon="icon" />
          <div class="flex-1 my-auto">
            <div
              v-html="cleanHtml"
              class="text-gray-800 leading-relaxed space-y-4"
            ></div>
          </div>
        </div>
      </template>
    </Card>

    <div>
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
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCategoriesStore } from '@/stores/categories';
import IconWrapper from '@/components/ui/local/IconWrapper.vue';
import { useBlogsStore } from '@/stores/blogs';
import type { IBlogFilterDTO } from '@/interfaces/blog/blog.interface';
import { useFToast } from '@/composables/useFToast';
import BlogsList from '@/views/blogs/_views/BlogsList.vue';

const { locale, t } = useI18n();
const categoriesStore = useCategoriesStore();
const route = useRoute();
const blogsStore = useBlogsStore();
const { showErrorMessage } = useFToast();

const showUpdateModal = ref(false);
const updateKey = ref(0);
const isLoading = ref(false);

const icon = computed(() => categoriesStore.currentCategory.iconName);

const currentDocument = computed(() => {
  if (locale.value === 'tr') {
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
  const doc = parser.parseFromString(bodyHtml, 'text/html');

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
      const existingStyle = el.getAttribute('style') || '';
      el.setAttribute(
        'style',
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
  const doc = parser.parseFromString(htmlString, 'text/html');

  const styleTags = doc.querySelectorAll('style');
  let styleContent = '';

  styleTags.forEach((style) => {
    styleContent += style.innerHTML + '\n';
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
    updateKey.value++;
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

watch(
  showUpdateModal,
  (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
      fetchCategory();
    }
  },
  { immediate: true },
);

onMounted(() => {
  fetchAll();
});
</script>

<style lang="scss" scoped></style>
