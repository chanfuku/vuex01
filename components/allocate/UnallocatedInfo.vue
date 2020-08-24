<template>
  <div>
    <modal v-if="modal.show">
      <h3 slot="header">
        <span class="subject">未割付</span>
        <span class="content">
          <span>0000123 {{ cellData().companyName }}</span>
          <i
            class="fas fa-times-circle"
            @click="$emit('toggle-modal', modalName)"
          ></i>
        </span>
      </h3>
      <div slot="body">
        <div class="content_box sub_content">
          <div class="content_inner_box_body">
            <p class="ordinal">01</p>
            <div class="inner_body">
              <span class="inner_title_header">開始情報</span>
              <span class="inner_title_header">終了情報</span>
            </div>
            <div class="inner_body">
              <span class="inner_content">
                <span class="inner_title w_20">開始日</span>
                <span class="inner_name w_60">{{
                  getYearString(cellData().startTime)
                }}</span>
              </span>
              <span class="inner_content">
                <span class="inner_title w_20">終了日</span>
                <span class="inner_name w_60">{{
                  getYearString(cellData().endTime)
                }}</span>
              </span>
            </div>
            <div class="inner_body">
              <span class="inner_content">
                <span class="inner_title w_20">名称</span>
                <span class="inner_name w_60">{{ cellData().departure }}</span>
              </span>
              <span class="inner_content">
                <span class="inner_title w_20">名称</span>
                <span class="inner_name w_60">{{
                  cellData().destination
                }}</span>
              </span>
            </div>
            <div class="inner_body">
              <span class="inner_content">
                <span class="inner_title w_20">住所</span>
                <span class="inner_name w_60">{{
                  cellData().departureCity
                }}</span>
              </span>
              <span class="inner_content">
                <span class="inner_title w_20">住所</span>
                <span class="inner_name w_60">{{
                  cellData().destinationCity
                }}</span>
              </span>
            </div>
            <div class="inner_body">
              <span class="inner_title_header full">荷物情報</span>
            </div>
            <div class="inner_body">
              <span class="inner_content">
                <span class="inner_title w_20">品名</span>
                <span class="inner_name w_60">ホゲホゲ</span>
              </span>
              <span class="inner_content">
                <span class="inner_title w_20">数量</span>
                <span class="inner_name w_60">12</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <h3 slot="footer">
      </h3>
    </modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Util from './Util.vue'
const { mapState, mapGetters } = createNamespacedHelpers('allocate')
const modalName = 'unallocated'

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
      modalName,
      carNumber: null,
      companyId: null
    }
  },
  computed: {
    ...mapState(['vehicleList']),
    ...mapGetters(['allTruckHash', 'getVehiclesByCompanyId'])
  },
  methods: {
    cellData() {
      return this.modal.data
    },
    onAllocate() {
      const scheduleObj = document.getElementById('Schedule').ej2_instances[0]
      const eventData = {
        Id: scheduleObj.getEventMaxID(),
        eventType: 'allocated',
        startTime: this.modal.data.startTime,
        endTime: this.modal.data.endTime,
        vehicleId: this.modal.vehicle.Id,
        vehicleName: this.modal.vehicle.Text
      }
      // TODO: api通信
      this.$emit('add-event', eventData)
      this.$emit('toggle-modal', this.modalName)
    }
    // closeModal() {
    //   this.toggleModal(modalName)
    // }
  }
}
</script>

<style lang="scss"></style>
