import { createRouter, createWebHistory } from 'vue-router'
import LayoutComponent from "@/components/LayoutComponent.vue";
import GameView from "@/views/GameView.vue";
import PlayView from "@/views/PlayView.vue";
import DragDropExample from "@/components/DragDropExample.vue";
import BlacksmithView from "@/views/BlacksmithView.vue";
import ShopView from "@/views/ShopView.vue";
import BlackmarketView from "@/views/BlackmarketView.vue";
import ArtifactsView from "@/views/ArtifactsView.vue";
import InventoryView from '@/views/InventoryView.vue';
import SkillsView from '@/views/SkillsView.vue';
import NodeEditorView from '@/views/NodeEditorView.vue';
import CharacterSelectView from '@/views/CharacterSelectView.vue';
import NewsView from '@/views/NewsView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import OTPView from '@/views/OTPView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/news'
    },
    {
      name: 'LoginView',
      path: '/login',
      component: LoginView
    },
    {
      name: 'RegisterView',
      path: '/register',
      component: RegisterView
    },
    {
      name: 'OTPView',
      path: '/otp',
      component: OTPView
    },
    {
      name: 'GameView',
      path: '/game/:id',
      component: GameView
    },
    // {
    //   name: 'NodeEditorView',
    //   path: '/',
    //   component: NodeEditorView
    // },
    {
      name: 'CharacterSelectView',
      path: '/character-select',
      component: CharacterSelectView
    },
    {
      path: '/',
      component: LayoutComponent,
      children: [
        {
          name: 'PlayView',
          path: '/play',
          component: PlayView
        },
        {
          name: 'NewsView',
          path: '/news',
          component: NewsView
        },
        {
          name: 'BlacksmithView',
          path: '/blacksmith',
          component: BlacksmithView
        },
        {
          name: 'ShopView',
          path: '/shop',
          component: ShopView
        },
        {
          name: 'BlackmarketView',
          path: '/blackmarket',
          component: BlackmarketView
        },
        {
          name: 'ArtifactsView',
          path: '/artifacts',
          component: ArtifactsView
        },
        {
          name: 'InventoryView',
          path: '/inventory',
          component: InventoryView
        },
        {
          name: 'SkillsView',
          path: '/skills',
          component: SkillsView
        },
        {
          name: 'SettingsView',
          path: '/settings',
          component: () => import('@/views/SettingsView.vue')
        }
      ]
    }
  ],
})

export default router
