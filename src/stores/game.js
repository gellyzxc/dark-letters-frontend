import { defineStore } from 'pinia'
import apiClient from '@/api/client'
export const useGameStore = defineStore('game', {
    state: () => ({
        gameTypes: [],
        currentMonster: null,
        currentTexts: [],
        loading: false,
        error: null
    }),
    getters: {
        gameTypeById: (state) => (id) => state.gameTypes.find(type => type.id === id)
    },
    actions: {
        async fetchGameTypes() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/game/')
                this.gameTypes = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch game types'
                this.loading = false
                throw error
            }
        },
        async fetchTextsForGameType(gameTypeId) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get(`/game/text/${gameTypeId}`)
                this.currentTexts = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch texts'
                this.loading = false
                throw error
            }
        },
        async generateMonster(level) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get(`/game/monster/${level}`)
                this.currentMonster = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to generate monster'
                this.loading = false
                throw error
            }
        },
        async saveGameResult(resultData) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.post('/game/result', {
                    session_time: resultData.sessionTime,
                    avg_accuracy: resultData.avgAccuracy,
                    avg_wpm: resultData.avgWpm,
                    word_error: resultData.wordError,
                    monsters_defeated: resultData.monstersDefeated
                })
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to save game result'
                this.loading = false
                throw error
            }
        },
        clearCurrentGame() {
            this.currentMonster = null
            this.currentTexts = []
        }
    }
})
