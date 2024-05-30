<template>
  <div :class="{ 'title-info': true, 'border-line': true }">
    <span class="text">{{ title }}</span>
    <span class="tips" v-if="tips">{{ tips }}</span>
    <div v-if="isShow">
      <slot name="ctrl-btn"></slot>
      <el-button type="primary" @click="onBack" v-if="!heavyLoad">{{
        btnText
      }}</el-button>
    </div>
    <div v-if="isShowOther">
      <slot name="ctrl-btn"></slot>
      <el-button type="primary" @click="onClickOther" v-if="!heavyLoad">{{
        otherBthText
      }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    tips: {
      type: String
    },
    btnText: {
      type: String
    },
    otherBthText: {
      type: String
    },
    isShow: {
      type: Boolean,
      default: () => true
    },
    isShowOther: {
      type: Boolean,
      default: () => false
    },
    heavyLoad: {
      type: Boolean,
      default: () => false
    }
  },
  methods:{
    onClickOther(){
      this.$emit('on-click-other')
    },
    onBack(){
      this.$emit('onBack')
    }
  }
}
</script>

<style lang="sass">
.title-info
  @include hor-between-center
  padding: $primaryGap
  background-color: #fff
  margin-bottom: 20px
  .text
    font-size: $font-large
    font-weight: bold
    padding-left: 12px
    position: relative
    &:before
      content: ''
      display: block
      width: 4px
      height: 18px
      background-color: $primaryColor
      position: absolute
      left: 0
      top: 3px
      border-radius: 20px
  .tips
    font-size: $font-large
    font-weight: 400
    color: #818181
    padding-left: 42px
.border-line
  border-bottom: 1px solid #e9e9eb
  margin: 0 -10px 20px -10px !important
  padding: 16px !important
</style>
