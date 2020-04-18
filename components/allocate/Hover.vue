<template>
  <div class="allocated_tooltip">
    <div v-if="data.eventType === 'cargo'" class="allocateHoverHeader">
      <p class="cargoFlag">求貨</p>
      <p class="cargoFlagStatus">応募あり</p>
    </div>
    <div v-if="data.eventType === 'vehicle'" class="allocateHoverHeader">
      <p class="vehicleFlag">求車</p>
      <p class="vehicleFlagStatus">成約</p>
    </div>
    <div v-if="data.eventType === 'memo'" class="allocateHoverHeader hoverMemo">
      <p class="memoFlag">メモ</p>
    </div>
    <div class="content_title">
      <span class="companyname"
        ><span
          v-if="data.eventType === 'allocated' || data.eventType === 'vehicle'"
          >{{ data.companyName }}</span
        ></span
      >
      <span v-if="data.additionalAmount" class="additional_count"
        >+{{ data.additionalAmount }}</span
      >
    </div>
    <div class="content_detail">
      <div class="content_inner">
        <p v-if="data.eventType !== 'memo'" class="name1">
          {{ data.departureCity }}
        </p>
        <p v-if="data.eventType !== 'memo'" class="name2">
          {{ data.departure }}
        </p>
        <p class="name3">{{ getTimeString(data.startTime) }}</p>
      </div>
      <i class="fas fa-caret-right" :class="[geteventTypeClass()]"></i>
      <div class="content_inner">
        <p v-if="data.eventType !== 'memo'" class="name1">
          {{ data.destinationCity }}
        </p>
        <p v-if="data.eventType !== 'memo'" class="name2">
          {{ data.destination }}
        </p>
        <p class="name3">{{ getTimeString(data.endTime) }}</p>
      </div>
    </div>
    <div v-if="data.eventType === 'memo'" class="allocarionBox">
      <dl class="allocarionList">
        <dt>タイトル</dt>
        <dd>{{ data.memoTitle }}</dd>
      </dl>
      <dl class="allocarionList">
        <dt>内容</dt>
        <dd>{{ data.memoBody }}</dd>
      </dl>
    </div>
    <div class="content_subdetail">
      <!-- <i class="fas fa-people-carry"></i> -->
      <p
        v-if="data.eventType === 'allocated' && data.fellowPassengerName"
        class="driverStatus"
      >
      </p>
      <div class="content_inner">
        <div class="content_inner1">
          <p
            class="driver"
            :class="[
              { warning: data.eventType === 'allocated' && !data.isSameVehicle }
            ]"
          >
            ドライバー
          </p>
          <p v-if="data.eventType === 'allocated' && data.fellowPassengerName">
            <span v-if="data.vehicleName === '松田ゆかり'">同乗者</span>
          </p>
        </div>
        <div class="content_inner2">
          <p>{{ data.vehicleName }}</p>
          <p v-if="data.eventType === 'allocated' && data.fellowPassengerName">
            <span v-if="data.vehicleName === '松田ゆかり'">{{
              data.fellowPassengerName
            }}</span>
          </p>
        </div>
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
  computed: {},
  mounted() {
    // console.log(this.data)
  },
  methods: {
    geteventTypeClass() {
      return this.data.eventType
    }
  }
}
</script>

<style lang="scss"></style>
