<template>
  <div>
    <yc-table :table="table" ref="myTable" :isAutoLoad="false">
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd" v-if="$powers('/murderMysteryClue/addMurderMysteryClue')">新增线索</el-button>
        </div>
      </template>
      <template slot="user" slot-scope="props">
        {{ playerStatus(props) }}
      </template>
      <template slot="dm" slot-scope="props">
        {{ dmStatus(props) }}
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doEdit(props)" v-if="$powers('/murderMysteryClue/updateMurderMysteryClue')">编辑</el-button>
        <el-button type="text" class="reject" @click="doDelete(props.id)" v-if="$powers('/murderMysteryClue/deleteMurderMysteryClue')"
          >删除</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      :title="form.id ? '编辑线索' : '新增线索'"
      :visible.sync="clueDialogVisible"
      class="role-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="900px"
      center
      destroy-on-close
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
            label-width="140px"
            class="user-form"
            style="padding: 0 50px"
            center
          >
            <el-form-item label="线索类型：" prop="clueType">
              <el-select
                v-model="form.clueType"
                placeholder="请选择线索类型"
                :disabled="form.id ? true : false"
              >
                <el-option
                  v-for="i in $enums.ClueType.list"
                  :label="i.label"
                  :value="i.value"
                  :key="i.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="线索名称：" prop="clueName">
              <el-input
                v-model="form.clueName"
                placeholder="请填写线索名称"
                maxlength="10"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="线索背面：" prop="clueIcon">
              <yc-image-uploader
                ref="clue-icon"
                v-model="form.clueIcon"
                showTips
              ></yc-image-uploader>
            </el-form-item>
            <el-form-item
              label="线索详情文字："
              prop="contentTextClue"
              v-if="form.clueType === 'TEXT'"
            >
              <tinymce ref="editor" v-model="form.contentTextClue"/>
            </el-form-item>
            <el-form-item
              label="线索正面"
              prop="contentClueFileUrl"
              tips="只能上传jpg/png/jpeg文件, 图片最大尺寸宽：1080 且不超过2M"
              v-if="form.clueType === 'IMAGE'"
            >
              <yc-image-uploader
                ref="clueDetail-cover"
                v-model="form.contentClueFileUrl"
                :maxSize="1"
              ></yc-image-uploader>
            </el-form-item>
            <el-form-item
              label="视频"
              prop="contentClue"
              v-if="form.clueType === 'VIDEO'"
            >
              <file-upload
                v-model="videoList"
                :multiple="false"
                :verifyChinese="true"
                @uploaded="onCompleteUpload"
                @remove="onRemoveFile"
                accept=".mp4"
                v-if="form.clueType === 'VIDEO'"
              ></file-upload>
            </el-form-item>
            <el-form-item
              label="音频"
              prop="contentClue"
              v-if="form.clueType === 'AUDIO'"
            >
              <file-upload
                v-model="videoList"
                :multiple="false"
                :verifyChinese="true"
                @uploaded="onCompleteUpload"
                @remove="onRemoveFile"
                accept=".mp3,.wav"
                v-if="form.clueType === 'AUDIO'"
              ></file-upload>
            </el-form-item>
            <el-form-item label="玩家可操作：">
              <yc-checkbox-button
                :list="listRole"
                :value.sync="valueRole"
              ></yc-checkbox-button>
            </el-form-item>
            <el-form-item label="主持人可操作：">
              <yc-checkbox-button
                :list="listDM"
                :value.sync="valueDM"
              ></yc-checkbox-button>
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
import fileUpload from '@partial/file-upload'
const FORM = {
  clueType: 'IMAGE',
  roleSex: 'MALE',
  clueIcon: null,
  contentTextClue: null
}

export default {
  components: {
    dialogContent,
    tinymce,
    fileUpload
  },
  data(vm) {
    const validateAudio = (rule, value, callback) => {
      if (!this.videoList.length && this.form.clueType === 'AUDIO') {
        callback(new Error('请上传音频'))
      }
      if (!this.videoList.length && this.form.clueType === 'VIDEO') {
        callback(new Error('请上传视频'))
      }
      //  else if (!this.form.contentClue && this.form.clueType === 'IMAGE') {
      //   callback(new Error('请上传详情'))
      // }
      callback()
    }
    return {
      table: {
        api: this.$api.murderMysteryClueQueryMurderMysteryCluePage,
        query: {
          dramaId: this.$route.query.id
        },
        searchData: [
          {
            title: '线索名称',
            type: 'input',
            model: 'clueName',
            placeholder: '请输入'
          },
          {
            title: '线索类型',
            type: 'select',
            model: 'clueType',
            enumType: 'ClueType',
            placeholder: '请选择'
          },
          {
            title: '关联回合',
            type: 'select',
            model: 'roundId',
            placeholder: '请选择',
            option: []
          }
        ],
        columns: [
          {
            title: '线索名称',
            key: 'clueName'
          },
          {
            title: '线索背面',
            key: 'clueIcon',
            isImage: true
          },
          {
            title: '线索类型',
            key: 'clueType',
            enumType: 'ClueType'
          },
          {
            title: '玩家可执行操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.user(ctx.row))
            }
          },
          {
            title: '主持人可执行操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.dm(ctx.row))
            }
          },
          {
            title: '关联回合',
            key: 'roundName'
          },
          {
            title: '操作',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      videoList: [],
      subLoading: false,
      isCompleteUpload: false,
      clueDialogVisible: false,
      title: '新增线索',
      form: this.$_.cloneDeep(FORM),
      listRole: [
        {
          id: 1,
          label: '公开'
        },
        {
          id: 2,
          label: '转让'
        }
      ],
      valueRole: [1],
      listDM: [
        {
          id: 1,
          label: '公开'
        },
        {
          id: 2,
          label: '私发'
        },
        {
          id: 3,
          label: '收回'
        }
      ],
      valueDM: [1, 2, 3],
      rules: {
        clueType: {
          required: true,
          message: '请选择线索类型',
          trigger: 'blur'
        },
        clueName: {
          required: true,
          message: '请填写线索名称',
          trigger: 'change'
        },
        clueIcon: {
          required: true,
          message: '请上传线索背面图片',
          trigger: 'change'
        },
        contentClueFileUrl: {
          required: true,
          message: '请上传线索正面图片',
          trigger: 'change'
        },
        contentTextClue: {
          required: true,
          message: '请填写线索详情文字',
          trigger: 'blur'
        },
        contentTextClue: {
          required: true,
          message: '请上传线索图片',
          trigger: 'blur'
        },
        contentClue: {
          required: true,
          trigger: 'change',
          validator: validateAudio
        }
      }
    }
  },
  created() {
    this.initTheme()
  },
  computed: {
    playerStatus() {
      return function (props) {
        let arr = []
        if (props.isPlayerPublic) {
          arr.push('公开')
        }
        if (props.isPlayerTransfer) {
          arr.push('转让')
        }
        if (arr.length) {
          return arr.join('、')
        } else {
          return '—'
        }
      }
    },
    dmStatus() {
      return function (props) {
        let arr = []
        if (props.isDmPublic) {
          arr.push('公开')
        }
        if (props.isDmDistribute) {
          arr.push('私发')
        }
        if (props.isDmRecall) {
          arr.push('收回')
        }
        if (arr.length) {
          return arr.join('、')
        } else {
          return '—'
        }
      }
    }
  },
  methods: {
    refresh(){
      this.$refs.myTable.refresh();
    },
    async initTheme() {
      let res = await this.$api.murderMysteryRoundQueryMurderMysteryRoundList({
        id: this.$route.query.id
      })
      this.table.searchData[2].option = res.map((m) => {
        return {
          label: m.roundName,
          value: m.roundId
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
    doAdd() {
      this.form = {
        clueType: 'IMAGE',
        roleSex: 'MALE',
        clueIcon: null,
        contentTextClue: null
      }
      this.clueDialogVisible = true
      this.$nextTick(_=>{
        this.$refs.form.clearValidate();
      })
    },
    doEdit(props) {
      this.valueRole = []
      this.valueDM = []
      this.form = this.$_.cloneDeep(props)
      if (this.form.isPlayerPublic) this.valueRole.push(1)
      if (this.form.isPlayerTransfer) this.valueRole.push(2)
      if (this.form.isDmPublic) this.valueDM.push(1)
      if (this.form.isDmDistribute) this.valueDM.push(2)
      if (this.form.isDmRecall) this.valueDM.push(3)
      let url = null
      let name = null
      if (this.form.contentClueFileUrl) {
        url = this.form.contentClueFileUrl
        name = this.form.contentClueFileUrl.split('/').pop()
      }
      this.videoList = []
      this.videoList.push({ url, name })
      this.clueDialogVisible = true
      this.$nextTick(() => {
        this.$refs['clue-icon'].setFileList(props.clueIcon)
        if (props.clueType == 'IMAGE') {
          this.$refs['clueDetail-cover'].setFileList(props.contentClueFileUrl)
        }
      })
    },
    doDelete(id) {
      this.$confirm(`此操作将删除该线索, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.murderMysteryClueDeleteMurderMysteryClue({
            id
          })
          this.$message({
            type: 'success',
            message: `删除成功!`
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
    handleClose() {
      this.clearAll()
    },
    clearAll() {
      if (this.form.clueType == 'IMAGE') {
        this.$refs['clueDetail-cover'].setFileList()
      }
      this.videoList = []
      this.$refs['clue-icon'].setFileList()
      this.$refs.form.resetFields()
      this.valueRole = [1]
      this.valueDM = [1, 2, 3]
      this.clueDialogVisible = false
    },
    doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if(this.subLoading)return;
        this.subLoading = true

        try {
          console.log(this.valueRole, this.valueDM)
          if (this.valueRole.indexOf(1) != -1)
            this.form['isPlayerPublic'] = true
          else this.form['isPlayerPublic'] = false
          if (this.valueRole.indexOf(2) != -1)
            this.form['isPlayerTransfer'] = true
          else this.form['isPlayerTransfer'] = false

          if (this.valueDM.indexOf(1) != -1) this.form['isDmPublic'] = true
          else this.form['isDmPublic'] = false
          if (this.valueDM.indexOf(2) != -1) this.form['isDmDistribute'] = true
          else this.form['isDmDistribute'] = false
          if (this.valueDM.indexOf(3) != -1) this.form['isDmRecall'] = true
          else this.form['isDmRecall'] = false
          if (this.form.clueType == 'AUDIO' || this.form.clueType == 'VIDEO') {
            console.log(this.videoList)
            this.form.contentClueFileUrl = this.videoList[0].url
          }
          let api = null
          if (this.form.id) api = 'murderMysteryClueUpdateMurderMysteryClue'
          else api = 'murderMysteryClueAddMurderMysteryClue'
          await this.$api[api]({
            ...this.form,
            dramaId: this.$route.query.id
          })
          this.clearAll();

          this.$message.success('操作成功')
          this.subLoading = false
          await this.$refs.myTable.refresh()
        } catch (e) {
          this.subLoading = false
        }
      })
    }
  }
}
</script>

<style scoped></style>
