import { useToastStore } from '@/stores/toast'

export default {
  install(app) {
    // Добавляем метод $toast в глобальные свойства
    app.config.globalProperties.$toast = {
      show(message, options = {}) {
        const toastStore = useToastStore()
        return toastStore.show({ message, ...options })
      },
      
      success(message, options = {}) {
        const toastStore = useToastStore()
        return toastStore.show({ 
          message, 
          type: 'success',
          ...options 
        })
      },
      
      error(message, options = {}) {
        const toastStore = useToastStore()
        return toastStore.show({ 
          message, 
          type: 'error',
          duration: 5000,
          ...options 
        })
      },
      
      warning(message, options = {}) {
        const toastStore = useToastStore()
        return toastStore.show({ 
          message, 
          type: 'warning',
          ...options 
        })
      },
      
      info(message, options = {}) {
        const toastStore = useToastStore()
        return toastStore.show({ 
          message, 
          type: 'info',
          ...options 
        })
      },
      
      clear() {
        const toastStore = useToastStore()
        toastStore.clear()
      }
    }
  }
}
