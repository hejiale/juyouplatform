<template>
  <div>
    <title-info
      :title="$route.query.id ? $route.query.name : '添加作者'"
      btnText="返回"
      @onBack="onBack"
    />
    <div class="base-form">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-position="left"
        label-width="150px"
      >
        <el-form-item label="作者名称：" prop="authorName">
          <el-input v-model="form.authorName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="真实姓名：">
          <el-input v-model="form.realName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="身份证号码：">
          <el-input v-model="form.identityNumber" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="所在城市：">
          <el-cascader
            v-model="form.areaId"
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
        <el-form-item label="详细地址：">
          <el-input v-model="form.address" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="form.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="微信号：">
          <el-input v-model="form.wechatNumber" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="作者简介：">
          <el-input
            type="textarea"
            v-model="form.authorDescription"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="关联剧本：">
          <el-select
            v-model="form.dramaIds"
            multiple
            filterable
            remote
            clearable
            :remote-method="remoteMethod"
            :loading="publisherLoading"
            placeholder="请输入发行关键字"
          >
            <el-option
              v-for="i in publisherList"
              :label="i.publisherName"
              :value="i.id"
              :key="i.id"
            />
          </el-select>
        </el-form-item>
        <div class="content-submit">
          <el-button type="primary" v-loading="subLoading" @click="doSubmit"
            >保存</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import titleInfo from '@partial/title-info'
const FORM = {
  authorName: null,
  realName: null,
  identityNumber: null,
  provinceId: null,
  cityId: null,
  districtId: null,
  areaId: [],
  address: null,
  phone: null,
  wechatNumber: null,
  authorDescription: null,
  dramaIds: []
}
export default {
  components: {
    titleInfo
  },
  data(vm) {
    return {
      rules: {
        authorName: {
          required: true,
          message: '请输入作者名称',
          trigger: 'blur'
        }
      },
      form: this.$_.cloneDeep(FORM),
      subLoading: false,
      publisherLoading: false,
      areaList: [],
      publisherList: []
    }
  },
  async activated() {
    this.publisherList = [];
    this.form = {};
    await this.getDetailInfo()
    await this.initAreaData()
  },
  computed: {
    isEdit() {
      return this.$route.name === 'AuthorInfoEdit'
    }
  },
  methods: {
    onBack(){
      this.$router.push({
        name: 'AuthorInfo'
      })
    },
    async getDetailInfo() {
      if (this.$route.query.id) {
        let res = await this.$api.authorQueryAuthorDetail({
          id: this.$route.query.id
        })
        res['areaId'] = [res.provinceId, res.cityId, res.districtId]
        res['id'] = this.$route.query.id
        this.form = res
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
    //  关联剧本下拉筛选
    async remoteMethod(query) {
      if (!this.$_.isEmpty(query)) {
        this.publisherLoading = true
        try {
          let res = await this.$api.dramaQueryDramaPage({
            dramaNameKeyword: query,
            pageNo: 1,
            pageSize: 999
          })
          console.log(res)
          this.publisherList = res.records
        } finally {
          this.publisherLoading = false
        }
      }
    },
    async doSubmit() {
      let reg = /^1[3456789]\d{9}$/
      let reg2 =
        /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/

      if (!reg.test(this.form.phone) && this.form.phone) {
        this.$message({
          showClose: true,
          message: '请输入正确的手机号',
          type: 'warning'
        })
        return
      }
      if (!reg2.test(this.form.identityNumber) && this.form.identityNumber) {
        this.$message({
          showClose: true,
          message: '请输入正确的身份证号',
          type: 'warning'
        })
        return
      }

      if (!this.subLoading) {
        this.subLoading = true
        
        try {
          let api = null
          if (this.isEdit) {
            api = 'authorUpdateAuthorDetail'
          } else {
            api = 'authorAddAuthor'
          }
          await this.$api[api](this.form)
          this.$message.success(this.isEdit ? '编辑成功' : '新增成功')
          if (this.isEdit) {
            this.getDetailInfo()
          } else {
            this.$utils.routeBack('/author/info')
            this.form = this.$_.cloneDeep(FORM)
          }
        } catch (e) {
          this.subLoading = false
        } finally {
          this.subLoading = false
        }
      }
    }
  }
}
</script>

<style lang="sass"></style>
