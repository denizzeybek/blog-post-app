import type { RouteRecordRaw } from "vue-router";
import { ERouteNames } from "@/router/routeNames.enum";
import DefaultLayout from "@/layouts/default/DefaultLayout.vue";

import Dashboard from "@/views/dashboard/_views/Dashboard.vue";
import BlogsList from "@/views/blogs/_views/BlogsList.vue";
import BlogDetails from "@/views/blogs/_views/BlogDetails.vue";

import About from "@/views/about/_views/About.vue";
import Contact from "@/views/contact/_views/Contact.vue";

import Login from "@/views/auth/Login.vue";
import CategoriesList from "@/views/categories/_views/CategoriesList.vue";
import CategoryDetails from "@/views/categories/_views/CategoryDetails.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "",
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      // required UnAuth
      {
        path: "/",
        alias: "",
        name: ERouteNames.Dashboard,
        component: Dashboard,
        meta: {
          requiresUnAuth: true,
          title: ERouteNames.Dashboard,
          name: ERouteNames.Dashboard,
        },
      },
      {
        path: "/login",
        name: ERouteNames.Login,
        component: Login,
        meta: {
          requiresUnAuth: true,
          title: ERouteNames.Login,
          name: ERouteNames.Login,
        },
      },
      {
        path: "/about",
        name: ERouteNames.About,
        component: About,
        meta: {
          requiresUnAuth: true,
          title: ERouteNames.About,
          name: ERouteNames.About,
        },
      },
      {
        path: "/contact",
        name: ERouteNames.Contact,
        component: Contact,
        meta: {
          requiresUnAuth: true,
          title: ERouteNames.Contact,
          name: ERouteNames.Contact,
        },
      },
      // required AUTH
      {
        path: "/blogs",
        name: ERouteNames.BlogList,
        component: BlogsList,
        meta: {
          requiresUnAuth: true,
          title: ERouteNames.BlogList,
          name: ERouteNames.BlogList,
        },
      },
      {
        path: "/blog/:id",
        name: ERouteNames.BlogDetails,
        component: BlogDetails,
        meta: {
          requiresUnAuth: true,
          title: ERouteNames.BlogDetails,
          name: ERouteNames.BlogList,
        },
      },
      {
        path: "/categories",
        name: ERouteNames.CategoriesList,
        component: CategoriesList,
        meta: {
          requiresUnAuth: true,
          title: ERouteNames.CategoriesList,
          name: ERouteNames.CategoriesList,
        },
      },
      {
        path: "/category/:id",
        name: ERouteNames.CategoryDetails,
        component: CategoryDetails,
        meta: {
          requiresUnAuth: true,
          title: ERouteNames.CategoryDetails,
          name: ERouteNames.CategoriesList,
        },
      },
    ],
  },

  // { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  // { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound }
];

export default routes;
