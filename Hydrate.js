/* eslint-disable no-console */
import PropTypes from '@znck/prop-types'

const isBrowser = typeof window !== 'undefined'

const io =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.dispatchEvent(new CustomEvent('hydration:visible'))
          }
        })
      })
    : null

const asyncFactoryResolved = { resolved: true }
const asyncFactory = {}
const clientSideDivData = {
  attrs: {
    'data-force-hydrate': true,
  },
}

export default {
  props: {
    on: PropTypes.oneOfType(String, PropTypes.arrayOf(String)),
    onClick: PropTypes.bool,
    onHover: PropTypes.bool,
    onInteraction: PropTypes.bool,
    whenVisible: PropTypes.bool,
    whenIdle: PropTypes.bool,
    withDelay: PropTypes.number,
    ssrOnly: PropTypes.bool,
    force: PropTypes.bool,
  },  
  data: () => ({
    hydrated: !isBrowser,
  }),
  created() {
    PropTypes.validate(() => {
      if (
        !this.on &&
        !this.onClick &&
        !this.onHover &&
        !this.onInteraction &&
        !this.whenVisible &&
        !this.whenIdle &&
        !this.ssrOnly &&
        this.force === undefined
      ) {
        console.error(
          `Select at least one trigger to enable hydration. If you don't want to hydrate at all use 'ssr-only'.`
        )
      }

      if (this.withDelay && this.withDelay < 800) {
        console.warn(
          `Delay duration ${
            this.withDelay
          }ms is too low. A good choice would be around 2000ms. See https://github.com/znck/lazy-hydration.`
        )
      }
    })
  },
  mounted() {
    if (this.$el.dataset.forceHydrate) {
      PropTypes.validate(() => {
        console.log('No SSR rendered content found. Force Hydrate.')
      })
      // No SSR rendered content. Render now.
      this.hydrate()

      return
    }

    if (this.ssrOnly) return

    let withDelay
    const on = (Array.isArray(this.on) ? this.on : [this.on])
      .slice()
      .filter(name => typeof name !== 'string')

    if (this.onClick) {
      on.push('click')
    }

    if (this.onHover || this.onInteraction) {
      on.push('mouseenter')

      if (this.onInteraction) {
        on.push('focus')
      }
    }

    if (this.whenIdle) {
      if (typeof requestIdleCallback !== 'undefined') {
        const id = requestIdleCallback(
          () => {
            requestAnimationFrame(() => {
              this.hydrate()
            })
          },
          { timeout: 500 }
        )

        this.idle = () => cancelIdleCallback(id)
      } else withDelay = 2000
    }

    if (this.whenVisible) {
      const el = this.$el
      // As root node does not have any box model, it cannot intersect.
      on.push('hydration:visible')
      if (io) io.observe(el)
      else {
        withDelay = 2000
        PropTypes.validate(() =>
          console.warn('IntersectionObserver polyfill is required.')
        )
      }

      this.visible = () => {
        io && io.unobserve(el)
      }
    }

    if (on.length) {
      on.forEach(event =>
        this.$el.addEventListener(event, this.hydrate, {
          capture: true,
          once: true,
        })
      )
      this.off = () =>
        on.forEach(event => this.$el.removeEventListener(event, this.hydrate))
    }

    if (this.withDelay || withDelay) {
      const id = setTimeout(this.hydrate, this.withDelay || withDelay)
      this.delay = () => clearTimeout(id)
    }
  },
  beforeDestroy() {
    this.cleanup()
  },
  methods: {
    cleanup() {
      const handlers = ['visible', 'idle', 'delay', 'off']

      for (const handler of handlers) {
        if (handler in this) {
          this[handler]()
          delete this[handler]
        }
      }
    },
    hydrate() {
      this.hydrated = true
      this.cleanup()
    },
  },
  render(h) {
    const vnode = this.hydrated
      ? this.$scopedSlots.default
        ? this.$scopedSlots.default({ hydrated: this.hydrated })[0]
        : this.$slots.default[0]
      : h('div', clientSideDivData)

    vnode.asyncFactory = this.hydrated ? asyncFactoryResolved : asyncFactory
    vnode.isComment = !this.hydrated

    if (isBrowser) {
      window.vnode = vnode
    }

    return vnode
  },
  watch: {
    force: {
      handler(value) {
        if (value) this.hydrate()
      },
      immediate: true,
    },
  },
}
