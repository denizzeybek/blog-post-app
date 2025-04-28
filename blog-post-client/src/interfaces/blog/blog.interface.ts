import type { ICategory } from '../category/category.interface';

export interface IBlogModule {
  _id: string;
  name: string;
  documentUrl: string;
  category: ICategory;
}

export interface IBlog {
  _id: string;
  name: string;
  documentUrl: string;
  category: ICategory;
}

export interface IBlogDTO {
  name: string;
  documentUrl: string;
  category: ICategory;
}

export interface IBlogFilterDTO {
  category?: string;
  name?: string;
}

export interface IBlogUpdateModuleDTO {
  blogId: string;
  module: {
    blogId: string;
    quantity?: number;
  };
}

export interface IBlogRemoveModuleDTO {
  blogId: string;
}

export interface IBlogModuleUpdateDTO {
  modules: {
    blogId: string;
    quantity: number;
  }[];
}

export interface IBlogDeleteImageDTO {
  id: string;
  imageName: string;
}
