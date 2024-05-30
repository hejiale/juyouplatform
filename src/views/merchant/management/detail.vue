<template>
  <div>
    <div class="base-form">
      <el-form
        ref="form"
        label-position="left"
        class="merchantform"
        inline
      >
        <el-row>
          <title-info title="商户信息" btnText="返回" :isShow="false" />
          <el-row>
            <el-form-item label="商户名称: " prop="merchantName" class="w100">
                <span>{{ form.merchantName || ''}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="联系方式: " prop="merchantPhone" class="w100">
                <span>{{ form.merchantPhone || ''}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="身份证号: " prop="identityNumber" class="w100">
                <span>{{ form.identityNumber || ''}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="有效期至: " prop="identityExpir" class="w100">
                <span>{{  form.identityExpire ?  form.identityExpire.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") : '--'}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="身份证照片: " prop="image" class="w100">
                <el-image
                style="width: 100px; height: 100px"
                :src="form.identityFront"
                ></el-image>
                &nbsp;&nbsp;&nbsp;
                <el-image
                style="width: 100px; height: 100px"
                :src="form.identityBack"
                ></el-image>
            </el-form-item>
          </el-row>
        </el-row>
        <el-row>
          <title-info title="银行信息" btnText="返回" :isShow="false" />
          <el-row>
            <el-form-item label="银行卡号: " prop="bankNo" class="w100">
                <span>{{ form.bankNo || ''}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="银行预留手机号: " prop="bankPhone" class="w100">
                <span>{{ form.bankPhone || ''}}</span>
            </el-form-item>
          </el-row>
        </el-row>   
        <el-row>
          <title-info title="其他信息" btnText="返回" :isShow="false" />
          <el-row >
            <el-form-item label="提交时间: " prop="createdTime" class="w100">
                <span>{{ form.createdTime ? $dayjs(form.createdTime).format('YYYY-MM-DD') : ''}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="激活状态: " prop="activate" class="w100">
                <span>{{ $enums.ApplyActivate.getName(form.activate)}}</span>
            </el-form-item>
          </el-row>
        </el-row> 
        <div class="content-submit">
          <el-button type="primary" plain @click="$router.back()">返回</el-button>
        </div>
      </el-form>
    </div>
  
  </div>
</template>

<script>

import titleInfo from '@partial/title-info'
export default {
  components: {
    titleInfo
  },
  data() {
    const vm = this
    return {
      form: vm.$store.state.managementDetail,
    }
  },
  created() {
    console.log(this.$store.state.managementDetail);
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next();
  },
  methods: {
    async onOperation(type) {
      let params = {
        type,
        applyId: this.form.id
      }
      if(type === 'REJECTED') {
        params.feedback = this.dialogFeedback
        await this.$api.platformReview(params)
        this.$message({
          type: 'success',
          message: `操作成功!`
        })
        this.$router.back()
      } else {
        this.$confirm(
          `此操作将通过审核, 是否继续?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        .then(async () => {
          await this.$api.platformReview(params)
          this.$message({
            type: 'success',
            message: `操作成功!`
          })
            this.$router.back()
        })
        .catch(() => {})
      }

    }
  }
}
</script>

<style lang="sass" >

.dialogContent 
  width: 100%
  text-align: center;
  .dialogInput
    width: 60%;
    margin: 50px 0;
</style>
