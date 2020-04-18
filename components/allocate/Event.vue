<template>
  <div
    class="template-wrap"
    :class="[
      geteventTypeClass(),
      { just_allocated: data.justAllocated },
      { direction_selected: data.selected },
      { event_unselectable: data.selectable === false }
    ]"
  >
    <div class="subject">
      {{ getSubject() }}
      <!-- デモ用に印刷済アイコンを設置-->
      <span
        v-if="data.eventType === 'allocated' && data.Id === 10"
        class="printed"
      ></span>
      <span v-else-if="data.eventType === 'allocated'" class="print"></span>
      <span
        v-else-if="data.eventType === 'memo'"
        class="remove"
        @click="removeMemo(data.Id, $event)"
      ></span>
    </div>
    <div v-if="data.eventType === 'allocated'" class="body">
      <div v-if="data.eventType === 'allocated'" class="content">
        <p>{{ getTimeString(data.endTime) }}</p>
        <p class="address">{{ getDestination() }}</p>
      </div>
    </div>
    <div v-else class="body">
      <div class="content">
        <p>{{ getTimeString(data.startTime) }}</p>
        <p class="address">{{ getDeparture() }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { Internationalization } from '@syncfusion/ej2-base'

const instance = new Internationalization()

export default {
  data() {
    return {
      data: {}
    }
  },
  computed: {},
  mounted() {
    // if (this.data.eventType !== 'allocated') {
    //   console.log('mounted', this.data)
    // }
  },
  methods: {
    removeMemo(id, event) {
      event.requestType = 'eventRemove'
    },
    getData() {
      // console.log('getData', this.data)
      // return this.data
    },
    getTimeString(value) {
      return instance.formatDate(new Date(value), { skeleton: 'Hm' })
    },
    geteventTypeClass() {
      // TODO: ちゃんと変換
      return this.data.eventType
    },
    getSubject() {
      let ret = ''
      switch (this.data.eventType) {
        case 'allocated':
          ret = this.data.companyName
          break
        case 'cargo':
          ret = 'テスト'
          break
        case 'vehicle':
          ret = 'テスト'
          break
        case 'memo':
          ret = 'メモ'
          break
        default:
          ret = ''
      }
      return ret
    },
    getDeparture() {
      let ret = ''
      // TODO: ちゃんと変換
      switch (this.data.eventType) {
        case 'allocated':
          ret = this.data.departureCity
          break
        case 'cargo':
          ret = 'hoge'
          break
        case 'vehicle':
          ret = 'fuga'
          break
        case 'memo':
          ret = this.data.memoBody
          break
        default:
          ret = ''
      }
      return ret
    },
    getDestination() {
      let ret = ''
      // TODO: ちゃんと変換
      switch (this.data.eventType) {
        case 'allocated':
          ret = this.data.destinationCity
          break
        default:
          ret = ''
      }
      return ret
    }
  }
}
</script>
