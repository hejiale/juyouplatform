<template>
  <div>
    <yc-table
      :table="table"
      ref="myTable"
      :isShowPagination="false"
      :isAutoLoad="false"
    >
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd" v-if="$powers('/dict/addDict')">新增</el-button>
        </div>
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doEdit(props)" v-if="$powers('/dict/updateDict')">修改</el-button>
        <el-button type="text" class="reject" @click="doDel(props)" v-if="$powers('/dict/deleteDict')"
          >删除</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      width="500px"
      class="dictionary-dialog"
      :visible.sync="dialogVisible"
      center
      :title="currentTitle"
    >
      <dialogContent
        @on-cancel="dialogVisible = false"
        @on-sure="doSubmit"
        :isLoading="loading"
        :center="true"
      >
        <template slot="content">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="字典类别">
              <div class="tags">
                <span>{{ currentDict.typeValue }}</span>
              </div>
            </el-form-item>
            <el-form-item label="添加字典">
              <el-input
                v-model="dictValue"
                maxlength="50"
                placeholder="请输入字典名称"
              />
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
import dialogContent from '@global/dialog'
export default {
  components: {
    dialogContent
  },
  props: {
    currentDict: {
      type: Object,
      default: {}
    }
  },
  data(vm) {
    return {
      table: {
        loading: false,
        query: {},
        searchData: [],
        columns: [
          {
            title: '字典内容',
            align: 'left',
            key: 'dictValue'
          },
          {
            title: '操作',
            width: '240px',
            align: 'left',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      form: {},
      dialogVisible: false,
      loading: false,
      activeIdx: null,
      currentId: null,
      dictValue: null,
      currentTitle: null
    }
  },
  methods: {
    async getInfo() {
      let res = await this.$api.dictQueryDictList({
        dictType: this.currentDict.dictType
      })
      this.table.data = res[0].dictList
      this.$refs.myTable.update()
    },
    doAdd() {
      this.currentTitle = '新增字典'
      this.dictValue = null
      this.currentId = null
      this.dialogVisible = true
    },
    doEdit(row) {
      this.currentTitle = '修改字典'
      this.dictValue = row.dictValue
      this.currentId = row.id
      this.dialogVisible = true
    },
    async doDel(row) {
      this.table.loading = true
      await this.$api.dictDeleteDict({
        dictList: [
          {
            id: row.id
          }
        ]
      })
      this.getInfo()
      this.$message.success('操作成功')
      this.table.loading = false
    },
    async doSubmit() {
      if (!this.dictValue) return this.$message.warning('字典内容不能为空！')
      this.table.loading = true
      try {
        if (this.currentTitle == '新增字典') {
          await this.$api.dictAddDict({
            dictList: [
              {
                dictType: this.currentDict.dictType,
                dictValue: this.dictValue
              }
            ]
          })
        } else {
          await this.$api.dictUpdateDict({
            dictType: this.currentDict.dictType,
            dictValue: this.dictValue,
            id: this.currentId
          })
        }

        this.dialogVisible = false
        this.getInfo()
        this.$message.success('操作成功')
      } finally {
        this.table.loading = false
      }
    }
  }
}
</script>

<style lang="sass">
.dictionary-dialog
  .el-dialog__body
    padding: 30px 90px
  .el-input
    width: 275px
    margin-right: 20px
  .dialog-btn
    display: inline-block
    text-align: center
    width: 64px
    height: 28px
    line-height: 28px
    background-color: #FFF5F1
    color: $primaryColor
    border-radius: 20px
    position: relative
    cursor: pointer
    margin-right: 25px
    &.active
      background-color: $primaryColor
      color: #fff
    .svg-icon-del
      position: absolute
      right: -3px
      top: -3px
.tags
  width: 400px
</style>
