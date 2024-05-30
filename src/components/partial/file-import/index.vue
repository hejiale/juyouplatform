<template>
  <el-dialog
    :visible.sync="visible"
    title="导入数据"
    custom-class="import-dialog"
    :show-close="false"
    @close="OnClose"
    center
    width="525px"
  >
    <div class="import-dialog__text">
      <span
        >请先下载
        <span @click="downloadByFile" class="tips__href">数据模板</span
        >，完成数据统计后进行文件导入</span
      >
    </div>
    <div class="import-dialog__content">
      <el-upload
        class="upload-demo"
        accept=".xls, .xlsx, .excel"
        :action="importUrl"
        :before-upload="beforeAvatarUpload"
        :on-success="handleChange"
        :show-file-list="false"
      >
        <el-button type="primary"
          ><i class="el-icon-upload el-icon--right"></i>选择文件</el-button
        >
      </el-upload>
    </div>
  </el-dialog>
</template>

<script>
import { Loading } from 'element-ui'

export default {
  props: {
    //  导入类型  DRAMA-剧本  STORE-店铺  PUBLISHER-发行商
    type: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      href: null,
      importUrl: null
    }
  },
  mounted () {
    if (this.type === 'DRAMA') {
      //  剧本导入
      this.importUrl = this.$config.dramaImportUrl()
    } else if (this.type === 'STORE') {
      //  店铺导入
      this.importUrl = this.$config.storeImportUrl()
    } else if (this.type === 'PUBLISHER') {
      //  发行导入
      this.importUrl = this.$config.publisherImportUrl()
    } else if (this.type === 'EXHIBITION_CODE') {
      // 二维码导入
      this.importUrl = this.$config.exhibitioncodeImportUrl()
    }
  },
  methods: {
    OnClose () {
      this.$emit('update:show', false)
    },
    //  下载文件
    downloadByFile (data) {
      if (!data) return
      let loadingInstance = Loading.service({ fullscreen: true })
      try {
        let element = document.createElement('a')
        this.$exportFileStream({
          url: '/excelDownload/excelTemplate',
          query: {
            excelNameDownload: this.type
          }
        }).then((response) => {
          let blob = new Blob([response.data])
          this.href = window.URL.createObjectURL(blob)
          element.href = this.href
          let fileName = null
          //  获取filename
          let contentDisposition = response.headers['content-disposition']
          if (contentDisposition && contentDisposition.indexOf('filename=')) {
            fileName = window.decodeURI(
              contentDisposition.split('filename=')[1],
              'UTF-8'
            )
          }
          element.download = fileName
          element.click()
          URL.revokeObjectURL(this.href)
        })
      } finally {
        loadingInstance.close()
      }
    },

    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isLt2M) {
        this.$message.error('文件不能大于10MB!')
      }
      return isLt2M
    },
    handleChange (file) {
      if (file.rspCd !== '00000') return this.$message.error(file.rspInf)
      this.$message.success('导入成功')
      this.OnClose()
      this.$emit('updateData')
    }
  },
  watch: {
    show: {
      immediate: true,
      handler (show) {
        this.visible = show
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.import-dialog
  &__text
    font-size: 18px
    color: #8C9AA3
    text-align: center
    margin-bottom: 20px
  &__content
    background-color: #f7f8fa
    border-radius: 4px
    padding: 40px 20px
    text-align: center
.tips__href
  color: $primaryColor
  cursor: pointer
</style>
