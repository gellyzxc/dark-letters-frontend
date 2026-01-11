<template>
  <div class="drag-drop-container" :class="{ 'drag-over': shouldHighlight, 'empty': !hasContent, 'invalid-drop': isInvalidDrop }"
    @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
    <div v-if="hasContent" class="drag-item" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd">
      <slot />
    </div>
    <div v-else class="placeholder">
      <slot name="placeholder">
        <span>Drop here</span>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "DragDropComponent",
  props: {
    groupId: {
      type: String,
      required: true,
    },
    itemData: {
      type: Object,
      default: null,
    },
    row: {
      type: Number,
      default: null
    },
    col: {
      type: Number,
      default: null
    },
    slotIndex: {
      type: Number,
      default: null
    },
    gridCols: {
      type: Number,
      default: 8
    },
    gridRows: {
      type: Number,
      default: 8
    },
    occupiedSlots: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['item-dropped', 'item-removed', 'drag-start', 'drag-end'],
  data() {
    return {
      isDragOver: false,
      instanceId: Math.random().toString(36).substr(2, 9),
      dragState: null
    }
  },
  computed: {
    hasContent() {
      return !!this.$slots.default
    },
    shouldHighlight() {
      if (!this.dragState || this.slotIndex === null) {
        return false;
      }
      return this.isPartOfDragArea();
    },
    isInvalidDrop() {
      if (!this.dragState || this.slotIndex === null) {
        return false;
      }
      return this.isPartOfDragArea() && !this.canPlaceItem();
    }
  },
  methods: {
    isPartOfDragArea() {
      // Для equipment slots (где slotIndex === null) не показываем grid-подсветку
      if (this.slotIndex === null) {
        return false;
      }
      
      if (!this.dragState || this.dragState.hoverIndex === null) {
        return false;
      }
      const { itemSize, hoverIndex } = this.dragState;
      if (!itemSize) return false;

      const [width, height] = itemSize;
      const hoverCol = hoverIndex % this.gridCols;
      const hoverRow = Math.floor(hoverIndex / this.gridCols);
      const currentCol = this.slotIndex % this.gridCols;
      const currentRow = Math.floor(this.slotIndex / this.gridCols);

      return (
        currentCol >= hoverCol &&
        currentCol < hoverCol + width &&
        currentRow >= hoverRow &&
        currentRow < hoverRow + height
      );
    },
    canPlaceItem() {
      // Для equipment slots (где slotIndex === null) не применяем grid-валидацию
      if (this.slotIndex === null) {
        return true;
      }
      
      if (!this.dragState || this.dragState.hoverIndex === null) {
        return false;
      }
      const { itemSize, hoverIndex, sourceItemId } = this.dragState;
      if (!itemSize) return true;

      const [width, height] = itemSize;
      const hoverCol = hoverIndex % this.gridCols;
      const hoverRow = Math.floor(hoverIndex / this.gridCols);

      // Проверяем, не выходит ли предмет за границы сетки
      if (hoverCol + width > this.gridCols || hoverRow + height > this.gridRows) {
        return false;
      }

      // Проверяем коллизии с другими предметами
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const checkIndex = hoverIndex + y * this.gridCols + x;
          if (checkIndex >= 0 && checkIndex < this.occupiedSlots.length) {
            const occupiedItem = this.occupiedSlots[checkIndex];
            // Если клетка занята другим предметом (не тем, который перетаскиваем)
            if (occupiedItem && occupiedItem.id !== sourceItemId) {
              return false;
            }
          }
        }
      }

      return true;
    },
    onDragStart(e) {
      if (this.disabled) {
        e.preventDefault()
        return
      }
      const dragData = {
        groupId: this.groupId,
        itemData: this.itemData,
        sourceId: this.instanceId
      }
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('application/json', JSON.stringify(dragData))
      e.target.classList.add('dragging')
      
      // Устанавливаем глобальное состояние перетаскивания
      if (this.itemData && this.itemData.size) {
        window.__dragState = {
          itemSize: this.itemData.size,
          hoverIndex: null,
          sourceItemId: this.itemData.id
        };
      }
      
      this.$emit('drag-start', this.itemData)
    },
    onDragEnd(e) {
      e.target.classList.remove('dragging')
      window.__dragState = null;
      this.dragState = null;
      this.$emit('drag-end', this.itemData)
    },
    onDragOver(e) {
      if (this.disabled) return
      this.isDragOver = true
      
      // Обновляем индекс наведения в глобальном состоянии
      // Создаем новый объект для триггера реактивности
      if (window.__dragState && this.slotIndex !== null) {
        window.__dragState = {
          itemSize: window.__dragState.itemSize,
          sourceItemId: window.__dragState.sourceItemId,
          hoverIndex: this.slotIndex
        };
      }
      
      e.dataTransfer.dropEffect = 'move'
    },
    onDragLeave(e) {
      // Проверяем, что курсор действительно покинул элемент, а не переместился на дочерний
      const rect = this.$el.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        this.isDragOver = false;
        
        // Если это ячейка грида и мы покидаем её, обновляем hoverIndex
        if (window.__dragState && this.slotIndex !== null) {
          // Не сбрасываем состояние полностью, только индекс
          window.__dragState = {
            itemSize: window.__dragState.itemSize,
            sourceItemId: window.__dragState.sourceItemId,
            hoverIndex: null
          };
        }
      }
    },
    onDrop(e) {
      this.isDragOver = false
      if (this.disabled) return
      
      // Проверяем, можно ли разместить предмет в этой позиции
      if (!this.canPlaceItem()) {
        console.log('Cannot place item here - invalid position');
        window.__dragState = null;
        this.dragState = null;
        return;
      }
      
      try {
        const data = e.dataTransfer.getData('application/json')
        if (!data) return
        const dragData = JSON.parse(data)
        if (dragData.groupId === this.groupId && dragData.sourceId !== this.instanceId) {
          this.$emit('item-dropped', {
            droppedData: dragData.itemData,
            currentData: this.itemData,
            row: this.row,
            col: this.col
          })
        }
      } catch (err) {
        console.error('Error handling drop:', err)
      } finally {
        window.__dragState = null;
        this.dragState = null;
      }
    }
  },
  mounted() {
    // Отслеживаем изменения в глобальном состоянии
    this._checkDragState = setInterval(() => {
      if (window.__dragState !== this.dragState) {
        this.dragState = window.__dragState;
      }
    }, 16); // ~60fps для плавной подсветки
  },
  beforeUnmount() {
    if (this._checkDragState) {
      clearInterval(this._checkDragState);
    }
  }
}
</script>
<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.drag-drop-container {
  position: relative;
  min-height: 60px;
  border: 3px solid transparent !important;
  border-radius: $radius-base;
  transition: all $transition-base;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);

  &.drag-over {
    border-color: $color-gold-primary;
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.5),
      $glow-gold-md,
      0 0 40px rgba(255, 255, 255, 0.2);
  }

  &.invalid-drop {
    border-color: #ff4444 !important;
    background: linear-gradient(135deg, rgba(255, 68, 68, 0.15), rgba(200, 0, 0, 0.1)) !important;
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(255, 68, 68, 0.5),
      0 0 40px rgba(255, 68, 68, 0.2) !important;
  }

  &.empty {
    border-color: rgba($color-brown-light, 0.5);
    border-style: dashed;

    &:hover {
      border-color: rgba($color-gold-primary, 0.6);
      background: linear-gradient(135deg, rgba($color-brown-medium, 0.5), rgba($color-brown-accent, 0.4));
    }
  }

  .drag-item {
    cursor: grab;
    user-select: none;
    transition: all $transition-fast;

    &:active {
      cursor: grabbing;
    }

    &.dragging {
      opacity: 0.6;
      cursor: grabbing;
      filter: brightness(1.2);
    }

    &:hover {
      filter: brightness(1.1);
    }
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba($color-brown-light, 0.7);
    font-size: $font-size-sm;
    font-family: 'Cinzel', serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }
}
</style>