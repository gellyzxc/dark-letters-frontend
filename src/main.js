import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import toastPlugin from '@/plugins/toast'

import '@/assets/styles/base.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(toastPlugin)

app.mount('#app')
