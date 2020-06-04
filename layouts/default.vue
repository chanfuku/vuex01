<template>
  <div id="main_container">
    <Navi />
    <article class="main">
      <nuxt />
    </article>
  </div>
</template>

<script>
import Vue from 'vue'
import Navi from '~/components/Navi.vue'
import Modal from '~/components/Modal'

Vue.component('modal', Modal)

export default {
  components: {
    Navi
  }
}
</script>

<style lang="scss">
/*
@import '~/assets/styles/common.scss';
@import '~/node_modules/@fortawesome/fontawesome-free/css/all.css';
*/
</style>
