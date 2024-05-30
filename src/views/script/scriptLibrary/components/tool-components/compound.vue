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
          <el-button type="primary" @click="dialogVisible = true" v-if="$powers('/murderMysteryTool/addToolForRoll')"
            >新增合成工具</el-button
          >
        </div>
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doEdit(props)" v-if="$powers('/murderMysteryTool/updateToolForRoll')">编辑</el-button>
        <el-button type="text" class="reject" @click="doDel(props.id)" v-if="$powers('/murderMysteryTool/deleteToolForRoll')"
          >删除</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      :title="form.id ? '编辑合成工具':'新增合成工具'"
      :visible.sync="dialogVisible"
      class="role-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="600px"
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
            label-position="right"
            label-width="80px"
            class="user-form"
            style="padding: 0 50px"
            center
          >
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入"
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <tinymce ref="editor" v-model="form.content" />
            </el-form-item>
            <div>随机过程显示（请上传GIF图片）</div>
            <el-form-item label="文案">
              <el-input
                v-model="form.processContent"
                :rows="5"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item label="配图">
              <yc-image-uploader
                ref="processUrl"
                v-model="form.processUrl"
                showTips
              ></yc-image-uploader>
            </el-form-item>
            <div>成功时显示（概率失败时的显示）</div>
            <el-form-item label="文案">
              <el-input
                v-model="form.successContent"
                :rows="5"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item label="配图">
              <yc-image-uploader
                ref="successUrl"
                v-model="form.successUrl"
                showTips
              ></yc-image-uploader>
            </el-form-item>
            <div>失败时显示（概率失败时的显示）</div>
            <el-form-item label="文案">
              <el-input
                v-model="form.failContent"
                :rows="5"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item label="配图">
              <yc-image-uploader
                ref="failUrl"
                v-model="form.failUrl"
                showTips
              ></yc-image-uploader>
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
import dialogContent from '@global/dialog'
import tinymce from '@partial/tinymce'
const FORM = {
  title: '',
  content: '',
  processContent: '',
  processUrl: '',
  successContent: '',
  successUrl: '',
  failContent: '',
  failUrl: ''
}
export default {
  components: {
    dialogContent,
    tinymce
  },
  data(vm) {
    return {
      table: {
        customTopTitle: true,
        api: this.$api.murderMysteryToolToolForRollList,
        query: {
          dramaId: this.$route.query.id
        },
        searchData: [],
        columns: [
          {
            title: '标题',
            key: 'title',
            showTooltip: true,
            align: 'left'
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
        content: {
          required: true,
          message: '请输入内容',
          trigger: 'blur'
        }
      },
      dialogVisible: false,
      subLoading: false,
      topTitle: '工具里添加合成功能，由主持人控制成功概率，由玩家点开始触发'
    }
  },
  methods: {
    refresh(){
      this.$refs.myTable.refresh();
    },
    doEdit(prop) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['processUrl'].setFileList(prop.processUrl)
        this.$refs['successUrl'].setFileList(prop.successUrl)
        this.$refs['failUrl'].setFileList(prop.failUrl)
      })
      this.form = prop
    },
    doDel(id) {
      this.$confirm(`此操作将删除该线索, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.murderMysteryToolDeleteToolForRoll({
            rollId: id
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
          if (this.form.id) {
            await this.$api.murderMysteryToolUpdateToolForRoll({
              ...this.form,
              dramaId: this.$route.query.id
            })
          } else {
            await this.$api.murderMysteryToolAddToolForRoll({
              ...this.form,
              dramaId: this.$route.query.id
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
      this.$nextTick(() => {
        this.$refs['processUrl'].setFileList()
        this.$refs['successUrl'].setFileList()
        this.$refs['failUrl'].setFileList()
      })
    }
  }
}
</script>

<style>
.v-modal {
  z-index: 999 !important;
}
.el-dialog__wrapper {
  z-index: 1000 !important;
}
</style>
