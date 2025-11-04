import { EStoreNames } from "@/stores/storeNames.enum";
import axios from "axios";
import { defineStore } from "pinia";
import type {
  IBlogDeleteImageDTO,
  IBlogDTO,
  IBlogFilterDTO,
} from "@/interfaces/blog/blog.interface";

import type { IBlog, IBlogModule } from "@/interfaces/blog/blog.interface";

interface State {
  list: IBlog[];
  currentBlog: IBlog;
}

export const useBlogsStore = defineStore(EStoreNames.PRODUCTS, {
  state: (): State => ({
    list: [],
    currentBlog: {} as IBlog,
  }),
  actions: {
    async fetch() {
      return new Promise((resolve, reject) => {
        axios
          .get("/blogs")
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
          .post("/blogs/filter", payload)
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
  },
});
