<template>
  <div>
    <modal v-if="modal.show">
      <h3 slot="header">
        <span class="subject">進行確定</span>
        <i class="fas fa-times-circle" @click="closeModal"></i>
      </h3>
      <div slot="body">
        <div class="content_box sub_content">
          <h4>進行順</h4>
          <ul>
            <draggable v-model="loadList">
              <transition-group>
                <li
                  v-for="(item, index) in loadList"
                  :key="item.Id"
                  class="tablecell"
                >
                  <div class="loadedtype">
                    <span :class="item.Loadedtype === 1 ? 'load' : 'unload'">{{
                      item.Loadedtype === 1 ? '開始' : '終了'
                    }}</span>
                  </div>
                  <div class="date">{{ item.Date }}</div>
                  <div class="time">{{ item.Time }}</div>
                  <div class="name">{{ item.Name }}</div>
                  <div class="address">{{ item.Address }}</div>
                  <div class="updown">
                    <i class="fas fa-chevron-circle-up" @click="onUp(index)"></i
                    ><i
                      class="fas fa-chevron-circle-down"
                      @click="onDown(index)"
                    ></i>
                  </div>
                  <div class="close">
                    <i class="fas fa-times-circle" @click="onRemove(index)"></i>
                  </div>
                </li>
              </transition-group>
            </draggable>
          </ul>
        </div>
      </div>
      <h3 slot="footer">
        <button class="btn btnProceed" @click="onOutputDoc()">
          進行指示書の作成
        </button>
      </h3>
    </modal>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
  'allocate'
)
const modalName = 'instruction'

export default {
  name: modalName,
  components: {
    draggable
  },
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
    ...mapState(['loadplaceList']),
    loadList: {
      get() {
        return this.loadplaceList
      },
      set(value) {
        this.setLoadplaceList(value)
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions(['setLoadplaceList']),
    ...mapMutations(['removeLoadPlace', 'upDownLoadPlace']),
    getLoadtypeClass(loadedtype) {
      let ret = ''
      if (loadedtype === 1) {
        ret = 'load'
      } else if (loadedtype === 2) {
        ret = 'unload'
      }
      return ret
    },
    closeModal() {
      this.setLoadplaceList([])
      this.$emit('toggle-modal', this.modalName)
    },
    onRemove(index) {
      this.removeLoadPlace(index)
    },
    onUp(index) {
      this.upDownLoadPlace({ index, name: 'up' })
    },
    onDown(index) {
      this.upDownLoadPlace({ index, name: 'down' })
    },
    onOutputDoc() {
      console.log('hoge')
    }
  }
}
</script>
