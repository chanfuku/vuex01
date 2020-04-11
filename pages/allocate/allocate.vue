<template>
  <div>
    <Header bread="タスク割当て" />
    <Schedule />
  </div>
</template>

<script>
import jQuery from 'jquery'
import Header from '~/components/Header.vue'
import Schedule from '~/components/allocate/Schedule.vue'
global.jquery = jQuery
global.$ = jQuery
window.$ = window.jQuery = require('jquery')

export default {
  name: 'Allocate',
  components: {
    Header,
    Schedule
  }
}
</script>

<style lang="scss"></style>
