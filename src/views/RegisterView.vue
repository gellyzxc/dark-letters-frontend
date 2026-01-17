<template>
  <div class="page">
    <frame-component class="frame" type="generic-big-squared-rounded">
      <div class="content">
        <input-component placeholder="Username" />
        <input-component placeholder="Email" />
        <input-component placeholder="Password" type="password" />
        <div class="row ch">
          <div class="checkbox" @click="form.is_accept_policy = !form.is_accept_policy">
            <img src="@/assets/images/forms/popa.png" />
            <span v-if="form.is_accept_policy">X</span>
          </div>
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </div>
        <div class="row ch">
          <div class="checkbox" @click="form.is_advertisement = !form.is_advertisement">
            <img src="@/assets/images/forms/popa.png" />
            <span v-if="form.is_advertisement">X</span>
          </div>
          <span>I agree to receive advertisements</span>
        </div>
        <div class="row">
          <img src="@/assets/images/forms/register.png" @click="handleRegister" />
          <img src="@/assets/images/forms/back.png" @click="$router.push('/login')" />
        </div>
      </div>
    </frame-component>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.ch {
  display: flex;
  flex-direction: row;
  align-items: center;

  .checkbox {
    position: relative;

    img {
      width: 4rem !important;
      cursor: pointer;
    }

    span {
      top: 9px;
      left: 22px;
      font-weight: 600;
      font-size: 2rem;
      position: absolute;
    }
  }
}

.page {
  height: 100svh;
  width: 100svw;
  display: flex;
  align-items: center;
  justify-content: center;

  .frame {
    height: 80svh !important;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    width: 100%;
    align-items: center;
    height: 100%;
    justify-content: center;

    &>* {
      width: 90%;
    }

    .row {
      display: flex;
      flex-direction: row;
      gap: $spacing-md;
      margin-top: $spacing-md;

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
        login: "",
        email: "",
        password: "",
        is_accept_policy: false,
        is_advertisement: false,
      }
    }
  },
  methods: {
    handleRegister() {
      this.authStore.register(this.form)
        .then(() => {
          this.$router.push('/otp');
        })
        .catch(() => {
          this.$toast.show(this.authStore.error)
        })
    }
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  }
}
</script>