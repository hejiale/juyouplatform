<template>
  <div class="file-item">
    <div class="item-icon-wrap">
      <yc-svg-icon
        class="item-icon"
        name="video"
        v-if="disablePreview"
      ></yc-svg-icon>
      <i v-else class="el-icon-document-remove el-icon"></i>
    </div>
    <div class="item-message-wrap">
      <div class="item-message">
        <div class="message-name" @click="preview">{{ file.name }}</div>
        <div class="message-progress-text">
          <span>{{ parseInt((file.uploadProgress || 1) * 100) }}%</span>
        </div>
      </div>
      <el-progress
        class="item-progress-bar"
        :percentage="parseInt((file.uploadProgress || 1) * 100)"
        :show-text="false"
      ></el-progress>
    </div>
    <div v-if="showDownBtn" class="item-del" @click="preview">
      <i class="el-icon-download el-icon"></i>
    </div>
    <div v-if="!disableDel" class="item-del" @click="remove">
      <i class="el-icon-delete el-icon"></i>
    </div>
  </div>
</template>

<script>
// todo : icon图标随文件变化
export default {
  props: {
    file: {
      type: Object,
      required: true
    },
    disablePreview: {
      type: Boolean,
      default: false
    },
    disableDel: {
      type: Boolean,
      default: false
    },
    showDownBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    remove () {
      this.$emit('remove', this.file)
    },
    preview () {
      // todo 预览，健壮性待完善
      if (!this.disablePreview) {
        window.open(this.file.url)
      }
    }
  }
}
</script>
<style lang="sass">
.file-item
  $h: 50px
  @include hor-start-center
  height: $h
  margin-bottom: 10px
  background: rgba(255, 255, 255, 1)
  border-radius: 5px
  border: 1px solid #eee
  .el-icon
    font-size: 20px
  &:last-child
    margin-bottom: 0
  .item-icon-wrap
    flex: none
    flex-shrink: 0
    width: 50px
    text-align: center
    border-right: 1px solid #f3f3f3
  .item-message-wrap
    flex: 1
    padding: 0 15px
    line-height: 1em
    margin-top: 9px
    .item-message
      @include clearfix
      .message-name
        display: inline-block
        text-align: left
        width: 180px
        padding-right: 20px // 预留最小点击位置
        cursor: pointer
        @include text-overflow
      .message-progress-text
        float: right
        color: #409eff
    .item-progress-bar
      margin-top: 5px
  .item-del
    flex: none
    width: 50px
    text-align: center
    cursor: pointer
    border-left: 1px solid #f3f3f3
</style>
