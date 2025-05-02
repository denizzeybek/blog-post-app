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
          :label="t('pages.category.modal.name.label')"
          name="name"
          :placeholder="t('pages.category.modal.name.placeholder')"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput
          class="grow"
          :label="t('pages.category.modal.key.label')"
          name="categoryKey"
          :placeholder="t('pages.category.modal.key.placeholder')"
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
  name: string().required().label(t('pages.category.modal.name.label')),
  categoryKey: string().required().label(t('pages.category.modal.key.label')),
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
    const payload = {
      name: values.name,
      categoryKey: values.categoryKey,
    } as ICategoryDTO;
    if (isEditing.value) {
      // await categoriesStore.update(blogsStore.currentBlog._id ,payload);
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
    ...(category && {
      name: category.name,
      categoryKey: category.categoryKey,
    }),
  };
});

onMounted(async () => {
  resetForm({
    values: getInitialFormData.value,
  });
});
</script>
