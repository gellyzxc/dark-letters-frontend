<template>
  <div class="header">
    <div class="item logo">
      <div class="image">
        <img src="@/assets/logo.png" />
      </div>
      <span>Dark Letters v1.0</span>
    </div>
    <div v-for="item in headerItems" class="item" @click="handleNavigate(item)"
      :class="{ active: item.path === selected }">
      <span>
        {{ item.label }}
      </span>
    </div>
    <div class="item tag" style="display: flex; flex-direction: row; gap: 0.5rem;">
      <div class="icon" :style="{ backgroundImage: `url(${BASE_URL}${avatar})` }">

      </div>
      <div class="icon-frame">
        <img :src="BASE_URL + frame" />
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.2rem;">
        <span>
          {{ userName }}
        </span>
        <span>132 h 14 m</span>
      </div>
    </div>
  </div>
  <div class="content">
    <router-view />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

@font-face {
  font-family: Logo;
  src: url('@/assets/matrix.ttf') format('truetype');
}

.header {
  z-index: 1000;
  height: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  position: fixed;
  right: 1rem;
  align-items: center;
  top: 0;
  background-color: transparent;

  .item {

    &.logo {
      position: fixed;
      left: 0.2rem;
      display: flex;
      flex-direction: row;
      align-items: center;

      .image {
        height: 3rem;
        width: auto;

        img {
          height: 100%;
        }
      }

      span {
        color: white;
        font-size: 1.4rem;
        font-family: Logo;
      }
    }

    &.tag {
      align-items: center;

      span {
        color: white;
        font-size: 1.25rem;
      }

      .icon {
        height: 3rem;
        width: 3rem;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }

      .icon-frame {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3rem;

        img {
          width: 3rem;
        }
      }
    }

    cursor: pointer;

    span {
      font-weight: 400;
      font-size: 2rem;
      line-height: 100%;
      text-align: center;
      vertical-align: middle;
      color: #464040;
      transition: all .2s ease-in-out;
    }

    &.active {
      span {
        color: white;
      }
    }
  }
}

.content {
  padding: 3rem 1rem 3rem 1rem;
  height: calc(100svh - 6rem);
  // min-width: $active-width;
  // width: 100svw;
  display: flex;
  // justify-content: center;
  align-items: center;

}
</style>

<script>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import PageTransition from '@/components/PageTransition.vue'
import assasinIcon from '@/assets/images/classicons/assasin.png'
import dwarfIcon from '@/assets/images/classicons/dwarf.png'
import elfIcon from '@/assets/images/classicons/elf.png'
import gnomIcon from '@/assets/images/classicons/gnom.png'
import humanIcon from '@/assets/images/classicons/human.png'
import mageIcon from '@/assets/images/classicons/mage.png'
import warriorIcon from '@/assets/images/classicons/warrior.png'
import { API_BASE_URL } from '@/api/client'

export default {
  name: "LayoutComponent",
  components: {
    PageTransition
  },
  setup() {
    const userStore = useUserStore()

    userStore.fetchCurrentUser()

    const classIcons = {
      assasin: assasinIcon,
      dwarf: dwarfIcon,
      elf: elfIcon,
      gnom: gnomIcon,
      human: humanIcon,
      mage: mageIcon,
      warrior: warriorIcon
    }

    const userName = computed(() => userStore.user?.login)
    const time = computed(() => userStore.user?.created_at)
    const frame = computed(() => userStore.user?.frame)
    const avatar = computed(() => userStore.user?.avatar)

    const BASE_URL = API_BASE_URL;

    return {
      userName,
      frame,
      time,
      avatar,
      BASE_URL
    }
  },
  data() {
    return {
      selected: 'news',
      currentClass: 'warrior',
      headerItems: [
        {
          label: 'Play',
          path: 'play',
        },
        {
          label: 'News',
          path: 'news',
        },
        {
          label: 'Blacksmith',
          path: 'blacksmith',
        },
        {
          label: 'Shop',
          path: 'shop',
        },
        {
          label: 'Blackmarket',
          path: 'blackmarket',
        },
        {
          label: 'Inventory',
          path: 'inventory',
        },
        {
          label: 'Artifacts',
          path: 'artifacts',
        },
        {
          label: 'Skills',
          path: 'skills',
        },
        {
          label: 'Settings',
          path: 'settings',
        }
      ]
    }
  },
  methods: {
    handleNavigate(item) {
      this.selected = item.path
      this.$router.push(item.path)
    }
  }
}
</script>