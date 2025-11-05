<template>
  <div class="flex flex-col gap-2 relative">
    <label :for="id">{{ label }}</label>
    <Textarea
      :value="value as string"
      @update:value="(newValue) => ((value as any).value = newValue)"
      :id="id"
      :data-error="!!errorMessage"
      :data-valid="isValid"
      :placeholder="placeholder"
      :disabled="disabled"
      :unstyled="unstyled"
      class="w-full"
      :invalid="!!errorMessage"
      :rows="rows"
      :cols="cols"
      :autoResize="autoResize"
      :class="[customClass]"
      v-on="listeners"
      v-bind="primeProps"
    />
    <small :id="`${id}-help`" class="p-error text-red-500">{{
      errorMessage
    }}</small>
  </div>
</template>

<script setup lang="ts">
import type { TextareaProps } from "primevue/textarea";
import { computed } from "vue";
import { useField } from "vee-validate";

interface IProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  customClass?: string;
  primeProps?: TextareaProps;
  errorMessage?: string;
  customEvents?: Record<string, (e: Event) => any>;
  transformValue?: (value: InputEvent) => unknown;
  modelValue?: string;
  isValid?: boolean;
  disabled?: boolean;
  unstyled?: boolean;
  rows?: number;
  cols?: number;
  autoResize?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  placeholder: "",
  unstyled: false,
  rows: 5,
  autoResize: false,
});

const {
  errorMessage: vError,
  value,
  handleBlur,
  handleChange,
} = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const errorMessage = computed(() =>
  props.errorMessage ? props.errorMessage : vError.value,
);

const listeners = {
  ...props.customEvents,
  blur: (e: InputEvent) => {
    handleBlur(e, true);
    props.customEvents?.blur?.(e);
  },
  change: (e: InputEvent) => {
    handleChange(e);
    props.customEvents?.change?.(e);
  },
  input: (e: InputEvent) => {
    const value = props.transformValue ? props.transformValue(e) : e;
    handleChange(value, !!errorMessage.value);
    props.customEvents?.input?.(e);
  },
  focus: (e: InputEvent) => {
    props.customEvents?.focus?.(e);
  },
};
</script>

<style scoped>
.unstyled:focus {
  outline: none;
}
</style>
