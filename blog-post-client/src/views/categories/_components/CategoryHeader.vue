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
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUsersStore } from "@/stores/users";
import { useBlogsStore } from "@/stores/blogs";
import { useCategoriesStore } from "@/stores/categories";
import { useI18n } from "vue-i18n";
import { ERouteNames } from "@/router/routeNames.enum";

const { t } = useI18n();
interface IEmits {
  (event: "handleUpdateCategory"): void;
}
const emit = defineEmits<IEmits>();

const usersStore = useUsersStore();
const blogsStore = useBlogsStore();
const categoriesStore = useCategoriesStore();
const router = useRouter();
const route = useRoute();

const menuItems = computed(() => [
  {
    label: "Items",
    items: [
      {
        label: t("pages.category.menu_items.update"),
        icon: "pi pi-cog",
        method: () => {
          emit("handleUpdateCategory");
        },
      },
      {
        label: t("pages.category.menu_items.delete"),
        icon: "pi pi-trash",
        method: async () => {
          await categoriesStore.remove(route.params.id.toString());
          router.push({
            name: ERouteNames.CategoriesList,
          });
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
  return [
    { label: t("pages.category.breadcrumb.blogs") },
    { label: t("pages.category.breadcrumb.blog_details") },
  ];
});
</script>
