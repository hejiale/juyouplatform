<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doDetail(props)" v-if="$powers('/publishApply/getPublisherApplyWithPc')">查看</el-button>
        <!-- <el-button
          type="text"
          @click="doHandle(props, 'processed')"
          v-if="$powers('/publishApply/handlePublisherApply')"
          >通过</el-button
        >
        <el-button
          type="text"
          @click="doHandle(props, 'reject')"
          v-if="$powers('/publishApply/handlePublisherApply')"
          >驳回</el-button
        > -->
      </template>
    </yc-table>
    <el-dialog title="审核意见" :visible.sync="visible">
      <el-input
        v-model="auditRemark"
        placeholder=""
        type="textarea"
        :autosize="{ minRows: 8, maxRows: 8 }"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doSubmit" :loading="loading"
          >确 定</el-button
        >
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data (vm) {
    return {
      props: null,
      type: null,
      auditRemark: null,
      loading: false,
      visible: false,
      table: {
        api: this.$api.publisherApplyQueryPublisherApplyPage,
        query: {},
        searchData: [
          {
            title: '名称',
            type: 'input',
            model: 'keywords',
            placeholder: '请输入'
          },
          {
            title: '审核状态',
            type: 'select',
            model: 'publisherApplyStatus',
            enumType: 'PublisherApplyStatus',
            placeholder: '请选择'
          },
          {
            title: '申请日期',
            type: 'dateSection',
            modelName: ['startTime', 'endTime']
          }
        ],
        columns: [
          {
            title: '发行商名称',
            key: 'publisherName',
            showTooltip: true
          },
          {
            title: '发行Logo',
            key: 'publisherLogo',
            width: 140,
            showTooltip: true,
            isImage: true
          },
          {
            title: '城市名称',
            key: 'cityName',
            showTooltip: true
          },
          {
            title: '详细地址',
            key: 'address',
            showTooltip: true
          },
          {
            title: '联系电话',
            key: 'telephone',
            showTooltip: true
          },
          {
            title: '微信号',
            key: 'wxNumber'
          },
          {
            title: '审核状态',
            key: 'publisherApplyStatus',
            enumType: 'PublisherApplyStatus',
            showTooltip: true,
            render (h, ctx) {
              return h(
                'span',
                {
                  style: {
                    color:
                      ctx.row.publisherApplyStatus === 'WAIT_AUDIT'
                        ? '#D98C32'
                        : ctx.row.publisherApplyStatus === 'PASS'
                        ? '#36971E'
                        : '#B93131'
                  }
                },
                vm.$enums.PublisherApplyStatus.getName(
                  ctx.row.publisherApplyStatus
                )
              )
            }
          },
          {
            title: '操作',
            render (h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      }
    }
  },
  methods: {
    handleClose () {
      this.props = null
      this.type = null
      this.auditRemark = ''
      this.visible = false
    },
    doHandle (props, type) {
      if (props.publisherApplyStatus !== 'WAIT_AUDIT') {
        this.$message.warning('该申请已经经过处理')
        return
      }
      this.props = props
      this.type = type
      if (this.type === 'processed') {
        this.auditRemark = null
        this.doSubmit()
      } else {
        this.visible = true
      }
    },
    doDetail (props) {
      this.$router.push({
        name: 'issuedAuditDetail',
        query: {
          id: props.id
        }
      })
    },
    doSubmit () {
      let txt = null
      if (this.type === 'processed') {
        txt = '同意'
      } else {
        txt = '驳回'
      }
      this.$confirm(`此操作将发行申请${txt}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.publisherApplyHandlePublisherApply({
            id: this.props.id,
            publisherApplyStatus:
              this.type === 'processed' ? 'PASS' : 'NO_PASS',
            auditRemark: this.auditRemark
          })
          this.$message({
            type: 'success',
            message: `${txt}成功!`
          })
          this.handleClose()
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped></style>
