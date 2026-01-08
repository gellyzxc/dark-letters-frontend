import { defineStore } from 'pinia'
import apiClient from '@/api/client'
export const useStaticStore = defineStore('static', {
    state: () => ({
        classes: [],
        races: [],
        loading: false,
        error: null
    }),
    getters: {
        classById: (state) => (id) => state.classes.find(cls => cls.id === id),
        raceById: (state) => (id) => state.races.find(race => race.id === id)
    },
    actions: {
        async fetchClasses() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/classes')
                this.classes = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch classes'
                this.loading = false
                throw error
            }
        },
        async fetchRaces() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/races')
                this.races = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch races'
                this.loading = false
                throw error
            }
        },
        async fetchAll() {
            await Promise.all([
                this.fetchClasses(),
                this.fetchRaces()
            ])
        }
    }
})
