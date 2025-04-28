<template>
  <Card>
    <template #content>
      <div class="flex justify-between items-center">
        <Breadcrumb :home="home" :model="items" />
        <FActionsMenu
          v-if="usersStore.isAuthenticated"
          :menuItems="menuItems"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUsersStore } from "@/stores/users";
import { useBlogsStore } from "@/stores/blogs";

interface IEmits {
  (event: "handleUpdateBlog"): void;
  (event: "handleUpdateModal"): void;
  (event: "handleImagesModal"): void;
  (event: "handleEditImagesModal"): void;
}
const emit = defineEmits<IEmits>();

const usersStore = useUsersStore();
const blogsStore = useBlogsStore();
const router = useRouter();
const route = useRoute();

const menuItems = ref([
  {
    label: "Items",
    items: [
      {
        label: "Makaleyi Güncelle",
        icon: "pi pi-cog",
        method: () => {
          emit("handleUpdateBlog");
        },
      },
      // {
      //   label: "Modülleri Güncelle",
      //   icon: "pi pi-pencil",
      //   method: () => {
      //     emit("handleUpdateModal");
      //   },
      // },
      // {
      //   label: "Galeriye Resim Ekle",
      //   icon: "pi pi-plus",
      //   method: () => {
      //     emit("handleImagesModal");
      //   },
      // },

      // {
      //   label: "Galeriyi Düzenle",
      //   icon: "pi pi-pencil",
      //   method: () => {
      //     emit("handleEditImagesModal");
      //   },
      // },
      {
        label: "Makaleyi Sil",
        icon: "pi pi-trash",
        method: async () => {
          await blogsStore.remove(route.params.id.toString());
          router.push("/blogs");
        },
      },
    ],
  },
]);

const home = computed(() => {
  return {
    icon: "pi pi-home",
  };
});

const items = computed(() => {
  return [{ label: "Makaleler" }, { label: "Makale Detayı" }];
});
</script>
