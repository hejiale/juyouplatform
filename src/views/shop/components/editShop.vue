<template>
  <div class="add">
    <title-info
      v-if="!hideTitle"
      title="基础信息"
      btnText="返回店铺"
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
        <el-form-item label="店铺类型：" prop="storeType">
          <el-select
            v-model="form.storeType"
            :placeholder="isDetail ? '' : '请输入'"
            :disabled="isDetail"
          >
            <el-option
              v-for="item in $enums.StoreType.list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺名称：" prop="storeName">
          <el-input
            v-model="form.storeName"
            placeholder="请输入"
            :maxLength="30"
            :disabled="isDetail"
          />
        </el-form-item>
        <el-form-item label="店铺Logo：" prop="storeLogo">
          <yc-image-uploader
            ref="logo-cover"
            v-model="form.storeLogo"
            :disabled="isDetail"
            :showTips="!isDetail"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="所在城市：">
          <span>{{ areaName }}</span>
        </el-form-item>
        <el-form-item label="定位地址：" prop="address">
          <el-input
            v-model="form.address"
            placeholder="请输入"
            :disabled="isDetail"
            v-if="isDetail"
          />
          <amap :dateAddress.sync="dateAddress" ref="amap" v-else></amap>
        </el-form-item>
        <el-form-item label="门牌号：">
          <el-input
            v-model="form.storeAddress"
            placeholder="请输入"
            :disabled="isDetail"
          />
        </el-form-item>
        <el-form-item label="联系人：" prop="contacts">
          <el-input
            v-model="form.contacts"
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
        <el-form-item label="微信号：" prop="wxNumber">
          <el-input
            v-model="form.wxNumber"
            placeholder="请输入"
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
        <el-form-item label="企业名称：" prop="businessName">
          <el-input
            v-model="form.businessName"
            :placeholder="isDetail ? '' : '请输入'"
            :disabled="isDetail"
          />
        </el-form-item>
        <el-form-item label="法定代表：" prop="legalPerson">
          <el-input
            v-model="form.legalPerson"
            :placeholder="isDetail ? '' : '请输入'"
            :disabled="isDetail"
          />
        </el-form-item>
        <el-form-item label="营业执照是否长期有效：" prop="isLongTime">
          <el-select
            v-model="form.isLongTime"
            :placeholder="isDetail ? '' : '请输入'"
            :disabled="isDetail"
          >
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
            :disabled="isDetail"
            style="width: 375px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="店铺照片：">
          <yc-image-uploader
            ref="image-cover"
            v-model="form.imageList"
            uploadMultiple
            :disabled="isDetail"
            :showTips="!isDetail"
            :uploadSize="5"
            tips="只支持上传图片或视频文件"
            accept="image/png,image/jpg,image/jpeg,.gif,video/mp4,video/ogg,video/flv,video/avi,video/wmv,video/rmvb,video/mov"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="门头照：" prop="storeDoorstep">
          <yc-image-uploader
            ref="door-cover"
            v-model="form.storeDoorstep"
            :disabled="isDetail"
            :showTips="!isDetail"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="二维码：" v-if="form.id && form.qrCode">
          <yc-image-uploader
            ref="qrCode"
            v-model="form.qrCode"
            :disabled="true"
            :showTips="false"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="店铺简介：" prop="storeDescription">
          <tinymce
            ref="editor"
            v-model="form.storeDescription"
            :disabled="isDetail"
          />
        </el-form-item>
        <el-form-item label="创建时间：" v-if="isDetail">
          <span>{{ form.createdTime }}</span>
        </el-form-item>
        <div class="content-submit" v-if="!isDetail">
          <el-button
            type="primary"
            @click="doSubmit"
            :loading="subLoading"
            v-if="
              $powers('/store/addStore') || $powers('/store/updateStoreDetail')
            "
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
import amap from '@views/exhibition/amap'
const FORM = {
  storeType: 'AUTHORITY',
  storeName: null,
  storeLogo: null,
  provinceId: null,
  cityId: null,
  districtId: null,
  address: null,
  contacts: null,
  storeDoorstep: null,
  telephone: null,
  wxNumber: null,
  businessLicense: null,
  imageList: [],
  storeDescription: null,
  latitude: null,
  longitude: null,
  enterpriseCreditCode: null,
  legalPerson: null,
  businessName: null,
  isLongTime: false,
  validFromDate: null,
  validToDate: null,
  dataSource: 'SYSTEM',
  qrCode: null
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
    tinymce,
    amap
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
    return {
      form: this.$_.cloneDeep(FORM),
      dateAddress: null,
      daterange: [],
      rules: {
        storeType: {
          required: true,
          message: '请选择店铺类型',
          trigger: 'change'
        },
        storeName: {
          required: true,
          message: '请输入店铺名称',
          trigger: 'blur'
        },
        storeLogo: {
          required: true,
          message: '请选择店铺Logo',
          trigger: 'change'
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
        legalPerson: {
          required: true,
          message: '请填写法定代表',
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
        // imageList: {
        //   required: true,
        //   message: '请选择店铺照片',
        //   trigger: 'change'
        // },
        storeDoorstep: {
          required: true,
          message: '请选择门头照',
          trigger: 'change'
        },
        contacts: { required: true, message: '请输入联系人', trigger: 'blur' },
        address: {
          required: true,
          message: '请输入定位地址',
          trigger: ['blur', 'change']
        },
        wxNumber: {
          required: true,
          validator: validateWxNumber,
          trigger: 'blur'
        },
        telephone: {
          required: true,
          validator: validatePhone,
          trigger: ['blur', 'change']
        },
        storeDescription: {
          required: true,
          message: '请输入店铺简介',
          trigger: 'blur'
        }
      },
      subLoading: false,
      areaList: [],
      domLoading: false,
      areaName: null
    }
  },
  computed: {
    isEdit() {
      return this.$route.query.id
    }
  },
  watch: {
    dateAddress: {
      handler(newData) {
        if (newData) {
          this.form.address = newData.pname + newData.adname + newData.address
          this.form.latitude = newData.location.lat
          this.form.longitude = newData.location.lng
          //获取省市区
          this.queryLocationAddress()
        } else {
          //清空数据
          this.form.address = null
          this.form.latitude = null
          this.form.longitude = null
          this.areaName = null
          this.form.provinceId = null
          this.form.cityId = null
          this.form.districtId = null
        }
      }
    }
  },
  activated() {
    this.clear()
    if (this.isDetail || this.$route.query.id) {
      // this.initDetailData()
    } else {
      this.form.applicantId = JSON.parse(sessionStorage.getItem('user')).loginId
    }
  },
  methods: {
    onBack() {
      this.$router.push({
        name: 'shopInfo'
      })
    },
    async initDetailData() {
      this.domLoading = true
      try {
        let data = await this.$api.storeGetStore({
          id: this.$route.query.id
        })
        this.areaName = `${data.provinceName}${data.cityName}${
          data.districtName || ''
        }`
        if (!data.isLongTime) {
          if (data.validFromDate && data.validToDate) {
            this.daterange = [data.validFromDate, data.validToDate]
          }
        }
        this.$nextTick((_) => {
          if (!this.$_.isEmpty(data.storeLogo)) {
            this.$refs['logo-cover'].setFileList(data.storeLogo)
          }
          if (!this.$_.isEmpty(data.businessLicense)) {
            this.$refs['license-cover'].setFileList(data.businessLicense)
          }
          setTimeout(() => {
            if (!this.$_.isEmpty(data.imageList)) {
              let urls = data.imageList.map((it) => it.fileUrl)
              this.$refs['image-cover'].setFileList(urls)
            }
          }, 500);
          
          if (!this.$_.isEmpty(data.address) && !this.isDetail) {
            this.$refs['amap'].setsearchKey(data.address)
          }
          setTimeout(() => {
            if (!this.$_.isEmpty(data.storeDoorstep)) {
              this.$refs['door-cover'].setFileList(data.storeDoorstep)
            }
          }, 500);
          
          if (!this.$_.isEmpty(data.qrCode)) {
            this.$refs['qrCode'].setFileList(data.qrCode)
          }
        })
        this.form = data
      } finally {
        this.domLoading = false
      }
    },
    doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return

        if (!this.form.provinceId || !this.form.cityId) {
          this.$message.error(`请重新选择定位地址`)
          return
        }
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
            api = 'storeUpdateStore'
          } else {
            api = 'storeAddStore'
          }
          await this.$api[api](this.form)
          this.$message.success(this.isEdit ? '编辑成功' : '新增成功')
          if (!this.isEdit) {
            this.$utils.routeBack('/shop/info')
            this.$refs.form.resetFields()
            this.form = {}
          }
        } finally {
          this.subLoading = false
        }
      })
    },
    //获取坐标转省市区
    async queryLocationAddress() {
      try {
        let data = await this.$api.regionRegionResolver({
          latitude: this.form.latitude,
          longitude: this.form.longitude
        })
        this.areaName = `${data.province}${data.city}${data.district || ''}`
        this.form.cityId = data.cityId
        this.form.districtId = data.districtId
        this.form.provinceId = data.provinceId
      } catch (e) {}
    },
    clear() {
      this.form = {
        storeType: 'AUTHORITY',
        storeName: null,
        storeLogo: null,
        provinceId: null,
        cityId: null,
        districtId: null,
        address: null,
        contacts: null,
        storeDoorstep: null,
        telephone: null,
        wxNumber: null,
        businessLicense: null,
        imageList: [],
        storeDescription: null,
        latitude: null,
        longitude: null,
        enterpriseCreditCode: null,
        legalPerson: null,
        businessName: null,
        isLongTime: false,
        validFromDate: null,
        validToDate: null,
        dataSource: 'SYSTEM'
      }
      this.$refs['logo-cover'].setFileList()
      this.$refs['license-cover'].setFileList()
      this.$refs['image-cover'].setFileList()
      this.$refs['door-cover'].setFileList()
      // this.$refs['qrCode'].setFileList()
    }
  }
}
</script>
<style>
.el-range-separator {
  width: 10% !important;
}
</style>
<style scoped lang="sass">
.base-form
  position: relative
</style>
