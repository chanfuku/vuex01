<template>
  <div v-show="data.resourceData.Show" class="vehicle_content">
    <p class="carnumber">{{ data.resourceData.CarNumber }}</p>
    <p class="tracktype"></p>
    <div class="detail">
      <span class="name">{{ data.resourceData.Text }}</span>
      <span class="trackname"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {}
    }
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>
