<template>
  <!-- <transition name="fade"> -->
  <div v-if="instructionMode" id="instruction_mode">
    <p class="operation_direction_title">案件選択</p>
    <ul>
      <li v-for="(item, index) in instructionList" :key="item.Id">
        <div class="instruction_content_area">
          <div class="content_title">
            <i
              class="fas fa-times-circle"
              @click="onRemove(index, item.Id)"
            ></i>
            <span class="companyname">{{ item.companyName }}</span>
            <span v-if="item.additionalAmount" class="additional_count"
              >+{{ item.additionalAmount }}</span
            >
          </div>
          <div class="content_detail">
            <div class="content_inner">
              <p class="name1">{{ item.departureCity }}</p>
              <p class="name2">{{ item.departure }}</p>
              <p class="name3">{{ getTimeString(item.startTime) }}</p>
            </div>
            <div class="arrow">
              <i class="fas fa-caret-right"></i>
            </div>
            <div class="content_inner">
              <p class="name1">{{ item.destinationCity }}</p>
              <p class="name2">{{ item.destination }}</p>
              <p class="name3">{{ getTimeString(item.endTime) }}</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="instructionList.length > 0" class="dir_confirm">
      <button class="btn btnProceed" @click="onConfirmInstruction">
        確定
      </button>
    </div>
  </div>
  <!-- </transition> -->
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Util from './Util.vue'
const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
  'allocate'
)

export default {
  mixins: [Util],
  data() {
    return {}
  },
  computed: {
    ...mapState(['instructionMode', 'instructionList'])
  },
  mounted() {
    this.removeAllInstruction()
  },
  methods: {
    ...mapActions(['setLoadplaceList']),
    ...mapMutations(['removeInstruction', 'removeAllInstruction']),
    onRemove(index, id) {
      console.log(id)
      const scheduleObj = this.$parent.$refs.ScheduleObj
      const events = scheduleObj.ej2Instances.getEvents()
      for (let i = 0; i < events.length; i++) {
        if (events[i].Id === id) {
          events[i].selected = false
          this.$emit('save-event', events[i])
          break
        }
      }
      this.removeInstruction(index)
    },
    onConfirmInstruction() {
      this.setLoadplaceList()
      this.$emit('toggle-modal', 'instruction')
    }
  }
}
</script>
