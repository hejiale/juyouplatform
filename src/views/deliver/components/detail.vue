<template>
  <div>
    <div class="base-form">
      <el-form
        :model="form"
        ref="form"
        label-width="120px"
        label-position="right"
        class="merchantform"
      >
        <div class="content">
          <div class="title">订单信息</div>
          <el-row :gutter="5">
            <el-col :span="24">
              <el-form-item label="平台订单号">
                <span>{{ form.orderNum }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ form.orderCreateTime }}</span>
              </el-form-item>
              <el-form-item label="订单状态">
                <span>{{ $enums.OrderStatus.getName(form.orderStatus) }}</span>
              </el-form-item>
              <el-form-item label="退款理由">
                <span>{{ form.refundReason || '——' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <div class="title">收货信息</div>
          <el-row :gutter="5">
            <el-col :span="24">
              <el-form-item label="收货地址">
                <span>{{ form.address }}</span>
              </el-form-item>
              <el-form-item label="收货人姓名">
                <span>{{ form.userName }}</span>
              </el-form-item>
              <el-form-item label="收货人联系电话">
                <span>{{ form.phone }}</span>
              </el-form-item>
              <el-form-item label="邮编">
                <span>{{ form.postalCode }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <div class="title">物流信息</div>
          <el-row :gutter="5">
            <el-col :span="24">
              <el-form-item label="物流公司">
                <span>{{
                  form.company
                }}</span>
              </el-form-item>
              <el-form-item label="物流单号">
                <span>{{
                  form.number
                }}</span>
              </el-form-item>
              <el-form-item label="物流状态">
                <span>{{
                  $enums.ShippingFee.getName(form.logisticsStatus)
                }}</span>
              </el-form-item>
              <el-form-item label="发货时间">
                <span>{{
                  form.deliveryTime
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <div class="title">用户信息</div>
          <el-row :gutter="5">
            <el-col :span="24">
              <el-form-item label="来源店铺/ID">
                <span>{{ form.storeName }}</span>
              </el-form-item>
              <el-form-item label="买家名称">
                <span>{{ form.buyerName }}</span>
              </el-form-item>
              <el-form-item label="买家手机号">
                <span>{{ form.buyerPhone }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <div class="title">商品信息</div>
          <el-row :gutter="5">
            <el-col :span="24">
              <el-form-item label="商品类别">
                <span>{{ $enums.ProductType.getName(form.productType) }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ form.productName }}</span>
              </el-form-item>
              <el-form-item label="商品数量">
                <span>{{ form.quantity }}</span>
              </el-form-item>
              <el-form-item label="价格">
                <span>{{ $filters.moneyCurrency(form.price) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <div class="title">优惠信息</div>
          <el-row :gutter="5">
            <el-col :span="24">
              <el-form-item label="优惠券/ID">
                <span>{{ form.couponName }}/{{ form.couponId }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <div class="title">支付信息</div>
          <el-row :gutter="5">
            <el-col :span="24">
              <el-form-item label="支付方式">
                <span>{{ $enums.PayType.getName(form.payType) }}</span>
              </el-form-item>
              <el-form-item label="支付单号">
                <span>{{ form.txnSeqno }}</span>
              </el-form-item>
              <el-form-item label="商品总价（元）">
                <span>{{ $filters.moneyCurrency(form.productPrice) }}</span>
              </el-form-item>
              <el-form-item label="应付金额">
                <span>{{
                  $filters.moneyCurrency(form.orderAmount)
                }}</span>
              </el-form-item>
              <el-form-item label="实付金额">
                <span>{{
                  $filters.moneyCurrency(form.payAmount)
                }}</span>
              </el-form-item>
              <el-form-item label="优惠券优惠金额">
                <span>{{
                  $filters.moneyCurrency(form.discountAmount)
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      form: {}
    }
  },
  methods: {
    async queryDetailData() {
      this.form = await this.$api.queryOrderLogisticsDetail({
        id: this.id
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.content
    border-bottom: solid 1px #DCDFE6
    margin-bottom: 20px
.title
    font-size: 14px
    font-family: OPPOSans-Bold, OPPOSans
    font-weight: 700
    color: rgba(0,0,0,0.9)
    line-height: 22px
/deep/.el-form-item
    margin-bottom: 0 !important
</style>
