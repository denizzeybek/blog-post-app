<template>
  <Card
    @click="
      router.push({
        name: ERouteNames.BlogDetails,
        params: { id: blog._id! },
      })
    "
    class="cursor-pointer"
  >
    <template #content>
      <CardContent :name="blog?.name" :tag="blog?.category?.name" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ERouteNames } from '@/router/routeNames.enum';
import { useRouter } from 'vue-router';
import { type IBlog } from '@/interfaces/blog/blog.interface';
import CardContent from '@/components/ui/local/CardContent.vue';

interface IProps {
  blog: IBlog;
}

defineProps<IProps>();

const router = useRouter();
</script>
