<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="buttons" v-if="$powers('/LpActivity/add')">
        <div class="base-topBtn" @click="onAdd">
          <el-button type="primary">新增活动</el-button>
        </div>
      </template>
      <template slot="seq" slot-scope="props">
        {{ props.index + (table.pagination.pageNo - 1) * 10 + 1 }}
      </template>
      <template slot="lpActivityStatus" slot-scope="props">
        <div class="statusButtons" v-if="$powers('/LpActivity/status')">
          <el-button type="primary" @click="onOpenBook(props.id, 'REGISTRATION_OPEN')" v-if="!props.lpActivityStatus">开始报名</el-button>
          <el-button type="danger" @click="onOpenBook(props.id, 'REGISTRATION_CLOSED')" v-if="props.lpActivityStatus === 'REGISTRATION_OPEN'">结束报名</el-button>
          <el-button type="warning" @click="onOpenBook(props.id, 'REGISTRATION_OPEN')" v-if="props.lpActivityStatus === 'REGISTRATION_CLOSED'">继续报名</el-button>
          <el-button type="success" @click="onOpenBook(props.id, 'EVENT_STARTED')" v-if="props.lpActivityStatus === 'REGISTRATION_CLOSED'">开始活动</el-button>
          <el-button type="danger" @click="onOpenBook(props.id, 'EVENT_ENDED')" v-if="props.lpActivityStatus === 'EVENT_STARTED'">结束活动</el-button>
        </div>
      </template>
      <template slot="regCount" slot-scope="props">
        <el-link type="primary" @click="onGoUserList(props.id)">{{ props.regCount }}</el-link>
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doUpdate(props.id)" v-if="$powers('/LpActivity/update')">编辑</el-button>
      </template>
    </yc-table>
  </div>
</template>
<script>
export default {
  data(vm) {
    return {
      table: {
        api: this.$api.LpActivityList,
        searchData: [],
        columns: [
          {
            title: '序号',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.seq(ctx))
            }
          },
          {
            title: '活动名称',
            key: 'title'
          },
          {
            title: '日期',
            key: 'regStartTime'
          },
          {
            title: '状态',
            key: 'lpActivityStatus',
            enumType: 'LpActivityStatus'
          },
          {
            title: '报名人数',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.regCount(ctx.row))
            }
          },
          {
            title: '活动状态',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.lpActivityStatus(ctx.row))
            }
          },
          {
            title: '操作',
            fixed: 'right',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      }
    }
  },
  methods: {
    onAdd() {
      this.$router.push({
        name: 'LpActivityAdd'
      })
    },
    doUpdate(id) {
      this.$router.push({
        name: 'LpActivityUpdate',
        query:{
          id
        }
      })
    },
    onGoUserList(id){
      this.$router.push({
        name: 'LpActivityUser',
        query:{
          id
        }
      })
    },
    async onOpenBook(id, lpActivityStatus){
      await this.$api.updateLpActivityStatus(
        { id, lpActivityStatus}
      )
      this.$refs.myTable.refresh();
    }
  }
}
</script>
<style lang="sass" scoped>
.statusButtons
  @include hor
  align-items: center
  justify-content: center
</style>