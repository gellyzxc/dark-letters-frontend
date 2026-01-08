<template>
  <div class="input-wrapper" :class="{ 'has-error': error, 'is-disabled': disabled }">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
    </label>
    <div class="input-container" :class="{ 'otp-mode': otp }">
      <img src="@/assets/images/forms/input.png" class="input-bg" alt="" v-if="!otp" />
      <img src="@/assets/images/forms/popa.png" class="input-bg" alt="" v-else />
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="modelValue"
        :maxlength="maxlength"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        @keydown="$emit('keydown', $event)"
        class="input-field"
      />
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: "InputComponent",
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'password', 'email', 'number', 'tel', 'url', 'search'].includes(value)
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    otp: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [String, Number],
      default: null
    }
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  data() {
    return {
      inputId: `input-${Math.random().toString(36).substr(2, 9)}`
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  width: 100%;

  .input-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    font-family: $font-family-display;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .input-container {
    position: relative;
    width: 100%;
    aspect-ratio: 242 / 47;
    display: flex;
    align-items: center;

    &.otp-mode {
      aspect-ratio: 339 / 282;
    }

    .input-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;
      pointer-events: none;
      z-index: 0;
    }

    .input-field {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      padding: 0 8%;
      font-size: $font-size-base;
      font-family: $font-family-primary;
      color: $color-text-primary;
      background: transparent;
      border: none;
      outline: none;

      &::placeholder {
        color: rgba($color-text-primary, 0.4);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    &.otp-mode .input-field {
      margin-left: 1rem;
      resize: none;
      text-align: center;
      overflow: hidden;
      font-size: $font-size-3xl;
      font-weight: $font-weight-bold;
    }
  }

  .error-message {
    font-size: $font-size-xs;
    color: $color-error;
    font-family: $font-family-display;
    margin-top: -$spacing-xs;
  }

  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
