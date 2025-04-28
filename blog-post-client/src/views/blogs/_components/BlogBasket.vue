<template>
  <Card>
    <template #content>
      <section class="relative">
        <div
          class="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto flex flex-col gap-4"
        >
          <div class="grid grid-cols-1 min-[550px]:gap-6 rounded-xl py-6">
            <div
              class="flex items-center flex-col min-[550px]:flex-row gap-3 min-[550px]:gap-6 w-full max-xl:justify-center max-xl:max-w-xl max-xl:mx-auto"
            >
              <div class="img-box">
                <img
                  :src="currentBlog?.imageUrl"
                  alt="perfume bottle image"
                  class="w-full sm:w-80 rounded-md object-cover"
                />
              </div>
              <BlogItemContent :blog="currentBlog" />
            </div>
          </div>
          <div
            class="bg-gray-50 rounded-xl p-6 w-full mb-8 max-lg:max-w-xl max-lg:mx-auto"
          >
            <template v-if="hasModules">
              <div
                v-for="(blog, idx) in blogs"
                :keey="idx"
                class="flex items-center justify-between w-full mb-6"
              >
                <p
                  class="uppercase w-[80px] font-normal text-xl leading-8 text-gray-400"
                >
                  {{ blog.name }}
                </p>
                <p class="font-normal text-xl leading-8 text-gray-400">
                  {{ `${blog.quantity} x ${blog.price} ${blog.currency}` }}
                </p>
                <h6 class="font-semibold text-xl leading-8 text-gray-900">
                  {{ `${blog.price * blog.quantity} ${blog.currency}` }}
                </h6>
              </div>
            </template>
            <div class="flex items-center justify-between w-full py-6">
              <p
                class="font-manrope font-medium text-2xl leading-9 text-gray-900"
              >
                Total
              </p>
              <h6
                class="font-manrope font-medium text-2xl leading-9 text-indigo-500"
              >
                {{
                  hasModules
                    ? total
                    : `${currentBlog?.price} ${currentBlog?.currency}`
                }}
              </h6>
            </div>
          </div>
          <div
            class="flex items-center flex-col sm:flex-row justify-center gap-3 mt-8"
          ></div>
        </div>
      </section>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useBlogsStore } from "@/stores/blogs";
import { computed } from "vue";
import BlogItemContent from "./BlogItemContent.vue";

interface IProps {
  hasModules: boolean;
}

defineProps<IProps>();

const blogsStore = useBlogsStore();

const currentBlog = computed(() => blogsStore.currentBlog);
const blogs = computed(() => blogsStore.currentBlogBasket);
const total = computed(
  () =>
    `${blogsStore.currentBlogTotal?.price} ${blogsStore.currentBlogTotal?.currency}`,
);
</script>

<style scoped></style>
