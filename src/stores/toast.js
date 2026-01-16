import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: []
  }),
  
  actions: {
    show({ message, type = 'info', duration = 3000, frameType = 'generic-card-horizontal' }) {
      const id = Date.now() + Math.random()
      
      const toast = {
        id,
        message,
        type,
        frameType,
        visible: true
      }
      
      this.toasts.push(toast)
      
      if (duration > 0) {
        setTimeout(() => {
          this.remove(id)
        }, duration)
      }
      
      return id
    },
    
    remove(id) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index !== -1) {
        this.toasts.splice(index, 1)
      }
    },
    
    clear() {
      this.toasts = []
    }
  }
})
