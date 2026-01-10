import { defineStore } from 'pinia'
import apiClient from '@/api/client'
export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        character: null,
        statistics: null,
        loading: false,
        error: null
    }),
    getters: {
        isUserLoaded: (state) => !!state.user,
        userId: (state) => state.user?.id,
        userEmail: (state) => state.user?.email,
        userLogin: (state) => state.user?.login,
        userAvatar: (state) => state.user?.avatar,
        userFrame: (state) => state.user?.frame,
        userNotification: (state) => state.user?.is_notification,
        userCharacter: (state) => state.user?.character
    },
    actions: {
        setUser(userData) {
            this.user = userData
        },
        async fetchCurrentUser() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/user/me')
                this.user = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch user'
                this.loading = false
                throw error
            }
        },
        async updateUser(userData) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.put('/user/', {
                    avatar: userData.avatar,
                    frame: userData.frame,
                    country: userData.country,
                    is_notification: userData.isNotification,
                    is_advertisement: userData.isAdvertisement
                })
                this.user = { ...this.user, ...response.data }
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to update user'
                this.loading = false
                throw error
            }
        },
        async deleteUser() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.delete('/user/')
                this.user = null
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to delete user'
                this.loading = false
                throw error
            }
        },
        async fetchStatistics() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/user/statistic')
                this.statistics = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch statistics'
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
        }
    }
})
