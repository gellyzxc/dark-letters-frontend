<template>
  <div class="skill-tree-wrapper">
    <div ref="pixiContainer" class="skill-tree-container"></div>
    <frame-component class="stats-panel" type="generic-big-squared-rounded">
      <div class="stats-content">
        <div class="stats-list">
          <div class="stat-item">
            <span class="stat-name">Agility</span>
            <span class="stat-value">{{ characterStats.agility }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Intelligence</span>
            <span class="stat-value">{{ characterStats.intellect }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Strength</span>
            <span class="stat-value">{{ characterStats.strength }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Health points</span>
            <span class="stat-value">{{ characterStats.health_points }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Max mana</span>
            <span class="stat-value">{{ characterStats.mana }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Chance get mana</span>
            <span class="stat-value">{{ (characterStats.mana_chance * 100).toFixed(2) }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Chance to block</span>
            <span class="stat-value">{{ (characterStats.block_chance * 100).toFixed(2) }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Defense</span>
            <span class="stat-value">{{ characterStats.defence }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Critical chance</span>
            <span class="stat-value">{{ (characterStats.critical_hit_chance * 100).toFixed(2) }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Critical multipler</span>
            <span class="stat-value">{{ characterStats.critical_multiplier }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">Damage</span>
            <span class="stat-value">{{ characterStats.damage }}</span>
          </div>
        </div>
        <div class="ability-points">
          <span class="points-label">Ability point</span>
          <span class="points-value">{{ characterStats.available_skill_points }}/{{ characterStats.total_skill_points
            }}</span>
        </div>
      </div>
    </frame-component>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useCharacterStore } from '@/stores/character'
import * as PIXI from 'pixi.js'
import FrameComponent from '@/components/game/FrameComponent.vue'
import SkillsBackground from '@/assets/images/background/skills.png'
import apiClient, { API_BASE_URL } from '@/api/client'
import Skill1 from '@/assets/images/skills/1.png'
import Skill2 from '@/assets/images/skills/2.png'
import Skill3 from '@/assets/images/skills/3.png'
import Skill4 from '@/assets/images/skills/4.png'
import Skill5 from '@/assets/images/skills/5.png'
import Skill6 from '@/assets/images/skills/6.png'
import Skill7 from '@/assets/images/skills/7.png'
import Skill8 from '@/assets/images/skills/8.png'
import Skill9 from '@/assets/images/skills/9.png'
import Skill10 from '@/assets/images/skills/10.png'
import Skill11 from '@/assets/images/skills/11.png'
import Skill12 from '@/assets/images/skills/12.png'
import Skill13 from '@/assets/images/skills/13.png'
import Skill14 from '@/assets/images/skills/14.png'
import Skill15 from '@/assets/images/skills/15.png'
import Skill16 from '@/assets/images/skills/16.png'
import Skill17 from '@/assets/images/skills/17.png'
import Skill18 from '@/assets/images/skills/18.png'
import Skill19 from '@/assets/images/skills/19.png'
import Skill20 from '@/assets/images/skills/20.png'
import Skill21 from '@/assets/images/skills/21.png'
import Skill22 from '@/assets/images/skills/22.png'
const skillImages = {
  '1': Skill1,
  '2': Skill2,
  '3': Skill3,
  '4': Skill4,
  '5': Skill5,
  '6': Skill6,
  '7': Skill7,
  '8': Skill8,
  '9': Skill9,
  '10': Skill10,
  '11': Skill11,
  '12': Skill12,
  '13': Skill13,
  '14': Skill14,
  '15': Skill15,
  '16': Skill16,
  '17': Skill17,
  '18': Skill18,
  '19': Skill19,
  '20': Skill20,
  '21': Skill21,
  '22': Skill22
}
const characterStore = useCharacterStore()
const API_BASE_URL_CONST = API_BASE_URL
const BASE_URL = API_BASE_URL_CONST
const pixiContainer = ref(null)
const nodesData = ref(null)
let app = null
let viewport = null
const characterStats = computed(() => ({
  agility: characterStore.character?.agility || 0,
  intellect: characterStore.character?.intellect || 0,
  strength: characterStore.character?.strength || 0,
  health_points: characterStore.character?.health_points || 0,
  mana: characterStore.character?.mana || 0,
  mana_chance: characterStore.character?.mana_chance || 0,
  block_chance: characterStore.character?.block_chance || 0,
  defence: characterStore.character?.defence || 0,
  critical_hit_chance: characterStore.character?.critical_hit_chance || 0,
  critical_multiplier: characterStore.character?.critical_multiplier || 0,
  damage: characterStore.character?.damage || 0,
  available_skill_points: characterStore.character?.available_skill_points || 0,
  total_skill_points: characterStore.character?.total_skill_points || 0
}))
const NodeType = {
  START: 'start',
  SMALL: 'small',
  MEDIUM: 'medium',
  KEYSTONE: 'keystone'
}
function getNodeColor(node) {
  return 'hybrid'
}
function getNodeType(node) {
  if (node.uid === 0) return NodeType.START
  if (node.value && node.value.length > 15) return NodeType.KEYSTONE
  if (node.name.includes('+5') || node.name.includes('+10') || node.name.includes('+30')) return NodeType.MEDIUM
  return NodeType.SMALL
}
function getNodePositions(nodes) {
  const positions = new Map()
  nodes.forEach(node => {
    positions.set(node.uid, {
      x: node.x || 0,
      y: node.y || 0
    })
  })
  return positions
}
function createBackground() {
  const bg = new PIXI.Graphics()
  const gridSize = 100
  const gridExtent = 3000
  bg.moveTo(-gridExtent, 0)
  bg.lineTo(gridExtent, 0)
  bg.stroke({ width: 1, color: 0x1a1a1a, alpha: 0.3 })
  for (let x = -gridExtent; x <= gridExtent; x += gridSize) {
    bg.moveTo(x, -gridExtent)
    bg.lineTo(x, gridExtent)
    bg.stroke({ width: 1, color: 0x1a1a1a, alpha: 0.3 })
  }
  for (let y = -gridExtent; y <= gridExtent; y += gridSize) {
    bg.moveTo(-gridExtent, y)
    bg.lineTo(gridExtent, y)
    bg.stroke({ width: 1, color: 0x1a1a1a, alpha: 0.3 })
  }
  for (let x = -gridExtent; x <= gridExtent; x += gridSize * 5) {
    bg.moveTo(x, -gridExtent)
    bg.lineTo(x, gridExtent)
    bg.stroke({ width: 1, color: 0x2a2a2a, alpha: 0.5 })
  }
  for (let y = -gridExtent; y <= gridExtent; y += gridSize * 5) {
    bg.moveTo(-gridExtent, y)
    bg.lineTo(gridExtent, y)
    bg.stroke({ width: 1, color: 0x2a2a2a, alpha: 0.5 })
  }
  return bg
}
function createEdge(nodeA, nodeB, edgesContainer, allEdges) {
  const line = new PIXI.Graphics()
  line.moveTo(nodeA.x, nodeA.y)
  line.lineTo(nodeB.x, nodeB.y)
  line.stroke({ width: 3, color: 0x4a3828, alpha: 0.6 })
  line.nodeA = nodeA
  line.nodeB = nodeB
  edgesContainer.addChild(line)
  allEdges.push(line)
  return line
}
function updateEdge(line) {
  const nodeA = line.nodeA
  const nodeB = line.nodeB
  line.clear()
  const bothActive = nodeA.active && nodeB.active
  if (bothActive) {
    line.moveTo(nodeA.x, nodeA.y)
    line.lineTo(nodeB.x, nodeB.y)
    line.stroke({ width: 5, color: 0xd4a574, alpha: 0.8 })
    line.moveTo(nodeA.x, nodeA.y)
    line.lineTo(nodeB.x, nodeB.y)
    line.stroke({ width: 2, color: 0xffd7a3, alpha: 1 })
  } else {
    line.moveTo(nodeA.x, nodeA.y)
    line.lineTo(nodeB.x, nodeB.y)
    line.stroke({ width: 3, color: 0x4a3828, alpha: 0.6 })
  }
}
async function createNode(nodeData, nodesContainer, allEdges, app, tooltipsContainer, allNodesData) {
  const container = new PIXI.Container()
  container.x = nodeData.x
  container.y = nodeData.y
  container.nodeData = nodeData
  const isNodeAvailable = (node) => {
    if (node.uid === 0 || node.type === NodeType.START) return true
    if (node.active) return true
    const links = allNodesData.links
    const hasActiveNeighbor = links.some(link => {
      if (link.from === node.uid) {
        const neighborNode = allNodesData.nodes.find(n => n.uid === link.to)
        return neighborNode && neighborNode.active
      }
      if (link.to === node.uid) {
        const neighborNode = allNodesData.nodes.find(n => n.uid === link.from)
        return neighborNode && neighborNode.active
      }
      return false
    })
    return hasActiveNeighbor
  }
  const colors = { main: 0xffaa44, glow: 0xffcc66, line: 0x885522 }
  let outerRadius, iconSize
  switch (nodeData.type) {
    case NodeType.START:
      outerRadius = 45
      iconSize = 35
      break
    case NodeType.SMALL:
      outerRadius = 22
      iconSize = 16
      break
    case NodeType.MEDIUM:
      outerRadius = 28
      iconSize = 20
      break
    case NodeType.KEYSTONE:
      outerRadius = 35
      iconSize = 26
      break
  }
  if (nodeData.isFinal) {
    outerRadius *= 1.5
    iconSize *= 1.5
  }
  const outerGlow = new PIXI.Graphics()
  outerGlow.circle(0, 0, outerRadius + 12)
  outerGlow.fill({ color: colors.glow, alpha: 0.1 })
  outerGlow.alpha = nodeData.active ? 1 : 0
  const mainCircle = new PIXI.Graphics()
  mainCircle.circle(0, 0, outerRadius)
  mainCircle.fill({ color: 0x0a0a0a })
  const innerGlow = new PIXI.Graphics()
  innerGlow.circle(0, 0, outerRadius - 3)
  innerGlow.fill({ color: nodeData.active ? colors.main : 0x1a1a1a, alpha: nodeData.active ? 0.3 : 0.5 })
  const border = new PIXI.Graphics()
  border.circle(0, 0, outerRadius)
  border.stroke({ width: 2, color: nodeData.active ? colors.main : 0x2a2a2a, alpha: nodeData.active ? 1 : 0.6 })
  const innerBorder = new PIXI.Graphics()
  innerBorder.circle(0, 0, outerRadius - 8)
  innerBorder.stroke({ width: 1, color: nodeData.active ? colors.glow : 0x1a1a1a, alpha: 0.4 })
  let icon
  if (nodeData.image && skillImages[nodeData.image]) {
    const texture = await PIXI.Assets.load(skillImages[nodeData.image])
    icon = new PIXI.Sprite(texture)
    const scale = (outerRadius * 2) / Math.max(icon.width, icon.height)
    icon.scale.set(scale)
    icon.anchor.set(0.5)
    if (!nodeData.active) {
      icon.tint = 0x666666
    }
  } else {
    icon = new PIXI.Graphics()
    if (nodeData.type === NodeType.START) {
      const spikes = 8
      const outerR = iconSize * 0.5
      const innerR = iconSize * 0.25
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
        const r = i % 2 === 0 ? outerR : innerR
        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r
        if (i === 0) {
          icon.moveTo(x, y)
        } else {
          icon.lineTo(x, y)
        }
      }
      icon.closePath()
      icon.fill({ color: colors.main, alpha: 0.8 })
      icon.stroke({ width: 1.5, color: colors.glow })
    } else if (nodeData.type === NodeType.KEYSTONE) {
      const segments = 60
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 4
        const r = (i / segments) * iconSize * 0.4
        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r
        if (i === 0) {
          icon.moveTo(x, y)
        } else {
          icon.lineTo(x, y)
        }
      }
      icon.stroke({ width: 2, color: colors.main, alpha: 0.9 })
      icon.circle(0, 0, iconSize * 0.45)
      icon.stroke({ width: 1.5, color: colors.glow, alpha: 0.6 })
    } else {
      const size = iconSize * 0.4
      icon.moveTo(0, -size)
      icon.lineTo(0, size)
      icon.moveTo(-size, 0)
      icon.lineTo(size, 0)
      icon.stroke({ width: 2, color: nodeData.active ? colors.main : 0x4a4a4a, alpha: 0.8 })
      const dotDist = size * 0.7
      const positions = [
        [-dotDist, -dotDist],
        [dotDist, -dotDist],
        [-dotDist, dotDist],
        [dotDist, dotDist]
      ]
      positions.forEach(([x, y]) => {
        icon.circle(x, y, 1.5)
        icon.fill({ color: nodeData.active ? colors.glow : 0x3a3a3a, alpha: 0.7 })
      })
    }
  }
  container.addChild(outerGlow, mainCircle, innerGlow, border, innerBorder, icon)
  container.eventMode = "static"
  container.cursor = "pointer"
  let tooltip = null
  container.on("pointerover", () => {
    outerGlow.alpha = 1
    container.scale.set(1.15)
    tooltip = new PIXI.Container()
    const tooltipBg = new PIXI.Graphics()
    const padding = 12
    const text = new PIXI.Text({
      text: nodeData.name,
      style: {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 0xffffff,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 200
      },
      resolution: 2
    })
    const tooltipWidth = text.width + padding * 2
    const tooltipHeight = text.height + padding * 2
    tooltipBg.rect(0, 0, tooltipWidth, tooltipHeight)
    tooltipBg.fill({ color: 0x1a1a1a, alpha: 0.95 })
    tooltipBg.stroke({ width: 2, color: 0xFFFFFF, alpha: 0.8 })
    text.x = padding
    text.y = padding
    tooltip.addChild(tooltipBg, text)
    const globalPos = container.toGlobal(new PIXI.Point(0, 0))
    const localPos = tooltipsContainer.toLocal(globalPos)
    tooltip.x = localPos.x - tooltipWidth / 2
    tooltip.y = localPos.y - outerRadius - tooltipHeight - 10
    tooltipsContainer.addChild(tooltip)
  })
  container.on("pointerout", () => {
    outerGlow.alpha = nodeData.active ? 1 : 0
    container.scale.set(1.0)
    if (tooltip) {
      tooltipsContainer.removeChild(tooltip)
      tooltip.destroy()
      tooltip = null
    }
  })
  container.on("pointertap", async () => {
    if (!isNodeAvailable(nodeData)) {
      const shake = new PIXI.Graphics()
      shake.circle(0, 0, outerRadius + 5)
      shake.stroke({ width: 2, color: 0xff0000, alpha: 0.8 })
      container.addChild(shake)
      let shakeTime = 0
      const shakeTicker = (delta) => {
        shakeTime += delta.deltaTime
        shake.alpha = 1 - (shakeTime / 20)
        if (shakeTime >= 20) {
          container.removeChild(shake)
          app.ticker.remove(shakeTicker)
        }
      }
      app.ticker.add(shakeTicker)
      return
    }
    if (!nodeData.active && characterStore.character?.available_skill_points <= 0) {
      const shake = new PIXI.Graphics()
      shake.circle(0, 0, outerRadius + 5)
      shake.stroke({ width: 2, color: 0xff6600, alpha: 0.8 })
      container.addChild(shake)
      let shakeTime = 0
      const shakeTicker = (delta) => {
        shakeTime += delta.deltaTime
        shake.alpha = 1 - (shakeTime / 20)
        if (shakeTime >= 20) {
          container.removeChild(shake)
          app.ticker.remove(shakeTicker)
        }
      }
      app.ticker.add(shakeTicker)
      return
    }
    const wasActive = nodeData.active
    try {
      if (wasActive) {
        await characterStore.unallocateSkillPoint(nodeData.uid)
      } else {
        await characterStore.allocateSkillPoint(nodeData.uid)
      }
      await characterStore.fetchCharacter()
      nodeData.active = !wasActive
    } catch (error) {
      console.error('Failed to toggle skill node:', error)
      const shake = new PIXI.Graphics()
      shake.circle(0, 0, outerRadius + 5)
      shake.stroke({ width: 2, color: 0xff0000, alpha: 0.8 })
      container.addChild(shake)
      let shakeTime = 0
      const shakeTicker = (delta) => {
        shakeTime += delta.deltaTime
        shake.alpha = 1 - (shakeTime / 20)
        if (shakeTime >= 20) {
          container.removeChild(shake)
          app.ticker.remove(shakeTicker)
        }
      }
      app.ticker.add(shakeTicker)
      return
    }
    innerGlow.clear()
    innerGlow.circle(0, 0, outerRadius - 3)
    innerGlow.fill({ color: nodeData.active ? colors.main : 0x1a1a1a, alpha: nodeData.active ? 0.3 : 0.5 })
    border.clear()
    border.circle(0, 0, outerRadius)
    border.stroke({ width: 2, color: nodeData.active ? colors.main : 0x2a2a2a, alpha: nodeData.active ? 1 : 0.6 })
    innerBorder.clear()
    innerBorder.circle(0, 0, outerRadius - 8)
    innerBorder.stroke({ width: 1, color: nodeData.active ? colors.glow : 0x1a1a1a, alpha: 0.4 })
    if (icon instanceof PIXI.Sprite) {
      icon.tint = nodeData.active ? 0xffffff : 0x666666
    } else {
      icon.clear()
      if (nodeData.type === NodeType.START) {
        const spikes = 8
        const outerR = iconSize * 0.5
        const innerR = iconSize * 0.25
        for (let i = 0; i < spikes * 2; i++) {
          const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
          const r = i % 2 === 0 ? outerR : innerR
          const x = Math.cos(angle) * r
          const y = Math.sin(angle) * r
          if (i === 0) {
            icon.moveTo(x, y)
          } else {
            icon.lineTo(x, y)
          }
        }
        icon.closePath()
        icon.fill({ color: colors.main, alpha: 0.8 })
        icon.stroke({ width: 1.5, color: colors.glow })
      } else if (nodeData.type === NodeType.KEYSTONE) {
        const segments = 60
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 4
          const r = (i / segments) * iconSize * 0.4
          const x = Math.cos(angle) * r
          const y = Math.sin(angle) * r
          if (i === 0) {
            icon.moveTo(x, y)
          } else {
            icon.lineTo(x, y)
          }
        }
        icon.stroke({ width: 2, color: colors.main, alpha: 0.9 })
        icon.circle(0, 0, iconSize * 0.45)
        icon.stroke({ width: 1.5, color: colors.glow, alpha: 0.6 })
      } else {
        const size = iconSize * 0.4
        icon.moveTo(0, -size)
        icon.lineTo(0, size)
        icon.moveTo(-size, 0)
        icon.lineTo(size, 0)
        icon.stroke({ width: 2, color: nodeData.active ? colors.main : 0x4a4a4a, alpha: 0.8 })
        const dotDist = size * 0.7
        const positions = [
          [-dotDist, -dotDist],
          [dotDist, -dotDist],
          [-dotDist, dotDist],
          [dotDist, dotDist]
        ]
        positions.forEach(([x, y]) => {
          icon.circle(x, y, 1.5)
          icon.fill({ color: nodeData.active ? colors.glow : 0x3a3a3a, alpha: 0.7 })
        })
      }
    }
    outerGlow.alpha = nodeData.active ? 1 : 0
    allEdges.forEach(edge => {
      if (edge.nodeA.uid === nodeData.uid || edge.nodeB.uid === nodeData.uid) {
        updateEdge(edge)
      }
    })
    const flash = new PIXI.Graphics()
    flash.circle(0, 0, outerRadius * 1.8)
    flash.fill({ color: colors.glow, alpha: 0.6 })
    container.addChildAt(flash, 0)
    let flashAlpha = 0.6
    const flashTicker = (delta) => {
      flashAlpha -= 0.04 * delta.deltaTime
      flash.alpha = flashAlpha
      flash.scale.set(flash.scale.x + 0.02 * delta.deltaTime)
      if (flashAlpha <= 0) {
        container.removeChild(flash)
        app.ticker.remove(flashTicker)
      }
    }
    app.ticker.add(flashTicker)
  })
  nodesContainer.addChild(container)
  return container
}
onMounted(async () => {
  if (!characterStore.character) {
    try {
      await characterStore.fetchCharacter()
    } catch (error) {
      console.error('Failed to fetch character data:', error)
    }
  }
  try {
    const treeJsonPath = characterStore.character?.class?.tree_json
    if (treeJsonPath) {
      const treeUrl = `${BASE_URL}/${treeJsonPath}`
      const response = await fetch(treeUrl)
      nodesData.value = await response.json()
    } else {
      console.error('tree_json path not found in character data')
      return
    }
  } catch (error) {
    console.error('Failed to load skill tree data:', error)
    return
  }
  app = new PIXI.Application()
  await app.init({
    resizeTo: pixiContainer.value,
    backgroundColor: 0x000000,
    antialias: true
  })
  pixiContainer.value.appendChild(app.canvas)
  viewport = new PIXI.Container()
  app.stage.addChild(viewport)
  const blackBackground = new PIXI.Graphics()
  const bgSize = 10000
  blackBackground.rect(-bgSize, -bgSize, bgSize * 4, bgSize * 4)
  blackBackground.fill({ color: 0x000000 })
  viewport.addChild(blackBackground)
  const backgroundTexture = await PIXI.Assets.load(SkillsBackground)
  const backgroundSprite = new PIXI.Sprite(backgroundTexture)
  backgroundSprite.anchor.set(0.5)
  backgroundSprite.x = 0
  backgroundSprite.y = 0
  backgroundSprite.scale.set(0.5)
  viewport.addChild(backgroundSprite)
  const edgesContainer = new PIXI.Container()
  const nodesContainer = new PIXI.Container()
  const tooltipsContainer = new PIXI.Container()
  edgesContainer.visible = true
  edgesContainer.alpha = 1
  nodesContainer.visible = true
  nodesContainer.alpha = 1
  viewport.addChild(edgesContainer)
  viewport.addChild(nodesContainer)
  viewport.addChild(tooltipsContainer)
  let isDragging = false
  let dragStart = { x: 0, y: 0 }
  app.canvas.style.cursor = 'grab'
  viewport.eventMode = 'static'
  viewport.hitArea = new PIXI.Rectangle(-10000, -10000, 20000, 20000)
  viewport.interactiveChildren = true
  viewport.on('pointerdown', (e) => {
    isDragging = true
    app.canvas.style.cursor = 'grabbing'
    dragStart = {
      x: e.globalX - viewport.x,
      y: e.globalY - viewport.y
    }
  })
  viewport.on('pointerup', () => {
    isDragging = false
    app.canvas.style.cursor = 'grab'
  })
  viewport.on('pointerupoutside', () => {
    isDragging = false
    app.canvas.style.cursor = 'grab'
  })
  viewport.on('pointermove', (e) => {
    if (isDragging) {
      viewport.x = e.globalX - dragStart.x
      viewport.y = e.globalY - dragStart.y
    }
  })
  app.canvas.addEventListener('wheel', (e) => {
    e.preventDefault()
    const scaleFactor = e.deltaY > 0 ? 0.95 : 1.05
    const newScale = viewport.scale.x * scaleFactor
    if (newScale >= 0.3 && newScale <= 3) {
      const mousePos = { x: e.clientX, y: e.clientY }
      const worldPos = {
        x: (mousePos.x - viewport.x) / viewport.scale.x,
        y: (mousePos.y - viewport.y) / viewport.scale.y
      }
      viewport.scale.set(newScale)
      viewport.x = mousePos.x - worldPos.x * viewport.scale.x
      viewport.y = mousePos.y - worldPos.y * viewport.scale.y
    }
  }, { passive: false })
  const positions = getNodePositions(nodesData.value.nodes)
  const linkCounts = new Map()
  nodesData.value.nodes.forEach(node => linkCounts.set(node.uid, 0))
  nodesData.value.links.forEach(link => {
    linkCounts.set(link.from, (linkCounts.get(link.from) || 0) + 1)
    linkCounts.set(link.to, (linkCounts.get(link.to) || 0) + 1)
  })
  const enrichedNodes = nodesData.value.nodes.map(node => {
    const allocatedNodes = characterStore.character?.allocated_nodes || []
    const isAllocated = allocatedNodes.includes(node.uid)
    return {
      ...node,
      x: positions.get(node.uid)?.x || 0,
      y: positions.get(node.uid)?.y || 0,
      color: getNodeColor(node),
      type: getNodeType(node),
      active: isAllocated || node.uid === 0,
      isFinal: linkCounts.get(node.uid) === 1
    }
  })
  const nodeMap = new Map()
  const allEdges = []
  for (const node of enrichedNodes) {
    const nodeContainer = await createNode(node, nodesContainer, allEdges, app, tooltipsContainer, {
      nodes: enrichedNodes,
      links: nodesData.value.links
    })
    nodeMap.set(node.uid, node)
  }
  nodesData.value.links.forEach(link => {
    const nodeA = nodeMap.get(link.from)
    const nodeB = nodeMap.get(link.to)
    if (nodeA && nodeB) {
      createEdge(nodeA, nodeB, edgesContainer, allEdges)
    }
  })
  viewport.x = app.screen.width / 2
  viewport.y = app.screen.height / 2
})
onUnmounted(() => {
  if (app) {
    app.destroy(true, { children: true, texture: true, baseTexture: true })
  }
})
</script>
<style scoped>
.skill-tree-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0a0a0a;
  overflow: hidden;
}

.skill-tree-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.stats-panel {
  position: absolute;
  left: 20px;
  bottom: 20px;
  height: 439px;
  pointer-events: auto;
  z-index: 10;
}

.stats-content {
  background: #000000;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.5rem;
  height: calc(100% - 2rem) !important;
  width: calc(100% - 3rem) !important;
  position: relative;
}

.stats-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 0.5rem;

  .header-decoration {
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #4a3828 20%, #4a3828 80%, transparent 100%);
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      background: #4a3828;
      transform: rotate(45deg);
      top: -5px;
    }

    &::before {
      left: 10%;
    }

    &::after {
      right: 10%;
    }
  }
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;

  .stat-name {
    color: #808080;
    text-align: left;
  }

  .stat-value {
    color: #ffffff;
    text-align: right;
  }
}

.ability-points {
  position: absolute;
  bottom: 1rem;
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;

  .points-label {
    color: #808080;
  }

  .points-value {
    color: #ffffff;
    font-weight: 700;
    font-size: 1.1rem;
  }
}

.back-button {
  position: absolute;
  right: 40px;
  bottom: 40px;
  padding: 0.8rem 2rem;
  background: transparent;
  border: 2px solid #4a3828;
  color: #d4a574;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 10;

  &:hover {
    background: rgba(74, 56, 40, 0.2);
    border-color: #d4a574;
    color: #ffd7a3;
    box-shadow: 0 0 15px rgba(212, 165, 116, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
