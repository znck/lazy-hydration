import Vue from 'vue'
import Router from 'vue-router'

import HomePage from './pages/index.vue'
const WhenVisiblePage = createRoute(() => import('./pages/when-visible.vue'))
const WhenIdlePage = createRoute(() => import('./pages/when-idle.vue'))
const WithDelayPage = createRoute(() => import('./pages/with-delay.vue'))
const SSROnlyPage = createRoute(() => import('./pages/ssr-only.vue'))
const OnClickPage = createRoute(() => import('./pages/on-click.vue'))
const OnHoverPage = createRoute(() => import('./pages/on-hover.vue'))
const OnInteractionPage = createRoute(() => import('./pages/on-interaction.vue'))

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

function createRoute(fn) {
  return async () => {
    const result = await fn()

    return result.default
  }
}
