<template>
  <div>
    <!-- modaldialog from here -->
    <allocated-info
      :modal="modals.allocated"
      @delete-event="deleteEvent"
      @toggle-modal="toggleModal"
    />
    <unallocated-info :modal="modals.unallocated" @toggle-modal="toggleModal" />
    <memo
      :modal="modals.memo"
      @set-modal="setModal"
      @init-modal="initModal"
      @add-event="addEvent"
      @save-event="saveEvent"
      @delete-event="deleteEvent"
      @toggle-modal="toggleModal"
    />
    <requesting-cargo :modal="modals.cargo" @toggle-modal="toggleModal" />
    <requesting-vehicle :modal="modals.vehicle" @toggle-modal="toggleModal" />
    <operation-instructions-confirm
      :modal="modals.instruction"
      @toggle-modal="toggleModal"
    />
    <!-- modaldialog to here -->
    <div class="control-section">
      <div class="content-wrapper">
        <div class="titleBox">
          <h1 class="title">スケジューラー</h1>
          <button
            type="button"
            class="btn btnPrimary btnRightBottom"
            @click="onToggleInstructionMode"
          >
            {{ instructionMode ? '未予約一覧' : '進行順の確定' }}
          </button>
        </div>

        <select-component
          :is-select-area-open="isSelectAreaOpen"
          @on-toggle-select-area="onToggleSelectArea"
          @add-event="addEvent"
          @toggle-modal="toggleModal"
          @set-modal="setModal"
        />
        <operation-instructions
          @toggle-modal="toggleModal"
          @save-event="saveEvent"
        />
        <calendar />

        <!-- scheduler from here -->
        <div class="schedule-container">
          <truck-menu />
          <ejs-schedule
            id="Schedule"
            ref="ScheduleObj"
            :selected-date="selectedDate"
            :event-settings="eventSettings"
            :time-scale="timeScale"
            :data-binding="onDataBinding"
            :event-click="onEventClick"
            :popup-open="onPopupOpen"
            :row-auto-height="true"
            :navigating="onNavigating"
            :event-rendered="oneventRendered"
            :group="group"
            :current-view="currentView"
            :resource-header-template="resourceHeaderTemplate"
            :drag="onItemDrag"
            :action-begin="onActionBegin"
            :action-complete="onActionComplete"
            :drag-stop="onDragStop"
            :locale="locale"
            :first-day-of-week="getFirstDay"
            :show-header-bar="false"
          >
            <e-views>
              <e-view
                option="TimelineDay"
                display-name="日"
                :interval="30"
              ></e-view>
              <e-view option="TimelineWeek" display-name="週"></e-view>
            </e-views>
            <e-resources>
              <e-resource
                field="vehicleId"
                name="Vehicles"
                :data-source="activeVehicles"
                text-field="Text"
                id-field="Id"
              ></e-resource>
            </e-resources>
          </ejs-schedule>
          <!-- scheduler to here -->
          <div>
            <!-- scheduler右クリックメニュー -->
            <ejs-contextmenu
              id="contextmenu"
              ref="menuObj"
              css-class="schedule-context-menu"
              target=".e-schedule"
              :items="menuItems"
              :before-open="onContextMenuBeforeOpen"
              :select="onMenuItemSelect"
            ></ejs-contextmenu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  L10n,
  loadCldr,
  setCulture,
  extend,
  // Ajax,
  closest
} from '@syncfusion/ej2-base'
import {
  SchedulePlugin,
  TimelineViews,
  DragAndDrop
} from '@syncfusion/ej2-vue-schedule'
import { ContextMenuPlugin } from '@syncfusion/ej2-vue-navigations'
import { createNamespacedHelpers } from 'vuex'
import { initScheduleHeader } from './jquery/index.js'
// 各表示部品Component
import Select from './Select.vue'
import OperationInstructions from './OperationInstructions.vue'
import Calendar from './Calendar.vue'
import TruckMenu from './TruckMenu.vue'
// 各モーダルComponent
import AllocatedInfo from './AllocatedInfo.vue'
import UnallocatedInfo from './UnallocatedInfo.vue'
import Memo from './Memo.vue'
import RequestingCargo from './RequestingCargo.vue'
import RequestingVehicle from './RequestingVehicle.vue'
import OperationInstructionsConfirm from './OperationInstructionsConfirm.vue'
// Syncfusion用部品Component
import Vehicle from './Vehicle.vue'
import Event from './Event.vue'
import Hover from './Hover.vue'
// vuex設定
const {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} = createNamespacedHelpers('allocate')
Vue.use(SchedulePlugin)
Vue.use(ContextMenuPlugin)

// 言語設定
setCulture('ja')
L10n.load({
  ja: {
    calendar: { today: '今日' },
    schedule: { today: '今日' }
  }
})
loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/ja/ca-gregorian.json'),
  require('cldr-data/main/ja/numbers.json'),
  require('cldr-data/main/ja/timeZoneNames.json')
)

// イベント移動前の情報
const beforeDraggedNode = []
// 求車・求貨イベントオブジェクトの移動/変更許可フラグ
let allowUpdateEvent = false
// コンテキストメニュー
const menuItems = [
  { text: '求貨登録(未実装)', id: 'cargo' },
  { text: 'メモ', id: 'memo' },
  { text: '注文登録(未実装)', id: 'order' }
]

export default {
  components: {
    'select-component': Select,
    OperationInstructions,
    AllocatedInfo,
    UnallocatedInfo,
    Memo,
    RequestingCargo,
    RequestingVehicle,
    TruckMenu,
    OperationInstructionsConfirm,
    Calendar
  },
  data() {
    const scheduleDataSource = require('./data/allocated.json')
    /*
    let ajax2 = new Ajax('https://private-58fcb-freight2.apiary-mock.com/allocated', 'GET', false);
    ajax2.onSuccess = function (value) {
      var list = JSON.parse(value);
      scheduleDataSource = list.map(function(e) {
        e.selected = false // 運行指示選択フラグ
        e.selectable = true // 選択可能フラグ
        return e;
      });
    };
    ajax2.send();
    */

    return {
      locale: 'ja',
      // Scheduler関連
      eventSettings: {
        dataSource: extend([], scheduleDataSource, null, true),
        fields: {
          subject: { title: 'タイトル', name: 'Name' },
          startTime: { title: '開始日時', name: 'startTime' },
          endTime: { title: '終了日時', name: 'endTime' },
          description: { title: '説明', name: 'description' }
        },
        template(e) {
          return { template: Event }
        },
        enableTooltip: true,
        tooltipTemplate(e) {
          return { template: Hover }
        }
      },
      // 車両一覧
      resourceHeaderTemplate(e) {
        return { template: Vehicle }
      },
      timeScale: { enable: true, slotCount: 1 },
      menuItems,
      selectedTarget: null,
      group: {
        enableCompactView: false,
        resources: ['Vehicles']
      },
      draggedItemId: null,
      isSelectAreaOpen: true,
      modals: {
        allocated: {
          show: false,
          id: null
        },
        unallocated: {
          show: false,
          id: null
        },
        cargo: {
          show: false,
          id: null
        },
        vehicle: {
          show: false,
          id: null
        },
        memo: {
          show: false,
          id: null,
          data: null,
          vehicle: null
        },
        instruction: {
          show: false,
          id: null
        }
      }
    }
  },
  computed: {
    ...mapState([
      'notAllocatedList',
      'instructionMode',
      'instructionList',
      'selectedDate',
      'currentView'
    ]),
    ...mapGetters(['activeVehicles', 'getFirstDay'])
  },
  mounted() {
    // this.search('')
    this.setVehicles()
    this.setInstructionMode(false)
    console.log('mounted')
  },
  methods: {
    ...mapActions(['search', 'setVehicles']),
    ...mapMutations([
      'setInstructionMode',
      'toggleInstructionMode',
      'addInstruction'
    ]),
    oneventRendered(args) {
      // console.log('oneventRendered', args)
    },
    addEvent(eventData) {
      this.$refs.ScheduleObj.ej2Instances.addEvent(eventData)
    },
    saveEvent(eventData) {
      this.$refs.ScheduleObj.ej2Instances.saveEvent(eventData)
    },
    deleteEvent(id) {
      this.$refs.ScheduleObj.ej2Instances.deleteEvent(id)
    },
    onDataBinding(event) {
      initScheduleHeader(this.currentView)
    },
    onToggleInstructionMode(event) {
      this.toggleInstructionMode()
      this.onToggleSelectArea()

      // 注文以外を選択付加状態(半透明)にする
      const selectable = !this.instructionMode
      const scheduleObj = this.$refs.ScheduleObj
      let events = scheduleObj.ej2Instances.getEvents()
      // イベントオブジェクトの変更を一時的に許可する
      allowUpdateEvent = true
      const that = this
      events.map(function(e) {
        if (e.eventType !== 'allocated') {
          console.log('event', e)
          e.selectable = selectable
          that.saveEvent(e)
        }
      })
      allowUpdateEvent = false

      // 運行指示モードから未割付一覧に切り替えた時
      if (!this.instructionMode) {
        events = scheduleObj.ej2Instances.getEvents()
        const that = this
        events.map(function(e) {
          if (e.eventType === 'allocated' && e.selected) {
            e.selected = false
            that.saveEvent(e)
          }
        })
      }
    },
    onToggleSelectArea() {
      this.isSelectAreaOpen = !this.isSelectAreaOpen
    },
    // 配車表内右クリック
    onContextMenuBeforeOpen(args) {
      const targetElement = args.event.target
      if (closest(targetElement, '.e-contextmenu')) {
        return
      }
      this.selectedTarget = closest(
        targetElement,
        '.e-appointment,.e-work-cells,' +
          '.e-vertical-view .e-date-header-wrap .e-all-day-cells,.e-vertical-view .e-date-header-wrap .e-header-cells'
      )

      const scheduleObj = this.$refs.ScheduleObj.ej2Instances
      const selectedCells = scheduleObj.getSelectedElements()
      const activeCellsData = scheduleObj.getCellDetails(
        selectedCells.length > 0 ? selectedCells : this.selectedTarget
      )
      // vehicle情報を取得
      const vehicle = this.activeVehicles[activeCellsData.groupIndex]
      const menuObj = document.getElementById('contextmenu').ej2_instances[0]
      if (vehicle.TruckName === '自車') {
        menuObj.showItems([
          menuItems[0].text,
          menuItems[1].text,
          menuItems[2].text
        ])
      } else {
        menuObj.hideItems([menuItems[0].text])
      }
    },
    onMenuItemSelect(args) {
      // 右クリックコンテキストメニュー
      const scheduleObj = this.$refs.ScheduleObj.ej2Instances
      const selectedCells = scheduleObj.getSelectedElements()
      const activeCellsData = scheduleObj.getCellDetails(
        selectedCells.length > 0 ? selectedCells : this.selectedTarget
      )
      console.log(activeCellsData)
      switch (args.item.id) {
        // TODO: 求貨登録や注文登録へリダイレクト
        case 'cargo': {
          break
        }
        case 'order': {
          break
        }
        case 'memo': {
          const obj = {
            name: 'memo',
            cellData: activeCellsData
          }
          this.setModal(obj)
          this.toggleModal({ name: 'memo' })
          break
        }
        default: {
          break
        }
      }
    },
    onNavigating(event) {
      console.log('onNavigating', event)
      /*
      let scheduleObj = this.$refs.ScheduleObj
      let events = scheduleObj.getEvents()
      // 帯の卸地の表示(日単位)・非表示（週単位)
      events.map(function(e) {
        if (e.eventType === 'allocated') {
          var copy = Object.assign({}, e)
          copy.showDestinationInfo = event.currentView === 'TimelineDay'
          scheduleObj.saveEvent(copy)
        }
      })
      */
    },
    onDragStop(event) {
      const vehicles = this.activeVehicles.filter(
        (vehicle) => vehicle.Id === event.data.vehicleId
      )
      event.data.vehicleName = vehicles[0].Text
      console.log(
        event.data.Id +
          'がvehicleId=' +
          event.data.vehicleId +
          'の' +
          event.data.startTime +
          '~' +
          event.data.endTime +
          'に移動した'
      )
    },
    onItemDrag(event) {
      console.log('onItemDrag', event)
      // スケジュール内のドラッグドロップ時
      if (
        event.data &&
        event.data.eventType === 'allocated' &&
        !beforeDraggedNode[event.data.Id]
      ) {
        beforeDraggedNode[event.data.Id] = {
          startTime: event.data.startTime,
          endTime: event.data.endTime,
          vehicleId: event.data.vehicleId
        }
      }
      console.log('onItemDrag:beforeDraggedNode', beforeDraggedNode)
    },
    dataFilter(item) {
      return item.Id !== parseInt(this.draggedItemId, 10)
    },
    onActionBegin(event) {
      console.log('onActionBegin:event', event)
      console.log('onActionBegin:event.requestType', event.requestType)

      if (event.requestType === 'eventCreate' && this.draggedItemId) {
        console.log('onActionBegin:eventCreate', event)
        const treeObj = document.getElementById('Tree').ej2_instances[0]
        const treeViewdata = treeObj.fields.dataSource
        const filteredPeople = treeViewdata.filter(this.dataFilter)
        treeObj.fields.dataSource = filteredPeople
      }

      if (event.requestType === 'eventChange') {
        if (
          event.data.eventType === 'allocated' &&
          beforeDraggedNode[event.data.Id]
        ) {
          // 仕様memo: 割付済注文の場合はstartとendは移動前の値から変更不可だが、resource(人）変更はOK
          event.data.startTime = new Date(
            beforeDraggedNode[event.data.Id].startTime
          )
          event.data.endTime = new Date(
            beforeDraggedNode[event.data.Id].endTime
          )
        } else if (
          event.data.eventType === 'cargo' ||
          event.data.eventType === 'vehicle'
        ) {
          if (!allowUpdateEvent) {
            // 変更不可
            event.cancel = true
          }
        }
      }

      if (event.requestType === 'eventRemove') {
        console.log(
          'Id = ' + event.deletedRecords[0].Id + 'のイベントが削除されました'
        )
      }

      if (event.requestType === 'viewNavigate') {
        // console.log(event.event.srcElement.innerHTML);
      }
    },
    onActionComplete(event) {
      console.log('onActionComplete:event', event)
      // if (event.requestType === 'viewNavigate' || event.requestType === 'toolBarItemRendered') {
      if (
        event.requestType === 'viewNavigate' ||
        event.requestType === 'dateNavigate'
      ) {
        // initScheduleHeader(this.currentView)
      }

      if (event.requestType === 'eventChanged') {
        console.log(event)
      }

      if (event.requestType === 'eventRemoved') {
      }
      console.log(this.$refs.ScheduleObj)
    },
    onEventClick(event) {
      console.log('onEventClick', event)
      if (event.originalEvent.requestType === 'eventRemove') {
        this.deleteEvent(event.event.Id)
        event.cancel = true
      }
    },
    onPopupOpen(event) {
      console.log('onPopupOpen:event', event)
      event.cancel = true
      // 予定以外の箇所がクリックされた場合
      if (!event.target.className.includes('e-appointment')) {
        // event.cancel = true;
      } else if (this.instructionMode && event.data.eventType === 'allocated') {
        console.log('運行指示モードです', event.target.classList)
        event.data.selected = true
        this.addInstruction(event.data)
        this.$refs.ScheduleObj.ej2Instances.saveEvent(event.data)
      } else {
        // モーダルオープン
        const obj = { name: event.data.eventType, cellData: event.data }
        this.setModal(obj)
        this.toggleModal({ name: event.data.eventType, id: event.data.Id })
      }
    },
    toggleModal(value) {
      const modalName = this.hasProperty(value, 'name') ? value.name : value
      this.modals[modalName].show = !this.modals[modalName].show
      if (this.hasProperty(value, 'id')) {
        this.modals[modalName].id = value.id
      }
    },
    setModal(value) {
      let modalName
      if (this.hasProperty(value, 'name')) {
        modalName = value.name
      } else {
        return
      }
      if (!this.hasProperty(value, 'cellData')) {
        return
      }

      let vehicles
      if (this.hasProperty(value.cellData, 'vehicleId')) {
        vehicles = this.activeVehicles.filter(
          (vehicle) => vehicle.Id === value.cellData.vehicleId
        )
        this.modals[modalName].vehicle = vehicles[0]
      } else if (this.hasProperty(value.cellData, 'groupIndex')) {
        vehicles = this.activeVehicles.filter((vehicle) => vehicle.Show)
        this.modals[modalName].vehicle = vehicles[value.cellData.groupIndex]
      }

      const cellData = value.cellData
      const startTime = cellData.startTime
        ? cellData.startTime
        : cellData.StartTime
      const endTime = cellData.endTime ? cellData.endTime : cellData.EndTime
      let obj
      if (modalName === 'memo') {
        obj = {
          startTime,
          endTime,
          memoTitle: cellData.memoTitle,
          memoBody: cellData.memoBody
        }
      } else {
        obj = cellData
      }
      this.modals[modalName].data = obj
    },
    initModal(value) {
      if (value === 'memo') {
        this.modals[value].id = null
      }
    },
    onCellDoubleClick() {
      console.log('onCellDoubleClick')
    },
    onCellClick() {
      console.log('onCellClick')
    },
    hasProperty(obj, key) {
      return obj && Object.prototype.hasOwnProperty.call(obj, key)
    },
    onTreeDragStop(event) {
      console.log('onTreeDragStop', event)
      const treeElement = closest(event.target, '.e-treeview')
      const classElement = document.querySelector('.e-device-hover')
      if (classElement) {
        classElement.classList.remove('e-device-hover')
      }
      if (!treeElement) {
        event.cancel = true
        const scheduleElement = closest(event.target, '.e-content-wrap')
        if (scheduleElement) {
          const treeObj = document.getElementById('Tree').ej2_instances[0]
          console.log('onTreeDragStop:treeObj', treeObj)
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
            console.log('filteredData', filteredData[0])
            console.log('cellData', cellData)
            const eventData = {
              Id: filteredData[0].Id,
              Name: filteredData[0].Name,
              departure: filteredData[0].departure,
              departureCity: filteredData[0].departureCity,
              destination: filteredData[0].destination,
              destinationCity: filteredData[0].destinationCity,
              // startTime: cellData.startTime,
              // endTime: cellData.endTime,
              startTime: new Date(filteredData[0].startTime),
              endTime: new Date(filteredData[0].endTime),
              IsAllDay: cellData.isAllDay,
              description: filteredData[0].description,
              vehicleId: resourceDetails.resourceData.Id
            }
            console.log('eventData', eventData)
            this.addEvent(eventData)
            treeObj.dragLi.hidden = true
          }
        }
      }
    }
  },
  provide: {
    schedule: [TimelineViews, DragAndDrop]
  }
}
</script>

<style lang="scss">
/*
@import '~/node_modules/@syncfusion/ej2-base/styles/material.css';
@import '~/node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '~/node_modules/@syncfusion/ej2-calendars/styles/material.css';
@import '~/node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
@import '~/node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '~/node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '~/node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '~/node_modules/@syncfusion/ej2-vue-schedule/styles/material.css';
@import '~/assets/styles/allocate.scss';
*/
</style>
