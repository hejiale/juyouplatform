<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="buttons">
        <div class="base-topBtn" v-if="$powers('/couponAutoSend/add')">
          <el-button type="primary" @click="onAddNew"
            >创建自动发券（消费促活）</el-button
          >
        </div>
      </template>
      <template slot="formToTime" slot-scope="props">
        <div v-if="props.activityStartTime && props.activityEndTime">
          起：{{ props.activityStartTime }}
        </div>
        <div v-if="props.activityStartTime && props.activityEndTime">
          终：{{ props.activityEndTime }}
        </div>
        <div v-else>—</div>
      </template>
      <template slot="status" slot-scope="props">
        <div class="table-row-status" v-if="props.activityStatus">
          <span
            :class="
              props.activityStatus === 'IN_PROGRESS'
                ? 'table-row-status-enable'
                : props.activityStatus === 'CREATED'
                ? 'table-row-status-disable'
                : 'table-row-status-unPass'
            "
          >
            {{ $enums.ActivityStatus.getName(props.activityStatus) }}
          </span>
        </div>
        <div v-else>—</div>
      </template>
      <template slot="action" slot-scope="props">
        <el-button
          type="text"
          @click="onRecord(props)"
          v-if="
            (props.activityStatus == 'IN_PROGRESS' ||
            props.activityStatus == 'FINISHED') && $powers('/couponAutoSend/getSendRecord')
          "
          >发放记录</el-button
        >
        <el-button
          type="text"
          @click="onEnd(props.id)"
          v-if="props.activityStatus == 'IN_PROGRESS' && $powers('/couponAutoSend/end')"
          >结束活动</el-button
        >
        <el-button
          type="text"
          @click="onEdit(props.id)"
          v-if="props.activityStatus == 'CREATED' && $powers('/couponAutoSend/update')"
          >编辑</el-button
        >
        <el-button
          type="text"
          @click="onStart(props)"
          v-if="props.activityStatus == 'CREATED' && $powers('/couponAutoSend/start')"
          >开始活动</el-button
        >
        <el-button
          type="text"
          @click="onClone(props.id)"
          v-if="props.activityStatus == 'FINISHED' && $powers('/couponAutoSend/add')"
          >复制</el-button
        >
        <el-button
          type="text"
          class="reject"
          @click="onDelete(props.id)"
          v-if="
            (props.activityStatus == 'IN_PROGRESS' ||
            props.activityStatus == 'FINISHED') && $powers('/couponAutoSend/delete')
          "
          >删除</el-button
        >
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
        api: this.$api.couponAutoSendList,
        query: {},
        searchData: [
          {
            title: '活动名称',
            type: 'input',
            model: 'activityName',
            placeholder: '请输入'
          },
          {
            title: '状态',
            type: 'select',
            model: 'activityStatus',
            placeholder: '请选择',
            enumType: 'ActivityStatus'
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
            showTooltip: true,
            width: 300
          },
          {
            title: '活动时间',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.formToTime(ctx.row))
            }
          },
          {
            title: '状态',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.status(ctx.row))
            }
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
        name: 'addMarketToolAuto'
      })
    },
    onRecord(prop) {
      this.$router.push({
        name: 'record',
        params: {
          activityType: 'ACTIVITY_GET_COUPON',
          activityName: prop.activityName,
          id: prop.id
        }
      })
    },
    onEdit(id) {
      this.$router.push({
        name: 'editMarketToolAuto',
        query: {
          id
        }
      })
    },
    onEnd(id) {
      this.$confirm(`确认结束该活动吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        showClose: false
      }).then(async () => {
        await this.$api.couponAutoSendEnd({
          id
        })
        this.$refs.myTable.refresh()
      })
    },
    onClone(id) {
      this.$router.push({
        name: 'addMarketToolAuto',
        query: {
          id,
          isCopy: true
        }
      })
    },
    onDelete(id) {
      this.$confirm(`确认删除该条数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        showClose: false
      }).then(async () => {
        await this.$api.couponAutoSendDelete({
          id
        })
        this.$message.success('操作成功')
        this.$refs.myTable.refresh()
      })
    },
    onStart(props) {
      if(new Date().getTime() > new Date(props.activityStartTime).getTime()){
        this.$confirm(`确认开始该优惠券吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          showClose: false
        }).then(async () => {
          await this.$api.couponAutoSendStart({
            id: props.id
          })
          this.$message.success('操作成功')
          this.$refs.myTable.refresh()
        })
      }else{
        this.$message.error('起始时间大于当前时间')
      }
    },
    //撤回
    onRecall(id) {
      this.$confirm(`此次发放活动中，未使用的优惠券将被作废`, '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        showClose: false
      }).then(async () => {
        await this.$api.couponMarketingActivityCancellationCouponMarketingActivity(
          {
            id
          }
        )
        this.$message.success('操作成功')
        this.$refs.myTable.refresh()
      })
    }
  }
}
</script>
<style lang="sass"></style>
