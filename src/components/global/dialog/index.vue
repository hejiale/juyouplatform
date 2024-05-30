<template>
  <div>
    <div
      class="dialog-content"
      :style="`align-items: ${center ? 'center' : 'normal'}`"
    >
      <slot name="content"></slot>
    </div>
    <div class="content-submit" v-if="!hideFooter">
      <template v-if="isDisabled">
        <el-button type="primary" plain @click="onBack">返回</el-button>
      </template>
      <template v-else>
        <el-button type="info" plain @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSure" v-loading="isLoading" v-if="authCode && $powers(authCode)">{{
          sureText
        }}</el-button>
        <el-button type="primary" @click="onSure" v-loading="isLoading" v-else>{{
          sureText
        }}</el-button>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    sureText: {
      type: String,
      default: '提交'
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    authCode:{
      type: String,
      default: null
    }
  },
  data() {
    return {}
  },
  methods: {
    onBack() {
      this.$emit('on-back')
    },
    onCancel() {
      this.$emit('on-cancel')
    },
    onSure() {
      this.$emit('on-sure')
    }
  }
}
</script>
<style>
.el-dialog__body {
  padding: unset !important;
}
</style>
<style lang="sass">
.dialog-content
    border-top: 1px solid #DCDFE6
    border-bottom: 1px solid #DCDFE6
    padding: 36px 10px
    @include ver
</style>
