<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end items-center gap-2">
      <Button
        v-if="usersStore.isAuthenticated"
        :label="t('pages.category.button_text')"
        @click="showCategoryModal = true"
      />
    </div>
    <div
      v-if="categoriesList?.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
    >
      <Card v-for="category in categoriesList" :key="category._id">
        <template #header> </template>
        <template #content>
          <CardContent :name="category.name" />
        </template>
      </Card>
    </div>
    <div v-else class="flex justify-center items-center h-96">
      <Card class="flex items-center justify-center">
        <template #content>
          <span class="text-2xl">{{ t('pages.category.no_category') }}</span>
        </template>
      </Card>
    </div>
  </div>

  <CategoryModal
    v-if="showCategoryModal"
    v-model:open="showCategoryModal"
    @fetchCategories="fetchCategories"
  />
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import { useBlogsStore } from '@/stores/blogs';
import { ERouteNames } from '@/router/routeNames.enum';
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import { useCategoriesStore } from '@/stores/categories';
import { useFToast } from '@/composables/useFToast';
import CardContent from '@/components/ui/local/CardContent.vue';
import CategoryModal from '../_components/_modals/CategoryModal.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const usersStore = useUsersStore();
const categoriesStore = useCategoriesStore();
const blogsStore = useBlogsStore();
const router = useRouter();
const { showErrorMessage } = useFToast();

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

const showCategoryModal = ref(false);

const categoriesList = computed(() => categoriesStore.list);

const fetchCategories = async () => {
  await categoriesStore.fetch();
};

onMounted(async () => {
  await fetchCategories();
});
</script>
