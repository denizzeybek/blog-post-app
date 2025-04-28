<template>
  <Dialog
    v-model:visible="open"
    modal
    header="Resimleri Ekle"
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex justify-center gap-4 flex-1">
        <input type="file" accept="image/*" multiple @change="fileSelected" />
      </div>

      <div class="flex w-50 justify-center">
        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          label="Save"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { object } from "yup";
import { useFToast } from "@/composables/useFToast";
import { useBlogsStore } from "@/stores/blogs";

interface IEmits {
  (event: "fetchBlogs"): void;
}
const emit = defineEmits<IEmits>();

const blogsStore = useBlogsStore();
const { showSuccessMessage, showErrorMessage } = useFToast();

const open = defineModel<boolean>("open");
const selectedFile = ref<FileList | null>(null);

const validationSchema = object({});

const { handleSubmit, isSubmitting, resetForm, defineField } = useForm({
  validationSchema,
});

const handleClose = () => {
  resetForm();
  open.value = false;
};

// Dosya seçimi event handler'ı
const fileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files; // Store the selected files
  } else {
    selectedFile.value = null; // Clear selected files if none are chosen
  }
};

const submitHandler = handleSubmit(async (values) => {
  try {
    const payload = {
      id: blogsStore.currentBlog._id,
      images: selectedFile.value,
    };

    await blogsStore.createImages(payload);
    showSuccessMessage("Makale Resmi Eklendi!");

    emit("fetchBlogs");
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>
