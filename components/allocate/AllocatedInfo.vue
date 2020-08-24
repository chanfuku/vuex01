<template>
  <div>
    <modal v-if="modal.show">
      <h3 slot="header">
        <span class="subject"
          >{{ getDateString(cellData().startTime) }} 割付済</span
        >
        <span class="content">
          <span>0000123 {{ cellData().companyName }}</span>
          <i
            class="fas fa-times-circle"
            @click="$emit('toggle-modal', modalName)"
          ></i>
        </span>
      </h3>
      <div slot="body">
        <div class="content_box">
          <div class="inner_body">
            <span class="inner_content">
              <span class="inner_title w_30">会社</span>
              <span class="inner_name w_30">{{ vehicle().TruckName }}</span>
            </span>
          </div>
          <div class="inner_footer">
            <button class="btn btnProceed">編集</button>
          </div>
        </div>
        <div class="content_box sub_content">
          <div class="content_inner_box_body">
            <p class="ordinal">01</p>
            <div class="inner_body">
              <span class="inner_title_header">開始情報</span>
              <span class="inner_title_header">終了情報</span>
            </div>
            <div class="inner_body">
              <span class="inner_content">
                <span class="inner_title w_20">積込日</span>
                <span class="inner_name w_60">{{
                  getYearString(cellData().startTime)
                }}</span>
              </span>
              <span class="inner_content">
                <span class="inner_title w_20">納品日</span>
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
                <span class="inner_name w_60">ソーラーパネル</span>
              </span>
              <span class="inner_content">
                <span class="inner_title w_20">数量</span>
                <span class="inner_name w_60">12</span>
              </span>
            </div>
            <div class="inner_body">
              <span class="inner_content">
                <span class="inner_title">特記事項</span>
                <span class="inner_name"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <h3 slot="footer">
        <button type="button" class="btn btnProceed">運行編集</button>
        <button type="button" class="btn btnCancel" @click="onCancelAllocated">
          割付取消
        </button>
        <button type="button" class="btn btnProceed">
          指示書を出力
        </button>
      </h3>
    </modal>
  </div>
</template>

<script>
import Util from './Util.vue'
const modalName = 'allocated'

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
  methods: {
    cellData() {
      return this.modal.data
    },
    vehicle() {
      return this.modal.vehicle
    },
    onCancelAllocated() {
      this.$emit('delete-event', this.modal.id)
      this.$emit('toggle-modal', this.modalName)
      // 未割付一覧に追加する
      const treeObj = document.getElementById('Tree').ej2_instances[0]
      const treeviewData = treeObj.fields.dataSource
      treeviewData.push(this.modal.data)
      // 積込日昇順にソートする
      const newData = treeviewData
        .map((data) => data)
        .sort((a, b) =>
          new Date(a.startTime).getTime() > new Date(b.startTime).getTime()
            ? 1
            : -1
        )
      treeObj.fields.dataSource = newData
    },
    getCarNumber() {
      if (this.vehicle().CarNumber === 1234) {
        return 1234
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss"></style>
