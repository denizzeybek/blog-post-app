<template>
  <div class="flex flex-col gap-12">
    <BlogHeader
      v-if="usersStore.isAuthenticated"
      @handleUpdateBlog="showBlogModal = true"
    />
    <Card>
      <template #content>
        <Skeleton v-if="isLoading" width="100%" height="12rem" />

        <div v-else class="flex flex-col gap-12">
          <div class="flex justify-center">
            <FText as="h2" :innerText="title" />
          </div>
          <div class="flex gap-12">
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
  </div>
  <BlogModal
    v-if="showBlogModal"
    v-model:open="showBlogModal"
    :data="blogsStore.currentBlog"
    @fetchBlogs="fetchBlog"
  />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import { useBlogsStore } from '@/stores/blogs';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import BlogHeader from '../_components/BlogHeader.vue';
import BlogModal from '@/views/blogs/_modals/BlogModal.vue';
import { useFToast } from '@/composables/useFToast';

const { locale } = useI18n();
const usersStore = useUsersStore();
const blogsStore = useBlogsStore();
const route = useRoute();
const { showErrorMessage } = useFToast();

const showUpdateModal = ref(false);
const isLoading = ref(false);
const showBlogModal = ref(false);

const title = computed(() => {
  if (locale.value === 'tr') {
    return blogsStore.currentBlog.name;
  }
  return blogsStore.currentBlog.enName;
});

const currentDocument = computed(() => {
  if (locale.value === 'tr') {
    return blogsStore.currentBlog.documentUrl;
  }
  return blogsStore.currentBlog.enDocumentUrl;
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

const fetchBlog = async () => {
  try {
    await blogsStore.find(route.params.id?.toString());
  } catch (error: any) {
    showErrorMessage(error);
  }
};

const fetchAll = async () => {
  isLoading.value = true;
  await fetchBlog();
  isLoading.value = false;
};

watch(
  showUpdateModal,
  (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
      fetchBlog();
    }
  },
  { immediate: true },
);

onMounted(() => {
  fetchAll();
});
</script>

<style lang="scss" scoped></style>
