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
          <el-button type="primary" @click="onAdd" v-if="$powers('/murderMysteryTool/addToolForPhone')"
            >新增来电工具</el-button
          >
        </div>
      </template>
      <template slot="matrix" slot-scope="props">
        {{ props.jigsawRow + '×' + props.jigsawColumn }}
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doEdit(props)" v-if="$powers('/murderMysteryTool/updateToolForPhone')">编辑</el-button>
        <el-button type="text" class="reject" @click="doDel(props.id)" v-if="$powers('/murderMysteryTool/deleteToolForQuestion')"
          >删除</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      :title="form.id ? '编辑来电工具':'新增来电工具'"
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
            label-width="180px"
            class="user-form"
            style="padding: 0 50px"
            center
          >
            <el-form-item label="题目（仅DM可见）" prop="trueName">
              <el-input
                v-model="form.trueName"
                placeholder="请输入"
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="发送名称" prop="nickName">
              <el-input
                v-model="form.nickName"
                placeholder="请输入"
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="发送人头像" prop="avatar">
              <yc-image-uploader
                ref="avatar"
                v-model="form.avatar"
                showTips
              ></yc-image-uploader>
            </el-form-item>
            <el-form-item label="接收人" prop="roleId">
              <el-select v-model="form.roleId" placeholder="请选择">
                <el-option
                  v-for="i in option"
                  :label="i.roleName"
                  :value="i.id"
                  :key="i.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="来电录音" prop="url">
              <file-upload
                v-model="videoList"
                :multiple="false"
                :verifyChinese="true"
                @uploaded="onCompleteUpload"
                @remove="onRemoveFile"
                accept=".mp3,.wav"
              ></file-upload>
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
import dialogContent from '@global/dialog'
import fileUpload from '@partial/file-upload'
const FORM = {
  trueName: '',
  nickName: '',
  avatar: '',
  roleId: null,
  url: ''
}
export default {
  components: {
    dialogContent,
    fileUpload
  },
  data(vm) {
    var validatorUrl = (rule, value, callback) => {      
      if (this.videoList.length) {
        callback()
      } else {
        callback(new Error('请上传来电录音'))
      }
    }
    return {
      table: {
        customTopTitle: true,
        api: this.$api.murderMysteryToolToolForPhoneList,
        query: {
          dramaId: this.$route.query.id
        },
        searchData: [],
        columns: [
          {
            title: '题目（仅DM可见）',
            key: 'trueName',
            showTooltip: true,
            align: 'left'
          },
          {
            title: '提示文案（接收玩家可见）',
            align: 'left',
            key: 'nickName',
            showTooltip: true
          },
          {
            title: '接收人',
            align: 'left',
            key: 'roleName',
            showTooltip: true
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
        trueName: {
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        nickName: {
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        avatar: {
          required: true,
          message: '请上传',
          trigger: 'change'
        },
        url: {
          required: true,
          validator: validatorUrl,
          trigger: ['change','blur']
        },
        roleId: {
          required: true,
          message: '请选择接收人',
          trigger: 'change'
        }
      },
      option: [],
      videoList: [],
      dialogVisible: false,
      subLoading: false,
      topTitle: '',
      isCompleteUpload: false
    }
  },
  methods: {
    refresh(){
      this.$refs.myTable.refresh();
      this.queryRoleList()
    },
    async queryRoleList() {
      let data = await this.$api.murderMysteryRoleQueryMurderMysteryRole({
        id: this.$route.query.id
      })
      this.option = data
    },
    onAdd(){
      this.videoList = [];
      this.form = {
        trueName: '',
        nickName: '',
        avatar: '',
        roleId: null,
        url: ''
      };
      this.dialogVisible = true;
      this.$nextTick(_=>{
        this.$refs.form.clearValidate()
        this.$refs['avatar'].setFileList()
      })
    },
    doEdit(prop) {
      this.dialogVisible = true
      this.form = prop
      let url = this.form.url
      let name = this.form.url.split('/').pop()
      this.videoList = []
      this.videoList.push({ url, name })
      this.$nextTick(() => {
        this.$refs['avatar'].setFileList(prop.avatar)
      })
    },
    doDel(id) {
      this.$confirm(`此操作将删除该线索, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.murderMysteryToolDeleteToolForPhone({
            phoneId: id
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
          let url = this.videoList[0].url
          if (this.form.id) {
            await this.$api.murderMysteryToolUpdateToolForPhone({
              ...this.form,
              dramaId: this.$route.query.id,
              url
            })
          } else {
            await this.$api.murderMysteryToolAddToolForPhone({
              ...this.form,
              dramaId: this.$route.query.id,
              url
            })
          }
          this.dialogVisible = false
          this.clearData()
          this.$message.success('操作成功')
          this.$refs.myTable.refresh()
          this.subLoading = false
        } catch (e) {
          this.subLoading = false
          console.log(e)
        }
      })
    },
    onCompleteUpload() {
      this.isCompleteUpload = true
    },
    onRemoveFile(val) {
      if (!val.length) {
        this.isCompleteUpload = false
      }
    },
    handleClose() {
      this.clearData()
      this.dialogVisible = false
    },
    clearData() {
      this.form = this.$_.cloneDeep(FORM)
      this.videoList = []
    }
  }
}
</script>
<style lang="sass" scoped></style>
