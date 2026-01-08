import { defineStore } from 'pinia'
import apiClient from '@/api/client'
import { useUserStore } from './user'
import { useCharacterStore } from './character'
export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: localStorage.getItem('access_token') || null,
        refreshToken: localStorage.getItem('refresh_token') || null,
        isAuthenticated: !!localStorage.getItem('access_token'),
        loading: false,
        error: null
    }),
    actions: {
        async register(userData) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.post('/user/register', {
                    login: userData.login,
                    email: userData.email,
                    password: userData.password,
                    country: userData.country || 'Russia',
                    is_accept_policy: userData.isAcceptPolicy || true,
                    is_advertisement: userData.isAdvertisement || false
                })
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Registration failed'
                this.loading = false
                throw error
            }
        },
        async verifyEmail(verificationCode) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get(`/user/email/confirm/${verificationCode}`)
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Verification failed'
                this.loading = false
                throw error
            }
        },
        async login(credentials) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.post('/user/auth', {
                    email: credentials.email,
                    password: credentials.password
                })
                const { access_token, refresh_token, ...userData } = response.data
                this.accessToken = access_token
                this.refreshToken = refresh_token
                this.isAuthenticated = true
                localStorage.setItem('access_token', access_token)
                localStorage.setItem('refresh_token', refresh_token)
                const userStore = useUserStore()
                userStore.setUser(userData)
                if (userData.character) {
                    const characterStore = useCharacterStore()
                    characterStore.setCharacter(userData.character)
                }
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Login failed'
                this.loading = false
                throw error
            }
        },
        async logout() {
            this.accessToken = null
            this.refreshToken = null
            this.isAuthenticated = false
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            const userStore = useUserStore()
            const characterStore = useCharacterStore()
            userStore.$reset()
            characterStore.$reset()
        },
        async requestPasswordReset(email) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.post('/user/password/reset', { email })
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Request failed'
                this.loading = false
                throw error
            }
        },
        async resetPassword(verificationCode, newPassword) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.put('/user/password/reset', {
                    verification_code: verificationCode,
                    new_password: newPassword
                })
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Password reset failed'
                this.loading = false
                throw error
            }
        },
        async refreshAccessToken() {
            try {
                const response = await apiClient.get('/user/refresh', {
                    headers: {
                        Authorization: `Bearer ${this.refreshToken}`
                    }
                })
                const { access_token } = response.data
                this.accessToken = access_token
                localStorage.setItem('access_token', access_token)
                return access_token
            } catch (error) {
                await this.logout()
                throw error
            }
        }
    }
})
