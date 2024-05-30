<template>
  <div class="container" v-if="activity">
    <span>发放店铺</span>
    <!-- <yc-table :table="allStoreTable" :hideTableTitle="true" ref="allStoreTable" :isAutoLoad="false" v-if="activity.activity.isAllStore">
    </yc-table> -->
    <yc-table :table="selectStoreTable" :hideTableTitle="true" ref="selectStoreTable" :isAutoLoad="false">
    </yc-table>
    <span>优惠券</span>
    <yc-table :table="table" ref="myTable" :isAutoLoad="false" :isShowPagination="false">
      <template slot="time" slot-scope="props">
        <div class="timeBox">
          <span>起：{{ props.useStartTime }}</span>
          <span>终：{{ props.useEndTime }}</span>
        </div>
      </template>
    </yc-table>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: Number
    }
  },
  data(vm) {
    return {
      table: {
        showSpan: false,
        hidenTitle: true,
        api: this.$api.couponMarketingActivityQueryCouponMarketingActivityPage,
        query: {},
        columns: [
          {
            title: '优惠券名称',
            key: 'couponName'
          },
          {
            title: '名称备注',
            key: 'couponRemark'
          },
          {
            title: '有效时间',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.time(ctx.row))
            }
          },
          {
            title: '发放总数',
            key: 'totalNum'
          },
          {
            title: '每店发放数量',
            key: 'storeCouponLimitNum'
          }
        ]
      },
      allStoreTable: {
        api: this.$api.storeQueryStorePage,
        query: {
          storeStatus: 'ENABLED',
          storeEnterStatus: 'ENTERED',
        },
        searchData: [
          {
            title: '店铺名称',
            type: 'input',
            model: 'keywords',
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
            title: '店铺标签',
            type: 'input',
            model: 'tagKeywords',
            placeholder: '请输入'
          }
        ],
        columns: [
          {
            title: '店铺ID',
            key: 'id'
          },
          {
            title: '店铺名称',
            key: 'storeName'
          },
          {
            title: '所在城市',
            key: 'cityName'
          },
          {
            title: '联系电话',
            key: 'telephone'
          },
          {
            title: '店铺微信',
            key: 'wxNumber'
          }
        ]
      },
      selectStoreTable: {
        api: this.$api.couponActivityStoreQueryPage,
        query: {
          // storeStatus: 'ENABLED',
          // storeEnterStatus: 'ENTERED',
          activityId: this.id
        },
        searchData: [
          {
            title: '店铺名称',
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
            title: '店铺标签',
            type: 'input',
            model: 'tagKeywords',
            placeholder: '请输入'
          }
        ],
        columns: [
          {
            title: '店铺ID',
            key: 'storeId'
          },
          {
            title: '店铺名称',
            key: 'storeName'
          },
          {
            title: '所在城市',
            key: 'cityName'
          },
          {
            title: '联系电话',
            key: 'telephone'
          },
          {
            title: '店铺微信',
            key: 'wxNumber'
          }
        ]
      },
      activity: null
    }
  },
  created() {
    this.getInfoDetail()
  },
  mounted() {
    this.initAreaData()
  },
  watch: {
    id() {
      this.activity = null;
      this.selectStoreTable.query['activityId'] = this.id;
      this.getInfoDetail()
    }
  },
  methods: {
    async getInfoDetail() {
      try {
        let activity =
          await this.$api.couponMarketingActivityGetCouponMarketingActivity({
            id: this.id
          })
        this.activity = activity;
        this.table.data = activity.activityCouponInfoItemList

        this.$nextTick((_) => {
          // if(this.activity.activity.isAllStore){
          //   this.$refs.allStoreTable.refresh();
          // }else{
            this.$refs.selectStoreTable.refresh(); 
          // }
          this.$refs.myTable.update()
        })
      } catch (e) {}
    },
    //  获取地区集联数据
    async initAreaData() {
      // this.allStoreTable.searchData[1].option =
      //   await this.$api.regionQueryRegionCascadeList({})
      this.selectStoreTable.searchData[1].option =
        await this.$api.regionQueryRegionCascadeList({})
    },
  }
}
</script>
<style lang="sass" scoped>
.container
.timeBox
  @include ver
</style>