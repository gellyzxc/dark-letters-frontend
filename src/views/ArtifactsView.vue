<template>
  <div class="page artifacts-view">
    <div class="main">
      <div class="row opened-cards">
        <frame-component v-for="slot in cardSlots" :key="slot.id" class="frame" type="vertical-card">
          <drag-drop-component class="frame-slot" group-id="artifacts" :item-data="slot.card"
            @item-dropped="handleCardDropped(slot.id, $event)">
            <img v-if="slot.card" :src="slot.card.imageUrl" :alt="slot.card.name" @click="handleCardClick(slot)"
              class="clickable-card" />
            <template #placeholder>
              <div class="empty-frame-placeholder">
                <span>Empty Slot</span>
              </div>
            </template>
          </drag-drop-component>
        </frame-component>
      </div>
      <div class="row closed-cards">
        <div v-for="card in [...availableCards, ...closedCards]" :key="card.id" class="card-container">
          <drag-drop-component group-id="artifacts" :item-data="card" :disabled="!card.isFlipped"
            @item-dropped="() => { }" :class="{ 'flipped-card-drag': card.isFlipped }">
            <div class="card-simple">
              <img v-if="card.isFlipped" :src="card.imageUrl" :alt="card.name" />
              <img v-else :src="closedCardImageUrl" alt="Closed card" />
            </div>
          </drag-drop-component>
        </div>
      </div>
    </div>
  </div>
  <div class="bg" />
</template>
<script>
import FrameComponent from "@/components/game/FrameComponent.vue";
import DragDropComponent from "@/components/DragDropComponent.vue";
import TestCardImage from "@/assets/images/cards/test.png";
import ClosedCardImage from "@/assets/images/cards/closed.png";
import { useArtifactsStore } from "@/stores/artifacts";
import { API_BASE_URL } from "@/api/client";
const BASE_URL = API_BASE_URL;
export default {
  name: "ArtifactsView",
  components: { FrameComponent, DragDropComponent },
  data() {
    return {
      closedCardImageUrl: ClosedCardImage,
      cardSlots: [
        { id: 1, card: null },
        { id: 2, card: null },
        { id: 3, card: null },
        { id: 4, card: null },
        { id: 5, card: null },
      ],
      availableCards: [],
      closedCards: [],
      totalArtifactsCount: 8
    };
  },
  computed: {
    getImageUrl() {
      return (photoPath) => {
        if (!photoPath) return TestCardImage;
        return `${BASE_URL}/${photoPath}`;
      };
    },
    getArtifactName() {
      return (artifact) => {
        if (!artifact.photo) return `Artifact #${artifact.id}`;
        const match = artifact.photo.match(/\/(\d+)_(.+)\.png$/);
        return match ? match[2].replace(/_/g, ' ') : `Artifact #${artifact.id}`;
      };
    }
  },
  methods: {
    async loadArtifacts() {
      try {
        const data = await this.artifactsStore.fetchArtifacts();
        const equippedArtifacts = data.equipped || [];
        equippedArtifacts.forEach((artifact, index) => {
          if (index < this.cardSlots.length) {
            this.cardSlots[index].card = this.transformArtifact(artifact, true);
          }
        });
        const inventoryArtifacts = data.inventory || [];
        this.availableCards = inventoryArtifacts.map(artifact =>
          this.transformArtifact(artifact, true)
        );
        const openedCount = equippedArtifacts.length + inventoryArtifacts.length;
        const closedCount = Math.max(0, this.totalArtifactsCount - openedCount);
        this.closedCards = Array.from({ length: closedCount }, (_, i) => ({
          id: `closed_${i}`,
          isFlipped: false
        }));
        console.log('Artifacts loaded:', {
          equipped: equippedArtifacts.length,
          inventory: inventoryArtifacts.length,
          closed: closedCount
        });
      } catch (error) {
        console.error('Failed to load artifacts:', error);
      }
    },
    transformArtifact(apiArtifact, isFlipped = false) {
      return {
        id: apiArtifact.id,
        name: this.getArtifactName(apiArtifact),
        imageUrl: this.getImageUrl(apiArtifact.photo),
        buffSkill: apiArtifact.buff_skill,
        buffType: apiArtifact.buff_type,
        value: apiArtifact.value,
        isEquipped: apiArtifact.is_equipped,
        isFlipped: isFlipped
      };
    },
    flipCard(card) {
      card.isFlipped = true;
    },
    async handleCardClick(slot) {
      if (!slot.card) return;
      const slotIndex = this.cardSlots.findIndex(s => s.id === slot.id);
      if (slotIndex === -1) return;
      try {
        await this.artifactsStore.unequipArtifact(slot.card.id);
        this.availableCards.push({ ...slot.card, isFlipped: true, isEquipped: false });
        this.cardSlots[slotIndex].card = null;
      } catch (error) {
        console.error('Failed to unequip artifact:', error);
        await this.loadArtifacts();
      }
    },
    async handleCardRemoved({ droppedData }) {
      const fromSlotIndex = this.cardSlots.findIndex(
        s => s.card && s.card.id === droppedData.id
      );
      if (fromSlotIndex !== -1) {
        try {
          await this.artifactsStore.unequipArtifact(droppedData.id);
          this.availableCards.push({ ...droppedData, isFlipped: true, isEquipped: false });
          this.cardSlots[fromSlotIndex].card = null;
        } catch (error) {
          console.error('Failed to unequip artifact:', error);
          await this.loadArtifacts();
        }
      }
    },
    async handleCardDropped(targetSlotId, { droppedData, currentData }) {
      const targetSlotIndex = this.cardSlots.findIndex(s => s.id === targetSlotId);
      if (targetSlotIndex === -1) return;
      const fromSlotIndex = this.cardSlots.findIndex(
        s => s.card && s.card.id === droppedData.id
      );
      try {
        if (fromSlotIndex !== -1) {
          if (currentData) {
            const temp = this.cardSlots[targetSlotIndex].card;
            this.cardSlots[targetSlotIndex].card = this.cardSlots[fromSlotIndex].card;
            this.cardSlots[fromSlotIndex].card = temp;
          } else {
            this.cardSlots[targetSlotIndex].card = this.cardSlots[fromSlotIndex].card;
            this.cardSlots[fromSlotIndex].card = null;
          }
        } else {
          const cardIndex = this.availableCards.findIndex(c => c.id === droppedData.id);
          if (cardIndex !== -1 && this.availableCards[cardIndex].isFlipped) {
            if (currentData) {
              await this.artifactsStore.unequipArtifact(currentData.id);
              this.availableCards.push({ ...currentData, isFlipped: true, isEquipped: false });
            }
            await this.artifactsStore.equipArtifact(droppedData.id);
            this.cardSlots[targetSlotIndex].card = { ...droppedData, isEquipped: true };
            this.availableCards.splice(cardIndex, 1);
          }
        }
      } catch (error) {
        console.error('Failed to update artifact:', error);
        await this.loadArtifacts();
      }
    }
  },
  async mounted() {
    await this.loadArtifacts();
  },
  setup() {
    const artifactsStore = useArtifactsStore();
    return { artifactsStore };
  }
};
</script>
<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.page {
  background-image: url('@/assets/images/background/artifacts.png');
  background-size: cover;
  padding: $spacing-xl;
  height: 100%;

  .main {
    display: flex;
    flex-direction: column;
    gap: $spacing-2xl;
    margin: 0 auto;

    .row {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: $spacing-2xl;
      flex-wrap: wrap;

      &.opened-cards {
        flex-wrap: nowrap;
        width: 100%;
        gap: $spacing-md;

        .frame {
          flex: 1 1 0;
          min-width: 0;
          max-width: min(calc((100vw - 4rem - 6rem) / 5), 500px);
          min-height: 300px;

          .frame-slot {
            overflow: hidden;
            height: 100%;
            min-height: 300px;

            img {
              height: 100%;
              width: 100%;
              object-fit: contain;
              transition: transform $transition-base, filter $transition-base;

              &:hover {
                transform: scale(1.01);
                filter: drop-shadow($shadow-sm) drop-shadow($glow-gold-sm);
              }
            }

            .empty-frame-placeholder {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100%;
              min-height: 300px;
              color: rgba($color-brown-light, 0.5);
              font-family: 'Cinzel', serif;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              font-size: 14px;
            }
          }
        }
      }

      &.closed-cards {
        max-width: calc(284px * 1.5 * 5 + 3rem);
        margin: 0 auto;
      }
    }
  }
}

.remove-zone {
  width: calc(284px * 1.0);
  height: calc(390px * 1.0);
  margin-right: $spacing-md;

  .remove-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: rgba($color-gold-primary, 0.6);
    font-family: 'Cinzel', serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 14px;
    text-align: center;
    padding: $spacing-md;
  }

  &.drag-over {
    border-color: rgba($color-gold-primary, 0.8) !important;
    background: linear-gradient(135deg, rgba($color-gold-primary, 0.2), rgba($color-gold-dark, 0.15)) !important;
    box-shadow: 0 0 30px rgba($color-gold-primary, 0.5) !important;
  }
}

.card-container {
  width: calc(284px * 1.0);
  height: calc(390px * 1.0);
}

.card-simple {
  width: 100%;
  height: 100%;
  min-height: 390px;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-md, 0 0 10px rgba($color-brown-light, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.1);
  transition: transform $transition-base, box-shadow $transition-base;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.flipped-card-drag {
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;

  &>* {
    height: 100%;
  }

  &.drag-over {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }

  &.empty {
    border: none !important;
  }
}
</style>