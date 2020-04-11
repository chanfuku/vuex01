<template>
  <div v-if="!instructionMode" id="allocate_select_area">
    <transition name="fade">
      <div v-show="isSelectAreaOpen" class="vehicle_select_area">
        <div class="vehicle_search_content">
          <span class="search_title">カテゴリ</span>
          <requesters v-model="selectedItems" />
        </div>
        <div class="inputSlideBlock">
          <dl class="inputItem">
            <dt>開始日</dt>
            <dd class="inputDate">
              <date-picker
                v-model="departureDateFrom"
                :popover="{ placement: 'bottom', visibility: 'click' }"
              />
              <span>〜</span>
              <date-picker
                v-model="departureDateTo"
                :popover="{ placement: 'bottom', visibility: 'click' }"
              />
            </dd>
          </dl>
          <dl class="inputItem">
            <dt>終了日</dt>
            <dd class="inputDate">
              <date-picker
                v-model="destinationDateFrom"
                :popover="{ placement: 'bottom', visibility: 'click' }"
              />
              <span>〜</span>
              <date-picker
                v-model="destinationDateTo"
                :popover="{ placement: 'bottom', visibility: 'click' }"
              />
            </dd>
          </dl>
          <button type="button" class="btn btnPrimary" @click="onSearch">
            検索(未実装）
          </button>
        </div>
        <div class="unallocated_list">
          <div id="carouselwrap">
            <ejs-treeview
              id="Tree"
              css-class="treeview-external-drag"
              :node-template="treeTemplate"
              :fields="treeViewFields"
              :node-dragging="onItemDrag"
              :allow-drag-and-drop="true"
              :node-drag-stop="onTreeDragStop"
              :node-selected="onTreeSelected"
              :data-bound="onDataBound"
            ></ejs-treeview>
            <div id="prev" class="icon hide">
              <i class="fas fa-chevron-circle-left"></i>
            </div>
            <div id="next" class="icon show">
              <i class="fas fa-chevron-circle-right"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="inputSlideBlock">
      <button
        type="button"
        class="btnLeftBottom"
        :class="[isSelectAreaOpen ? 'btnCloseTxt' : 'btnOpenTxt']"
        @click="$emit('on-toggle-select-area')"
      >
        未割付一覧を{{ isSelectAreaOpen ? '閉じる' : '開く' }}
      </button>
      <button type="button" class="btn btnPrimary btnRightBottom">
        新規作成
      </button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { closest, addClass } from '@syncfusion/ej2-base'
import { TreeViewPlugin } from '@syncfusion/ej2-vue-navigations'
import { createNamespacedHelpers } from 'vuex'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import Unallocated from './Unallocated.vue'
import Requesters from './Requesters.vue'
import { initCarousel } from './jquery/index.js'
const { mapState, mapMutations } = createNamespacedHelpers('allocate')

Vue.component('date-picker', DatePicker)
Vue.use(TreeViewPlugin)

export default {
  components: { Requesters },
  props: {
    isSelectAreaOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    const dataSource = require('./data/unallocated.json')
    // let ajax = new Ajax('https://private-58fcb-freight2.apiary-mock.com/unallocated', 'GET', false);
    // let ajax = new Ajax('./data/unallocated.json', 'GET', false);
    // ajax.onSuccess = function (value) {
    //   dataSource = JSON.parse(value);
    // };
    // ajax.send();

    return {
      departureDateFrom: new Date(),
      departureDateTo: new Date(),
      destinationDateFrom: new Date(),
      destinationDateTo: new Date(),
      treeViewFields: { dataSource, id: 'Id' },
      treeTemplate(e) {
        return { template: Unallocated }
      },
      selectedItems: []
    }
  },
  computed: {
    ...mapState(['instructionMode', 'selectedDate'])
  },
  created() {},
  mounted() {
    // initCarousel()
  },
  methods: {
    ...mapMutations(['setSelectedDate']),
    onSearch() {
      console.log(this.selectedItems)
    },
    onDataBound(event) {
      initCarousel()
    },
    onTreeSelected(event) {
      console.log(event)
      const modalName = 'unallocated'
      const treeObj = document.getElementById('Tree').ej2_instances[0]
      const treeviewData = treeObj.fields.dataSource
      const unallocateds = treeviewData.filter(
        (unallocated) =>
          parseInt(unallocated.Id) === parseInt(event.nodeData.id)
      )
      if (unallocateds.length === 0) {
        return
      }

      const obj = {
        name: modalName,
        cellData: unallocateds[0]
      }
      this.$emit('set-modal', obj)
      this.$emit('toggle-modal', modalName)

      // カレンダーの表示日時を変更
      this.setSelectedDate(new Date(unallocateds[0].startTime))

      // 以下の処理がないと同一未割付を２回連続選択しても２回目はモーダルが表示されない
      event.node.classList.remove('e-active')
    },
    onItemDrag(event) {
      const scheduleObj = this.$parent.$refs.ScheduleObj.ej2Instances
      console.log('onItemDrag', event)
      if (scheduleObj.isAdaptive) {
        const classElement = document.querySelector('.e-device-hover')
        if (classElement) {
          classElement.classList.remove('e-device-hover')
        }
        if (event.target.classList.contains('e-work-cells')) {
          addClass([event.target], 'e-device-hover')
        }
      }
      if (document.body.style.cursor === 'not-allowed') {
        document.body.style.cursor = ''
      }
      if (event.name === 'nodeDragging') {
        const dragElementIcon = document.querySelectorAll(
          '.e-drag-item .e-icon-expandable'
        )
        console.log('onItemDrag:dragElementIcon', dragElementIcon)
        for (let i = 0; i < dragElementIcon.length; i++) {
          dragElementIcon[i].style.display = 'none'
        }
      }
    },
    onTreeDragStop(event) {
      event.cancel = true
      console.log('onTreeDragStop', event)
      const treeElement = closest(event.target, '.e-treeview')
      // ドロップされた場所が未割付案件一覧以外の場合
      if (!treeElement) {
        const scheduleElement = closest(event.target, '.e-content-wrap')
        // ドロップされた場所がスケジューラ内の場合
        if (scheduleElement) {
          const treeObj = document.getElementById('Tree').ej2_instances[0]
          const treeviewData = treeObj.fields.dataSource
          if (event.target.classList.contains('e-work-cells')) {
            const filteredData = treeviewData.filter(function(item) {
              return item.Id === parseInt(event.draggedNodeData.id, 10)
            })
            const scheduleObj = document.getElementById('Schedule')
              .ej2_instances[0]
            const cellData = scheduleObj.getCellDetails(event.target)
            const resourceDetails = scheduleObj.getResourcesByIndex(
              cellData.groupIndex
            )
            const eventData = buildEventData(filteredData[0], resourceDetails)
            this.$emit('add-event', eventData)
            const unallocated = treeviewData.filter(function(item) {
              return item.Id !== parseInt(event.draggedNodeData.id, 10)
            })
            treeObj.fields.dataSource = unallocated
            initCarousel()
          }
        }
      }
    }
  }
}

function buildEventData(unallocatedData, resourceDetails) {
  const scheduleObj = document.getElementById('Schedule').ej2_instances[0]
  unallocatedData.Id = scheduleObj.getEventMaxID()
  unallocatedData.startTime = new Date(unallocatedData.startTime)
  unallocatedData.endTime = new Date(unallocatedData.endTime)
  unallocatedData.vehicleId = resourceDetails.resourceData.Id
  unallocatedData.vehicleName = resourceDetails.resourceData.Text
  unallocatedData.isSameVehicle = true
  unallocatedData.justAllocated = true

  return unallocatedData
}
</script>

<style lang="scss">
@import '~/assets/styles/vars.scss';
#carouselwrap {
  position: relative;
  width: 100%;
  height: 100px;
  margin-bottom: 15px;
  #Tree {
    position: relative;
    width: 100%;
    height: 100%;
  }
  ul {
    display: table;
    list-style-type: none;
    overflow: hidden;
    li {
      display: table-cell;
      width: $allocateCardWidth;
      height: 100%;
      display: inline-block;
    }
  }
  .icon {
    position: absolute;
    color: rgba(54, 79, 101, 0.5);
    font-size: 2rem;
    top: 20%;
    z-index: 5;
    height: 100%;
    &.hide {
      // display: none;
    }
    &.show {
      cursor: pointer;
      // display: block;
    }
  }
  #prev {
    left: -40px;
  }
  #next {
    right: -40px;
  }
  .e-treeview .e-fullrow {
    // width:200px !important;
    width: $allocateCardWidth !important;
  }

  // $gap: 3px;
  // @for $i from 2 through 10 {
  //   #Tree > ul > li:nth-child($i) > div.e-fullrow {
  //     left: ($allocateCardWidth * ($i - 1)) + $gap !important;
  //   }
  // }

  // $gap: 3px;
  // #Tree > ul > li:nth-child(2) > div.e-fullrow{
  //   left: $allocateCardWidth + $gap !important;
  // }
  // #Tree > ul > li:nth-child(3) > div.e-fullrow{
  //   left: $allocateCardWidth * 2 + $gap !important;
  // }
  // #Tree > ul > li:nth-child(4) > div.e-fullrow{
  //   left: $allocateCardWidth * 3 + $gap !important;
  // }
  // #Tree > ul > li:nth-child(5) > div.e-fullrow{
  //   left: $allocateCardWidth * 4 + $gap !important;
  // }
  // #Tree > ul > li:nth-child(6) > div.e-fullrow{
  //   left: $allocateCardWidth * 5 + $gap !important;
  // }
  // #Tree > ul > li:nth-child(7) > div.e-fullrow{
  //   left: $allocateCardWidth * 7 + $gap !important;
  // }
}
</style>
