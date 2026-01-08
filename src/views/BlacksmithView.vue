<template>
  <div class="page inventory-view">
    <div class="main">
      <img src="@/assets/images/frames/forge-iventory-frame.png" />
      <div class="content">
        <div class="forge">
          <drag-drop-component class="equipment-slot" group-id="inventory" :item-data="forgeItem"
            @item-dropped="onForgeDropped($event)">
            <div v-if="forgeItem" class="item">
              <img v-if="forgeItem.photo" :src="getImageUrl(forgeItem.photo)" :alt="forgeItem.name"
                class="item-image" />
              <div v-else class="icon">{{ forgeItem.icon || '📦' }}</div>
              <span>{{ forgeItem.name }}</span>
            </div>
            <template #placeholder>
            </template>
          </drag-drop-component>
        </div>
        <div class="reforge" @click="onReforgeClick" :class="{ 'opening': openingReforge }"></div>
        <transition name="item-drop">
          <div v-if="reforgeItem" class="dropped-item-container" @click="reforgeItem = null">
            <div class="item-drop-animation" @click.stop>
              <div class="particles">
                <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
              </div>
              <frame-component class="item-frame">
                <div class="item-card new-item-card">
                  <div class="glow" :class="`glow-${reforgeItem.rarity || 'common'}`"></div>
                  <div class="item-content-flex">
                    <div class="item-left">
                      <div class="item-name">{{ reforgeItem.name }}</div>
                      <div class="item-description">{{ reforgeItem.description || 'Reforged item.' }}</div>
                    </div>
                    <div class="item-right">
                      <div class="item-bonuses">
                        <div v-for="stat in reforgeItem.stats || []" :key="stat.label" class="bonus-line">
                          <span class="bonus-label">{{ stat.label }}</span>
                          <span class="bonus-value">{{ stat.value }}</span>
                        </div>
                      </div>
                      <div v-if="reforgeItem.price" class="item-price-block">
                        <span class="item-price">{{ reforgeItem.price }} gold</span>
                      </div>
                    </div>
                  </div>
                </div>
              </frame-component>
            </div>
          </div>
        </transition>
        <div class="inventory">
          <drag-drop-component v-for="(slot, index) in inventorySlots" :key="index" class="slot" group-id="inventory"
            :item-data="slot.item" @item-dropped="onItemDropped('inventory', index, $event)">
            <div v-if="slot.item && isFirstSlotOfItem(index)" class="item" :style="getItemStyle(slot.item, index)">
              <img v-if="slot.item.photo" :src="getImageUrl(slot.item.photo)" :alt="slot.item.name"
                class="item-image" />
              <div v-else class="icon">{{ slot.item.icon || '📦' }}</div>
            </div>
            <template #placeholder>
              <span>{{ index + 1 }}</span>
            </template>
          </drag-drop-component>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100% - #{$spacing-2xl + $spacing-md});
  max-height: 1080px;
  max-width: 1920px;
  padding: $spacing-xl;

  .main {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
    max-height: 800px;
    position: relative;

    img {
      max-height: 800px;
      object-fit: contain;
    }

    .content {
      position: absolute;
      height: 100%;
      width: 100%;

      .forge {
        position: absolute;
        top: 495px;
        left: 879px;
        height: 119px;
        width: 110px;
      }

      .reforge {
        position: absolute;
        top: 685px;
        left: 808px;
        height: 68px;
        width: 253px;
        cursor: pointer;
        transition: transform $transition-base, box-shadow $transition-base;

        &:hover {
          transform: translateY(-4px);
          box-shadow: $glow-gold-md;
        }

        &:active {
          transform: translateY(0) scale(0.98);
        }

        &.opening {
          animation: crateShake $transition-slow;
        }
      }

      .inventory {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
        width: fit-content;
        position: absolute;
        left: 26px;
        top: 96px;
        column-gap: 3px;
        row-gap: 7px;

        .slot {
          height: 60px;
          width: 60px;
          aspect-ratio: 1 / 1;

          ::v-deep .drag-item {
            width: 100%;
            height: 100%;
          }
        }
      }

      .slot {
        border: 0;

        .item {
          pointer-events: all;
          cursor: grab;

          &:active {
            cursor: grabbing;
          }

          .item-image {
            z-index: 9299;
            width: 100%;
            height: 100%;
            object-fit: contain;
            position: inherit;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
            pointer-events: none;
          }

          .icon {
            font-size: clamp(1.5rem, 3vw, 2.5rem);
            pointer-events: none;
          }
        }
      }

      .equipment-slot {
        width: 100%;
        height: 100%;
        border: 0;

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          width: 100%;
          height: 100%;
          pointer-events: all;
          cursor: grab;

          &:active {
            cursor: grabbing;
          }

          .item-image {
            max-width: 90%;
            max-height: 60%;
            object-fit: contain;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
            pointer-events: none;
          }

          .icon {
            font-size: clamp(2rem, 4vw, 3rem);
            pointer-events: none;
          }

          span {
            font-size: clamp(0.6rem, 1vw, 0.8rem);
            color: white;
            text-align: center;
            pointer-events: none;
          }
        }

        .equipment-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
        }
      }
    }
  }
}

@keyframes crateShake {

  0%,
  100% {
    transform: translateX(0) rotate(0deg);
  }

  10% {
    transform: translateX(-8px) rotate(-4deg);
  }

  20% {
    transform: translateX(8px) rotate(4deg);
  }

  30% {
    transform: translateX(-6px) rotate(-3deg);
  }

  40% {
    transform: translateX(6px) rotate(3deg);
  }

  50% {
    transform: translateX(-4px) rotate(-2deg);
  }

  60% {
    transform: translateX(4px) rotate(2deg);
  }

  70% {
    transform: translateX(-2px) rotate(-1deg);
  }

  80% {
    transform: translateX(2px) rotate(1deg);
  }

  90% {
    transform: translateX(0) rotate(0deg);
  }
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

.item-drop-enter-active {
  transition: all 0.6s ease-out;
}

.item-drop-leave-active {
  transition: all 0.3s ease-in;
}

.item-drop-enter-from {
  opacity: 0;
  transform: scale(0);
}

.item-drop-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.dropped-item-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

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

    .item-frame {
      height: 400px;
    }

    .new-item-card {
      position: relative;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      border-radius: 18px;
      box-shadow: 0 0 24px 4px #1a1310, 0 0 0 2px #3a2a1a, 0 0 0 8px rgba(212, 175, 55, 0.08);
      padding: 0;
      display: flex;
      align-items: stretch;
      justify-content: center;
      font-family: 'JetBrains Mono', 'Fira Mono', 'Consolas', monospace;
      color: #e0d8c0;

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

        &.glow-legendary {
          background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 140, 0, 0.4) 50%, transparent 70%);
        }

        &.glow-mystical {
          background: radial-gradient(circle, rgba(138, 43, 226, 0.6) 0%, rgba(75, 0, 130, 0.4) 50%, transparent 70%);
        }

        &.glow-wooden {
          background: radial-gradient(circle, rgba(139, 69, 19, 0.6) 0%, rgba(160, 82, 45, 0.4) 50%, transparent 70%);
        }

        &.glow-common {
          background: radial-gradient(circle, rgba(169, 169, 169, 0.6) 0%, rgba(105, 105, 105, 0.4) 50%, transparent 70%);
        }
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
            color: #e0d8c0;
            display: flex;
            gap: 0.5em;
            justify-content: flex-end;

            .bonus-label {
              color: #b0a890;
              min-width: 90px;
              text-align: right;
            }

            .bonus-value {
              color: #e0d8c0;
              font-weight: 600;
            }
          }
        }

        .item-price-block {
          position: absolute;
          right: 0;
          bottom: 0;
          margin: 0 1.5rem 1.2rem 0;

          .item-price {
            font-size: 1.2rem;
            color: #e0d8c0;
            font-weight: 600;
            text-align: right;
            letter-spacing: 0.02em;
          }
        }
      }
    }
  }
}
</style>
<script>
import DragDropComponent from "@/components/DragDropComponent.vue";
import FrameComponent from "@/components/game/FrameComponent.vue";
import { useInventoryStore } from "@/stores/inventory";
import { transformApiItem, positionToIndex, indexToPosition } from "@/utils/itemHelpers";
const API_BASE_URL = 'http://147.45.253.24:5035/';
const BASE_URL = API_BASE_URL.replace('/api/v1', '');
export default {
  name: "BlacksmithView",
  components: { DragDropComponent, FrameComponent },
  data() {
    return {
      forgeItem: null,
      openingReforge: null,
      reforgeItem: null,
      inventorySlots: Array(64).fill().map(() => ({ item: null }))
    }
  },
  computed: {
    cellSize() {
      return 60;
    },
    getImageUrl() {
      return (photoPath) => {
        if (!photoPath) return null;
        return `${BASE_URL}/${photoPath}`;
      };
    }
  },
  methods: {
    isFirstSlotOfItem(index) {
      const item = this.inventorySlots[index]?.item;
      if (!item) return false;
      const firstIndex = this.inventorySlots.findIndex(s => s.item && s.item.id === item.id);
      return firstIndex === index;
    },
    canPlaceItemAt(item, targetIndex) {
      if (!item || !item.size) return false;
      const [width, height] = item.size;
      const cols = 8;
      const rows = 8;
      const targetCol = targetIndex % cols;
      const targetRow = Math.floor(targetIndex / cols);
      if (targetCol + width > cols) {
        return false;
      }
      if (targetRow + height > rows) {
        return false;
      }
      return true;
    },
    async loadInventory() {
      try {
        const response = await this.inventoryStore.fetchUserItems();
        const inventory = response.inventory || [];
        this.inventorySlots = Array(64).fill().map(() => ({ item: null }));
        inventory.forEach(apiItem => {
          const transformedItem = transformApiItem(apiItem);
          const slotIndex = positionToIndex(transformedItem.position.x, transformedItem.position.y);
          if (slotIndex >= 0 && slotIndex < 64) {
            const [width, height] = transformedItem.size || [1, 1];
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const currentSlot = slotIndex + y * 8 + x;
                if (currentSlot >= 0 && currentSlot < 64) {
                  this.inventorySlots[currentSlot].item = transformedItem;
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Failed to load inventory:', error);
      }
    },
    clearItemCells(slots, item) {
      if (!item) return;
      for (let i = 0; i < slots.length; i++) {
        if (slots[i].item && slots[i].item.id === item.id) {
          slots[i].item = null;
        }
      }
    },
    fillItemCells(slots, item, startIndex) {
      if (!item || !item.size) return;
      const [width, height] = item.size;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const currentSlot = startIndex + y * 8 + x;
          if (currentSlot >= 0 && currentSlot < 64) {
            slots[currentSlot].item = item;
          }
        }
      }
    },
    async updateItemPosition(item, newIndex) {
      try {
        const position = indexToPosition(newIndex);
        await this.inventoryStore.updateItem(item.id, {
          x_pos: position.x,
          y_pos: position.y
        });
        console.log(`Updated item ${item.name} position to (${position.x}, ${position.y})`);
      } catch (error) {
        console.error('Failed to update item position:', error);
      }
    },
    getItemStyle(item, index) {
      if (!item || !item.size) return {};
      const [w, h] = item.size;
      const colGap = 3;
      const rowGap = 7;
      const cols = 8;
      const rows = 8;
      const col = index % cols;
      const row = Math.floor(index / cols);
      let width = w * this.cellSize + (w - 1) * colGap;
      let height = h * this.cellSize + (h - 1) * rowGap;
      if (col + w >= cols) {
        width -= colGap;
      }
      if (row + h >= rows) {
        height -= rowGap;
      }
      return {
        position: 'absolute',
        width: width + 'px',
        height: height + 'px',
        left: 0,
        top: 0
      };
    },
    onForgeDropped({ droppedData, currentData }) {
      console.log('Forge dropped:', { droppedData, currentData })
      if (!droppedData) return;
      const sourceInvIndex = this.inventorySlots.findIndex(s => s.item && s.item.id === droppedData?.id)
      if (sourceInvIndex !== -1) {
        const newSlots = [...this.inventorySlots];
        const temp = this.forgeItem;
        this.clearItemCells(newSlots, droppedData);
        if (temp) {
          this.fillItemCells(newSlots, temp, sourceInvIndex);
        }
        this.forgeItem = droppedData;
        this.inventorySlots = newSlots;
      } else if (this.forgeItem && this.forgeItem.id === droppedData?.id) {
        return;
      }
    },
    onItemDropped(groupName, slotIndex, { droppedData, currentData }) {
      console.log('Inventory dropped:', { groupName, slotIndex, droppedData, currentData })
      if (!droppedData) return;
      if (!this.canPlaceItemAt(droppedData, slotIndex)) {
        console.log('Cannot place item at this position - out of bounds');
        return;
      }
      const newInventorySlots = [...this.inventorySlots];
      const sourceInvIndex = this.inventorySlots.findIndex(s => s.item && s.item.id === droppedData?.id);
      if (sourceInvIndex !== -1) {
        const targetItem = currentData;
        this.clearItemCells(newInventorySlots, droppedData);
        if (targetItem && targetItem.id !== droppedData.id) {
          this.clearItemCells(newInventorySlots, targetItem);
          this.fillItemCells(newInventorySlots, targetItem, sourceInvIndex);
          this.updateItemPosition(targetItem, sourceInvIndex);
        }
        this.fillItemCells(newInventorySlots, droppedData, slotIndex);
        this.inventorySlots = newInventorySlots;
        this.updateItemPosition(droppedData, slotIndex);
      } else if (this.forgeItem && this.forgeItem.id === droppedData?.id) {
        const targetItem = currentData;
        if (targetItem) {
          this.clearItemCells(newInventorySlots, targetItem);
          this.forgeItem = targetItem;
        } else {
          this.forgeItem = null;
        }
        this.fillItemCells(newInventorySlots, droppedData, slotIndex);
        this.inventorySlots = newInventorySlots;
        this.updateItemPosition(droppedData, slotIndex);
      }
    },
    onReforgeClick() {
      if (!this.forgeItem || this.openingReforge || this.reforgeItem) return;
      this.openingReforge = true;
      setTimeout(() => {
        this.openingReforge = null;
        this.showReforgeItem();
      }, 900);
    },
    showReforgeItem() {
      if (!this.forgeItem) return;
      const rarityMap = {
        'amulet': 'mystical',
        'ring': 'mystical',
        'belt': 'common',
        'blade': 'common',
        'blade_and_shield': 'legendary',
        'chest': 'common',
        'cloak': 'mystical',
        'mantle': 'mystical',
        'staff': 'legendary'
      };
      this.reforgeItem = {
        ...this.forgeItem,
        rarity: rarityMap[this.forgeItem.type] || 'common',
        stats: this.forgeItem.stats?.map(stat => ({
          ...stat,
          label: stat.label,
          value: stat.value
        })) || []
      };
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
    await this.loadInventory();
    console.log('BlacksmithView mounted with inventory data');
  },
  setup() {
    const inventoryStore = useInventoryStore();
    return { inventoryStore };
  },
}
</script>