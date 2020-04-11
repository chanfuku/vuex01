<template>
  <div>
    <modal v-if="modal.show">
      <h3 slot="header">
        <span class="subject">求貨登録情報</span>
        <span class="content">
          <span>00000123 応募あり 7件</span>
          <i
            class="fas fa-times-circle"
            @click="$emit('toggle-modal', modalName)"
          ></i>
        </span>
      </h3>
      <div slot="body">
        <div class="content_box">
          <h4>運行</h4>
          <div class="inner_body">
            <span class="inner_content">
              <span class="inner_title w_30">空車日</span>
              <span class="inner_name w_60">{{
                getYearString(cellData().startTime)
              }}</span>
            </span>
            <span class="inner_content">
              <span class="inner_title w_30">行先日</span>
              <span class="inner_name w_60">{{
                getYearString(cellData().endTime)
              }}</span>
            </span>
          </div>
          <div class="inner_body">
            <span class="inner_content">
              <span class="inner_title w_30">空車県</span>
              <span class="inner_name w_60">茨城県</span>
            </span>
            <span class="inner_content">
              <span class="inner_title w_30">行先県</span>
              <span class="inner_name w_60">東京都</span>
            </span>
          </div>
          <div class="inner_body">
            <span class="inner_content">
              <span class="inner_title w_30">積込可能県</span>
              <span class="inner_name w_60">茨城県,群馬県</span>
            </span>
            <span class="inner_content">
              <span class="inner_title w_30">卸地可能県</span>
              <span class="inner_name w_60">東京都,神奈川県</span>
            </span>
          </div>
          <div class="inner_body">
            <span class="inner_content">
              <span class="inner_title w_30">車番</span>
              <span class="inner_name w_60">{{ vehicle().CarNumber }}</span>
            </span>
            <span class="inner_content">
              <span class="inner_title w_30">車格</span>
              <span class="inner_name w_60">平</span>
            </span>
          </div>
          <div class="inner_body">
            <span class="inner_content">
              <span class="inner_title w_30">車種</span>
              <span class="inner_name w_60">平ボディ</span>
            </span>
            <span class="inner_content">
              <span class="inner_title w_30">ドライバー</span>
              <span class="inner_name w_60">{{ vehicle().Text }}</span>
            </span>
          </div>
          <hr />
          <h4>登録者</h4>
          <div class="inner_body">
            <span class="inner_name">山田はじめ</span>
          </div>
          <hr />
          <h4>公開範囲</h4>
          <div class="inner_body">
            <span class="inner_name">株式会社xxxx,株式会社yyyy</span>
          </div>
          <hr />
          <h4>特記事項</h4>
          <div class="inner_body">
            特記事項のテキストがこちらに入ります。特記事項のテキストがこちらに入ります。
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
const modalName = 'cargo'

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
    // ...mapState({
    //   modal: state => state.modals[modalName]
    // })
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
