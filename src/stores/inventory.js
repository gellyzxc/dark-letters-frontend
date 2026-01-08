import { defineStore } from 'pinia'
import apiClient from '@/api/client'
export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        items: [],
        shopItems: [],
        loading: false,
        error: null
    }),
    getters: {
        equippedItems: (state) => state.items.filter(item => item.is_equipped),
        inventoryItems: (state) => state.items.filter(item => !item.is_equipped),
        equippedWeapon: (state) => state.items.find(item => item.is_equipped && item.type === 'weapon'),
        equippedArmor: (state) => state.items.find(item => item.is_equipped && item.type === 'armor'),
        equippedAmulet: (state) => state.items.find(item => item.is_equipped && item.type === 'amulet'),
        itemById: (state) => (id) => state.items.find(item => item.id === id)
    },
    actions: {
        async fetchUserItems() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/item/user')
                this.items = response.data.inventory
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch items'
                this.loading = false
                throw error
            }
        },
        async fetchShopItems() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/item/shop')
                this.shopItems = response.data
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch shop items'
                this.loading = false
                throw error
            }
        },
        async updateItem(itemId, updates) {
            this.loading = true
            this.error = null
            console.log(updates)
            try {
                const response = await apiClient.put(`/item/${itemId}`, updates)
                const index = this.items.findIndex(item => item.id === itemId)
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to update item'
                this.loading = false
                throw error
            }
        },
        async equipItem(itemId) {
            return await this.updateItem(itemId, { isEquipped: true })
        },
        async unequipItem(itemId) {
            return await this.updateItem(itemId, { isEquipped: false })
        },
        async deleteItem(itemId) {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.delete(`/item/${itemId}`)
                this.items = this.items.filter(item => item.id !== itemId)
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to delete item'
                this.loading = false
                throw error
            }
        }
    }
})
