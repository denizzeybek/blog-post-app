# Blog Post Client (Frontend)

Vue 3 + TypeScript + PrimeVue frontend for furniture e-commerce platform.

## Quick Start

```bash
# Install dependencies
npm install

# Development server (port 3001)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Commands

```bash
# Code Quality
npm run lint              # ESLint with auto-fix
npm run format            # Prettier formatting
npm run type-check        # TypeScript type checking

# Testing
npm run test:unit         # Run Vitest unit tests

# Build Options
npm run build             # Full build with type checking
npm run build-only        # Build without type checking

# Utilities
npm run generate-icon-names  # Generate PrimeIcon type names
npm run sync              # Deploy to AWS S3
```

## Environment Setup

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

All environment variables must be prefixed with `VITE_` to be exposed to the client.

## Project Structure

```
src/
├── App.vue                # Root component
├── main.ts               # App entry point
├── config.ts             # Configuration constants
│
├── router/               # Vue Router
│   ├── index.ts         # Router setup with guards
│   ├── routes.ts        # Route definitions
│   └── routeNames.enum.ts  # Type-safe route names
│
├── stores/              # Pinia state management
│   ├── auth.ts          # Authentication store
│   ├── blogs.ts         # Blog/product store
│   ├── categories.ts    # Category store
│   ├── users.ts         # User store
│   └── storeNames.enum.ts  # Store name constants
│
├── views/               # Page components
│   ├── auth/           # Login/signup pages
│   ├── blogs/          # Blog listing/detail pages
│   ├── categories/     # Category management
│   ├── dashboard/      # Admin dashboard
│   ├── products/       # Product pages
│   ├── about/
│   └── contact/
│
├── components/          # Reusable components
│   ├── ui/             # UI components
│   └── images/         # Image components
│
├── layouts/             # Layout wrappers
├── composables/         # Vue composables
├── helpers/             # Utility functions
├── plugins/             # Vue plugins setup
│   ├── index.ts        # Plugin aggregator
│   ├── axios.ts        # Axios configuration
│   ├── i18n.ts         # Internationalization
│   ├── pinia.ts        # Pinia store
│   ├── toast.ts        # Toast notifications
│   └── primeVue/       # PrimeVue setup
│
├── interfaces/          # TypeScript interfaces
├── types/              # Type definitions
├── enums/              # Enum constants
├── constants/          # Constants (storage keys, etc.)
├── locales/            # i18n translation files
└── assets/             # Static assets
```

## Key Concepts

### Path Alias

Use `@/` to reference `src/` directory:

```typescript
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/Button.vue';
```

### Auto-Imported Components

PrimeVue components are auto-imported via `unplugin-vue-components`:

```vue
<template>
  <!-- No import needed for PrimeVue components -->
  <Button label="Click me" />
  <DataTable :value="data" />
</template>
```

### Plugin System

All plugins initialized in `plugins/index.ts`:
- Pinia (state management)
- Vue I18n (translations)
- PrimeVue (UI components)
- Vue Toastification (notifications)
- Axios (HTTP client)

Used in `main.ts`:
```typescript
import plugins from './plugins';
app.use(plugins);
```

## Authentication Flow

### Token Management

**Storage** (`constants/storageKeys.ts`):
```typescript
export enum EStorageKeys {
  TOKEN = 'token',
}
```

**Login Flow**:
1. User logs in via `auth` store
2. JWT token saved to `localStorage`
3. Token set in axios default headers
4. Router guard fetches user data

**Router Guard** (`router/index.ts:16-50`):
```typescript
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem(EStorageKeys.TOKEN);

  if (token && !usersStore.isAuthenticated) {
    await usersStore.fetchUser(token);
  }

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Route protection logic
  if (requiresAuth && !token) {
    return next({ name: ERouteNames.Dashboard });
  }

  next();
});
```

**Route Meta Fields**:
```typescript
{
  path: '/admin',
  meta: {
    requiresAuth: true,  // Requires authentication
    requiresUnAuth: false,  // Requires NOT authenticated
    isPublic: true,  // Public access
    title: 'Page Title'  // Browser title
  }
}
```

### Store Pattern

**Standard Store Structure**:
```typescript
export const useBlogsStore = defineStore(EStoreNames.PRODUCTS, {
  state: (): State => ({
    list: [],
    currentBlog: {} as IBlog,
  }),

  actions: {
    async fetch() {
      const response = await axios.get('/blogs');
      this.list = response;
      return response;
    },

    async filter(payload: IBlogFilterDTO) {
      const response = await axios.post('/blogs/filter', payload);
      this.list = response;
      return response;
    },

    async find(id: string) {
      const response = await axios.get(`/blogs/${id}`);
      this.currentBlog = response;
      return response;
    },

    async create(payload: IBlogDTO) {
      return axios.post('/blogs', payload);
    },

    async update(id: string, payload: IBlogDTO) {
      return axios.put(`/blogs/${id}`, payload);
    },

    async delete(id: string) {
      return axios.delete(`/blogs/${id}`);
    },
  },
});
```

**Usage in Components**:
```vue
<script setup lang="ts">
import { useBlogsStore } from '@/stores/blogs';

const blogsStore = useBlogsStore();

// Fetch data
await blogsStore.fetch();

// Access state
const blogs = blogsStore.list;
</script>
```

## Axios Configuration

**Base Setup** (`plugins/axios.ts`):
```typescript
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
```

**Interceptors**:
- Request: Automatically adds Authorization header from localStorage
- Response: Type-safe response data extraction

**Making Requests**:
```typescript
// Store handles axios calls
await blogsStore.fetch();

// Or direct axios usage
import axios from 'axios';
const response = await axios.get('/blogs');
```

## Form Validation

Using **Vee-Validate** + **Yup**:

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit(async (values) => {
  await authStore.login(values);
});
</script>

<template>
  <form @submit="onSubmit">
    <InputText name="email" :class="{ 'p-invalid': errors.email }" />
    <small class="p-error">{{ errors.email }}</small>
  </form>
</template>
```

**Custom Validators** (`helpers/customValidators.ts`):
- Custom Yup validators for business logic
- Reusable validation rules

**i18n Integration** (`helpers/veeValidateI18n.ts`):
- Validation messages translated automatically

## Internationalization (i18n)

**Setup** (`plugins/i18n.ts`):
- Locales: Turkish (tr), English (en)
- Translation files in `locales/`
- Fallback to Turkish

**Usage**:
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

// Switch language
locale.value = 'en';
</script>

<template>
  <h1>{{ t('welcome.title') }}</h1>
  <p>{{ t('welcome.description') }}</p>
</template>
```

**Translation Files** (`locales/`):
```typescript
// locales/tr.ts
export default {
  welcome: {
    title: 'Hoş Geldiniz',
    description: 'Açıklama metni',
  },
};
```

## PrimeVue Setup

**Theme Configuration** (`plugins/primeVue/`):
- PrimeVue 4 with new theme system
- Aura theme preset
- Auto-imported components via resolver

**Common Components**:
- `Button`, `InputText`, `DataTable`, `Dialog`
- `Toast`, `Dropdown`, `Calendar`, `FileUpload`
- `Menubar`, `Sidebar`, `Card`, `Avatar`

**Icons**:
```vue
<template>
  <i class="pi pi-user" />
  <i class="pi pi-home" />
</template>
```

## Toast Notifications

**Setup** (`plugins/toast.ts`):
```typescript
import { useToast } from 'vue-toastification';

const toast = useToast();

// Success
toast.success('Operation successful!');

// Error
toast.error('Something went wrong!');

// Info
toast.info('Information message');

// Warning
toast.warning('Warning message');
```

## TypeScript Best Practices

### Interfaces

Define interfaces for all data structures (`interfaces/`):
```typescript
export interface IBlog {
  _id: string;
  name: string;
  enName: string;
  documentUrl: string;
  enDocumentUrl: string;
  category: ICategory;
  createdAt: string;
  updatedAt: string;
}

export interface IBlogDTO {
  name: string;
  enName: string;
  documentUrl: string;
  enDocumentUrl: string;
  category: string;
}
```

### Enums

Use enums for constants (`enums/`, `constants/`):
```typescript
export enum ERouteNames {
  Dashboard = 'Dashboard',
  BlogList = 'BlogList',
  BlogDetail = 'BlogDetail',
}

export enum EStorageKeys {
  TOKEN = 'token',
  LANGUAGE = 'language',
}
```

### Type Safety

- Use `lang="ts"` in all `<script>` tags
- Define prop types with `defineProps<Props>()`
- Type store state and actions
- Use interfaces for API responses

## Styling

### Tailwind CSS

Utility-first approach:
```vue
<template>
  <div class="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
    <h2 class="text-xl font-bold text-gray-800">Title</h2>
    <button class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
      Click me
    </button>
  </div>
</template>
```

### SCSS Modules

Global styles in `styles/index.scss`:
```scss
@import './variables';
@import './mixins';
@import './base';
```

Component-scoped styles:
```vue
<style scoped lang="scss">
.component {
  @apply flex items-center;

  &__title {
    color: var(--primary-color);
  }
}
</style>
```

## Testing

**Vitest + Vue Test Utils**:

```typescript
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Button from '@/components/ui/Button.vue';

describe('Button', () => {
  it('renders label', () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' },
    });

    expect(wrapper.text()).toContain('Click me');
  });
});
```

Run tests:
```bash
npm run test:unit
```

## Common Patterns

### Composables

Create reusable logic (`composables/`):
```typescript
export function useBlogFilters() {
  const filters = ref({
    name: '',
    category: null,
  });

  const applyFilters = async () => {
    await blogsStore.filter(filters.value);
  };

  return {
    filters,
    applyFilters,
  };
}
```

Usage:
```vue
<script setup lang="ts">
const { filters, applyFilters } = useBlogFilters();
</script>
```

### Helper Functions

Utility functions (`helpers/utils.ts`):
```typescript
export function formatDate(date: string): string {
  return dayjs(date).format('DD.MM.YYYY');
}

export function truncate(text: string, length: number): string {
  return text.length > length ? `${text.slice(0, length)}...` : text;
}
```

## Build & Deployment

### Production Build

```bash
# Build with type checking
npm run build

# Build output: dist/
```

### Deploy to S3

```bash
npm run sync
```

Syncs `dist/` to configured S3 bucket.

### Docker

Dockerfile included for containerized deployment:
```bash
docker build -t blog-post-client .
docker run -p 3001:3001 blog-post-client
```

## Common Issues

**Port already in use**:
- Default port is 3001
- Change in `vite.config.ts` or use `--port` flag

**PrimeVue components not working**:
- Check auto-import resolver in `vite.config.ts`
- Restart dev server after config changes

**Axios 401 errors**:
- Verify token in localStorage
- Check token expiry (3 days)
- Ensure Authorization header format: `Bearer <token>`

**Type errors**:
- Run `npm run type-check`
- Check interface definitions match API responses
- Verify import paths use `@/` alias

**i18n missing translations**:
- Add keys to both `locales/tr.ts` and `locales/en.ts`
- Restart dev server to reload translations

## Performance Tips

- Use `defineAsyncComponent` for lazy-loading large components
- Implement virtual scrolling for long lists with PrimeVue VirtualScroller
- Optimize images before upload to S3
- Use `v-memo` for expensive computations in templates
- Enable production mode optimizations in Vite config
