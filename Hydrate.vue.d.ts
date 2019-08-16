import { Component } from 'vue'

declare const Hydrate: Component<
  { hydrated: boolean },
  { hydrate(): void },
  {},
  {
    on?: string
    onClick: boolean
    onHover: boolean
    onInteraction: boolean
    whenVisible: boolean
    whenIdle: boolean
    withDelay: number
    ssrOnly: boolean
    force: boolean
  }
> & { functional: false }

export default Hydrate
