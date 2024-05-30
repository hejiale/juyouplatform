<template>
  <div>
    <yc-table :table="table" ref="myTable" :isAutoLoad="false"  class="order-manage__table">
      <template slot="name" slot-scope="props">
        <span>{{ props.storeName }}</span>
        <span v-if="props.storeName && props.userName">/</span>
        <span>{{ props.userName }}</span>
        <span v-if="!props.storeName && !props.userName">—</span>
      </template>
      <template slot="city" slot-scope="props">
        <span
          >{{ props.storeProvinceName }}{{ props.storeCityName
          }}{{ props.storeDistrictName }}</span
        >
        <span
          v-if="
            !props.storeProvinceName &&
            !props.storeCityName &&
            !props.storeDistrictName
          "
          >—</span
        >
      </template>
      <template slot="user" slot-scope="props">
        <span v-if="props.consumerNickname && props.couponConsumerId">{{ props.consumerNickname }}/{{ props.couponConsumerId }}</span>
        <span v-else>—</span>
      </template>
      <template slot="formToTime" slot-scope="props">
        <div>起：{{ props.useStartTime || '—' }}</div>
        <div>终：{{ props.useEndTime || '—' }}</div>
      </template>
      <template slot="action" slot-scope="props">
        <el-button
          type="text"
          @click="onInvalidate(props.id)"
          v-if="props.useStatus == 'NOT_USED' && $powers('/couponTicket/invalidTicket')"
          >作废</el-button
        >
      </template>
    </yc-table>
  </div>
</template>

<script>
import titleInfo from '@partial/title-info'
export default {
  components: {
    titleInfo
  },
  data(vm) {
    return {
      table: {
        api: this.$api.couponActivityGetMarketingActivitySendDetail,
        query: {},
        searchData: [
          {
            title: '优惠活动',
            type: 'select',
            model: 'activityType',
            placeholder: '请选择',
            enumType: 'ActivityType'
          },
          {
            title: '活动名称',
            type: 'input',
            model: 'activityName',
            placeholder: '请输入'
          },
          {
            title: '优惠券名称',
            type: 'input',
            model: 'couponName',
            placeholder: '请输入'
          },
          {
            title: '获取时间',
            type: 'dateSection',
            modelName: ['getTimeFrom', 'getTimeTo']
          },
          {
            title: '核销时间',
            type: 'dateSectionTwo',
            modelName: ['useTimeFrom', 'useTimeTo']
          },
          {
            title: '订单号',
            type: 'input',
            model: 'orderNum',
            placeholder: '请输入'
          },
          {
            title: '状态',
            type: 'select',
            model: 'useStatus',
            placeholder: '请选择',
            enumType: 'UseStatus'
          },
          {
            title: '所在城市',
            type: 'cascader',
            modelName: ['provinceId', 'cityId', 'districtId'],
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
            title: '用户类型',
            type: 'select',
            model: 'targetType',
            placeholder: '请选择',
            enumType: 'TargetType'
          },
          {
            title: '持有店',
            type: 'inputRulesStore',
            model: 'storeName',
            placeholder: '请输入'
          },
          {
            title: '人名',
            type: 'inputRulesUser',
            model: 'userName',
            placeholder: '请输入'
          }
        ],
        columns: [
          {
            title: '优惠券名称',
            key: 'couponName',
            width: 200
          },
          {
            title: '状态',
            key: 'useStatus',
            enumType: 'UseStatus',
            width: 100
          },
          {
            title: '持有店/人名',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.name(ctx.row))
            },
            width: 100
          },
          {
            title: '城市',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.city(ctx.row))
            },
            width: 150
          },
          {
            title: '优惠活动',
            key: 'activityType',
            enumType: 'ActivityType',
            width: 150
          },
          {
            title: '活动名称',
            key: 'activityName',
            width: 200
          },
          {
            title: '使用人昵称/ID',
             width: 150,
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.user(ctx.row))
            }
          },
          {
            title: '使用人手机号',
            key: 'consumerPhone',
             width: 120
          },
          {
            title: '订单号',
            key: 'orderNum',
             width: 120
          },
          {
            title: '获取时间',
            key: 'createTime',
            width: 180
          },
          {
            title: '核销时间',
            key: 'useTime',
            width: 180
          },
          {
            title: '有效时间',
            key: 'creatorName',
            width: 200,
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.formToTime(ctx.row))
            }
          },
          {
            title: '操作',
            width: 100,
            fixed: 'right',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      dialogVisible: false,
      currentId: null
    }
  },
  activated() {
    this.getParamsData()
    this.initAreaData()
  },
  methods: {
    //  核心题材数据
    async initAreaData() {
      this.table.searchData[7].option =
        await this.$api.regionQueryRegionCascadeList({
          regionType: 'AREA'
        })
    },
    // params数据
    getParamsData() {
      if (this.$route.params.activityType) {
        this.table.query.activityName = this.$route.params.activityName
        this.table.query.activityType = this.$route.params.activityType
        this.table.query.activityId = this.$route.params.id
      }
      this.$refs.myTable.refresh()
    },
    onInvalidate(id) {
      this.$confirm(`确认作废该条数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        showClose: false
      }).then(async () => {
        await this.$api.couponTicketInvalidTicket({
          id
        })
        this.$message.success('操作成功')
        this.$refs.myTable.refresh()
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
