<template>
  <div class="drag-drop-container" :class="{ 'drag-over': isDragOver, 'empty': !hasContent }"
    @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop" :style="containerStyle">
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
    computed: {
      hasContent() {
        return !!this.$slots.default
      },
      containerStyle() {
        if (this.itemData && this.itemData.size) {
          const [w, h] = this.itemData.size;
          return {
            gridColumn: `span ${w}`,
            gridRow: `span ${h}`
          };
        }
        return {};
      }
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
      instanceId: Math.random().toString(36).substr(2, 9)
    }
  },
  computed: {
    hasContent() {
      return !!this.$slots.default
    }
  },
  methods: {
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
      this.$emit('drag-start', this.itemData)
    },
    onDragEnd(e) {
      e.target.classList.remove('dragging')
      this.$emit('drag-end', this.itemData)
    },
    onDragOver(e) {
      if (this.disabled) return
      this.isDragOver = true
      e.dataTransfer.dropEffect = 'move'
    },
    onDragLeave(e) {
      if (!this.$el.contains(e.relatedTarget)) {
        this.isDragOver = false
      }
    },
    onDrop(e) {
      this.isDragOver = false
      if (this.disabled) return
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
      }
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
  background: linear-gradient(135deg, rgba($color-brown-dark, 0.4), rgba($color-brown-medium, 0.3));
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);

  &.drag-over {
    border-color: $color-gold-primary;
    background: linear-gradient(135deg, rgba($color-gold-primary, 0.15), rgba($color-gold-dark, 0.1));
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.5),
      $glow-gold-md,
      0 0 40px rgba(255, 255, 255, 0.2);
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
