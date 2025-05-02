import type { IBlogFilterDTO } from '@/interfaces/blog/blog.interface';
import { useBlogsStore } from '@/stores/blogs';
import { useFToast } from '@/composables/useFToast';

export const useBlogDetails = () => {
  const blogsStore = useBlogsStore();
  const { showErrorMessage } = useFToast();

  const filterBlogs = async (typedName, selectedFilter) => {
    try {
      // isLoading.value = true;
      console.log('filter');
      const payload = {} as IBlogFilterDTO;
      if (typedName) {
        payload.name = typedName;
      }
      if (selectedFilter) {
        payload.category = selectedFilter;
      }
      await blogsStore.filter(payload);

      //   isLoading.value = false;
    } catch (error: any) {
      showErrorMessage(error?.response?.data?.message as any);
    }
  };

  return { filterBlogs };
};
