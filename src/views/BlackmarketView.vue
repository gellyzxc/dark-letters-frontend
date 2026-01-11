<template>
  <div class="page blackmarket-view">
    <div class="main">
      <img src="@/assets/images/background/blackmarket.png" />
      <div class="chests">
        <div class="crate" @click="openCrate('legendary')">
          <img src="@/assets/images/crates/legendary.png" />
        </div>
        <div class="crate" @click="openCrate('mystical')">
          <img src="@/assets/images/crates/mystical.png" />
        </div>
        <div class="crate" @click="openCrate('wooden')">
          <img src="@/assets/images/crates/wooden.png" />
        </div>
      </div>
    </div>
  </div>
  <modal-component :open="showPreviewModal" @will-dismiss="showPreviewModal = false">
    <frame-component type="generic-big-squared-rounded" class="item-frame" style="max-width: 35svw !important;">
      <div class="crate-info-card" v-if="selectedCrate">
        <div class="crate-header">
          <div class="crate-name">{{ selectedCrate.name }} <span style="color: #7B7B7B">{{ selectedCrate.description
              }}</span></div>
          <div class="crate-description"></div>
          <div class="items-count">Items count {{ selectedCrate.drop_probabilities.items_count.min }}-{{
            selectedCrate.drop_probabilities.items_count.max }}</div>
        </div>
        <div class="probabilities-section">
          <div class="section-title">Avaliable drops</div>
          <div class="drop-list">
            <div class="drop-item" v-if="selectedCrate.drop_probabilities.drops.artifacts.length > 0">
              <span class="drop-name">+ artifacts {{
                getTotalArtifactChance(selectedCrate.drop_probabilities.drops.artifacts) }}%</span>
            </div>
            <div class="drop-item">
              <span class="drop-name">+ gold {{ selectedCrate.drop_probabilities.drops.gold.chance }}%</span>
            </div>
            <div class="drop-item" v-for="(itemType, typeName) in selectedCrate.drop_probabilities.drops.items"
              :key="typeName">
              <span class="drop-name">+ {{ typeName }} {{ itemType.total_chance }}%</span>
            </div>
          </div>
        </div>
        <div class="item-price-block" @click="purchaseItem">
          <span class="item-price">{{ selectedCrate.price }} gold</span>
        </div>
      </div>
    </frame-component>
  </modal-component>
  <modal-component :open="showRewardModal" @will-dismiss="showRewardModal = false">
    <div class="item-drop-animation" @click.stop>
      <div class="particles">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
      <frame-component type="generic-card-horizontal" class="item-frame">
        <item-info-card v-if="selectedItem" :item="selectedItem" variant="tooltip" :show-icon="true"
          :show-glow="true" />
      </frame-component>
    </div>
  </modal-component>
</template>
<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.page {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .main {
    margin-top: 2svh;
    max-height: 80svh;
    position: relative;

    img {
      max-height: 80svh;
    }

    .chests {
      position: absolute;
      display: flex;
      flex-direction: row;
      gap: 12vh;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);

      .crate {
        position: relative;
        cursor: pointer;
        transition: transform $transition-base;

        &:hover {
          transform: translateY(-8px);
        }

        &:active {
          transform: translateY(0) scale(0.95);
        }

        img {
          width: calc(80svw / 3 - 10svw);
          transition: all $transition-base;
        }
      }
    }
  }
}

.crate-info-card {
  background-color: black;
  position: relative;
  background: $color-bg-modal;
  padding: calc($spacing-lg + 0.5rem);
  height: calc(100% - 2 * calc($spacing-lg + 0.5rem)) !important;
  width: calc(100% - 2 * calc($spacing-lg + 0.5rem)) !important;
  display: flex;
  flex-direction: row;
  gap: $spacing-lg;
  color: $color-text-primary;

  .crate-header {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    width: 50%;

    .crate-name {
      font-size: $font-size-2xl;
      color: white;
      font-family: $font-family-primary;
    }

    .items-count {
      position: absolute;
      bottom: 2rem;
      left: 2rem;
      font-size: $font-size-2xl;
      font-family: $font-family-primary;
      margin-top: $spacing-xs;
    }
  }

  .probabilities-section {
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    width: 50%;

    .section-title {
      font-size: $font-size-2xl;
      color: white;
      font-family: $font-family-primary;
      margin-bottom: $spacing-sm;
    }

    .drop-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .drop-item {
        height: min-content;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        .drop-name {
          text-align: right;
          font-size: $font-size-2xl;
          color: #7B7B7B;
          font-family: $font-family-primary;
        }
      }
    }
  }

  .item-price-block {
    position: absolute;
    right: 2rem;
    bottom: 2rem;
    color: white;
    cursor: pointer;
    transition: all $transition-base;

    &:hover {
      transform: scale(1.02);
    }

    &:active {
      transform: scale(0.98);
    }

    .item-price {
      font-size: $font-size-2xl;
      font-family: $font-family-primary;
    }
  }
}

.preview-item-card {
  position: relative;
  width: 600px;
  height: 400px;
  background: $color-bg-overlay;
  border-radius: $radius-xl;
  box-shadow: $shadow-lg, 0 0 0 2px $color-brown-medium, 0 0 0 8px rgba($color-gold-primary, 0.08);
  padding: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  font-family: $font-family-primary;
  color: $color-text-primary;

  .glow {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    border-radius: 12px;
    opacity: 0.4;
    filter: blur(25px);
    z-index: -1;
  }

  .item-content-flex {
    display: flex;
    flex-direction: row;
    padding: $spacing-md;
    width: calc(100% - #{$spacing-xl});
    height: calc(100% - #{$spacing-xl});
    justify-content: space-between;
    align-items: flex-start;
    gap: $spacing-xl;
    position: relative;
  }

  .item-left {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    .item-name {
      font-size: $font-size-3xl;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      margin-bottom: $spacing-sm;
      letter-spacing: 0.01em;
      line-height: $line-height-tight;
      text-shadow: $shadow-md, $glow-gold-sm;
      font-family: $font-family-primary;
    }

    .item-description {
      font-size: $font-size-lg;
      color: $color-text-secondary;
      line-height: $line-height-normal;
      word-break: break-word;
      text-shadow: $shadow-sm;
    }
  }

  .item-right {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $spacing-md;
    height: 100%;

    .item-bonuses {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: $spacing-sm;
      margin-bottom: $spacing-md;

      .bonus-line {
        font-size: $font-size-lg;
        color: $color-text-primary;
        display: flex;
        gap: 0.5em;
        justify-content: flex-end;
        transition: color $transition-fast;

        &:hover {
          color: $color-gold-light;
        }

        .bonus-label {
          color: $color-text-secondary;
          min-width: 90px;
          text-align: right;
        }

        .bonus-value {
          color: $color-text-primary;
          font-weight: $font-weight-semibold;
        }
      }
    }

    .item-price-block {
      position: absolute;
      right: 0;
      bottom: 0;
      margin: 0 $spacing-lg $spacing-md 0;
      cursor: pointer;
      transition: all $transition-base;
      padding: $spacing-sm $spacing-md;
      border-radius: $radius-base;
      background: rgba($color-gold-primary, 0.1);

      &:hover {
        background: rgba($color-gold-primary, 0.2);
        transform: scale(1.05);
        box-shadow: $glow-gold-md;
      }

      &:active {
        transform: scale(0.98);
      }

      .item-price {
        font-size: $font-size-lg;
        color: $color-gold-primary;
        font-weight: $font-weight-semibold;
        text-align: right;
        letter-spacing: 0.02em;
      }
    }
  }
}

.item-drop-animation {
  position: relative;
  animation: itemAppear 0.8s ease-out;

  .particles {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;

    .particle {
      position: absolute;
      width: 6px;
      height: 6px;
      background: radial-gradient(circle, rgba($color-gold-primary, 0.9) 0%, rgba($color-gold-dark, 0) 70%);
      animation: particleExplosion 1.2s ease-out forwards;
      box-shadow: 0 0 4px rgba($color-gold-primary, 0.8);
    }
  }

  .item-frame {
    height: 500px;
  }
}

.glow-legendary {
  background: radial-gradient(circle, rgba($color-gold-primary, 0.6) 0%, rgba($color-gold-dark, 0) 70%);
}

.glow-mystical {
  background: radial-gradient(circle, rgba(138, 43, 226, 0.6) 0%, rgba(75, 0, 130, 0) 70%);
}

.glow-wooden {
  background: radial-gradient(circle, rgba($color-brown-medium, 0.6) 0%, rgba($color-brown-dark, 0) 70%);
}

@keyframes itemAppear {
  0% {
    transform: scale(0.3) translateY(-80px) rotate(-10deg);
    opacity: 0;
  }

  40% {
    transform: scale(1.15) translateY(15px) rotate(5deg);
    opacity: 1;
  }

  70% {
    transform: scale(0.95) translateY(-5px) rotate(-2deg);
  }

  100% {
    transform: scale(1) translateY(0) rotate(0deg);
    opacity: 1;
  }
}

@keyframes particleExplosion {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }

  20% {
    opacity: 1;
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(0) rotate(180deg);
    opacity: 0;
  }
}

@keyframes cardFloat {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  25% {
    transform: translateY(-6px) rotate(0.5deg);
  }

  75% {
    transform: translateY(-6px) rotate(-0.5deg);
  }
}

@keyframes iconBounce {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }

  50% {
    transform: scale(1.2) rotate(10deg);
  }

  70% {
    transform: scale(0.9) rotate(-5deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes medievalGlow {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}
</style>
<script>
import FrameComponent from "@/components/game/FrameComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import ItemInfoCard from "@/components/game/ItemInfoCard.vue";
import { useChestsStore } from "@/stores/chests";
import { transformApiItem } from "@/utils/itemHelpers";
const API_BASE_URL = 'http://147.45.253.24:5035/';
const BASE_URL = API_BASE_URL.replace('/api/v1', '');
export default {
  name: "BlackmarketView",
  components: { FrameComponent, ModalComponent, ItemInfoCard },
  data() {
    return {
      showPreviewModal: false,
      showRewardModal: false,
      selectedItem: null,
      currentCrateType: null,
      selectedCrate: null,
      chests: [],
      chestTypeMap: {}
    }
  },
  computed: {
    getImageUrl() {
      return (photoPath) => {
        if (!photoPath) return null;
        return `${BASE_URL}/${photoPath}`;
      };
    },
    getRarityFromType() {
      return (type) => {
        const rarityMap = {
          'amulet': 'mystical',
          'ring': 'mystical',
          'belt': 'common',
          'blade': 'rare',
          'blade_and_shield': 'legendary',
          'chest': 'common',
          'cloak': 'mystical',
          'mantle': 'mystical',
          'staff': 'legendary'
        };
        return rarityMap[type] || 'common';
      };
    }
  },
  methods: {
    async loadChests() {
      try {
        const chestsData = await this.chestsStore.fetchChests();
        this.chests = chestsData;
        this.chestTypeMap = {
          [chestsData[0]?.id]: 'wooden',
          [chestsData[1]?.id]: 'mystical',
          [chestsData[2]?.id]: 'legendary'
        };
      } catch (error) {
        console.error('Failed to load chests:', error);
      }
    },
    async openCrate(crateType) {
      if (this.showPreviewModal || this.showRewardModal) return;
      try {
        const chestId = Object.keys(this.chestTypeMap).find(id => this.chestTypeMap[id] === crateType);
        if (!chestId) {
          console.error('Chest not found for type:', crateType);
          return;
        }
        this.currentCrateType = crateType;
        const chestInfo = await this.chestsStore.fetchChestProbabilities(chestId);
        this.selectedCrate = chestInfo;
        this.showPreviewModal = true;
      } catch (error) {
        console.error('Failed to load chest info:', error);
      }
    },
    getItemTypeName(typeName) {
      const names = {
        blade: 'Клинок',
        chest: 'Доспех',
        mantle: 'Мантия',
        ring: 'Кольцо',
        staff: 'Посох',
        sword_shield: 'Меч и щит'
      };
      return names[typeName] || typeName;
    },
    getTotalArtifactChance(artifacts) {
      return artifacts.reduce((sum, artifact) => sum + artifact.chance, 0).toFixed(1);
    },
    getTotalItemsChance(items) {
      return Object.values(items).reduce((sum, item) => sum + item.total_chance, 0).toFixed(1);
    },
    async purchaseItem() {
      try {
        const chestId = this.selectedCrate.id;
        const result = await this.chestsStore.openChest(chestId);
        console.log('Chest opened:', result);
        if (result.items && result.items.length > 0) {
          const apiItem = result.items[0];
          this.selectedItem = {
            id: apiItem.id,
            name: apiItem.name,
            description: apiItem.description,
            photo: apiItem.photo,
            price: apiItem.price,
            type: apiItem.item_type,
            tier: apiItem.tier,
            stats: apiItem.stats?.map(stat => ({
              label: stat.visual_text.split(' to ')[1] || stat.visual_text,
              value: stat.visual_text.split(' to ')[0] || stat.visual_text
            })) || [],
            rarity: this.getRarityFromType(apiItem.item_type)
          };
        } else if (result.gold && result.gold > 0) {
          this.selectedItem = {
            icon: '💰',
            name: 'Золото',
            description: `Вы получили ${result.gold} золота`,
            stats: [],
            rarity: 'common'
          };
        } else if (result.artifacts && result.artifacts.length > 0) {
          const artifact = result.artifacts[0];
          this.selectedItem = {
            name: artifact.name || 'Артефакт',
            description: artifact.description || 'Редкий артефакт',
            stats: [],
            rarity: 'legendary'
          };
        }
        this.showPreviewModal = false;
        setTimeout(() => {
          this.showRewardModal = true;
        }, 300);
      } catch (error) {
        console.error('Failed to open chest:', error);
        this.showPreviewModal = false;
      }
    },
    getParticleStyle(index) {
      const angle = (index / 20) * Math.PI * 2;
      const distance = 150 + Math.random() * 100;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      return {
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
        animationDelay: `${Math.random() * 0.2}s`,
        left: '50%',
        top: '50%',
      };
    }
  },
  async mounted() {
    await this.loadChests();
    console.log('BlackmarketView mounted with chests data');
  },
  setup() {
    const chestsStore = useChestsStore();
    return { chestsStore };
  }
}
</script>