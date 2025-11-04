import { EStorageKeys } from "@/constants/storageKeys";
import { useUsersStore } from "@/stores/users";
import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { ERouteNames } from "./routeNames.enum";
import routes from "./routes";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// GUARD
router.beforeEach(async (to, from, next) => {
  const usersStore = useUsersStore();
  const authStore = useAuthStore();

  const token = localStorage.getItem(EStorageKeys.TOKEN);
  const { requiresAuth, requiresUnAuth, isPublic } = to.meta;

  if (token && !usersStore.isAuthenticated) {
    try {
      await usersStore.fetchUser(token);
    } catch (error: any) {
      authStore.logout();
      console.error(error);
    }
  }

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  if (requiresAuth) {
    if (requiresUnAuth) {
      next();
    } else if (requiresAuth) {
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        return next({
          name: ERouteNames.Dashboard,
        });
      }
    }
  }

  next();
});

// SET PAGE TITLE
const DEFAULT_TITLE = "Nazli Kacar";
router.afterEach((to) => {
  nextTick(() => {
    document.title =
      typeof to.meta.title === "string"
        ? `${to.meta.title} - Nazli Kacar`
        : DEFAULT_TITLE;
  });
});

router.onError((error) => {
  console.error("router error: ", error);
});

export default router;
