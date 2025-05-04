<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="
      isEditing
        ? t('pages.blogs.modal.title.update')
        : t('pages.blogs.modal.title.create')
    "
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex gap-4 flex-1">
        <FInput
          class="grow"
          name="name"
          :label="t('pages.blogs.modal.name.tr.label')"
          :placeholder="t('pages.blogs.modal.name.tr.placeholder')"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput
          class="grow"
          :label="t('pages.blogs.modal.name.en.label')"
          name="enName"
          :placeholder="t('pages.blogs.modal.name.en.placeholder')"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FSelect
          class="grow"
          :label="t('pages.blogs.modal.category.label')"
          name="category"
          :placeholder="t('pages.blogs.modal.category.placeholder')"
          :options="categoryTypeOptions"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput
          class="grow"
          :label="t('pages.blogs.modal.document.tr.label')"
          name="documentUrl"
          :placeholder="t('pages.blogs.modal.document.tr.placeholder')"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput
          class="grow"
          :label="t('pages.blogs.modal.document.en.label')"
          name="enDocumentUrl"
          :placeholder="t('pages.blogs.modal.document.en.placeholder')"
        />
      </div>
      <div class="flex w-50 justify-center">
        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          :label="t('pages.blogs.modal.save_btn')"
          severity="info"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { string, object, number } from 'yup';
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
const selectedFile = ref<File | null>(null);

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

const { handleSubmit, isSubmitting, resetForm, defineField } = useForm({
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
