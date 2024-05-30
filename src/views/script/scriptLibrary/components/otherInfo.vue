<template>
  <div style="margin: 40px">
    <el-form :model="form" ref="form" :rules="rules" label-position="top">
      <el-form-item label="开本教程视频">
        <file-upload
          v-model="videoList"
          :multiple="false"
          :verifyChinese="true"
          @uploaded="onCompleteUpload"
          @remove="onRemoveFile"
          accept=".mp4"
        ></file-upload>
      </el-form-item>
      <el-form-item label="背景图" prop="backgroundUrl">
        <yc-image-uploader
          ref="backgroundUrl-cover"
          v-model="form.backgroundUrl"
          :maxSize="1"
        ></yc-image-uploader>
      </el-form-item>
      <el-form-item label="LOGO" prop="logoUrl">
        <yc-image-uploader
          ref="logoUrl-cover"
          v-model="form.logoUrl"
          :maxSize="1"
        ></yc-image-uploader>
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      :loading="subLoading"
      @click="doSubmit"
      v-if="
        $powers('/murderMysteryInfo/addMurderMysteryInfo') ||
        $powers('/murderMysteryInfo/updateMurderMysteryInfo')
      "
      >保存</el-button
    >
  </div>
</template>

<script>
import fileUpload from '@partial/file-upload'
export default {
  components: {
    fileUpload
  },
  data() {
    return {
      form: {
        backgroundUrl: null,
        logoUrl: null
      },
      rules: {
        backgroundUrl: {
          required: true,
          message: '请上传背景图',
          trigger: 'change'
        },
        logoUrl: {
          required: true,
          message: '请上传LOGO',
          trigger: 'change'
        }
      },
      videoList: [],
      isCompleteUpload: false,
      subLoading: false,
      isAdd: true
    }
  },
  methods: {
    async queryDetail() {
      let data = await this.$api.murderMysteryInfoQueryMurderMysteryInfo({
        id: this.$route.query.id
      })
      if (data) {
        this.isAdd = false
        this.form = data
        if (data.videoAddress) {
          let url = data.videoAddress
          let name = data.videoName
          this.videoList.push({ url, name })
        }

        this.$nextTick(() => {
          this.$refs['backgroundUrl-cover'].setFileList(data.backgroundUrl)
          this.$refs['logoUrl-cover'].setFileList(data.logoUrl)
        })
      } else {
        this.isAdd = true
      }
    },
    onCompleteUpload() {
      this.isCompleteUpload = true
    },
    onRemoveFile(val) {
      if (!val.length) {
        this.isCompleteUpload = false
      }
    },
    async doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if (this.subLoading) return
        this.subLoading = true
        try {
          let api = null
          if (this.isAdd) {
            api = 'murderMysteryInfoAddMurderMysteryInfo'
          } else {
            api = 'murderMysteryInfoUpdateMurderMysteryInfo'
          }
          await this.$api[api]({
            ...this.form,
            dramaId: this.$route.query.id,
            videoAddress: this.videoList.length ? this.videoList[0].url : null,
            videoName: this.videoList.length ? this.videoList[0].name : null
          })
          this.subLoading = false
          this.$message.success('操作成功')
          this.queryDetail()
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
}
</script>

<style></style>
