<template>
  <div class="container" v-if="isEndLoad">
    <title-info title="发券" :isShowOther="false" :isShow="false" />
    <div class="container-baseInfoBox">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-position="left"
        label-width="120px"
        class="container-baseInfoBox-form"
      >
        <div class="container-baseInfoBox-title">基础信息</div>
        <div class="container-baseInfoBox-items">
          <el-form-item label="活动名称" prop="activityName">
            <el-input
              v-model="form.basicInfo.activityName"
              show-word-limit
              :maxlength="20"
              style="width: 300px"
              placeholder="请输入活动名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="form.basicInfo.remark"
              show-word-limit
              :maxlength="100"
              :rows="4"
              style="width: 300px"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
          <el-form-item label="关联用户范围" prop="couponTargetType">
            <div class="container-baseInfoBox-form-item">
              <el-select v-model="form.basicInfo.couponTargetType">
                <el-option
                  v-for="i in storeTypeList"
                  :label="i.label"
                  :value="i.value"
                  :key="i.value"
                />
              </el-select>
              <div style="margin-left: 20px">
                <el-radio v-model="form.basicInfo.isAll" :label="true"
                  >全部</el-radio
                >
                <el-radio v-model="form.basicInfo.isAll" :label="false"
                  >自选</el-radio
                >
              </div>
              <div style="margin-left: 20px" v-if="!form.basicInfo.isAll">
                <el-button type="primary" size="mini" @click="onSelectStore"
                  >点击选择</el-button
                >
                <span style="margin-left: 20px"
                  >已选 {{ rightInit.length ? rightInit.length : 0 }}</span
                >
              </div>
            </div>
          </el-form-item>
        </div>

        <div class="container-baseInfoBox-title">发放条件</div>
        <div class="container-baseInfoBox-items">
          <el-form-item label="消费商品" prop="consumeProductType">
            <div class="container-baseInfoBox-form-item">
              <el-select
                v-model="form.sendCondition.consumeProductType"
                @change="changeProductType"
              >
                <el-option
                  v-for="i in $enums.ProductType.list"
                  :label="i.label"
                  :value="i.value"
                  :key="i.value"
                />
              </el-select>
              <div style="margin-left: 20px">
                <el-radio v-model="form.sendCondition.isAll" :label="true"
                  >全部</el-radio
                >
                <el-radio v-model="form.sendCondition.isAll" :label="false"
                  >自选</el-radio
                >
              </div>

              <div style="margin-left: 20px" v-if="!form.sendCondition.isAll">
                <el-button type="primary" size="mini" @click="onSelectProduct"
                  >点击选择</el-button
                >
                <span style="margin-left: 20px"
                  >已选
                  {{
                    rightInitProduct.length ? rightInitProduct.length : 0
                  }}</span
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item label="消费有效期" prop="taskTime">
            <el-date-picker
              v-model="form.sendCondition.taskStartTime"
              type="date"
              unlink-panels
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              style="width: 160px"
              placeholder="起始日期"
              @change="onChangeBeginDateUse($event, form.sendCondition, true)"
            ></el-date-picker>
            <span style="margin: 0 20px">至</span>
            <el-date-picker
              v-model="form.sendCondition.taskEndTime"
              type="date"
              unlink-panels
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 23:59:59"
              style="width: 160px"
              placeholder="终止日期"
              @change="onChangeEndDateUse($event, form.sendCondition, true)"
            ></el-date-picker>
            <span class="ml20">共{{days}}天</span>
          </el-form-item>
          <div class="container-baseInfoBox-items-info">
            <span
              class="container-baseInfoBox-items-info-test"
              style="margin: 0 20px 0 0"
              >活动期间</span
            >
            <el-select
              v-model="form.sendCondition.countType"
              placeholder=""
              style="width: 100px"
              @change="onSelectCountType"
            >
              <el-option
                v-for="i in $enums.CountType.list"
                :label="i.label"
                :value="i.value"
                :key="i.value"
              />
            </el-select>
            <span class="container-baseInfoBox-items-info-test">消费</span>
            <el-input
              v-model="form.sendCondition.countNum"
              style="width: 100px"
            ></el-input>
            <span class="container-baseInfoBox-items-info-test"
              >次可获得奖励，本活动</span
            >
            <el-select
              v-model="form.sendCondition.includeDiscountOrder"
              placeholder=""
              style="width: 100px"
            >
              <el-option
                v-for="i in includeDiscountOrder"
                :label="i.label"
                :value="i.value"
                :key="i.value"
              />
            </el-select>
            <span class="container-baseInfoBox-items-info-test"
              >优惠券消费</span
            >
          </div>
          <div class="container-baseInfoBox-items-info">
            <span
              class="container-baseInfoBox-items-info-test"
              style="margin: 0 20px 0 0"
              >活动期间每个ID最多可获得奖励</span
            >
            <el-input
              v-model="form.sendCondition.maxCompleteTimes"
              style="width: 60px"
              :disabled="form.sendCondition.countType === 'ACCUMULATE'"
            ></el-input>
            <span class="container-baseInfoBox-items-info-test">次</span>
            <span class="container-baseInfoBox-items-info-tips"
              >(不限完成次数输入0)</span
            >
          </div>
        </div>
        <div class="container-baseInfoBox-title">奖励信息</div>
        <div class="container-baseInfoBox-items">
          <el-form-item label="奖励：" prop="couponTable">
            <div class="container-baseInfoBox-form-item"></div>
            <el-button type="primary" size="mini" @click="onSelectCoupon"
              >添加优惠券</el-button
            >
          </el-form-item>
          <div class="container-award">
            <div
              class="container-award-items"
              v-for="item in couponTable"
              :key="item.id"
            >
              <div class="container-award-items-name">
                {{ item.couponName }}
              </div>
              <div class="container-award-items-num">
                <span class="container-award-items-text">发</span>
                <el-input
                  v-model="item.rewardNum"
                  style="width: 60px"
                  placeholder="多少"
                ></el-input>
                <span class="container-award-items-text">张</span>
              </div>
              <div class="container-award-items-timeType">
                <span class="container-award-items-text">有效期：</span>
                <el-select v-model="item.sendTimeType" style="width: 120px">
                  <el-option
                    v-for="i in $enums.SendTimeType.list"
                    :label="i.label"
                    :value="i.value"
                    :key="i.value"
                  />
                </el-select>
              </div>
              <div
                class="container-award-items-inputTime"
                v-if="item.sendTimeType == 'NEXT_DAYS'"
              >
                <el-input
                  v-model="item.nextDays"
                  style="width: 100px"
                  placeholder="多少"
                ></el-input>
                <span class="container-award-items-text">天内有效</span>
              </div>
              <div class="container-award-items-selectTime" v-else>
                <el-date-picker
                  v-model="item.useStartTime"
                  type="date"
                  unlink-panels
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd 00:00:00"
                  style="width: 160px"
                  placeholder="起始日期"
                  @change="onChangeBeginDate($event, item, true)"
                ></el-date-picker>
                <span class="container-award-items-text" style="margin: 0 20px"
                  >至</span
                >
                <el-date-picker
                  v-model="item.useEndTime"
                  type="date"
                  unlink-panels
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd 23:59:59"
                  style="width: 160px"
                  placeholder="终止日期"
                  @change="onChangeEndDate($event, item, true)"
                ></el-date-picker>
                <!-- <span class="container-award-items-text"
                  >共{{ indate(item) }}天</span
                > -->
              </div>

              <div class="container-award-items-del">
                <el-button type="danger" @click="onClearCoupon(item.id)"
                  >删除</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div class="container-baseInfoBox-bottomBox">
        <div @click="cancel">取消</div>
        <div @click="onGoNext" v-loading="subLoading" v-if="$powers('/couponAutoSend/add') || $powers('/couponAutoSend/update')">{{isEdit ? '保存':'创建'}}</div>
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
                    :checked="isCheck(props)"
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
          </div>
        </template>
      </dialogContent>
    </el-dialog>
    <el-dialog
      :visible.sync="showTransferProduct"
      class="role-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="1000px"
      center
    >
      <dialogContent
        :isLoading="subLoading"
        @on-back="handleCloseProduct"
        @on-cancel="handleCloseProduct"
        @on-sure="doSubmitProduct"
      >
        <template slot="content">
          <transferProduct
            :productType="form.sendCondition.consumeProductType"
            :rightInit="rightInitProduct"
            @on-success-save="onSuccessSaveProduct"
            @on-close-transfer="onCloseTransferProduct"
            ref="transferProduct"
          />
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
import transfer from './transfer.vue'
import transferProduct from './transferProduct.vue'
export default {
  components: {
    dialogContent,
    titleInfo,
    transfer,
    transferProduct
  },
  data(vm) {
    const validateActivityName = (rule, value, callback) => {
      if(!this.form.basicInfo.activityName){
        callback(new Error('请输入活动名称'))
      }else{
        callback();
      }
    }
    const validateTargetType = (rule, value, callback) => {
      if(!this.form.basicInfo.couponTargetType){
        callback(new Error('请选择关联用户范围'))
      }else{
        callback();
      }
    }
    const validateTasktime = (rule, value, callback) => {
      if(!this.form.sendCondition.taskStartTime || !this.form.sendCondition.taskEndTime){
        callback(new Error('请选择消费有效期'))
      }else{
        callback();
      }
    }
    const validateCouponTable = (rule, value, callback) => {
      if(!this.couponTable.length){
        callback(new Error('请添加优惠券'))
      }else{
        let isEmpty = false;
        this.couponTable.map(v=>{
          if(v.sendTimeType === 'NEXT_DAYS'){
            if(!v.rewardNum || !v.nextDays){
              isEmpty = true;
            }
          }else{
            if(!v.rewardNum || !v.useStartTime || !v.useEndTime){
              isEmpty = true;
            }
          }
        })
        if(isEmpty){
          callback(new Error('卡券内容有空'));
        }else{
          callback();
        }
      }
    }
    return {
      form: {},
      rules: {
        activityName:{
          required: true,
          validator: validateActivityName,
          trigger: 'blur'
        },
        couponTargetType:{
          required: true,
          validator: validateTargetType,
          trigger: 'change'
        },
        taskTime:{
          required: true,
          validator: validateTasktime,
          trigger: ['change','blur']
        },
        couponTable:{
          required: true,
          validator: validateCouponTable,
          trigger: ['change','blur']
        }
      },
      dialogVisible: false,
      showTransfer: false,
      showTransferProduct: false,
      searchCouponName: null,
      dataSelection: [],
      selectCouponList: [],
      includeDiscountOrder: [
        { label: '含', value: 'true' },
        { label: '不含', value: 'false' }
      ],
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
      couponTable: [],
      storeTypeList: [
        { label: '店家', value: 'STORE' }
        // { label: '用户', value: 'USER' }
      ],
      rightInit: [],
      rightInitProduct: [],
      totalStoreNum: 0,
      subLoading: false,
      isEndLoad: false
    }
  },
  computed: {
    isEdit(){
      return this.$route.name !== 'addMarketToolAuto';
    },
    isCheck() {
      return function (prop) {
        let index = null
        if (this.$route.query.id) {
          index = this.dataSelection.findIndex(
            (v) => v.rewardCouponId === prop.id
          )
        } else {
          index = this.dataSelection.findIndex((v) => v.id === prop.id)
        }
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
        console.log(props)
        if (props.useEndTime && props.useStartTime)
          return Math.ceil(
            (new Date(props.useEndTime) - new Date(props.useStartTime)) /
              86400000
          )
        else return 0
      }
    },
    days(){
      if(this.form.sendCondition.taskEndTime && this.form.sendCondition.taskStartTime){
        return Math.ceil((new Date(this.form.sendCondition.taskEndTime).getTime() - new Date(this.form.sendCondition.taskStartTime).getTime())/86400000);
      }
      return 0;
    }
  },
  activated() {
    this.clearData();
    this.queryAllStoreCount()
    this.queryDetailData()
  },
  methods: {
    onSelectCountType(){
      if(this.form.sendCondition.countType === 'ACCUMULATE'){
        this.form.sendCondition.maxCompleteTimes = 1;
      }
    },
    clearData(){
      this.form = {
        basicInfo: {
          activityName: null,
          activityType: 'ACTIVITY_GET_COUPON',
          remark: null,
          couponTargetType: 'STORE',
          isAll: true
        },
        sendCondition: {
          consumeProductType: 'APPLY_DRAMA_PRODUCT',
          taskStartTime: null,
          taskEndTime: null,
          countType: 'ACCUMULATE',
          countNum: 1,
          includeDiscountOrder: 'true',
          maxCompleteTimes: 1,
          isAll: true
        }
      }
      this.searchCouponName = null;
      this.couponTable = [];
      this.selectCouponList = [];
      this.dataSelection = [];
      this.rightInit = [];
      this.rightInitProduct = [];
      this.totalStoreNum = 0;
    },
    async queryDetailData() {
      if (this.$route.query.id) {
        let data =
          await this.$api.couponAutoSendGetCouponAutoSendConditionDetail({
            id: this.$route.query.id
          })
          
        data.sendConditionItem.includeDiscountOrder = String(
          data.sendConditionItem.includeDiscountOrder
        )
        data.basicInfo.couponTargetType = data.basicInfo.targetType
        //处理复制数据Id
        if(this.$route.query.isCopy){
          data.basicInfo.id = null;
          data.sendConditionItem.id = null;
          data.autoRewardList.map(it=>{
            it.id = null;
          })
        }
        
        this.rightInit =
          data.basicInfo.targetType == 'STORE'
            ? data.basicInfo.storeItemList
              ? data.basicInfo.storeItemList
              : []
            : data.basicInfo.userItemList
            ? data.basicInfo.userItemList
            : []
        this.rightInitProduct = data.sendConditionItem
          ? data.sendConditionItem.productItemList
          : []
        this.couponTable = JSON.parse(JSON.stringify(data.autoRewardList))
        this.selectCouponList = JSON.parse(JSON.stringify(data.autoRewardList))
        this.form.basicInfo = JSON.parse(JSON.stringify(data.basicInfo))

        if(data.sendConditionItem){
          this.form.sendCondition = data.sendConditionItem
        }else{
          this.form.sendCondition = {
            consumeProductType: 'APPLY_DRAMA_PRODUCT',
            taskStartTime: null,
            taskEndTime: null,
            countType: 'ACCUMULATE',
            countNum: 1,
            includeDiscountOrder: 'true',
            maxCompleteTimes: 1,
            isAll: true
          }
        }
        
        console.log(this.form);
        this.isEndLoad = true;
        this.$nextTick(_=>{
          this.$refs.form.clearValidate();
        })
      } else {
        this.form = {
          basicInfo: {
            activityName: null,
            activityType: 'ACTIVITY_GET_COUPON',
            remark: null,
            couponTargetType: 'STORE',
            isAll: true
          },
          sendCondition: {
            consumeProductType: 'APPLY_DRAMA_PRODUCT',
            taskStartTime: null,
            taskEndTime: null,
            countType: 'ACCUMULATE',
            countNum: 1,
            includeDiscountOrder: 'true',
            maxCompleteTimes: 1,
            isAll: true
          }
        }
        this.couponTable = []
        this.couponTable = []
        this.isEndLoad = true;
        this.$nextTick(_=>{
          this.$refs.form.clearValidate();
        })
      }
    },
    changeProductType() {
      this.rightInitProduct = []
    },
    async queryProductList() {
      let data = await this.$api.productGetList({
        pageNo: 1,
        pageSize: 999,
        productType: this.form.sendCondition.consumeProductType
      })
      data.records.map((v) => {
        v.select = false
      })
      this.rightInitProduct = data.records
    },
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
    clearTime(i) {
      this.couponTable[i].nextDays = null
      this.couponTable[i].useStartTime = null
      this.couponTable[i].useEndTime = null
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
        
        if (!this.form.basicInfo.activityName) {
          return this.$message.error(`请输入活动名称`)
        }
        if (!this.selectCouponList.length) {
          return this.$message.error(`请选择卡券`)
        }
        if (this.judgeInput()) {
          return this.$message.error(`请检查卡券的起始时间和终止时间`)
        }
        if (!this.form.basicInfo.isAll && !this.rightInit.length ) {
          return this.$message.error(`请选择店家`)
        }
        if (!this.form.sendCondition.isAll && !this.rightInitProduct.length ) {
          return this.$message.error(`请选择商品`)
        }
        if (
          !this.form.sendCondition.taskStartTime &&
          !this.form.sendCondition.taskEndTime
        ) {
          return this.$message.error(`请选择消费有效期`)
        }
        if(this.subLoading)return;
        this.subLoading = true;
        //二次确认
        let message = []
        let targetIds = []
        let productIds = []
        // this.selectCouponList.map((it) => {
        //   it.totalNum =
        //     this.form.storeType === '1'
        //       ? this.totalStoreNum * parseInt(it.sendNum)
        //       : this.rightInit.length * parseInt(it.sendNum)
        //   message.push(`${it.couponName}x${it.sendNum}`)
        // })
        if(!this.form.basicInfo.isAll){
          this.rightInit.map((v) => {
            targetIds.push(v.id)
          })
          this.form.basicInfo.targetIds = targetIds
        }
        if(!this.form.sendCondition.isAll){
          this.rightInitProduct.map((v) => {
            productIds.push(v.id)
          })
          this.form.sendCondition.productIds = productIds
        }
      
        let form = { ...this.form }
    
        try {
          this.couponTable.map((v) => {
            if(!v.rewardCouponId){
              v.rewardCouponId = v.id
            }
          })
          let api = null
          if (this.$route.name == 'addMarketToolAuto')
            api = 'couponAutoSendAdd'
          else api = 'couponAutoSendUpdate'
          await this.$api[api]({
            ...form,
            autoRewards: this.couponTable
          })
          this.$message.success(`新增成功`)
          
          setTimeout(() => {
            if (this.$route.name == 'addMarketToolAuto') {
              this.clearData();
              this.couponTable = []
              this.$utils.routeBack('/market/marketToolInfoAuto')
            } else {
              this.queryDetailData()
            }
            this.subLoading = false
          }, 1000)
        } catch (e) {
          console.log(e)
          this.subLoading = false
          this.$closeMessageBoxLoading()
        }
      })
    },
    cancel() {
      this.$utils.routeBack('/market/marketToolInfoAuto')
    },
    onSelectStore() {
      this.showTransfer = true
      this.$nextTick(async (_) => {
        await this.$refs.transfer.getTransferLeftData()
        this.$refs.transfer.getTransferRightData()
      })
    },
    onSelectProduct() {
      this.showTransferProduct = true
      this.$nextTick(async (_) => {
        await this.$refs.transferProduct.getTransferLeftData()
        this.$refs.transferProduct.getTransferRightData()
      })
    },
    doSubmitProduct() {
      this.$refs.transferProduct.doSubmitAdd()
    },
    handleCloseProduct() {
      this.$refs.transferProduct.doCancel()
    },
    onSuccessSaveProduct(data) {
      // if (!data.length) {
      //   this.queryProductList()
      // } else {
      //   this.rightInitProduct = data
      // }
      this.rightInitProduct = data
      this.showTransferProduct = false
    },
    onCloseTransferProduct() {
      this.showTransferProduct = false
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

      this.couponTable = this.selectCouponList
      //   this.$nextTick((_) => {
      //     this.$refs.couponTable.update()
      //   })
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
    onChangeBeginDateUse(e, props, isUse) {
      if (isUse) {
        let curDate = new Date();
        curDate = curDate.setDate(curDate.getDate() - 1);

        if(new Date(props.taskStartTime) < curDate){
          props.taskStartTime = null
          return this.$message.error(`消费起始时间不能小于当天`)
        }
        if (
          props.taskEndTime &&
          new Date(props.taskEndTime) <= new Date(props.taskStartTime)
        ) {
          props.taskStartTime = null
          return this.$message.error(`消费终止时间需大于使用起始时间`)
        }
      }
    },
    onChangeEndDateUse(e, props, isUse) {
      if (isUse) {
        if (new Date(props.taskEndTime) < new Date()) {
          props.taskEndTime = null
          return this.$message.error(`使用终止时间需大于当前时间`)
        }
        if (
          props.taskStartTime &&
          new Date(props.taskEndTime) <= new Date(props.taskStartTime)
        ) {
          props.taskStartTime = null
          return this.$message.error(`使用终止时间需大于使用起始时间`)
        }
      }
    },
    onClearCoupon(id) {
      let index = this.selectCouponList.findIndex((e) => e.id === id)
      this.selectCouponList.splice(index, 1)
      //   this.$refs.couponTable.update()
    },
    //判断输入项
    judgeInput() {
      let isCheck = false
      this.couponTable.map((it) => {
        if (it.sendTimeType == 'TIME_BETWEEN') {
          if (!it.useStartTime || !it.useEndTime) {
            isCheck = true
          }
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
  &-award
    width: 90%
    min-width: 1200px
    margin-left: 80px
    &-items
      display: flex
      align-items: center
      justify-content: space-between
      margin: 20px 0
      &-name
        width: 200px
      &-num
        width: 200px
      &-timeType
        width: 240px
      &-selectTime
        width: 500px
      &-inputTime
        width: 500px
      &-del
        width: 100px
      &-text
        margin: 0 10px
  &-baseInfoBox
    width: 87vw
    background: #fff
    border-radius: 8px
    padding-bottom: 50px
    &-title
      font-size: 13px
      padding-top: 26px
      margin:  34px 0
      font-weight: 600
      padding-bottom: 5px
    &-items
        margin-left: 34px
        border-bottom: 1px solid #ccc
        &-info
            margin-bottom: 30px
            &-test
                margin: 0 20px
            &-tips
                font-size: 14px
                font-family: OPPOSans-Light, OPPOSans
                font-weight: 300
                color: #5D5D5D
                line-height: 22px

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
