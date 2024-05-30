<template>
  <div>
    <div class="titleBox">
      <span style="font-size: 10px; color: #e6e6e6; padding: 20px"
        >添加此回合可进行操作的线索</span
      >
      <span style="font-size: 14px; padding-left: 20px"
        >回合名称：{{ roundName }}</span
      >
    </div>
    <div class="tableBox">
      <div class="tableBox-title">发线索</div>
      <div class="tableBox-tabBox">
        <yc-tab v-model="activeName" backBtnText="btn-slot">
          <yc-tab-item
            :label="item.label"
            :value="item.value"
            v-for="item in $enums.DistributeType.list"
            :key="item.value"
          >
          </yc-tab-item>
        </yc-tab>
        <div
          class="tableBox-tabBox-addBox"
          v-if="(activeName === 'PUBLIC' || activeName === 'DM') && $powers('/murderMysteryRoundClue/addMurderMysteryRoundClue')"
          @click="doManageOther"
        >
          新增
        </div>
        <div
          class="tableBox-tabBox-addBox"
          v-else-if="activeName === 'AUDIO' && $powers('/murderMysteryRoundAudio/addMurderMysteryRoundAudio')"
          @click="showAudioModal = true"
        >
          新增
        </div>
      </div>
      <span class="tableBox-note" v-if="activeName === 'PLAYER'"
        >回合开始时，将自动发线索给到玩家</span
      >
      <span class="tableBox-note" v-if="activeName === 'PUBLIC'"
        >回合开始时，将自动公开线索</span
      >
      <span class="tableBox-note" v-if="activeName === 'PRESENTER'"
        >回合开始时，主持人可以开始操作以下线索</span
      >
      <span class="tableBox-note" v-if="activeName === 'AUDIO'"
        >配置本回合将使用到的音乐</span
      >
      <yc-table
        :table="table"
        ref="myTable"
        :isAutoLoad="false"
        :isShowPagination="false"
        v-if="activeName === 'PLAYER'"
      >
        <template slot="thisRoundClue" slot-scope="props">
          <!-- <el-link type="success" @click="onShowClueList(props)">{{
            clueItemName(props.thisRoundClue)
          }}</el-link> -->
          <span v-for="(item, index) in props.thisRoundClue" :key="index"
            >{{ item.clueName
            }}<span v-if="index + 1 < props.thisRoundClue.length"
              >、</span
            ></span
          >
        </template>
        <template slot="action" slot-scope="props" v-if="!disabled">
          <el-button type="text" @click="doManage(props)" v-if="$powers('/murderMysteryRoundClue/addMurderMysteryRoundClue')">线索管理</el-button>
        </template>
      </yc-table>
      <yc-table
        :table="table3"
        ref="myTable"
        :isAutoLoad="false"
        :isShowPagination="false"
        v-else-if="activeName === 'AUDIO'"
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
        <template slot="action" slot-scope="props" v-if="!disabled">
          <el-button type="text" @click="doManageAudio(props)" v-if="$powers('/murderMysteryRoundAudio/updateMurderMysteryRoundAudio')">编辑</el-button>
          <el-button type="text" class="reject" @click="doDelete(props.id)" v-if="$powers('/murderMysteryRoundAudio/deleteMurderMysteryRoundAudio')"
            >删除</el-button
          >
        </template>
      </yc-table>
      <yc-table
        :table="table2"
        ref="myTable"
        :isAutoLoad="false"
        :isShowPagination="false"
        v-else
      >
        <template slot="action" slot-scope="props" v-if="!disabled">
          <el-button
            type="text"
            class="del"
            style="color: red !important"
            @click="doDelete(props.id)"
            >删除</el-button
          >
        </template>
      </yc-table>
    </div>
    <el-dialog
      title="线索管理"
      width="800px"
      :visible.sync="showTransfer"
      :show-close="false"
      center
      destroy-on-close
      :close-on-click-modal="false"
    >
      <dialogContent
        :isLoading="subLoading"
        @on-back="handleClose"
        @on-cancel="handleClose"
        @on-sure="doSubmit"
      >
        <template slot="content">
          <transfer
            ref="transfer"
            :assistantId="assistantId"
            :roleId="roleId"
            :roundId="roundId"
            :distributeType="activeName"
            @on-success-save="onSuccessTransfer"
            @on-close-transfer="onCloseTransfer"
          ></transfer>
        </template>
      </dialogContent>
    </el-dialog>
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
    <el-dialog
      title=""
      width="1000px"
      :visible.sync="showClueList"
      center
      destroy-on-close
      :close-on-click-modal="false"
    >
      <clueList :subRound="updateSubRound" ref="clueList"></clueList>
    </el-dialog>
  </div>
</template>
<script>
import dialogContent from '@global/dialog'
import transfer from './transfer.vue'
import clueList from './clueList.vue'
export default {
  name: 'edit-round',
  components: { dialogContent, transfer, clueList },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    assistantId: {
      type: Number,
      default: 0
    },
    roundId: {
      type: Number,
      default: ''
    },
    roundName: {
      type: String,
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
        hasKeys: 'roleId',
        showSpan: false,
        hidenTitle: true,
        columns: [
          {
            title: '角色',
            key: 'roleName'
          },
          {
            title: '线索',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.thisRoundClue(ctx.row)
              )
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
      table2: {
        hasKeys: 'id',
        showSpan: false,
        hidenTitle: true,
        columns: [
          {
            title: '线索名称',
            key: 'clueName'
          },
          {
            title: '图标',
            key: 'clueIcon',
            isImage: true
          },
          {
            title: '类型',
            key: 'clueType',
            enumType: 'ClueType'
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
      table3: {
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
      showTransfer: false,
      showAudioModal: false,
      showClueList: false,
      updateSubRound: null,
      activeName: 'PLAYER',
      roleId: null,
      canSubmit: false
    }
  },
  computed: {
    clueItemName() {
      return function (list) {
        if (!list) return ''
        let name = []
        list.map((it) => {
          if (it.clueId) {
            name.push(`${it.clueName}`)
          }
        })
        return name.join('、')
      }
    }
  },
  watch: {
    activeName() {
      this.querySubClueList()
    }
  },
  created() {
    this.queryAudioList()
    this.querySubClueList()
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
        await this.querySubClueList()
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
          if (this.activeName == 'AUDIO') {
            await this.$api.murderMysteryRoundAudioDeleteMurderMysteryRoundAudio(
              {
                id
              }
            )
          } else {
            await this.$api.murderMysteryRoundClueDeleteMurderMysteryRoundClue({
              id
            })
          }
          this.$message.success('删除成功')
          this.querySubClueList()
        })
        .catch(() => {})
    },
    onSuccessAdd() {
      this.dialogVisible = false
      this.$search(this.table)
    },
    onCloseAdd() {
      this.dialogVisible = false
      this.updateSubRound = null
    },
    onCloseTransfer() {
      this.subLoading = false
      this.showTransfer = false
      this.updateSubRound = null
    },
    doManage(item) {
      this.roleId = item.roleId
      this.showTransfer = true
      this.updateSubRound = item
      this.$nextTick((_) => {
        this.$refs.transfer.getTransferData(true)
      })
    },
    doManageOther() {
      this.showTransfer = true
      this.$nextTick((_) => {
        this.$refs.transfer.getTransferData(false)
      })
    },
    doManageAudio(props) {
      this.form = props
      this.showAudioModal = true
    },
    doSubmit() {
      this.subLoading = true
      this.$refs.transfer.doSubmitAdd()
    },
    handleClose() {
      this.$refs.transfer.doCancel()
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
            that.querySubClueList()
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
      // this.$refs.form.resetFields()
      this.form = {
        audioId: null,
        playType: null
      }
      this.showAudioModal = false
    },
    //刷新数据
    queryInfo() {
      this.activeName = 'PLAYER'
      this.querySubClueList()
    },
    onSuccessTransfer() {
      this.subLoading = false
      this.showTransfer = false
      this.querySubClueList()
    },
    onShowClueList(props) {
      this.showClueList = true
      this.$nextTick((_) => {
        this.$refs.clueList.refresh(props.thisRoundClue)
      })
    },
    async querySubClueList() {
      try {
        if (this.activeName === 'AUDIO') {
          let data =
            await this.$api.murderMysteryRoundAudioQueryMurderMysteryRoundAudioList(
              {
                dramaId: this.$route.query.id,
                roundId: this.roundId
              }
            )
          this.table3.data = data
        } else {
          let data =
            await this.$api.murderMysteryRoundClueQueryMurderMysteryRoundClueTable(
              {
                dramaId: this.$route.query.id,
                roundId: this.roundId,
                distributeType: this.activeName
              }
            )
          if (this.activeName === 'PLAYER') {
            this.table.data = data.roleRoundClue
          } else {
            this.table2.data = data.thisRoundClue
          }
        }
        //手动刷新
        this.$nextTick((_) => {
          if(this.$refs.myTable)this.$refs.myTable.update()
        })
      } catch (e) {}
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
