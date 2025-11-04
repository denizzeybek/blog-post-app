<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="
      isEditing
        ? t('pages.blogs.modal.title.update')
        : t('pages.blogs.modal.title.create')
    "
    class="!bg-slate-50 lg:!w-[900px] !w-full !rounded-xl !shadow-2xl"
    :style="{ width: '60rem' }"
    :dismissableMask="true"
  >
    <!-- Header with Icon -->
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-lg bg-primary-900 flex items-center justify-center shadow-md">
          <i :class="isEditing ? 'pi pi-pencil' : 'pi pi-plus'" class="text-white text-lg"></i>
        </div>
        <span class="text-2xl font-bold text-primary-900">
          {{ isEditing ? t('pages.blogs.modal.title.update') : t('pages.blogs.modal.title.create') }}
        </span>
      </div>
    </template>

    <form class="flex flex-col gap-6 p-2" @submit="submitHandler">
      <!-- Turkish and English Names -->
      <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <h3 class="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <i class="pi pi-bookmark text-accent-600"></i>
          {{ t('pages.blogs.modal.sections.titles') }}
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FInput
            class="grow"
            name="name"
            :label="t('pages.blogs.modal.name.tr.label')"
            :placeholder="t('pages.blogs.modal.name.tr.placeholder')"
          />
          <FInput
            class="grow"
            :label="t('pages.blogs.modal.name.en.label')"
            name="enName"
            :placeholder="t('pages.blogs.modal.name.en.placeholder')"
          />
        </div>
      </div>

      <!-- Documents -->
      <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <h3 class="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <i class="pi pi-file-edit text-accent-600"></i>
          {{ t('pages.blogs.modal.sections.content') }}
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FTextArea
            class="grow"
            :label="t('pages.blogs.modal.document.tr.label')"
            name="documentUrl"
            :placeholder="t('pages.blogs.modal.document.tr.placeholder')"
            :rows="12"
            :autoResize="true"
          />
          <FTextArea
            class="grow"
            :label="t('pages.blogs.modal.document.en.label')"
            name="enDocumentUrl"
            :placeholder="t('pages.blogs.modal.document.en.placeholder')"
            :rows="12"
            :autoResize="true"
          />
        </div>
      </div>

      <!-- Category -->
      <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <h3 class="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
          <i class="pi pi-tags text-accent-600"></i>
          {{ t('pages.blogs.modal.sections.category') }}
        </h3>
        <div class="grid grid-cols-1">
          <FSelect
            class="grow"
            :label="t('pages.blogs.modal.category.label')"
            name="category"
            :placeholder="t('pages.blogs.modal.category.placeholder')"
            :options="categoryTypeOptions"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-end pt-6 border-t-2 border-gray-300">
        <Button
          type="button"
          :label="t('pages.blogs.modal.cancel_btn')"
          outlined
          @click="handleClose"
          class="!px-6 !py-3 !border-2 !border-gray-400 !text-gray-700 hover:!bg-gray-100"
        />
        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          :label="t('pages.blogs.modal.save_btn')"
          class="!px-8 !py-3 !bg-primary-900 hover:!bg-primary-800 !border-primary-900 hover:!border-primary-800 !text-white !shadow-md hover:!shadow-lg transition-all"
        >
          <template #icon>
            <i class="pi pi-check mr-2"></i>
          </template>
        </Button>
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { string, object } from 'yup';
import { useFToast } from '@/composables/useFToast';
import { useBlogsStore } from '@/stores/blogs';
import { useCategoriesStore } from '@/stores/categories';
import type { IBlogDTO } from '@/interfaces/blog/blog.interface';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

interface IProps {
  data?: any;
}
const props = defineProps<IProps>();

interface IEmits {
  (event: 'fetchBlogs'): void;
}
const emit = defineEmits<IEmits>();

const blogsStore = useBlogsStore();
const categoriesStore = useCategoriesStore();
const { showSuccessMessage, showErrorMessage } = useFToast();

const open = defineModel<boolean>('open');

const isEditing = computed(() => !!props.data);

const categoryTypeOptions = computed(() => {
  return categoriesStore.list?.map((category) => ({
    name:
      locale.value === 'tr' ? category.categoryName : category.enCategoryName,
    value: category._id,
  }));
});

const validationSchema = object({
  name: string().required().label(t('pages.blogs.modal.name.tr.label')),
  enName: string().required().label(t('pages.blogs.modal.name.en.label')),
  documentUrl: string()
    .required()
    .label(t('pages.blogs.modal.document.tr.label')),
  enDocumentUrl: string()
    .required()
    .label(t('pages.blogs.modal.document.en.label')),
  category: object()
    .shape({
      name: string().label(t('pages.blogs.modal.category.label')),
      value: string().label(t('pages.blogs.modal.category.label')).required(),
    })
    .required()
    .label(t('pages.blogs.modal.category.label')),
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
      enName: values.enName,
      documentUrl: values.documentUrl,
      enDocumentUrl: values.enDocumentUrl,
      category: values.category.value,
    } as IBlogDTO;
    if (isEditing.value) {
      await blogsStore.update(blogsStore.currentBlog._id, payload);
      showSuccessMessage(t('pages.blogs.modal.update_success_msg'));
    } else {
      await blogsStore.create(payload);
      showSuccessMessage(t('pages.blogs.modal.create_success_msg'));
    }

    emit('fetchBlogs');
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const selectedCategory = computed(() => {
  return categoryTypeOptions.value.find(
    (category) => category.value === props.data.category._id,
  );
});

const getInitialFormData = computed(() => {
  const blog = props.data;
  return {
    ...(blog && {
      name: blog.name,
      enName: blog.enName,
      documentUrl: blog.documentUrl,
      enDocumentUrl: blog.enDocumentUrl,
      category: selectedCategory.value,
    }),
  };
});

onMounted(async () => {
  await categoriesStore.fetch();
  resetForm({
    values: getInitialFormData.value,
  });
});
</script>
