<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="buttons" v-if="$powers('/store/addStore')">
        <div class="base-topBtn">
          <el-button
            type="primary"
            @click="doAdd"
            v-if="$powers('/store/addStore')"
            >添加店家</el-button
          >
        </div>
      </template>
      <template slot-scope="props" slot="copyCodetext">
        <button
          @click="copyCode"
          :data-clipboard-text="props"
          id="copyCodetext"
          class="copyButton textTable"
          ref="copy"
        >
          {{ props }}
        </button>
      </template>
      <template slot="city" slot-scope="props">
        <span>{{ props.provinceName }}{{ props.cityName }}</span>
      </template>
      <template slot="status" slot-scope="props">
        <div class="table-row-status">
          <span
            :class="
              props === 'ENABLED'
                ? 'table-row-status-enable'
                : 'table-row-status-disable'
            "
          >
            {{ $enums.EnableStatus.getName(props) }}
          </span>
        </div>
      </template>
      <template slot="action" slot-scope="props">
        <el-button
          type="text"
          @click="doDetail(props.id, 'base')"
          v-if="$powers('/store/updateStoreDetail')"
          >编辑</el-button
        >
        <el-button
          type="text"
          @click="doDetail(props.id, 'team')"
          v-if="$powers('/store/updateStoreDetail')"
          >团队管理</el-button
        >
        <el-button
          v-if="
            props.storeStatus === 'ENABLED' && $powers('/store/disableStore')
          "
          type="text"
          @click="doOperate(props.id, 'disable')"
          >禁用</el-button
        >
        <el-button
          v-if="
            props.storeStatus === 'DISABLED' && $powers('/store/enableStore')
          "
          type="text"
          @click="doOperate(props.id, 'enable')"
          >启用</el-button
        >
        <el-button
          v-if="$powers('/store/commitGaoDe') && props.storeGaoDeStatus !== 'AUDIT_PASS'"
          type="text"
          @click="doSubmitGaode(props.id)"
          v-loading="loadingId === props.id"
          >提交高德</el-button
        >
      </template>
    </yc-table>
    <el-dialog title="店铺二维码" :visible.sync="visibleEwm" width="350px">
      <img :src="qrCode" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
export default {
  components: {},
  data(vm) {
    return {
      table: {
        api: this.$api.storeQueryStorePage,
        query: {
          isDelete: false
        },
        searchData: [
          {
            title: '店铺名称',
            type: 'input',
            model: 'storeNameKeyword',
            placeholder: '请输入'
          },
          {
            title: '对外编号',
            type: 'input',
            model: 'storeNumber',
            placeholder: '请输入'
          },
          {
            title: '企业名称',
            type: 'input',
            model: 'businessNameKeyword',
            placeholder: '请输入'
          },
          {
            title: '统一企业社会信用代码',
            type: 'input',
            model: 'enterpriseCreditCodeKeyword',
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
            title: '店铺状态',
            type: 'select',
            model: 'enableStatus',
            enumType: 'EnableStatus',
            placeholder: '请选择'
          }
        ],
        columns: [
          {
            title: '店铺ID',
            key: 'id',
            width: 110,
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.copyCodetext(ctx.row.id)
              )
            }
          },
          {
            title: '对外编号',
            key: 'storeNumber',
            width: 100
          },
          {
            title: '店铺名称',
            key: 'storeName',
            width: 150,
            showTooltip: true
          },
          {
            title: '门店LOGO',
            key: 'storeLogo',
            width: 100,
            isImage: true
          },
          {
            title: '所在城市',
            width: 140,
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.city(ctx.row))
            },
            showTooltip: true
          },
          {
            title: '详细地址',
            key: 'address',
            showTooltip: true,
            width: 260
          },
          {
            title: '联系电话',
            key: 'telephone',
            width: 110
          },
          {
            title: '店铺微信',
            key: 'wxNumber',
            showTooltip: true,
            width: 150
          },
          {
            title: '店铺状态',
            width: 110,
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.status(ctx.row.storeStatus)
              )
            }
          },
          {
            title: '高德入驻状态',
            key: 'storeGaoDeStatus',
            showTooltip: true,
            width: 150
          },
          {
            title: '操作',
            fixed: 'right',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      visibleEwm: false,
      qrCode: null,
      loadingId: null
    }
  },
  mounted() {
    this.initAreaData()
  },
  methods: {
    copyCode() {
      let clipboard = new Clipboard('#copyCodetext')
      clipboard.on('success', (e) => {
        this.$message.success('复制成功')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        // 不支持复制
        Message({
          message: '该浏览器不支持自动复制',
          type: 'warning'
        })
        // 释放内存
        clipboard.destroy()
      })
    },
    //  获取地区集联数据
    async initAreaData() {
      this.table.searchData[4].option =
        await this.$api.regionQueryRegionCascadeList({})
    },
    doAdd() {
      this.$router.push({
        name: 'shopInfoAdd'
      })
    },
    doDetail(id, type) {
      this.$router.push({
        path: '/shop/info/details',
        query: {
          id,
          type
        }
      })
    },
    //  禁用/启用/删除
    doOperate(id, type) {
      this.$confirm(
        `此操作将${this.operateTxt(type)}该数据, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          let api = null
          if (type === 'disable') {
            api = 'storeDisableStore'
          } else if (type === 'enable') {
            api = 'storeEnableStore'
          } else if (type === 'delete') {
            api = 'storeDeleteStore'
          }
          await this.$api[api]({ id })
          this.$message({
            type: 'success',
            message: `${this.operateTxt(type)}成功!`
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
    operateTxt(val) {
      switch (val) {
        case 'disable':
          return '禁用'
        case 'enable':
          return '启用'
        default:
          return val
      }
    },
    async viewEwm(qrCode) {
      this.qrCode = qrCode
      this.visibleEwm = true
    },
    async doSubmitGaode(id){
      this.loadingId = id;
      try{
        await this.$api.commitGaoDe({id});
        this.loadingId = null;
        this.$refs.myTable.refresh()
      }catch(e){
        this.loadingId = null;
      }
    }
  }
}
</script>

<style lang="sass"></style>
