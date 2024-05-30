<template>
  <div class="file-upload" v-loading.fullscreen.lock="uploading">
    <div class="el-upload-dragger" :class="{ disabled: disabled }" ref="drop">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </div>
    <div class="file-list">
      <file-item
        v-for="file in value"
        :key="file.id || file.fileUrl"
        :file="file"
        :disableDel="disabled"
        showDownBtn
        @remove="removeFile(file)"
      />
    </div>
  </div>
</template>

<script>
import Upload from '@/utils/upload'
import FileItem from './FileItem'

export default {
  name: 'FileUpload',
  components: { FileItem },
  props: {
    //  单文件
    singleFile: {
      type: Boolean,
      default: () => true
    },
    value: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: '.apk'
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    /**
     * 是否需要校验上传文件名中文
     */
    verifyChinese: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploader: null,
      uploading: false
    }
  },
  async mounted() {
    if (this.disabled) return
    await this.$nextTick()
    const uploader = (this.uploader = new Upload({
      triggerEle: this.$refs.drop,
      dropEle: this.$refs.drop,
      options: {
        verifyChinese: this.verifyChinese,
        // singleFile: this.singleFile,
        browseOption: {
          attributes: {
            accept: this.accept // video/mp4,video/x-m4v 为兼容safari处理
          }
        }
      }
    }))
    uploader.on('fileAdded', async (file) => {
      this.uploading = true
      !this.multiple && this.removeFile()
      file.uploadProgress = 0.01
      this.value.push(file)
      this.$emit('input', this.value)
    })
    uploader.on('fileUploaded', async (file) => {
      this.uploading = false
      this.$emit('uploaded', file, this.value)
    })
    uploader.on('fileProgress', (rootFile, file) => {
      this.$set(file, 'uploadProgress', file.progress())
    })
    uploader.on('dragenter', () => {
      this.$refs.drop.classList.add('file-drop')
    })
    uploader.on('dragleave', () => {
      this.$refs.drop.classList.remove('file-drop')
    })
    uploader.on('fileError', (e) => {
      this.uploading = false
      this.$message.error(e)
    })
  },
  methods: {
    removeFile(file) {
      if (file) {
        const fileIndex = this.value.findIndex(
          (i) => i.url === file.url || i.id === file.id
        )
        this.value.splice(fileIndex, 1)
        this.$emit('input', this.value)
        this.$emit('remove', this.value)
        file.cancel && file.cancel()
      } else {
        this.value.length = 0
        this.$emit('input', this.value)
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.file-upload
  display: inline-block
  line-height: 2em
  width: 400px
  text-align: center
  .el-upload-dragger
    width: 400px
    background-color: #f7f8fa
    &.disabled
      cursor: no-drop
  // 拖拽提示
  &.file-drop
    box-shadow: 2px 2px 10px 4px #ccc
    *
      pointer-events: none
  .file-head
    p
      color: #a1acb4
      font-size: 12px
  .file-button
    border: none
    color: #fff
    font-size: 12px
    padding: 10px 20px
    background: linear-gradient(100deg, #3e86ff 0%, #5655e6 100%)
    border-radius: 5px
    cursor: pointer
    .button-icon
      margin-right: 15px
.file-list
  padding-top: 20px
  // max-height: 190px
  overflow-y: scroll
</style>
