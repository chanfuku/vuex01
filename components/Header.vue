<template>
  <header>
    <ul class="breadcrumbList">
      <li>
        <a href="#">{{ bread }}</a>
      </li>
    </ul>
    <div class="userInfo">
      <a href="#">
        <i class="fas fa-user-circle"></i>
        <span>佐藤一郎</span>
      </a>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  props: {
    bread: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss">
@import '~/node_modules/@syncfusion/ej2-base/styles/material.css';
@import '~/node_modules/@syncfusion/ej2-layouts/styles/material.css';

header {
  display: flex;
  align-items: center;
  margin: 0 0 30px 0;
}

/*//////////////////////////////////
パンくずリスト
//////////////////////////////////*/

.breadcrumbList li {
  font-size: 12px;
  display: inline-block;
}

.breadcrumbList a:hover {
  border-bottom: 1px solid #364f65;
}

/*//////////////////////////////////
ユーザー
//////////////////////////////////*/

.userInfo {
  margin: 0 0 0 auto;
}

.userInfo a {
  display: inline-block;
}

.userInfo img {
  width: 28px;
  height: 28px;
  margin: 0 4px 0 0;
  border-radius: 50%;
}
</style>
