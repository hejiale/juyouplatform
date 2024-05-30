<template>
  <div>
    <el-radio-group v-model="radio">
      <el-radio-button label="待审核"></el-radio-button>
      <el-radio-button label="已审核"></el-radio-button>
    </el-radio-group>
    <yc-table :table="table" ref="myTable">
      <template slot="seq" slot-scope="props">
        {{ props.index + (table.pagination.pageNo - 1) * 10 + 1 }}
      </template>
      <template slot="action" slot-scope="props">
        <el-button
          type="danger"
          @click="doReject(props.lpUserId)"
          v-if="$powers('/lpUserMatchAudit/audit') && radio === '待审核'"
          >拒绝</el-button
        >
        <el-button
          type="primary"
          @click="doPass(props.lpUserId)"
          v-if="$powers('/lpUserMatchAudit/audit') && radio === '待审核'"
          >通过</el-button
        >
      </template>
    </yc-table>
  </div>
</template>
  <script>
export default {
  components: {},
  data(vm) {
    return {
      /*表单*/
      table: {
        api: this.$api.lpUserMatchAuditList,
        query: {
          lpMatchApplyStatus: ['WAIT_AUDIT']
        },
        columns: [
          {
            title: '序号',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.seq(ctx))
            },
            width: 100
          },
          {
            title: '头像',
            key: 'avatar',
            isImage: true
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '性别',
            key: 'sex',
            enumType: 'Sex'
          },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '上传时间',
            key: 'avatarUploadTime'
          },
          {
            title: '相册',
            key: 'albumUrls',
            isImage: true
          },
          {
            title: '状态',
            key: 'lpMatchApplyStatus',
            enumType: 'PublisherApplyStatus'
          },
          {
            title: '审核',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      canDo: false,
      radio: '待审核',
    }
  },
  watch: {
    radio() {
      this.$nextTick((_) => {
        this.table.query.lpMatchApplyStatus = this.radio === '待审核' ? ['WAIT_AUDIT']:['NO_PASS','PASS'];
        this.$refs.myTable.refresh()
      })
    }
  },
  mounted() {},
  methods: {
    async doReject(id) {
      this.$confirm(`此操作将拒绝该数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.lpUserMatchAuditAudit({
            lpUserId: id,
            lpMatchApplyStatus: 'NO_PASS'
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
    async doPass(id) {
      this.$confirm(`此操作将通过该数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.lpUserMatchAuditAudit({
            lpUserId: id,
            lpMatchApplyStatus: 'PASS'
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="sass" scoped>
</style>
  