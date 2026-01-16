<template>
  <div class="page inventory-view">
    <transition name="fade">
      <div v-if="showItemTooltip && hoveredItem" class="item-tooltip" :style="tooltipPosition">
        <frame-component class="tooltip-frame">
          <item-info-card :item="hoveredItem" variant="tooltip" />
        </frame-component>
      </div>
    </transition>
    <div class="main">
      <img src="@/assets/images/frames/inventory-frame-tab.png" />
      <div class="content">
        <div class="stats-left">
          <span class="heading" v-if="character">{{ character.race?.name }}</span>
          <span class="heading" v-if="character">{{ character.class?.name }}</span>
          <span v-if="character"><span class="value">+{{ character.intellect }}</span> intelligence</span>
          <span v-if="character"><span class="value">+{{ character.strength }}</span> strength</span>
          <span v-if="character"><span class="value">+{{ character.agility }}</span> agility</span>
          <span v-if="character" class="mt-1"><span class="value">+{{ character.damage }}</span> damage</span>
          <span v-if="character"><span class="value">+{{ Math.round(character.critical_hit_chance * 100) }}%</span> krit
            chance</span>
          <span v-if="character"><span class="value">+{{ Math.round(character.critical_multiplier) }}%</span> krit
            damage</span>
          <span v-if="character"><span class="value">+{{ character.defence }}</span> defence</span>
          <span v-if="character"><span class="value">+{{ character.health_points }}</span> health points</span>
          <span v-if="character"><span class="value">+{{ Math.round(character.block_chance * 100) }}%</span> block
            chance</span>
          <span v-if="character"><span class="value">+{{ character.mana }}</span> mana</span>
          <span v-if="character"><span class="value">+{{ Math.round(character.mana_chance * 100) }}%</span> mana
            chance</span>
        </div>
        <div class="stats-bottom">
          <span v-if="character">{{ character.lvl }} lvl</span>
          <div class="col">
            <span v-if="character">{{ character.experience }} exp</span>
            <span v-if="character">{{ character.gold }} gold</span>
          </div>
        </div>
        <div class="sword">
          <drag-drop-component class="equipment-slot"
            style="display: flex; justify-content: center; align-items: center;" group-id="inventory"
            :item-data="equippedSword" @item-dropped="onEquipmentDropped('sword', $event)"
            @drag-start="onDragStartHandler" @drag-end="onDragEndHandler">
            <div v-if="equippedSword" class="item" @mouseenter="onItemHover(equippedSword, $event)"
              @mouseleave="onItemLeave">
              <img v-if="equippedSword.photo" style="max-height: 182px;" :src="getImageUrl(equippedSword.photo)" :alt="equippedSword.name"
                class="item-image" />
              <div v-else class="icon">{{ equippedSword.icon || '📦' }}</div>
            </div>
            <template #placeholder>
            </template>
          </drag-drop-component>
        </div>
        <div class="cloth">
          <drag-drop-component class="equipment-slot"
            style="display: flex; justify-content: center; align-items: center;" group-id="inventory"
            :item-data="equippedCloth" @item-dropped="onEquipmentDropped('cloth', $event)"
            @drag-start="onDragStartHandler" @drag-end="onDragEndHandler">
            <div v-if="equippedCloth" class="item" @mouseenter="onItemHover(equippedCloth, $event)"
              @mouseleave="onItemLeave">
              <img v-if="equippedCloth.photo" :src="getImageUrl(equippedCloth.photo)" :alt="equippedCloth.name"
                class="item-image" />
              <div v-else class="icon">{{ equippedCloth.icon || '📦' }}</div>
            </div>
            <template #placeholder>
              <span class="equipment-label">Armor</span>
            </template>
          </drag-drop-component>
        </div>
        <div class="amulet">
          <drag-drop-component class="equipment-slot" group-id="inventory"
            style="display: flex; justify-content: center;" :item-data="equippedAmulet"
            @item-dropped="onEquipmentDropped('amulet', $event)" @drag-start="onDragStartHandler"
            @drag-end="onDragEndHandler">
            <div v-if="equippedAmulet" class="item" @mouseenter="onItemHover(equippedAmulet, $event)"
              @mouseleave="onItemLeave">
              <img v-if="equippedAmulet.photo" :src="getImageUrl(equippedAmulet.photo)" :alt="equippedAmulet.name"
                class="item-image" />
              <div v-else class="icon">{{ equippedAmulet.icon || '📦' }}</div>
            </div>
            <template #placeholder>
              <span class="equipment-label">Amulet</span>
            </template>
          </drag-drop-component>
        </div>
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
        <div class="sell-zone">
          <drag-drop-component class="sell-drop-area"
            style="display: flex; align-items: center; justify-content: center;" group-id="inventory"
            @item-dropped="onSellItem">
            <template #placeholder>
              <div class="sell-placeholder">
                <div class="sell-text">Drag here to sell</div>
              </div>
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

      .sword,
      .cloth,
      .amulet,
      .stats-left,
      .stats-bottom {
        position: absolute;
      }

      .stats-bottom {
        padding: 0 0.5rem;
        width: calc(560px - 1rem);
        height: 81px;
        bottom: 19px;
        right: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        color: #DFDFDF;
        font-size: 1.6rem;

        .col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.9rem;
        }
      }

      .stats-left {
        width: 240px;
        top: 0;
        left: -256px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-start;
        gap: 0.4rem;

        span {
          color: #999;
          font-size: 1.1rem;
        }

        .heading {
          color: white;
          font-size: 1.3rem;
          font-weight: 500;
        }

        .mt-1 {
          margin-top: 0.6rem;
        }
      }

      .sword {
    top: 181px;
    left: 43px;
    height: 176px;
    width: 76px;
      }

      .amulet {
        top: 535px;
        left: 414px;
        height: 86px;
        width: 74px;
      }

      .cloth {
        top: 325px;
        left: 410px;
        height: 143px;
        width: 97px;
      }

      .inventory {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
        width: fit-content;
        position: absolute;
        left: 598px;
        top: 94px;
        column-gap: 2px;
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

      .sell-zone {
        position: absolute;
        right: 617px;
        top: 732px;
        transform: translateY(-50%);
        width: 550px;
        height: 88px;

        .sell-drop-area {
          width: 100%;
          height: 100%;
          border: 3px dashed rgba($color-gold-primary, 0.4);
          border-radius: $radius-lg;
          background: rgba(0, 0, 0, 0.3);
          transition: all $transition-base;

          &:hover {
            border-color: rgba($color-gold-primary, 0.8);
            background: rgba($color-gold-primary, 0.1);
            box-shadow: 0 0 20px rgba($color-gold-primary, 0.3);
          }

          .sell-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: $spacing-sm;
            pointer-events: none;

            .sell-icon {
              font-size: 3rem;
              filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
            }

            .sell-text {
              font-size: $font-size-sm;
              color: #DFDFDF !important;
              text-align: center;
              font-family: $font-family-primary;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              font-weight: 500;
            }
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
          gap: $spacing-xs;
          width: 100%;
          height: 100%;
          pointer-events: all;
          cursor: grab;

          &:active {
            cursor: grabbing;
          }

          .item-image {
            max-width: 90%;
            max-height: 70%;
            object-fit: contain;
            filter: drop-shadow($shadow-sm);
            pointer-events: none;
          }

          .icon {
            font-size: clamp(2rem, 4vw, 3rem);
            filter: drop-shadow($shadow-sm);
            pointer-events: none;
          }

          span {
            font-size: clamp(0.6rem, 1vw, 0.8rem);
            color: $color-text-primary;
            text-align: center;
            font-family: $font-family-primary;
            pointer-events: none;
          }
        }

        .equipment-label {
          font-size: $font-size-xs;
          color: rgba($color-text-primary, 0.5);
          text-transform: uppercase;
          font-family: $font-family-primary;
          letter-spacing: 0.05em;
        }
      }
    }
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
    background-color: black;
    padding: 0.8rem 1rem;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    .item-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
      letter-spacing: 0.01em;
      line-height: 1.2;
      text-shadow: 0 1px 2px #000;
      margin-bottom: 0.2rem;
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
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
  name: "InventoryView",
  components: { DragDropComponent, FrameComponent, ItemInfoCard },
  data() {
    return {
      character: null,
      equippedSword: null,
      equippedCloth: null,
      equippedAmulet: null,
      inventorySlots: Array(64).fill().map(() => ({ item: null })),
      showItemTooltip: false,
      hoveredItem: null,
      hoverTimeout: null,
      tooltipPosition: { top: '0px', left: '0px' }
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
    onItemHover(item, event) {
      if (!item) return;
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
      if (targetCol + width > cols) return false;
      if (targetRow + height > rows) return false;
      return true;
    },
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
    async loadInventory() {
      try {
        const response = await this.inventoryStore.fetchUserItems();
        const inventory = response.inventory || [];
        const equipped = response.equipped || [];
        this.inventorySlots = Array(64).fill().map(() => ({ item: null }));
        equipped.forEach(apiItem => {
          const transformedItem = transformApiItem(apiItem);
          const itemType = transformedItem.type;
          if (itemType === 'blades' || itemType === 'staff') {
            this.equippedSword = transformedItem;
          } else if (itemType === 'belt' || itemType === 'chest' || itemType === 'cloak' || itemType === 'mantle') {
            this.equippedCloth = transformedItem;
          } else if (itemType === 'amulet' || itemType === 'ring') {
            this.equippedAmulet = transformedItem;
          }
        });
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
    async onEquipmentDropped(slotType, { droppedData, currentData }) {
      console.log('Equipment dropped:', { slotType, droppedData, currentData })
      if (!droppedData) return;
      const allowedTypes = {
        sword: ['blades', 'staff', 'blade_and_shield'],
        cloth: ['belt', 'chest', 'cloak', 'mantle'],
        amulet: ['amulet', 'ring']
      };
      if (!allowedTypes[slotType].includes(droppedData.type)) {
        console.log(`Cannot equip ${droppedData.type} in ${slotType} slot`);
        return;
      }
      const slotProp = `equipped${slotType.charAt(0).toUpperCase() + slotType.slice(1)}`;
      const sourceInvIndex = this.inventorySlots.findIndex(s => s.item && s.item.id === droppedData.id);
      if (sourceInvIndex !== -1) {
        const newInventorySlots = [...this.inventorySlots];
        const oldEquipped = this[slotProp];
        this.clearItemCells(newInventorySlots, droppedData);
        if (oldEquipped) {
          this.fillItemCells(newInventorySlots, oldEquipped, sourceInvIndex);
          await this.inventoryStore.updateItem(oldEquipped.id, { is_equipped: false });
          this.updateItemPosition(oldEquipped, sourceInvIndex);
        }
        this[slotProp] = droppedData;
        this.inventorySlots = newInventorySlots;
        await this.inventoryStore.updateItem(droppedData.id, { is_equipped: true });
        await this.loadCharacter();
      } else {
        const sourceSlots = ['sword', 'cloth', 'amulet'];
        for (const sourceSlot of sourceSlots) {
          const sourceProp = `equipped${sourceSlot.charAt(0).toUpperCase() + sourceSlot.slice(1)}`;
          if (this[sourceProp] && this[sourceProp].id === droppedData.id) {
            const temp = this[slotProp];
            this[slotProp] = this[sourceProp];
            this[sourceProp] = temp;
            await this.loadCharacter();
            break;
          }
        }
      }
    },
    async onSellItem({ droppedData }) {
      if (!droppedData) return;
      const confirmSell = confirm(`Sell ${droppedData.name} for ${droppedData.price || 0} gold?`);
      if (!confirmSell) {
        await this.loadInventory();
        return;
      }
      try {
        await this.inventoryStore.deleteItem(droppedData.id);
        console.log(`Item ${droppedData.name} sold successfully`);
        await this.loadInventory();
      } catch (error) {
        console.error('Failed to sell item:', error);
        await this.loadInventory();
      }
    },
    async onItemDropped(groupName, slotIndex, { droppedData, currentData }) {
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
      } else {
        const sourceSlots = ['sword', 'cloth', 'amulet']
        for (const sourceSlot of sourceSlots) {
          const sourceProp = `equipped${sourceSlot.charAt(0).toUpperCase() + sourceSlot.slice(1)}`
          if (this[sourceProp] && this[sourceProp].id === droppedData?.id) {
            const targetItem = currentData;
            if (targetItem) {
              this.clearItemCells(newInventorySlots, targetItem);
              this[sourceProp] = targetItem;
              await this.inventoryStore.updateItem(targetItem.id, { is_equipped: true });
            } else {
              this[sourceProp] = null;
            }
            this.fillItemCells(newInventorySlots, droppedData, slotIndex);
            this.inventorySlots = newInventorySlots;
            this.updateItemPosition(droppedData, slotIndex);
            await this.inventoryStore.updateItem(droppedData.id, { is_equipped: false });
            await this.loadCharacter();
            break;
          }
        }
      }
    }
  },
  async mounted() {
    await this.loadInventory();
    await this.loadCharacter();
    console.log('InventoryView mounted with inventory data');
  },
  setup() {
    const inventoryStore = useInventoryStore();
    return { inventoryStore };
  }
}
</script>