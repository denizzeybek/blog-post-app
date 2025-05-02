<template>
  <div class="card">
    <MegaMenu
      :model="items"
      class="p-4 bg-surface-0 !w-full"
      style="border-radius: 3rem"
    >
      <template #start>
        <RouterLink :to="{ name: ERouteNames.Dashboard }" class="lg:mr-10">
          <FText as="h1" :innerText="t('pages.logo')" />
        </RouterLink>
      </template>
      <template #item="{ item }">
        <Button
          severity="secondary"
          :variant="item.isActive ? undefined : 'text'"
          class="w-full lg:w-fit font-semibold text-lg uppercase"
          @click="item.method ? item.method() : router.push(item.route)"
        >
          {{ item.label }}
        </Button>
      </template>
      <template #end>
        <FSelect
          name="language"
          :options="languageOptions"
          v-model="language"
          class="max-w-[140px] ms-auto"
        />
      </template>
    </MegaMenu>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import MegaMenu from 'primevue/megamenu';
import { ERouteNames } from '@/router/routeNames.enum';
import { useUsersStore } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { languageOptions, type ILanguageOption } from '@/constants/languages';
import { setI18nLanguage, type MessageSchema } from '@/plugins/i18n';

const { locale } = useI18n()
const i18n = useI18n<{ message: MessageSchema }>()
const { t } = i18n

const authStore = useAuthStore();
const usersStore = useUsersStore();
const route = useRoute();
const router = useRouter();

interface IEmits {
  (event: 'drawerChange', val: boolean): void;
}

defineEmits<IEmits>();

const language = ref<ILanguageOption>(
  languageOptions.find((option) => option.value === locale.value) ??
    languageOptions[0],
);

const items = computed(() => {
  return [
    {
      label: t('pages.header.contact'),
      route: { name: ERouteNames.Contact },
    },
    {
      label: t('pages.header.blogs'),
      route: { name: ERouteNames.BlogList },
    },
    ...(!usersStore.isAuthenticated
      ? [
          {
            label: t('pages.header.login'),
            route: { name: ERouteNames.Login },
          },
        ]
      : []),
    ...(usersStore.isAuthenticated
      ? [
          {
            label: t('pages.header.categories'),
            route: { name: ERouteNames.CategoriesList },
          },
          {
            label: t('pages.header.login'),
            route: { name: ERouteNames.Login },
            method: () => {
              authStore.logout();
            },
          },
        ]
      : []),
  ].map((item) => {
    return {
      ...item,
      isActive: route.name === item.route.name,
    };
  });
});

watch(language, (language) => {
  setI18nLanguage(language?.value ?? 'en');
}, {deep: true});
</script>
