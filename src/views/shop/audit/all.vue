<template>
  <yc-table :table="table" ref="myTable" class="order-manage__table">
    <template slot="applyStatus" slot-scope="props">
      <div class="table-row-status">
          <span
            :class="
              props === 'PASS'
                ? 'table-row-status-enable'
                : props === 'WAIT_AUDIT' ? 'table-row-status-waitAudit':'table-row-status-unPass'
            "
          >
            {{ $enums.StoreApplyStatus.getName(props) }}
          </span>
        </div>
    </template>
    <template slot="city" slot-scope="props">
      <span class="textTable"
        >{{ props.provinceName }}-{{ props.cityName }}</span
      >
    </template>
    <template slot="action" slot-scope="props">
      <el-button
        type="text"
        @click="doDetail(props.id, props.storeApplyStatus)"
        v-if="$powers('/storeApply/queryStoreApplyDetail')"
        >查看</el-button
      >
    </template>
  </yc-table>
</template>
<script>
export default {
  data (vm) {
    return {
      table: {
        api: this.$api.storeApplyQueryStoreApplyPage,
        query: {},
        searchData: [
          {
            title: '店铺名称',
            type: 'input',
            model: 'storeNameKeyword',
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
            title: '申请时间',
            type: 'dateSection',
            modelName: ['applyStartTime', 'applyEndTime']
          },
          {
            title: '审批人',
            type: 'input',
            model: 'storeNameKeyword',
            placeholder: '请输入'
          },
          {
            title: '审核状态',
            type: 'select',
            model: 'storeApplyStatus',
            enumType: 'StoreApplyStatus',
            placeholder: '请选择'
          },
          {
            title: '统一社会信用代码',
            type: 'input',
            placeholder: '请选择',
            model: 'enterpriseCreditCodeKeyword'
          },
          {
            title: '企业名称',
            type: 'input',
            placeholder: '请选择',
            model: 'businessNameKeyword'
          },
        ],
        columns: [
          {
            title: '店铺名称',
            key: 'storeName',
            width: 120
          },
          {
            title: '门店Logo',
            key: 'storeLogo',
            isImage: true,
            width: 120
          },
          {
            title: '所在城市',
            render (h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.city(ctx.row))
            },
            width: 150
          },
          {
            title: '详细地址',
            key: 'storeAddress',
            width: 180
          },
          {
            title: '联系电话',
            key: 'telephone',
            width: 120
          },
          {
            title: '店铺微信',
            key: 'wxNumber'
          },
          {
            title: '企业名称',
            key: 'businessName',
            width: 120
          },
          {
            title: '统一社会信用代码',
            key: 'enterpriseCreditCode',
            width: 180
          },
          {
            title: '申请渠道',
            key: 'dataSource',
            enumType: 'DataSource',
            width: 120
          },
          {
            title: '申请时间',
            key: 'createTime',
            width: 160
          },
          {
            title: '审批时间',
            key: 'auditTime',
            width: 140
          },
          {
            title: '审核状态',
            render (h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.applyStatus(
                  ctx.row.storeApplyStatus
                )
              )
            },
            width: 120
          },
          {
            title: '操作',
            render (h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            },
            fixed: 'right'
          }
        ]
      }
    }
  },
  mounted() {
    this.initAreaData()
  },
  methods: {
    //  获取地区集联数据
    async initAreaData() {
      this.table.searchData[1].option =
        await this.$api.regionQueryRegionCascadeList({})
    },
    doDetail (id, type) {
      this.$router.push({
        name: 'shopAuditDetail',
        query: {
          id,
          isAudit: type === 'WAIT_AUDIT'
        }
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

