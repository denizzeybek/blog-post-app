import type { ICategory } from '../category/category.interface';

export interface IBlogModule {
  _id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
  quantity: number;
  sizes: string;
  description: string;
  totalPrice?: number;
  category: ICategory;
}

export interface IBlog {
  _id: string;
  name: string;
  price: number;
  totalPrice: number;
  currency: string;
  imageUrl: string;
  imageUrlList?: string[];
  imageName?: string;
  imageNameList?: string[];
  sizes: string;
  description: string;
  category: ICategory;
  quantity: number;
  modules: IBlogModule[];
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
  moduleId: string;
}

export interface IBlogDTO {
  name: string;
  price: number;
  sizes: string;
  description: string;
  category: ICategory;
  image: any;
  modules?: {
    blogId: string;
    quantity: number;
  }[];
}

export interface IBlogModuleUpdateDTO {
  modules: {
    blogId: string;
    quantity: number;
  }[];
}

export interface IBlogFilterDTO {
  category?: string;
  name?: string;
}

export interface IBlogDeleteImageDTO {
  id: string;
  imageName: string;
}
