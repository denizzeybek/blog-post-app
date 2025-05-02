<template>
  <div class="flex flex-col justify-center w-full max-w-xs m-auto">
    <FText as="h1" class="mb-8 text-center"> Login </FText>

    <form class="flex flex-col gap-5" @submit="submitHandler">
      <FInput
        type="email"
        id="email"
        name="email"
        :label="t('pages.login.email.label')"
        :placeholder="t('pages.login.email.placeholder')"
      />

      <div class="relative">
        <FPassword
          id="password"
          name="password"
          :label="t('pages.login.password.label')"
          :placeholder="t('pages.login.password.placeholder')"
        />
      </div>

      <Button
        :disabled="isSubmitting"
        :loading="isSubmitting"
        type="submit"
        :label="t('pages.login.button_text')"
        icon="pi pi-user"
        class="w-full"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { string, object } from 'yup';
import { useFToast } from '@/composables/useFToast';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { showSuccessMessage, showErrorMessage } = useFToast();
const router = useRouter();
const authStore = useAuthStore();

const validationSchema = object({
  email: string().email().required().label(t('pages.login.email.label')),
  password: string().required().label(t('pages.login.password.label')),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    const payload = values as { email: string; password: string };
    await authStore.login(payload);
    router.push({ name: ERouteNames.BlogList });
    showSuccessMessage(t('pages.login.button_text'));
  } catch (error: any) {
    showErrorMessage(error?.response?.data?.message as any);
  }
});
</script>
