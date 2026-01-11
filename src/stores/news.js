import { defineStore } from 'pinia'
import apiClient from '@/api/client'
export const useNewsStore = defineStore('news', {
    state: () => ({
        news: [],
        loading: false,
        error: null
    }),
    getters: {
        newsById: (state) => (id) => state.news.find(item => item.id === id),
        sortedNews: (state) => [...state.news].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
    actions: {
        async fetchNews() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/news/')
                this.news = response.data.news
                this.loading = false
                return response.data.news
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch news'
                this.loading = false
                throw error
            }
        }
    }
})
