<template>
  <div class="frame">
    <img :src="frame.image" :style="frame?.imageStyle" class="image" />
    <div class="content" :style="frame.contentStyle">
      <slot />
    </div>
  </div>
</template>
<style scoped lang="scss">
.frame {
  position: relative;
  display: inline-block;
  max-height: 90svh;
  max-width: 80svw;
  .image {
    max-height: 90svh;
    max-width: 80svw;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 10;
    position: relative;
    pointer-events: none;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    color: white;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
    & > * {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
<script>
import { useCharacterStore } from "@/stores/character";
import { API_BASE_URL } from "@/api/client";
import ForgeInventoryFrame from "@/assets/images/frames/forge-iventory-frame.png";
import GameBig from "@/assets/images/frames/game-big.png";
import GameSmallHorizontal from "@/assets/images/frames/game-small-horizontal.png";
import GameSmallVertical from "@/assets/images/frames/game-small-vertical.png";
import GameTimer from "@/assets/images/frames/game-timer.png";
import GenericBigSquaredRounded from "@/assets/images/frames/generic-big-squared-rounded.png";
import GenericCardHorizontal from "@/assets/images/frames/generic-card-horizontal.png";
import InventoryFrame from "@/assets/images/frames/inventory-frame.png";
import ShopFrame from "@/assets/images/frames/shop-frame.png";
import VerticalCard from "@/assets/images/frames/vertical-card.png";
import Bar from "@/assets/images/healthbars/bar-transparent.png";
import Toast from "@/assets/images/frames/toast.png"
const frameSettings = {
  "forge-inventory-frame": {
    contentStyle: {
      padding: "13.8% 0px 0px 3%",
      width: "calc(100% - 6%)",
      height: "calc(100% - 12%)",
    },
    image: ForgeInventoryFrame,
  },
  "toast-base": {
    contentStyle: {
      padding: '2rem 0rem 0rem 2rem',
      height: 'calc(65%)',
      width: 'calc(84%)'
    },
    image: Toast
  },
  "game-big": {
    contentStyle: { zIndex: 9999, padding: "23% 0px 0px 14%", height: "44%", width: "72%" },
    image: GameBig,
  },
  "vertical-card": {
    contentStyle: { padding: "15% 0 0 6.5%", width: "87%", height: "79%" },
    image: VerticalCard,
  },
  "game-small-horizontal": {
    contentStyle: { zIndex: 9999, padding: "18% 0 0 20%", height: "47%", width: "60%" },
    image: GameSmallHorizontal,
  },
  "game-small-vertical": {
    contentStyle: { padding: "30% 0px 0px 27%", height: "66%", width: "47%" },
    image: GameSmallVertical,
  },
  "game-timer": {
    contentStyle: { padding: "3% 0 0 8%", height: "66%", width: "83%" },
    image: GameTimer,
  },
  "generic-big-squared-rounded": {
    contentStyle: {
      padding: "8.35% 0 0 8.11%",
      width: "calc(100% - 16.7%)",
      height: "calc(100% - 15.5%)",
    },
    image: GenericBigSquaredRounded,
  },
  "generic-tall-squared": {
    contentStyle: {
      padding: "8.35% 0 0 8.11%",
      width: "calc(100% - 16.7%)",
      height: "calc(87.5%)",
    },
    imageStyle: {
      height: "100%",
      objectFit: "fill"
    },
    image: GenericBigSquaredRounded,
  },
  "generic-card-horizontal": {
    contentStyle: {
      padding: "9.35% 0 0 8.11%",
      width: "calc(100% - 16.7%)",
      height: "calc(100% - 27.5%)",
    },
    image: GenericCardHorizontal,
  },
  "inventory-frame": {
    contentStyle: { padding: "10% 0 0 10%", height: "78.46%", width: "78.46%" },
    image: InventoryFrame,
  },
  "shop-frame": {
    contentStyle: {
      padding: "6% 0px 0px 7%",
      height: "68.46%",
      width: "85.46%",
    },
    image: ShopFrame,
  },
  bar: {
    contentStyle: { padding: "1% 0px 0px 7%", height: "57%", width: "87%" },
    image: Bar,
  },
};
export default {
  name: "FrameComponent",
  props: {
    type: {
      type: String,
      default: "generic-card-horizontal",
    },
  },
  data() {
    return {
      characterStore: useCharacterStore(),
    };
  },
  async mounted() {
    if (this.type === "game-big") {
      await this.characterStore.fetchCharacter();
    }
  },
  computed: {
    frame() {
      const frame = frameSettings[this.type];
      if (!frame) throw new Error(`Frame type "${this.type}" not found`);
      if (
        this.type === "game-big" &&
        this.characterStore.character?.class?.big_frame
      ) {
        return {
          ...frame,
          image: API_BASE_URL + "static/text_input/assassin_big_frame.png",
        };
      }
      if (
        this.type === "game-small-horizontal" &&
        this.characterStore.character?.class?.small_frame
      ) {
        return {
          ...frame,
          image: API_BASE_URL + this.characterStore.character.class.small_frame,
        };
      }
      return frame;
    },
  },
};
</script>
