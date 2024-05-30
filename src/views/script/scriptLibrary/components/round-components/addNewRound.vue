<template>
  <div>
    <el-form :model="form" ref="form" :rules="rules" label-position="top">
      <el-form-item label="回合名称：" prop="roundName">
        <el-input
          placeholder="请输入"
          v-model="form.roundName"
          show-word-limit
          :maxlength="10"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="回合类型：" prop="roundType">
        <el-select
          v-model="form.roundType"
          :disabled="updateRound ? true : false"
        >
          <el-option
            v-for="i in $enums.RoundType.list"
            :label="i.label"
            :value="i.value"
            :key="i.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="搜证类型："
        prop="investigationType"
        v-if="form.roundType == 'PHYSICAL_EVIDENCE_INVESTIGATION'"
      >
        <el-select v-model="form.investigationType" :disabled="updateRound ? true : false">
          <el-option
            v-for="i in investigationTypeList"
            :label="i.label"
            :value="i.value"
            :key="i.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="选择APP："
        prop="appTypeList"
        v-if="form.roundType == 'PHYSICAL_EVIDENCE_INVESTIGATION'"
      >
        <el-select v-model="form.appTypeList" multiple filterable clearable :disabled="updateRound ? true : false">
          <el-option
            v-for="i in appTypeList"
            :label="i.label"
            :value="i.value"
            :key="i.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="doSubmitAdd" v-loading="subLoading"
        >提 交</el-button
      >
      <el-button @click="doCancel">返 回</el-button>
    </div> -->
  </div>
</template>
<script>
export default {
  props: {
    assistantId: {
      type: Number,
      default: 0
    },
    updateRound: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      form: {
        roundType: 'DISTRIBUTE_CLUE',
        roundName: '',
        appTypeList: []
      },
      rules: {
        roundName: {
          required: true,
          message: '请输入回合名称',
          trigger: 'blur'
        },
        roundType: {
          required: true,
          message: '请选择回合类型',
          trigger: 'change'
        },
        investigationType: {
          required: true,
          message: '请选择搜证类型',
          trigger: 'change'
        },
        appTypeList: {
          required: true,
          message: '请选择APP',
          trigger: 'change'
        }
      },
      investigationTypeList: [
        { label: '手机搜证', value: 'PHONE' },
        // { label: 'IPAD', value: 'IPAD搜证' }
      ],
      appTypeList: [
        { label: '邮件', value: 'EMAIL' },
        // { label: '支付宝APP', value: 'ALIPAY' }
      ],
      saving: false
    }
  },
  watch: {
    updateRound() {
      if (this.updateRound) {
        this.form = this.updateRound
      } else {
        this.form = {
          roundType: 'DISTRIBUTE_CLUE',
          roundName: ''
        }
      }
    }
  },
  mounted() {
    if (this.updateRound) {
      this.form = this.updateRound
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
      this.form = {
        roundName: ''
      }
    },
    doSubmitAdd() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return

        try {
          if (this.saving) return
          this.saving = true
          this.form.dramaId = Number(this.$route.query.id)

          if (this.form.id) {
            await this.$api.murderMysteryRoundUpdateMurderMysteryRound(
              this.form
            )
          } else {
            await this.$api.murderMysteryRoundAddMurderMysteryRound(this.form)
          }
          await this.$emit('on-success')
          this.$message.success(`${this.form.id ? '更新成功' : '新增成功'}`)
          
          setTimeout(() => {
            this.saving = false
          }, 500);
        } catch (e) {
          this.saving = false
        }
      })
    },
    doCancel() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="sass" scoped>
.dialog-footer
  @include hor-center-center
.sendClueBox
  width: 100px
  height: 44px
  color: #fff
  background: $orange
  text-align: center
  line-height: 44px
  font-size: 13px
  border-radius: 8px
</style>
