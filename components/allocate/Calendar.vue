<template>
  <div id="date_range_select_area">
    <div class="date">
      <i class="fas fa-angle-double-left" @click="onLargePrev()"></i>
      <i class="fas fa-angle-left" @click="onSmallPrev()"></i>
      <date-picker
        v-model="date"
        :popover="{ placement: 'bottom', visibility: 'click' }"
        @popoverWillShow="onPopoverWillShow"
      >
        <i
          class="far fa-calendar-alt p-2 bg-blue-500 hover:bg-blue-600 text-white rounded focus:outline-none"
        ></i>
      </date-picker>
      <span class="text">{{
        viewMode === 'TimelineDay' ? getDateString(date) : getWeekString(date)
      }}</span>
      <i class="fas fa-angle-right" @click="onSmallNext()"></i>
      <i class="fas fa-angle-double-right" @click="onLargeNext()"></i>
    </div>
    <select v-model="viewMode">
      <option name="timeline" value="TimelineDay">日</option>
      <option name="timeline" value="TimelineWeek">週</option>
    </select>
  </div>
</template>

<script>
import Vue from 'vue'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import { createNamespacedHelpers } from 'vuex'
import Util from './Util.vue'
const { mapState, mapMutations } = createNamespacedHelpers('allocate')

Vue.component('date-picker', DatePicker)

export default {
  name: 'Calendar',
  mixins: [Util],
  data() {
    return {}
  },
  computed: {
    ...mapState(['selectedDate', 'currentView']),
    date: {
      get() {
        // if (this.currentView === 'TimelineWeek') {
        //   return this.getMondayObj(this.selectedDate)
        // }
        return this.selectedDate
      },
      set(value) {
        this.setSelectedDate(value)
      }
    },
    viewMode: {
      get() {
        return this.currentView
      },
      set(value) {
        this.setCurrentView(value)
      }
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(['setSelectedDate', 'setCurrentView']),
    onPopoverWillShow(event) {
      // 今日ボタンを設置
      const newEle = document.createElement('button')
      newEle.classList.add('btn_today', 'btn', 'btnCancel')
      const newContent = document.createTextNode('今日')
      newEle.appendChild(newContent)
      newEle.addEventListener(
        'click',
        () => this.setSelectedDate(new Date()),
        false
      )
      event.append(newEle)
    },
    frompage(event) {
      console.log('update:frompage', event)
    },
    onSmallPrev() {
      /*
      let num = this.currentView === 'TimelineDay' ? 1 : 7
      let unixTime = this.selectedDate.setDate(this.selectedDate.getDate() - num)
      */
      const unixTime = this.selectedDate.setDate(
        this.selectedDate.getDate() - 1
      )
      this.setSelectedDate(new Date(unixTime))
    },
    onLargePrev() {
      let unixTime
      if (this.currentView === 'TimelineDay') {
        unixTime = this.selectedDate.setDate(this.selectedDate.getDate() - 7)
      } else {
        // var unixTime = this.selectedDate.setMonth(this.selectedDate.getMonth() - 1)
        unixTime = this.selectedDate.setDate(this.selectedDate.getDate() - 7)
      }
      this.setSelectedDate(new Date(unixTime))
    },
    onSmallNext() {
      /*
      let num = this.currentView === 'TimelineDay' ? 1 : 7
      let unixTime = this.selectedDate.setDate(this.selectedDate.getDate() + num)
      */
      /*
      if (this.currentView === 'TimelineDay') {
        let hour = this.selectedDate.getHours() + 12
        let unixTime = this.selectedDate.setHours(hour)
        this.setSelectedDate(new Date(unixTime))
        let scheduleObj = document.getElementById('Schedule').ej2_instances[0]
        console.log(hour)
        scheduleObj.scrollTo(hour + ':00')
      } else {
        let unixTime = this.selectedDate.setDate(this.selectedDate.getDate() + 1)
        this.setSelectedDate(new Date(unixTime))
      }
      */

      const unixTime = this.selectedDate.setDate(
        this.selectedDate.getDate() + 1
      )
      this.setSelectedDate(new Date(unixTime))
    },
    onLargeNext() {
      let unixTime
      if (this.currentView === 'TimelineDay') {
        unixTime = this.selectedDate.setDate(this.selectedDate.getDate() + 7)
      } else {
        // var unixTime = this.selectedDate.setMonth(this.selectedDate.getMonth() + 1)
        unixTime = this.selectedDate.setDate(this.selectedDate.getDate() + 7)
      }
      this.setSelectedDate(new Date(unixTime))
    }
  }
}
</script>
