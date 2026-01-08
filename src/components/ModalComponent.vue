<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div class="overlay" v-show="open" @click="$emit('willDismiss')">
        <transition name="modal-scale">
          <div class="content" v-show="open" @click.stop>
            <slot />
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>
<style scoped lang="scss">
.overlay {
  z-index: 999999999999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100svh;
  width: 100svw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(10px);
  overflow: auto;
  background: rgba(10, 8, 5, 0.7);

  .content {
    max-width: calc(100svw - 2rem);
    max-height: calc(100svh - 2rem);
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 1;
  }
}

.modal-fade-enter-active {
  animation: fadeIn 0.4s ease-out;
}

.modal-fade-leave-active {
  animation: fadeIn 0.3s ease-in reverse;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }

  to {
    opacity: 1;
    backdrop-filter: blur(10px);
  }
}

.modal-scale-enter-active {
  animation: medievalOpen 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-scale-leave-active {
  animation: medievalClose 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

@keyframes medievalOpen {
  0% {
    transform: scale(0.3) rotateX(-90deg);
    opacity: 0;
    filter: brightness(0.3) sepia(0.8);
  }

  50% {
    transform: scale(1.05) rotateX(-20deg);
    filter: brightness(1.2) sepia(0.4);
  }

  70% {
    transform: scale(0.95) rotateX(5deg);
    filter: brightness(1.1) sepia(0.2);
  }

  100% {
    transform: scale(1) rotateX(0deg);
    opacity: 1;
    filter: brightness(1) sepia(0);
  }
}

@keyframes medievalClose {
  0% {
    transform: scale(1) rotateX(0deg);
    opacity: 1;
    filter: brightness(1) sepia(0);
  }

  50% {
    transform: scale(1.1) rotateX(20deg);
    filter: brightness(1.3) sepia(0.3);
  }

  100% {
    transform: scale(0.3) rotateX(90deg);
    opacity: 0;
    filter: brightness(0.3) sepia(0.8);
  }
}
</style>
<script>
export default {
  name: "ModalComponent",
  emits: ['willDismiss'],
  props: {
    open: {
      type: Boolean,
      default: false
    }
  }
}
</script>