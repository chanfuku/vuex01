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
        <div class="content_box">
          <div class="inner_body" style="width: 120%">
            <span class="inner_content">
              <span class="inner_title w_30">車両情報</span>
              <div class="allocateInputField">
                <input
                  id="radiobox01"
                  type="radio"
                  class="radiobox"
                  name="01"
                  value=""
                  checked="checked"
                />
                <label for="radiobox01">登録済みから選択</label>
              </div>
              <div class="allocateInputField">
                <input
                  id="radiobox02"
                  type="radio"
                  class="radiobox"
                  name="01"
                  value=""
                />
                <label for="radiobox02">スポット手配</label>
              </div>
            </span>
          </div>
          <div class="inner_body">
            <span class="inner_content">
              <span class="inner_title w_30">会社</span>
              <span class="inner_name w_30">
                <select v-model="companyId">
                  <option
                    v-for="(truck, companyId) in allTruckHash"
                    :key="companyId"
                    :value="companyId"
                    >{{ truck.TruckName }}</option
                  >
                </select>
              </span>
            </span>
            <span class="inner_content">
              <span class="inner_title w_50">車番</span>
              <span class="inner_name w_40">
                <select v-model="carNumber">
                  <option
                    v-for="vehicle in getVehiclesByCompanyId(companyId)"
                    :key="vehicle.Id"
                    :value="vehicle.CarNumber"
                    >{{ vehicle.CarNumber }}</option
                  >
                </select>
              </span>
            </span>
          </div>
          <div class="inner_body">
            <span class="inner_content">
              <span class="inner_title w_30">排ガス規制</span>
              <div class="allocateInputField">
                <input
                  id="radiobox03"
                  type="radio"
                  class="radiobox"
                  name="02"
                  value=""
                  checked="checked"
                />
                <label for="radiobox03">なし</label>
              </div>
              <div class="allocateInputField">
                <input
                  id="radiobox04"
                  type="radio"
                  class="radiobox"
                  name="02"
                  value=""
                />
                <label for="radiobox04">あり</label>
              </div>
            </span>
            <span class="inner_content">
              <span class="inner_title w_50">ナンバープレート</span>
              <input type="text" class="inner_name w_40" />
            </span>
          </div>
          <div class="inner_body">
            <span class="inner_content">
              <span class="inner_title w_30">ドライバー</span>
              <select>
                <option selected></option>
                <option>松田ゆかり</option>
                <option>世田谷一郎</option>
              </select>
            </span>
            <span class="inner_content">
              <span class="inner_title w_50">ドライバー電話番号</span>
              <input type="text" class="inner_name w_40" />
            </span>
          </div>
          <div class="inner_body">
            <span class="inner_content">
              <span class="inner_title w_30">同乗者</span>
              <select>
                <option selected></option>
                <option>松田ゆかり</option>
                <option>世田谷一郎</option>
              </select>
            </span>
            <span class="inner_content">
              <span class="inner_title w_50">同乗者電話番号</span>
              <input type="text" class="inner_name w_40" />
            </span>
          </div>
        </div>
        <div class="content_box sub_content">
          <p class="inner_box_title">運行</p>
          <div class="content_inner_box_body flex">
            <div class="box_header_body">
              <span class="header_title">希望車格</span>
              <span class="header_value">{{ cellData().weight }}</span>
            </div>
            <div class="box_header_body">
              <span class="header_title">希望車種</span>
              <span class="header_value">平</span>
            </div>
            <div class="box_header_body">
              <span class="header_title">希望金額</span>
              <span class="header_value"></span>
            </div>
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
                <span class="inner_title w_20">LWH</span>
                <span class="inner_name w_60">1100 x 900 x 1200</span>
              </span>
              <span class="inner_content">
                <span class="inner_title w_20">重量</span>
                <span class="inner_name w_60">250kg</span>
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
        <button type="button" class="btn btnProceed" @click="onAllocate">
          割付
        </button>
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
