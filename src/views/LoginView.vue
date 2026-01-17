<template>
  <div class="page">
    <frame-component class="frame">
      <div class="content">
        <input-component placeholder="Email" v-model="form.email" />
        <input-component
          placeholder="Password"
          type="password"
          v-model="form.password"
        />
        <div class="row">
          <img
            src="@/assets/images/forms/register.png"
            @click="$router.push('/register')"
          />
          <img src="@/assets/images/forms/login.png" @click="handleAuth" />
        </div>
      </div>
    </frame-component>
  </div>
</template>
<style scoped lang="scss">
@use "@/assets/styles/variables" as *;
.page {
  height: 100svh;
  width: 100svw;
  display: flex;
  align-items: center;
  justify-content: center;
  .frame {
    height: 60svh !important;
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    width: 100%;
    align-items: center;
    height: 100%;
    justify-content: center;
    & > * {
      width: 80%;
    }
    .row {
      display: flex;
      flex-direction: row;
      gap: $spacing-md;
      margin-top: $spacing-md;
      justify-content: space-between;
      img {
        cursor: pointer;
        width: 48%;
      }
    }
  }
}
</style>
<script>
import FrameComponent from "@/components/game/FrameComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import { useAuthStore } from "@/stores/auth";
export default {
  name: "LoginView",
  components: { InputComponent, FrameComponent },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    handleAuth() {
      this.authStore
        .login(this.form)
        .then(() => {
          this.$router.push("/news");
        })
        .catch(() => {
          this.$toast.show(this.authStore.error);
        });
    },
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
};
</script>
