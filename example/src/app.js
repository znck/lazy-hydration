import Vue from 'vue'
import { createRouter } from './router'

Vue.config.devtools = true

export function createApp() {
  const router = createRouter()
  const app = new Vue({
    name: 'App',
    router,
    render: h => {
      return h('div', { attrs: { id: 'app' } }, [h('RouterView')])
    },
  })

  return { app, router }
}
