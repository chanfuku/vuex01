import vehicleResult from '~/components/allocate/data/vehicle.json'
import truckMenuResult from '~/components/allocate/data/truckmenu.json'

export const state = () => ({
  instructionMode: false,
  selectedDate: new Date('2020-03-09T00:00:00'),
  currentView: 'TimelineDay', // TimelineDay or TimelineWeek
  firstDay: null,
  notAllocatedList: [],
  instructionList: [],
  loadplaceList: [],
  vehicleList: [],
  truckMenu: []
})

export const getters = {
  getSelectedDate: (state) => state.selectedDate,
  getFirstDay: (state) => {
    const dObj = new Date(state.selectedDate)
    return dObj.getDay()
  },
  activeVehicles: (state) => {
    return state.vehicleList.filter((vehicle) => vehicle.Show)
  },
  allTruckHash: (state) => {
    const hashMap = {}
    state.vehicleList.map((vehicle) => {
      if (!hashMap[vehicle.CompanyId]) {
        hashMap[vehicle.CompanyId] = vehicle
      }
    })

    return hashMap
  },
  getVehiclesByCompanyId: (state) => (id) => {
    if (id) {
      return state.vehicleList.filter((vehicle) => {
        return parseInt(vehicle.CompanyId) === parseInt(id)
      })
    } else {
      return state.vehicleList
    }
  }
}

export const mutations = {
  changeNotAllocated(state, value) {
    state.notAllocatedList = value
  },
  setVehicles(state, value) {
    state.vehicleList = value
  },
  updateVehicles(state, value) {
    const arr = value.map(function(item) {
      return parseInt(item)
    })
    let vehicles
    if (arr.includes(0)) {
      // 全車両を表示
      vehicles = state.vehicleList.map(function(vehicle) {
        vehicle.Show = true
        return vehicle
      })
    } else {
      vehicles = state.vehicleList.map(function(vehicle) {
        const categoryIds = vehicle.CategoryIds.filter((categoryId) =>
          arr.includes(categoryId)
        )
        vehicle.Show = categoryIds.length > 0
        return vehicle
      })
    }
    state.vehicleList = vehicles
  },
  setTruckMenu(state, value) {
    state.truckMenu = value
  },
  toggleInstructionMode(state) {
    state.instructionMode = !state.instructionMode
    if (!state.instructionMode) {
      state.instructionList = []
    }
  },
  setInstructionMode(state, value) {
    state.instructionMode = value
  },
  addInstruction(state, value) {
    // 重複チェック
    const filtered = state.instructionList.filter(function(obj) {
      return obj.Id === value.Id
    })
    if (filtered.length === 0) {
      state.instructionList.push(value)
    }
  },
  removeInstruction(state, value) {
    state.instructionList.splice(value, 1)
  },
  removeAllInstruction(state) {
    state.instructionList = []
  },
  setLoadplaceList(state, value) {
    state.loadplaceList = value
  },
  removeLoadPlace(state, value) {
    state.loadplaceList.splice(value, 1)
  },
  upDownLoadPlace(state, value) {
    if (value.name === 'up' && value.index === 0) {
      // 先頭を上に移動しようとした場合は何もしない
      return
    } else if (
      value.name === 'down' &&
      value.index === state.loadplaceList.length - 1
    ) {
      // 末尾を下に移動しようとした場合は何もしない
      return
    }
    const index = value.name === 'up' ? value.index - 1 : value.index
    state.loadplaceList.splice(
      index,
      2,
      state.loadplaceList[index + 1],
      state.loadplaceList[index]
    )
  },
  setSelectedDate(state, value) {
    state.selectedDate = value
  },
  setCurrentView(state, value) {
    state.currentView = value
  }
}

export const actions = {
  // async search (context, payload) {
  //   let params = payload !== undefined ? payload.value : '';
  //   let url = 'https://private-58fcb-freight2.apiary-mock.com/allocated'
  //   let result = await this.$axios.$get(url)
  //   context.commit('changeNotAllocated', result)
  // },
  // async setVehicles (context, payload) {
  setVehicles(context) {
    /*
    let url = 'https://private-58fcb-freight2.apiary-mock.com/drivers'
    let result = await this.$axios.$get(url)
    */
    const result2 = vehicleResult.map(function(item) {
      item.Show = true
      return item
    })
    context.commit('setVehicles', result2)
  },
  setLoadplaceList(context, payload) {
    if (payload === undefined) {
      // TODO: instructionListからIDを取得してリクエストパラメータに付与
      // let url = 'https://private-58fcb-freight2.apiary-mock.com/loadplaces'
      // let result = await this.$axios.$get(url)
      // let result = require('~/components/allocate/data/loadplaces.json')
      const result = [
        {
          Id: 1,
          Loadedtype: 1,
          Date: '12/01',
          Time: '10:00',
          Name: 'xxxxx工場',
          Address: '茨城県水戸市百合ヶ丘町1-1-1'
        },
        {
          Id: 2,
          Loadedtype: 2,
          Date: '12/01',
          Time: '11:00',
          Name: '株式会社xxxxx',
          Address: '茨城県日立市下土木内町'
        },
        {
          Id: 3,
          Loadedtype: 1,
          Date: '12/01',
          Time: '12:00',
          Name: 'yyyy工場',
          Address: '神奈川県横浜市1-1-1'
        },
        {
          Id: 4,
          Loadedtype: 2,
          Date: '12/01',
          Time: '13:00',
          Name: '株式会社yyyyy',
          Address: '神奈川県川崎市1-1-1'
        }
      ]
      context.commit('setLoadplaceList', result)
    } else {
      // 並び替え発生時
      context.commit('setLoadplaceList', payload)
    }
  },
  // async setTruckMenu (context, payload) {
  setTruckMenu(context) {
    // let url = 'https://private-58fcb-freight2.apiary-mock.com/truckmenu'
    // let result = await this.$axios.$get(url)
    context.commit('setTruckMenu', truckMenuResult)
  }
}
