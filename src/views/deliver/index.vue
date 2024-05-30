<template>
  <div>
    <yc-table :table="table" ref="myTable" class="order-manage__table">
      <template slot="orderLogistics" slot-scope="props">
        <a v-if="props.company || props.number" :href="`https://www.baidu.com/s?wd=${props.company}${props.number}`" target="_blank">{{ props.company }}/{{ props.number }}</a>
      </template>
      <template slot="action" slot-scope="props">
        <template>
          <el-button type="text" @click="goDeliver(props)" v-if="!props.number && $powers('/orderLogistics/deliverGoods')">发货</el-button>
          <el-button type="text" @click="goUpdateDeliver(props)" v-if="props.number && $powers('/orderLogistics/updateLogistics')"
            >修改物流</el-button
          >
          <el-button type="text" @click="goDetail(props.logisticId)" v-if="$powers('/orderLogistics/queryOrderLogisticsDetail')">详情</el-button>
        </template>
      </template>
    </yc-table>
    <el-dialog
      title="发货"
      :visible.sync="deliverDialogVisible"
      @close="onCloseDeliver"
      width="500px"
      center
    >
      <dialogContent @on-cancel="onCloseDeliver" @on-sure="onCompleteSave">
        <template slot="content">
          <div class="editBox">
            <el-form
              :model="form"
              :rules="rules"
              ref="form"
              label-position="right"
              label-width="200px"
            >
              <el-form-item label="商品类别" class="mb0">
                <span>{{
                  $enums.ProductType.getName(form.productType)
                }}</span>
              </el-form-item>
              <el-form-item label="商品名称" class="mb0">
                <span>{{ form.productName }}</span>
              </el-form-item>
              <el-form-item label="收货地址" class="mb0">
                <span
                  >{{ form.provinceName }}{{ form.cityName
                  }}{{ form.districtName || ''
                  }}{{ form.linkmanAddress }}</span
                >
              </el-form-item>
              <el-form-item label="收货人姓名" class="mb0">
                <span>{{ form.linkmanName }}</span>
              </el-form-item>
              <el-form-item label="收货人联系电话" class="mb0">
                <span>{{ form.linkmanPhone }}</span>
              </el-form-item>
              <el-form-item label="物流公司" prop="company">
                <el-input v-model="form.company" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="物流单号" prop="number">
                <el-input v-model="form.number" placeholder="请输入" />
              </el-form-item>
            </el-form>
            <span class="editBox-note">若商品为票房本申领，发货后将自动赠送此店铺测本券</span>
          </div>
        </template>
      </dialogContent>
    </el-dialog>
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
        api: this.$api.queryOrderLogisticsPage,
        query: {},
        searchData: [
          {
            title: '平台订单号',
            type: 'input',
            model: 'orderNo',
            placeholder: '请输入'
          },
          {
            title: '商品名称',
            type: 'input',
            model: 'productName',
            placeholder: '请输入'
          },
          {
            title: '物流状态',
            type: 'select',
            model: 'logisticsStatus',
            enumType: 'LogisticsStatus'
          },
          {
            title: '商品类型',
            type: 'select',
            model: 'productType',
            enumType: 'ProductType'
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
            key: 'orderNo',
            fixed: true,
            width: 180
          },
          {
            title: '商品名称',
            key: 'productName',
            width: 150,
            showTooltip: true
          },
          {
            title: '商品类型',
            key: 'productType',
            enumType: 'ProductType'
          },
          {
            title: '收货人姓名',
            key: 'linkmanName'
          },
          {
            title: '收货人联系电话',
            key: 'linkmanPhone'
          },
          {
            title: '收货地址',
            key: 'linkmanAddress',
            width: 150
          },
          {
            title: '物流公司/单号',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.orderLogistics(ctx.row)
              )
            },
            width: 120
          },
          {
            title: '物流状态',
            key: 'logisticsStatus',
            enumType: 'ShippingFee'
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: '150',
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
      detailDialogVisible: false,
      deliverDialogVisible: false,
      form: {},
      rules: {
        company: {
          required: true,
          message: '请输入物流公司',
          trigger: 'blur'
        },
        number: {
          required: true,
          message: '请输入物流单号',
          trigger: 'blur'
        }
      },
      canSubmit: false
    }
  },

  methods: {
    goDetail(id) {
      this.id = id
      this.detailDialogVisible = true
      this.$nextTick(() => {
        this.$refs.detail.queryDetailData()
      })
    },
    goDeliver(order) {
      this.deliverDialogVisible = true
      this.form = JSON.parse(JSON.stringify(order));
      this.form['isUpdate'] = false;
    },
    goUpdateDeliver(order) {
      this.deliverDialogVisible = true
      this.form = JSON.parse(JSON.stringify(order));
      this.form['isUpdate'] = true;
    },
    onCloseDeliver(){
      this.$refs.form.clearValidate();
      this.form = {};
      this.deliverDialogVisible = false;
    },
    onCompleteSave(){
      this.$refs.form.validate(async (valid) => {
        if(!valid)return;

        if(this.canSubmit)return;
        this.canSubmit = true;

        try{
          if(this.form.isUpdate){
            await this.$api.updateLogistics(this.form)
          }else{
            await this.$api.deliverGoods(this.form)
          }
          this.$refs.myTable.refresh();
          this.onCloseDeliver();
          this.canSubmit = false
        }catch(e){
          this.canSubmit = false
        }
      })
    },
  }
}
</script>
<style>
.el-form-item__label{
  padding-right: 20px !important;
}
</style>
<style lang="sass">
.order-manage__table
  .el-table__body-wrapper::-webkit-scrollbar
    width: 6px
    height: 10px
    background-color: rgba(240, 240, 240, 1)
    display: block
.editBox
  @include ver
  align-items: center
  &-note
    color: #14c9c9
</style>
