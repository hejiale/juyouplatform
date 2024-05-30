<template>
  <div>
    <title-info
      :title="'创建' + $enums.ProductType.getName($route.query.productType)"
      :heavyLoad="true"
      v-if="!isEdit"
    />
    <div class="base-form">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-position="left"
        label-width="200px"
      >
        <el-form-item label="关联剧本" prop="dramaId">
          <el-select
            v-model="form.dramaId"
            placeholder="请输入关键字搜索"
            @change="selectDrama"
            :disabled="isEdit"
            clearable
            filterable
            :remote-method="onSearchDrama"
            remote
            reserve-keyword
          >
            <el-option
              v-for="i in dramaList"
              :label="i.dramaName"
              :value="i.id"
              :key="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品主图">
          <el-image
            style="width: 100px; height: 100px; margin-right: 10px;"
            :src="url"
            fit="contain"
            v-for="url in form.urlList"
            :key="url"
            :preview-src-list="form.urlList"
            ></el-image>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品副标题">
          <el-input v-model="form.subTitle" placeholder="请输入商品副标题" />
        </el-form-item>
        <el-form-item label="商品备注">
          <el-input v-model="form.remark" placeholder="请输入商品备注" />
        </el-form-item>
        <el-form-item label="商品详情" prop="detail">
          <tinymce ref="editor" v-model="form.detail"/>
        </el-form-item>
        <el-form-item label="商品原价">
          <el-input v-model="form.originPrice" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="商品现售价" prop="currentPrice">
          <el-input v-model="form.currentPrice" placeholder="请输入价格" />
          <div style="color: #a4a4a4">输入0元则是免费</div>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="doSubmit" v-loading="subLoading"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import titleInfo from '@partial/title-info'
import tinymce from '@partial/tinymce'
export default {
  components: {
    titleInfo,
    tinymce
  },
  data() {
    return {
      form: {},
      rules: {
        dramaId: {
          required: true,
          message: '请选择剧本',
          trigger: 'change'
        },
        productName: {
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        },
        detail: {
          required: true,
          message: '请输入商品详情',
          trigger: 'blur'
        },
        currentPrice: {
          required: true,
          message: '请输入商品现售价',
          trigger: 'blur'
        }
      },
      dramaList: [],
      subLoading: false
    }
  },
  activated() {
    this.dramaList = [];
    if (this.isEdit) {
      this.queryDetail();
    }else{
      this.form = {
        dramaId: null,
        urlList: [],
        productName: null,
        subTitle: null,
        remark: null,
        detail: "",
        originPrice: null,
        currentPrice: null,
        canSubmit: false
      }
    }
    this.$nextTick(_=>{
      this.$refs.form.clearValidate();
    })
  },
  computed: {
    isEdit() {
      return this.$route.name === 'CommodityMagtEdit'
    }
  },
  methods: {
    selectDrama(event) {
      this.form.urlList = []
      this.dramaList.map((v) => {
        if (v.id == event) {
          this.form.originPrice = v.sellPrice / 100
          this.form.urlList.push(v.dramaCover)
          if (v.dramaRoleList) {
            v.dramaRoleList.map((val) => {
              this.form.urlList.push(val.roleUrl)
            })
          }
        }
      })
    },
    async queryDetail() {
      let res = await this.$api.productDetail({
        id: this.$route.query.id
      })
      res.originPrice = res.originPrice / 100
      res.currentPrice = res.currentPrice / 100
      await this.queryDramaList(res.dramaName)
      this.form = this.$_.cloneDeep(res)
      
      this.$nextTick(() => {
        this.$refs['urlList'].setFileList(this.form.urlList)
      })
    },
    onSearchDrama(event){
      this.queryDramaList(event);
    },
    async queryDramaList(dramaNameKeyword) {
      let res = await this.$api.dramaQueryDramaPage({
        pageNo: 1,
        pageSize: 50,
        dramaStatus: 'ENABLED',
        dramaNameKeyword,
        isBoxOffice: true
      })
      if (this.$route.query.productType == 'BOX_OFFICE_PRODUCT') {
        res.records = res.records.filter((v) => {
          return v.isBoxOffice
        })
      }
      this.dramaList = res.records
    },
    doSubmit() {
      if (!this.subLoading) {
        this.$refs.form.validate(async (valid) => {
          if (!valid) return

          this.subLoading = true
          this.form['productType'] = this.$route.query.productType
          let form = this.$_.cloneDeep(this.form)
          form.originPrice = form.originPrice * 100
          form.currentPrice = form.currentPrice * 100
          try {
            let api = []
            if (this.isEdit) {
              api = 'productUpdate'
            } else {
              api = 'productCreate'
            }
            await this.$api[api](form)
            this.$message.success(this.isEdit ? '编辑成功' : '新增成功')
            if (this.isEdit) {
              this.queryDetail()
            } else {
              this.$utils.routeBack('/commodity/manage')
            }
            this.subLoading = false
          } catch (e) {
            this.subLoading = false
          }
        })
      }
    }
  }
}
</script>

<style></style>
