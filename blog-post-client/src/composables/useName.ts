import type { IBlog } from '@/interfaces/blog/blog.interface';
import type { ICategory } from '@/interfaces/category/category.interface';
import { useI18n } from 'vue-i18n';

export const useName = () => {
  const { locale } = useI18n();

  const getBlogName = (blog: IBlog) => {
    if (locale.value === 'tr') {
      return blog.name;
    }
    return blog.enName;
  };

  const getCategoryName = (category: ICategory) => {
    if (locale.value === 'tr') {
      return category.categoryName;
    }
    return category.enCategoryName;
  };

  return { getCategoryName, getBlogName };
};
