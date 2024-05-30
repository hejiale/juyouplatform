<template>
  <div>
    <title-info
      v-if="!hideTitle"
      title="基础信息"
      btnText="返回发行库"
      @onBack="onBack"
    />
    <div class="base-form" v-loading="domLoading">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-position="left"
        label-width="180px"
      >
        <el-form-item label="发行名称：" prop="publisherName">
          <el-input
            v-model="form.publisherName"
            placeholder="请输入"
            :disabled="isDetail"
          />
        </el-form-item>
        <el-form-item label="发行Logo：" prop="publisherLogo">
          <yc-image-uploader
            ref="logo-cover"
            v-model="form.publisherLogo"
            :showTips="false"
            :disabled="isDetail"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="所在城市：" prop="areaId">
          <el-cascader
            v-model="areaId"
            @change="(value) => cascaderChange(value)"
            :options="areaList"
            :props="{
              label: 'regionName',
              value: 'id',
              children: 'subRegionList'
            }"
            placeholder="请选择"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input
            v-model="form.address"
            placeholder="请输入"
            :disabled="isDetail"
          />
        </el-form-item>
        <el-form-item label="联系电话：" prop="telephone">
          <el-input
            v-model="form.telephone"
            placeholder="请输入"
            :disabled="isDetail"
          />
        </el-form-item>
        <el-form-item label="微信号：">
          <el-input
            v-model="form.wxNumber"
            placeholder="请输入"
            :disabled="isDetail"
          />
        </el-form-item>
        <el-form-item label="企业名称：" prop="businessName">
          <el-input
            v-model="form.businessName"
            :placeholder="isDetail ? '' : '请输入'"
            :disabled="isDetail"
          />
        </el-form-item>
        <el-form-item label="营业执照：" prop="businessLicense">
          <yc-image-uploader
            ref="license-cover"
            v-model="form.businessLicense"
            :disabled="isDetail"
            :showTips="!isDetail"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="统一社会信用代码：" prop="enterpriseCreditCode">
          <el-input
            v-model="form.enterpriseCreditCode"
            :placeholder="isDetail ? '' : '请输入'"
            :disabled="isDetail"
          />
        </el-form-item>
        <el-form-item label="营业执照是否长期有效：" prop="isLongTime">
          <el-select v-model="form.isLongTime" placeholder="请输入">
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
            style="width: 375px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发行简介：">
          <tinymce ref="editor" v-model="form.context" :disabled="isDetail" />
        </el-form-item>
        <div class="content-submit">
          <el-button
            type="primary"
            @click="doSubmit"
            :loading="subLoading"
            v-if="!isDetail"
            >提交</el-button
          >
          <el-button type="primary" plain @click="$router.back()"
            >返回</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import titleInfo from '@partial/title-info'
import tinymce from '@partial/tinymce'
const FORM = {
  publisherName: null,
  publisherLogo: null,
  provinceId: null,
  cityId: null,
  districtId: null,
  address: null,
  telephone: null,
  wxNumber: null,
  context: null,
  isLongTime: false,
  businessName: null,
  businessLicense: null
}
export default {
  props: {
    hideTitle: {
      type: Boolean,
      default: false
    },
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  components: {
    titleInfo,
    tinymce
  },
  data(vm) {
    const validatePhone = (rule, value, callback) => {
      if (!vm.$_.isEmpty(value)) {
        let reg = /^1[3456789]\d{9}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'))
        }
        callback()
      } else {
        callback(new Error('请输入手机号'))
      }
    }
    const validateWxNumber = (rule, value, callback) => {
      if (!vm.$_.isEmpty(value)) {
        let reg = /^[^\u4e00-\u9fa5]+$/
        if (!reg.test(value)) {
          callback(new Error('微信号不支持中文输入'))
        }
        callback()
      } else {
        callback(new Error('请输入微信号'))
      }
    }
    const validatorDateRang = (rules, value, callback) => {
      if (vm.isDetail) {
        return callback()
      }
      if (!vm.form.isLongTime) {
        if (vm.daterange && vm.daterange.length === 2) {
          callback()
        } else {
          callback(new Error('请选择营业执照期限日期 ！！'))
        }
      } else {
        callback()
      }
    }
    const validatorCity = (rules, value, callback) => {
      if (!this.areaId.length) {
        callback(new Error('请选择所在城市！'))
      } else {
        callback()
      }
    }
    return {
      form: this.$_.cloneDeep(FORM),
      rules: {
        publisherName: {
          required: true,
          message: '请输入发行名称',
          trigger: 'blur'
        },
        publisherLogo: {
          required: true,
          message: '请选择发行Logo',
          trigger: 'change'
        },
        areaId: {
          required: true,
          validator: validatorCity,
          trigger: 'change'
        },
        wxNumber: {
          required: true,
          validator: validateWxNumber,
          trigger: ['blur', 'change']
        },
        address: { required: true, message: '请输入详细地址', trigger: 'blur' },
        telephone: {
          required: true,
          validator: validatePhone,
          trigger: ['blur', 'change']
        },
        businessLicense: {
          required: true,
          message: '请选择营业执照',
          trigger: 'change'
        },
        enterpriseCreditCode: {
          required: true,
          message: '请填写统一社会信用代码',
          trigger: 'blur'
        },
        businessName: {
          required: true,
          message: '请填写企业名称',
          trigger: 'blur'
        },
        isLongTime: {
          required: true,
          message: '请选择营业执照是否长期有效',
          trigger: 'blur'
        },
        daterange: {
          type: 'date',
          required: true,
          validator: validatorDateRang,
          trigger: 'change'
        },
        context: {
          required: true,
          message: '请输入发行简介',
          trigger: 'blur'
        }
      },
      subLoading: false,
      areaList: [],
      areaId: [],
      domLoading: false,
      daterange: []
    }
  },
  computed: {
    isEdit() {
      return this.$route.query.id
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    async refresh() {
      await this.initAreaData()

      if (this.isDetail || this.$route.query.id) {
        this.domLoading = true
        await this.initDetailData()
      }
    },
    onBack() {
      this.$router.push({
        name: 'issuedInfo'
      })
    },
    async initDetailData() {
      try {
        let data = await this.$api.publisherGetPublisher({
          id: this.$route.query.id
        })
        this.areaId = [data.provinceId, data.cityId, data.districtId]
        this.form = this.$_.cloneDeep(data)
        if (!data.isLongTime) {
          if (data.validFromDate && data.validToDate) {
            this.daterange = [data.validFromDate, data.validToDate]
          }
        }

        if (!this.$_.isEmpty(data.publisherLogo)) {
          this.$refs['logo-cover'].setFileList(data.publisherLogo)
        }
        if (!this.$_.isEmpty(data.businessLicense)) {
          this.$refs['license-cover'].setFileList(data.businessLicense)
        }
      } finally {
        this.domLoading = false
      }
    },
    //  获取地区集联数据
    async initAreaData() {
      this.areaList = await this.$api.regionQueryRegionCascadeList({
        regionType: 'AREA'
      })
    },
    cascaderChange(val) {
      if (val.length) {
        this.form.provinceId = val[0]
        this.form.cityId = val[1]
        this.form.districtId = val[2]
      } else {
        this.form.provinceId = null
        this.form.cityId = null
        this.form.districtId = null
      }
    },
    doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.subLoading = true

        if (this.form.isLongTime) {
          this.form.validFromDate = null
          this.form.validToDate = null
        } else {
          this.form.validFromDate = this.$dayjs(this.daterange[0]).format(
            'YYYY-MM-DD 00:00:00'
          )
          this.form.validToDate = this.$dayjs(this.daterange[1]).format(
            'YYYY-MM-DD 00:00:00'
          )
        }

        try {
          let api = null
          if (this.isEdit) {
            api = 'publisherUpdatePublisher'
          } else {
            api = 'publisherAddPublisher'
          }
          await this.$api[api](this.form)
          this.$message.success(this.isEdit ? '编辑成功' : '新增成功')
          if (!this.isEdit) {
            this.$utils.routeBack('/issued/info')
          }
        } finally {
          this.subLoading = false
        }
      })
    }
  }
}
</script>

<style scoped></style>
