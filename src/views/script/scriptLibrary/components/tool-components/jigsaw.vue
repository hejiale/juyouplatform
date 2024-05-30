<template>
  <div>
    <yc-table
      :table="table"
      ref="myTable"
      :hideTableTitle="true"
      :topTitle="topTitle"
      :isShowPagination="false"
      :isAutoLoad="false"
    >
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="dialogVisible = true" v-if="$powers('/murderMysteryTool/addToolForVote')"
            >新增拼图</el-button
          >
        </div>
      </template>
      <template slot="matrix" slot-scope="props">
        {{ props.jigsawRow + '×' + props.jigsawColumn }}
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doEdit(props)" v-if="$powers('/murderMysteryTool/updateToolForVote')">编辑</el-button>
        <el-button type="text" class="reject" @click="doDel(props.id)" v-if="$powers('/murderMysteryTool/deleteToolForVote')"
          >删除</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      :title="form.id ? '修改拼图工具':'新增拼图工具'"
      :visible.sync="dialogVisible"
      class="role-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="800px"
      center
    >
      <dialogContent
        :isLoading="subLoading"
        @on-back="handleClose"
        @on-cancel="handleClose"
        @on-sure="doSubmit"
      >
        <template slot="content">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="left"
            label-width="80px"
            class="user-form"
            style="padding: 0 50px"
            center
          >
            <el-form-item label="题目">
              <el-input
                v-model="form.title"
                placeholder="请输入"
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="行数">
              <el-select
                v-model="form.jigsawRow"
                placeholder="请选择"
                @change="change"
              >
                <el-option
                  v-for="i in list"
                  :label="i.label"
                  :value="i.value"
                  :key="i.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="列数" prop="jigsawColumn">
              <el-select
                v-model="form.jigsawColumn"
                placeholder="请选择"
                @change="change"
              >
                <el-option
                  v-for="i in list"
                  :label="i.label"
                  :value="i.value"
                  :key="i.value"
                />
              </el-select>
            </el-form-item>
            <span style="color: #999">修改行数和列数会清空下列图片</span>
            <div class="table">
              <div
                class="table-item"
                v-for="(item, index) in form.jigsawItem"
                :key="index"
              >
                <span>{{ '行' + (index + 1) }}</span>
                <yc-image-uploader
                  v-for="(it, idx) in item"
                  :key="idx"
                  :ref="'url' + it.jigsawColumn + it.jigsawRow"
                  v-model="it.url"
                  canShow
                  :showTips="false"
                ></yc-image-uploader>
              </div>
            </div>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
import dialogContent from '@global/dialog'
const FORM = {
  title: '',
  jigsawRow: '',
  jigsawColumn: '',
  jigsawItem: []
}
export default {
  components: {
    dialogContent
  },
  data(vm) {
    return {
      table: {
        customTopTitle: true,
        api: this.$api.murderMysteryToolToolForJigsawList,
        query: {
          dramaId: this.$route.query.id
        },
        searchData: [
          {
            title: '标题',
            type: 'input',
            model: 'title',
            placeholder: '请输入'
          }
        ],
        columns: [
          {
            title: '标题',
            key: 'title',
            showTooltip: true,
            align: 'left'
          },
          {
            title: '行×列',
            align: 'left',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.matrix(ctx.row))
            }
          },
          {
            title: '操作',
            align: 'left',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      form: this.$_.cloneDeep(FORM),
      rules: {
        title: {
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        },
        voteType: {
          required: true,
          message: '请选择类型',
          trigger: 'change'
        }
      },
      list: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 }
      ],
      dialogVisible: false,
      subLoading: false,
      topTitle: '添加后工具内激活拼图功能，选择线索可配置拼图行与列'
    }
  },
  methods: {
    refresh(){
      this.$refs.myTable.refresh();
    },
    change() {
      if(this.form.jigsawItem){
        this.form.jigsawItem.map(v=>{
          v.map(item=>{
            this.$refs[`url${item.jigsawColumn}${item.jigsawRow}`][0].setFileList();
          })
        })
      }
      
      if (this.form.jigsawColumn && this.form.jigsawRow) {
        this.form.jigsawItem = []
        for (let i = 0; i < this.form.jigsawRow; i++) {
          this.form.jigsawItem.push([])
          for (let v = 0; v < this.form.jigsawColumn; v++) {
            this.form.jigsawItem[i].push({
              jigsawColumn: v,
              jigsawRow: i,
              url: ''
            })
          }
        }
      }
    },
    doEdit(prop) {
      let that = this
      this.dialogVisible = true
      this.form = JSON.parse(JSON.stringify(prop))
      
      this.form.jigsawItem = [];

      for (let i = 0; i < this.form.jigsawRow; i++) {
        this.form.jigsawItem.push([])
        for (let v = 0; v < this.form.jigsawColumn; v++) {
          this.form.jigsawItem[i].push({
            jigsawColumn: v,
            jigsawRow: i,
            url: null
          })
        }
      }

      console.log(this.form.jigsawItem)

      prop.blockItemList.map(it=>{
        this.form.jigsawItem.map(v=>{
          if(it.jigsawColumn === v.jigsawColumn && it.jigsawRow === v.jigsawRow){
            v.url = it.url
          }
        })
      })

      this.$nextTick(() => {
        prop.blockItemList.map((v) => {
          that.$refs[`url${v.jigsawColumn}${v.jigsawRow}`][0].setFileList(v.url)
        })
      })
    },
    doDel(id) {
      this.$confirm(`此操作将删除该线索, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.murderMysteryToolDeleteToolForJigsaw({
            jigsawId: id
          })
          this.$message({
            type: 'success',
            message: `删除成功!`
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
    async doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if(this.subLoading)return;
        this.subLoading = true
        try {
          let jigsawItem = []
          this.form.jigsawItem.map((v) => {
            jigsawItem.push(...v)
          })
          let idx = jigsawItem.findIndex(i=>!i.url);
          if(idx !== -1){
            this.$message.error('请上传图片')
            this.subLoading = false;
            return;
          }
          if (this.form.id) {
            await this.$api.murderMysteryToolUpdateToolForJigsaw({
              jigsawColumn: this.form.jigsawColumn,
              jigsawRow: this.form.jigsawRow,
              title: this.form.title,
              dramaId: this.$route.query.id,
              jigsawItem,
              id: this.form.id
            })
          } else {
            await this.$api.murderMysteryToolAddToolForJigsaw({
              jigsawColumn: this.form.jigsawColumn,
              jigsawRow: this.form.jigsawRow,
              title: this.form.title,
              dramaId: this.$route.query.id,
              jigsawItem
            })
          }
          this.dialogVisible = false
          this.clearData()
          this.$message.success('操作成功')
          await this.$refs.myTable.refresh()
          this.subLoading = false
        } catch (e) {
          this.subLoading = false
          console.log(e)
        }
      })
    },
    handleClose() {
      this.clearData()
      this.dialogVisible = false
    },
    clearData() {
      this.form = this.$_.cloneDeep(FORM)
    }
  }
}
</script>
<style lang="sass" scoped>
.image-uploader
  width: 100px !important
  height: 100px !important
/deep/.el-upload
  width: 100px !important
  height: 100px !important
/deep/.el-icon-plus
  width: 100px !important
  height: 100px !important
/deep/.el-upload-list__item
  width: 100px !important
  height: 100px !important
</style>
<style lang="sass" scoped>
.table
  &-item
    margin-top: 20px
    display: flex
    flex-wrap: nowrap
  &-item > *
      margin-right: 36px
</style>
