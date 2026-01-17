<template>
  <div class="page settings-view">
    <div class="main">
      <frame-component type="generic-big-squared-rounded">
        <div class="settings-content settings-photo-layout">
          <div class="settings-grid">
            <div class="grid-title">Settings</div>
            <div class="grid-date">{{ currentDate }}</div>
            <div class="grid-section-title section-spacing">User info</div>
            <div class="grid-empty"></div>
            <div class="grid-label">Login</div>
            <div class="grid-value">{{ userEmail }}</div>
            <div class="grid-label">Password</div>
            <div class="grid-value">************</div>
            <div class="grid-label">Profile time</div>
            <div class="grid-value">242 hours 42 min</div>
            <div class="grid-label">Notification</div>
            <div class="grid-value">
              <div class="toggle-wrapper" @click="toggleUserNotification">
                <span :class="{ active: userNotificationEnabled }">on</span
                >/<span :class="{ active: !userNotificationEnabled }">off</span>
              </div>
            </div>
            <div class="grid-label">User logo & frame</div>
            <div class="grid-value">
              <div class="user-avatar-wrapper" @click="showAvatarModal = true">
                <div class="avatar-frame">
                  <img
                    :src="BASE_URL + userAvatar"
                    class="user-avatar-display"
                  />
                </div>
              </div>
            </div>
            <div class="grid-section-title section-spacing">Game info</div>
            <div class="grid-empty"></div>
            <div class="grid-label">Sound</div>
            <div class="grid-value">
              <div class="toggle-wrapper" @click="toggleSound">
                <span :class="{ active: soundEnabled }">on</span>/<span
                  :class="{ active: !soundEnabled }"
                  >off</span
                >
              </div>
            </div>
            <div class="grid-section-title section-spacing">Advertisement</div>
            <div class="grid-empty"></div>
            <div class="grid-label">Notification</div>
            <div class="grid-value">
              <div class="toggle-wrapper" @click="toggleAdvertisement">
                <span :class="{ active: advertisementEnabled }">on</span>/<span
                  :class="{ active: !advertisementEnabled }"
                  >off</span
                >
              </div>
            </div>
            <div class="grid-section-title section-spacing">
              Questions & Suggestions
            </div>
            <div class="grid-empty"></div>
            <div class="grid-label-small">
              If you have ideas, feedback, or any questions about the game, feel
              free to contact us:
            </div>
            <div class="grid-value">DarkLettersQuestion@gmail.com</div>
            <div class="grid-section-title section-spacing">Report a Bug</div>
            <div class="grid-empty"></div>
            <div class="grid-label-small">
              For issues, bugs, or technical problems, please reach out to:
            </div>
            <div class="grid-value">DarkLettersBugReport@gmail.com</div>
          </div>
          <div class="reset-wrapper">
            <span class="reset-label">Reset progress</span>
            <div class="reset-toggle" @click="resetCharacter">
              <span class="yes-option">Yes</span>/<span class="no-option"
                >No</span
              >
            </div>
          </div>
          <modal-component
            :open="showAvatarModal"
            @willDismiss="showAvatarModal = false"
          >
            <frame-component style="height: 48svh !important">
              <div class="avatar-modal-frame">
                <div class="avatar-modal-content">
                  <div class="avatar-modal-title">Choose your avatar</div>
                  <div class="avatar-list">
                    <div
                      v-for="avatar in avatars"
                      :key="avatar"
                      class="avatar-option"
                      @click="selectAvatar(avatar)"
                    >
                      <img
                        :src="BASE_URL + 'static/avatar/' + avatar"
                        class="user-avatar-image"
                      />
                    </div>
                  </div>
                  <div class="avatar-modal-title" style="margin-top: 1rem">
                    Choose your frame
                  </div>
                  <div class="frame-list">
                    <div
                      v-for="avatar in [
                        '2.png',
                        '3.png',
                        '4.png',
                        '5.png',
                        '6.png',
                        '7.png',
                        '8.png',
                      ]"
                      :key="avatar"
                      class="avatar-option"
                      @click="selectFrame(avatar)"
                    >
                      <img
                        :src="BASE_URL + 'static/frame/' + avatar"
                        class="user-frame-image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </frame-component>
          </modal-component>
        </div>
      </frame-component>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "@/assets/styles/variables" as *;
.user-avatar-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  transition: transform $transition-fast;
  &:hover {
    transform: scale(1.05);
  }
  .avatar-frame {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    .user-avatar-display {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid rgb(110, 110, 110);
      box-shadow: 0 0 8px rgb(110, 110, 110);
      transition: box-shadow $transition-base;
      object-fit: cover;
    }
  }
}
.avatar-modal-frame {
  width: 400px;
  max-width: 90vw;
  padding: $spacing-md $spacing-md $spacing-lg $spacing-md;
  background: $color-bg-modal;
  border-radius: $radius-xl;
  box-shadow:
    $shadow-lg,
    0 0 0 2px $color-brown-medium,
    0 0 0 8px rgb(110, 110, 110);
}
.avatar-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
}
.avatar-modal-title {
  font-size: $font-size-lg;
  color: $color-text-primary;
  margin-bottom: $spacing-sm;
  text-align: center;
}
.avatar-list,
.frame-list {
  display: flex;
  flex-direction: row;
  gap: $spacing-sm;
  justify-content: center;
  margin-bottom: $spacing-xs;
}
.avatar-option {
  cursor: pointer;
  transition: transform $transition-fast;
  &:hover {
    transform: translateY(-2px);
  }
  .user-avatar-image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid rgba($color-text-primary, 0.2);
    box-shadow: 0 0 8px rgb(110, 110, 110);
    transition:
      box-shadow $transition-base,
      transform $transition-fast;
    object-fit: cover;
  }
  .user-frame-image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    transition:
      box-shadow $transition-base,
      transform $transition-fast;
    object-fit: cover;
  }
  &:hover .user-avatar-image {
    box-shadow:
      0 0 0 3px rgb(110, 110, 110),
      0 0 12px rgb(110, 110, 110),
      $glow-gold-sm;
  }
  &.selected .user-avatar-image {
    border-color: rgb(110, 110, 110);
    box-shadow:
      0 0 0 3px rgb(110, 110, 110),
      0 0 16px rgb(110, 110, 110),
      $glow-gold-sm;
  }
  &:active .user-avatar-image {
    transform: scale(0.95);
  }
}
.frame-option {
  cursor: pointer;
  transition: transform $transition-fast;
  &:hover {
    transform: translateY(-2px);
  }
  .profile-frame-placeholder {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: repeating-linear-gradient(
      135deg,
      rgb(110, 110, 110) 0 6px,
      $color-bg-elevated 6px 12px
    );
    border: 2px solid rgba($color-text-primary, 0.1);
    box-shadow: 0 0 8px rgb(110, 110, 110);
    color: $color-text-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-xs;
    font-family: $font-family-primary;
    transition:
      box-shadow $transition-base,
      transform $transition-fast;
  }
  &:hover .profile-frame-placeholder {
    box-shadow:
      0 0 0 3px rgb(110, 110, 110),
      0 0 12px rgb(110, 110, 110),
      $glow-gold-sm;
  }
  &:active .profile-frame-placeholder {
    transform: scale(0.95);
  }
}
</style>
<style scoped lang="scss">
@use "@/assets/styles/variables" as *;
.page {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .main {
    display: flex;
    width: 100%;
    max-width: 1200px;
    max-height: 900px;
    justify-content: center;
  }
}
.settings-content {
  width: calc(100% - 6rem) !important;
  height: calc(100% - #{$spacing-xl}) !important;
  padding: $spacing-md $spacing-2xl !important;
  overflow-y: auto;
  color: $color-text-primary;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &::-webkit-scrollbar {
    display: none;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
    padding-bottom: 1rem;
    .title {
      font-size: 2rem;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      text-transform: none;
      letter-spacing: normal;
    }
    .date {
      font-size: 1rem;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  .settings-sections {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    flex: 1;
  }
  .section {
    background: transparent;
    border: none;
    padding: 0;
    box-shadow: none;
    .section-title {
      font-size: 1.2rem;
      font-weight: 400;
      margin-bottom: 1.5rem;
      color: rgba(255, 255, 255, 0.7);
      border: none;
      padding: 0;
      text-transform: none;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.2rem;
      font-size: 1rem;
      .label {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 400;
      }
      .value {
        color: rgba(255, 255, 255, 1);
        text-align: right;
        &.password {
          letter-spacing: 0.2em;
        }
        &.toggle {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
    .user-icon-section {
      margin-top: 2rem;
      .label {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 400;
        font-size: 1rem;
      }
    }
  }
  .actions {
    margin-top: auto;
    padding-top: 3rem;
    .reset-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1rem;
      .label {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 400;
      }
      .value {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}
</style>
<style scoped lang="scss">
@use "@/assets/styles/variables" as *;
.settings-photo-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: $font-family-primary;
  background: transparent;
  color: $color-text-primary;
  font-size: 1.1rem;
  padding: 0;
  position: relative;
}
.settings-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: $spacing-xs $spacing-md;
  width: 100%;
  height: 100%;
  padding: $spacing-sm;
  align-content: start;
}
.grid-title {
  font-size: 1.2rem;
  grid-column: 1;
  font-weight: $font-weight-normal;
  color: $color-text-primary;
  font-family: $font-family-primary;
  padding-bottom: $spacing-md;
}
.grid-date {
  grid-column: 2;
  color: $color-text-primary;
  text-align: right;
  font-family: $font-family-primary;
  padding-bottom: $spacing-md;
}
.grid-section-title {
  grid-column: 1;
  color: $color-text-primary;
  font-family: $font-family-primary;
  padding-bottom: $spacing-xs;
  &.section-spacing {
    padding-top: $spacing-lg;
  }
}
.grid-label {
  grid-column: 1;
  font-size: 1.2rem;
  color: $color-text-disabled;
  font-weight: $font-weight-normal;
  font-family: $font-family-primary;
  transition: color $transition-fast;
  cursor: pointer;
  &:hover {
    color: $color-text-secondary;
  }
}
.grid-label-small {
  grid-column: 1;
  color: $color-text-disabled;
  font-weight: $font-weight-normal;
  font-family: $font-family-primary;
}
.grid-value {
  grid-column: 2;
  font-weight: $font-weight-normal;
  font-family: $font-family-primary;
  text-align: right;
  transition: color $transition-fast;
  cursor: pointer;
  align-self: center;
  &:hover {
    color: $color-text-secondary;
  }
}
.grid-empty {
  grid-column: 2;
}
.toggle-wrapper {
  cursor: pointer;
  font-family: $font-family-primary;
  transition: all $transition-base;
  display: inline-block;
  span {
    color: $color-text-disabled;
    transition: color $transition-fast;
    &.active {
      color: $color-text-primary;
    }
  }
  &:hover span:not(.active) {
    color: $color-text-secondary;
  }
}
.reset-wrapper {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  font-family: $font-family-primary;
  width: calc(100% - 6rem);
  justify-content: space-between;
  padding: 0 3rem;
  .reset-label {
    color: $color-text-disabled;
  }
  .reset-toggle {
    cursor: pointer;
    transition: all $transition-base;
    .yes-option,
    .no-option {
      color: $color-text-disabled;
      transition: color $transition-fast;
    }
    .no-option {
      color: $color-text-primary;
    }
    &:hover .yes-option {
      color: $color-text-secondary;
    }
  }
}
</style>
<script>
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { useCharacterStore } from "@/stores/character";
import FrameComponent from "@/components/game/FrameComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { API_BASE_URL } from "@/api/client";
const BASE_URL = API_BASE_URL;
export default {
  name: "SettingsView",
  components: { FrameComponent, ModalComponent },
  setup() {
    const userStore = useUserStore();
    const characterStore = useCharacterStore();
    const showAvatarModal = ref(false);
    const currentDate = ref("");
    const soundEnabled = ref(localStorage.getItem("soundEnabled") !== "false");
    const advertisementEnabled = ref(
      localStorage.getItem("advertisementEnabled") !== "false",
    );
    const userNotificationEnabled = ref(
      localStorage.getItem("userNotificationEnabled") !== "false",
    );
    const avatars = [
      "1.png",
      "2.png",
      "3.png",
      "4.png",
      "5.png",
      "7.png",
      "8.png",
      "9.png",
    ];
    const userEmail = computed(
      () => userStore.user?.email || "user@typing.com",
    );
    const userLogin = computed(() => userStore.user?.login || "user");
    const userAvatar = computed(
      () => userStore.user?.avatar || "static/avatar/default_avatar.png",
    );
    const userFrame = computed(
      () => userStore.user?.frame || "static/frame/default_frame.svg",
    );
    const characterGold = computed(() => characterStore.character?.gold || 0);
    const getImageUrl = (photoPath) => {
      if (!photoPath) return null;
      return `${BASE_URL}${photoPath}`;
    };
    const selectAvatar = async (img) => {
      if (!userStore.user) return;
      try {
        await userStore.updateUser({
          avatar: "static/avatar/" + img,
        });
        await userStore.fetchCurrentUser();
        showAvatarModal.value = false;
      } catch (error) {
        console.error("Failed to update avatar:", error);
      }
    };
    const selectFrame = async (id) => {
      if (!userStore.user) return;
      try {
        await userStore.updateUser({
          frame: `static/frame/${id}`,
        });
        showAvatarModal.value = false;
      } catch (error) {
        console.error("Failed to update frame:", error);
      }
    };
    const updateDate = () => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const year = now.getFullYear();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = days[now.getDay()];
      currentDate.value = `${day}.${month}.${year} - ${dayName} ${hours}:${minutes}`;
    };
    const resetProgress = async () => {
      if (confirm("Are you sure you want to reset all progress?")) {
        try {
          await userStore.deleteUser();
          console.log("Progress reset");
        } catch (error) {
          console.error("Failed to reset progress:", error);
        }
      }
    };
    const toggleSound = () => {
      soundEnabled.value = !soundEnabled.value;
      localStorage.setItem("soundEnabled", soundEnabled.value.toString());
    };
    const toggleAdvertisement = () => {
      advertisementEnabled.value = !advertisementEnabled.value;
      localStorage.setItem(
        "advertisementEnabled",
        advertisementEnabled.value.toString(),
      );
    };
    const toggleUserNotification = () => {
      userNotificationEnabled.value = !userNotificationEnabled.value;
      localStorage.setItem(
        "userNotificationEnabled",
        userNotificationEnabled.value.toString(),
      );
    };
    const resetCharacter = async () => {
      if (
        confirm(
          "Are you sure you want to reset your character? This action cannot be undone.",
        )
      ) {
        try {
          const characterId = characterStore.character?.id;
          if (!characterId) {
            console.error("No character found");
            return;
          }
          await characterStore.deleteCharacter(characterId);
          console.log("Character deleted successfully");
          window.location.href = "/character-select";
        } catch (error) {
          console.error("Failed to delete character:", error);
          this.$toast.show("Failed to reset character. Please try again.");
        }
      }
    };
    onMounted(async () => {
      updateDate();
      setInterval(updateDate, 60000);
      if (!userStore.user) {
        try {
          await userStore.fetchCurrentUser();
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
      if (!characterStore.character) {
        try {
          await characterStore.fetchCharacter();
        } catch (error) {
          console.error("Failed to fetch character data:", error);
        }
      }
    });
    const BASE_URL = API_BASE_URL;
    return {
      showAvatarModal,
      currentDate,
      avatars,
      userEmail,
      userLogin,
      userAvatar,
      userFrame,
      soundEnabled,
      advertisementEnabled,
      userNotificationEnabled,
      characterGold,
      selectAvatar,
      selectFrame,
      resetProgress,
      resetCharacter,
      toggleSound,
      toggleAdvertisement,
      toggleUserNotification,
      getImageUrl,
      BASE_URL,
    };
  },
};
</script>
