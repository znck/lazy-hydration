import Vue from 'vue'
import Router from 'vue-router'

import HomePage from './pages/index.vue'
import WhenVisiblePage from './pages/when-visible.vue'
import WhenIdlePage from './pages/when-idle.vue'
import WithDelayPage from './pages/with-delay.vue'
import SSROnlyPage from './pages/ssr-only.vue'
import OnClickPage from './pages/on-click.vue'
import OnHoverPage from './pages/on-hover.vue'
import OnInteractionPage from './pages/on-interaction.vue'

Vue.use(Router)

/** @type {import('vue-router').RouteConfig[]} */
export const routes = [
  {
    name: 'Home',
    path: '/',
    component: HomePage,
  },
  {
    name: 'When Visible',
    path: '/when-visible',
    component: WhenVisiblePage,
  },
  {
    name: 'When Idle',
    path: '/when-idle',
    component: WhenIdlePage,
  },
  {
    name: 'With Delay',
    path: '/with-delay',
    component: WithDelayPage,
  },
  {
    name: 'On Click',
    path: '/on-click',
    component: OnClickPage,
  },
  {
    name: 'On Hover',
    path: '/on-hover',
    component: OnHoverPage,
  },
  {
    name: 'On Interaction',
    path: '/on-interaction',
    component: OnInteractionPage,
  },
  {
    name: 'SSR Only',
    path: '/ssr-only',
    component: SSROnlyPage,
  },
]

export function createRouter() {
  return new Router({ routes, mode: 'history' })
}

// function createRoute(fn) {
//   return async () => {
//     const result = await fn()

//     return result.default
//   }
// }
