<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" v-if="$powers('/product/create')" @click="doAdd">新增商品</el-button>
        </div>
      </template>
      <template slot="productType" slot-scope="props">
        {{ $enums.ProductType.getName(props.productType) }}
      </template>
      <template slot="currentPrice" slot-scope="props">
        {{ props.currentPrice ? props.currentPrice / 100 : '免费' }}
      </template>
      <template slot="isPutOn" slot-scope="props">
        <el-switch
          v-model="props.isPutOn"
          active-color="#0052D9"
          inactive-color="#DCDFE6"
          @change="changeIsPutOn(props)"
          v-if="$powers('/product/putOnOff')"
        >
        </el-switch>
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" v-if="$powers('/product/update')" @click="doEdit(props)">编辑</el-button>
        <el-button type="text" v-if="$powers('/product/delete')" class="reject" @click="doDelete(props.id)"
          >删除</el-button
        >
        <el-button type="text" v-if="$powers('/product/configVisibility')" @click="showTransfer(props.id)"
          >可见店铺</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      title="选择商品类型"
      :visible.sync="productTypeDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="400px"
      center
    >
      <dialogContent
        @on-back="handleClose"
        @on-cancel="handleClose"
        @on-sure="doSubmit"
      >
        <template slot="content">
          <el-select v-model="productType" placeholder="请选择">
            <el-option
              v-for="i in $enums.ProductType.list"
              :label="i.label"
              :value="i.value"
              :key="i.value"
            />
          </el-select>
        </template>
      </dialogContent>
    </el-dialog>
    <el-dialog
      title="添加可见店铺"
      :visible.sync="storeDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="1000px"
      center
    >
      <dialogContent
        @on-back="handleCloseStore"
        @on-cancel="handleCloseStore"
        @on-sure="doSubmitStore"
      >
        <template slot="content">
          <transfer
            ref="transfer"
            :id="id"
            @on-success-save="onSuccessSave"
            @on-close-transfer="onCloseTransfer"
          />
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
import dialogContent from '@global/dialog'
import transfer from './components/transfer.vue'
export default {
  components: { dialogContent, transfer },
  data(vm) {
    return {
      table: {
        api: this.$api.productGetList,
        query: {},
        searchData: [
          {
            title: '商品名称',
            type: 'input',
            model: 'productName',
            placeholder: '请输入'
          },
          {
            title: '商品分类',
            type: 'select',
            model: 'productType',
            enumType: 'ProductType',
            placeholder: '请选择'
          }
        ],
        columns: [
          {
            title: '商品分类',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.productType(ctx.row)
              )
            }
          },
          {
            title: '商品名称',
            key: 'productName',
            showTooltip: true
          },
          {
            title: '商品副标题',
            key: 'subTitle',
            showTooltip: true
          },
          {
            title: '商品现售价',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.currentPrice(ctx.row)
              )
            }
          },
          {
            title: '上架状态',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.isPutOn(ctx.row))
            }
          },
          {
            title: '创建时间',
            key: 'createdTime'
          },
          {
            title: '操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      id: null,
      productTypeDialogVisible: false,
      storeDialogVisible: false,
      productType: null
    }
  },
  methods: {
    doAdd() {
      this.productType = null;
      this.productTypeDialogVisible = true
    },
    async changeIsPutOn(props) {
      await this.$api.productPutOnOff({
        id: props.id,
        isPutOn: props.isPutOn
      })
      this.$refs.myTable.refresh()
    },
    doEdit(item) {
      this.$router.push({
        name: 'CommodityMagtEdit',
        query: {
          productType: item.productType,
          id: item.id
        }
      })
    },
    doDelete(id) {
      this.$confirm(`此操作将删除该商品, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.productDelete({
            id
          })
          this.$message({
            type: 'success',
            message: `删除成功!`
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
    showTransfer(id) {
      this.id = id
      this.storeDialogVisible = true
      this.$nextTick(async () => {
        await this.$refs.transfer.getTransferLeftData()
        await this.$refs.transfer.getTransferRightData()
      })
    },
    doSubmit() {
      if (!this.productType) {
        this.$message.warning('请选择商品类型')
        return
      }
      this.$router.push({
        name: 'CommodityMagtAdd',
        query: {
          productType: this.productType
        }
      })
      this.productTypeDialogVisible = false
    },
    handleClose() {
      this.productType = null
      this.productTypeDialogVisible = false
    },
    doSubmitStore() {
      this.$refs.transfer.doSubmitAdd()
    },
    handleCloseStore() {
      this.$refs.transfer.doCancel()
    },
    onSuccessSave() {
      this.storeDialogVisible = false
      this.$refs.myTable.refresh()
    },
    onCloseTransfer() {
      this.storeDialogVisible = false
    }
  }
}
</script>
<style lang="sass"></style>
