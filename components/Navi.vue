<template>
  <nav>
    <ul class="gnav">
      <li>
        <a href="/"> <i class="fas fa-home"></i> <span>ホーム</span> </a>
      </li>
      <li class="current">
        <nuxt-link to="/allocate/allocate">
          <i class="far fa-calendar-alt"></i><span>スケジューラー</span>
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
@import '~/assets/styles/nav.scss';
</style>
