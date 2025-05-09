<template>
  <div class="flex flex-col gap-8">
    <div class="flex justify-end items-center">
      <Button
        v-if="usersStore.isAuthenticated"
        :label="t('pages.category.button_text')"
        @click="showCategoryModal = true"
        severity="info"
      />
    </div>
    <div class="flex justify-center">
      <FText as="h1" :innerText="t('pages.category.title')" />
    </div>
    <Skeleton v-if="isLoading" width="100%" height="24rem" />
    <div
      v-else-if="categoriesList?.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
    >
      <Card
        v-for="category in categoriesList"
        :key="category._id"
        @click="
          router.push({
            name: ERouteNames.CategoryDetails,
            params: { id: category._id! },
          })
        "
        class="cursor-pointer"
      >
        <template #content>
          <CardContent
            :name="getCategoryName(category)"
            :icon="category?.iconName"
          />
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
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import { useCategoriesStore } from '@/stores/categories';
import { useFToast } from '@/composables/useFToast';
import CardContent from '@/components/ui/local/CardContent.vue';
import CategoryModal from '../_components/_modals/CategoryModal.vue';
import { useI18n } from 'vue-i18n';
import { ERouteNames } from '@/router/routeNames.enum';
import { useName } from '@/composables/useName';

const categoriesStore = useCategoriesStore();
const usersStore = useUsersStore();
const router = useRouter();
const { t } = useI18n();
const { showErrorMessage } = useFToast();
const { getCategoryName } = useName();

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

const showCategoryModal = ref(false);
const isLoading = ref(false);

const categoriesList = computed(() => categoriesStore.list);

const fetchCategories = async () => {
  try {
    isLoading.value = true;
    await categoriesStore.fetch();
    isLoading.value = false;
  } catch (error: any) {
    showErrorMessage(error);
  }
};

onMounted(async () => {
  await fetchCategories();
});
</script>
