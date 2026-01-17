<template>
  <div class="page play-view">
    <div class="grid">
      <frame-component
        v-for="n in news"
        class="frame"
        @click="
          () => {
            open = true;
            openedNews = n;
          }
        "
      >
        <div class="news">
          <img src="@/assets/images/cards/news.png" v-if="n.is_news" />
          <img src="@/assets/images/cards/patch.png" v-else />
          <div class="data">
            <div class="content">
              <span
                >{{ n.name }}
                <span style="color: #7b7b7b">
                  {{ n.description.slice(0, 100)
                  }}{{ n.description.length > 100 ? "..." : "" }}</span
                >
              </span>
            </div>
            <div class="bottom">
              <span>{{ n.is_news ? "NEWS" : "PATCH" }}</span>
              <span style="margin-left: -1rem">{{
                dayjs(n.publication_date).format("DD.MM.YYYY")
              }}</span>
            </div>
          </div>
        </div>
      </frame-component>
    </div>
  </div>
  <modal-component :open="open" @will-dismiss="open = false">
    <frame-component
      type="generic-big-squared-rounded"
      style="transform: scale(0.98)"
    >
      <div class="game-modal">
        <div class="image">
          <img src="@/assets/images/cards/news.png" v-if="openedNews.is_news" />
          <img src="@/assets/images/cards/patch.png" v-else />
        </div>
        <div class="text">
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <span>{{ openedNews.is_news ? "NEWS" : "PATCH" }}</span>
            <span>{{
              dayjs(openedNews.publication_date).format("DD.MM.YYYY")
            }}</span>
          </div>
          <span>
            {{ openedNews.name }}
          </span>
          <div class="description" v-html="renderedDescription"></div>
        </div>
      </div>
    </frame-component>
  </modal-component>
  <div class="bg" />
</template>
<style scoped lang="scss">
@use "@/assets/styles/variables" as *;
.bg {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: url("@/assets/images/background/play.png") no-repeat center center
    fixed;
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
    width: calc(100svw - 2rem);
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
            font-weight: 400;
            font-family: $font-family-primary;
          }
        }
      }
    }
  }
}
.game-modal {
  padding: 1.5rem $spacing-xl 3rem $spacing-xl;
  width: calc(100% - 4rem) !important;
  height: calc(100% - 4.5rem) !important;
  background-color: $color-bg-base;
  position: relative;
  .image {
    width: fit-content;
    height: 20rem;
    float: left;
    margin-right: 1.5rem;
    margin-bottom: 1rem;
    img {
      height: 100%;
      width: auto;
      display: block;
    }
  }
  .text {
    padding-top: 1rem;
    z-index: 100;
    span {
      font-weight: $font-weight-normal;
      font-size: $font-size-2xl;
      color: $color-text-primary;
      line-height: $line-height-normal;
      font-family: $font-family-primary;
    }
    .description {
      margin-top: 1rem;
      font-weight: $font-weight-normal;
      font-size: $font-size-2xl;
      color: $color-text-primary;
      line-height: $line-height-normal;
      font-family: $font-family-primary;
      :deep(h1),
      :deep(h2),
      :deep(h3) {
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        font-weight: $font-weight-bold;
      }
      :deep(p) {
        margin-bottom: 0.5rem;
      }
      :deep(ul),
      :deep(ol) {
        margin-left: 1.5rem;
        margin-bottom: 0.5rem;
      }
      :deep(code) {
        background-color: rgba(255, 255, 255, 0.1);
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
      }
      :deep(pre) {
        background-color: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin-bottom: 0.5rem;
      }
      :deep(a) {
        color: #ffd700;
        text-decoration: underline;
      }
    }
  }
}
</style>
<script>
import FrameComponent from "@/components/game/FrameComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { useAuthStore } from "@/stores/auth";
import { useCharacterStore } from "@/stores/character";
import { useNewsStore } from "@/stores/news";
import dayjs from "dayjs";
import { marked } from "marked";
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
  computed: {
    renderedDescription() {
      return this.openedNews.description
        ? marked(this.openedNews.description)
        : "";
    },
  },
  methods: {
    dayjs,
  },
  async mounted() {
    this.characterStore.fetchCharacter().catch(() => {
      this.$router.push("/character-select");
    });
    if (!this.authStore.isAuthenticated) {
      this.$router.push("/login");
    }
    this.news = this.newsStore.sortedNews;
    this.news = await this.newsStore.fetchNews();
  },
  setup() {
    const characterStore = useCharacterStore();
    const authStore = useAuthStore();
    const newsStore = useNewsStore();
    return {
      newsStore,
      authStore,
      characterStore,
    };
  },
};
</script>
