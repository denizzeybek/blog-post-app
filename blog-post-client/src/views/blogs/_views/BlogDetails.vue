<template>
  <div class="flex flex-col gap-8 max-w-5xl mx-auto w-full">
    <!-- Reading Progress Bar -->
    <div
      class="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary-900 via-primary-700 to-accent-600 z-50 transition-all duration-300"
      :style="{ width: readingProgress + '%' }"
    ></div>

    <!-- Header Actions -->
    <BlogHeader
      v-if="usersStore.isAuthenticated"
      @handleUpdateBlog="showBlogModal = true"
    />

    <!-- Main Content Card -->
    <Card class="shadow-2xl border border-gray-200 overflow-hidden">
      <template #content>
        <Skeleton v-if="isLoading" width="100%" height="12rem" />

        <div v-else class="flex flex-col gap-8">
          <!-- Article Header -->
          <div class="text-center border-b-2 border-primary-900 pb-8">
            <h1
              class="text-4xl md:text-5xl font-bold text-primary-900 mb-4 leading-tight"
            >
              {{ title }}
            </h1>
            <div class="flex justify-center mb-4">
              <div class="w-20 h-1 bg-accent-500"></div>
            </div>

            <!-- Article Meta -->
            <div
              class="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-700"
            >
              <div class="flex items-center gap-2">
                <i class="pi pi-calendar text-primary-900"></i>
                <span class="font-medium">{{
                  formatDate(blogsStore.currentBlog.createdAt)
                }}</span>
              </div>
              <div class="w-px h-4 bg-gray-300"></div>
              <div class="flex items-center gap-2">
                <i class="pi pi-clock text-accent-600"></i>
                <span class="font-medium"
                  >{{ readingTime }}
                  {{ t("pages.blogs.details.reading_time") }}</span
                >
              </div>
              <div class="w-px h-4 bg-gray-300"></div>
              <div class="flex items-center gap-2">
                <i class="pi pi-tag text-primary-900"></i>
                <Tag
                  class="!rounded-full !bg-primary-900 !text-white !px-4 !py-2"
                >
                  <span class="font-semibold">{{
                    getCategoryName(blogsStore.currentBlog.category)
                  }}</span>
                </Tag>
              </div>
            </div>
          </div>

          <!-- Article Content -->
          <article class="prose prose-lg max-w-none">
            <div
              v-html="cleanHtml"
              class="text-gray-800 leading-relaxed space-y-6 text-justify"
              style="font-size: 1.125rem; line-height: 1.8"
            ></div>
          </article>

          <!-- Article Footer with Share Buttons -->
          <div class="border-t border-gray-200 pt-8 mt-8">
            <div
              class="flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div class="text-gray-600 font-medium">
                {{ t("pages.blogs.details.share_text") }}
              </div>
              <div class="flex gap-3">
                <Button
                  icon="pi pi-twitter"
                  outlined
                  rounded
                  @click="shareOnTwitter"
                  class="!w-12 !h-12 !border-2 !border-primary-900 !text-primary-900 hover:!bg-primary-900 hover:!text-white transition-all"
                  v-tooltip.top="t('pages.blogs.details.share.twitter')"
                />
                <Button
                  icon="pi pi-facebook"
                  outlined
                  rounded
                  @click="shareOnFacebook"
                  class="!w-12 !h-12 !border-2 !border-primary-900 !text-primary-900 hover:!bg-primary-900 hover:!text-white transition-all"
                  v-tooltip.top="t('pages.blogs.details.share.facebook')"
                />
                <Button
                  icon="pi pi-linkedin"
                  outlined
                  rounded
                  @click="shareOnLinkedIn"
                  class="!w-12 !h-12 !border-2 !border-primary-900 !text-primary-900 hover:!bg-primary-900 hover:!text-white transition-all"
                  v-tooltip.top="t('pages.blogs.details.share.linkedin')"
                />
                <Button
                  icon="pi pi-link"
                  outlined
                  rounded
                  @click="copyLink"
                  class="!w-12 !h-12 !border-2 !border-accent-600 !text-accent-600 hover:!bg-accent-600 hover:!text-white transition-all"
                  v-tooltip.top="t('pages.blogs.details.share.copy_link')"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Back to Blogs Button -->
    <div class="flex justify-center">
      <Button
        :label="t('pages.blogs.details.back_to_blogs')"
        icon="pi pi-arrow-left"
        outlined
        @click="router.push({ name: ERouteNames.BlogList })"
        class="!px-8 !py-3 !border-2 !border-primary-900 !text-primary-900 hover:!bg-primary-900 hover:!text-white transition-all"
      />
    </div>
  </div>

  <BlogModal
    v-if="showBlogModal"
    v-model:open="showBlogModal"
    :data="blogsStore.currentBlog"
    @fetchBlogs="fetchBlog"
  />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useUsersStore } from "@/stores/users";
import { useBlogsStore } from "@/stores/blogs";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import BlogHeader from "../_components/BlogHeader.vue";
import BlogModal from "@/views/blogs/_modals/BlogModal.vue";
import { useFToast } from "@/composables/useFToast";
import { ERouteNames } from "@/router/routeNames.enum";
import { useName } from "@/composables/useName";

const { locale, t } = useI18n();
const usersStore = useUsersStore();
const blogsStore = useBlogsStore();
const route = useRoute();
const router = useRouter();
const { showErrorMessage, showSuccessMessage } = useFToast();
const { getCategoryName } = useName();

const showUpdateModal = ref(false);
const isLoading = ref(false);
const showBlogModal = ref(false);
const readingProgress = ref(0);

const title = computed(() => {
  if (locale.value === "tr") {
    return blogsStore.currentBlog.name;
  }
  return blogsStore.currentBlog.enName;
});

// Calculate reading time (average 200 words per minute)
const readingTime = computed(() => {
  const text = currentDocument.value || "";
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
});

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Reading progress tracker
const updateReadingProgress = () => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const trackLength = documentHeight - windowHeight;
  const progress = (scrollTop / trackLength) * 100;
  readingProgress.value = Math.min(100, Math.max(0, progress));
};

const currentDocument = computed(() => {
  if (locale.value === "tr") {
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

// Social share functions
const shareOnTwitter = () => {
  const url = window.location.href;
  const text = title.value;
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    "_blank",
  );
};

const shareOnFacebook = () => {
  const url = window.location.href;
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    "_blank",
  );
};

const shareOnLinkedIn = () => {
  const url = window.location.href;
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    "_blank",
  );
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showSuccessMessage(t("pages.blogs.details.toast.link_copied"));
  } catch {
    showErrorMessage(t("pages.blogs.details.toast.link_copy_failed"));
  }
};

onMounted(() => {
  fetchAll();
  window.addEventListener("scroll", updateReadingProgress);
  updateReadingProgress();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateReadingProgress);
});
</script>

<style lang="scss" scoped></style>
