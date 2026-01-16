<template>
  <div class="app-container">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script>
import ToastContainer from '@/components/ToastContainer.vue'

export default {
  components: {
    ToastContainer
  }
}
</script>

<style scoped>
.app-container {
  max-width: 1920px;
  max-height: 1080px;
  display: flex;
  /* width: 100vw;
  height: 100vh; */
  margin: 0 auto;
  /* position: relative; */
}
</style>