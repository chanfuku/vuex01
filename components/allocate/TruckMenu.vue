<template>
  <div id="trackmenu" class="pulldown">
    <treeselect
      v-model="value"
      :multiple="true"
      :options="truckMenu"
      placeholder="全スタッフを表示"
      @input="input"
    />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
  'allocate'
)

export default {
  components: { Treeselect },
  data() {
    return {
      value: ['0']
    }
  },
  computed: {
    ...mapState(['truckMenu', 'vehicleList'])
  },
  mounted() {
    // console.log(this.value)
    this.setTruckMenu()
  },
  methods: {
    ...mapActions(['setTruckMenu']),
    ...mapMutations(['updateVehicles']),
    input(value, instanceId) {
      this.updateVehicles(value)
    }
  }
}
</script>

<style lang="scss">
@import '@riophae/vue-treeselect/dist/vue-treeselect.css';
</style>
