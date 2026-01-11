<template>
  <div class="page game-view">
    <div class="header">
      <div class="bar bar-col">
        <frame-component type="bar" id="playerhp">
          <div :style="{ height: '100%', width: (playerHp / playerMaxHp * 100) + '%', background: '#240D0B' }" />
        </frame-component>
        <frame-component type="bar" id="playermana">
          <div :style="{ height: '100%', width: (playerMana / playerMaxMana * 100) + '%', background: '#0B0D24' }" />
        </frame-component>
        <div class="skills-deck">
          <div v-for="skillId in skillQueue" :key="skillId" class="skill-card"
            :class="{ 'on-cooldown': isSkillOnCooldown(skillId) }" @click="paused && openSkillInfo(skillId)">
            <img :src="getSkillIcon(skillId)" :alt="'Skill ' + skillId" />
            <div v-if="isSkillOnCooldown(skillId)" class="cooldown-overlay">
              <span>{{ getSkillCooldown(skillId) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="clock">
        <frame-component type="game-timer">
          <div class="clock-in">
            <span :style="{ color: timeRemaining < 60 ? '#ff4444' : '#7B7B7B' }">
              {{ formattedTime }}
            </span>
          </div>
        </frame-component>
      </div>
      <div class="bar bar-col">
        <frame-component type="bar" id="monsterhp">
          <div :style="{ height: '100%', width: (monsterHp / monsterMaxHp * 100) + '%', background: '#240D0B' }" />
        </frame-component>
      </div>
    </div>
    <div class="game-area">
      <div class="active">
        <div class="fr left">
          <frame-component type="game-small-horizontal">
            <div style="width: 100%; height: 100%" class="content">
              ...
            </div>
          </frame-component>
        </div>
        <frame-component type="game-big">
          <div class="words-game">
            <div v-if="paused" class="pause">
              <div v-if="!showExitConfirm" style="display: flex; flex-direction: row; gap: 1rem; padding-bottom: 6rem;">
                <span @click="paused = false">Unpause</span>
                <span @click="showExitConfirm = true">Exit</span>
              </div>
              <div v-else
                style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; width: 100%; height: 100%;">
                <span style="font-size: 1.3rem; color: #7B7B7B; font-weight: 600;">Are you sure?</span>
                <div style="display: flex; flex-direction: row; gap: 2rem;">
                  <span @click="handleExitYes" style="cursor: pointer; color: #ff4444; font-weight: 700;">Yes</span>
                  <span @click="showExitConfirm = false"
                    style="cursor: pointer; color: #7B7B7B; font-weight: 700;">No</span>
                </div>
              </div>
            </div>
            <div class="words-container">
              <span class="word" ref="word">
                <span v-for="(char, index) in currentText" :key="index" :class="{
                  'typed': index < typedText.length,
                  'error': index < typedText.length && char !== typedText[index]
                }">{{ char }}</span>
              </span>
              <div class="cursor" :style="{ left: cursorPosition + 'px', top: cursorTop + 'px' }">|</div>
            </div>
            <div class="stats">
              <span>WPM: {{ wpm }}</span>
              <span>Accuracy: {{ accuracy }}%</span>
              <span>Combo: {{ combo }}</span>
              <span>Errors: {{ errors }}</span>
            </div>
          </div>
        </frame-component>
        <div class="fr right">
          <frame-component type="game-small-vertical">
            <div style="width: 100%; height: 80%" class="content content-small">
              <transition-group name="log-item" tag="div">
                <span v-for="(log, index) in actionLog.slice(-5)" :key="log + index" class="log-entry">
                  {{ log }}
                </span>
              </transition-group>
            </div>
          </frame-component>
        </div>
        <img class="char" :class="{ 'damaged': isDamaged }" :src="monsterImageUrl" />
      </div>
    </div>
  </div>
  <modal-component :open="exited" @will-dismiss="handleBack">
    <frame-component type="generic-big-squared-rounded" style="width: 35svw !important; overflow: hidden;">
      <div class="stats-modal">
        <div class="stats-header-row">
          <div class="stats-header">Statistic</div>
          <div class="stats-datetime">
            <div>{{ formattedDate }}</div>
            <div>{{ formattedTime2 }}</div>
          </div>
        </div>
        <div class="stats-section">
          <div class="stats-row">
            <span class="section-title">Session info</span>
            <span class="value">Game {{ gameResult?.game_id || 'N/A' }}</span>
          </div>
          <div class="stats-row">
            <span class="label">Word</span>
            <span class="value">{{ Math.floor(typedText.length / 5) }}</span>
          </div>
          <div class="stats-row">
            <span class="label">Error</span>
            <span class="value">{{ totalWordErrors + errors }}</span>
          </div>
          <div class="stats-row">
            <span class="label">Accuracy</span>
            <span class="value">{{ textsCompleted > 0 ? Math.round(totalAccuracy / textsCompleted) : accuracy }}%</span>
          </div>
          <div class="stats-row">
            <span class="label">WPM</span>
            <span class="value">{{ textsCompleted > 0 ? Math.round(totalWpm / textsCompleted) : wpm }}</span>
          </div>
          <div class="stats-row">
            <span class="label">WPS</span>
            <span class="value">{{ ((textsCompleted > 0 ? totalWpm / textsCompleted : wpm) / 60).toFixed(1) }}</span>
          </div>
        </div>
        <div class="stats-section">
          <div class="section-title">Session reward</div>
          <div class="stats-row">
            <span class="label">Exp</span>
            <span class="value">{{ gameResult?.exp_gained || 0 }}</span>
          </div>
          <div class="stats-row">
            <span class="label">gold</span>
            <span class="value">{{ gameResult?.gold_gained || 0 }}</span>
          </div>
        </div>
        <div class="stats-section">
          <div class="section-title">Kills info</div>
          <div class="stats-row">
            <span class="label">Monsters kill</span>
            <span class="value">{{ monstersDefeated.length }}</span>
          </div>
          <div class="stats-row">
            <span class="label">Total damage</span>
            <span class="value">{{ totalDamageDealt }}</span>
          </div>
          <div class="stats-row">
            <span class="label">Total damage taken</span>
            <span class="value">{{ Math.round(totalDamageTaken) }}</span>
          </div>
        </div>
        <div class="stats-footer">
          <button class="back-button" @click="handleBack">Back</button>
        </div>
      </div>
    </frame-component>
  </modal-component>
  <modal-component :open="showSkillModal" @will-dismiss="showSkillModal = false">
    <frame-component class="skill-info-frame" style="max-width: 40svw;">
      <div class="skill-info-card" v-if="selectedSkill">
        <div class="skill-header">
          <div class="skill-icon-large">
            <img :src="getSkillIcon(selectedSkill.id)" :alt="selectedSkill.name" />
          </div>
          <div class="skill-title">
            <div class="skill-name">{{ selectedSkill.name }}</div>
            <div class="skill-type">{{ selectedSkill.type }}</div>
          </div>
        </div>
        <div class="skill-description">{{ selectedSkill.description }}</div>
        <div class="skill-stats" v-if="selectedSkill.stats && selectedSkill.stats.length > 0">
          <div class="skill-stat-title">Effects:</div>
          <div v-for="stat in selectedSkill.stats" :key="stat" class="skill-stat-line">
            <span class="skill-stat-dot">•</span>
            <span class="skill-stat-text">{{ stat }}</span>
          </div>
        </div>
      </div>
    </frame-component>
  </modal-component>
  <div v-if="playerDamaged" class="damage-overlay"></div>
  <div class="bg" />
</template>
<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.bg {
  position: fixed;
  height: 100svh;
  width: 100svw;
  top: 0;
  z-index: -1;
  left: 0;
  background: url("@/assets/images/background/play.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.page {
  padding: $spacing-md;
  max-height: 1080px;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: min(10vw, 192px);

    .bar-col {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
    }

    .clock {
      width: 30rem;

      .clock-in {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        span {
          font-weight: $font-weight-normal;
          font-size: $font-size-2xl;
          line-height: $line-height-tight;
          text-align: center;
          vertical-align: middle;
          color: $color-text-disabled;
        }
      }
    }
  }

  .game-area {
    width: 100svw;

    .left {
      width: min(20vw, 384px);
      position: absolute;
      right: calc(min(100vw, 1920px) / 2);
      top: 62.5%;
      transform: translateY(-50%);
    }

    .right {
      position: absolute;
      width: min(13vw, 250px);
      left: calc(min(100vw, 1920px) / 2);
      top: 62.5%;
      transform: translateY(-50%);

      .content {
        padding: $spacing-sm;
        width: calc(100% - #{$spacing-md}) !important;
        height: calc(100% - #{$spacing-md}) !important;
        justify-content: flex-start !important;
      }
    }

    .left,
    .right {
      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        span {
          font-weight: $font-weight-normal;
          font-size: $font-size-xl;
          line-height: $line-height-tight;
          text-align: center;
          vertical-align: middle;
          color: $color-text-disabled;
        }

        .content-small {
          gap: $spacing-md;

          span {
            font-size: $font-size-base;
          }

          .log-entry {
            display: block;
            animation: logFadeIn $transition-slow;
          }
        }
      }
    }

    .active {
      padding-top: min(12vh, 194px);
      position: absolute;
      left: 50%;
      transform: translateX(-50%);

      .pause {
        width: calc(100% - #{$spacing-3xl * 2});
        height: calc(100% - #{$spacing-3xl} - #{$spacing-2xl});
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        position: absolute;
        z-index: 128312;
        backdrop-filter: blur(2px);

        div {
          span {
            font-size: $font-size-xl;
            color: $color-text-disabled;
            font-weight: $font-weight-semibold;
            transition: color $transition-fast;
            cursor: pointer;

            &:hover {
              color: $color-gold-primary;
            }
          }
        }
      }

      .words-game {
        background-color: $color-bg-base;
        padding: $spacing-sm $spacing-lg;
        width: calc(100% - #{$spacing-2xl + $spacing-md});
        height: calc(100% - #{$spacing-md});
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .words-container {
          position: relative;

          .cursor {
            position: absolute;
            top: 0;
            color: $color-text-primary;
            font-size: $font-size-2xl;
            font-weight: $font-weight-normal;
            line-height: 140%;
            letter-spacing: 0.05em;
            animation: blink 1s infinite;
            transition: left $transition-fast;
            pointer-events: none;
          }
        }

        .word {
          font-weight: $font-weight-normal;
          font-size: $font-size-2xl;
          line-height: 140%;
          text-align: center;
          vertical-align: middle;
          letter-spacing: 0.05em;
          font-family: $font-family-primary;

          span {
            color: $color-text-disabled;
            transition: color $transition-fast;

            &.typed {
              color: $color-text-primary;
            }

            &.error {
              color: $color-error;
            }
          }
        }

        .stats {
          display: flex;
          flex-direction: row;
          gap: $spacing-xl;
          justify-content: center;

          span {
            font-size: $font-size-lg;
            color: $color-text-disabled;
            font-family: $font-family-primary;
            transition: color $transition-fast;
          }
        }
      }
    }

    .char {
      max-width: 30svw;
      position: absolute;
      top: min(-5vh, -54px);
      left: 50%;
      transform: translateX(-50%);
      transition: transform $transition-fast, filter $transition-fast;

      &.damaged {
        filter: sepia(1) saturate(5) hue-rotate(-50deg) brightness(0.8);
        transform: translateX(-50%) scale(0.95);
      }
    }
  }
}

@keyframes logFadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.damage-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 68, 68, 0.3);
  animation: damageFlash $transition-slow;
  pointer-events: none;
  z-index: 10;
}

@keyframes damageFlash {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes blink {

  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0;
  }
}

.skill-info-frame {
  .skill-info-card {
    background: linear-gradient(135deg, $color-bg-base 0%, $color-brown-accent 100%);
    padding: $spacing-xl;
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    min-height: 300px;

    .skill-header {
      display: flex;
      flex-direction: row;
      gap: $spacing-lg;
      align-items: center;

      .skill-icon-large {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 3px solid $color-gold-primary;
        overflow: hidden;
        background: linear-gradient(135deg, $color-brown-medium 0%, $color-brown-dark 100%);
        box-shadow: $shadow-md, $glow-gold-sm;
        transition: transform $transition-base, box-shadow $transition-base;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .skill-title {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;

        .skill-name {
          font-size: $font-size-3xl;
          font-weight: $font-weight-bold;
          color: $color-gold-primary;
          text-shadow: $glow-gold-sm;
          font-family: $font-family-display;
        }

        .skill-type {
          font-size: $font-size-base;
          color: $color-text-disabled;
          font-weight: $font-weight-semibold;
          font-family: $font-family-primary;
        }
      }
    }

    .skill-description {
      font-size: $font-size-lg;
      color: $color-text-secondary;
      line-height: $line-height-normal;
      font-style: italic;
      font-family: $font-family-primary;
    }

    .skill-stats {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;

      .skill-stat-title {
        font-size: $font-size-xl;
        font-weight: $font-weight-semibold;
        color: $color-gold-primary;
        margin-bottom: $spacing-xs;
        font-family: $font-family-display;
      }

      .skill-stat-line {
        display: flex;
        flex-direction: row;
        gap: $spacing-sm;
        align-items: center;

        .skill-stat-dot {
          color: $color-gold-primary;
          font-size: $font-size-2xl;
        }

        .skill-stat-text {
          font-size: $font-size-lg;
          color: $color-text-primary;
          font-weight: $font-weight-semibold;
          font-family: $font-family-primary;
        }
      }
    }
  }
}

.skills-deck {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: $spacing-sm;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  margin-left: 1rem;
  overflow-y: auto;
  max-height: 100%;

  .skill-card {
    width: 2rem;
    height: 2rem;
    position: relative;
    overflow: hidden;
    transition: all $transition-base;
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
      transform: scale(1.1);
      box-shadow: $shadow-sm, $glow-gold-md;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: filter $transition-base;
    }

    &.on-cooldown {
      img {
        filter: grayscale(100%) brightness(0.4);
      }

      .cooldown-overlay {
        display: flex;
      }
    }

    .cooldown-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: $color-bg-overlay;
      display: none;
      align-items: center;
      justify-content: center;

      span {
        font-size: $font-size-2xl;
        font-weight: $font-weight-bold;
        color: $color-error;
        text-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
      }
    }
  }
}

.stats-modal {
  background: $color-bg-base;
  padding: 2rem;
  width: calc(100% - 2 * 2rem) !important;
  display: flex;
  gap: $spacing-sm;
  flex-direction: column;
  color: $color-text-primary;

  .stats-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-xs;
  }

  .stats-header {
    font-size: $font-size-2xl;
    font-weight: $font-weight-normal;
    color: $color-text-primary;
    text-align: left;
    font-family: $font-family-primary;
  }

  .stats-datetime {
    color: $color-text-disabled;
    text-align: right;
    font-family: $font-family-primary;

    div {
      line-height: 1.4;
    }
  }

  .stats-game-id {
    color: $color-text-disabled;
    text-align: right;
    font-family: $font-family-primary;
    margin-bottom: $spacing-sm;
  }

  .stats-section {
    display: flex;
    flex-direction: column;

    .section-title {
      color: $color-text-primary;
      font-family: $font-family-primary;
      margin-bottom: $spacing-xs;
    }

    .stats-row {
      display: flex;
      justify-content: space-between;
      padding: $spacing-xs 0;
      font-family: $font-family-primary;

      .label {
        color: $color-text-disabled;
      }

      .value {
        color: $color-text-primary;
        text-align: right;
      }
    }
  }

  .stats-footer {
    display: flex;
    justify-content: center;
    padding-top: $spacing-lg;
    margin-top: auto;

    .back-button {
      position: absolute;
      bottom: 1rem;
      right: 1.25rem;
      font-size: $font-size-base;
      color: $color-text-primary;
      font-weight: $font-weight-normal;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all $transition-base;
      font-family: $font-family-primary;

      &:hover {
        border-color: $color-text-primary;
        background: rgba($color-text-primary, 0.1);
      }

      &:active {
        transform: translateY(1px);
      }
    }
  }
}
</style>
<script>
import { useCharacterStore } from '@/stores/character'
import { useGameStore } from '@/stores/game'
import FrameComponent from "@/components/game/FrameComponent.vue"
import ModalComponent from "@/components/ModalComponent.vue"
import { Howl } from 'howler'
import skill1 from '@/assets/images/skillsicons/ (1).png'
import skill2 from '@/assets/images/skillsicons/ (2).png'
import skill3 from '@/assets/images/skillsicons/ (3).png'
import skill4 from '@/assets/images/skillsicons/ (4).png'
import skill5 from '@/assets/images/skillsicons/ (5).png'
import skill6 from '@/assets/images/skillsicons/ (6).png'
import skill7 from '@/assets/images/skillsicons/ (7).png'
import skill8 from '@/assets/images/skillsicons/ (8).png'
import skill9 from '@/assets/images/skillsicons/ (9).png'
import skill10 from '@/assets/images/skillsicons/ (10).png'
import skill11 from '@/assets/images/skillsicons/ (11).png'
import skill12 from '@/assets/images/skillsicons/ (12).png'
import skill13 from '@/assets/images/skillsicons/ (13).png'
import skill14 from '@/assets/images/skillsicons/ (14).png'
import skill15 from '@/assets/images/skillsicons/ (15).png'
import skill16 from '@/assets/images/skillsicons/ (16).png'
import skill17 from '@/assets/images/skillsicons/ (17).png'
import skill18 from '@/assets/images/skillsicons/ (18).png'
import skill19 from '@/assets/images/skillsicons/ (19).png'
import skill20 from '@/assets/images/skillsicons/ (20).png'
import skill21 from '@/assets/images/skillsicons/ (21).png'
import skill22 from '@/assets/images/skillsicons/ (22).png'
import skill23 from '@/assets/images/skillsicons/ (23).png'
import skill24 from '@/assets/images/skillsicons/ (24).png'
import skill25 from '@/assets/images/skillsicons/ (25).png'
import skill26 from '@/assets/images/skillsicons/ (26).png'
import skill27 from '@/assets/images/skillsicons/ (27).png'
import skill28 from '@/assets/images/skillsicons/ (28).png'
import skill29 from '@/assets/images/skillsicons/ (29).png'
import skill30 from '@/assets/images/skillsicons/ (30).png'
import skill31 from '@/assets/images/skillsicons/ (31).png'
import skill32 from '@/assets/images/skillsicons/ (32).png'
import skill33 from '@/assets/images/skillsicons/ (33).png'
import skill34 from '@/assets/images/skillsicons/ (34).png'
import { API_BASE_URL } from '@/api/client'
const BASE_URL = API_BASE_URL;
const skillIcons = {
  1: skill1, 2: skill2, 3: skill3, 4: skill4, 5: skill5,
  6: skill6, 7: skill7, 8: skill8, 9: skill9, 10: skill10,
  11: skill11, 12: skill12, 13: skill13, 14: skill14, 15: skill15,
  16: skill16, 17: skill17, 18: skill18, 19: skill19, 20: skill20,
  21: skill21, 22: skill22, 23: skill23, 24: skill24, 25: skill25,
  26: skill26, 27: skill27, 28: skill28, 29: skill29, 30: skill30,
  31: skill31, 32: skill32, 33: skill33, 34: skill34
}
export default {
  name: "GameView",
  components: { ModalComponent, FrameComponent },
  data() {
    return {
      gameTypeId: null,
      gameTime: 0,
      timeRemaining: 0,
      timerInterval: null,
      allTexts: [],
      currentTextIndex: 0,
      currentText: "",
      typedText: "",
      startTime: null,
      sessionStartTime: null,
      wpm: 0,
      paused: false,
      showExitConfirm: false,
      exited: false,
      words: [],
      currentWordIndex: 0,
      combo: 0,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
      accuracy: 0,
      lastCompletedWord: '',
      isDamaged: false,
      currentWord: '',
      wordHasError: false,
      actionLog: [],
      playerDamaged: false,
      cursorPosition: 0,
      cursorTop: 0,
      charWidth: 0,
      playerHp: 100,
      playerMaxHp: 100,
      playerMana: 100,
      playerMaxMana: 100,
      monsterHp: 160,
      monsterMaxHp: 160,
      monsterLevel: 5,
      monsterPhoto: null,
      monsterStats: {
        damage: 23.81,
        error_attack: 0.0652,
        hp: 160,
        random_attack: 0.0326,
        wpm_drop_attack: 0.1751
      },
      monstersDefeated: [],
      totalWpm: 0,
      totalAccuracy: 0,
      textsCompleted: 0,
      totalWordErrors: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      gameResult: null,
      activeSkills: [1, 2, 3],
      skillQueue: [],
      skillCooldowns: {},
      cooldownDuration: 3,
      showSkillModal: false,
      selectedSkill: null,
      skillsInfo: {
        1: { id: 1, name: 'Blade Fury', type: 'Passive', description: 'Your typing speed empowers your strikes.', stats: ['+1% damage per 10 WPM'] },
        2: { id: 2, name: 'Confidence', type: 'Passive', description: 'Maintaining combos sharpens your focus.', stats: ['+5% crit chance when combo > 5'] },
        3: { id: 3, name: 'Cold-Blooded', type: 'Passive', description: 'Perfect accuracy unleashes devastating criticals.', stats: ['+15% crit multiplier when accuracy > 95%'] },
        4: { id: 4, name: 'Assassin\'s Path', type: 'Passive', description: 'Precision typing increases your lethality.', stats: ['+10% damage when accuracy > 90%'] },
        5: { id: 5, name: 'Resonance', type: 'Passive', description: 'Extreme speed amplifies critical strikes.', stats: ['+10% crit multiplier per 50 WPM'] },
        7: { id: 7, name: 'Nimble', type: 'Passive', description: 'Your reflexes are permanently enhanced.', stats: ['+5% agility'] },
        8: { id: 8, name: 'Weak Spot', type: 'Passive', description: 'Critical hits improve your defensive stance.', stats: ['+4% block chance on crit'] },
        10: { id: 10, name: 'Unbreakable Will', type: 'Passive', description: 'Flawless typing fortifies your defenses.', stats: ['+10% defense at 100% accuracy'] },
        12: { id: 12, name: 'Bastion', type: 'Passive', description: 'Trade offense for superior defense.', stats: ['-20% damage taken', '-10% damage dealt'] },
        13: { id: 13, name: 'Resolute Spirit', type: 'Reactive', description: 'Mistakes make you tougher temporarily.', stats: ['+5% defense for 3s after error'] },
        14: { id: 14, name: 'Second Block', type: 'Passive', description: 'Combo streaks improve blocking ability.', stats: ['+5% block chance when combo > 5'] },
        15: { id: 15, name: 'Counterstrike', type: 'Reactive', description: 'Successful blocks empower your next attack.', stats: ['+30% damage on next attack after block'] },
        16: { id: 16, name: 'Ricochet', type: 'Active - 50 Mana', description: 'Reflect damage back when blocking.', stats: ['100% damage reflection on block'] },
        18: { id: 18, name: 'Mind Focus', type: 'Passive', description: 'Precision typing enhances mana regeneration.', stats: ['+10% mana gain when accuracy > 95%'] },
        19: { id: 19, name: 'Flow', type: 'Passive', description: 'Typing speed increases mana restoration.', stats: ['+1% mana gain per 10 WPM'] },
        20: { id: 20, name: 'Shield', type: 'Active - 50 Mana', description: 'Create a barrier to negate incoming damage.', stats: ['Nullify next attack'] },
        21: { id: 21, name: 'Mana Transfusion', type: 'Passive', description: 'Convert stored mana into raw power.', stats: ['+1% damage per 100 mana'] },
        23: { id: 23, name: 'Fireball', type: 'Active - 100 Mana', description: 'Launch a devastating magical attack.', stats: ['Deal 5% of monster\'s current HP'] },
        26: { id: 26, name: 'Magical Infusion', type: 'Active - 50 Mana', description: 'Enchant your next strike with arcane power.', stats: ['Next attack deals 150% damage'] },
        27: { id: 27, name: 'Seal of Destruction', type: 'Passive', description: 'A curse that amplifies all your attacks.', stats: ['+10% to all damage'] },
        29: { id: 29, name: 'Sphere of Ancient Wisdom', type: 'Passive', description: 'Learn faster from every encounter.', stats: ['+110% experience gain'] },
        30: { id: 30, name: 'Golden Blessing', type: 'Passive', description: 'Fortune smiles upon you.', stats: ['+110% gold gained'] },
        31: { id: 31, name: 'Shadow of Vengeance', type: 'Reactive', description: 'Death\'s embrace grants momentary immortality.', stats: ['Become invulnerable for 2s when HP < 30%'] },
        32: { id: 32, name: 'Seal of Wrath', type: 'Passive', description: 'Each strike fuels the next.', stats: ['+0.5% damage per attack (stacking)'] },
        33: { id: 33, name: 'Echo of Victory', type: 'Passive', description: 'Victories echo with greater rewards.', stats: ['50% chance for bonus rewards'] },
        34: { id: 34, name: 'Blade of Fate', type: 'Conditional', description: 'Master combos to guarantee critical strikes.', stats: ['Next 10 attacks are crits at 10-combo'] }
      },
      temporaryEffects: {
        damageMultiplier: 1.0,
        critChanceBonus: 0,
        critMultiplierBonus: 0,
        defenseBonus: 0,
        defenseMultiplier: 1.0,
        manaGainMultiplier: 1.0,
        nextAttackDamageMultiplier: 1.0,
        isInvulnerable: false,
        willReflectDamage: false,
        guaranteedCritAttacksLeft: 0,
      },
      skillData: {
        wrathStacks: 0,
        defenseBuffActive: false,
        blockBuffActive: false,
        invulnerabilityUsed: false,
      },
      baseStats: {
        damage: 10,
        critChance: 0.05,
        critMultiplier: 1.5,
        blockChance: 0.1,
        defense: 5,
        agility: 10,
      },
      soundPack: null,
      soundVolume: 50,
      soundEnabled: true,
      gameSessionId: null
    }
  },
  setup() {
    const characterStore = useCharacterStore()
    const gameStore = useGameStore()
    return { characterStore, gameStore }
  },
  async mounted() {
    this.gameTypeId = this.$route.params.id
    this.gameTime = parseInt(this.$route.query.time) || 20
    this.timeRemaining = this.gameTime * 60
    this.startTimer()
    this.sessionStartTime = Date.now()
    this.gameSessionId = Math.floor(Math.random() * 90000000) + 10000000
    if (!this.characterStore.character) {
      try {
        await this.characterStore.fetchCharacter()
      } catch (error) {
        console.error('Failed to fetch character data:', error)
      }
    }
    if (this.characterStore.character) {
      const char = this.characterStore.character
      this.playerMaxHp = char.health_points || 100
      this.playerHp = this.playerMaxHp
      this.playerMaxMana = char.mana || 100
      this.playerMana = this.playerMaxMana
      this.baseStats.damage = char.damage || 10
      this.baseStats.critChance = char.critical_hit_chance || 0.05
      this.baseStats.critMultiplier = (char.critical_multiplier / 100) || 1.5
      this.baseStats.blockChance = char.block_chance || 0.1
      this.baseStats.defense = char.defence || 5
      this.baseStats.agility = char.agility || 10
      if (char.special_enum_ids && char.special_enum_ids.length > 0) {
        this.activeSkills = Array.from(new Set(char.special_enum_ids))
        this.skillQueue = [...this.activeSkills]
      }
    }
    if (this.gameTypeId) {
      try {
        const texts = await this.gameStore.fetchTextsForGameType(this.gameTypeId)
        this.allTexts = texts
        if (texts && texts.length > 0) {
          const randomIndex = Math.floor(Math.random() * texts.length)
          await this.loadText(randomIndex)
        }
      } catch (error) {
        console.error('Failed to fetch game texts:', error)
      }
    }
    window.addEventListener('keydown', this.handleKeyPress)
    this.calculateCharWidth()
    await this.loadSoundPack()
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeRemaining / 60)
      const seconds = this.timeRemaining % 60
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    },
    formattedDate() {
      const now = new Date()
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const day = String(now.getDate()).padStart(2, '0')
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const year = now.getFullYear()
      const dayName = days[now.getDay()]
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      return `${day}.${month}.${year} - ${dayName} ${hours}:${minutes}`
    },
    formattedTime2() {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    },
    monsterImageUrl() {
      return `${BASE_URL}/${this.monsterPhoto}`
    }
  },
  methods: {
    startTimer() {
      this.timerInterval = setInterval(() => {
        if (!this.paused && this.timeRemaining > 0) {
          this.timeRemaining--
          if (this.timeRemaining === 0) {
            this.submitGameResults()
          }
        }
      }, 1000)
    },
    async loadText(index) {
      if (index >= this.allTexts.length || index < 0) {
        await this.submitGameResults()
        return
      }
      this.currentTextIndex = index
      this.currentText = this.allTexts[index].value || ''
      this.words = this.currentText.split(/\s+/).filter(w => w.length > 0)
      await this.spawnMonster()
      this.typedText = ''
      this.currentWordIndex = 0
      this.combo = 0
      this.errors = 0
      this.correctChars = 0
      this.totalChars = 0
      this.startTime = null
      this.skillQueue = [...this.activeSkills]
      this.skillCooldowns = {}
      this.calculateCharWidth()
    },
    async spawnMonster() {
      try {
        const monster = await this.gameStore.generateMonster(this.monsterLevel + Math.floor(this.characterStore.character.lvl / 5))
        this.monsterStats = {
          damage: monster.damage || 20,
          error_attack: monster.error_attack || 0.05,
          hp: monster.hp || 100,
          random_attack: monster.random_attack || 0.03,
          wpm_drop_attack: monster.wpm_drop_attack || 0.15
        }
        this.monsterMaxHp = monster.hp || 100
        this.monsterHp = this.monsterMaxHp
        this.monsterPhoto = monster.photo || null
        this.actionLog.push(`Monster level ${this.monsterLevel} spawned!`)
      } catch (error) {
        console.error('Failed to spawn monster:', error)
      }
    },
    async submitGameResults() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
      }
      const sessionTime = (Date.now() - this.sessionStartTime) / 1000
      const avgWpm = this.textsCompleted > 0 ? this.totalWpm / this.textsCompleted : this.wpm
      const avgAccuracy = this.textsCompleted > 0 ? this.totalAccuracy / this.textsCompleted : this.accuracy
      try {
        const result = await this.gameStore.saveGameResult({
          sessionTime: sessionTime,
          avgWpm: avgWpm,
          avgAccuracy: avgAccuracy,
          wordError: this.totalWordErrors + this.errors,
          monstersDefeated: this.monstersDefeated
        })
        this.gameResult = result
        this.exited = true
      } catch (error) {
        console.error('Failed to submit game results:', error)
        this.exited = true
      }
    },
    handleBack() {
      this.$router.push({ name: 'PlayView' })
    },
    handleExitYes() {
      this.showExitConfirm = false;
      this.exited = true
    },
    handleKeyPress(e) {
      if (e.key == 'Escape') {
        this.paused = !this.paused
        return
      }
      if (this.paused) return
      const keyCode = this.getKeyCode(e)
      if (keyCode) {
        this.playKeySound(keyCode)
      }
      if (e.key.length > 1 && e.key !== 'Backspace') return
      if (e.key === 'Backspace') {
        this.typedText = this.typedText.slice(0, -1)
        if (this.currentWord.length > 0) {
          this.currentWord = this.currentWord.slice(0, -1)
        } else {
        }
        this.cursorPosition = this.typedText.length * this.charWidth
        this.updateCursorPosition()
      } else {
        if (this.typedText.length === 0) {
          this.startTime = Date.now()
        }
        this.totalChars += 1
        const expectedChar = this.currentText[this.typedText.length]
        if (e.key === expectedChar) {
          this.correctChars += 1
          if (expectedChar === ' ' || expectedChar === '\n') {
            this.currentWord = ''
            this.wordHasError = false
          } else {
            this.currentWord += e.key
          }
        } else {
          this.errors += 1
          this.combo = 0
          this.wordHasError = true
          this.currentWord += e.key
        }
        this.typedText += e.key
        this.cursorPosition = this.typedText.length * this.charWidth
        this.updateCursorPosition()
        const nextChar = this.currentText[this.typedText.length]
        if (nextChar === ' ' || nextChar === '\n' || this.typedText.length === this.currentText.length) {
          this.lastCompletedWord = this.words[this.currentWordIndex] || ''
          this.currentWordIndex += 1
          this.combo += 1
          this.onWordCompleted()
        }
        if (this.typedText.length === this.currentText.length) {
          this.calculateWPM()
          this.calculateAccuracy()
          this.textsCompleted++
          this.totalWpm += this.wpm
          this.totalAccuracy += this.accuracy
          this.totalWordErrors += this.errors
          setTimeout(async () => {
            if (this.monsterHp <= 0) {
              this.monsterLevel++
              await this.submitGameResults()
            } else {
              await this.submitGameResults()
            }
          }, 2000)
        }
      }
      if (this.startTime) {
        this.calculateWPM()
        this.calculateAccuracy()
      }
    },
    calculateWPM() {
      if (!this.startTime) return
      const timeElapsed = (Date.now() - this.startTime) / 1000 / 60
      const wordsTyped = this.typedText.length / 5
      this.wpm = Math.round(wordsTyped / timeElapsed) || 0
    },
    calculateAccuracy() {
      this.accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 0
    },
    calculateCharWidth() {
      this.$nextTick(() => {
        if (this.$refs.word && this.$refs.word.children[0]) {
          this.charWidth = this.$refs.word.children[0].getBoundingClientRect().width
        }
      })
    },
    updateCursorPosition() {
      this.$nextTick(() => {
        const typedLength = this.typedText.length;
        if (typedLength === 0) {
          this.cursorPosition = 0;
          this.cursorTop = 0;
          return;
        }
        const lastCharElement = this.$refs.word.children[typedLength - 1];
        if (lastCharElement) {
          const rect = lastCharElement.getBoundingClientRect();
          const containerRect = this.$refs.word.getBoundingClientRect();
          this.cursorPosition = rect.left - containerRect.left + rect.width;
          this.cursorTop = rect.top - containerRect.top;
        }
      });
    },
    onWordCompleted() {
      if (!this.wordHasError) {
        this.actionLog.push(`Typed: ${this.lastCompletedWord}`)
        this.activateNextSkill()
        this.dealDamageToMonster()
        this.restoreMana(10)
        this.isDamaged = true
        setTimeout(() => {
          this.isDamaged = false
        }, 100)
      } else {
        this.actionLog.push(`Error in word: ${this.lastCompletedWord}`)
        this.takeMonsterDamage()
        this.playerDamaged = true
        setTimeout(() => {
          this.playerDamaged = false
        }, 100)
        if (this.activeSkills.includes(13)) {
          this.skillData.defenseBuffActive = true
          this.temporaryEffects.defenseBonus += 5
          setTimeout(() => {
            this.skillData.defenseBuffActive = false
            this.temporaryEffects.defenseBonus = Math.max(0, this.temporaryEffects.defenseBonus - 5)
          }, 3000)
        }
      }
    },
    activateNextSkill() {
      if (this.skillQueue.length === 0) return
      const skillId = this.skillQueue.shift()
      this.startSkillCooldown(skillId)
      this.processSkill(skillId)
      this.skillQueue.push(skillId)
      this.actionLog.push(`Skill #${skillId} activated`)
    },
    getSkillIcon(skillId) {
      return skillIcons[skillId] || ''
    },
    openSkillInfo(skillId) {
      this.selectedSkill = this.skillsInfo[skillId]
      if (this.selectedSkill) {
        this.showSkillModal = true
      }
    },
    isSkillOnCooldown(skillId) {
      return this.skillCooldowns[skillId] && this.skillCooldowns[skillId] > 0
    },
    getSkillCooldown(skillId) {
      return Math.ceil(this.skillCooldowns[skillId] || 0)
    },
    startSkillCooldown(skillId) {
      this.skillCooldowns[skillId] = this.cooldownDuration
      const interval = setInterval(() => {
        if (this.skillCooldowns[skillId] > 0) {
          this.skillCooldowns[skillId] -= 0.1
        } else {
          this.skillCooldowns[skillId] = 0
          clearInterval(interval)
        }
      }, 100)
    },
    processSkill(skillId) {
      switch (skillId) {
        case 1:
          this.temporaryEffects.damageMultiplier += Math.floor(this.wpm / 10) * 0.01
          break
        case 2:
          if (this.combo > 5) {
            this.temporaryEffects.critChanceBonus += 0.05
          }
          break
        case 3:
          if (this.accuracy > 95) {
            this.temporaryEffects.critMultiplierBonus += 0.15
          }
          break
        case 4:
          if (this.accuracy > 90) {
            this.temporaryEffects.damageMultiplier += 0.10
          }
          break
        case 5:
          this.temporaryEffects.critMultiplierBonus += Math.floor(this.wpm / 50) * 0.10
          break
        case 7:
          this.baseStats.agility *= 1.05
          break
        case 8:
          break
        case 10:
          if (this.accuracy === 100) {
            this.temporaryEffects.defenseBonus += 10
          }
          break
        case 12:
          this.temporaryEffects.defenseMultiplier *= 0.8
          this.temporaryEffects.damageMultiplier *= 0.9
          break
        case 13:
          break
        case 14:
          if (this.combo > 5) {
            this.baseStats.blockChance += 0.05
          }
          break
        case 15:
          break
        case 16:
          if (this.playerMana >= 50) {
            this.playerMana -= 50
            this.temporaryEffects.willReflectDamage = true
          }
          break
        case 18:
          if (this.accuracy > 95) {
            this.temporaryEffects.manaGainMultiplier += 0.10
          }
          break
        case 19:
          this.temporaryEffects.manaGainMultiplier += Math.floor(this.wpm / 10) * 0.01
          break
        case 20:
          if (this.playerMana >= 50) {
            this.playerMana -= 50
            this.temporaryEffects.isInvulnerable = true
          }
          break
        case 21:
          this.temporaryEffects.damageMultiplier += Math.floor(this.playerMana / 100) * 0.01
          break
        case 23:
          if (this.playerMana >= 100) {
            this.playerMana -= 100
            const fireballDamage = this.monsterHp * 0.05
            this.monsterHp = Math.max(0, this.monsterHp - fireballDamage)
            this.actionLog.push(`Fireball dealt ${fireballDamage.toFixed(1)} damage!`)
          }
          break
        case 26:
          if (this.playerMana >= 50) {
            this.playerMana -= 50
            this.temporaryEffects.nextAttackDamageMultiplier = 1.5
          }
          break
        case 27:
          this.temporaryEffects.damageMultiplier += 0.10
          break
        case 29:
          break
        case 30:
          break
        case 31:
          if (this.playerHp < this.playerMaxHp * 0.3 && !this.skillData.invulnerabilityUsed) {
            this.temporaryEffects.isInvulnerable = true
            this.skillData.invulnerabilityUsed = true
            setTimeout(() => {
              this.temporaryEffects.isInvulnerable = false
            }, 2000)
          }
          break
        case 32:
          this.skillData.wrathStacks += 1
          this.temporaryEffects.damageMultiplier += 0.005
          break
        case 33:
          break
        case 34:
          if (this.combo >= 10) {
            this.temporaryEffects.guaranteedCritAttacksLeft = 10
          }
          break
        default:
          console.warn(`Unknown skill ID: ${skillId}`)
      }
    },
    calculateDamage() {
      let damage = this.baseStats.damage
      damage *= this.temporaryEffects.damageMultiplier
      damage *= this.temporaryEffects.nextAttackDamageMultiplier
      let isCrit = false
      if (this.temporaryEffects.guaranteedCritAttacksLeft > 0) {
        isCrit = true
        this.temporaryEffects.guaranteedCritAttacksLeft--
      } else {
        const critChance = this.baseStats.critChance + this.temporaryEffects.critChanceBonus
        isCrit = Math.random() < critChance
      }
      if (isCrit) {
        const critMultiplier = this.baseStats.critMultiplier + this.temporaryEffects.critMultiplierBonus
        damage *= critMultiplier
        this.actionLog.push(`CRITICAL HIT!`)
        if (this.activeSkills.includes(8)) {
          this.baseStats.blockChance += 0.04
        }
      }
      this.temporaryEffects.nextAttackDamageMultiplier = 1.0
      return Math.round(damage)
    },
    dealDamageToMonster() {
      const damage = this.calculateDamage()
      this.monsterHp = Math.max(0, this.monsterHp - damage)
      this.totalDamageDealt += damage
      this.actionLog.push(`Dealt ${damage} damage to monster!`)
      if (this.monsterHp <= 0) {
        this.monstersDefeated.push(this.monsterLevel)
        this.actionLog.push(`Monster defeated!`)
        if (this.typedText.length < this.currentText.length) {
          this.monsterLevel++
          setTimeout(async () => {
            await this.spawnMonster()
          }, 500)
        }
      }
    },
    takeMonsterDamage() {
      if (this.temporaryEffects.isInvulnerable) {
        this.actionLog.push(`Shield absorbed the damage!`)
        this.temporaryEffects.isInvulnerable = false
        return
      }
      if (Math.random() < this.baseStats.blockChance) {
        this.actionLog.push(`Blocked monster attack!`)
        if (this.activeSkills.includes(15)) {
          this.temporaryEffects.nextAttackDamageMultiplier = 1.3
        }
        if (this.temporaryEffects.willReflectDamage) {
          const reflectedDamage = this.monsterStats.damage
          this.monsterHp = Math.max(0, this.monsterHp - reflectedDamage)
          this.actionLog.push(`Reflected ${reflectedDamage.toFixed(1)} damage!`)
          this.temporaryEffects.willReflectDamage = false
        }
        return
      }
      let damage = this.monsterStats.damage
      damage *= this.temporaryEffects.defenseMultiplier
      damage = Math.max(1, damage - this.baseStats.defense - this.temporaryEffects.defenseBonus)
      this.playerHp = Math.max(0, this.playerHp - damage)
      this.totalDamageTaken += damage
      this.actionLog.push(`Took ${damage.toFixed(1)} damage!`)
      if (this.playerHp <= 0) {
        this.actionLog.push(`You were defeated!`)
        setTimeout(async () => {
          await this.submitGameResults()
        }, 1000)
      }
    },
    restoreMana(amount) {
      const restoredAmount = amount * this.temporaryEffects.manaGainMultiplier
      this.playerMana = Math.min(this.playerMaxMana, this.playerMana + restoredAmount)
    },
    resetGame() {
      this.typedText = ""
      this.startTime = null
      this.wpm = 0
      this.accuracy = 0
      this.combo = 0
      this.errors = 0
      this.correctChars = 0
      this.totalChars = 0
      this.currentWordIndex = 0
      this.lastCompletedWord = ''
      this.isDamaged = false
      this.currentWord = ''
      this.wordHasError = false
      this.actionLog = []
      this.playerDamaged = false
      this.cursorPosition = 0
      this.cursorTop = 0
      this.playerHp = this.playerMaxHp
      this.playerMana = this.playerMaxMana
      this.monsterHp = this.monsterMaxHp
      this.temporaryEffects = {
        damageMultiplier: 1.0,
        critChanceBonus: 0,
        critMultiplierBonus: 0,
        defenseBonus: 0,
        defenseMultiplier: 1.0,
        manaGainMultiplier: 1.0,
        nextAttackDamageMultiplier: 1.0,
        isInvulnerable: false,
        willReflectDamage: false,
        guaranteedCritAttacksLeft: 0,
      }
      this.skillData = {
        wrathStacks: 0,
        defenseBuffActive: false,
        blockBuffActive: false,
        invulnerabilityUsed: false,
      }
      this.skillQueue = [...this.activeSkills]
      this.skillCooldowns = {}
    },
    async loadSoundPack() {
      try {
        const configResponse = await fetch('/src/assets/sounds/config.json')
        const packData = await configResponse.json()
        const keyDefineType = packData.key_define_type
        const soundFile = packData.sound
        const defines = packData.defines
        if (keyDefineType === 'single') {
          const soundPath = `/src/assets/sounds/${soundFile}`
          const sound = new Howl({
            src: [soundPath],
            sprite: defines,
            volume: this.soundVolume / 100
          })
          this.soundPack = {
            ...packData,
            sound: sound
          }
          console.log('Sound pack loaded successfully')
        } else {
          const soundData = {}
          for (const kc in defines) {
            if (defines[kc]) {
              const soundPath = `/src/assets/sounds/${defines[kc]}`
              soundData[kc] = new Howl({
                src: [soundPath],
                volume: this.soundVolume / 100
              })
            }
          }
          this.soundPack = {
            ...packData,
            sound: soundData
          }
          console.log('Sound pack loaded successfully')
        }
      } catch (error) {
        console.error('Failed to load sound pack:', error)
      }
    },
    playKeySound(keyCode) {
      if (!this.soundEnabled || !this.soundPack) return
      const playType = this.soundPack.key_define_type || 'single'
      const sound = playType === 'single' ? this.soundPack.sound : this.soundPack.sound[keyCode]
      if (!sound) return
      sound.volume(this.soundVolume / 100)
      if (playType === 'single') {
        sound.play(keyCode)
      } else {
        sound.play()
      }
    },
    getKeyCode(e) {
      const keyMap = {
        'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5',
        'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '10',
        'Minus': '11', 'Equal': '12', 'Backspace': '13',
        'KeyQ': '14', 'KeyW': '15', 'KeyE': '16', 'KeyR': '17', 'KeyT': '18',
        'KeyY': '19', 'KeyU': '20', 'KeyI': '21', 'KeyO': '22', 'KeyP': '23',
        'BracketLeft': '24', 'BracketRight': '25', 'Backslash': '26',
        'KeyA': '27', 'KeyS': '28', 'KeyD': '29', 'KeyF': '30', 'KeyG': '31',
        'KeyH': '32', 'KeyJ': '33', 'KeyK': '34', 'KeyL': '35', 'Semicolon': '36',
        'Quote': '37', 'Enter': '38',
        'ShiftLeft': '39', 'KeyZ': '40', 'KeyX': '41', 'KeyC': '42', 'KeyV': '43',
        'KeyB': '44', 'KeyN': '45', 'KeyM': '46', 'Comma': '47', 'Period': '48',
        'Slash': '49', 'ShiftRight': '50',
        'Space': '51'
      }
      return keyMap[e.code] || null
    },
  }
}
</script>