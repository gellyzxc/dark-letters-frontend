<template>
  <div class="page inventory-view">
    <transition name="fade">
      <div v-if="showItemTooltip && hoveredItem" class="item-tooltip" :style="tooltipPosition">
        <frame-component class="tooltip-frame">
          <item-info-card :item="hoveredItem" variant="tooltip" />
        </frame-component>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showReforgedTooltip && reforgedItem" class="item-tooltip reforged-tooltip"
        :style="reforgedTooltipPosition">
        <frame-component class="tooltip-frame">
          <item-info-card reforge :item="reforgedItem" variant="tooltip" :show-header="true">
            <template #header-extra>
              <div class="reforge-info" style="position: absolute; bottom: 12px;">
                <div class="gold-info">Gold: {{ character ? character.gold : 0 }}</div>
                <div class="reforge-cost">Reforge: {{ reforgeCost }} gold</div>
              </div>
            </template>
          </item-info-card>
        </frame-component>
      </div>
    </transition>
    <div class="main">
      <img src="@/assets/images/frames/forge-iventory-frame.png" />
      <div class="content">
        <div class="forge">
          <drag-drop-component class="equipment-slot" group-id="inventory" :item-data="forgeItem"
            @item-dropped="onForgeDropped($event)" @drag-start="onDragStartHandler" @drag-end="onDragEndHandler"
            style="display: flex; justify-content: center; align-items: center;">
            <div v-if="forgeItem" class="item" @mouseenter="onItemHover(forgeItem, $event)" @mouseleave="onItemLeave">
              <img v-if="forgeItem.photo" style="max-height: 110px;" :src="getImageUrl(forgeItem.photo)"
                :alt="forgeItem.name" class="item-image" />
              <div v-else class="icon">{{ forgeItem.icon || '📦' }}</div>
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
                <item-info-card variant="tooltip" :item="reforgeItem" />
              </frame-component>
            </div>
          </div>
        </transition>
        <div class="inventory" @dragover.prevent="onInventoryDragOver" @dragleave.prevent="onInventoryDragLeave">
          <drag-drop-component v-for="(slot, index) in inventorySlots" :key="index" class="slot" group-id="inventory"
            :item-data="slot.item" :slot-index="index" :grid-cols="8" :grid-rows="8"
            :occupied-slots="inventorySlots.map(s => s.item)" @item-dropped="onItemDropped('inventory', index, $event)"
            @drag-start="onDragStartHandler" @drag-end="onDragEndHandler">
            <div v-if="slot.item && isFirstSlotOfItem(index)" class="item" :style="getItemStyle(slot.item, index)"
              @mouseenter="onItemHover(slot.item, $event)" @mouseleave="onItemLeave">
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
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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

      .gold-display {
        position: absolute;
        left: 26px;
        top: 60px;
        font-size: 1.2rem;
        color: #FFD700;
        font-weight: 600;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8);

        .gold-amount {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 4px;
          border: 1px solid rgba(255, 215, 0, 0.3);
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

.item-tooltip {
  position: fixed;
  z-index: 10000;
  pointer-events: none;

  .tooltip-frame {
    width: 30svw !important;
  }

  .tooltip-content {
    &.forgeed-tooltip-content {
      width: calc(100% - 2rem);
    }

    background-color: black;
    padding: 0.8rem 1rem;
    padding-bottom: 4rem;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    position: relative;

    .reforge-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.2rem;

      .reforge-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.2rem;

        .gold-info {
          font-size: 0.9rem;
          color: #FFD700;
          font-weight: 600;
        }

        .reforge-cost {
          font-size: 0.9rem;
          color: #DAA520;
          font-weight: 600;
        }
      }
    }

    .item-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
      letter-spacing: 0.01em;
      line-height: 1.2;
      text-shadow: 0 1px 2px #000;
    }

    .item-description {
      font-size: 0.95rem;
      color: #cccccc;
      line-height: 1.4;
      word-break: break-word;
      text-shadow: 0 1px 2px #000;
    }

    .item-bonuses {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      margin-top: 0.4rem;

      .bonus-line {
        font-size: 0.9rem;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        text-shadow: 0 1px 2px #000;

        .bonus-label {
          color: #cccccc;
        }

        .bonus-value {
          font-weight: 600;
          color: #ffffff;
        }
      }
    }

    .reforge-actions {
      position: absolute;
      bottom: 5.5rem;
      left: 1rem;
      right: 1rem;
      display: flex;
      justify-content: center;
      gap: 0.8rem;
      pointer-events: all;

      button {
        flex: 1;
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
        font-weight: 600;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;

        &.accept-btn {
          color: #000;
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      }
    }
  }
}

.reforged-tooltip {
  pointer-events: all;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
  }
}
</style>
<script>
import { API_BASE_URL } from "@/api/client";
import DragDropComponent from "@/components/DragDropComponent.vue";
import FrameComponent from "@/components/game/FrameComponent.vue";
import ItemInfoCard from "@/components/game/ItemInfoCard.vue";
import { useInventoryStore } from "@/stores/inventory";
import { transformApiItem, positionToIndex, indexToPosition } from "@/utils/itemHelpers";
const BASE_URL = API_BASE_URL;
export default {
  name: "BlacksmithView",
  components: { DragDropComponent, FrameComponent, ItemInfoCard },
  data() {
    return {
      forgeItem: null,
      openingReforge: null,
      reforgeItem: null,
      inventorySlots: Array(64).fill().map(() => ({ item: null })),
      showItemTooltip: false,
      hoveredItem: null,
      hoverTimeout: null,
      tooltipPosition: { top: '0px', left: '0px' },
      showReforgedTooltip: false,
      reforgedItem: null,
      reforgedTooltipPosition: { top: '0px', left: '0px' },
      totalGoldSpent: 0,
      character: null,
      hasReforged: false
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
    },
    reforgeCost() {
      if (!this.forgeItem || !this.forgeItem.price) return 0;
      return Math.ceil(this.forgeItem.price * 0.1);
    },
    canReforge() {
      if (!this.character || !this.reforgeCost) return false;
      return this.character.gold >= this.reforgeCost;
    }
  },
  methods: {
    async loadCharacter() {
      try {
        const { useUserStore } = await import('@/stores/user');
        const userStore = useUserStore();
        const character = await userStore.fetchCharacter();
        this.character = character;
      } catch (error) {
        console.error('Failed to load character:', error);
      }
    },
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
          this.updateItemPosition(temp, sourceInvIndex);
        }
        this.forgeItem = droppedData;
        this.inventorySlots = newSlots;
        this.showForgeTooltip();
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
        this.showReforgedTooltip = false;
        if (this.hasReforged && this.reforgedItem) {
          this.acceptReforge();
          return;
        }
        const targetItem = currentData;
        if (targetItem) {
          this.clearItemCells(newInventorySlots, targetItem);
          this.forgeItem = targetItem;
          this.showForgeTooltip();
        } else {
          this.forgeItem = null;
        }
        this.fillItemCells(newInventorySlots, droppedData, slotIndex);
        this.inventorySlots = newInventorySlots;
        this.updateItemPosition(droppedData, slotIndex);
      }
    },
    async onReforgeClick() {
      if (!this.forgeItem || !this.canReforge) return;
      await this.doReforge();
    },
    showForgeTooltip() {
      if (!this.forgeItem) return;
      this.reforgedItem = { ...this.forgeItem };
      this.hasReforged = false;
      const forgeElement = document.querySelector('.forge');
      if (forgeElement) {
        const rect = forgeElement.getBoundingClientRect();
        const margin = 10;
        let top = rect.top - margin;
        let left = rect.left + rect.width / 2;
        let transform = 'translate(-50%, -100%)';
        this.reforgedTooltipPosition = {
          top: `${top - 20}px`,
          left: `${left + 36}px`,
          transform: transform
        };
      }
      this.showReforgedTooltip = true;
    },
    async doReforge() {
      if (!this.forgeItem || !this.canReforge) return;
      this.character.gold -= this.reforgeCost;
      this.totalGoldSpent += this.reforgeCost;
      this.hasReforged = true;
      const rerolledStats = this.forgeItem.stats?.map(stat => {
        const minValue = stat.minValue || 1;
        const maxValue = stat.maxValue || stat.currentValue || stat.value;
        const newValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        return {
          ...stat,
          value: newValue,
          currentValue: newValue
        };
      }) || [];
      this.reforgedItem = {
        ...this.forgeItem,
        stats: rerolledStats
      };
      const forgeElement = document.querySelector('.forge');
      if (forgeElement) {
        const rect = forgeElement.getBoundingClientRect();
        const tooltipWidth = window.innerWidth * 0.3;
        const margin = 10;
        let top = rect.top - margin;
        let left = rect.left + rect.width / 2;
        let transform = 'translate(-50%, -100%)';
        this.reforgedTooltipPosition = {
          top: `${top - 20}px`,
          left: `${left + 36}px`,
          transform: transform
        };
      }
      this.showReforgedTooltip = true;
    },
    async acceptReforge() {
      if (!this.reforgedItem) return;
      try {
        const statsUpdate = this.reforgedItem.stats.map((stat, index) => {
          const originalStat = this.forgeItem.stats[index];
          return {
            id: originalStat.id,
            buff_skill: originalStat.buffSkill,
            buff_type: originalStat.buffType,
            current_value: stat.currentValue || stat.value,
            max_value: originalStat.maxValue,
            min_value: originalStat.minValue,
            tier: originalStat.tier,
            visual_text: `${stat.label}`
          };
        });
        await this.inventoryStore.updateItem(this.reforgedItem.id, { stats: statsUpdate });
        if (this.totalGoldSpent > 0) {
          const { useCharacterStore } = await import('@/stores/character');
          const characterStore = useCharacterStore();
          await characterStore.updateCharacter(this.character.id, { gold: this.character.gold });
        }
        this.forgeItem = null;
        this.showReforgedTooltip = false;
        this.reforgedItem = null;
        this.totalGoldSpent = 0;
        this.hasReforged = false;
        await this.loadInventory();
        await this.loadCharacter();
      } catch (error) {
        console.error('Failed to accept reforge:', error);
        alert('Failed to save reforged item');
      }
    },
    onInventoryDragOver(e) {
      e.preventDefault();
    },
    onInventoryDragLeave(e) {
      const inventoryEl = e.currentTarget;
      const rect = inventoryEl.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        if (window.__dragState) {
          window.__dragState = {
            itemSize: window.__dragState.itemSize,
            sourceItemId: window.__dragState.sourceItemId,
            hoverIndex: null
          };
        }
      }
    },
    onDragStartHandler() {
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      }
      this.showItemTooltip = false;
      this.hoveredItem = null;
    },
    onDragEndHandler() {
    },
    onItemHover(item, event) {
      if (!item || this.showReforgedTooltip) return;
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
      }
      this.hoverTimeout = setTimeout(() => {
        const rect = event.target.getBoundingClientRect();
        const tooltipWidth = window.innerWidth * 0.3;
        const tooltipHeight = 200;
        const margin = 10;
        let top = rect.top - margin;
        let left = rect.left + rect.width / 2;
        let transform = 'translate(-50%, -100%)';
        if (top - tooltipHeight < margin) {
          top = rect.bottom + margin;
          transform = 'translate(-50%, 0)';
        }
        const tooltipLeft = left - tooltipWidth / 2;
        const tooltipRight = left + tooltipWidth / 2;
        if (tooltipLeft < margin) {
          left = margin + tooltipWidth / 2;
        } else if (tooltipRight > window.innerWidth - margin) {
          left = window.innerWidth - margin - tooltipWidth / 2;
        }
        this.tooltipPosition = {
          top: `${top}px`,
          left: `${left}px`,
          transform: transform
        };
        this.hoveredItem = item;
        this.showItemTooltip = true;
      }, 300);
    },
    onItemLeave() {
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      }
      this.showItemTooltip = false;
      this.hoveredItem = null;
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
    await this.loadCharacter();
    console.log('BlacksmithView mounted with inventory data');
  },
  setup() {
    const inventoryStore = useInventoryStore();
    return { inventoryStore };
  },
}
</script>