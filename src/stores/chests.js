import { defineStore } from 'pinia'
import apiClient from '@/api/client'
export const useChestsStore = defineStore('chests', {
    state: () => ({
        chests: [],
        chestProbabilities: {},
        loading: false,
        error: null
    }),
    getters: {
        chestById: (state) => (id) => state.chests.find(chest => chest.id === id),
        getProbabilities: (state) => (chestId) => state.chestProbabilities[chestId]
    },
    actions: {
        async fetchChests() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/chest')
                this.chests = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch chests'
                this.loading = false
                throw error
            }
        },
        async fetchChestProbabilities(chestId) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get(`/chest/info/${chestId}`)
                this.chestProbabilities[chestId] = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch chest probabilities'
                this.loading = false
                throw error
            }
        },
        async openChest(chestId) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get(`/chest/open/${chestId}`)
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to open chest'
                this.loading = false
                throw error
            }
        }
    }
})
