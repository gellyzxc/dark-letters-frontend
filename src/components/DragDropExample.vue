<template>
  <div class="drag-drop-example">
    <h2>Пример использования DragDropComponent</h2>
    <div class="container-grid">
      <div class="group">
        <h3>Инвентарь (inventory)</h3>
        <div class="slots">
          <drag-drop-component v-for="slot in inventorySlots" :key="slot.id" group-id="inventory" :item-data="slot.item"
            @item-dropped="onItemDropped('inventory', slot.id, $event)">
            <div v-if="slot.item" class="item">
              <div class="icon">{{ slot.item.icon }}</div>
              <span>{{ slot.item.name }}</span>
            </div>
            <template #placeholder>
              <span>Слот {{ slot.id }}</span>
            </template>
          </drag-drop-component>
        </div>
      </div>
      <div class="group">
        <h3>Экипировка (equipment)</h3>
        <div class="slots">
          <drag-drop-component v-for="slot in equipmentSlots" :key="slot.id" group-id="inventory" :item-data="slot.item"
            @item-dropped="onItemDropped('equipment', slot.id, $event)">
            <div v-if="slot.item" class="item">
              <div class="icon">{{ slot.item.icon }}</div>
              <span>{{ slot.item.name }}</span>
            </div>
            <template #placeholder>
              <span>{{ slot.name }}</span>
            </template>
          </drag-drop-component>
        </div>
      </div>
      <div class="group">
        <h3>Магазин (shop)</h3>
        <div class="slots">
          <drag-drop-component v-for="slot in shopSlots" :key="slot.id" group-id="shop" :item-data="slot.item"
            @item-dropped="onItemDropped('shop', slot.id, $event)">
            <div v-if="slot.item" class="item">
              <div class="icon">{{ slot.item.icon }}</div>
              <span>{{ slot.item.name }}</span>
              <span class="price">{{ slot.item.price }}g</span>
            </div>
          </drag-drop-component>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DragDropComponent from './DragDropComponent.vue'
export default {
  name: "DragDropExample",
  components: { DragDropComponent },
  data() {
    return {
      inventorySlots: [
        { id: 1, item: { name: 'Меч', icon: '🗡️', type: 'weapon' } },
        { id: 2, item: { name: 'Щит', icon: '🛡️', type: 'shield' } },
        { id: 3, item: null },
        { id: 4, item: { name: 'Зелье', icon: '🧪', type: 'potion' } },
      ],
      equipmentSlots: [
        { id: 1, name: 'Оружие', item: null },
        { id: 2, name: 'Броня', item: null },
        { id: 3, name: 'Аксессуар', item: null },
      ],
      shopSlots: [
        { id: 1, item: { name: 'Кольцо', icon: '💍', price: 100 } },
        { id: 2, item: { name: 'Амулет', icon: '📿', price: 150 } },
        { id: 3, item: { name: 'Книга', icon: '📖', price: 200 } },
      ]
    }
  },
  methods: {
    onItemDropped(groupName, slotId, { droppedData, currentData }) {
      console.log('Dropped:', { groupName, slotId, droppedData, currentData })
      const targetSlots = this[`${groupName}Slots`]
      const targetSlotIndex = targetSlots.findIndex(s => s.id === slotId)
      if (targetSlotIndex === -1) {
        console.log('Target slot not found')
        return
      }
      let sourceSlotIndex = -1
      let sourceSlotsName = null
      for (const slotsName of ['inventorySlots', 'equipmentSlots']) {
        const slots = this[slotsName]
        const foundIndex = slots.findIndex(s => s.item && s.item.name === droppedData?.name)
        if (foundIndex !== -1) {
          sourceSlotIndex = foundIndex
          sourceSlotsName = slotsName
          break
        }
      }
      if (sourceSlotIndex === -1) {
        console.log('Source slot not found')
        return
      }
      console.log('Found source:', sourceSlotsName, sourceSlotIndex)
      console.log('Found target:', groupName, targetSlotIndex)
      const sourceSlots = this[sourceSlotsName]
      const temp = targetSlots[targetSlotIndex].item
      if (sourceSlotsName === `${groupName}Slots`) {
        const newSlots = [...targetSlots]
        newSlots[targetSlotIndex].item = sourceSlots[sourceSlotIndex].item
        newSlots[sourceSlotIndex].item = temp
        this[`${groupName}Slots`] = newSlots
      } else {
        const newTargetSlots = [...targetSlots]
        const newSourceSlots = [...sourceSlots]
        newTargetSlots[targetSlotIndex].item = sourceSlots[sourceSlotIndex].item
        newSourceSlots[sourceSlotIndex].item = temp
        this[`${groupName}Slots`] = newTargetSlots
        this[sourceSlotsName] = newSourceSlots
      }
      console.log('After swap - target:', this[`${groupName}Slots`][targetSlotIndex])
      console.log('After swap - source:', this[sourceSlotsName][sourceSlotIndex])
    }
  }
}
</script>
<style scoped lang="scss">
.drag-drop-example {
  padding: 2rem;
  color: white;

  h2 {
    margin-bottom: 2rem;
  }

  .container-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;

    .group {
      background: rgba(0, 0, 0, 0.3);
      padding: 1rem;
      border-radius: 8px;

      h3 {
        margin-bottom: 1rem;
      }

      .slots {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;

          .icon {
            font-size: 2rem;
          }

          span {
            font-size: 0.9rem;
          }

          .price {
            color: gold;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
