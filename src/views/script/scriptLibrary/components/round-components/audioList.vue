<template>
  <div>
    <div class="tableBox">
      <yc-table
        :table="table"
        ref="myTable"
        :isAutoLoad="false"
        :isShowPagination="false"
      >
        <template slot="isAutoPlay" slot-scope="props">
          <div v-if="$powers('/murderMysteryRoundAudio/roundAudioAutoPlay')">
            <div
              class="isAutoPlay-select"
              v-if="props.isAutoPlay"
              @click="audioSelect(props)"
            >
              <div></div>
            </div>
            <div
              class="isAutoPlay-unSelect"
              v-else
              @click="audioSelect(props)"
            ></div>
          </div>
        </template>
        <template slot="action" slot-scope="props">
          <el-button type="text" @click="doManageAudio(props)" v-if="$powers('/murderMysteryRoundAudio/updateMurderMysteryRoundAudio')">编辑</el-button>
          <el-button type="text" class="reject" @click="doDelete(props.id)" v-if="$powers('/murderMysteryRoundAudio/deleteMurderMysteryRoundAudio')"
            >删除</el-button
          >
        </template>
      </yc-table>
    </div>
    <el-dialog
      title="添加音乐"
      width="500px"
      :visible.sync="showAudioModal"
      :show-close="false"
      center
      destroy-on-close
      :close-on-click-modal="false"
    >
      <dialogContent
        :isLoading="subLoading"
        @on-back="handleCloseAudio"
        @on-cancel="handleCloseAudio"
        @on-sure="doSubmitAudio"
        authCode="/murderMysteryRoundAudio/addMurderMysteryRoundAudio"
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
            <el-form-item label="音乐名称：" prop="audioId">
              <el-select v-model="form.audioId" placeholder="请选择线索类型">
                <el-option
                  v-for="i in audioList"
                  :label="i.audioName"
                  :value="i.audioId"
                  :key="i.audioId"
                  :disabled="i.disable"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="线索类型：" prop="playType">
              <el-select v-model="form.playType" placeholder="请选择线索类型">
                <el-option
                  v-for="i in $enums.PlayType.list"
                  :label="i.label"
                  :value="i.value"
                  :key="i.value"
                />
              </el-select>
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
  name: 'edit-round',
  components: { dialogContent },
  props: {
    assistantId: {
      type: Number,
      default: 0
    },
    roundId: {
      type: Number,
      default: ''
    }
  },
  data(vm) {
    return {
      form: {
        audioId: null,
        playType: null
      },
      subLoading: false,
      table: {
        hasKeys: 'id',
        showSpan: false,
        hidenTitle: true,
        columns: [
          {
            title: '自动播放',
            align: "left",
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.isAutoPlay(ctx.row))
            }
          },
          {
            title: '音乐名称',
            key: 'audioName'
          },
          {
            title: '播放形式',
            key: 'playType',
            enumType: 'PlayType'
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
      rules: {
        audioId: { required: true, message: '请选择音乐', trigger: 'blur' },
        playType: { required: true, message: '请选择播放形式', trigger: 'blur' }
      },
      audioList: [],
      showAudioModal: false,
      canSubmit: false
    }
  },
  methods: {
    async audioSelect(props) {
      if(this.canSubmit)return;
      this.canSubmit = true;

      try{
        await this.$api.roundAudioAutoPlay({
          id: props.id,
          isAutoPlay: !props.isAutoPlay
        })
        await this.queryClueAudioList()
        this.canSubmit = false;
      }catch(e){
        this.canSubmit = false;
      }
    },
    doDelete(id) {
      this.$confirm(`此操作将删除该线索, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.murderMysteryRoundAudioDeleteMurderMysteryRoundAudio({id})
          
          this.$message.success('删除成功')
          this.queryClueAudioList()
        })
        .catch(() => {})
    },
    doManageAudio(props) {
      if(props){
        this.form = props
      }
      this.queryAudioList();
      this.showAudioModal = true
    },
    /**
     * 新增 更新角色
     */
    doSubmitAudio() {
      let that = this
      if (this.subLoading) return

      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if(this.subLoading)return;
        this.subLoading = true

        this.form['dramaId'] = this.$route.query.id
        this.form['roundId'] = this.roundId

        try {
          if (this.form.id) {
            await this.$api.murderMysteryRoundAudioUpdateMurderMysteryRoundAudio(
              this.form
            )
          } else {
            await this.$api.murderMysteryRoundAudioAddMurderMysteryRoundAudio(
              this.form
            )
          }

          this.$message.success(`${this.form.id ? '更新' : '新增'}成功`)
          this.$refs.form.resetFields()
          this.form = {
            audioId: null,
            playType: null
          }
          setTimeout(() => {
            that.subLoading = false
            that.showAudioModal = false
            that.queryClueAudioList()
          }, 1000)
        } catch (e) {
          this.form = {
            audioId: null,
            playType: null
          }
          this.subLoading = false
          this.showAudioModal = false
        }
      })
    },
    handleCloseAudio() {
      this.form = {
        audioId: null,
        playType: null
      }
      this.showAudioModal = false
    },
    async queryClueAudioList(){
      let data = await this.$api.murderMysteryRoundAudioQueryMurderMysteryRoundAudioList(
          {
            dramaId: this.$route.query.id,
            roundId: this.roundId
          }
        )
      this.table.data = data
      this.$nextTick((_) => {
        this.$refs.myTable.update()
      })
    },
    async queryAudioList() {
      this.audioList =
        await this.$api.murderMysteryAudioQueryMurderMysteryAudioList({
          id: this.$route.query.id,
          roundId: this.roundId
        })
    }
  }
}
</script>
<style>
.yc-tab__header {
  margin-bottom: 0px !important;
}
</style>
<style lang="sass" scoped>
.titleBox
  background: #fff
  @include ver
  border-radius: 6px
  padding-bottom: 20px

.tableBox
  margin-top: 20px
  background: #fff
  &-title
    font-size: 15px
    padding-top: 20px
    margin-left: 20px
    position: relative
    @include hor
    align-items: center
    &:before
      width: 4px
      height: 17px
      background: $orange
      content: ''
      display: block
      margin-right: 5px
      border-radius: 4px
  &-note
    font-size: 12px
    color: #999
    margin-left: 20px
  &-tabBox
    @include hor-between-center
    &-addBox
      width: 100px
      height: 44px
      line-height: 44px
      background: $orange
      color: #fff
      font-size: 15px
      border-radius: 8px
      text-align: center
      margin-right: 20px
      cursor: pointer

.isAutoPlay-select
  width: 16px
  height: 16px
  border-radius: 50%
  border: solid #0256FF 1px
  position: relative
  cursor: pointer
  div
    width: 8px
    height: 8px
    border-radius: 50%
    background-color: #0256FF
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%,-50%)
.isAutoPlay-unSelect
  width: 16px
  height: 16px
  border-radius: 50%
  border: solid #000000 1px
  cursor: pointer
.apBox
  background: #fff
  margin-top: 20px
  border-radius: 6px

  &-infoBox
    width: 100%
    &-numBox
      display: inline-block
      margin: 0px 0px 20px 20px

.clearfix
  padding-left: 10px
  height: 60px
  @include hor-between-center

  .text
    font-size: $font-large
    font-weight: bold
    padding-left: 12px
    position: relative
    &:before
      content: ''
      display: block
      width: 4px
      height: 18px
      background-color: $primaryColor
      position: absolute
      left: 0
      top: 3px
      border-radius: 20px
</style>
