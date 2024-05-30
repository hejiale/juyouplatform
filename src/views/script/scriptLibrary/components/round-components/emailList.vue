<template>
  <div>
    <div>
      <div class="tableBox">
        <yc-table
          :table="table6"
          ref="myTable"
          :isAutoLoad="false"
          :isShowPagination="false"
        >
          <template slot="clueNameList" slot-scope="props">
            <span v-for="(item, index) in props.clueNameList" :key="index"
              >{{ item
              }}<span v-if="index + 1 < props.clueNameList.length"
                >、</span
              ></span
            >
          </template>
          <template slot="action" slot-scope="props">
            <el-button type="text" @click="doEmail(props)" v-if="$powers('/emailInvestigation/updateEmail')">编辑邮件</el-button>
            <el-button type="text" class="reject" @click="doDelete(props.id)" v-if="$powers('/emailInvestigation/deleteEmail')"
              >删除</el-button
            >
          </template>
        </yc-table>
      </div>
      <el-dialog
        width="800px"
        :visible.sync="showTransfer"
        :show-close="false"
        center
        destroy-on-close
        title="配置邮件"
        @close="handleClose"
      >
        <dialogContent
          @on-back="handleClose"
          @on-cancel="handleClose"
          @on-sure="handleSubmit"
        >
          <template slot="content">
            <addEmail
              ref="addEmail"
              :assistantId="assistantId"
              :appId="appId"
              :roundId="roundId"
              @on-complete="onCompleteSave"
            ></addEmail>
          </template>
        </dialogContent>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import dialogContent from '@global/dialog'
import addEmail from './addEmail.vue'
export default {
  components: { dialogContent, addEmail },
  props: {
    assistantId: {
      type: Number,
      default: 0
    },
    roundId: {
      type: Number,
      default: ''
    },
    appId: {
      type: Number,
      default: null
    }
  },
  data(vm) {
    return {
      subLoading: false,
      table6: {
        api: this.$api.emailInvestigationGetEmailList,
        hasKeys: 'roleId',
        showSpan: false,
        hidenTitle: true,
        query:{
          id: null
        },
        columns: [
          {
            title: '发件人名称',
            key: 'senderName'
          },
          {
            title: '发件人头像',
            key: 'senderAvatar',
            isImage: true
          },
          {
            title: '关联线索',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.clueNameList(ctx.row)
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
      rules: {
        audioId: { required: true, message: '请选择音乐', trigger: 'blur' },
        playType: { required: true, message: '请选择播放形式', trigger: 'blur' }
      },
      showTransfer: false
    }
  },
  methods: {
    doAdd(){
      this.showTransfer = true
      this.$nextTick((_) => {
        this.$refs.addEmail.querySelectList()
      })
    },
    handleSubmit() {
      this.subLoading = true
      this.$refs.addEmail.doSubmit()
    },
    async onCompleteSave(isSubmit){
      if(isSubmit){
        await this.queryEmailList()
        this.showTransfer = false
      }
      this.subLoading = false;
    },
    async doEmail(prop) {
      let res1 = await this.$api.emailInvestigationGetEmailDetail({
        id: prop.id
      })
      let res2 = await this.$api.emailInvestigationGetEmailClueDetail({
        id: prop.id
      })
      this.currentStep = 'ONE'
      this.showTransfer = true
      this.$nextTick(async () => {
        await this.$refs.addEmail.querySelectList()
        this.$refs.addEmail.emailId = res1.id
        this.$refs.addEmail.form = res1
        this.$refs.addEmail.$refs.senderAvatar.setFileList(res1.senderAvatar)
        this.$refs.addEmail.loadTableData(res2.emailPrivateItems)
        this.$refs.addEmail.table2.data[0].publicCludIds.push(
          ...res2.publicCludIds
        )
      })
    },
    doDelete(id) {
      this.$confirm(`此操作将删除该线索, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.emailInvestigationDeleteEmail({id})
          this.$message.success('删除成功')
          this.queryEmailList();
        })
        .catch(() => {})
    },
    handleClose() {
      this.showTransfer = false;
    },
    async queryEmailList() {
      this.table6.query.id = this.appId;

      this.$nextTick((_) => {
        if(this.$refs.myTable)this.$refs.myTable.refresh()
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
.evidence
  width: 300px
  .btn
    padding-left: 80px
  /deep/.el-form-item__content
    margin-left: 0 !important
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
.header-title
  font-size: 16px
  font-family: OPPOSans-Regular, OPPOSans
  font-weight: 400
  color: #000000
  line-height: 22px
  .current
    color: #3662EC
</style>
