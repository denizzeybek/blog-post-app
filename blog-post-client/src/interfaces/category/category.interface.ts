export interface ICategory {
  _id: string;
  categoryName: string;
  enCategoryName: string;
  categoryKey: string;
  categoryDetails?: string;
  enCategoryDetails?: string;
  createdAt: string;
  iconName: string;
}

export interface ICategoryDTO {
  categoryName: string;
  enCategoryName: string;
  categoryKey: string;
  categoryDetails?: string;
  enCategoryDetails?: string;
  iconName: string;
}
