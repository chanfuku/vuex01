<template>
  <div class="unallocated_content_area">
    <div class="content_title">
      <span class="companyname">{{ data.companyName }}</span>
      <span class="additional">
        <span v-if="data.weight" class="weight">{{ data.weight }}</span>
        <span v-if="data.additionalAmount" class="additional_count"
          >+{{ data.additionalAmount }}</span
        >
      </span>
    </div>
    <div class="content_detail">
      <div class="content_inner">
        <p class="name1">{{ data.departureCity }}</p>
        <p class="name2">{{ data.departure }}</p>
        <p class="name3">{{ getTimeString(data.startTime) }}</p>
      </div>
      <div class="arrow">
        <i class="fas fa-caret-right"></i>
      </div>
      <div class="content_inner">
        <p class="name1">{{ data.destinationCity }}</p>
        <p class="name2">{{ data.destination }}</p>
        <p class="name3">{{ getTimeString(data.endTime) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Util from './Util.vue'

export default {
  mixins: [Util],
  data() {
    return {
      data: {}
    }
  },
  mounted() {
    // console.log(this.data);
  },
  methods: {}
}
</script>
