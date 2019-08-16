<script>
import StopWatch from "../../components/stop-watch.vue";
import { routes } from "../index";

export default {
  components: {
    StopWatch
  },
  data() {
    return {
      routes: Object.freeze(routes.filter(route => route.name !== 'Home'))
    };
  }
};
</script>

<template>
  <main :class="$style.container">
    <h1>Lazy Hydration</h1>

    <p>
      Here are some demos showing lazy hydration of server rendered Vue applications. We use a
      <code>StopWatch</code> component to show the effect.
    </p>

    <StopWatch />

    <h2>Examples:</h2>

    <ul>
      <li v-for="route in routes" :key="route.path">
        <a :class="$style.link" :href="route.path" target="_blank">{{ route.name }}</a>
      </li>
    </ul>

    <hr :class="$style.separator" />

    
  </main>
</template>

<style module>
.container {
  width: 600px;
  margin: 24px auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.link {
  color: #000;
}

.separator {
  margin: 24px;
}
</style>