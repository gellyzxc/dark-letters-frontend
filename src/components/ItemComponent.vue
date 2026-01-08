<template>
  <div class="item-component" :class="`item-${displayType}`">
    <div class="icon">{{ itemData.icon }}</div>
    <div v-if="displayType === 'expanded'" class="details">
      <span class="name">{{ itemData.name }}</span>
      <span v-if="itemType" class="type" :class="`type-${itemType}`">{{ itemTypeLabel }}</span>
    </div>
    <span v-else-if="displayType === 'inventory'" class="name">{{ itemData.name }}</span>
  </div>
</template>
<script>
export default {
  name: "ItemComponent",
  props: {
    itemData: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.icon && value.name && value.type
      }
    },
    displayType: {
      type: String,
      default: 'inventory',
      validator: (value) => ['inventory', 'expanded'].includes(value)
    }
  },
  computed: {
    itemType() {
      if (this.displayType !== 'expanded') return null
      const typeMap = {
        'weapon': 'sword',
        'armor': 'cloth',
        'amulet': 'amulet'
      }
      return typeMap[this.itemData.type] || null
    },
    itemTypeLabel() {
      const labels = {
        'sword': '⚔️ Weapon',
        'cloth': '🛡️ Armor',
        'amulet': '💎 Amulet'
      }
      return labels[this.itemType] || this.itemData.type
    }
  }
}
</script>
<style scoped lang="scss">
.item-component {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .icon {
    font-size: 2rem;
  }

  .name {
    font-size: 0.7rem;
    color: white;
    text-align: center;
    word-break: break-word;
  }

  &.item-inventory {
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.25rem;

    .icon {
      font-size: 2rem;
    }

    .name {
      font-size: 0.7rem;
    }
  }

  &.item-expanded {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;

    .icon {
      font-size: 3rem;
    }

    .details {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      width: 100%;

      .name {
        font-size: 1rem;
        font-weight: 600;
        color: white;
      }

      .type {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;

        &.type-sword {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(184, 134, 11, 0.2));
          color: #D4AF37;
          border: 1px solid rgba(212, 175, 55, 0.4);
        }

        &.type-cloth {
          background: linear-gradient(135deg, rgba(70, 130, 180, 0.2), rgba(30, 90, 140, 0.2));
          color: #5B9BD5;
          border: 1px solid rgba(70, 130, 180, 0.4);
        }

        &.type-amulet {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(107, 33, 168, 0.2));
          color: #C084FC;
          border: 1px solid rgba(147, 51, 234, 0.4);
        }
      }
    }
  }
}
</style>
