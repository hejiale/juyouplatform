<template>
  <div class="image-uploader" v-loading.fullscreen.lock="uploading">
    <div class="image-uploader__list" v-if="disabled">
      <el-image
        style="width: 100px; height: 100px"
        v-for="(item, idx) in previewList"
        :key="idx"
        :src="item"
        :preview-src-list="previewList"
      >
      </el-image>
    </div>
    <template v-else>
      <el-upload
        ref="uploader"
        :accept="accept"
        :list-type="listType"
        :headers="{ Authorization: token }"
        :action="action || $config.uploadUrl()"
        :show-file-list="listType === 'picture-card'"
        :file-list.sync="fileList"
        :before-upload="onBeforeUpload"
        :on-progress="handleUploaderProgress"
        :on-success="handleUploaderSuccess"
        :on-error="handleUploaderError"
        :on-remove="handleUploaderRemove"
        :on-preview="canShow ? handlePictureCardPreview : null"
        :limit="limit"
        :on-exceed="onExceed"
        :on-change="handleUploaderChange"
        :before-remove="onBeforeRemove"
        :disabled="disabled"
        :class="{ canUpload: disabled || uploadDisabled }"
      >
        <i class="el-icon-plus" v-if="uploadMultiple || !currentValue" />
        <div slot="file" slot-scope="{file}">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url" alt=""
            v-if="isImage(file)"
          >
          <video :src="file.url" v-else></video>
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="handleUploaderRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>
    </template>
    <div class="tips" :style="{ width: width || '230px' }" v-if="showTips">
      {{ tips }}
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogFile.url" alt="" v-if="isImage(dialogFile)"/>
      <video :src="dialogFile.url" v-else controls autoplay></video>
    </el-dialog>
  </div>
</template>

<script>
import vModel from '@/mixins/v-model'
export default {
  mixins: [vModel],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    // 能否上传多个
    uploadMultiple: {
      type: Boolean,
      default: false
    },
    //是否显示查看图片
    canShow: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    showTips: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: null
    },
    action: {
      type: String,
      default: null
    },
    tips: {
      type: String,
      default: '只能上传jpg/png/jpeg/gif文件，且不超过1MB'
    },
    //最大上传大小
    uploadSize: {
      type: Number,
      default: 1
    },
    accept: {
      type: String,
      default: 'image/png,image/jpg,image/jpeg,.gif,.svg,image/svg,image/svg+xml'
    }
  },
  data() {
    return {
      uploading: false,
      percentage: 0,
      progressStatus: null,
      timer: null,
      count: 0,
      fileList: [],
      delList: [],
      previewList: [],
      dialogVisible: false,
      dialogFile: ''
    }
  },
  computed: {
    listType() {
      // return this.uploadMultiple ? 'picture-card' : null
      return 'picture-card'
    },
    uploadDisabled() {
      return this.fileList.length && !this.uploadMultiple
    },
    token() {
      return `Bearer ${sessionStorage.getItem('tokenValue')}`
    },
    isImage() {
      return function (v) {
        if (v) {
          if(v.url.indexOf('blob') !== -1){
            if (this.$utils.judgeMediaType(v.name) === "image") {
              return true;
            }
            return false;
          }else{
            if (this.$utils.judgeMediaType(v.url) === "image") {
              return true;
            }
            return false;
          }
        }
      };
    }
  },
  watch: {
    fileList: {
      handler: function (val) {
        if (this.$_.isEmpty(val)) {
          return this.uploadMultiple
            ? (this.currentValue = [])
            : (this.currentValue = '')
        }
        if (this.uploadMultiple) {
          this.currentValue = val.map((t) => this.getFileUrl(t))
        } else {
          this.currentValue = this.getFileUrl(val[val.length - 1])
        }
        this.previewList = val.map((m) => {
          return m.url
        })
      }
      // immediate: true
    }
  },
  created() {
    if (this.width) {
      document
        .getElementsByTagName('body')[0]
        .style.setProperty('--image-width', this.width)
    } else {
      document
        .getElementsByTagName('body')[0]
        .style.setProperty('--image-width', '212px')
    }
    if (this.height) {
      document
        .getElementsByTagName('body')[0]
        .style.setProperty('--image-height', this.height)
    } else {
      document
        .getElementsByTagName('body')[0]
        .style.setProperty('--image-height', '113px')
    }
  },
  methods: {
    getFileUrl(file) {
      if (!file) return null
      return (
        (file.response ? file.response.data.fileUrl : file.url) ||
        file.response.data.fileUrl
      )
    },
    onExceed() {
      if (this.limit) {
        this.$message.warning(`上传数量不能超过${this.limit}个`)
      }
    },
    getRandomNum(min, max) {
      let range = max - min
      return min + Math.random() * range
    },
    onBeforeUpload(file) {
      const imgTypeArr = this.accept.split(',');
      const allowImgType = imgTypeArr.includes(file.type)
      const isLt10M = file.size / 1024 / 1024 < this.uploadSize
      console.log(file)
      if (!allowImgType) {
        this.$message.error('只能上传png,jpg,jpeg,gif格式的图片')
        return false
      }
      if (!isLt10M) {
        this.$message.error(`大小不能超过 ${this.uploadSize}MB!`)
        return false
      }
      // jfif pjp pjpeg 格式会被校验为 image/jpeg
      let isjfif = file.name.slice(-5) === '.jfif'
      let ispjp = file.name.slice(-4) === '.pjp'
      let ispjpeg = file.name.slice(-6) === '.pjpeg'
      if (isjfif || ispjp || ispjpeg) {
        this.$message.error('只能上传png,jpg,jpeg,gif格式的图片')
        return false
      }
      clearInterval(this.timer)
      this.timer = null
      this.percentage = 0
      this.progressStatus = null
      this.uploading = true
    },
    handleUploaderSuccess(res) {
      if (res.code !== 200) {
        this.handleUploaderError()
        return
      }
      this.fileList.push({
        url: res.data.fileUrl
      })
      clearInterval(this.timer)
      this.percentage = 100
      setTimeout(() => {
        this.uploading = false
        this.$emit('on-uploader-success')
      }, 500)
    },
    handleUploaderError() {
      this.progressStatus = 'exception'
      clearInterval(this.timer)
      this.$notify.error({
        title: '错误',
        message: '文件上传出现错误, 请重新上传'
      })
      this.uploading = false
    },
    handleUploaderProgress() {
      if (this.timer) return
      this.progressStatus = null
      this.percentage = 0
      this.uploading = true
      this.timer = setInterval(() => {
        let randNum = this.getRandomNum(80, 95)
        if (this.percentage < randNum) {
          if (this.percentage < 20) {
            this.percentage++
          } else {
            this.percentage += 3
          }
        }
        if (this.percentage === 100) {
          clearInterval(this.timer)
        }
      }, 100)
    },
    handleUploaderRemove(file, fileList) {
      this.fileList.splice(
          this.fileList.findIndex((t) => this.$_.isEqual(t, file)),
          1
        )
      // if (this.uploadMultiple) {
      //   if (file && file.status === 'success') {
      //     let delIndex = this.delList.indexOf(file.uid)
      //     this.fileList.splice(delIndex, 1)
      //   }
      // } else {
      //   this.fileList.splice(
      //     this.fileList.findIndex((t) => this.$_.isEqual(t, file)),
      //     1
      //   )
      // }
    },
    handleUploaderChange(file, fileList) {
      if (this.uploadMultiple) {
        this.fileList = fileList
      } else {
        this.fileList = [file]
      }
    },
    handlePictureCardPreview(file) {
      this.dialogFile = file
      this.dialogVisible = true
    },
    setFileList(fileList) {
      if (!fileList) {
        fileList = []
      }
      if (!(fileList instanceof Array)) {
        fileList = [fileList]
      }
      this.fileList = fileList.map((t) => ({
        url: t
      }))
    },
    onBeforeRemove(file, fileList) {
      if (file.status === 'success' && this.uploadMultiple) {
        this.delList = fileList.map((item) => item.uid)
      }
    }
  }
}
</script>

<style lang="sass">
.canUpload .el-upload--picture-card
  display: none
.image-uploader
  $w: var(--image-width, 212px)
  $h: var(--image-height, 113px)
  $color-primary: #0a85e1
  &__list
    .el-image
      margin-right: $primaryGap
  .el-upload
    border: none
    background-color: #F2F2F2
    line-height: 0
    border-radius: 6px
    cursor: pointer
    position: relative
    overflow: hidden
    width: $w
    height: $h
    margin: 0 16px 16px 0

  &:hover
    border-color: $color-primary

  .el-icon-plus
    font-size: 28px
    color: #8c939d
    width: $w
    height: $h
    line-height: $h
    text-align: center
  .avatar
    width: $w
    height: $h
    display: block

  .tips
    line-height: 1.5
    font-size: $font-small
    color: #999

  .el-upload-list__item
    width: $w !important
    height: $h !important
    margin: 0 16px 16px 0
    &-thumbnail
      object-fit: contain
.el-image-viewer__wrapper
  img
    width: auto
    height: auto
.v-modal
  z-index: 2000 !important
</style>
