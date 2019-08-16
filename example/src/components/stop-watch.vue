<script>
export default {
  props: {
    autoStart: Boolean,
    description: String
  },

  data() {
    return {
      start: null,
      now: null
    };
  },

  mounted() {
    if (this.autoStart) {
      this.startWatch();
    }
  },

  computed: {
    isActive() {
      return this.start !== null;
    },

    timeElapsed() {
      const { start, now } = this;

      if (start === null || now === null) return 0;

      return Number((now - start) / 1000).toFixed(2);
    }
  },

  methods: {
    startWatch() {
      this.stopWatch();

      this.start = this.now = Date.now();

      this.intervalId = setInterval(() => {
        this.now = Date.now();
      }, 1000/30);
    },

    /** Start stop watch. */
    stopWatch() {
      clearInterval(this.intervalId);

      this.start = this.now = null;
    }
  }
};
</script>

<template>
  <div :class="$style.stopWatch" aria-label="Timer">
    <div :class="$style.display" aria-live="off" aria-atomic="true">{{ timeElapsed }}</div>

    <button :class="$style.button" @click="isActive ? stopWatch() : startWatch()">{{ isActive ? 'stop' : 'start' }}</button>

    <p v-if="description">{{ description }}</p>
  </div>
</template>

<style module>
.stopWatch {
  display: flex;
  flex-direction: column;
  text-align: center;
  max-width: 240px;
  margin: 16px auto;
  flex: 1;
}

.display {
  font-size: 64px;
  padding: 24px 16px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.button {
  background: white;
  border: 1px solid #000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  text-transform: uppercase;
  padding: 8px 24px;
}

.button:focus {
  outline: 1px dashed #333;
}
</style>