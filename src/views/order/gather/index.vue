<template>
  <div>
    <yc-table :table="table" ref="myTable" class="order-manage__table">
      <template slot="playNum" slot-scope="props">
        {{props.realMaleGamerNum + props.realFemaleGamerNum + props.botMaleGamerNum + props.botFemaleGamerNum}}
      </template>
      <template slot="action" slot-scope="props">
        <template>
          <el-button
            type="text"
            @click="goDetail(props)"
            v-if="$powers('/order/m-detail')"
            >查看详情</el-button
          >
          <el-button
            type="text"
            v-if="props.gatherStatus === 'GATHERING' && $powers('/gathering/cancelGathering')"
            @click="onCloseGather(props.id)"
            >关闭组局</el-button
          >
        </template>
      </template>
    </yc-table>
    <el-dialog
      :visible.sync="dialogVisible"
      title="组局详情"
      width="700px"
      center
    >
      <dialogContent :hideFooter="true">
        <template slot="content">
          <yc-table :table="detailTable" ref="detailTable" class="order-manage__table" :isShowPagination="false" :isAutoLoad="false">
            <template slot="playNum" slot-scope="props">
              {{ props.maleGamerNum + props.femaleGamerNum }}
            </template>
            <template slot="action" slot-scope="props">
              <el-button
                type="text"
                @click="onCancelOrder(props.orderId)"
                v-if="props.orderStatus === 'PAYED'"
                >取消订单</el-button
              >
            </template>
          </yc-table>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>
<script>
import dialogContent from '@global/dialog'
export default {
  components: { dialogContent },
  data() {
    const vm = this
    return {
      table: {
        api: this.$api.queryGatheringListPage,
        query: {},
        searchData: [
          {
            title: '店铺名称',
            type: 'input',
            model: 'storeName',
            placeholder: '请输入'
          },
          {
            title: '剧本名称',
            type: 'input',
            model: 'dramaName',
            placeholder: '请输入'
          },
          {
            title: '开场时间',
            type: 'dateSection',
            modelName: ['gameStartTimeFrom', 'gameStartTimeTo']
          },
          {
            title: '所在区域',
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
            title: '组局状态',
            type: 'select',
            model: 'gatherStatus',
            enumType: 'GatherStatusType'
          },
          {
            title: '创建时间',
            type: 'dateSectionTwo',
            modelName: ['createTimeFrom', 'createTimeTo']
          }
        ],
        columns: [
          {
            title: '剧本名称',
            key: 'dramaName',
            width: 180
          },
          {
            title: '店铺名/店铺ID',
            key: 'storeName',
            width: 150,
            showTooltip: true
          },
          {
            title: '所在城市',
            key: 'cityName',
            width: 150,
            showTooltip: true
          },
          {
            title: '组局状态',
            key: 'gatherStatus',
            enumType: 'GatherStatusType',
            width: 150
          },
          {
            title: '锁车状态',
            key: 'gatherLockStatus',
            enumType: 'GatherLockStatus',
            width: 150
          },
          {
            title: '组局人数',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.playNum(ctx.row))
            },
          },
          {
            title: '是否反串',
            key: 'isRevertSex',
            enumType: 'Bool',
            width: 150
          },
          {
            title: '备注',
            key: 'content',
            width: 150
          },
          {
            title: '开场时间',
            key: 'gameStartTime',
            width: 150
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 150
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
      detailTable: {
        hidenTitle: true,
        query: {},
        searchData: [],
        columns: [
          {
            title: '玩家UID',
            key: 'userId',
            width: 180
          },
          {
            title: '玩家昵称',
            key: 'nickName',
            width: 150,
            showTooltip: true
          },
          {
            title: '人数',
            width: 150,
            render(h, ctx) {
              return h('div', vm.$refs.detailTable.$scopedSlots.playNum(ctx.row))
            },
          },
          {
            title: '订单号',
            key: 'orderNum',
            width: 180,
            showTooltip: true
          },
          {
            title: '订单状态',
            key: 'orderStatus',
            enumType: 'OrderStatus',
            width: 150
          },
          // {
          //   title: '来源',
          //   key: 'productType',
          //   width: 150
          // },
          {
            title: '操作',
            fixed: 'right',
            width: 100,
            render(h, ctx) {
              return h('div', vm.$refs.detailTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      dialogVisible: false
    }
  },
  mounted() {
    this.initAreaData()
  },
  methods: {
    //  获取地区集联数据
    async initAreaData() {
      this.table.searchData[3].option =
        await this.$api.regionQueryRegionCascadeList({})
    },
    goDetail(item) {
      this.dialogVisible = true;
      if(item.gatheringMemberItemList){
        this.$nextTick(_=>{
          this.detailTable.data = item.gatheringMemberItemList;
          this.$refs.detailTable.update();
        })
      }
    },
    async onCancelOrder(id){
      try{
        await this.$api.orderMRefund({
          id
        })
        this.dialogVisible = false;
        this.$refs.myTable.refresh();
      }catch(e){}
    },
    async onCloseGather(id){
      try{
        await this.$api.cancelGathering({id})
        this.$refs.myTable.refresh();
      }catch(e){}
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
