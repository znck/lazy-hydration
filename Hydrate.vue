<script>
const isBrowser = typeof window !== "undefined";

const io =
  typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.parentElement.hydrate &&
              entry.target.parentElement.hydrate();
          }
        });
      })
    : null;

if (isBrowser) window.io = io;

export default {
  props: {
    onClick: Boolean,
    onHover: Boolean,
    onInteraction: Boolean,
    whenVisible: Boolean,
    whenIdle: Boolean,
    ssrOnly: Boolean
  },
  data: () => ({
    hydrated: !isBrowser
  }),
  beforeCreate() {
    if (isBrowser) {
      const render = this.$options.render;

      this.$options.render = (...args) => {
        const vnode = render.apply(this, args);

        vnode.asyncFactory = this.hydrated ? { resolved: true } : {};
        vnode.isAsyncPlaceholder = !this.hydrated;

        return vnode;
      };
    }
  },
  mounted() {
    if (this.$el.childElementCount === 0) {
      // No SSR rendered content.
      this.hydrated = true;

      return;
    }

    if (this.ssrOnly) return;

    if (this.whenIdle) {
      const id = requestIdleCallback(
        () => {
          requestAnimationFrame(() => {
            this.hydrate();
          });
        },
        { timeout: 500 }
      );

      this.idle = () => cancelIdleCallback(id);
    }

    if (this.whenVisible) {
      this.$el.hydrate = this.hydrate;

      if (io) io.observe(this.$el.children[0]);
      else console.warn("IntersectionObserver polyfill is required.");

      this.visible = () => {
        io && io.unobserve(this.$el);
        delete this.$el.hydrate;
      };
    }

    if (this.onClick) {
      this.$el.addEventListener("click", this.hydrate, {
        capture: true,
        once: true
      });
      this.click = () => this.$el.removeEventListener("click", this.hydrate);
    }

    if (this.onHover || this.onInteraction) {
      this.$el.addEventListener("mouseenter", this.hydrate, {
        capture: true,
        once: true
      });
      this.hover = () =>
        this.$el.removeEventListener("mouseenter", this.hydrate);
    }

    if (this.onInteraction) {
      this.$el.addEventListener("focus", this.hydrate, {
        capture: true,
        once: true
      });
      this.interaction = () =>
        this.$el.removeEventListener("focus", this.hydrate);
    }
  },
  beforeDestroy() {
    this.cleanup();
  },
  methods: {
    cleanup() {
      const handlers = ["visible", "idle", "click", "hover", "interaction"];

      for (const handler of handlers) {
        if (handler in this) {
          this[handler]();
          delete this[handler];
        }
      }
    },
    hydrate() {
      this.hydrated = true;
      this.cleanup();
    }
  }
};
</script>

<template>
  <div v-if="hydrated" style="display: contents">
    <slot/>
  </div>
  <div v-else style="display: contents"/>
</template>
