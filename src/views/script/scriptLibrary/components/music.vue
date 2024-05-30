<template>
  <div>
    <yc-table :table="table" ref="myTable" :isAutoLoad="false">
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd" v-if="$powers('/murderMysteryAudio/addMurderMysteryAudio')">新增音乐</el-button>
        </div>
      </template>
      <template slot="roundName" slot-scope="props">
        {{roundName(props.roundItems)}}
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doPlay(props)">播放</el-button>
        <el-button type="text" @click="doEdit(props)" v-if="$powers('/murderMysteryAudio/updateMurderMysteryAudio')">编辑</el-button>
        <el-button type="text" class="reject" @click="doDetail(props.id)" v-if="$powers('/murderMysteryAudio/deleteMurderMysteryAudio')"
          >删除</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      :title="title"
      :visible.sync="audioDialogVisible"
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
            label-position="left"
            label-width="100px"
            class="user-form"
            style="padding: 0 50px"
            center
          >
            <el-form-item label="音频名称：" prop="audioName">
              <el-input
                v-model="form.audioName"
                placeholder="请填写名称"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="音频文件" prop="audioAddress">
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
    <aPlayer :music="audioUrl" fixed ref="aPlayer" />
  </div>
</template>

<script>
import aPlayer from 'vue-aplayer'
import dialogContent from '@global/dialog'
import fileUpload from '@partial/file-upload'
const FORM = {
  audioAddress: null,
  audioFileName: null,
  audioName: null
}

export default {
  components: {
    aPlayer,
    dialogContent,
    fileUpload
  },
  data(vm) {
    var validateMusic = (rule, value, callback) => {
      if (this.videoList.length) {
        callback()
      } else {
        callback(new Error('请上传音频'))
      }
    }
    return {
      table: {
        api: this.$api.murderMysteryAudioQueryMurderMysteryAudioPage,
        pagination: false,
        query: {
          dramaId: this.$route.query.id
        },
        searchData: [
          {
            title: '音乐名称',
            type: 'input',
            model: 'audioName',
            placeholder: '请输入'
          },
          {
            title: '关联回合',
            type: 'select',
            model: 'roundId',
            placeholder: '请输入'
          }
        ],
        columns: [
          {
            title: '音乐名称',
            key: 'audioName'
          },
          {
            title: '关联回合',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.roundName(ctx.row))
            }
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
      audioDialogVisible: false,
      audioUrl: {
        title: '歌曲名称',
        artist: '未知',
        url: '暂无',
        pic: '封面图片URL',
        lrc: ''
      },
      title: '新增线索',
      form: this.$_.cloneDeep(FORM),
      rules: {
        audioName: {
          required: true,
          message: '请填写音频名称',
          trigger: 'change'
        },
        audioAddress: {
          required: true,
          validator: validateMusic,
          trigger: 'change'
        }
      }
    }
  },
  computed:{
    roundName(){
      return function(roundItems){
        if(!roundItems)return '';
        let arr = [];
        roundItems.map(it=>{
          arr.push(it.roundName)
        })
        return arr.join(',')
      }
    }
  },
  created() {
    this.initTheme()
  },
  methods: {
    refresh(){
      this.$refs.myTable.refresh();
    },
    async initTheme() {
      let res = await this.$api.murderMysteryRoundQueryMurderMysteryRoundList({
        id: this.$route.query.id
      })
      this.table.searchData[1].option = res.map((m) => {
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
      this.form = this.$_.cloneDeep(FORM)
      this.audioDialogVisible = true
    },
    doPlay(props) {
      this.$refs.aPlayer.currentMusic = {
        title: props.audioFileName,
        artist: '未知',
        url: props.audioAddress,
        pic: '封面图片URL',
        lrc: ''
      }
    },
    doEdit(props) {
      this.form = this.$_.cloneDeep(props)
      let url = this.form.audioAddress
      let name = this.form.audioAddress.split('/').pop()
      this.videoList = []
      this.videoList.push({ url, name })
      this.audioDialogVisible = true
    },
    doDetail(id) {
      this.$confirm(`此操作将删除该音频, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.murderMysteryAudioDeleteMurderMysteryAudio({
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
      this.audioDialogVisible = false
      this.$refs.form.resetFields()
      this.videoList = []
    },
    doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if(this.subLoading)return;
        this.subLoading = true
        
        try {
          this.form.audioAddress = this.videoList[0].url
          this.form.audioFileName = this.videoList[0].name
          let api = null
          if (this.form.id) api = 'murderMysteryAudioUpdateMurderMysteryAudio'
          else api = 'murderMysteryAudioAddMurderMysteryAudio'
          await this.$api[api]({
            ...this.form,
            dramaId: this.$route.query.id
          })
          this.videoList = []
          this.$refs.form.resetFields()
          this.audioDialogVisible = false
          await this.$refs.myTable.refresh()
          this.subLoading = false
          this.$message.success('操作成功')
        } catch (e) {
          this.subLoading = false
        } 
      })
    }
  }
}
</script>

<style scoped></style>
