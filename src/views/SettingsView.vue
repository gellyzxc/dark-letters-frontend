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
            <div class="grid-label grid-avatar-label">
              <span>User logo</span>
              <div class="user-avatar-wrapper" @click="showAvatarModal = true">
                <div class="avatar-frame">
                  <img :src="selectedAvatarImage" :alt="getSelectedAvatar().name" class="user-avatar-display" />
                </div>
              </div>
            </div>
            <div class="grid-empty"></div>
            <div class="grid-label">Notification</div>
            <div class="grid-value">{{ userNotification }}</div>
            <div class="grid-section-title section-spacing">Questions & Suggestions</div>
            <div class="grid-empty"></div>
            <div class="grid-label-small">If you have ideas, feedback, or any questions about the game, feel free to
              contact us:</div>
            <div class="grid-value">DarkLettersQuestion@gmail.com</div>
            <div class="grid-section-title section-spacing">Report a Bug</div>
            <div class="grid-empty"></div>
            <div class="grid-label-small">For issues, bugs, or technical problems, please reach out to:</div>
            <div class="grid-value">DarkLettersBugReport@gmail.com</div>
          </div>
          <modal-component :open="showAvatarModal" @willDismiss="showAvatarModal = false">
            <frame-component style="height: 40svh !important;">
              <div class="avatar-modal-frame">
                <div class="avatar-modal-content">
                  <div class="avatar-modal-title">Choose your avatar</div>
                  <div class="avatar-list">
                    <div v-for="avatar in avatars" :key="'avatar-' + avatar.id" class="avatar-option"
                      @click="selectAvatar(avatar.id)">
                      <img :src="avatar.image" :alt="avatar.name" class="user-avatar-image" />
                    </div>
                  </div>
                  <div class="avatar-modal-title" style="margin-top:1rem;">Choose your frame</div>
                  <div class="frame-list">
                    <div v-for="n in 8" :key="'frame-' + n" class="frame-option" @click="selectFrame(n)">
                      <div class="profile-frame-placeholder">Frame {{ n }}</div>
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
@use '@/assets/styles/variables' as *;

.user-avatar-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
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
      border: 2px solid rgba($color-gold-primary, 0.3);
      box-shadow: 0 0 8px rgba($color-gold-primary, 0.5);
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
  box-shadow: $shadow-lg, 0 0 0 2px $color-brown-medium, 0 0 0 8px rgba($color-gold-primary, 0.08);
}

.avatar-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
}

.avatar-modal-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  margin-bottom: $spacing-sm;
  text-align: center;
  font-family: $font-family-display;
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
    box-shadow: 0 0 8px rgba($color-gold-primary, 0.3);
    transition: box-shadow $transition-base, transform $transition-fast;
    object-fit: cover;
  }

  &:hover .user-avatar-image {
    box-shadow: 0 0 0 3px $color-gold-primary, 0 0 12px rgba($color-gold-primary, 0.5), $glow-gold-sm;
  }

  &.selected .user-avatar-image {
    border-color: $color-gold-primary;
    box-shadow: 0 0 0 3px $color-gold-primary, 0 0 16px rgba($color-gold-primary, 0.8), $glow-gold-sm;
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
    background: repeating-linear-gradient(135deg, $color-gold-primary 0 6px, $color-bg-elevated 6px 12px);
    border: 2px solid rgba($color-text-primary, 0.1);
    box-shadow: 0 0 8px rgba($color-gold-primary, 0.5);
    color: $color-text-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-xs;
    font-family: $font-family-primary;
    transition: box-shadow $transition-base, transform $transition-fast;
  }

  &:hover .profile-frame-placeholder {
    box-shadow: 0 0 0 3px $color-gold-primary, 0 0 12px rgba($color-gold-primary, 0.5), $glow-gold-sm;
  }

  &:active .profile-frame-placeholder {
    transform: scale(0.95);
  }
}
</style>
<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-height: 1080px;
  max-width: 1920px;
  padding: $spacing-xl;

  .main {
    display: flex;
    width: 100%;
    max-width: 1200px;
    max-height: 900px;
    justify-content: center;
  }
}

.settings-content {
  width: calc(100% - #{$spacing-3xl * 2}) !important;
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
        color: rgba(255, 255, 255, 0.7);
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
@use '@/assets/styles/variables' as *;

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
  font-size: $font-size-base;
  padding: 0;
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
  grid-column: 1;
  font-size: $font-size-lg;
  font-weight: $font-weight-normal;
  color: $color-text-primary;
  font-family: $font-family-primary;
  padding-bottom: $spacing-md;
}

.grid-date {
  grid-column: 2;
  font-size: $font-size-sm;
  color: $color-text-primary;
  text-align: right;
  font-family: $font-family-primary;
  padding-bottom: $spacing-md;
}

.grid-section-title {
  grid-column: 1;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  font-family: $font-family-primary;
  padding-bottom: $spacing-xs;

  &.section-spacing {
    padding-top: $spacing-lg;
  }
}

.grid-label {
  grid-column: 1;
  font-size: $font-size-sm;
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
  font-size: $font-size-xs;
  color: $color-text-disabled;
  font-weight: $font-weight-normal;
  font-family: $font-family-primary;
}

.grid-avatar-label {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.grid-value {
  grid-column: 2;
  font-size: $font-size-sm;
  color: $color-text-disabled;
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
</style>
<script>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCharacterStore } from '@/stores/character'
import FrameComponent from "@/components/game/FrameComponent.vue"
import ModalComponent from "@/components/ModalComponent.vue"
import assasinAvatar from '@/assets/images/classicons/assasin.png'
import dwarfAvatar from '@/assets/images/classicons/dwarf.png'
import elfAvatar from '@/assets/images/classicons/elf.png'
import gnomAvatar from '@/assets/images/classicons/gnom.png'
import humanAvatar from '@/assets/images/classicons/human.png'
import mageAvatar from '@/assets/images/classicons/mage.png'
import warriorAvatar from '@/assets/images/classicons/warrior.png'
const API_BASE_URL = 'http://147.45.253.24:5035/';
const BASE_URL = API_BASE_URL.replace('/api/v1', '');
export default {
  name: "SettingsView",
  components: { FrameComponent, ModalComponent },
  setup() {
    const userStore = useUserStore()
    const characterStore = useCharacterStore()
    const showAvatarModal = ref(false)
    const currentDate = ref('')
    const avatars = [
      { id: 1, name: 'assasin', image: assasinAvatar, apiPath: 'static/avatar/1.png' },
      { id: 2, name: 'dwarf', image: dwarfAvatar, apiPath: 'static/avatar/2.png' },
      { id: 3, name: 'elf', image: elfAvatar, apiPath: 'static/avatar/3.png' },
      { id: 4, name: 'gnom', image: gnomAvatar, apiPath: 'static/avatar/4.png' },
      { id: 5, name: 'human', image: humanAvatar, apiPath: 'static/avatar/5.png' },
      { id: 6, name: 'mage', image: mageAvatar, apiPath: 'static/avatar/6.png' },
      { id: 7, name: 'warrior', image: warriorAvatar, apiPath: 'static/avatar/7.png' }
    ]
    const userEmail = computed(() => userStore.user?.email || 'user@typing.com')
    const userLogin = computed(() => userStore.user?.login || 'user')
    const userAvatar = computed(() => userStore.user?.avatar || 'static/avatar/default_avatar.png')
    const userFrame = computed(() => userStore.user?.frame || 'static/frame/default_frame.svg')
    const userNotification = computed(() => userStore.user?.is_notification ? 'on' : 'off')
    const characterGold = computed(() => characterStore.character?.gold || 0)
    const getImageUrl = (photoPath) => {
      if (!photoPath) return null
      return `${BASE_URL}${photoPath}`
    }
    const getSelectedAvatar = () => {
      const currentAvatarPath = userStore.user?.avatar
      if (!currentAvatarPath) return avatars[0]
      const foundAvatar = avatars.find(a => currentAvatarPath.includes(a.apiPath) || currentAvatarPath.includes(`${a.id}.png`))
      return foundAvatar || avatars[0]
    }
    const selectedAvatarImage = computed(() => {
      const avatar = getSelectedAvatar()
      return avatar ? avatar.image : avatars[0].image
    })
    const selectAvatar = async (id) => {
      if (!userStore.user) return
      try {
        const avatar = avatars.find(a => a.id === id)
        if (avatar) {
          await userStore.updateUser({
            avatar: avatar.apiPath,
          })
          await userStore.fetchCurrentUser()
        }
        showAvatarModal.value = false
      } catch (error) {
        console.error('Failed to update avatar:', error)
      }
    }
    const selectFrame = async (n) => {
      if (!userStore.user) return
      try {
        await userStore.updateUser({
          frame: `static/frame/${n}.png`,
        })
        showAvatarModal.value = false
      } catch (error) {
        console.error('Failed to update frame:', error)
      }
    }
    const updateDate = () => {
      const now = new Date()
      const day = now.getDate().toString().padStart(2, '0')
      const month = (now.getMonth() + 1).toString().padStart(2, '0')
      const year = now.getFullYear()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayName = days[now.getDay()]
      currentDate.value = `${day}.${month}.${year} - ${dayName} ${hours}:${minutes}`
    }
    const resetProgress = async () => {
      if (confirm('Are you sure you want to reset all progress?')) {
        try {
          await userStore.deleteUser()
          console.log('Progress reset')
        } catch (error) {
          console.error('Failed to reset progress:', error)
        }
      }
    }
    onMounted(async () => {
      updateDate()
      setInterval(updateDate, 60000)
      if (!userStore.user) {
        try {
          await userStore.fetchCurrentUser()
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      }
    })
    return {
      showAvatarModal,
      currentDate,
      avatars,
      userEmail,
      userLogin,
      userAvatar,
      userFrame,
      userNotification,
      characterGold,
      getSelectedAvatar,
      selectedAvatarImage,
      selectAvatar,
      selectFrame,
      resetProgress,
      getImageUrl
    }
  }
}
</script>
