<template>
  <Card
    @click="
      router.push({
        name: ERouteNames.BlogDetails,
        params: { id: category._id! },
      })
    "
    class="cursor-pointer"
  >
    <template #content>
      <CardContent :name="getCategoryName(category)" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ERouteNames } from '@/router/routeNames.enum';
import { useRouter } from 'vue-router';
import CardContent from '@/components/ui/local/CardContent.vue';
import { type ICategory } from '@/interfaces/category/category.interface';
import { useName } from '@/composables/useName';

interface IProps {
  category: ICategory;
}

defineProps<IProps>();

const router = useRouter();
const { getCategoryName } = useName();

</script>
