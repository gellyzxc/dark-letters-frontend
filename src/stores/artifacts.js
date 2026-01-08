import { defineStore } from 'pinia'
import apiClient from '@/api/client'
export const useArtifactsStore = defineStore('artifacts', {
    state: () => ({
        artifacts: [],
        loading: false,
        error: null
    }),
    getters: {
        equippedArtifacts: (state) => state.artifacts.filter(artifact => artifact.is_equipped),
        unequippedArtifacts: (state) => state.artifacts.filter(artifact => !artifact.is_equipped),
        artifactById: (state) => (id) => state.artifacts.find(artifact => artifact.id === id)
    },
    actions: {
        async fetchArtifacts() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/artifact/')
                // API возвращает { equipped: [], inventory: [] }
                // Объединяем в один массив для удобства работы
                const data = response.data
                this.artifacts = [
                    ...(data.equipped || []),
                    ...(data.inventory || [])
                ]
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch artifacts'
                this.loading = false
                throw error
            }
        },
        async updateArtifact(artifactId, isEquipped) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.put(`/artifact/${artifactId}`, {
                    is_equipped: isEquipped
                })
                const index = this.artifacts.findIndex(artifact => artifact.id === artifactId)
                if (index !== -1) {
                    this.artifacts[index] = { ...this.artifacts[index], ...response.data }
                }
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to update artifact'
                this.loading = false
                throw error
            }
        },
        async equipArtifact(artifactId) {
            return await this.updateArtifact(artifactId, true)
        },
        async unequipArtifact(artifactId) {
            return await this.updateArtifact(artifactId, false)
        },
        async deleteArtifact(artifactId) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.delete(`/artifact/${artifactId}`)
                this.artifacts = this.artifacts.filter(artifact => artifact.id !== artifactId)
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to delete artifact'
                this.loading = false
                throw error
            }
        }
    }
})
