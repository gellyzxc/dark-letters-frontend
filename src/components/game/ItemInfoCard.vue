<template>
  <div class="item-info-card" :class="cardClass">
    <div
      class="glow"
      :class="`glow-${item.rarity || 'common'}`"
      v-if="showGlow && itemType !== 'gold'"
    ></div>
    <div class="item-icon" v-if="showIcon && variant !== 'reward'">
      <img v-if="item.photo" :src="getImageUrl(item.photo)" :alt="item.name" />
      <span v-else>{{ item.icon || "📦" }}</span>
    </div>
    <div v-if="variant === 'reward'" class="reward-layout">
      <template v-if="itemType === 'gold'">
        <div class="reward-left">
          <div class="item-name-reward">
            <span class="name-text">Pile of gold</span>
            <span class="description-text"
              >&nbsp;The King's Legendary Offering</span
            >
          </div>
        </div>
        <div class="reward-center">
          <div class="item-icon-reward">
            <img src="@/assets/images/gold.png" alt="Pile of gold" />
          </div>
        </div>
        <div class="reward-right">
          <div class="properties-title">Properties</div>
          <div class="item-bonuses-reward gold-bonuses">
            <div class="bonus-line-reward">
              <span>You can buy or save up for anything you want.</span>
            </div>
          </div>
        </div>
        <div class="reward-bottom-right">
          <span>{{ item.description.match(/\d+/)[0] }} gold</span>
        </div>
      </template>
      <!-- Artifact type reward -->
      <template v-else-if="itemType === 'artifact'">
        <div class="reward-left">
          <div class="item-name-reward">
            <span class="name-text">{{ item.name }}</span>
          </div>
        </div>
        <div class="reward-center">
          <div class="item-icon-reward">
            <img
              v-if="item.photo"
              :src="getImageUrl(item.photo)"
              :alt="item.name"
            />
            <span v-else>{{ item.icon || "📦" }}</span>
          </div>
        </div>
        <div class="reward-right">
          <div class="properties-title">Properties</div>
          <div class="item-bonuses-reward">
            <div class="bonus-line-reward">
              <span>{{ item.description }}</span>
            </div>
          </div>
        </div>
      </template>
      <!-- Item type reward -->
      <template v-else>
        <div class="reward-left">
          <div class="item-name-reward">
            <span class="name-text">{{ item.name }}</span>
            <span class="description-text" v-if="item.description"
              >&nbsp;{{ item.description }}</span
            >
          </div>
        </div>
        <div class="reward-center">
          <div class="item-icon-reward">
            <img
              v-if="item.photo"
              :src="getImageUrl(item.photo)"
              :alt="item.name"
            />
            <span v-else>{{ item.icon || "📦" }}</span>
          </div>
        </div>
        <div class="reward-right">
          <div
            class="properties-title"
            v-if="item.stats && item.stats.length > 0"
          >
            Properties
          </div>
          <div
            class="item-bonuses-reward"
            v-if="item.stats && item.stats.length > 0"
          >
            <div
              v-for="(stat, index) in item.stats"
              :key="index"
              class="bonus-line-reward"
            >
              <span>{{ stat.label }}</span>
            </div>
          </div>
        </div>
        <div class="reward-bottom-right" v-if="item.price">
          <span>Cost {{ item.price }} gold</span>
        </div>
      </template>
    </div>
    <!-- Standard content for other variants -->
    <div class="item-content" v-else>
      <div class="item-header" v-if="showHeader">
        <div class="item-name">
          <span>{{ item.name }}</span>
          <span v-if="item.description" class="item-description"
            >&nbsp;{{ truncatedDescription }}</span
          >
        </div>
        <slot name="header-extra"></slot>
      </div>
      <div class="item-name" v-else>
        <span>{{ item.name }}</span>
        <span v-if="item.description" class="item-description"
          >&nbsp;{{ truncatedDescription }}</span
        >
      </div>
      <div class="item-bonuses" v-if="item.stats && item.stats.length > 0">
        <span
          style="text-align: right; font-size: 1.4rem; margin-bottom: 0.5rem"
          >Properties</span
        >
        <div
          v-for="(stat, index) in item.stats"
          :key="index"
          class="bonus-line"
        >
          <div style="display: contents" v-if="!reforge">
            <span
              class="bonus-label"
              style="white-space: nowrap; text-align: right"
              >{{ stat.label }}</span
            >
          </div>
          <div style="display: contents" v-else>
            <span
              class="bonus-value"
              style="white-space: nowrap; text-align: right"
              >{{
                stat.label
                  .replace(new RegExp("[0-9]+"), stat.value)
                  .replace("%%", "%")
              }}</span
            >
          </div>
        </div>
        <span
          style="
            position: absolute;
            bottom: 12px;
            right: 12px;
            font-size: 1.1rem;
          "
          >{{ item.price }} gold</span
        >
      </div>
      <slot name="actions"></slot>
    </div>
  </div>
</template>
<script>
import { API_BASE_URL } from "@/api/client";
export default {
  name: "ItemInfoCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
    itemType: {
      type: String,
      default: "item",
    },
    reforge: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: "tooltip", // 'tooltip', 'preview', 'reward'
      validator: (value) => ["tooltip", "preview", "reward"].includes(value),
    },
    showGlow: {
      type: Boolean,
      default: true,
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cardClass() {
      return `variant-${this.variant}`;
    },
    getImageUrl() {
      return (photoPath) => {
        if (!photoPath) return null;
        return `${API_BASE_URL}/${photoPath}`;
      };
    },
    truncatedDescription() {
      if (!this.item.description) return "";
      return this.item.description.length > 64
        ? this.item.description.substring(0, 64) + "..."
        : this.item.description;
    },
  },
};
</script>
<style scoped lang="scss">
@use "@/assets/styles/variables" as *;
.item-info-card {
  height: calc(100% - 1.6rem) !important;
  width: calc(100% - 2rem) !important;
  position: relative;
  background: black;
  color: $color-text-primary;
  .item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    animation: iconBounce 1s ease-out;
    filter: drop-shadow(0 2px 12px white);
    span {
      font-size: 6rem;
    }
    img {
      width: 150px;
      height: 150px;
      object-fit: contain;
    }
  }
  .item-content {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }
  .item-name {
    color: #ffffff;
    letter-spacing: 0.01em;
    line-height: 1.2;
    text-shadow: 0 1px 2px #000;
  }
  .item-description {
    color: #7b7b7b;
  }
  .item-bonuses {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    .bonus-line {
      font-size: 0.9rem;
      color: #ffffff;
      display: flex;
      justify-content: flex-end;
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
  &.variant-tooltip {
    padding: 0.8rem 1rem;
    min-width: 250px;
    .item-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .item-name {
      width: 60%;
      font-size: 1.4rem;
      margin-bottom: 0.2rem;
    }
    .item-bonuses .bonus-line {
      font-size: 1rem;
      span {
        color: #7b7b7b !important;
      }
    }
  }
  &.variant-preview {
    width: 600px;
    height: 400px;
    border-radius: 18px;
    box-shadow:
      0 0 24px 4px #1a1310,
      0 0 0 2px #3a2a1a,
      0 0 0 8px rgba(212, 175, 55, 0.08);
    padding: 1rem;
    .item-content {
      gap: 1.2rem;
    }
    .item-name {
      font-size: 2rem !important;
      text-shadow:
        0 2px 8px #000,
        0 0 2px #d4af37;
    }
    .item-description {
      font-size: unset !important;
      line-height: 1.5;
    }
    .item-bonuses {
      gap: 0.5rem;
      .bonus-line {
        font-size: 1.1rem;
        .bonus-label {
          min-width: 90px;
          text-align: right;
        }
      }
    }
  }
  &.variant-reward {
    width: calc(100% - 2rem) !important;
    height: calc(100% - 2rem) !important;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: relative;
    .reward-layout {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr;
      grid-template-rows: 1fr auto;
      gap: 1rem;
      position: relative;
    }
    .reward-left {
      grid-column: 1;
      grid-row: 1;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      justify-content: flex-start;
      .item-name-reward {
        font-size: 1.4rem;
        font-family: $font-family-primary;
        line-height: 1.2;
        .name-text {
          color: white;
        }
        .description-text {
          color: #7b7b7b;
        }
      }
    }
    .reward-center {
      grid-column: 2;
      grid-row: 1 / 3;
      display: flex;
      align-items: center;
      justify-content: center;
      .item-icon-reward {
        display: flex;
        align-items: center;
        justify-content: center;
        animation: iconBounce 1s ease-out;
        filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.8));
        max-height: 50%;
        span {
          font-size: 8rem;
        }
        img {
          max-height: 80%;
          max-width: 80%;
          border-radius: 1rem;
          object-fit: contain;
        }
      }
    }
    .reward-right {
      grid-column: 3;
      grid-row: 1;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      align-items: flex-end;
      justify-content: flex-start;
      .properties-title {
        font-size: 1.4rem;
        color: white;
        font-family: $font-family-primary;
        text-align: right;
      }
      .item-bonuses-reward {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        align-items: flex-end;
        .bonus-line-reward {
          font-size: 1.4rem;
          color: #7b7b7b;
          font-family: $font-family-primary;
          text-align: right;
        }
        &.gold-bonuses .bonus-line-reward {
          font-size: 1.4rem;
        }
      }
    }
    .reward-bottom-right {
      grid-column: 3;
      grid-row: 2;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      span {
        font-size: 1.4rem;
        color: white;
        font-family: $font-family-primary;
      }
    }
    ::v-deep .reward-navigation-inline {
      grid-column: 1;
      grid-row: 2;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
    }
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
</style>
