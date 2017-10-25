<template>
  <div id="app">
    <layout></layout>
  </div>
</template>

<script>
import layout from './components/layout';

export default {
  name: 'app',
  components: {
    layout
  }
}
</script>

<style lang="stylus">
@import './common/css/index.styl'
</style>
