<template>
  <div class="character-select">
    <div class="header">
      <span v-if="currentStep === 'race'">Choose Race</span>
      <span v-else>Choose Class</span>
      <span
        v-if="currentStep === 'class' && selectedRace"
        class="back-button"
        @click="goBackToRace"
        >← Back to Race</span
      >
    </div>
    <Swiper
      v-if="currentStep === 'race'"
      :loop="true"
      :navigation="true"
      :modules="modules"
      class="swiper"
      @swiper="onSwiperInit"
      @slideChange="onSlideChange"
    >
      <SwiperSlide v-for="race in races" :key="race.id" class="slide">
        <div class="slide-content" :class="{ zoom: isZooming }">
          <div class="character-image">
            <img :src="API_BASE_URL + race.icon" :alt="race.name" />
          </div>
          <div class="character-details">
            <div class="character-name-top">{{ race.name }}</div>
            <div class="character-description">
              <p>{{ race.description }}</p>
              <div class="race-stats">
                <div class="stat">
                  <span class="stat-label">Strength:</span>
                  <span class="stat-value">{{ race.strength }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Agility:</span>
                  <span class="stat-value">{{ race.agility }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Intellect:</span>
                  <span class="stat-value">{{ race.intellect }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
    <div
      v-if="currentStep === 'race'"
      class="select-button"
      @click="selectCurrentRace()"
    >
      <span>Select Race</span>
    </div>
    <Swiper
      v-if="currentStep === 'class'"
      :loop="true"
      :navigation="true"
      :modules="modules"
      class="swiper"
      @swiper="onSwiperInit"
      @slideChange="onSlideChange"
    >
      <SwiperSlide
        v-for="character in characters"
        :key="character.name"
        class="slide"
      >
        <div class="slide-content">
          <div class="character-image">
            <img :src="API_BASE_URL + character.image" :alt="character.name" />
          </div>
          <div class="character-details">
            <div class="character-name-top">{{ character.name }}</div>
            <div class="character-description">
              <p>{{ character.description }}</p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
    <div
      v-if="currentStep === 'class'"
      class="select-button"
      @click="selectCurrentCharacter()"
    >
      <span>Select Class</span>
    </div>
    <ModalComponent
      :open="showRaceConfirmModal"
      @willDismiss="showRaceConfirmModal = false"
    >
      <FrameComponent type="generic-card-horizontal" class="modal-frame">
        <div class="confirm-content">
          <h3>Confirm Race Selection</h3>
          <p>
            Are you sure you want to choose
            <strong>{{ tempSelectedRace?.name }}</strong> as your race?
          </p>
          <div class="buttons">
            <span @click="confirmRaceSelection" class="btn yes">Yes</span>
            <span @click="showRaceConfirmModal = false" class="btn no">No</span>
          </div>
        </div>
      </FrameComponent>
    </ModalComponent>
    <ModalComponent
      :open="showConfirmModal"
      @willDismiss="showConfirmModal = false"
    >
      <FrameComponent type="generic-card-horizontal" class="modal-frame">
        <div class="confirm-content">
          <h3>Confirm Class Selection</h3>
          <p>
            Are you sure you want to choose
            <strong>{{ selectedCharacter?.name }}</strong> as your class?
          </p>
          <div class="buttons">
            <span @click="confirmSelection" class="btn yes">Yes</span>
            <span @click="showConfirmModal = false" class="btn no">No</span>
          </div>
        </div>
      </FrameComponent>
    </ModalComponent>
  </div>
</template>
<style scoped lang="scss">
@use "@/assets/styles/variables" as *;
.character-select {
  height: 100vh;
  width: 100vw;
  position: relative;
}
.header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 3rem;
  display: flex;
  align-items: center;
  gap: $spacing-xl;
  background-color: transparent;
  padding: $spacing-md;
  span {
    font-weight: $font-weight-normal;
    font-size: $font-size-3xl;
    line-height: $line-height-tight;
    color: $color-text-brown;
    font-family: $font-family-primary;
  }
  .back-button {
    cursor: pointer;
    color: white;
    font-size: $font-size-2xl;
    transition:
      color $transition-base,
      transform $transition-fast;
    font-family: $font-family-primary;
    &:hover {
      color: $color-gold-dark;
      transform: translateX(-4px);
    }
    &:active {
      transform: translateX(0) scale(0.98);
    }
  }
}
.swiper {
  height: 100%;
  width: 100%;
  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    color: $color-text-primary;
    width: 35px;
    height: 35px;
    background: $color-bg-overlay;
    border-radius: 50%;
    transition: all $transition-base;
    &:after {
      font-size: $font-size-sm;
      font-weight: $font-weight-bold;
    }
    &:hover {
      background: rgba($color-text-primary, 0.2);
      box-shadow: $glow-gold-md;
      transform: scale(1.1);
    }
    &:active {
      transform: scale(0.95);
    }
  }
  :deep(.swiper-button-prev) {
    left: $spacing-xl;
  }
  :deep(.swiper-button-next) {
    right: $spacing-xl;
  }
}
.slide {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl $spacing-3xl 8rem $spacing-3xl;
  background: linear-gradient(
    to bottom,
    rgba($color-bg-base, 0.8),
    rgba($color-bg-base, 0.95)
  );
}
.slide-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: $spacing-3xl;
  max-width: 1400px;
  width: 100%;
  transition: transform $transition-slow;
  &.zoom {
    transform: scale(3);
  }
  .character-image {
    flex-shrink: 0;
    width: 450px;
    height: 650px;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow($glow-gold-md);
    transition: filter $transition-base;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .character-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-2xl;
    padding: $spacing-xl 0;
    .character-name-top {
      font-size: $font-size-5xl;
      font-weight: $font-weight-bold;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      text-shadow: $glow-gold-md;
      line-height: $line-height-tight;
      margin-bottom: $spacing-md;
      font-family: $font-family-primary;
    }
    .character-description {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      max-width: 600px;
      gap: $spacing-lg;
      p {
        font-size: $font-size-xl;
        line-height: $line-height-relaxed;
        color: $color-text-secondary;
        margin: 0;
        text-align: left;
        font-family: $font-family-primary;
      }
      .race-stats {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
        margin-top: $spacing-md;
        .stat {
          display: flex;
          align-items: center;
          gap: $spacing-md;
          transition: transform $transition-fast;
          &:hover {
            transform: translateX(4px);
          }
          .stat-label {
            font-size: $font-size-lg;
            color: white;
            font-weight: $font-weight-semibold;
            min-width: 100px;
            font-family: $font-family-primary;
          }
          .stat-value {
            font-size: $font-size-xl;
            color: $color-text-primary;
            font-weight: $font-weight-bold;
            font-family: $font-family-primary;
          }
        }
      }
    }
    .character-name-bottom {
      font-size: $font-size-5xl;
      font-weight: $font-weight-bold;
      color: $color-gold-primary;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      text-shadow: $glow-gold-md;
      line-height: $line-height-tight;
      text-align: right;
      margin-top: $spacing-md;
      font-family: $font-family-primary;
    }
  }
}
.select-button {
  position: fixed;
  top: 90svh;
  left: 50vw;
  transform: translateX(-50%);
  cursor: pointer;
  padding: $spacing-md $spacing-3xl;
  border: 2px solid rgba(white, 0.6);
  border-radius: $radius-xs;
  transition: all $transition-base;
  backdrop-filter: blur(5px);
  z-index: 100;
  span {
    font-size: $font-size-lg;
    color: white;
    font-weight: $font-weight-bold;
    font-family: $font-family-primary;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  &:hover {
    background: linear-gradient(
      135deg,
      rgba(white, 0.25) 0%,
      rgba(white, 0.35) 100%
    );
    border-color: rgba(white, 0.8);
    transform: translateX(-50%) translateY(-2px);
    box-shadow: $shadow-md, $glow-gold-lg;
  }
  &:active {
    transform: translateX(-50%) translateY(0) scale(0.98);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateX(-50%);
  }
}
.modal-frame {
  width: 20svw;
}
.confirm-content {
  background-color: black;
  height: calc(100% - 20px) !important;
  width: calc(100% - 20px) !important;
  padding: 10px;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
  }
  p {
    margin: 0 0 15px 0;
    font-size: 14px;
  }
  .buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    .btn {
      cursor: pointer;
      font-weight: 700;
      font-size: 16px;
      transition: color 0.3s;
      &.yes {
        color: #ff4444;
        &:hover {
          color: #cc3333;
        }
      }
      &.no {
        color: #7b7b7b;
        &:hover {
          color: #5a5a5a;
        }
      }
    }
  }
}
</style>
<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import FrameComponent from "@/components/game/FrameComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { useStaticStore } from "@/stores/static";
import mageImage from "@/assets/images/game-characters/mage.png";
import { API_BASE_URL } from "@/api/client";
export default {
  name: "CharacterSelectView",
  components: {
    Swiper,
    SwiperSlide,
    FrameComponent,
    ModalComponent,
  },
  data() {
    return {
      API_BASE_URL,
      modules: [Navigation],
      currentStep: "race",
      showRaceConfirmModal: false,
      showConfirmModal: false,
      tempSelectedRace: null,
      selectedRace: null,
      selectedCharacter: null,
      isZooming: false,
      mageImage: mageImage,
      swiperInstance: null,
      currentSlideIndex: 0,
    };
  },
  computed: {
    races() {
      return this.staticStore.races || [];
    },
    characters() {
      return (this.staticStore.classes || []).map((cls) => ({
        id: cls.id,
        name: cls.name,
        description: cls.description,
        image: cls.icon,
        tree_json: cls.tree_json,
      }));
    },
  },
  async mounted() {
    await this.staticStore.fetchAll();
  },
  setup() {
    const staticStore = useStaticStore();
    return { staticStore };
  },
  methods: {
    onSwiperInit(swiper) {
      this.swiperInstance = swiper;
      this.currentSlideIndex = swiper.realIndex;
    },
    onSlideChange(swiper) {
      this.currentSlideIndex = swiper.realIndex;
    },
    selectCurrentRace() {
      const race = this.races[this.currentSlideIndex];
      this.selectRace(race);
    },
    selectCurrentCharacter() {
      const character = this.characters[this.currentSlideIndex];
      this.selectCharacter(character);
    },
    selectRace(race) {
      this.tempSelectedRace = race;
      this.showRaceConfirmModal = true;
    },
    confirmRaceSelection() {
      this.selectedRace = this.tempSelectedRace;
      this.showRaceConfirmModal = false;
      this.currentStep = "class";
      this.currentSlideIndex = 0;
    },
    goBackToRace() {
      this.currentStep = "race";
      this.selectedCharacter = null;
      this.currentSlideIndex = 0;
    },
    selectCharacter(character) {
      this.selectedCharacter = character;
      this.showConfirmModal = true;
    },
    async confirmSelection() {
      this.showConfirmModal = false;
      this.isZooming = true;
      console.log("Selected Race:", this.selectedRace);
      console.log("Selected Class:", this.selectedCharacter);
      await this.createCharacter();
      setTimeout(() => {
        this.$router.push("/news");
      }, 500);
    },
    async createCharacter() {
      try {
        const { useCharacterStore } = await import("@/stores/character");
        const characterStore = useCharacterStore();
        console.clear();
        console.log(this.selectedCharacter, this.selectedRace);
        const result = await characterStore.createCharacter(
          this.selectedCharacter.id,
          this.selectedRace.id,
        );
        console.log("Character created successfully:", result);
      } catch (error) {
        console.error("Failed to create character:", error);
        this.$toast.show("Failed to create character. Please try again.");
      }
    },
  },
};
</script>
