<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="
      isEditing
        ? t('pages.category.modal.title.update')
        : t('pages.category.modal.title.create')
    "
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex gap-4 flex-1">
        <FInput
          class="grow"
          :label="t('pages.category.modal.categoryName.label')"
          name="categoryName"
          :placeholder="t('pages.category.modal.categoryName.placeholder')"
        />
        <FInput
          class="grow"
          :label="t('pages.category.modal.enCategoryName.label')"
          name="enCategoryName"
          :placeholder="t('pages.category.modal.enCategoryName.placeholder')"
        />
      </div>

      <div class="flex gap-4 flex-1">
        <FInput
          class="grow"
          :label="t('pages.category.modal.categoryKey.label')"
          name="categoryKey"
          :placeholder="t('pages.category.modal.categoryKey.placeholder')"
        />
      </div>

      <div class="flex gap-4 flex-1">
        <FInput
          class="grow"
          :label="t('pages.category.modal.categoryDetails.label')"
          name="categoryDetails"
          :placeholder="t('pages.category.modal.categoryDetails.placeholder')"
        />
        <FInput
          class="grow"
          :label="t('pages.category.modal.enCategoryDetails.label')"
          name="enCategoryDetails"
          :placeholder="t('pages.category.modal.enCategoryDetails.placeholder')"
        />
      </div>

      <div class="flex w-50 justify-center">
        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          :label="t('pages.category.modal.save_btn')"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { string, object } from 'yup';
import { useFToast } from '@/composables/useFToast';
import { useCategoriesStore } from '@/stores/categories';
import type { ICategoryDTO } from '@/interfaces/category/category.interface';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface IProps {
  data?: any;
}
const props = defineProps<IProps>();

interface IEmits {
  (event: 'fetchCategories'): void;
}
const emit = defineEmits<IEmits>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const categoriesStore = useCategoriesStore();

const open = defineModel<boolean>('open');

const isEditing = computed(() => !!props.data);

const validationSchema = object({
  categoryName: string()
    .required()
    .label(t('pages.category.modal.categoryName.label')),
  enCategoryName: string()
    .required()
    .label(t('pages.category.modal.enCategoryName.label')),
  categoryKey: string()
    .required()
    .label(t('pages.category.modal.categoryKey.label')),
  categoryDetails: string().label(
    t('pages.category.modal.categoryDetails.label'),
  ),
  enCategoryDetails: string().label(
    t('pages.category.modal.enCategoryDetails.label'),
  ),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const handleClose = () => {
  resetForm();
  open.value = false;
};

const submitHandler = handleSubmit(async (values) => {
  try {
    const payload: ICategoryDTO = {
      categoryName: values.categoryName,
      enCategoryName: values.enCategoryName,
      categoryKey: values.categoryKey,
      categoryDetails: values.categoryDetails,
      enCategoryDetails: values.enCategoryDetails,
    };

    if (isEditing.value) {
      // await categoriesStore.update(props.data._id, payload);
      showSuccessMessage(t('pages.category.modal.update_success_msg'));
    } else {
      await categoriesStore.create(payload);
      showSuccessMessage(t('pages.category.modal.create_success_msg'));
    }

    emit('fetchCategories');
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = computed(() => {
  const category = props.data;
  return {
    categoryName: category?.categoryName || '',
    enCategoryName: category?.enCategoryName || '',
    categoryKey: category?.categoryKey || '',
    categoryDetails: category?.categoryDetails || '',
    enCategoryDetails: category?.enCategoryDetails || '',
  };
});

onMounted(() => {
  resetForm({
    values: getInitialFormData.value,
  });
});
</script>
