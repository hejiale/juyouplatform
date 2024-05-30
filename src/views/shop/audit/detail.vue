<template>
  <div>
    <title-info title="基础信息" btnText="返回店铺审核" @onBack="onBack" />
    <div class="base-form">
      <el-form
        :model="form"
        ref="form"
        label-position="left"
        label-width="180px"
      >
        <el-form-item label="店铺名称：">
          <el-input v-model="form.storeName" disabled />
        </el-form-item>
        <el-form-item label="店铺Logo：">
          <yc-image-uploader
            ref="logo-cover"
            v-model="form.storeLogo"
            disabled
            :showTips="false"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="所在城市：">
          <el-cascader
            v-model="form.areaId"
            :options="areaList"
            :props="{
              label: 'regionName',
              value: 'id',
              children: 'subRegionList'
            }"
            placeholder="请选择"
            clearable
            disabled
          ></el-cascader>
        </el-form-item>
        <el-form-item label="申请人ID：">
          <el-input v-model="form.applicantId" disabled />
        </el-form-item>
        <el-form-item label="申请人手机号：">
          <el-input v-model="form.telephone" disabled />
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="form.address" disabled />
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="form.telephone" disabled />
        </el-form-item>
        <el-form-item label="微信号：">
          <el-input v-model="form.wxNumber" disabled />
        </el-form-item>
        <el-form-item label="门头照：" prop="storeDoorstep">
          <yc-image-uploader
            ref="door-cover"
            v-model="form.storeDoorstep"
            disabled
            :showTips="false"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="企业名称：">
          <el-input v-model="form.businessName" disabled />
        </el-form-item>
        <el-form-item label="法定代表：" prop="legalPerson">
          <el-input v-model="form.legalPerson" disabled />
        </el-form-item>
        <el-form-item label="营业执照：">
          <yc-image-uploader
            ref="license-cover"
            v-model="form.businessLicense"
            uploadMultiple
            disabled
            :showTips="false"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="营业执照是否长期有效：" prop="isLongTime">
          <el-select v-model="form.isLongTime" disabled>
            <el-option
              v-for="item in $enums.Bool.list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="营业执照有效期："
          v-if="!form.isLongTime"
          prop="daterange"
        >
          <el-date-picker
            v-model="daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
            style="width: 375px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="数据来源：">
          <el-select v-model="form.dataSource" disabled>
            <el-option
              v-for="item in $enums.DataSource.list"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核时间：" v-if="form.auditTime">
          <el-input v-model="form.auditTime" disabled />
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select v-model="form.storeApplyStatus" disabled>
            <el-option
              v-for="item in $enums.StoreApplyStatus.list"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人：" v-if="form.auditorAccountName">
          <el-input v-model="form.auditorAccountName" disabled />
        </el-form-item>
        <el-form-item label="审核时间：" v-if="form.auditTime">
          <el-input v-model="form.auditTime" disabled />
        </el-form-item>
        <el-form-item label="审核意见：" v-if="form.auditRemark">
          <el-input
            type="textarea"
            :rows="2"
            v-model="form.auditRemark"
            disabled
          />
        </el-form-item>

        <template>
          <div class="content-submit" v-if="form.storeApplyStatus === 'WAIT_AUDIT'">
            <el-button
              type="primary"
              @click="doPass"
              v-if="$powers('/storeApply/passStoreApply')"
              >通过</el-button
            >
            <el-button
              type="primary"
              plain
              @click="doNoPass"
              v-if="$powers('/storeApply/rejectStoreApply')"
              >不通过</el-button
            >
          </div>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script>
import titleInfo from '@partial/title-info'
import tinymce from '@partial/tinymce'
const FORM = {
  storeName: null,
  storeLogo: null,
  provinceId: null,
  cityId: null,
  address: null,
  telephone: null,
  wxNumber: null,
  license: null,
  content: null
}
export default {
  components: {
    titleInfo,
    tinymce
  },
  data() {
    return {
      form: this.$_.cloneDeep(FORM),
      subLoading: false,
      areaList: [],
      daterange: []
    }
  },
  activated() {
    this.initAreaData()
    this.initDetailData()
  },
  methods: {
    onBack() {
      this.$router.push({
        name: 'shopAudit'
      })
    },
    async initDetailData() {
      let data = await this.$api.storeApplyGetStoreApply({
        id: this.$route.query.id
      })
      data.areaId = [data.provinceId, data.cityId]

      if (!data.isLongTime) {
        if (data.validFromDate && data.validToDate) {
          this.daterange = [data.validFromDate, data.validToDate]
        }
      }

      if (!this.$_.isEmpty(data.storeLogo)) {
        this.$refs['logo-cover'].setFileList(data.storeLogo)
      }
      if (!this.$_.isEmpty(data.businessLicense)) {
        this.$refs['license-cover'].setFileList(data.businessLicense)
      }
      if (!this.$_.isEmpty(data.storeDoorstep)) {
        this.$refs['door-cover'].setFileList(data.storeDoorstep)
      }

      this.form = this.$_.cloneDeep(data)
    },
    //  获取地区集联数据
    async initAreaData() {
      this.areaList = await this.$api.regionQueryRegionCascadeList({})
    },
    doPass() {
      this.$confirm(`您确定审核通过吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$api.storeApplyPassStoreApply({
          id: this.$route.query.id,
          auditorAdminId: JSON.parse(sessionStorage.getItem('user')).loginId
        })
        this.$message.success('操作成功')
        this.initDetailData()
      })
    },
    doNoPass() {
      this.$prompt('请输入不通过理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPattern: /\S/,
        inputErrorMessage: '不通过理由不能为空！'
      }).then(async ({ value }) => {
        await this.$api.storeApplyRejectStoreApply({
          id: this.$route.query.id,
          auditRemark: value,
          auditorAdminId: JSON.parse(sessionStorage.getItem('user')).loginId
        })
        this.$message.success('操作成功')
        this.initDetailData()
      })
    }
  }
}
</script>

<style scoped>
</style>
