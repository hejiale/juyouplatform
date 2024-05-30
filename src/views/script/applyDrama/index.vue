<template>
  <div>
    <div class="base-topBtn">
      <el-button
        type="primary"
        plain
        @click="goAdd"
        v-if="$powers('/boxDramaApply/addOneBoxDramaApply')"
        >新增申领剧本</el-button
      >
    </div>
    <yc-table :table="table" ref="myTable">
      <template slot="putOnStatus" slot-scope="props">
        <span>{{
          props.lsPutOn ? '上架':'下架'
        }}</span>
      </template>
      <template slot="boxDramaApplyStatus" slot-scope="props">
        <span>{{
          $enums.BoxDramaApplyStatus.getName(props.boxDramaApplyStatus)
        }}</span>
      </template>
      <template slot="actions" slot-scope="props">
        <el-button
          type="text"
          @click="goEdit(props.id)"
          v-if="$powers('/boxDramaApply/queryBoxDramaApplyDetail')"
          >编辑</el-button
        >
      </template>
    </yc-table>
  </div>
</template>

<script>
const formDetail = {
  dramaId: null /*剧本Id*/,
  productName: null /*商品名称*/,
  dramaCover: null /*剧本封面*/,
  publisherNames: []
}
export default {
  components: {
  },
  data() {
    const vm = this
    return {
      form: vm.$_.clone(formDetail),
      table: {
        api: this.$api.boxDramaApplyQueryBoxDramaApply,
        query: {
        },
        searchData: [
          {
            title: '关联申领剧本商品',
            type: 'input',
            model: 'productName',
            placeholder: '请输入'
          },
          {
            title: '申领状态',
            type: 'select',
            model: 'boxDramaApplyStatus',
            enumType: 'BoxDramaApplyStatus',
            placeholder: '请输入'
          }
        ],
        columns: [
          {
            title: '关联申领剧本商品名称',
            key: 'productName',
            align: 'left',
            showTooltip: true
          },
          {
            title: '申领状态',
            key: 'boxDramaApplyStatus',
            enumType: 'BoxDramaApplyStatus'
          },
          {
            title: '创建时间',
            key: 'createdTime'
          },
          {
            title: '操作',
            width: 240,
            render(h, ctx) {
              return h('div', vm.$refs['myTable'].$scopedSlots.actions(ctx.row))
            }
          }
        ]
      }
    }
  },
  methods: {
    goAdd() {
      this.$router.push({
        name: 'scriptApplyAdd'
      })
    },
    goEdit(props) {
      this.$router.push({
        name: 'scriptApplyEdit',
        query: { id:  props}
      })
    }
  }
}
</script>
<style lang="sass" scoped>

</style>
