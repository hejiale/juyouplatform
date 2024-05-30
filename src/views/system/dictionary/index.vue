<template>
  <div class="tableBox">
    <yc-table
      :table="table"
      :isShowPagination="false"
      ref="myTable"
      @selectCurrentRow="onSelectionChange"
      class="leftTable"
    >
      <template slot="typeValue" slot-scope="props">
        <div class="typeValueBox">{{props}}</div>
      </template>
    </yc-table>
    <detail
      class="rightTable"
      :currentDict="currentDict"
      v-if="currentDict.dictType"
      ref="detail"
    />
  </div>
</template>

<script>
import detail from './detail.vue'
export default {
  components: {
    detail
  },
  data(vm) {
    return {
      table: {
        api: this.$api.dictQueryDictList,
        // hidenTitle: true,
        hasKeys: 'dictType',
        query: {},
        searchData: [],
        columns: [
          {
            title: '字典类别',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.typeValue(ctx.row.typeValue)
              )
            }
          }
        ]
      },
      currentDict: {}
    }
  },
  activated() {
    this.currentDict = {}
  },
  methods: {
    onSelectionChange(val) {
      if (val) {
        this.currentDict = val
        this.$nextTick(() => {
          this.$refs.detail.getInfo()
        })
      }
    }
  }
}
</script>

<style lang="sass">
.tableBox
    display: flex
    .leftTable
        width: 25%
        height: auto
        border-right: #D8D8D8 1px solid
        .typeValueBox
          cursor: pointer
    .rightTable
        flex: 1
</style>
