<template>
  <yc-table :table="table" ref="myTable">
    <template slot="action" slot-scope="props">
      <template>
        <el-button
          v-if="props.commonApplyStatus === 'PLATFORM_PENDING'"
          type="text"
          @click="goDetail(props, 'manage')"
          >处理</el-button
        >
        <el-button v-else type="text" @click="goDetail(props, 'view')"
          >查看</el-button
        >
      </template>
    </template>
  </yc-table>
</template>

<script>
export default {
  components: {},
  data(vm) {
    return {
      table: {
        api: this.$api.merchantApplyList,
        query: {},
        searchData: [
          // {
          //   title: '商户号',
          //   type: 'input',
          //   model: 'lianlianUserNo',
          //   placeholder: '请输入'
          // },
          {
            title: '商户名称',
            type: 'input',
            model: 'merchantName',
            placeholder: '请输入'
          },
          {
            title: '店铺名称',
            type: 'input',
            model: 'storeName',
            placeholder: '请输入'
          },
          {
            title: '省市',
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
            title: '审核状态',
            type: 'select',
            model: 'commonApplyStatus',
            enumType: 'CommonApplyStatus',
            placeholder: '请选择'
          }
        ],
        columns: [
          {
            title: '商户名称',
            key: 'merchantName'
          },
          {
            title: '关联店铺',
            key: 'storeName'
          },
          {
            title: '店铺省市区',
            key: 'storeAddress'
          },
          {
            title: '审核状态',
            key: 'commonApplyStatus',
            enumType: 'CommonApplyStatus'
          },
          {
            title: '操作',
            width: '180px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      }
    }
  },
  created() {
    //  获取地区集联数据
    this.initAreaData()
  },
  activated() {
    this.$store.commit('setAuditDetail', {})
  },
  methods: {
    goDetail(props, type) {
      this.$store.commit('setAuditDetail', props)

      if (props.lianlianApplyType === 'BUSINESS') {
        this.$router.push({
          name: 'businessAuditDetail',
          query: {
            type
          }
        })
      } else {
        this.$router.push({
          name: 'MerchantAuditDetail',
          query: {
            type
          }
        })
      }
    },
    backRoute() {
      this.$router.back()
    },
    //  获取地区集联数据
    async initAreaData() {
      this.table.searchData[2].option =
        await this.$api.regionQueryRegionCascadeList({})
    }
  }
}
</script>

<style scoped></style>
