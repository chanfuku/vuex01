<template>
  <nav>
    <ul class="gnav">
      <li>
        <a href="/"> <i class="icon_home"></i> <span>ホーム</span> </a>
      </li>
      <li class="current">
        <nuxt-link to="/allocate/allocate">
          <i class="icon_allocate"></i> <span>タスク割当て</span>
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
@import '~/assets/styles/nav.scss';
</style>
