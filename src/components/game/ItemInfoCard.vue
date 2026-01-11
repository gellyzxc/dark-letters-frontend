<template>
    <div class="item-info-card" :class="cardClass">
        <div class="glow" :class="`glow-${item.rarity || 'common'}`" v-if="showGlow"></div>

        <div class="item-icon" v-if="showIcon">
            <img v-if="item.photo" :src="getImageUrl(item.photo)" :alt="item.name" />
            <span v-else>{{ item.icon || '📦' }}</span>
        </div>

        <div class="item-content">
            <div class="item-header" v-if="showHeader">
                <div class="item-name">
                <span>{{ item.name }}</span>
                <span v-if="item.description" class="item-description">&nbsp;{{ truncatedDescription }}</span>
            </div>
                <slot name="header-extra"></slot>
            </div>

            <div class="item-name" v-else>
                <span>{{ item.name }}</span>
                <span v-if="item.description" class="item-description">&nbsp;{{ truncatedDescription }}</span>
            </div>

            <div class="item-bonuses" v-if="item.stats && item.stats.length > 0">
                <span style="text-align: right; font-size: 1.4rem; margin-bottom: 0.5rem;">Properties</span>
                <div v-for="(stat, index) in item.stats" :key="index" class="bonus-line">
                    <span class="bonus-label" style="white-space: nowrap;">{{ stat.label }}</span>
                    <span class="bonus-value">{{ stat.value }}</span>
                </div>
                <span style="position: absolute; bottom: 12px; right: 12px; font-size: 1.1rem;">{{ item.price }} gold</span>
            </div>

            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script>
import { API_BASE_URL } from '@/api/client';

export default {
    name: 'ItemInfoCard',
    props: {
        item: {
            type: Object,
            required: true
        },
        variant: {
            type: String,
            default: 'tooltip', // 'tooltip', 'preview', 'reward'
            validator: (value) => ['tooltip', 'preview', 'reward'].includes(value)
        },
        showGlow: {
            type: Boolean,
            default: true
        },
        showIcon: {
            type: Boolean,
            default: false
        },
        showHeader: {
            type: Boolean,
            default: false
        }
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
            if (!this.item.description) return '';
            return this.item.description.length > 64 
                ? this.item.description.substring(0, 64) + '...' 
                : this.item.description;
        }
    }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

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
        color: #7B7B7B;
    }

    .item-bonuses {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;

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

    // Tooltip variant
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
                color: #7B7B7B !important;
            }
        }
    }

    // Preview variant (большая модалка)
    &.variant-preview {
        width: 600px;
        height: 400px;
        border-radius: 18px;
        box-shadow: 0 0 24px 4px #1a1310, 0 0 0 2px #3a2a1a, 0 0 0 8px rgba(212, 175, 55, 0.08);
        padding: 1rem;

        .item-content {
            gap: 1.2rem;
        }

        .item-name {
            font-size: 2rem !important;
            text-shadow: 0 2px 8px #000, 0 0 2px #d4af37;
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

    // Reward variant
    &.variant-reward {
        width: 100%;
        height: 100%;
        border-radius: 18px;
        box-shadow: 0 0 24px 4px #1a1310, 0 0 0 2px #3a2a1a, 0 0 0 8px white;
        padding: 0.8rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        .item-content {
            width: 100%;
        }

        .item-name {
            font-size: 1.5rem;
            text-align: center;
            text-shadow: 0 2px 8px #000, 0 0 2px #d4af37;
        }

        .item-description {
            font-size: 0.9rem;
        }

        .item-bonuses {
            .bonus-line {
                font-size: 0.95rem;

                .bonus-label {
                    min-width: 90px;
                    text-align: right;
                }
            }
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
