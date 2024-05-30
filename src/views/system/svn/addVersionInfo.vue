<template>
  <div>
    <el-form class="addVersionInfo" :model="form" :rules="rules" ref="form">
      <div class="add-version">
        <p>当前版本 {{ nowVersion ? nowVersion : '暂无' }}</p>
      </div>
      <div class="add-versionNum">
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入"></el-input>
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
      <div class="add-switch">
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
import { devServer } from '../../../../vue.config'
const FORM = {
  version: null,
  apk: [],
  updateContent: null,
  isForce: false
}
const reg =
  devServer.proxy == 'https://www.juyyds.com'
    ? /^([1-9]\d|[1-9])(.([1-9]\d|\d)){2}$/
    : /^([1-9]\d|[1-9])(.([1-9]\d|\d)){3}$/
export default {
  components: {
    fileUpload,
    devServer
  },
  props: {
    isDetail: {
      type: Boolean,
      default: false
    },
    nowVersion: {
      type: String
    },
    qq: {
      type: Number
    }
  },
  data() {
    const versionValidator = (rule, value, callback) => {
      if (reg.test(value)) {
        if (this.nowVersion) {
        } else {
          callback()
        }
        if (this.compareVersion(value, this.nowVersion) == 1) {
        } else {
          callback(new Error('需大于当前版本号'))
        }
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
      form: this.$_.cloneDeep(FORM),
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
  watch: {
    nowVersion() {
      this.nowVersion = this.nowVersion
    }
  },
  methods: {
    doSubmit(callback) {
      this.$refs.form.validate(async (valid) => {
        if(!valid)return;
        
        if (this.qq) {
          this.$message.warning('需启用或删除最新版本')
          return false
        }
        let reg = /\.(apk)$/
        if (reg.test(this.form.apk[0].url)) {
        } else {
          this.$message.warning('请上传正确的安装包')
          return
        }
        console.log(this.form.apk[0].url)
        await this.$api
          .versionControlAddVersionControl({
            version: this.form.version,
            url: this.form.apk[0].url,
            appType: 'ANDROID',
            isForce: this.form.isForce,
            updateContent: this.form.updateContent
          })
          .then(() => {
            callback()
          })
      })
    },
    onIsForce() {
      console.log(this.form.isForce)
    },
    compareVersion(version1, version2) {
      let newVersion1 = ''
      let newVersion2 = ''
      if (devServer.proxy == 'https://www.juyyds.com') {
        newVersion1 =
          `${version1}`.split('.').length < 3
            ? `${version1}`.concat('.0')
            : `${version1}`
        newVersion2 =
          `${version2}`.split('.').length < 3
            ? `${version2}`.concat('.0')
            : `${version2}`
      } else {
        newVersion1 =
          `${version1}`.split('.').length < 4
            ? `${version1}`.concat('.0')
            : `${version1}`
        newVersion2 =
          `${version2}`.split('.').length < 4
            ? `${version2}`.concat('.0')
            : `${version2}`
      }

      //计算版本号大小,转化大小
      function toNum(a) {
        const c = a.toString().split('.')
        const num_place = ['', '0', '00', '000', '0000'],
          r = num_place.reverse()
        for (let i = 0; i < c.length; i++) {
          const len = c[i].length
          c[i] = r[len] + c[i]
        }
        return c.join('')
      }

      //检测版本号是否需要更新
      function checkPlugin(a, b) {
        const numA = toNum(a)
        const numB = toNum(b)
        return numA > numB ? 1 : numA < numB ? -1 : 0
      }
      return checkPlugin(newVersion1, newVersion2)
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
