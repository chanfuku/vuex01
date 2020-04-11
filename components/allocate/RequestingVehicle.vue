<template>
  <div>
    <modal v-if="modal.show">
      <h3 slot="header">
        <span class="subject">求車応募情報</span>
        <span class="content">
          <span>00000223 成約</span>
          <i
            class="fas fa-times-circle"
            @click="$emit('toggle-modal', modalName)"
          ></i>
        </span>
      </h3>
      <div slot="body">
        <div class="content_box">
          <h4>車種条件</h4>
          <div class="inner_body">
            <span class="inner_box">
              <span class="inner_title">車格</span>
              <span class="inner_name">10t</span>
            </span>
            <span class="inner_box">
              <span class="inner_title">車種</span>
              <span class="inner_name">平ボディ</span>
            </span>
            <span class="inner_box">
              <span class="inner_title">希望金額</span>
              <span class="inner_name">50,000円</span>
            </span>
          </div>
          <hr />
          <h4>登録者情報</h4>
          <div class="inner_body">
            <span class="inner_name">株式会社自由</span>
          </div>
          <hr />
          <h4>掲載期限</h4>
          <div class="inner_body">
            <span class="inner_name">{{
              getYearString(cellData().startTime)
            }}</span>
            <span class="inner_title">公開先</span>
            <span class="inner_name">複数</span>
          </div>
        </div>
        <div class="content_box sub_content">
          <div class="content_inner_box_body">
            <p class="ordinal">01</p>
            <div class="inner_body">
              <span class="inner_title_header">積池情報</span>
              <span class="inner_title_header">卸地情報</span>
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
                <span class="inner_name w_70">{{
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
                <span class="inner_name w_60">住宅建材</span>
              </span>
              <span class="inner_content">
                <span class="inner_title w_20">数量</span>
                <span class="inner_name w_60">3ユニット</span>
              </span>
            </div>
            <div class="inner_body">
              <span class="inner_content">
                <span class="inner_title w_20">LWH</span>
                <span class="inner_name w_60">2000 x 500 x 1000mm</span>
              </span>
              <span class="inner_content">
                <span class="inner_title w_20">重量</span>
                <span class="inner_name w_60">2000kg</span>
              </span>
            </div>
            <div class="inner_body">
              <span class="inner_content">
                <span class="inner_title">依頼元管理No.</span>
                <span class="inner_name">1122334455</span>
              </span>
            </div>
            <div class="inner_body">
              <span class="inner_content">
                <span class="inner_title">特記事項</span>
                <span class="inner_name">クランプフォークでの荷扱必要</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <h3 slot="footer">
        <button class="btn btnProceed">詳細</button>
      </h3>
    </modal>
  </div>
</template>

<script>
import Util from './Util.vue'
const modalName = 'vehicle'

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
    }
  }
}
</script>

<style lang="scss"></style>
