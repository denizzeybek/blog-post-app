<template>
  <div class="relative overflow-hidden">
    <!-- Hero Section with Gradient Background -->
    <div class="relative mb-12 md:mb-16">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 opacity-40 rounded-3xl"></div>

      <div class="relative grid grid-cols-1 gap-6 md:grid-cols-2 items-center py-8 md:py-12 px-6 md:px-12">
        <!-- Left Content -->
        <div class="space-y-4 animate-fade-in">
          <!-- Animated Title with Gradient -->
          <h1
            class="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-in-up"
            style="animation-delay: 0.1s"
          >
            <span
              class="bg-gradient-to-r from-primary-700 via-primary-900 to-accent-700 bg-clip-text text-transparent"
              v-html="t('pages.dashboard.banner.title')"
            ></span>
          </h1>

          <!-- Description Text -->
          <div class="space-y-3 animate-slide-in-up" style="animation-delay: 0.2s">
            <p class="text-base md:text-lg text-f-secondary leading-relaxed">
              {{ t('pages.dashboard.banner.description') }}
            </p>
            <p class="text-base md:text-lg text-f-secondary leading-relaxed">
              {{ t('pages.dashboard.banner.description_2') }}
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap gap-4 pt-2 animate-slide-in-up" style="animation-delay: 0.3s">
            <Button
              :label="t('pages.header.contact')"
              icon="pi pi-phone"
              class="!bg-primary-900 hover:!bg-primary-800 !border-primary-900 hover:!border-primary-800 transition-all duration-300 !shadow-lg hover:!shadow-xl hover:scale-105"
              @click="navigateToContact"
            />
            <Button
              :label="t('pages.header.blogs')"
              icon="pi pi-book"
              outlined
              class="!border-primary-900 !text-primary-900 hover:!bg-primary-50 transition-all duration-300 hover:scale-105"
              @click="navigateToBlogs"
            />
          </div>
        </div>

        <!-- Right Image with Enhanced Styling -->
        <div class="relative animate-slide-in-up max-w-md mx-auto" style="animation-delay: 0.4s">
          <div class="relative overflow-hidden rounded-2xl shadow-2xl group">
            <img
              src="/images/banner2.jpeg"
              class="w-full h-auto max-h-[400px] md:max-h-[450px] object-cover transform transition-transform duration-500 group-hover:scale-110"
              alt="Banner"
            />
            <!-- Gradient Overlay on Hover -->
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <!-- Decorative Elements with Floating Animation -->
          <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-accent-200 rounded-full blur-3xl opacity-50 -z-10 animate-float"></div>
          <div class="absolute -top-4 -left-4 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-50 -z-10 animate-float-delayed"></div>
        </div>
      </div>
    </div>

    <!-- Resume Cards Section -->
    <div class="space-y-6 md:space-y-8">
      <h2
        class="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-primary-800 to-accent-700 bg-clip-text text-transparent animate-slide-in-up"
      >
        {{ t('pages.dashboard.banner.professional_profile') }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 p-4">
        <!-- Education Card -->
        <div
          v-for="(item, index) in resumeCards"
          :key="item.title"
          class="resume-card group relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-200 overflow-hidden animate-slide-in-up"
          :style="`animation-delay: ${index * 0.2}s`"
        >
          <!-- Background Gradient on Hover -->
          <div class="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

          <div class="relative z-10">
            <!-- Icon with Pulse Animation -->
            <div class="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 group-hover:scale-110 transition-transform duration-300 icon-pulse">
              <i :class="item.icon" class="text-3xl text-primary-900 group-hover:animate-pulse"></i>
            </div>

            <!-- Title -->
            <h3 class="text-xl md:text-2xl font-bold mb-4 text-f-black group-hover:text-primary-900 transition-colors duration-300">
              {{ item.title }}
            </h3>

            <!-- Items List -->
            <ul class="space-y-3">
              <li
                v-for="listItem in item.items"
                :key="listItem"
                class="flex items-start gap-3 text-f-secondary group-hover:text-f-black transition-colors duration-300"
              >
                <i class="pi pi-check-circle text-accent-600 mt-1 flex-shrink-0"></i>
                <span class="text-base md:text-lg leading-relaxed">{{ listItem }}</span>
              </li>
            </ul>
          </div>

          <!-- Decorative Corner Element -->
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-100 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-bl-full"></div>
        </div>
      </div>
    </div>

    <!-- Bottom Decorative Elements with Floating Animation -->
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-20 -z-10 animate-float-slow"></div>
    <div class="absolute top-1/2 right-0 w-64 h-64 bg-accent-100 rounded-full blur-3xl opacity-20 -z-10 animate-float-slower"></div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';

const { t } = useI18n();
const router = useRouter();

const navigateToContact = () => {
  router.push({ name: ERouteNames.Contact });
};

const navigateToBlogs = () => {
  router.push({ name: ERouteNames.BlogList });
};

const resumeCards = computed(() => [
  {
    icon: 'pi pi-graduation-cap',
    title: t('pages.dashboard.banner.list.school.title'),
    items: [t('pages.dashboard.banner.list.school.description')],
  },
  {
    icon: 'pi pi-globe',
    title: t('pages.dashboard.banner.list.languages.title'),
    items: [
      t('pages.dashboard.banner.list.languages.turkish'),
      t('pages.dashboard.banner.list.languages.english'),
      t('pages.dashboard.banner.list.languages.french'),
    ],
  },
  {
    icon: 'pi pi-briefcase',
    title: t('pages.dashboard.banner.list.working_areas.title'),
    items: [
      t('pages.dashboard.banner.list.working_areas.insurance'),
      t('pages.dashboard.banner.list.working_areas.arbitration'),
      t('pages.dashboard.banner.list.working_areas.private_international'),
      t('pages.dashboard.banner.list.working_areas.commercial_and_corporate_law'),
      t('pages.dashboard.banner.list.working_areas.informatics'),
    ],
  },
]);</script>

<style scoped>
/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide In Up Animation */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-in-up {
  animation: slideInUp 0.8s ease-out forwards;
  opacity: 0;
}

/* Card Hover Effects */
.resume-card {
  transform: translateY(0);
}

.resume-card:hover {
  transform: translateY(-8px);
}

/* Floating Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-10px) translateX(5px);
  }
  50% {
    transform: translateY(0px) translateX(10px);
  }
  75% {
    transform: translateY(10px) translateX(5px);
  }
}

@keyframes floatSlow {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1);
  }
  33% {
    transform: translateY(-20px) translateX(10px) scale(1.05);
  }
  66% {
    transform: translateY(10px) translateX(-10px) scale(0.95);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out 1s infinite;
}

.animate-float-slow {
  animation: floatSlow 10s ease-in-out infinite;
}

.animate-float-slower {
  animation: floatSlow 12s ease-in-out 2s infinite;
}

/* Icon Pulse Effect */
.icon-pulse {
  position: relative;
}

.icon-pulse::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 0.75rem;
  background: linear-gradient(45deg, var(--color-primary-100), var(--color-accent-100));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.group:hover .icon-pulse::before {
  animation: pulse-ring 1.5s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}

/* Smooth Scrolling Effect */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .animate-float,
  .animate-float-delayed,
  .animate-float-slow,
  .animate-float-slower {
    animation: none;
  }
}
</style>
