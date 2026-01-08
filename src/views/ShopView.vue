<template>
  <div class="page blacksmith-view">
    <div class="image">
      <div class="items-col col-1">
        <div class="item" v-for="(item, index) in shopItems.slice(0, 2)" :key="'col1-' + index" @click="openItem(item)">
          <frame-component class="main-frame" type="shop-frame">
            <img v-if="item.photo" :src="getImageUrl(item.photo)" :alt="item.name" class="shop-item-image" />
          </frame-component>
        </div>
      </div>
      <div class="items-col col-2">
        <div class="item" v-for="(item, index) in shopItems.slice(2, 4)" :key="'col2-' + index" @click="openItem(item)">
          <frame-component class="main-frame" type="shop-frame">
            <img v-if="item.photo" :src="getImageUrl(item.photo)" :alt="item.name" class="shop-item-image" />
          </frame-component>
        </div>
      </div>
      <img src="@/assets/images/background/shop.png" />
    </div>
  </div>
  <modal-component :open="showPreviewModal" @will-dismiss="showPreviewModal = false">
    <frame-component class="item-frame" style="max-width: 40svw;">
      <div class="item-card preview-item-card" v-if="selectedItem">
        <div class="glow" :class="`glow-${selectedItem.rarity}`"></div>
        <div class="item-content-flex">
          <div class="item-left">
            <div class="item-name">{{ selectedItem.name }}</div>
            <div class="item-description">{{ selectedItem.description || 'No description.' }}</div>
          </div>
          <div class="item-right">
            <div class="item-bonuses">
              <div v-for="stat in selectedItem.stats" :key="stat.label" class="bonus-line">
                <span class="bonus-label">{{ stat.label }}</span>
                <span class="bonus-value">{{ stat.value }}</span>
              </div>
            </div>
            <div v-if="selectedItem.price" class="item-price-block" @click="purchaseItem">
              <span class="item-price">{{ selectedItem.price }} gold</span>
            </div>
          </div>
        </div>
      </div>
    </frame-component>
  </modal-component>
  <modal-component :open="showRewardModal" @will-dismiss="showRewardModal = false">
    <div class="item-drop-animation" @click.stop style="max-width: 40svw !important;">
      <div class="particles">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
      <frame-component class="item-frame">
        <div class="item-card reward-item-card" v-if="selectedItem">
          <div class="glow" :class="`glow-${selectedItem.rarity}`"></div>
          <div class="item-icon">
            <img v-if="selectedItem.photo" :src="getImageUrl(selectedItem.photo)" :alt="selectedItem.name" />
            <span v-else>{{ selectedItem.icon || '📦' }}</span>
          </div>
          <div class="item-content-flex">
            <div class="item-left">
              <div class="item-name">{{ selectedItem.name }}</div>
              <div class="item-description">{{ selectedItem.description || 'No description.' }}</div>
            </div>
            <div class="item-right">
              <div class="item-bonuses">
                <div v-for="stat in selectedItem.stats" :key="stat.label" class="bonus-line">
                  <span class="bonus-label">{{ stat.label }}</span>
                  <span class="bonus-value">{{ stat.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </frame-component>
    </div>
  </modal-component>
</template>
<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.page {
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  position: relative;
  height: 100%;
  width: 100%;
  max-height: 1080px;
  max-width: 1920px;
  justify-content: center;

  .image {
    padding-bottom: 40px;
    height: min(90vh, 972px);
    position: relative;

    img {
      max-height: min(90vh, 972px);
      height: 100%;
    }

    .items-col {
      &.col-1 {
        left: 12%;
      }

      &.col-2 {
        right: 12%;
      }

      &.col-1,
      &.col-2 {
        bottom: 50%;
        transform: translateY(50%);

        .item {
          position: relative;

          &:hover {
            .hover-frame {
              opacity: 1;
            }
          }

          .hover-frame {
            transition: all 0.2s ease-in-out;
            opacity: 0;
            z-index: 1000;
            position: absolute;
            bottom: -5%;
            width: 190%;
            left: -45%;

            .frame-content {
              background: black;
              height: 100%;
              width: 100%;
            }
          }
        }
      }

      display: flex;
      flex-direction: column;
      gap: 2rem;
      position: absolute;

      .main-frame {
        height: 210px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;

        &:hover {
          transform: scale(1.05);
        }

        .shop-item-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.new-item-card {
  position: relative;
  --item-padding: 0.4rem;
  width: calc(100% - 2 * var(--item-padding));
  height: calc(100% - 2 * var(--item-padding));
  background: rgba(0, 0, 0, 0.85);
  border-radius: 10px;
  box-shadow: 0 0 10px 2px #1a1310, 0 0 0 1px #3a2a1a, 0 0 0 3px rgba(212, 175, 55, 0.08);
  padding: var(--item-padding);
  display: flex;
  align-items: stretch;
  justify-content: center;
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
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    position: relative;
    padding: 0;
  }

  .item-left {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    .item-name {
      font-size: 0.95rem;
      font-weight: 600;
      color: $color-text-primary;
      margin-bottom: 0.2rem;
      letter-spacing: 0.01em;
      line-height: 1.2;
      text-shadow: 0 1px 2px #000, 0 0 1px #d4af37;
    }

    .item-description {
      font-size: 0.72rem;
      color: $color-text-secondary;
      line-height: 1.3;
      word-break: break-word;
      text-shadow: 0 1px 2px #000;
    }
  }

  .item-right {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.4rem;
    height: 100%;

    .item-bonuses {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.2rem;
      margin-bottom: 0.4rem;

      .bonus-line {
        font-size: 0.75rem;
        color: #e0d8c0;
        display: flex;
        gap: 0.3em;
        justify-content: flex-end;

        .bonus-label {
          color: $color-text-secondary;
          min-width: 60px;
          text-align: right;
        }

        .bonus-value {
          color: $color-text-primary;
          font-weight: 600;
        }
      }
    }

    .item-price-block {
      position: absolute;
      right: 0;
      bottom: 0;
      margin: 0 0.5rem 0.4rem 0;

      .item-price {
        font-size: 0.85rem;
        color: #e0d8c0;
        font-weight: 600;
        text-align: right;
        letter-spacing: 0.02em;
      }
    }
  }
}

.preview-item-card {
  position: relative;
  width: 600px;
  height: 400px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 18px;
  box-shadow: 0 0 24px 4px #1a1310, 0 0 0 2px #3a2a1a, 0 0 0 8px rgba(212, 175, 55, 0.08);
  padding: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  font-family: 'JetBrains Mono', 'Fira Mono', 'Consolas', monospace;
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
    padding: 1rem;
    width: calc(100% - 2rem);
    height: calc(100% - 2rem);
    justify-content: space-between;
    align-items: flex-start;
    gap: 2.5rem;
    position: relative;
  }

  .item-left {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    .item-name {
      font-size: 2rem;
      font-weight: 600;
      color: $color-text-primary;
      margin-bottom: 0.5rem;
      letter-spacing: 0.01em;
      line-height: 1.2;
      text-shadow: 0 2px 8px #000, 0 0 2px #d4af37;
    }

    .item-description {
      font-size: 1.1rem;
      color: $color-text-secondary;
      line-height: 1.5;
      word-break: break-word;
      text-shadow: 0 1px 2px #000;
    }
  }

  .item-right {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1.2rem;
    height: 100%;

    .item-bonuses {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
      margin-bottom: 1.2rem;

      .bonus-line {
        font-size: 1.1rem;
        color: $color-text-primary;
        display: flex;
        gap: 0.5em;
        justify-content: flex-end;

        .bonus-label {
          color: $color-text-secondary;
          min-width: 90px;
          text-align: right;
        }

        .bonus-value {
          color: $color-text-primary;
          font-weight: 600;
        }
      }
    }

    .item-price-block {
      position: absolute;
      right: 0;
      bottom: 0;
      margin: 0 1.5rem 1.2rem 0;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      background: rgba(212, 175, 55, 0.1);

      &:hover {
        background: rgba(212, 175, 55, 0.2);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.98);
      }

      .item-price {
        font-size: 1.2rem;
        color: #d4af37;
        font-weight: 600;
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
      background: radial-gradient(circle, rgba(218, 165, 32, 0.9) 0%, rgba(184, 134, 11, 0) 70%);
      animation: particleExplosion 1.2s ease-out forwards;
      box-shadow: 0 0 4px rgba(218, 165, 32, 0.8);
    }
  }
}

.reward-item-card {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 18px;
  box-shadow: 0 0 24px 4px #1a1310, 0 0 0 2px #3a2a1a, 0 0 0 8px white;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-family: 'JetBrains Mono', 'Fira Mono', 'Consolas', monospace;
  color: $color-text-primary;
  overflow: hidden;

  .glow {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    opacity: 0.4;
    filter: blur(25px);
    z-index: -1;
    animation: medievalGlow 2s ease-in-out infinite;
  }

  .item-icon {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    animation: iconBounce 1s ease-out;
    filter: drop-shadow(0 2px 12px white);
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      font-size: 6rem;
    }

    img {
      width: 150px;
      height: 150px;
      object-fit: contain;
    }
  }

  .item-content-flex {
    display: flex;
    flex-direction: row;
    padding: 0.8rem;
    width: calc(100% - 1.6rem);
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    position: relative;
  }

  .item-left {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    .item-name {
      font-size: 1.5rem;
      font-weight: 600;
      color: $color-text-primary;
      margin-bottom: 0.3rem;
      letter-spacing: 0.01em;
      line-height: 1.2;
      text-shadow: 0 2px 8px #000, 0 0 2px #d4af37;
    }

    .item-description {
      font-size: 0.9rem;
      color: $color-text-secondary;
      line-height: 1.4;
      word-break: break-word;
      text-shadow: 0 1px 2px #000;
    }
  }

  .item-right {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.6rem;

    .item-bonuses {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.3rem;

      .bonus-line {
        font-size: 0.95rem;
        color: $color-text-primary;
        display: flex;
        gap: 0.5em;
        justify-content: flex-end;

        .bonus-label {
          color: $color-text-secondary;
          min-width: 90px;
          text-align: right;
        }

        .bonus-value {
          color: $color-text-primary;
          font-weight: 600;
        }
      }
    }
  }
}

.glow-legendary {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 140, 0, 0) 70%);
}

.glow-mystical {
  background: radial-gradient(circle, rgba(138, 43, 226, 0.6) 0%, rgba(75, 0, 130, 0) 70%);
}

.glow-rare {
  background: radial-gradient(circle, rgba(0, 112, 221, 0.6) 0%, rgba(0, 68, 136, 0) 70%);
}

.glow-common {
  background: radial-gradient(circle, rgba(155, 155, 155, 0.6) 0%, rgba(100, 100, 100, 0) 70%);
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
import { useInventoryStore } from "@/stores/inventory";
import { transformApiItem } from "@/utils/itemHelpers";
const API_BASE_URL = 'http://147.45.253.24:5035/';
const BASE_URL = API_BASE_URL.replace('/api/v1', '');
export default {
  name: "ShopView",
  components: { ModalComponent, FrameComponent },
  data() {
    return {
      showPreviewModal: false,
      showRewardModal: false,
      selectedItem: null,
      shopItems: []
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
    async loadShopItems() {
      try {
        const items = await this.inventoryStore.fetchShopItems();
        this.shopItems = items.map(apiItem => {
          const transformed = transformApiItem(apiItem);
          return {
            ...transformed,
            rarity: this.getRarityFromType(transformed.type)
          };
        });
      } catch (error) {
        console.error('Failed to load shop items:', error);
      }
    },
    openItem(item) {
      if (this.showPreviewModal || this.showRewardModal) return;
      this.selectedItem = item;
      this.showPreviewModal = true;
    },
    async purchaseItem() {
      try {
        console.log('Purchasing item:', this.selectedItem);
        this.showPreviewModal = false;
        setTimeout(() => {
          this.showRewardModal = true;
        }, 300);
      } catch (error) {
        console.error('Failed to purchase item:', error);
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
    await this.loadShopItems();
    console.log('ShopView mounted with shop items');
  },
  setup() {
    const inventoryStore = useInventoryStore();
    return { inventoryStore };
  }
}
</script>