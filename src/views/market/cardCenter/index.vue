<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="onAddNew" v-if="$powers('/coupon/addCoupon')">新增优惠券模板</el-button>
        </div>
      </template>
      <template slot="cutPrice" slot-scope="props">
        {{ $enums.CouponType.getName(props.couponType)
        }}{{ props.cutPrice / 100 }}元
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
            {{ $enums.UserStatus.getName(props) }}
          </span>
        </div>
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="onDetail(props.id)" v-if="$powers('/coupon/detail')">详情</el-button>
        <el-button
          type="text"
          v-if="props.enableStatus === 'DISABLED' && $powers('/coupon/disableCoupon')"
          @click="onEnable(props.id)"
          >启用</el-button
        >
        <el-button
          type="text"
          @click="onForbidden(props.id)"
          v-if="props.enableStatus === 'ENABLED' && $powers('/coupon/enableCoupon')"
          >禁用</el-button
        >
        <el-button type="text" class="reject" @click="onDelete(props.id)" v-if="$powers('/coupon/deleteCoupon')"
          >删除</el-button
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
        api: this.$api.couponQueryCouponPageByPage,
        query: {},
        searchData: [
          {
            title: '优惠券名称',
            type: 'input',
            model: 'couponName',
            placeholder: '请输入'
          },
          {
            title: '商品类型',
            type: 'select',
            model: 'productType',
            placeholder: '请选择',
            enumType: 'ProductType'
          },
          {
            title: '创建时间',
            type: 'dateSection',
            modelName: ['startTime', 'endTime']
          },
          {
            title: '状态',
            type: 'select',
            model: 'enableStatus',
            placeholder: '请选择',
            enumType: 'UserStatus'
          }
        ],
        columns: [
          {
            title: '优惠券名称',
            key: 'couponName',
            showTooltip: true
          },
          {
            title: '折扣类型',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.cutPrice(ctx.row))
            }
          },
          {
            title: '备注',
            key: 'remark',
            showTooltip: true
          },
          {
            title: '创建人',
            key: 'creatorName'
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '状态',
            key: 'couponStatus',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.status(ctx.row.enableStatus)
              )
            }
          },
          {
            title: '操作',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      }
    }
  },
  methods: {
    onAddNew() {
      this.$router.push({
        name: 'addCard'
      })
    },
    //禁用
    onForbidden(id) {
      this.$confirm(
        `禁用后此优惠券无法在营销工具内引用，但不影响已经领取此种优惠券的店家使用`,
        '是否禁用',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false
        }
      ).then(async () => {
        try {
          await this.$api.couponDisableCoupon({ id })
          this.$message.success('操作成功')
          this.$refs.myTable.refresh()
        } catch (e) {}
      })
    },
    //删除
    onDelete(id) {
      this.$confirm(`是否确认删除该卡券?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      }).then(async () => {
        try {
          await this.$api.couponDeleteCoupon({ id })
          this.$message.success('操作成功')
          this.$refs.myTable.refresh()
        } catch (e) {}
      })
    },
    onDetail(id) {
      this.$router.push({
        name: 'detailCard',
        query: {
          id
        }
      })
    },
    //启用
    async onEnable(id) {
      try {
        await this.$api.couponEnableCoupon({ id })
        this.$message.success('操作成功')
        this.$refs.myTable.refresh()
      } catch (e) {}
    }
  }
}
</script>
<style lang="sass"></style>
