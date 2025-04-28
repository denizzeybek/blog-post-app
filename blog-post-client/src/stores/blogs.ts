import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import type {
  IBlogDeleteImageDTO,
  IBlogDTO,
  IBlogFilterDTO,
  IBlogModuleUpdateDTO,
  IBlogRemoveModuleDTO,
  IBlogUpdateModuleDTO,
} from '@/interfaces/blog/blog.interface';

import type { IBlog, IBlogModule } from '@/interfaces/blog/blog.interface';

interface State {
  list: IBlog[];
  currentBlog: IBlog;
  currentBlogBasket: IBlogModule[];
  currentBlogTotal: {
    price: number;
    currency: string;
  };
}

export const useBlogsStore = defineStore(EStoreNames.PRODUCTS, {
  state: (): State => ({
    list: [],
    currentBlog: {} as IBlog,
    currentBlogBasket: [],
    currentBlogTotal: {
      price: 0,
      currency: '',
    },
  }),
  actions: {
    async fetch() {
      return new Promise((resolve, reject) => {
        axios
          .get('/blogs')
          .then((response) => {
            this.list = response as unknown as IBlog[];
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async filter(payload: IBlogFilterDTO) {
      return new Promise((resolve, reject) => {
        axios
          .post('/blogs/filter', payload)
          .then((response) => {
            this.list = response as unknown as IBlog[];
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async find(id: string) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/blogs/${id}`)
          .then((response) => {
            this.currentBlog = response as unknown as IBlog;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async create(payload: IBlogDTO) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/blogs`, payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async createImages(payload: any) {
      return new Promise((resolve, reject) => {
        const formData = new FormData();

        if (payload.images) {
          Array.from(payload.images).forEach((image: any) => {
            formData.append('image', image); // Append each image
          });
        }

        axios
          .put(`/blogs/create-images/${payload.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async remove(id: string) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/blogs/${id}`)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async update(id: string, payload: IBlogDTO) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/blogs/${id}`, payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async updateModule(id: string, payload: IBlogModuleUpdateDTO) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/blogs/update-modules/${id}`, payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async addModule(payload: IBlogUpdateModuleDTO) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/blogs/add-module`, payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async removeModule(payload: IBlogRemoveModuleDTO) {
      const { blogId, moduleId } = payload;
      return new Promise((resolve, reject) => {
        axios
          .delete(`/blogs/remove-module/${blogId}/${moduleId}`)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async deleteImage(payload: IBlogDeleteImageDTO) {
      const { id, imageName } = payload;
      return new Promise((resolve, reject) => {
        axios
          .post(`/blogs/delete-image/${id}`, { imageName })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    resetBasket() {
      this.currentBlogBasket = [];
      this.currentBlogTotal = {
        price: 0,
        currency: '',
      };
    },
  },
});
