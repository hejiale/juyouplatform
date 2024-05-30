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
            <el-form-item label="法人姓名: " prop="legalreptName" class="w100">
                <span>{{ form.merchantBusinessPlatformApply.legalreptName || ''}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="法定代表人手机号: " prop="legalreptPhone" class="w100">
                <span>{{ form.merchantBusinessPlatformApply.legalreptPhone || ''}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="法定代表人身份证号: " prop="identityNumber" class="w100">
                <span>{{ form.merchantBusinessPlatformApply.legalreptIdNo || ''}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="法定代表人身份证有效期至: " prop="identityExpir" class="w100">
                <span>{{  form.merchantBusinessPlatformApply.legalreptIdExp ?  form.merchantBusinessPlatformApply.legalreptIdExp.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") : '--'}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="身份证照片: " prop="image" class="w100">
                <el-image
                style="width: 100px; height: 100px"
                :src="form.merchantBusinessPlatformApply.idPortrait"
                :preview-src-list="[form.merchantBusinessPlatformApply.idPortrait]"
                ></el-image>
                &nbsp;&nbsp;&nbsp;
                <el-image
                style="width: 100px; height: 100px"
                :src="form.merchantBusinessPlatformApply.idEmblem"
                :preview-src-list="[form.merchantBusinessPlatformApply.idEmblem]"
                ></el-image>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="统一社会信用代码: " prop="identityExpir" class="w100">
                <span>{{  form.merchantBusinessPlatformApply.idNo ?  form.merchantBusinessPlatformApply.idNo : '--'}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="营业执照有效期至: " prop="identityExpir" class="w100">
                <span>{{  form.merchantBusinessPlatformApply.idExp ?  form.merchantBusinessPlatformApply.idExp.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") : '--'}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="营业执照照片: " prop="image" class="w100">
                <el-image
                style="width: 100px; height: 100px"
                :src="form.merchantBusinessPlatformApply.unifiedCodeUrl"
                :preview-src-list="[form.merchantBusinessPlatformApply.unifiedCodeUrl]"
                ></el-image>
            </el-form-item>
          </el-row>
        </el-row>
        <el-row>
          <title-info title="银行信息" btnText="返回" :isShow="false" />
          <el-row>
            <el-form-item label="对公账户名: " prop="linkedAcctName" class="w100">
                <span>{{ form.merchantBusinessPlatformApply.linkedAcctName || ''}}</span>
            </el-form-item>
            <el-form-item label="对公账户开户行名: " prop="linkedBrBankName" class="w100">
                <span>{{ form.merchantBusinessPlatformApply.linkedBrBankName || ''}}</span>
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
            <el-form-item label="审核状态: " prop="commonApplyStatus" class="w100">
                <span>{{ $enums.CommonApplyStatus.getName(form.commonApplyStatus)}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="不通过理由: " prop="feedback" class="w100">
                <span v-if="form.feedback">{{ form.feedback }}</span>
                <span v-if="form.lianlianFeedback">{{ form.lianlianFeedback }}</span>
            </el-form-item>
          </el-row>
        </el-row> 
        <div class="content-submit">
          <template v-if="this.$route.query.type === 'manage'">
            <el-button
              type="warning"
              v-loading="subLoading"
              @click="dialogVisible = true"
              >不通过</el-button>
            <el-button
              type="primary"
              v-loading="subLoading"
              @click="onOperation('PASS')"
            >审核通过，提交至三方审核</el-button>
          </template>
          <el-button type="primary" plain @click="$router.back()">返回</el-button>
        </div>
      </el-form>
    </div>
    <el-dialog
      title="不通过理由"
      :visible.sync="dialogVisible"
      width="60%"
      center
      >
       <div  class="dialogContent">
          <el-input
          class="dialogInput"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            maxlength="200"
            v-model="dialogFeedback">
          </el-input> 
       </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onOperation('REJECTED')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'

import titleInfo from '@partial/title-info'
export default {
  name:'auditDetail',
  components: {
    titleInfo
  },
  data() {
    const vm = this
    return {
      form: vm.$store.state.auditDetail,
      subLoading: false,
      dialogFeedback: '',
      dialogVisible: false
    }
  },
  created() {
    console.log(this.$route.query.type);
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next();
  },
  methods: {
    async onOperation(platformApplyStatus) {
      let params = {
        platformApplyStatus,
        applyId: this.form.id
      }
      if(platformApplyStatus === 'REJECTED') {
        params.feedback = this.dialogFeedback
        await this.$api.platformReview(params)
        this.$message({
          type: 'success',
          message: `操作成功!`
        })
        this.dialogVisible = false;
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

    },
   
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
