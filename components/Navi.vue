<template>
  <nav>
    <ul class="gnav">
      <li :class="{current: getRoutePath() === '/'}">
        <a href="/"> <i class="fas fa-home"></i> <span>ホーム</span> </a>
      </li>
      <li :class="{current: getRoutePath() === '/allocate/allocate'}">
        <nuxt-link to="/allocate/allocate">
          <i class="far fa-calendar-alt"></i><span>スケジューラー</span>
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      data: {
        }
    }
  },
  methods: {
      getRoutePath() {
        return this.$route.path
      }
    }
}
</script>

<style lang="scss">
/*
@import '~/assets/styles/nav.scss';
*/
</style>
