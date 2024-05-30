<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="onAddNew" v-if="$powers('/couponActivity/addCouponMarketActivity')">创建发券</el-button>
        </div>
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="onRecord(props)" v-if="$powers('/couponActivity/getMarketingActivitySendDetail')">发放记录</el-button>
        <el-button type="text" @click="onRevocation(props.id)" v-if="$powers('/couponActivity/deleteCouponMarketingActivity')">撤回</el-button>
      </template>
    </yc-table>
    <el-dialog title="" width="1500px" :visible.sync="dialogVisible" center>
      <look :id="currentId" />
    </el-dialog>
  </div>
</template>

<script>
import titleInfo from '@partial/title-info'
import look from './look.vue'
export default {
  components: {
    titleInfo,
    look
  },
  data(vm) {
    return {
      table: {
        api: this.$api.couponActivityList,
        query: {},
        searchData: [
          {
            title: '活动名称',
            type: 'input',
            model: 'activityName',
            placeholder: '请输入'
          },
          {
            title: '审核状态',
            type: 'select',
            model: 'activityStatus',
            placeholder: '请选择',
            enumType: 'CustomActivityStatus'
          },
          {
            title: '创建时间',
            type: 'dateSection',
            modelName: ['createTimeFrom', 'createTimeTo']
          }
        ],
        columns: [
          {
            title: '活动名称',
            key: 'activityName',
            showTooltip: true
          },
          {
            title: '备注',
            key: 'remark',
            showTooltip: true,
            width: 300
          },
          {
            title: '状态',
            key: 'activityStatus',
            enumType: 'ActivityStatus'
          },

          {
            title: '创建人',
            width: 120,
            key: 'creatorName'
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '操作',
            width: '200px',
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
  methods: {
    onAddNew() {
      this.$router.push({
        name: 'addMarketTool'
      })
    },
    onRevocation(id) {
      this.$confirm(`确认撤回该优惠券吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        showClose: false
      }).then(async () => {
        await this.$api.couponActivityCouponActivityCompensateTicket({
          id
        })
        this.$message.success('操作成功')
        this.$refs.myTable.refresh()
      })
    },
    onRecord(prop) {
      this.$router.push({
        name: 'record',
        params: {
          activityType: 'DIRECT_RELEASE',
          activityName: prop.activityName
        }
      })
    }
  }
}
</script>
<style lang="sass"></style>
