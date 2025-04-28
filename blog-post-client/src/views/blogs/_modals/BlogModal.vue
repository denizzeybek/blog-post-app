<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? 'Makale Güncelle' : 'Makale Ekle'"
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex gap-4 flex-1">
        <FInput
          class="grow"
          label="Makale adı"
          name="name"
          placeholder="Makale ismi girin"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FSelect
          class="grow"
          label="Kategori"
          name="category"
          placeholder="Kategori Seçin"
          :options="categoryTypeOptions"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput
          class="grow"
          label="Makale"
          name="documentUrl"
          placeholder="Açıklama girin"
        />
      </div>
      <div class="flex w-50 justify-center">
        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          label="Kaydet"
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
    name: category.name,
    value: category._id,
  }));
});

const validationSchema = object({
  name: string().required().label('Makale adı'),
  documentUrl: string().required().label('Açıklama'),
  category: object()
    .shape({
      name: string().label('Kategori'),
      value: string().label('Kategori').required(),
    })
    .required()
    .label('Kategori'),
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
      documentUrl: values.documentUrl,
      category: values.category.value,
    } as IBlogDTO;
    if (isEditing.value) {
      await blogsStore.update(blogsStore.currentBlog._id, payload);
      showSuccessMessage('Makale Güncellendi!');
    } else {
      await blogsStore.create(payload);
      showSuccessMessage('Makale eklendi!');
    }

    emit('fetchBlogs');
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = computed(() => {
  const blog = props.data;
  return {
    ...(blog && {
      name: blog.name,
      documentUrl: blog.documentUrl,
      category: { name: blog.category?.name, value: blog.category?._id },
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
