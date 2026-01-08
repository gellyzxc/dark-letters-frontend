<template>
  <div class="page inventory-view">
    <div class="main">
      <img src="@/assets/images/frames/inventory-frame-tab.png" />
      <div class="content">
        <div class="sword">
          <drag-drop-component class="equipment-slot" group-id="inventory" :item-data="equippedSword"
            @item-dropped="onEquipmentDropped('sword', $event)">
            <div v-if="equippedSword" class="item">
              <img v-if="equippedSword.photo" :src="getImageUrl(equippedSword.photo)" :alt="equippedSword.name"
                class="item-image" />
              <div v-else class="icon">{{ equippedSword.icon || '📦' }}</div>
            </div>
            <template #placeholder>
            </template>
          </drag-drop-component>
        </div>
        <div class="cloth">
          <drag-drop-component class="equipment-slot" group-id="inventory" :item-data="equippedCloth"
            @item-dropped="onEquipmentDropped('cloth', $event)">
            <div v-if="equippedCloth" class="item">
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
          <drag-drop-component class="equipment-slot" group-id="inventory" :item-data="equippedAmulet"
            @item-dropped="onEquipmentDropped('amulet', $event)">
            <div v-if="equippedAmulet" class="item">
              <img v-if="equippedAmulet.photo" :src="getImageUrl(equippedAmulet.photo)" :alt="equippedAmulet.name"
                class="item-image" />
              <div v-else class="icon">{{ equippedAmulet.icon || '📦' }}</div>
            </div>
            <template #placeholder>
              <span class="equipment-label">Amulet</span>
            </template>
          </drag-drop-component>
        </div>
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
        <div class="sell-zone">
          <drag-drop-component class="sell-drop-area" group-id="inventory" @item-dropped="onSellItem">
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
      .amulet {
        position: absolute;
      }

      .sword {
        top: 182px;
        left: 44px;
        height: 176px;
        width: 76px;
      }

      .amulet {
        top: 537px;
        left: 417px;
        height: 86px;
        width: 74px;
      }

      .cloth {
        top: 333px;
        left: 417px;
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

      .sell-zone {
        position: absolute;
        right: 642px;
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
              color: $color-text-primary !important;
              text-align: center;
              font-family: $font-family-primary;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              font-weight: $font-weight-semibold;
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
</style>
<script>
import DragDropComponent from "@/components/DragDropComponent.vue";
import { useInventoryStore } from "@/stores/inventory";
import { transformApiItem, positionToIndex, indexToPosition } from "@/utils/itemHelpers";
const API_BASE_URL = 'http://147.45.253.24:5035/';
const BASE_URL = API_BASE_URL.replace('/api/v1', '');
export default {
  name: "InventoryView",
  components: { DragDropComponent },
  data() {
    return {
      equippedSword: null,
      equippedCloth: null,
      equippedAmulet: null,
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
      if (targetCol + width > cols) return false;
      if (targetRow + height > rows) return false;
      return true;
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
    onEquipmentDropped(slotType, { droppedData, currentData }) {
      console.log('Equipment dropped:', { slotType, droppedData, currentData })
      if (!droppedData) return;
      const allowedTypes = {
        sword: ['blades', 'staff'],
        cloth: ['belt', 'chest', 'cloak', 'mantle'],
        amulet: ['amulet', 'ring']
      };
      if (!allowedTypes[slotType].includes(droppedData.type)) {
        console.log(`Cannot equip ${droppedData.type} in ${slotType} slot`);
        return;
      }
      if (droppedData.type === 'blade_and_shield') {
        console.log('blade_and_shield cannot be equipped yet');
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
          this.inventoryStore.updateItem(oldEquipped.id, { is_equipped: false });
          this.updateItemPosition(oldEquipped, sourceInvIndex);
        }
        this[slotProp] = droppedData;
        this.inventorySlots = newInventorySlots;
        this.inventoryStore.updateItem(droppedData.id, { is_equipped: true });
      } else {
        const sourceSlots = ['sword', 'cloth', 'amulet'];
        for (const sourceSlot of sourceSlots) {
          const sourceProp = `equipped${sourceSlot.charAt(0).toUpperCase() + sourceSlot.slice(1)}`;
          if (this[sourceProp] && this[sourceProp].id === droppedData.id) {
            const temp = this[slotProp];
            this[slotProp] = this[sourceProp];
            this[sourceProp] = temp;
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
      } else {
        const sourceSlots = ['sword', 'cloth', 'amulet']
        for (const sourceSlot of sourceSlots) {
          const sourceProp = `equipped${sourceSlot.charAt(0).toUpperCase() + sourceSlot.slice(1)}`
          if (this[sourceProp] && this[sourceProp].id === droppedData?.id) {
            const targetItem = currentData;
            if (targetItem) {
              this.clearItemCells(newInventorySlots, targetItem);
              this[sourceProp] = targetItem;
              this.inventoryStore.updateItem(targetItem.id, { is_equipped: true });
            } else {
              this[sourceProp] = null;
            }
            this.fillItemCells(newInventorySlots, droppedData, slotIndex);
            this.inventorySlots = newInventorySlots;
            this.updateItemPosition(droppedData, slotIndex);
            this.inventoryStore.updateItem(droppedData.id, { is_equipped: false });
            break;
          }
        }
      }
    }
  },
  async mounted() {
    await this.loadInventory();
    console.log('InventoryView mounted with inventory data');
  },
  setup() {
    const inventoryStore = useInventoryStore();
    return { inventoryStore };
  }
}
</script>
