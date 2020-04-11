<script>
import { Internationalization } from '@syncfusion/ej2-base'
const WeekChars = ['日', '月', '火', '水', '木', '金', '土']

const instance = new Internationalization()

export default {
  data() {
    return {}
  },
  mounted() {
    // console.log(this.data);
  },
  methods: {
    getTimeString(value) {
      const dObj = new Date(value)
      const wDay = WeekChars[dObj.getDay()]
      return (
        instance.formatDate(dObj, { skeleton: 'Md' }) +
        '(' +
        wDay +
        ') ' +
        instance.formatDate(dObj, { skeleton: 'Hm' })
      )
    },
    getYearString(value) {
      const dObj = new Date(value)
      const wDay = WeekChars[dObj.getDay()]
      return (
        instance.formatDate(dObj, { skeleton: 'yMd' }) +
        '(' +
        wDay +
        ') ' +
        instance.formatDate(dObj, { skeleton: 'Hm' })
      )
    },
    getDateString(value) {
      const dObj = new Date(value)
      const wDay = WeekChars[dObj.getDay()]
      return instance.formatDate(dObj, { skeleton: 'Md' }) + '（' + wDay + '）'
    },
    getWeekString(value) {
      const fromStr = this.getDateString(value)
      const dObj = new Date(value)
      const toDate = dObj.getDate() + 6
      const toDateObj = new Date(dObj.setDate(toDate))
      const wDay = WeekChars[toDateObj.getDay()]
      const toStr =
        instance.formatDate(dObj, { skeleton: 'Md' }) + '（' + wDay + '）'
      return fromStr + '~ ' + toStr
    },
    getMondayObj(value) {
      const dObj = new Date(value)
      const dayNum = dObj.getDay()
      // 日曜の場合は前週の月曜
      let monday
      if (dayNum === 0) {
        monday = dObj.getDate() - 6
      } else {
        monday = dObj.getDate() - dayNum + 1
      }
      return new Date(dObj.setDate(monday))
    },
    getHour(value) {
      const dObj = new Date(value)
      return dObj.getHours()
    },
    getMinute(value) {
      const dObj = new Date(value)
      return dObj.getMinutes()
    },
    get24h() {
      const arr = []
      for (let i = 0; i < 24; i++) {
        arr.push(i)
      }

      return arr
    },
    get60m() {
      const arr = []
      for (let i = 0; i < 60; i++) {
        arr.push(i)
      }

      return arr
    }
  }
}
</script>
