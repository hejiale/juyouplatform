<template>
  <div class="container">
    <title-info title="创建开本券" :isShowOther="false" :isShow="false" />
    <div class="container-baseInfoBox">
      <div class="container-baseInfoBox-title">基础信息</div>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-position="left"
        label-width="100px"
        class="container-baseInfoBox-form"
        :disabled="$route.query.id ? true : false"
      >
        <el-form-item label="类型：" prop="type">
          <el-radio label="DIRECT_FEE_CUT" v-model="form.feeType"
            >抵用券</el-radio
          >
          <el-radio label="DISCOUNT_OFF" v-model="form.feeType"
            >折扣券</el-radio
          >
        </el-form-item>
        <el-form-item label="面额" prop="cutPrice">
          <el-input
            v-model="form.cutPrice"
            placeholder="请输入"
            show-word-limit
            style="width: 300px"
            type="number"
          />
        </el-form-item>
        <el-form-item label="名称：" prop="couponName">
          <el-input
            v-model="form.couponName"
            placeholder="请输入"
            :maxlength="10"
            show-word-limit
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="备注信息：">
          <el-input
            type="textarea"
            v-model="form.remark"
            :rows="5"
            show-word-limit
            :maxlength="100"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item style="width: 100%" label="适用商品：" prop="limitedIds">
          <el-table
            ref="multipleTable"
            :data="productTypeList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              v-if="!$route.query.id"
            >
            </el-table-column>
            <el-table-column label="商品类型" width="120">
              <template slot-scope="scope">{{
                $enums.ProductType.getName(scope.row.value)
              }}</template>
            </el-table-column>
            <el-table-column label="选择商品" width="520">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.limitedIds"
                  multiple
                  filterable
                  clearable
                  :loading="productLoading"
                  :placeholder="$route.query.id ? '无' : ''"
                  @change="judge(scope.$index)"
                  @visible-change="visibleChange($event, scope.row.value)"
                >
                  <el-option
                    v-for="i in productList"
                    :label="
                      i.productName +
                      (i.currentPrice ? '/' + i.currentPrice / 100 + '元' : '')
                    "
                    :value="i.id"
                    :key="i.id"
                    :disabled="disabled(scope.row.limitedIds)"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>
<script>
import titleInfo from '@partial/title-info'
export default {
  components: {
    titleInfo
  },
  data(vm) {
    const validateType = (rule, value, callback) => {
      if(!this.form.feeType){
        callback(new Error('请选择类型'))
      }else{
        callback();
      }
    }
    const validateLimitedId = (rule, value, callback) => {
      if(!this.multipleSelection.length){
        callback(new Error('请选择适用商品'))
      }else{
        let isExist = true;
        this.multipleSelection.map(it=>{
          if(!it.limitedIds.length){
            isExist = false;
          }
        })
        if(!isExist){
          callback(new Error('已选商品类型里的选择商品不能为空'));
        }else{
          callback();
        }
      }
    }
    return {
      form: {
        feeType: 'DIRECT_FEE_CUT',
        couponName: '',
        remark: '',
        cutPrice: ''
      },
      rules: {
        type: {
          required: true,
          validator: validateType,
          trigger: 'change'
        },
        couponName: {
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        },
        cutPrice: {
          required: true,
          message: '请输入金额',
          trigger: 'blur'
        },
        limitedIds: {
          required: true,
          validator: validateLimitedId,
          trigger: 'change'
        }
      },
      productLoading: false,
      productList: [],
      productTypeList: [],
      multipleSelection: [],
      canDo: false
    }
  },
  async activated() {
    this.clearData();
    await this.queryProductList()
    await this.queryDetail()
  },
  computed: {
    disabled() {
      return function (arr) {
        if (arr.indexOf(0) != -1) {
          console.log(arr)
          return true
        }
      }
    }
  },
  methods: {
    async queryDetail() {
      if (this.$route.query.id) {
        let res = await this.$api.couponDetail({
          id: this.$route.query.id
        })
        
        res.cutPrice = res.cutPrice / 100
        res.couponProductApplicable.map((v) => {
          if (v.isAll) {
            v.value = v.productType
            v.limitedIds.push(0)
          } else {
            v.value = v.productType
            v.limitedIds = []
            v.productLimitItems[0].limitItems.map((val) => {
              v.limitedIds.push(val.itemId)
            })
          }
        })
        this.productTypeList = res.couponProductApplicable
        this.form = res
      }
    },
    async queryProductList(value) {
      let data = await this.$api.productGetList({
        pageNo: 1,
        pageSize: 999,
        productType: value,
        isPutOn: true
      })
      data.records.unshift({ productName: '全部', productType: 'ALL', id: 0 })
      this.productList = data.records
    },
    judge(i) {
      if (this.productTypeList[i].limitedIds.indexOf(0) != -1) {
        this.productTypeList[i].limitedIds = [0]
      }
    },
    async visibleChange($event, value) {
      if (!$event) return
      try {
        this.productLoading = true
        await this.queryProductList(value)
        this.productLoading = false
      } catch (e) {
        this.productLoading = false
      }
    },
    handleSelectionChange(val) {
      val.map(it=>{
        if(!it.limitedIds.length){
          it.limitedIds = [0]
        }
      })
      this.multipleSelection = val
      console.log(val)
    },
    clearData() {
      this.form = {
        feeType: 'DIRECT_FEE_CUT',
        couponName: '',
        remark: '',
        cutPrice: ''
      }
      this.productList = [];
      this.productTypeList =  [
          { label: '申领剧本商品', value: 'APPLY_DRAMA_PRODUCT', limitedIds: [] },
          { label: '票房商品', value: 'BOX_OFFICE_PRODUCT', limitedIds: [] }
      ]
      this.multipleSelection = []
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if(!valid)return;

        if (this.canDo) return
        this.canDo = true

        try {
          let applicableProductList = []
          let cutPrice = this.form.cutPrice * 100
          this.multipleSelection.map((v) => {
            if (v.limitedIds.indexOf(0) != -1) {
              applicableProductList.push({
                isAll: true,
                limitedIds: null,
                productType: v.value
              })
            } else {
              applicableProductList.push({
                isAll: false,
                limitedIds: v.limitedIds,
                productType: v.value
              })
            }
          })
          await this.$api.couponAddCoupon({
            ...this.form,
            applicableProductList,
            cutPrice,
            enableStatus: 'ENABLED'
          })
          this.$message.success(`新增成功`)
          this.canDo = false
          this.clearData()
          this.$utils.routeBack('/market/cardCenter')
        } catch (e) {
          this.canDo = false
        }
      })
    }
  }
}
</script>
<style lang="sass" scoped>
/deep/.el-table__body
  width: 100% !important
/deep/.el-table__header
  width: 100% !important
/deep/.el-input
  width: 500px
/deep/.el-form-item__content
  flex: 1
.container
  &-baseInfoBox
    width: 87vw
    background: #fff
    border-radius: 8px
    padding-bottom: 10px
    &-title
      font-size: 13px
      padding-top: 26px
      margin: 0 34px
      font-weight: 500
      padding-bottom: 5px
      // border-bottom: 1px solid #ccc
    &-form
      padding-top: 26px
      margin-left: 34px
      &-note
        margin-left: 5px
        font-size: 10px
        transform: scale(0.8)
        color: #ccc
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
.popBox
  border-top: 1px solid #ccc
  width: 100%
  &-title
    padding-top: 20px
    font-size: 10px
  &-preBox
    padding: 10px 0
    width: 342px
    border-radius: 8px
    margin-top: 5px
    display: inline-flex
    align-items: center
    background: #FFFFFF
    border: 1px solid #999
    @include hor-between-center
    &-infoBox
      @include ver
      margin-left: 16px
      span:nth-child(1)
        font-size: 14px
        font-family: PingFang SC-Medium, PingFang SC
        font-weight: 500
        color: #000000
        line-height: 16px
      span:nth-child(2),span:nth-child(3)
        margin-top: 4px
        font-size: 12px
        font-family: PingFang SC-Regular, PingFang SC
        font-weight: 400
        color: #999999
        line-height: 14px
    &-useBox
      border-left: 1px dashed #E6E6E6
      padding: 0 16px
      @include ver
      align-items: center
      &-price
        font-size: 26px
        font-family: DIN Alternate-Bold, DIN Alternate;
        font-weight: bold
        color: #FF6721
        line-height: 23px
      &-price::before
        font-size: 20px
        content: '¥'
      span
        font-size: 11px
        font-family: PingFang SC-Regular, PingFang SC
        font-weight: 400
        color: #666666
        line-height: 13px
      &-goUse
        margin-top: 4px
        width: 64px
        height: 26px
        background: #14C9C9
        border-radius: 13px
        font-size: 12px
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500
        color: #FFFFFF
        line-height: 12px
        @include hor-center-center

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
