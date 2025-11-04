<template>
  <Card
    @click="
      router.push({
        name: ERouteNames.BlogDetails,
        params: { id: blog._id! },
      })
    "
    class="group cursor-pointer overflow-hidden border-2 border-gray-200 hover:border-primary-900 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-white"
  >
    <template #content>
      <div class="relative">
        <!-- Professional overlay on hover -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary-900/0 to-accent-500/0 group-hover:from-primary-900/5 group-hover:to-accent-500/5 transition-all duration-500 rounded-lg"
        ></div>

        <CardContent
          :name="blog?.name"
          :tag="getCategoryName(blog?.category)"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ERouteNames } from "@/router/routeNames.enum";
import { useRouter } from "vue-router";
import { type IBlog } from "@/interfaces/blog/blog.interface";
import CardContent from "@/components/ui/local/CardContent.vue";
import { useName } from "@/composables/useName";

interface IProps {
  blog: IBlog;
}

defineProps<IProps>();

const router = useRouter();
const { getCategoryName } = useName();
</script>
