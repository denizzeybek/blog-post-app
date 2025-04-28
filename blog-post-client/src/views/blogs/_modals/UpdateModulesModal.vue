<template>
  <Dialog
    v-model:visible="open"
    modal
    header="Update Modules"
    class="!bg-f-secondary-purple !w-full lg:h-3/4"
    :style="{ width: '50rem' }"
  >
    <Splitter class="lg:h-full" layout="horizontal">
      <SplitterPanel class="flex flex-col gap-2 p-2 !overflow-y-auto">
        <div class="flex justify-end gap-2">
          <FSelect
            name="filterCategory"
            placeholder="Kategori Adı Seçin"
            :options="categoryTypeOptions"
            v-model="selectedFilter"
          />
          <FInput
            name="filterName"
            v-model="typedName"
            placeholder="Makale ismi girin"
          />
        </div>
        <template v-for="(blog, idx) in blogsList" :key="idx">
          <ModuleItem
            :module="blog"
            :type="EModuleItemButtonType.ADD"
            @handleModuleButtonClick="onModuleButtonClick($event)"
          />
        </template>
      </SplitterPanel>
      <SplitterPanel class="flex flex-col gap-2 p-2 !overflow-y-auto">
        <template v-for="(module, idx) in modules" :key="idx">
          <ModuleItem
            :module="module"
            :type="EModuleItemButtonType.REMOVE"
            @handleModuleButtonClick="onModuleButtonClick($event)"
          />
        </template>
      </SplitterPanel>
    </Splitter>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useFToast } from '@/composables/useFToast';
import ModuleItem from './ModuleItem.vue';
import { EModuleItemButtonType } from '@/views/blogs/_etc/enums/EModuleItemButtonType';
import type {
  IBlogFilterDTO,
  IBlogRemoveModuleDTO,
  IBlogUpdateModuleDTO,
} from '@/interfaces/blog/blog.interface';
import { useBlogsStore } from '@/stores/blogs';
import { useRoute } from 'vue-router';
import { useCategoriesStore } from '@/stores/categories';
import { watch } from '@vue/reactivity';

const route = useRoute();
const blogsStore = useBlogsStore();
const categoriesStore = useCategoriesStore();

const open = defineModel<boolean>('open');
const { showSuccessMessage, showErrorMessage } = useFToast();

const typedName = ref();
const selectedFilter = ref({
  name: 'Tüm Kategoriler',
  value: null,
});

const blogsList = computed(() => blogsStore.list);
const modules = computed(() => blogsStore.currentBlog?.modules);

const categoryTypeOptions = computed(() => {
  const categoriesList = categoriesStore.list?.map((category) => ({
    name: category.name,
    value: category._id,
  }));

  return [{ name: 'Tüm Kategoriler', value: null }, ...categoriesList];
});

const onModuleButtonClick = async (event) => {
  try {
    const { type, id } = event;
    if (type === EModuleItemButtonType.ADD) {
      const payload = {
        blogId: route.params.id,
        module: {
          blogId: id,
          quantity: 1,
        },
      } as IBlogUpdateModuleDTO;
      await blogsStore.addModule(payload);
      showSuccessMessage('Modül Eklendi');
    } else {
      const payload = {
        blogId: route.params.id,
        moduleId: id,
      } as IBlogRemoveModuleDTO;
      await blogsStore.removeModule(payload);
      showSuccessMessage('Modül Kaldırıldı');
    }
    await blogsStore.find(route.params.id?.toString());
  } catch (error: any) {
    showErrorMessage(error?.response?.data?.message as any);
  }
};

const filterBlogs = async () => {
  try {
    const payload = {} as IBlogFilterDTO;
    if (typedName.value) {
      payload.name = typedName.value;
    }
    if (selectedFilter.value.value) {
      payload.category = selectedFilter.value.value;
    }
    await blogsStore.filter(payload);
  } catch (error: any) {
    showErrorMessage(error?.response?.data?.message as any);
  }
};

watch([selectedFilter, typedName], filterBlogs, { immediate: true });

onMounted(async () => {
  await categoriesStore.fetch();
});
</script>
