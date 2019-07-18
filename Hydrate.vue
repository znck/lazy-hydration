<script>
import PropTypes from "@znck/prop-types";

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
    force: PropTypes.bool
  },
  data: () => ({
    hydrated: !isBrowser
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
        );
      }

      if (this.withDelay && this.withDelay < 800) {
        console.warn(
          `Delay duration ${
            this.withDelay
          }ms is too low. A good choice would be around 2000ms. See https://github.com/znck/lazy-hydration.`
        );
      }
    });
  },
  mounted() {
    if (this.$el.childElementCount === 0) {
      // No SSR rendered content. Render now.
      this.hydrate();

      return;
    }

    if (this.ssrOnly) return;

    let withDelay;
    const on = this.on ? [this.on].flat() : [];

    if (this.onClick) {
      on.push("click");
    }

    if (this.onHover || this.onInteraction) {
      on.push("mouseenter");

      if (this.onInteraction) {
        on.push("focus");
      }
    }

    if (this.whenIdle) {
      if (typeof requestIdleCallback !== "undefined") {
        const id = requestIdleCallback(
          () => {
            requestAnimationFrame(() => {
              this.hydrate();
            });
          },
          { timeout: 500 }
        );

        this.idle = () => cancelIdleCallback(id);
      } else withDelay = 2000;
    }

    if (this.whenVisible) {
      // As root node does not have any box model, it cannot intersect.
      const el = this.$el.children[0];

      el.hydrate = this.hydrate;
      if (io) io.observe(el);
      else {
        withDelay = 2000;
        PropTypes.validate(() =>
          console.warn("IntersectionObserver polyfill is required.")
        );
      }

      this.visible = () => {
        io && io.unobserve(el);
        delete el.hydrate;
      };
    }

    if (on.length) {
      on.forEach(event =>
        this.$el.addEventListener(event, this.hydrate, {
          capture: true,
          once: true
        })
      );
      this.off = () =>
        on.forEach(event => this.$el.removeEventListener(event, this.hydrate));
    }

    if (this.withDelay || withDelay) {
      const id = setTimeout(this.hydrate, this.withDelay || withDelay);
      this.delay = () => clearTimeout(id);
    }
  },
  beforeDestroy() {
    this.cleanup();
  },
  methods: {
    cleanup() {
      const handlers = ["visible", "idle", "delay", "off"];

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
  },
  render(h) {
    const vnode = this.hydrated
      ? h("div", { staticStyle: "display: contents" }, this.$slots.default)
      : h("div");

    if (isBrowser) {
      vnode.asyncFactory = this.hydrated ? { resolved: true } : {};
      vnode.isAsyncPlaceholder = !this.hydrated;
    }

    return vnode;
  },
  watch: {
    force: {
      handler(value) {
        if (value) this.hydrate();
      },
      immediate: true
    }
  }
};
</script>
