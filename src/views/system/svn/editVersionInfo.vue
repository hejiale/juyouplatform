<template>
  <div>
    <el-form class="addVersionInfo" :model="form" :rules="rules">
      <div class="add-version">
        <p>当前版本 {{ nowVersion ? nowVersion : '暂无' }}</p>
      </div>
      <div class="add-versionNum">
        <el-form-item label="版本号" prop="version">
          <p>{{ currentVersion ? currentVersion : '暂无' }}</p>
        </el-form-item>
      </div>
      <div class="add-apk">
        <el-form-item label="安装包" prop="apk">
          <file-upload
            v-model="form.apk"
            :multiple="false"
            :disabled="isDetail"
          ></file-upload>
        </el-form-item>
      </div>
      <div class="add-update">
        <el-form-item label="更新内容" prop="updateContent">
          <el-input
            type="textarea"
            :rows="4"
            v-model="form.updateContent"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </div>
      <div class="add-switch" prop="isForce">
        <p>是否强制更新</p>
        <el-switch
          @change="onIsForce"
          v-model="form.isForce"
          active-color="#0052D9"
          inactive-color="#BDC1C5"
        >
        </el-switch>
      </div>
    </el-form>
  </div>
</template>

<script>
import fileUpload from '@partial/file-upload/uploadApk'
// const FORM = {
//   version: null,
//   apk: [],
//   updateContent: this.updateContent,
//   isForce: (this.statusType = 'ENABLE' ? true : false)
// }
const reg = /^([1-9]\d|[1-9])(.([1-9]\d|\d)){2}$/
export default {
  components: {
    fileUpload
  },
  props: {
    isDetail: {
      type: Boolean,
      default: false
    },
    nowVersion: {
      type: String
    },
    currentVersion: {
      type: String
    },
    updateContent: {
      type: String
    },
    updateApk: {
      type: String
    },
    statusType: {
      type: String
    },
    nowId: {
      type: Number
    },
    isForce: {
      type: Boolean
    }
  },
  data() {
    const versionValidator = (rule, value, callback) => {
      if (reg.test(value)) {
      } else {
        callback(new Error('请输入正确的版本号'))
      }
      callback()
    }
    const updateContentValidator = (rule, value, callback) => {
      console.log(value)
      if (value) {
      } else {
        return callback(new Error('请输入内容'))
      }
      callback()
    }
    return {
      // props: {
      //   nowVersion: Number
      // },
      form: {
        version: null,
        apk: [],
        updateContent: this.updateContent,
        isForce: this.isForce
      },
      rules: {
        version: {
          required: true,
          validator: versionValidator,
          trigger: 'change'
        },
        apk: { required: true, message: '请输入活动名称', trigger: 'change' },
        updateContent: {
          required: true,
          validator: updateContentValidator,
          trigger: 'change'
        }
      }
    }
  },
  mounted(){
    this.$nextTick(_=>{
      this.form.apk = [{url: this.updateApk, name: this.currentVersion}];
    })
  },
  methods: {
    async doSubmit(callback) {
      // console.log(this.form.apk[0].url)
      if (this.form.apk[0] == undefined) {
        this.$message.warning('请上传安装包')
        return
      }
      let reg = /\.(apk)$/
      if (reg.test(this.form.apk[0].url)) {
      } else {
        this.$message.warning('请上传正确的安装包')
        return
      }
      await this.$api
        .versionControlEditVersionControl({
          id: this.nowId,
          version: this.version,
          url: this.form.apk[0].url,
          appType: 'ANDROID',
          isForce: this.form.isForce,
          updateContent: this.form.updateContent
        })
        .then(() => {
          callback()
        })
    },
    onIsForce() {
      console.log(this.form.isForce)
    },
    cancel() {
      this.$emit('cancel', false)
    }
  },
  watch: {
    updateContent() {
      this.form.updateContent = this.updateContent
    },
    statusType() {
      this.form.isForce = this.isForce
    },
    nowVersion() {
      this.nowVersion = this.nowVersion
    },
    updateApk() {
      this.form.apk = [{url: this.updateApk, name: this.currentVersion}];
    }
  }
}
</script>

<style>
.add-versionNum .el-form-item {
  display: flex;
}

.add-versionNum .el-form-item__label {
  margin-right: 50px;
}

.add-versionNum .el-input__inner {
  width: 240px;
}

.add-apk .el-form-item {
  display: flex;
  flex-direction: column;
}
.add-apk .el-form-item__label {
  text-align: left;
}
.add-apk .el-form-item__content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-update .el-textarea__inner {
  resize: none;
}

.add-btn {
  display: flex;
  justify-content: space-around;
}
.add-btn button {
  width: 160px;
}
.add-switch {
  margin-bottom: 20px;
}
.add-switch p {
  display: inline-block;
  margin-right: 20px;
}
</style>
