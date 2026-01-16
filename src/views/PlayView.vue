<template>
  <div class="page play-view">
    <div class="grid">
      <frame-component v-for="game in games" class="frame" :class="game.name" @click="() => openGameModal(game)">
        <div class="game">
          <span>
            {{ game.description }}
          </span>
          <div class="image">
            <img :src="game.image" />
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
            {{ selectedGame?.name.toUpperCase() }}
          </span>
          <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start; gap: 0.5rem">
            <div class="markdown-content" style="color: #464040; width: 50%;" v-html="renderedDescription"></div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; width: 50%">
              <span style="text-align: right; width: min-content; white-space: nowrap;">Map info</span>
              <br>
              <div class="markdown-content" style="color: #464040; text-align: right;" v-html="renderedMechanics"></div>
            </div>
          </div>
        </div>
        <span class="start" @click="startGame">
          START
        </span>
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

    .game {
      width: calc(100%);
      gap: $spacing-sm;
      background-color: $color-bg-base;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      transition: all $transition-base;
      cursor: pointer;

      span {
        font-weight: 400;
        font-style: Regular;
        font-size: 1.8rem;
        line-height: 100%;
        letter-spacing: 0%;
        text-align: center;

        width: 40%;
        font-weight: $font-weight-normal;
        line-height: $line-height-tight;
        text-align: center;
        color: $color-text-primary;
        font-family: $font-family-primary;
      }

      .image {
        transition: transform $transition-base;
      }

      &:hover .image {
        transform: scale(1.05);
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
    color: white;
    font-weight: $font-weight-bold;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-base;
    transition: all $transition-base;
    letter-spacing: 0.1em;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
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
    flex-direction: column;
    gap: $spacing-md;

    span {
      width: 100%;
      font-size: 1.3rem;
      color: $color-text-primary;
      line-height: $line-height-normal;
      font-family: $font-family-primary;
    }

    .markdown-content {
      font-size: 1.3rem;
      color: $color-text-primary;
      line-height: $line-height-normal;
      font-family: $font-family-primary;

      :deep(h1), :deep(h2), :deep(h3) {
        margin-top: 0.5rem;
        margin-bottom: 0.3rem;
        font-weight: $font-weight-bold;
      }

      :deep(p) {
        margin-bottom: 0.3rem;
      }

      :deep(ul), :deep(ol) {
        margin-left: 1.5rem;
        margin-bottom: 0.3rem;
      }

      :deep(code) {
        background-color: rgba(255, 255, 255, 0.1);
        padding: 0.1rem 0.3rem;
        border-radius: 0.2rem;
      }

      :deep(pre) {
        background-color: rgba(255, 255, 255, 0.1);
        padding: 0.5rem;
        border-radius: 0.3rem;
        overflow-x: auto;
        margin-bottom: 0.3rem;
      }

      :deep(a) {
        color: #FFD700;
        text-decoration: underline;
      }

      :deep(strong) {
        font-weight: $font-weight-bold;
      }

      :deep(em) {
        font-style: italic;
      }
    }

    .game-info {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: $spacing-xs $spacing-sm;
        background: rgba(255, 255, 255, 0.05);
        border-radius: $radius-sm;

        .label {
          font-size: $font-size-base;
          color: $color-text-secondary;
          font-weight: $font-weight-semibold;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .value {
          font-size: $font-size-base;
          color: $color-gold-primary;
          font-weight: $font-weight-bold;
          text-transform: capitalize;
        }
      }
    }
  }
}
</style>
<script>
import { useGameStore } from '@/stores/game'
import FrameComponent from "@/components/game/FrameComponent.vue"
import ModalComponent from "@/components/ModalComponent.vue"
import { marked } from 'marked'
import pic1 from "@/assets/images/background/play/1.png"
import pic2 from "@/assets/images/background/play/2.png"
import pic3 from "@/assets/images/background/play/3.png"
import pic4 from "@/assets/images/background/play/4.png"
export default {
  name: "PlayView",
  components: { ModalComponent, FrameComponent },
  data() {
    return {
      games: [],
      open: false,
      selectedGame: null,
      gameImages: {
        'training': pic1,
        'dangeon': pic2,
        'story': pic3,
        'boss': pic4,
      }
    }
  },
  computed: {
    renderedDescription() {
      if (!this.selectedGame?.description) return '';
      const text = this.selectedGame.description
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
      return marked(text, { breaks: true });
    },
    renderedMechanics() {
      if (!this.selectedGame?.mechanics) return '';
      const text = this.selectedGame.mechanics
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
      return marked(text, { breaks: true });
    }
  },
  methods: {
    openGameModal(game) {
      this.selectedGame = game
      this.open = true
    },
    getGameImage(gameName) {
      return this.gameImages[gameName]
    },
    startGame() {
      if (this.selectedGame) {
        this.$router.push(`/game/${this.selectedGame.id}?name=${this.selectedGame.name}&time=${this.selectedGame.time}`)
      }
    }
  },
  async mounted() {
    try {
      await this.gameStore.fetchGameTypes()
      this.games = this.gameStore.gameTypes
        .map(game => ({
          ...game,
          image: this.getGameImage(game.name)
        }))
    } catch (error) {
      console.error('Failed to load game types:', error)
    }
  },
  setup() {
    const gameStore = useGameStore()
    return { gameStore }
  }
}
</script>
