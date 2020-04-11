<template>
  <div>
    <modal v-if="modal.show">
      <h3 slot="header">
        メモ<i class="fas fa-times-circle" @click="closeModal()"></i>
      </h3>
      <div slot="body">
        <div class="inner_body">
          <span class="header_title">車番</span>
          <select v-model="carNumber">
            <option
              v-for="vehicle in activeVehicles"
              :key="vehicle.Id"
              :value="vehicle.CarNumber"
              >{{ vehicle.CarNumber }}</option
            >
          </select>
        </div>
        <!--
      <div class="inner_body">
        <span class="header_title">日付</span>
        <span>{{getTimeString(modal.data.startTime)}} ~ {{getTimeString(modal.data.endTime)}}</span>
      </div>
      -->
        <div class="inner_body">
          <div class="inner_date">
            <span class="header_title">日時</span>
            <date-picker v-model="startDate" />
            <select v-model="startHour">
              <option v-for="hour in get24h()" :key="hour" :value="hour">{{
                hour
              }}</option>
            </select>
            時
            <select v-model="startMinute">
              <option
                v-for="minute in get60m()"
                :key="minute"
                :value="minute"
                >{{ minute }}</option
              >
            </select>
            分 ~
            <date-picker v-model="endDate" />
            <select v-model="endHour">
              <option v-for="hour in get24h()" :key="hour" :value="hour">{{
                hour
              }}</option>
            </select>
            時
            <select v-model="endMinute">
              <option
                v-for="minute in get60m()"
                :key="minute"
                :value="minute"
                >{{ minute }}</option
              >
            </select>
            分
          </div>
        </div>
        <div class="inner_body">
          <span class="header_title">タイトル</span>
          <input v-model="title" class="memo_title" type="text" name="title" />
        </div>
        <div class="inner_body">
          <span class="header_title">メモ内容</span>
          <textarea
            v-model="body"
            placeholder="メモの内容を入力してください"
            name="body"
          ></textarea>
        </div>
      </div>
      <h3 slot="footer">
        <button
          v-if="modal.id !== null"
          class="btn btnCancel"
          @click="remove()"
        >
          削除
        </button>
        <button
          v-if="modal.id === null"
          class="btn btnProceed"
          @click="create()"
        >
          保存
        </button>
        <button v-else class="btn btnProceed" @click="save()">保存</button>
      </h3>
    </modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import Util from './Util.vue'
const { mapGetters } = createNamespacedHelpers('allocate')
const modalName = 'memo'

Vue.component('date-picker', DatePicker)

export default {
  name: modalName,
  mixins: [Util],
  props: {
    modal: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      modalName
    }
  },
  computed: {
    ...mapGetters(['activeVehicles']),
    carNumber: {
      get() {
        return this.modal.vehicle.CarNumber
      },
      set(value) {
        const vehicle = this.activeVehicles.filter(
          (vehicle) => vehicle.CarNumber === value
        )
        const modalData = this.modal.data
        modalData.vehicleId = vehicle[0].Id
        this.updateModal(modalData)
      }
    },
    startMinute: {
      get() {
        return this.startDate.getMinutes()
      },
      set(value) {
        const newDate = new Date(this.startDate)
        newDate.setMinutes(value)
        const modalData = this.modal.data
        modalData.startTime = newDate
        this.updateModal(modalData)
      }
    },
    startHour: {
      get() {
        return this.startDate.getHours()
      },
      set(value) {
        const newDate = new Date(this.startDate)
        newDate.setHours(value)
        const modalData = this.modal.data
        modalData.startTime = newDate
        this.updateModal(modalData)
      }
    },
    startDate: {
      get() {
        return new Date(this.modal.data.startTime)
      },
      set(value) {
        const newDate = new Date(value)
        newDate.setHours(this.startHour)
        newDate.setMinutes(this.startMinute)
        const modalData = this.modal.data
        modalData.startTime = newDate
        this.updateModal(modalData)
      }
    },
    endMinute: {
      get() {
        return this.endDate.getMinutes()
      },
      set(value) {
        const newDate = new Date(this.endDate)
        newDate.setMinutes(value)
        const modalData = this.modal.data
        modalData.endTime = newDate
        this.updateModal(modalData)
      }
    },
    endHour: {
      get() {
        return this.endDate.getHours()
      },
      set(value) {
        const newDate = new Date(this.endDate)
        newDate.setHours(value)
        const modalData = this.modal.data
        modalData.endTime = newDate
        this.updateModal(modalData)
      }
    },
    endDate: {
      get() {
        return new Date(this.modal.data.endTime)
      },
      set(value) {
        const newDate = new Date(value)
        newDate.setHours(this.endHour)
        newDate.setMinutes(this.endMinute)
        const modalData = this.modal.data
        modalData.endTime = newDate
        this.updateModal(modalData)
      }
    },
    title: {
      get() {
        return this.modal.data.memoTitle
      },
      set(value) {
        const modalData = this.modal.data
        modalData.memoTitle = value
        this.updateModal(modalData)
      }
    },
    body: {
      get() {
        return this.modal.data.memoBody
      },
      set(value) {
        const modalData = this.modal.data
        modalData.memoBody = value
        this.updateModal(modalData)
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('init-modal', this.modalName)
      this.$emit('toggle-modal', this.modalName)
    },
    create() {
      const scheduleObj = document.getElementById('Schedule').ej2_instances[0]
      const eventData = {
        Id: scheduleObj.getEventMaxID(),
        eventType: 'memo',
        startTime: this.modal.data.startTime,
        endTime: this.modal.data.endTime,
        vehicleId: this.modal.vehicle.Id,
        vehicleName: this.modal.vehicle.Text,
        memoTitle: this.title,
        memoBody: this.body
      }
      // TODO: api通信
      this.$emit('add-event', eventData)
      this.closeModal()
    },
    save() {
      console.log(this.modal)
      const eventData = {
        Id: this.modal.id,
        eventType: 'memo',
        startTime: this.modal.data.startTime,
        endTime: this.modal.data.endTime,
        vehicleId: this.modal.vehicle.Id,
        vehicleName: this.modal.vehicle.Text,
        memoTitle: this.title,
        memoBody: this.body
      }
      // TODO: api通信
      this.$emit('save-event', eventData)
      this.closeModal()
    },
    remove() {
      this.$emit('delete-event', this.modal.id)
      this.closeModal()
    },
    updateModal(cellData) {
      const obj = {
        name: modalName,
        cellData
      }
      this.$emit('set-modal', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.memo_title {
  width: 80% !important;
}
</style>
