<template>
  <span class="select_requsters">
    <div ref="accordion" class="js-accordion">
      <div class="js-accordion--trigger" :class="{ '_state-open': isOpened }">
        <input
          id="accordion_toggle"
          v-model="keyword"
          :placeholder="getPlaceHolder()"
          type="text"
          name="requests"
          autocomplete="off"
          @click="accordionToggle($event)"
          @keyup="search()"
        />
        <ul class="selected_groups">
          <li
            v-for="(item, index) in selected"
            :key="item.Id"
            class="tablecell"
          >
            {{ item.label }}
            <i class="fas fa-times" @click="onRemove(item, index)"></i>
          </li>
        </ul>
        <i class="remove far fa-times-circle" @click="onRemoveAll()" v-if="selected.length"></i>
      </div>
      <div
        v-if="isOpened"
        class="js-accordion--target"
        :class="{ '_state-open': isOpened }"
      >
        <div class="js-accordion--body" name="body">
          <ul v-if="getTargetRequesters().length" class="group_list">
            <li
              v-for="item in getTargetRequesters()"
              :key="item.Id"
              class="tablecell"
              @click="onSelect(item)"
            >
              <p>
                <span v-if="item.class === 'group'"
                  ><i class="fas fa-users"></i></span
                ><span>{{ item.label }}</span>
              </p>
            </li>
          </ul>
          <ul v-else>
            <li>表示するデータがありません</li>
          </ul>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
export default {
  name: 'Requesters',
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpened: false,
      requesters: null,
      selected: this.value,
      keyword: null,
      placeholder: 'カテゴリを選択する'
    }
  },
  computed: {},
  mounted() {
    /*
    const axios = require('axios')
    axios
      .get('https://private-58fcb-freight2.apiary-mock.com/requesters')
      .then(response => (this.requesters = response.data))
    */
    this.requesters = require('./data/requesters.json')

    const that = this
    document.addEventListener('click', function(e) {
      const target = (e.target || e.srcElement).closest('.js-accordion')
      if (target === that.$refs.accordion) return
      that.onInit()
      that.isOpened = false
    })
  },
  methods: {
    search() {
      this.isOpened = true
      const that = this
      this.requesters = this.requesters.map(function(obj) {
        if (!that.getSelectedIds().includes(obj.id)) {
          obj.show = obj.label.includes(that.keyword)
        }
        return obj
      })
    },
    getPlaceHolder() {
      const ret = this.selected.length > 0 ? '' : this.placeholder
      return ret
    },
    onSelect(item) {
      if (item.class === 'group') {
        const selectedIds = this.getSelectedIds()
        const filtered = this.requesters
          .filter(function(obj) {
            return item.companyIds.includes(obj.id)
          })
          .filter(function(obj) {
            return !selectedIds.includes(obj.id)
          })
        this.selected = this.selected.concat(filtered)

        this.requesters = this.requesters.map(function(obj) {
          if (item.companyIds.includes(obj.id)) {
            obj.show = false
          }
          return obj
        })
      } else {
        this.selected.push(item)
        this.requesters = this.requesters.map(function(obj) {
          if (obj.id === item.id) {
            obj.show = false
          }
          return obj
        })
      }

      this.onInit()
    },
    onRemove(item, index) {
      this.selected.splice(index, 1)
      this.requesters = this.requesters.map(function(obj) {
        if (obj.id === item.id) {
          obj.show = true
        }
        return obj
      })
    },
    onRemoveAll() {
      this.selected = []
      this.onInit()
    },
    onInit() {
      this.keyword = ''
      const selectedIds = this.getSelectedIds()
      this.requesters = this.requesters.map(function(obj) {
        obj.show = !selectedIds.includes(obj.id)
        return obj
      })
    },
    getTargetRequesters() {
      const filtered = this.requesters.filter(function(obj) {
        return obj.show
      })
      return filtered
    },
    getSelectedIds() {
      const selectedIds = this.selected.map(function(obj) {
        return obj.id
      })
      return selectedIds
    },
    accordionToggle(event) {
      if (!this.keyword) {
        this.isOpened = !this.isOpened
      }
    }
    /*
    beforeEnter: function(el) {
      el.style.height = '0';
    },
    enter: function(el) {
      el.style.height = el.scrollHeight + 'px';
    },
    beforeLeave: function(el) {
      el.style.height = el.scrollHeight + 'px';
    },
    leave: function(el) {
      el.style.height = '0';
    }
    */
  }
}
</script>
