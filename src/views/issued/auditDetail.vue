<template>
  <div>
    <div class="base-topBtn">
      <el-button type="primary" @click="onBack">
        返回发行审核
      </el-button>
    </div>
    <div class="base-form" v-loading="domLoading">
      <el-form
        :model="form"
        ref="form"
        label-position="left"
        label-width="150px"
      >
        <el-form-item label="发行名称：" prop="publisherName">
          <el-input
            v-model="form.publisherName"
            placeholder="请输入"
            :disabled="!isDetail"
          />
        </el-form-item>
        <el-form-item label="发行Logo：" prop="publisherLogo">
          <yc-image-uploader
            ref="logo-cover"
            v-model="form.publisherLogo"
            :showTips="false"
            :disabled="!isDetail"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="所在城市：" prop="cityName">
          <el-input
            v-model="form.cityName"
            placeholder=""
            :disabled="!isDetail"
          ></el-input>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input
            v-model="form.address"
            placeholder="请输入"
            :disabled="!isDetail"
          />
        </el-form-item>
        <el-form-item label="联系电话：" prop="telephone">
          <el-input
            v-model="form.telephone"
            placeholder="请输入"
            :disabled="!isDetail"
          />
        </el-form-item>
        <el-form-item label="微信号：" prop="wxNumber">
          <el-input
            v-model="form.wxNumber"
            placeholder="请输入"
            :disabled="!isDetail"
          />
        </el-form-item>
        <el-form-item label="发行申请状态：" prop="publisherApplyStatus">
          <el-select
            v-model="form.publisherApplyStatus"
            placeholder=""
            :disabled="!isDetail"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              :key="item.value"
              v-for="item in $enums.PublisherApplyStatus.list"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="审核时间："
          prop="auditTime"
          v-if="form.publisherApplyStatus !== 'WAIT_AUDIT'"
        >
          <el-input
            v-model="form.auditTime"
            placeholder="请输入"
            :disabled="!isDetail"
          />
        </el-form-item>
        <el-form-item
          label="审核人："
          prop="adminName"
          v-if="form.publisherApplyStatus !== 'WAIT_AUDIT'"
        >
          <el-input
            v-model="form.adminName"
            placeholder="请输入"
            :disabled="!isDetail"
          />
        </el-form-item>
        <el-form-item
          label="审核意见："
          prop="auditRemark"
          v-if="form.publisherApplyStatus === 'NO_PASS'"
        >
          <el-input
            v-model="form.auditRemark"
            placeholder="请输入"
            :disabled="!isDetail"
            style="width: 800px"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 10 }"
          />
        </el-form-item>
        <!-- <div class="content-submit">
          <el-button
            type="primary"
            @click="doHandle(form, 'processed')"
            v-if="form.publisherApplyStatus === 'WAIT_AUDIT'"
            >通过</el-button
          >
          <el-button
            @click="doHandle(form, 'reject')"
            v-if="form.publisherApplyStatus === 'WAIT_AUDIT'"
            >驳回</el-button
          >
        </div> -->
      </el-form>
    </div>
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
const FORM = {
  id: null /* 主键Id */,
  publisherName: null /* 发行商名称 */,
  publisherLogo: null /* 发行商Logo */,
  cityId: null /* 城市Id */,
  cityName: null /* 城市名称 */,
  address: null /* 详细地址 */,
  telephone: null /* 联系电话 */,
  wxNumber: null /* 微信号 */,
  publisherApplyStatus: null /* 发行申请状态：WAIT_AUDIT|PASS|NO_PAS */,
  auditTime: null /* 审核时间 */,
  adminName: null /* 审核人 */,
  auditRemark: null /* 审核意见 */
}
export default {
  data (vm) {
    return {
      form: this.$_.cloneDeep(FORM),
      isDetail: false,
      visible: false,
      loading: false,
      props: null,
      type: null,
      auditRemark: null,
      subLoading: false,
      areaList: [],
      domLoading: false
    }
  },
  mounted () {
    this.initDetailData()
  },
  methods: {
    onBack(){
      this.$router.push({
        name: 'issuedAudit'
      })
    },
    async initDetailData () {
      this.domLoading = true
      try {
        let data = await this.$api.publisherApplyGetPublisherApplyWithPc({
          id: this.$route.query.id
        })
        if (!this.$_.isEmpty(data.publisherLogo)) {
          this.$refs['logo-cover'].setFileList(data.publisherLogo)
        }
        this.form = this.$_.cloneDeep(data)
      } finally {
        this.domLoading = false
      }
    },
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
          this.initDetailData()
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped></style>
