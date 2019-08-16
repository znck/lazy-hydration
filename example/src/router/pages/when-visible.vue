<script>
import StopWatch from "../../components/stop-watch.vue";
import Hydrate from "lazy-hydration";

export default {
  components: {
    StopWatch,
    Hydrate
  }
};
</script>

<template>
  <div>
    <div :class="$style.banner">
      <h1>When Visible</h1>

      <pre><code>{{`&lt;Hydrate when-visible&gt;...&lt;/Hydrate&gt;`}}</code></pre>

      <p>Scroll down to see in action.</p>
    </div>

    <div :class="$style.watches">
      <Hydrate when-visible>
        <StopWatch autoStart description="started on element visible" />
      </Hydrate>
      <StopWatch autoStart description="started on page mount" />
    </div>
  </div>
</template>

<style module>
.banner {
  height: 150vh;
  margin: 0 auto;
  width: 600px;
  padding: 24px;
}

.watches {
  display: flex;
  flex-direction: row;
}
</style>