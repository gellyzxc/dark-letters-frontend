<template>
  <div class="page">
    <frame-component class="frame">
      <div class="content">
        <div class="otp-row">
          <input-component
            v-for="(digit, index) in otpDigits"
            :key="index"
            :ref="(el) => (otpRefs[index] = el)"
            v-model="otpDigits[index]"
            type="number"
            otp
            maxlength="1"
            @input="handleOtpInput(index, $event)"
            @keydown="handleKeyDown(index, $event)"
          />
        </div>
        <div class="row">
          <img src="@/assets/images/forms/register.png" />
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
    .otp-row {
      display: flex;
      flex-direction: row;
      height: 70px;
      gap: $spacing-md;
      & > * {
        flex: 1;
      }
    }
    .row {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: $spacing-md;
      margin-top: $spacing-md;
      img {
        cursor: pointer;
        width: 40%;
      }
    }
  }
}
</style>
<script>
import FrameComponent from "@/components/game/FrameComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
export default {
  name: "LoginView",
  components: { InputComponent, FrameComponent },
  data() {
    return {
      otpDigits: ["", "", "", "", "", ""],
      otpRefs: [],
    };
  },
  methods: {
    handleOtpInput(index, event) {
      const value = this.otpDigits[index];
      if (value && value.length > 1) {
        this.otpDigits[index] = value.charAt(value.length - 1);
      }
      if (this.otpDigits[index] && index < 5) {
        this.focusInput(index + 1);
      }
    },
    handleKeyDown(index, event) {
      if (event.key === "Backspace" && !this.otpDigits[index] && index > 0) {
        this.focusInput(index - 1);
      }
    },
    focusInput(index) {
      this.$nextTick(() => {
        const inputComponent = this.otpRefs[index];
        if (inputComponent && inputComponent.$el) {
          const inputElement = inputComponent.$el.querySelector("input");
          if (inputElement) {
            inputElement.focus();
          }
        }
      });
    },
  },
  mounted() {
    this.focusInput(0);
  },
};
</script>
