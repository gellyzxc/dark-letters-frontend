<template>
  <div class="page play-view">
    <div class="grid">
      <frame-component v-for="n in news" class="frame" @click="() => { open = true; openedNews = n }">
        <div class="news">
          <img src="@/assets/images/cards/news.png" />
          <div class="data">
            <div class="content">
              <span>{{ n.name }}
                <br>
                {{ n.description.slice(0, 100) }}{{ n.description.length > 100 ? '...' : '' }}
              </span>
            </div>
            <div class="bottom">
              <span>{{ n.is_news ? 'NEWS' : 'PATCH' }}</span>
              <span style="margin-left: -1rem;">{{ dayjs(n.publication_date).format('DD.MM.YYYY') }}</span>
            </div>
          </div>
        </div>
      </frame-component>
    </div>
  </div>
  <modal-component :open="open" @will-dismiss="open = false">
    <frame-component type="generic-big-squared-rounded" style="transform: scale(0.98)">
      <div class="game-modal">
        <img src="@/assets/images/background/test-game.png" class="top" />
        <div class="text">
          <span>
            {{ openedNews.name }}
            <br />
            {{ openedNews.description }}
          </span>
        </div>
      </div>
    </frame-component>
  </modal-component>
  <div class="bg" />
</template>
<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.bg {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: url("@/assets/images/background/play.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.play-view {
  position: absolute;
  top: 4rem;

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;
    width: 100svw;

    .news {
      background-color: $color-bg-base;
      display: flex;
      flex-direction: row;
      gap: $spacing-md;
      justify-content: space-around;
      align-items: center;
      transition: all $transition-base;
      cursor: pointer;

      &:hover {
        background-color: $color-bg-elevated;
        box-shadow: $shadow-md, $glow-gold-sm;
      }

      img {
        height: 100%;
        transition: transform $transition-base;
      }

      &:hover img {
        transform: scale(1.02);
      }

      span {
        width: 50%;
        font-weight: $font-weight-normal;
        font-size: $font-size-2xl;
        line-height: $line-height-tight;
        text-align: center;
        color: $color-text-primary;
        font-family: $font-family-primary;
      }

      .data {
        padding: $spacing-md;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: calc(100% - #{$spacing-xl});
        width: calc(100% - #{$spacing-xl});

        .content {
          span {
            line-height: $line-height-normal;
          }
        }

        .bottom {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          span {
            width: fit-content;
            font-size: $font-size-base;
            color: $color-text-disabled;
            font-weight: $font-weight-semibold;
            font-family: $font-family-primary;
          }
        }
      }
    }
  }
}

.game-modal {
  background-color: $color-bg-base;
  position: relative;

  .start {
    position: absolute;
    cursor: pointer;
    z-index: 100;
    bottom: $spacing-md;
    right: $spacing-xl;
    font-size: $font-size-lg;
    color: $color-gold-primary;
    font-weight: $font-weight-bold;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-base;
    background: rgba($color-gold-primary, 0.1);
    border: 2px solid $color-gold-primary;
    transition: all $transition-base;
    font-family: $font-family-display;
    letter-spacing: 0.1em;

    &:hover {
      background: rgba($color-gold-primary, 0.2);
      box-shadow: $glow-gold-md;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0) scale(0.98);
    }
  }

  img {
    width: 100%;
    height: 200px;
    object-position: top;
    object-fit: cover;
  }

  .text {
    z-index: 100;
    padding: $spacing-md $spacing-xl 0 $spacing-md;
    display: flex;
    flex-direction: row;
    gap: $spacing-md;

    span {
      width: 98%;
      font-weight: $font-weight-normal;
      font-size: $font-size-2xl;
      color: $color-text-primary;
      line-height: $line-height-normal;
      font-family: $font-family-primary;
    }
  }
}
</style>
<script>
import FrameComponent from "@/components/game/FrameComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { useAuthStore } from "@/stores/auth";
import { useNewsStore } from "@/stores/news";
import dayjs from "dayjs";
export default {
  name: "PlayView",
  components: { ModalComponent, FrameComponent },
  data() {
    return {
      open: false,
      news: [],
      openedNews: {},
    };
  },
  methods: {
    dayjs,
  },
  async mounted() {
    if (!this.authStore.isAuthenticated) {
      this.$router.push('/login')
    }
    this.news = this.newsStore.sortedNews;
    this.news = await this.newsStore.fetchNews();
  },
  setup() {
    const authStore = useAuthStore()
    const newsStore = useNewsStore();
    return {
      newsStore, authStore
    };
  }
};
</script>
