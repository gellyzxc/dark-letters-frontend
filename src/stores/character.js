import { defineStore } from 'pinia'
import apiClient from '@/api/client'
export const useCharacterStore = defineStore('character', {
    state: () => ({
        character: null,
        loading: false,
        error: null
    }),
    getters: {
        hasCharacter: (state) => !!state.character,
        characterId: (state) => state.character?.id,
        characterLevel: (state) => state.character?.lvl,
        characterExperience: (state) => state.character?.experience,
        characterGold: (state) => state.character?.gold,
        characterClass: (state) => state.character?.class,
        characterRace: (state) => state.character?.race,
        characterStats: (state) => ({
            strength: state.character?.strength,
            agility: state.character?.agility,
            intellect: state.character?.intellect,
            hp: state.character?.hp,
            mana: state.character?.mana,
            damage: state.character?.damage,
            armor: state.character?.armor,
            crit_chance: state.character?.crit_chance,
            crit_damage: state.character?.crit_damage
        }),
        allocatedPoints: (state) => state.character?.allocated_points || []
    },
    actions: {
        setCharacter(characterData) {
            this.character = characterData
        },
        async createCharacter(classId, raceId) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.post('/character/', {
                    class_id: classId,
                    race_id: raceId
                })
                this.character = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to create character'
                this.loading = false
                throw error
            }
        },
        async fetchCharacter() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/character/me')
                this.character = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch character'
                this.loading = false
                throw error
            }
        },
        async updateCharacter(characterId, updates) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.put(`/character/${characterId}`, updates)
                this.character = { ...this.character, ...response.data }
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to update character'
                this.loading = false
                throw error
            }
        },
        async deleteCharacter(characterId) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.delete(`/character/${characterId}`)
                this.character = null
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to delete character'
                this.loading = false
                throw error
            }
        },
        async allocateSkillPoint(nodeUid) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get(`/character/tree/allocate/${nodeUid}`)
                await this.fetchCharacter()
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to allocate skill point'
                this.loading = false
                throw error
            }
        },
        async unallocateSkillPoint(nodeUid) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get(`/character/tree/unallocate/${nodeUid}`)
                await this.fetchCharacter()
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to unallocate skill point'
                this.loading = false
                throw error
            }
        }
    }
})
