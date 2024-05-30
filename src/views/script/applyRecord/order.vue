<template>
  <div class="container">
    <div class="container-infoBox" v-for="item in orderInfo" :key="item.title">
      <span class="container-infoBox-title">{{ item.title }}</span>
      <div
        class="container-infoBox-value"
        v-for="it in item.value"
        :key="it.title">
        <span>{{ it.title }}</span>
        <div v-if="it.isImg" style="margin-left: 79px">
          <el-image :src="url" v-for="url in it.value" :key="url" style="width: 100px; height: 100px" :preview-src-list="it.value"/>
        </div> 
        <span v-else>{{ it.value }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderInfo: null
    }
  },
  activated() {
    this.queryOrderData()
  },
  methods: {
    async queryOrderData() {
      try {
        let data = await this.$api.boxStoreApplyQueryBoxStoreApplyDetail({
          id: this.$route.query.id
        })
        this.orderInfo = [
          {
            title: '订单信息',
            value: [
              {
                title: '平台订单号',
                value: data.orderNum
              },
              {
                title: '创建时间',
                value: data.orderCreateTime
              },
              {
                title: '订单状态',
                value: this.$enums.OrderStatus.getName(data.orderStatus)
              }
            ]
          },
          {
            title: '用户信息',
            value: [
              {
                title: '来源店铺/ID',
                value: `${data.storeName || ""}/${data.storeId || ""}`
              },
              {
                title: '买家名称/ID',
                value: `${data.buyerName || ""}/${data.buyerId || ""}`
              },
              {
                title: '买家手机号',
                value: data.buyerPhone
              }
            ]
          },
          {
            title: '商品信息',
            value: [
              {
                title: '商品类别',
                value: this.$enums.ProductType.getName(data.productType)
              },
              {
                title: '商品名称',
                value: data.productName
              },
              {
                title: '商品数量',
                value: data.quantity
              },
              {
                title: '价格',
                value: this.$filters.moneyCurrency(data.price)
              },
              {
                title: '商品图片',
                value: data.productImgs,
                isImg: true
              }
            ]
          },
          {
            title: '优惠信息',
            value: [
              {
                title: '优惠券/ID',
                value: data.couponName
              }
            ]
          },
          {
            title: '支付信息',
            value: [
              {
                title: '支付方式',
                value: this.$enums.PayType.getName(data.payType)
              },
              {
                title: '支付单号',
                value: data.txnSeqno
              },
              {
                title: '商品总价（元）',
                value: this.$filters.moneyCurrency(data.productPrice)
              },
              {
                title: '运费',
                value: this.$filters.moneyCurrency(data.shippingFee)
              },
              {
                title: '应付金额',
                value: this.$filters.moneyCurrency(data.orderAmount)
              },
              {
                title: '实付金额',
                value: this.$filters.moneyCurrency(data.payAmount)
              },
              {
                title: '优惠券优惠金额',
                value: this.$filters.moneyCurrency(data.discountAmount)
              }
            ]
          },
          {
            title: '收货信息',
            value: [
              {
                title: '收货地址',
                value: data.linkmanAddress
              },
              {
                title: '收货人姓名',
                value: data.linkmanName
              },
              {
                title: '收货人联系电话',
                value: data.linkmanPhone
              },
              {
                title: '邮编',
                value: data.postalCode
              }
            ]
          },
          {
            title: '物流信息',
            value: [
              {
                title: '物流公司',
                value: data.company
              },
              {
                title: '物流单号',
                value: data.number
              },
              {
                title: '物流状态',
                value: this.$enums.LogisticsStatus.getName(data.logisticsStatus)
              }
            ]
          }
        ]
      } catch (e) {}
    }
  }
}
</script>
<style lang="sass" scoped>
.container
  &-infoBox
    @include ver
    border-bottom: 1px solid #DCDFE6
    padding: 35px 0 27px 15px
    &-title
      font-size: 14px
      font-family: OPPOSans-Bold, OPPOSans
      font-weight: 700
      color: rgba(0,0,0,0.9)
      line-height: 22px
    &-value
      @include hor
      align-items: center
      margin-top: 10px
      span
        font-size: 14px
        font-family: OPPOSans-Regular, OPPOSans
        font-weight: 400
        color: rgba(0,0,0,0.9)
        line-height: 22px
      span:nth-child(1)
        text-align: right
        width: 100px
      span:nth-child(2)
        margin-left: 79px
</style>