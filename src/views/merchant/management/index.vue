<template>
  <yc-table :table="table" ref="myTable">
    <template slot="action" slot-scope="props">
      <template>
       <el-button type="text" @click="goDetail(props)"
          >查看</el-button
        >
        <el-button v-if="props.merchantStatus === 'ENABLED' && $powers('')" type="text" @click="goEnable(props, 'DISABLED')"
          >禁用</el-button
        >
        <el-button v-if="$powers('')" type="text" @click="goEnable(props, 'ENABLED')"
          >启用</el-button
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
        api: this.$api.merchantList,
        query: {},
        searchData: [
          {
            title: '商户号',
            type: 'input',
            model: 'lianlianUserNo',
            placeholder: '请输入'
          },
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
            title: '激活状态',
            type: 'select',
            model: 'activate',
            enumType: 'ApplyActivate',
            placeholder: '请选择'
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
        ],
        columns: [
          {
            title: '商户号',
            key: 'lianlianUserNo'
          },
          {
            title: '商户名称',
            key: 'merchantName'
          },
          {
            title: '关联店铺',
            key: 'storeName'
          },
          {
            title: '佣金费率',
            key: 'splitFeeRate'
          },
          {
            title: '状态',
            key: 'merchantStatus',
            enumType: 'NewMerchantStatus'
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
    this.initAreaData();
  },
  methods: {
    goDetail(props) {
        this.$store.commit('setManagementDetail',props)
        this.$router.push({
          name: 'MerchantManagementDetail',
        })
    },
    backRoute() {
      this.$router.back()
    },
    async goEnable(list,type){
       this.$confirm(
          `是否${type === 'ENABLED' ? '启用' : '禁用'} ?`,
          '提示',
          {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }
        )
        .then(async () => {
          await this.$api.updateMerchantStatus({
            merchantId: list.id,
            merchantStatus:type
          })
          this.$message({
            type: 'success',
            message: `操作成功!`
          })
           this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
     //  获取地区集联数据
    async initAreaData() {
      this.table.searchData[4].option =
        await this.$api.regionQueryRegionCascadeList({});
    },
  }
}
</script>

<style scoped></style>
