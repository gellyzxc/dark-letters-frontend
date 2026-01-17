<template>
  <div class="node-editor">
    <div class="editor-header">
      <h1>Skill Tree Node Editor</h1>
      <div class="controls">
        <button @click="exportJSON" class="btn-export">Export JSON</button>
        <button @click="importJSONFn" class="btn-import">Import JSON</button>
        <button @click="resetView" class="btn-reset">Reset View</button>
        <label class="btn-import file-upload">
          Load Background
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            style="display: none"
          />
        </label>
        <button
          @click="clearBackground"
          class="btn-reset"
          v-if="backgroundImage"
        >
          Clear BG
        </button>
      </div>
    </div>
    <div class="editor-container">
      <div ref="canvasContainer" class="canvas-container">
        <svg
          ref="svgCanvas"
          class="svg-canvas"
          @mousedown="handleCanvasMouseDown"
          @mousemove="handleCanvasMouseMove"
          @mouseup="handleCanvasMouseUp"
          @wheel="handleWheel"
        >
          <g
            :transform="`translate(${viewOffset.x}, ${viewOffset.y}) scale(${zoom})`"
          >
            <defs>
              <pattern
                id="grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="50"
                  height="50"
                  fill="none"
                  stroke="#2a2a2a"
                  stroke-width="0.5"
                />
              </pattern>
            </defs>
            <rect
              x="-5000"
              y="-5000"
              width="10000"
              height="10000"
              fill="url(#grid)"
            />
            <image
              v-if="backgroundImage"
              :href="backgroundImage"
              :x="bgPosition.x"
              :y="bgPosition.y"
              :width="bgSize.width"
              :height="bgSize.height"
              :opacity="bgOpacity"
              class="background-image"
            />
            <line
              x1="-5000"
              y1="0"
              x2="5000"
              y2="0"
              stroke="#3a3a3a"
              stroke-width="2"
            />
            <line
              x1="0"
              y1="-5000"
              x2="0"
              y2="5000"
              stroke="#3a3a3a"
              stroke-width="2"
            />
            <g class="links">
              <line
                v-for="link in links"
                :key="`${link.from}-${link.to}`"
                :x1="getNodeById(link.from)?.x || 0"
                :y1="getNodeById(link.from)?.y || 0"
                :x2="getNodeById(link.to)?.x || 0"
                :y2="getNodeById(link.to)?.y || 0"
                stroke="#4a3828"
                stroke-width="3"
                class="link-line"
              />
            </g>
            <g class="nodes">
              <g
                v-for="node in nodes"
                :key="node.uid"
                :transform="`translate(${node.x}, ${node.y})`"
                @mousedown.stop="handleNodeMouseDown($event, node)"
                class="node"
                :class="{ selected: selectedNode?.uid === node.uid }"
              >
                <circle
                  r="25"
                  :fill="node.uid === 0 ? '#d4a574' : '#4a3828'"
                  :stroke="
                    selectedNode?.uid === node.uid ? '#ffd7a3' : '#8a7a6a'
                  "
                  stroke-width="2"
                  class="node-circle"
                />
                <text
                  text-anchor="middle"
                  dy="5"
                  fill="white"
                  font-size="14"
                  font-weight="bold"
                  pointer-events="none"
                >
                  {{ node.uid }}
                </text>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <div class="sidebar">
        <div class="sidebar-section">
          <h3>Selected Node</h3>
          <div v-if="selectedNode" class="node-info">
            <div class="info-row">
              <label>UID:</label>
              <span>{{ selectedNode.uid }}</span>
            </div>
            <div class="info-row">
              <label>Name:</label>
              <input
                v-model="selectedNode.name"
                type="text"
                class="input-text"
              />
            </div>
            <div class="info-row">
              <label>Value:</label>
              <textarea
                v-model="selectedNode.value"
                class="input-textarea"
              ></textarea>
            </div>
            <div class="info-row">
              <label>X:</label>
              <input
                v-model.number="selectedNode.x"
                type="number"
                class="input-number"
              />
            </div>
            <div class="info-row">
              <label>Y:</label>
              <input
                v-model.number="selectedNode.y"
                type="number"
                class="input-number"
              />
            </div>
            <div class="info-row">
              <label>Image:</label>
              <input
                v-model="selectedNode.image"
                type="text"
                class="input-text"
              />
            </div>
          </div>
          <div v-else class="no-selection">Click on a node to edit</div>
        </div>
        <div class="sidebar-section">
          <h3>Actions</h3>
          <button @click="addNode" class="btn-action">Add Node</button>
          <button
            @click="deleteNode"
            class="btn-action"
            :disabled="!selectedNode || selectedNode.uid === 0"
          >
            Delete Node
          </button>
          <button @click="addLink" class="btn-action">Add Link</button>
          <button @click="deleteLink" class="btn-action">Delete Link</button>
        </div>
        <div class="sidebar-section">
          <h3>Statistics</h3>
          <div class="stats">
            <div class="stat-item">Nodes: {{ nodes.length }}</div>
            <div class="stat-item">Links: {{ links.length }}</div>
            <div class="stat-item">Zoom: {{ (zoom * 100).toFixed(0) }}%</div>
          </div>
        </div>
        <div class="sidebar-section" v-if="backgroundImage">
          <h3>Background Image</h3>
          <div class="bg-controls">
            <div class="info-row">
              <label>Opacity:</label>
              <input
                v-model.number="bgOpacity"
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="input-range"
              />
              <span>{{ (bgOpacity * 100).toFixed(0) }}%</span>
            </div>
            <div class="info-row">
              <label>Width:</label>
              <input
                v-model.number="bgSize.width"
                type="number"
                class="input-number"
              />
            </div>
            <div class="info-row">
              <label>Height:</label>
              <input
                v-model.number="bgSize.height"
                type="number"
                class="input-number"
              />
            </div>
            <div class="info-row">
              <label>X Position:</label>
              <input
                v-model.number="bgPosition.x"
                type="number"
                class="input-number"
              />
            </div>
            <div class="info-row">
              <label>Y Position:</label>
              <input
                v-model.number="bgPosition.y"
                type="number"
                class="input-number"
              />
            </div>
            <button @click="centerBackground" class="btn-action">
              Center Background
            </button>
            <button
              @click="lockAspectRatio = !lockAspectRatio"
              class="btn-action"
            >
              {{ lockAspectRatio ? "Unlock" : "Lock" }} Aspect Ratio
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showExportModal"
      class="modal-overlay"
      @click="showExportModal = false"
    >
      <div class="modal-content" @click.stop>
        <h2>Exported JSON</h2>
        <textarea
          v-model="exportedJSON"
          readonly
          class="json-output"
        ></textarea>
        <div class="modal-actions">
          <button @click="copyToClipboard" class="btn-copy">
            Copy to Clipboard
          </button>
          <button @click="showExportModal = false" class="btn-close">
            Close
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="showImportModal"
      class="modal-overlay"
      @click="showImportModal = false"
    >
      <div class="modal-content" @click.stop>
        <h2>Import JSON</h2>
        <textarea
          v-model="importJSON"
          class="json-output"
          placeholder="Paste JSON here..."
        ></textarea>
        <div class="modal-actions">
          <button @click="performImport" class="btn-copy">Import</button>
          <button @click="showImportModal = false" class="btn-close">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import nodesData from "@/nodes.json";
const nodes = ref([...nodesData.nodes]);
const links = ref([...nodesData.links]);
const selectedNode = ref(null);
const zoom = ref(1);
const viewOffset = ref({ x: 600, y: 400 });
const canvasContainer = ref(null);
const svgCanvas = ref(null);
const isDragging = ref(false);
const draggedNode = ref(null);
const isPanning = ref(false);
const lastMousePos = ref({ x: 0, y: 0 });
const showExportModal = ref(false);
const showImportModal = ref(false);
const exportedJSON = ref("");
const importJSON = ref("");
const backgroundImage = ref(null);
const bgOpacity = ref(0.5);
const bgSize = ref({ width: 1200, height: 800 });
const bgPosition = ref({ x: -600, y: -400 });
const lockAspectRatio = ref(true);
const originalAspectRatio = ref(1);
function getNodeById(uid) {
  return nodes.value.find((n) => n.uid === uid);
}
function handleNodeMouseDown(event, node) {
  event.preventDefault();
  selectedNode.value = node;
  isDragging.value = true;
  draggedNode.value = node;
}
function handleCanvasMouseDown(event) {
  if (event.button === 0 && !isDragging.value) {
    isPanning.value = true;
    lastMousePos.value = { x: event.clientX, y: event.clientY };
    selectedNode.value = null;
  }
}
function handleCanvasMouseMove(event) {
  if (isDragging.value && draggedNode.value) {
    const rect = svgCanvas.value.getBoundingClientRect();
    const x = (event.clientX - rect.left - viewOffset.value.x) / zoom.value;
    const y = (event.clientY - rect.top - viewOffset.value.y) / zoom.value;
    draggedNode.value.x = Math.round(x);
    draggedNode.value.y = Math.round(y);
  } else if (isPanning.value) {
    const dx = event.clientX - lastMousePos.value.x;
    const dy = event.clientY - lastMousePos.value.y;
    viewOffset.value.x += dx;
    viewOffset.value.y += dy;
    lastMousePos.value = { x: event.clientX, y: event.clientY };
  }
}
function handleCanvasMouseUp() {
  isDragging.value = false;
  draggedNode.value = null;
  isPanning.value = false;
}
function handleWheel(event) {
  event.preventDefault();
  const delta = event.deltaY > 0 ? 0.9 : 1.1;
  const newZoom = Math.max(0.1, Math.min(3, zoom.value * delta));
  zoom.value = newZoom;
}
function resetView() {
  zoom.value = 1;
  viewOffset.value = { x: 600, y: 400 };
}
function addNode() {
  const maxUid = Math.max(...nodes.value.map((n) => n.uid));
  const newNode = {
    uid: maxUid + 1,
    name: `New Node ${maxUid + 1}`,
    value: "",
    x: 0,
    y: 0,
    image: "1",
  };
  nodes.value.push(newNode);
  selectedNode.value = newNode;
}
function deleteNode() {
  if (!selectedNode.value || selectedNode.value.uid === 0) return;
  const uid = selectedNode.value.uid;
  nodes.value = nodes.value.filter((n) => n.uid !== uid);
  links.value = links.value.filter((l) => l.from !== uid && l.to !== uid);
  selectedNode.value = null;
}
function addLink() {
  if (!selectedNode.value) {
    this.$toast.show("Select a node first");
    return;
  }
  const fromUid = selectedNode.value.uid;
  const toUidStr = prompt("Enter target node UID:");
  if (!toUidStr) return;
  const toUid = parseInt(toUidStr);
  const targetNode = getNodeById(toUid);
  if (!targetNode) {
    this.$toast.show("Node not found");
    return;
  }
  const linkExists = links.value.some(
    (l) =>
      (l.from === fromUid && l.to === toUid) ||
      (l.from === toUid && l.to === fromUid),
  );
  if (linkExists) {
    this.$toast.show("Link already exists");
    return;
  }
  links.value.push({ from: fromUid, to: toUid });
}
function deleteLink() {
  if (!selectedNode.value) {
    this.$toast.show("Select a node first");
    return;
  }
  const uid = selectedNode.value.uid;
  const connectedLinks = links.value
    .map((l, index) => ({ link: l, index }))
    .filter(({ link }) => link.from === uid || link.to === uid);
  if (connectedLinks.length === 0) {
    this.$toast.show("No links connected to this node");
    return;
  }
  const linkDescription = connectedLinks
    .map(({ link, index }) => `${index}: ${link.from} -> ${link.to}`)
    .join("\n");
  const indexStr = prompt(
    `Select link to delete:\n${linkDescription}\n\nEnter index:`,
  );
  if (!indexStr) return;
  const index = parseInt(indexStr);
  if (index >= 0 && index < links.value.length) {
    links.value.splice(index, 1);
  }
}
function exportJSON() {
  const data = {
    nodes: nodes.value,
    links: links.value,
  };
  exportedJSON.value = JSON.stringify(data, null, 2);
  showExportModal.value = true;
}
function importJSONFn() {
  importJSON.value = "";
  showImportModal.value = true;
}
function performImport() {
  try {
    const data = JSON.parse(importJSON.value);
    if (data.nodes && data.links) {
      nodes.value = data.nodes;
      links.value = data.links;
      showImportModal.value = false;
      selectedNode.value = null;
    } else {
      this.$toast.show("Invalid JSON format");
    }
  } catch (e) {
    this.$toast.show("Error parsing JSON: " + e.message);
  }
}
function copyToClipboard() {
  navigator.clipboard.writeText(exportedJSON.value).then(() => {
    this.$toast.show("Copied to clipboard!");
  });
}
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      backgroundImage.value = e.target.result;
      bgSize.value = { width: img.width, height: img.height };
      originalAspectRatio.value = img.width / img.height;
      centerBackground();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function clearBackground() {
  backgroundImage.value = null;
}
function centerBackground() {
  bgPosition.value = {
    x: -bgSize.value.width / 2,
    y: -bgSize.value.height / 2,
  };
}
function handleKeyDown(event) {
  if (
    event.key === "Delete" &&
    selectedNode.value &&
    selectedNode.value.uid !== 0
  ) {
    deleteNode();
  }
}
const bgSizeHandler = {
  get(target, prop) {
    return target[prop];
  },
  set(target, prop, value) {
    if (lockAspectRatio.value && originalAspectRatio.value) {
      if (prop === "width") {
        target.width = value;
        target.height = Math.round(value / originalAspectRatio.value);
      } else if (prop === "height") {
        target.height = value;
        target.width = Math.round(value * originalAspectRatio.value);
      }
    } else {
      target[prop] = value;
    }
    return true;
  },
};
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  const originalSize = bgSize.value;
  bgSize.value = new Proxy(originalSize, bgSizeHandler);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>
<style scoped lang="scss">
$active-width: 70svw;
$color-gold-primary: #d4af37;
$color-gold-light: #e6c76f;
$color-gold-dark: #b8941f;
$color-text-primary: #e0d8c0;
$color-text-secondary: #c9c4ba;
$color-text-disabled: #7b7b7b;
$color-text-brown: #464040;
$color-bg-base: #0a0a0a;
$color-bg-elevated: #1a1a1a;
$color-bg-overlay: rgba(0, 0, 0, 0.85);
$color-bg-modal: rgba(0, 0, 0, 0.95);
$color-brown-dark: #1a1310;
$color-brown-medium: #3a2a1a;
$color-brown-light: #8b7355;
$color-brown-accent: #4a3828;
$color-error: #ff4444;
$color-success: #4caf50;
$color-info: #2196f3;
$font-family-primary: "JetBrains Mono", "Fira Mono", Consolas, monospace;
$font-family-display:
  system-ui,
  -apple-system,
  sans-serif;
$font-size-xs: 0.75rem;
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-size-xl: 1.25rem;
$font-size-2xl: 1.5rem;
$font-size-3xl: 2rem;
$font-size-4xl: 3rem;
$font-size-5xl: 5rem;
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$line-height-tight: 1;
$line-height-normal: 1.5;
$line-height-relaxed: 2;
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;
$spacing-2xl: 3rem;
$spacing-3xl: 4rem;
$radius-xs: 4px;
$radius-sm: 6px;
$radius-base: 8px;
$radius-lg: 12px;
$radius-xl: 18px;
$transition-fast: 0.2s ease;
$transition-base: 0.3s ease;
$transition-slow: 0.5s ease-out;
$shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
$shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
$shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
$glow-gold-sm: 0 0 10px rgba(212, 175, 55, 0.3);
$glow-gold-md: 0 0 20px rgba(212, 175, 55, 0.4);
$glow-gold-lg: 0 4px 20px rgba(212, 175, 55, 0.5);
.node-editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $color-bg-base;
  color: $color-text-primary;
  font-family: $font-family-primary;
}
.editor-header {
  padding: $spacing-lg;
  background: $color-bg-elevated;
  border-bottom: 2px solid $color-brown-accent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    margin: 0;
    color: $color-gold-primary;
    font-size: $font-size-2xl;
    font-family: $font-family-display;
    font-weight: $font-weight-bold;
  }
  .controls {
    display: flex;
    gap: $spacing-sm;
  }
}
.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: $color-bg-base;
}
.svg-canvas {
  width: 100%;
  height: 100%;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
}
.node {
  cursor: move;
  transition: transform $transition-fast;
  &:hover .node-circle {
    stroke: $color-gold-light;
    stroke-width: 3;
  }
  &.selected .node-circle {
    stroke: $color-gold-light;
    stroke-width: 4;
    filter: drop-shadow($glow-gold-md);
  }
}
.link-line {
  pointer-events: none;
  stroke: $color-brown-accent;
  transition: stroke $transition-base;
}
.sidebar {
  width: 350px;
  background: $color-bg-elevated;
  border-left: 2px solid $color-brown-accent;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  padding: $spacing-lg;
}
.sidebar-section {
  h3 {
    margin: 0 0 $spacing-md 0;
    color: $color-gold-primary;
    font-size: $font-size-xl;
    border-bottom: 1px solid $color-brown-accent;
    padding-bottom: $spacing-sm;
    font-family: $font-family-display;
    font-weight: $font-weight-semibold;
  }
}
.node-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}
.info-row {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  label {
    color: $color-text-disabled;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}
.input-text,
.input-number,
.input-textarea,
.input-range {
  background: $color-bg-base;
  border: 1px solid $color-brown-accent;
  color: $color-text-primary;
  padding: $spacing-sm;
  border-radius: $radius-xs;
  font-family: $font-family-primary;
  font-size: $font-size-sm;
  transition:
    border-color $transition-base,
    box-shadow $transition-base;
  &:focus {
    outline: none;
    border-color: $color-gold-primary;
    box-shadow: $glow-gold-sm;
  }
  &:hover {
    border-color: $color-brown-light;
  }
}
.input-range {
  width: 100%;
  padding: 0;
  height: 6px;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #d4a574;
    cursor: pointer;
    border-radius: 50%;
  }
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #d4a574;
    cursor: pointer;
    border-radius: 50%;
    border: none;
  }
}
.input-textarea {
  min-height: 80px;
  resize: vertical;
}
.no-selection {
  color: $color-text-disabled;
  font-style: italic;
  text-align: center;
  padding: $spacing-lg;
}
.btn-export,
.btn-import,
.btn-reset,
.btn-action,
.btn-copy,
.btn-close {
  padding: $spacing-sm $spacing-lg;
  border: 2px solid $color-brown-accent;
  background: $color-bg-elevated;
  color: $color-gold-primary;
  cursor: pointer;
  border-radius: $radius-xs;
  font-weight: $font-weight-bold;
  transition: all $transition-base;
  font-family: $font-family-display;
  font-size: $font-size-sm;
  &:hover:not(:disabled) {
    background: $color-brown-accent;
    border-color: $color-gold-primary;
    color: $color-gold-light;
    box-shadow: $glow-gold-sm;
    transform: translateY(-2px);
  }
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.file-upload {
  cursor: pointer;
}
.btn-action {
  width: 100%;
  margin-bottom: $spacing-sm;
}
.stats {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}
.stat-item {
  padding: $spacing-sm;
  background: $color-bg-base;
  border: 1px solid $color-brown-accent;
  border-radius: $radius-xs;
  font-size: $font-size-sm;
  color: $color-text-primary;
  font-family: $font-family-primary;
}
.bg-controls {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  .info-row {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    label {
      min-width: 80px;
    }
    span {
      min-width: 40px;
      text-align: right;
      color: $color-gold-primary;
    }
  }
}
.background-image {
  pointer-events: none;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-bg-overlay;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: $color-bg-elevated;
  border: 2px solid $color-brown-accent;
  border-radius: $radius-base;
  padding: $spacing-2xl;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  box-shadow: $shadow-lg;
  h2 {
    margin: 0;
    color: $color-gold-primary;
    font-family: $font-family-display;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
  }
}
.json-output {
  flex: 1;
  min-height: 400px;
  background: $color-bg-base;
  border: 1px solid $color-brown-accent;
  color: $color-text-primary;
  padding: $spacing-md;
  border-radius: $radius-xs;
  font-family: $font-family-primary;
  font-size: $font-size-xs;
  resize: vertical;
  transition: border-color $transition-base;
  &:focus {
    outline: none;
    border-color: $color-gold-primary;
    box-shadow: $glow-gold-sm;
  }
}
.modal-actions {
  display: flex;
  gap: $spacing-sm;
  justify-content: flex-end;
}
</style>
