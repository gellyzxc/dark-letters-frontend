<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div" class="toast-list">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="toast-wrapper"
        @click="removeToast(toast.id)"
      >
        <FrameComponent :type="toast.frameType">
          <div class="toast-content" :class="`toast-${toast.type}`">
            <div class="toast-message">{{ toast.message }}</div>
          </div>
        </FrameComponent>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { useToastStore } from '@/stores/toast'
import FrameComponent from '@/components/game/FrameComponent.vue'

export default {
  name: 'ToastContainer',
  components: {
    FrameComponent
  },
  setup() {
    const toastStore = useToastStore()
    
    return {
      toasts: toastStore.toasts,
      removeToast: toastStore.remove
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_variables.scss';

.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
  width: 100%;
  max-width: 500px;
  padding: 0 20px;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.toast-wrapper {
  pointer-events: auto;
  cursor: pointer;
  width: 100%;
  max-width: 400px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
}

.toast-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 32px) !important;
    width: calc(100% - 48px) !important;
  padding: 16px 24px;
  text-align: center;
  
  background-color: black;
  &.toast-info {
    color: white;
  }
  
  &.toast-success {
    color: white;
  }
  
  &.toast-error {
    color: $color-error;
  }
  
  &.toast-warning {
    color: $color-gold-primary;
  }
}

.toast-message {
  font-family: $font-family-primary;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  line-height: $line-height-normal;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

// Animations
.toast-enter-active {
  animation: toast-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  animation: toast-out 0.3s cubic-bezier(0.32, 0, 0.67, 0);
}

.toast-move {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes toast-in {
  0% {
    opacity: 0;
    transform: translateY(100%) scale(0.8);
  }
  50% {
    transform: translateY(-10%) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(50%) scale(0.9);
  }
}
</style>
