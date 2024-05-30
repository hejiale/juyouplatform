<template>
  <div>
    <yc-table :table="table" ref="myTable" class="order-manage__table">
      <template slot="buttons">
        <el-button type="primary" @click="exportOrder">导出</el-button>
      </template>
      <template slot="orderLogistics" slot-scope="props">
        <a v-if="props.orderLogistics" :href="`https://www.baidu.com/s?wd=${props.orderLogistics.company}${props.orderLogistics.number}`" target="_blank">{{ props.orderLogistics.company }}/{{ props.orderLogistics.number }}</a>
      </template>
      <template slot="storeName" slot-scope="props">
        <span v-if="props.storeId">{{props.storeName}}/{{props.storeId}}</span>
        <span v-else>—</span>
      </template>
      <template slot="action" slot-scope="props">
        <template>
          <el-button type="text" @click="goDetail(props.id)" v-if="$powers('/order/m-detail')">详情</el-button>
          <el-button
            type="text"
            @click="goReturnMoney(props)"
            v-if="(props.orderStatus == 'PAYED' || props.orderStatus == 'USED') && $powers('/order/m-refund') && props.productType !== 'LP_MATCH_COUNT_FEE_PRODUCT' && props.productType !== 'LP_MEMBERSHIP_PRODUCT' && props.productType !== 'LP_ACTIVITY_PRODUCT'"
            >退款</el-button
          >
        </template>
      </template>
    </yc-table>
    <el-dialog
      title="订单详情"
      :visible.sync="detailDialogVisible"
      @close="detailDialogVisible = false"
      width="600px"
      center
    >
      <dialogContent :hideFooter="true">
        <template slot="content">
          <detail :id="id" ref="detail" />
        </template>
      </dialogContent>
      <template slot="footer">
        <el-button type="info" @click="detailDialogVisible = false"
          >关闭</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import dialogContent from '@global/dialog'
import detail from './components/detail.vue'
export default {
  components: { dialogContent, detail },
  data() {
    const vm = this
    return {
      href: '',
      id: null,
      table: {
        api: this.$api.orderMList,
        query: {},
        searchData: [
          {
            title: '商品名称',
            type: 'input',
            model: 'productName',
            placeholder: '请输入'
          },
          {
            title: '所属店铺',
            type: 'input',
            model: 'storeName',
            placeholder: '请输入'
          },
          {
            title: '所在城市',
            type: 'cascader',
            modelName: ['provinceId', 'cityId'],
            option: [],
            props: {
              checkStrictly: true,
              label: 'regionName',
              value: 'id',
              children: 'subRegionList'
            },
            placeholder: '请选择'
          },
          {
            title: '所属商户',
            type: 'select',
            model: 'merchantName'
          },
          {
            title: '订单状态',
            type: 'select',
            model: 'orderStatus',
            enumType: 'OrderStatus'
          },
          {
            title: '商品类型',
            type: 'select',
            model: 'productType',
            enumType: 'ProductType'
          },
          {
            title: '平台订单号',
            type: 'input',
            model: 'orderNum',
            placeholder: '请输入'
          },
          {
            title: '是否使用优惠券',
            type: 'select',
            model: 'useCoupon',
            enumType: 'Bool'
          },
          {
            title: '创建时间',
            type: 'dateSection',
            modelName: ['startTime', 'endTime']
          }
        ],
        columns: [
          {
            title: '平台订单号',
            key: 'orderNum'
          },
          {
            title: '商品名称',
            key: 'productName',
            showTooltip: true
          },
          {
            title: '商品类型',
            key: 'productType',
            enumType: 'ProductType'
          },
          {
            title: '应付金额',
            key: 'orderAmount',
            render(h, ctx) {
              return h('span', {}, '￥' + ctx.row.orderAmount / 100)
            }
          },
          {
            title: '优惠金额',
            key: 'discountAmount',
            render(h, ctx) {
              return h('span', {}, '￥' + ctx.row.discountAmount / 100)
            }
          },
          {
            title: '实付金额',
            key: 'payAmount',
            render(h, ctx) {
              return h('span', {}, '￥' + ctx.row.payAmount / 100)
            }
          },
          {
            title: '来源店铺/店铺ID',
            key: 'storeName',

            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.storeName(ctx.row))
            }
          },
          {
            title: '买家手机号',
            key: 'buyerPhone'
          },
          {
            title: '订单状态',
            key: 'orderStatus',
            enumType: 'OrderStatus'
          },
          {
            title: '创建时间',
            key: 'createdTime'
          },
          {
            title: '操作',
            fixed: 'right',
            width: 100,
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      detailDialogVisible: false
    }
  },
  mounted() {
    this.initAreaData()
  },
  methods: {
    //  获取地区集联数据
    async initAreaData() {
      this.table.searchData[2].option =
        await this.$api.regionQueryRegionCascadeList({})
    },
    goDetail(id) {
      this.id = id
      this.detailDialogVisible = true
      this.$nextTick(() => {
        this.$refs.detail.queryDetailData()
      })
    },
    goReturnMoney(props) {
      this.$confirm(`是否确认退款?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.orderMRefund({
            id: props.id
          })

          this.$message.success('退款成功')
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
    async exportOrder(){
      this.table.loading = true;
      this.table.loadingText = "导出中..."
      let element = document.createElement('a')
      this.$exportFileStream({
        url: '/order/export',
        query: {
          ...this.table.query,
          pageSize: 1,
          pageNo: 1
        }
      }).then((response) => {
        let blob = new Blob([response.data])
        let href = window.URL.createObjectURL(blob)
        element.href = href
        let fileName = null
        //  获取filename
        let contentDisposition = response.headers['content-disposition']
        if (contentDisposition && contentDisposition.indexOf('filename=')) {
          let name = contentDisposition.split('filename=')[1]
          fileName = decodeURIComponent(escape(name))
        }
        element.download = fileName
        element.click()
        URL.revokeObjectURL(href)
        this.table.loading = false;
        this.table.loadingText = null;
      })
    }
  }
}
</script>

<style lang="sass">
.order-manage__table
  .el-table__body-wrapper::-webkit-scrollbar
    width: 6px
    height: 10px
    background-color: rgba(240, 240, 240, 1)
    display: block

</style>
