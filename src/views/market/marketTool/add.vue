<template>
  <div class="container">
    <title-info title="发券" :isShowOther="false" :isShow="false" />
    <div class="container-baseInfoBox">
      <div class="container-baseInfoBox-title">基础信息</div>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-position="left"
        label-width="120px"
        class="container-baseInfoBox-form"
      >
        <el-form-item label="活动名称" prop="activityName">
          <el-input
            v-model="form.activityName"
            show-word-limit
            :maxlength="100"
            style="width: 300px"
            placeholder="请输入活动名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model="form.remark"
            show-word-limit
            :maxlength="100"
            :rows="4"
            style="width: 300px"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
        <el-form-item label="发放用户" prop="couponTargetType">
          <div class="container-baseInfoBox-form-item">
            <el-select v-model="form.couponTargetType">
              <el-option
                v-for="i in [{ label: '店家', value: 'STORE' }]"
                :label="i.label"
                :value="i.value"
                :key="i.value"
              />
            </el-select>
            <el-radio v-model="form.isAll" label="0" class="ml10">全部</el-radio>
            <el-radio v-model="form.isAll" label="1">自选</el-radio>
            <div v-if="form.isAll === '1'">
              <el-button type="primary" size="mini" @click="onSelectStore"
                >点击选择</el-button
              >
              <span style="margin-left: 20px">已选 {{ rightInit.length }}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="选择优惠券：" prop="selectCoupon">
          <div class="container-baseInfoBox-form-item"></div>
          <el-button type="primary" size="mini" @click="onSelectCoupon"
            >点击选择</el-button
          >
        </el-form-item>
      </el-form>
      <yc-table
        :table="couponTable"
        ref="couponTable"
        v-if="selectCouponList.length > 0"
        :isShowPagination="false"
      >
        <template slot="useStartTime" slot-scope="props">
          <el-date-picker
            v-model="props.useStartTime"
            type="date"
            unlink-panels
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 00:00:00"
            style="width: 160px"
            @change="onChangeBeginDate($event, props, true)"
          ></el-date-picker>
        </template>
        <template slot="useEndTime" slot-scope="props">
          <el-date-picker
            v-model="props.useEndTime"
            type="date"
            unlink-panels
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 23:59:59"
            style="width: 160px"
            @change="onChangeEndDate($event, props, true)"
          ></el-date-picker>
        </template>
        <template slot="indate" slot-scope="props">
          <span>{{ indate(props) }}</span>
        </template>
        <template slot="sendNum" slot-scope="props">
          <el-input
            style="width: 150px"
            @input="onInputCouponNum($event, props)"
            v-model="props.sendNum"
          />
        </template>
        <template slot="action" slot-scope="props">
          <el-button type="text" class="reject" @click="onClearCoupon(props.id)"
            >删除</el-button
          >
        </template>
      </yc-table>
      <div class="container-baseInfoBox-bottomBox">
        <div @click="$router.back()">取消</div>
        <div @click="onGoNext" v-loading="subLoading" v-if="$powers('/couponActivity/addCouponMarketActivity')">发放</div>
      </div>
    </div>
    <el-dialog
      title=""
      width="1000px"
      :visible.sync="dialogVisible"
      center
      @close="onCloseSelectCoupon"
    >
      <dialogContent
        @on-back="onCloseSelectCoupon"
        @on-cancel="onCloseSelectCoupon"
        @on-sure="onSureSelectCoupon"
      >
        <template slot="content">
          <div class="popBox">
            <div class="popBox-content">
              <div class="popBox-content-searchBox">
                <el-input
                  v-model="searchCouponName"
                  style="width: 180px; height: 30px"
                  size="small"
                />
                <div
                  class="popBox-content-searchBox-button"
                  @click="onSearchCoupon"
                >
                  搜索
                </div>
              </div>
              <div class="popBox-content-selectNumBox">最多5种优惠券</div>
              <yc-table :table="table" ref="myTable" v-if="dialogVisible">
                <template slot="action" slot-scope="props">
                  <el-checkbox
                    @change="selectionChange($event, props)"
                    :checked="isCheck(props.id)"
                    :disabled="canSelect(props.id)"
                  ></el-checkbox>
                </template>
                <template slot="cutPrice" slot-scope="props">
                  {{
                    $enums.CouponTicketType.getName(props.couponType) +
                    '/' +
                    props.cutPrice / 100 +
                    '元'
                  }}
                </template>
              </yc-table>
            </div>
            <!-- <div class="popBox-bottomBox">
              <div @click="onCloseSelectCoupon">取消</div>
              <div @click="onSureSelectCoupon">确定</div>
            </div> -->
          </div>
        </template>
      </dialogContent>
    </el-dialog>
    <el-dialog
      :visible.sync="showTransfer"
      class="role-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="1000px"
      center
    >
      <dialogContent
        :isLoading="subLoading"
        @on-back="handleClose"
        @on-cancel="handleClose"
        @on-sure="doSubmit"
      >
        <template slot="content">
          <transfer
            :rightInit="rightInit"
            @on-success-save="onSuccessSave"
            @on-close-transfer="onCloseTransfer"
            ref="transfer"
          />
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>
<script>
import dialogContent from '@global/dialog'
import titleInfo from '@partial/title-info'
import transfer from './components/transfer.vue'
export default {
  components: {
    dialogContent,
    titleInfo,
    transfer
  },
  data(vm) {
    const validateActivityName = (rule, value, callback) => {
      if(!this.form.activityName){
        callback(new Error('请输入活动名称'))
      }else{
        callback();
      }
    }
    const validateTargetType = (rule, value, callback) => {
      if(this.form.isAll == '1' && !this.rightInit.length){
        callback(new Error('请选择发放店家'))
      }else{
        callback();
      }
    }
    const validateSelectCoupon = (rule, value, callback) => {
      if(!this.selectCouponList.length){
        callback(new Error('请选择优惠券'))
      }else{
        callback();
      }
    }
    return {
      form: {
        storeType: '1',
        couponTargetType: 'STORE',
        isAll: '0'
      },
      rules: {
        activityName:{
          required: true,
          validator: validateActivityName,
          trigger: 'blur'
        },
        couponTargetType:{
          required: true,
          validator: validateTargetType,
          trigger: 'blur'
        },
        selectCoupon:{
          required: true,
          validator: validateSelectCoupon,
          trigger: 'blur'
        }
      },
      dialogVisible: false,
      showTransfer: false,
      searchCouponName: null,
      dataSelection: [],
      selectCouponList: [],
      table: {
        hidenTitle: true,
        showSpan: false,
        api: this.$api.couponQueryCouponPageByPage,
        query: {
          couponName: this.searchCouponName,
          enableStatus: 'ENABLED'
        },
        columns: [
          {
            title: '操作',
            width: '100px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          },
          {
            title: '优惠券名称',
            key: 'couponName',
            showTooltip: true
          },
          {
            title: '折扣类型/优惠券额度',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.cutPrice(ctx.row))
            }
          }
        ]
      },
      couponTable: {
        hidenTitle: true,
        showSpan: false,
        columns: [
          {
            title: '优惠券名称',
            key: 'couponName',
            showTooltip: true
          },
          {
            title: '每店发放数量（最多发5张）',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.couponTable.$scopedSlots.sendNum(ctx.row)
              )
            }
          },
          {
            title: '使用起始时间',
            width: 180,
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.couponTable.$scopedSlots.useStartTime(ctx.row)
              )
            }
          },
          {
            title: '使用终止时间',
            width: 180,
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.couponTable.$scopedSlots.useEndTime(ctx.row)
              )
            }
          },
          {
            title: '有效时间',
            width: 180,
            render(h, ctx) {
              return h('div', vm.$refs.couponTable.$scopedSlots.indate(ctx.row))
            }
          },
          {
            title: '操作',
            fixed: 'right',
            width: 100,
            render(h, ctx) {
              return h('div', vm.$refs.couponTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      rightInit: [],
      totalStoreNum: 0,
      subLoading: false
    }
  },
  computed: {
    isCheck() {
      return function (id) {
        let index = this.dataSelection.findIndex((v) => v.id === id)
        if (index !== -1) {
          return true
        }
        return false
      }
    },
    canSelect() {
      return function (id) {
        let index = this.dataSelection.findIndex((v) => v.id === id)
        if (this.dataSelection.length === 8 && index === -1) {
          return true
        }
        return false
      }
    },
    indate() {
      return function (props) {
        if (props.useEndTime && props.useStartTime)
          return Math.ceil(
            (new Date(props.useEndTime) - new Date(props.useStartTime)) /
              86400000
          )
        else return '——'
      }
    }
  },
  created() {
    this.queryAllStoreCount()
  },
  activated(){
    this.form = {storeType: '1', couponTargetType: 'STORE', isAll: '0'};
    this.rightInit = [];
    this.selectCouponList = [];
    this.$nextTick(_=>{
      this.$refs.form.clearValidate();
    })
  },
  methods: {
    onSearchCoupon() {
      this.table.query['couponName'] = this.searchCouponName
      this.$refs.myTable.refresh()
    },
    //选项框
    selectionChange(event, val) {
      if (this.dataSelection.length === 5 && event) {
        return this.$message.error('发放优惠券不可高于5种')
      }
      if (event) {
        //初始化参数
        val.useStartTime = ''
        val.useEndTime = ''
        val.couponStartTime = null
        val.couponEndTime = null
        val.sendNum = '1'
        val.couponId = val.id
        this.dataSelection.push(val)
      } else {
        let index = this.dataSelection.findIndex(
          (v) => v.dramaId === val.dramaId
        )
        this.dataSelection.splice(index, 1)
      }
    },
    //校验最大输入数量
    onInputCouponNum(e, props) {
      let index = this.selectCouponList.findIndex((e) => e.id === props.id)
      let integer = /^(-|\+)?\d+$/

      if (integer.test(e)) {
        if (parseInt(e) > 5) {
          this.selectCouponList[index].sendNum = 5
          return this.$message.error(`超过最大发放数量`)
        } else if (parseInt(e) === 0) {
          this.selectCouponList[index].sendNum = 1
        }
      } else {
        this.$message.error(`请输入数字`)
        this.selectCouponList[index].sendNum = ''
      }
    },
    async onGoNext() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return

        if (this.form.storeType === '2' && !this.rightInit.length) {
          return this.$message.error(`请选择店铺`)
        }
        if (!this.selectCouponList.length) {
          return this.$message.error(`请选择卡券`)
        }
        if (this.judgeInput()) {
          return this.$message.error(`请检查卡券的起始时间和终止时间`)  
        }
        if (!this.form.isAll === '1' && !this.rightInit.length) {
          return this.$message.error(`请选择店家`)
        }
        //二次确认
        let message = []
        let targetIds = []
        this.selectCouponList.map((it) => {
          it.totalNum =
            this.form.storeType === '1'
              ? this.totalStoreNum * parseInt(it.sendNum)
              : this.rightInit.length * parseInt(it.sendNum)
          message.push(`${it.couponName}x${it.sendNum}`)
        })
        this.rightInit.map((v) => {
          targetIds.push(v.id)
        })
        this.$confirm(message.join('、'), '是否将以下优惠券发放给店家', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false
        }).then(async () => {
          this.subLoading = true
          try {
            await this.$api.couponActivityAddCouponMarketActivity({
              activityType:
                'DIRECT_RELEASE' /*活动类型：DIRECT_RELEASE|LINK_GET_COUPON|RELEASE_BY_TIME|OPEN_STORE_SUCCESS_RELEASE|NORMAL_RELEAS*/,
              remark: this.form.remark /*备注[可选]*/,
              couponTargetType: this.form.couponTargetType,
              couponActivityInfoItems: this.selectCouponList,
              isAll: this.form.isAll === '0' ? true: false,
              targetIds: this.form.isAll === '1' ? targetIds: [],
              activityName: this.form.activityName
            })
            this.$message.success(`新增成功`)
            this.subLoading = false
            setTimeout(() => {
              this.$router.back()
            }, 1000)
          } catch (e) {
            console.log(e)
            this.subLoading = false
            this.$closeMessageBoxLoading()
          }
        })
      })
    },
    onSelectStore() {
      this.showTransfer = true
      this.$nextTick(async (_) => {
        await this.$refs.transfer.getTransferLeftData()
        this.$refs.transfer.getTransferRightData()
      })
    },
    doSubmit() {
      this.$refs.transfer.doSubmitAdd()
    },
    handleClose() {
      this.$refs.transfer.doCancel()
    },
    onSuccessSave(data) {
      this.rightInit = data
      this.showTransfer = false
      // this.$refs.myTable.refresh()
    },
    onCloseTransfer() {
      this.showTransfer = false
    },
    onSelectCoupon() {
      this.dataSelection = JSON.parse(JSON.stringify(this.selectCouponList))
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.myTable.refresh()
      })
    },
    onSureSelectCoupon() {
      if (!this.dataSelection.length) {
        return this.$message.error(`请选择卡券`)
      }
      this.dialogVisible = false
      this.selectCouponList = JSON.parse(JSON.stringify(this.dataSelection))
      this.dataSelection = []

      this.couponTable.data = this.selectCouponList
      this.$nextTick((_) => {
        this.$refs.couponTable.update()
      })
    },
    onCloseSelectCoupon() {
      this.dialogVisible = false
      this.dataSelection = []
    },
    onChangeBeginDate(e, props, isUse) {
      if (isUse) {
        if (
          props.useEndTime &&
          new Date(props.useEndTime) <= new Date(props.useStartTime)
        ) {
          props.useStartTime = null
          return this.$message.error(`使用终止时间需大于使用起始时间`)
        }
      }
      // else{
      //   if(props.couponEndTime && new Date(props.couponEndTime) < new Date(props.couponStartTime)){
      //     props.couponStartTime = null;
      //     return this.$message.error(`卡券终止时间需大于卡券起始时间`)
      //   }
      // }
    },
    onChangeEndDate(e, props, isUse) {
      if (isUse) {
        if (new Date(props.useEndTime) < new Date()) {
          props.useEndTime = null
          return this.$message.error(`使用终止时间需大于当前时间`)
        }
        if (
          props.useStartTime &&
          new Date(props.useEndTime) <= new Date(props.useStartTime)
        ) {
          props.useStartTime = null
          return this.$message.error(`使用终止时间需大于使用起始时间`)
        }
      }
      // else{
      //   if(props.couponStartTime && new Date(props.couponEndTime) < new Date(props.couponStartTime)){
      //     props.couponStartTime = null;
      //     return this.$message.error(`卡券终止时间需大于卡券起始时间`)
      //   }
      // }
    },
    onClearCoupon(id) {
      let index = this.selectCouponList.findIndex((e) => e.id === id)
      this.selectCouponList.splice(index, 1)
      this.$refs.couponTable.update()
    },
    //判断输入项
    judgeInput() {
      let isCheck = false
      this.selectCouponList.map((it) => {
        if (!it.useStartTime || !it.useEndTime) {
          isCheck = true
        }
      })
      return isCheck
    },
    //查询全部店铺数量
    async queryAllStoreCount() {
      let data = await this.$api.storeQueryStorePage({
        storeStatus: 'ENABLED',
        storeEnterStatus: 'ENTERED',
        pageNo: 1 /*当前页码*/,
        pageSize: 1 /*分页大小*/
      })
      this.totalStoreNum = data.total
    }
  }
}
</script>
<style>
.el-form-item {
  display: flex !important;
  align-items: center !important;
}
.el-form-item__content {
  margin-left: 0 !important;
}
</style>
<style>
.my-table {
  padding: 16px 0 !important;
}
</style>
<style lang="sass" scoped>
/deep/.dialog-content
    border-top: none
.container
  &-baseInfoBox
    width: 87vw
    background: #fff
    border-radius: 8px
    padding-bottom: 50px
    &-title
      font-size: 13px
      padding-top: 26px
      margin: 0 34px
      font-weight: 500
      padding-bottom: 5px
      border-bottom: 1px solid #ccc
    &-form
      padding-top: 26px
      margin-left: 34px
      &-note
        margin-left: 5px
        font-size: 10px
        transform: scale(0.8)
        color: #ccc
      &-item
        @include hor
        align-items: center
        &-selectBox
          border-radius: 5px
          border: 1px solid $orange
          font-size: 10px
          transform: scale(0.8)
          color: $orange
          @include hor-center-center
          width: 60px
          height: 35px
          cursor: pointer
        &-note
          font-size: 10px
          transform: scale(0.85)
          color: #ccc
          margin-left: -20px
    &-bottomBox
      margin-top: 100px
      width: 100%
      @include hor-center-center
      div:nth-child(1)
        width: 100px
        height: 40px
        border-radius: 8px
        font-size: 12px
        @include hor-center-center
        margin-right: 50px
        color: #333
        background: #e5e5e5
        cursor: pointer
      div:nth-child(2)
        width: 100px
        height: 40px
        border-radius: 8px
        font-size: 12px
        @include hor-center-center
        color: #fff
        background: $orange
        cursor: pointer
.popBox
  &-content
    width: 100%
    &-title
      font-size: 12px
      transform: scale(0.8)
      color: #ccc
      transform: translateX(2px)
    &-searchBox
      margin-top: 10px
      @include hor
      align-items: center
      cursor: pointer
      &-button
        width: 50px
        height: 30px
        margin-left: 5px
        @include hor-center-center
        color: #fff
        font-size: 12px
        background: $orange
        border-radius: 3px
    &-selectNumBox
      font-size: 12px
      color: #ccc
      margin-top: 10px
  &-bottomBox
    margin-top: 100px
    width: 100%
    @include hor-center-center
    div:nth-child(1)
      width: 100px
      height: 40px
      border-radius: 8px
      font-size: 12px
      @include hor-center-center
      border: 1px solid $orange
      margin-right: 50px
      color: $orange
      background: rgb(254, 246, 233)
      cursor: pointer
    div:nth-child(2)
      width: 100px
      height: 40px
      border-radius: 8px
      font-size: 12px
      @include hor-center-center
      color: #fff
      background: $orange
      cursor: pointer
</style>
