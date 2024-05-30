<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-position="left"
      label-width="200px"
    >
      <el-form-item label="主图" prop="url">
        <yc-image-uploader
          ref="url-list"
          v-model="form.url"
          uploadMultiple
          showTips
          :uploadSize="1"
          :limit="4"
        ></yc-image-uploader>
      </el-form-item>
      <el-form-item label="活动标题：" prop="title">
        <el-input v-model="form.title" placeholder="请输入" maxlength="50" />
      </el-form-item>
      <el-form-item label="活动报名时间：" prop="booDate">
        <el-date-picker
          v-model="bookDate"
          type="daterange"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="活动开始时间" prop="eventStartTime">
        <el-date-picker
          v-model="form.eventStartTime"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="非会员报名费用：" prop="price">
        <el-input v-model="form.price" placeholder="请输入" maxlength="50" />
      </el-form-item>
      <el-form-item label="定位地址：" prop="address">
        <amap :dateAddress.sync="dateAddress" ref="amap"></amap>
      </el-form-item>
      <el-form-item label="活动详情：" prop="content">
        <tinymce ref="editor" v-model="form.content" />
      </el-form-item>
      <div class="submit">
        <el-button type="primary" v-loading="subLoading" @click="onSubmit"
          >提交</el-button
        >
      </div>
    </el-form>
  </div>
</template>
  <script>
import amap from '@views/exhibition/amap'
import tinymce from '@partial/tinymce'
import fileUpload from '@partial/file-upload'
export default {
  components: {
    amap,
    tinymce,
    fileUpload
  },
  data(vm) {
    const validatorDateRang = (rule, value, callback) => {
      if (vm.bookDate && vm.bookDate.length === 2) {
        callback()
      } else {
        callback(new Error('请选择活动报名开始时间和结束时间 ！！'))
      }
    }
    return {
      form: {},
      rules: {
        url: {
          required: true,
          message: '请选择主图',
          trigger: 'change'
        },
        title: {
          required: true,
          message: '请填写活动标题',
          trigger: ['change', 'blur']
        },
        address: {
          required: true,
          message: '请填写定位地址',
          trigger: ['change', 'blur']
        },
        price: {
          required: true,
          message: '请填写非会员报名费用',
          trigger: ['change', 'blur']
        },
        content: {
          required: true,
          message: '请填写活动详情',
          trigger: ['change', 'blur']
        },
        booDate: {
          required: true,
          trigger: ['change', 'blur'],
          validator: validatorDateRang
        },
        eventStartTime: {
          required: true,
          message: '请选择活动开始时间',
          trigger: ['change', 'blur']
        }
      },
      bookDate: null,
      dateAddress: null,
      subLoading: false,
      canDo: false
    }
  },
  watch: {
    dateAddress: {
      handler(newData) {
        if (newData) {
          this.form.address = newData.pname + newData.cityname + newData.adname + newData.address;
          this.form.latitude = newData.location.lat;
          this.form.longitude = newData.location.lng;
        } else {
          //清空数据
          this.form.address = null
          this.form.latitude = null
          this.form.longitude = null
        }
      }
    }
  },
  activated() {
    this.queryActivityDetail()
  },
  methods: {
    onSubmit() {
      if(this.canDo)return;
      this.canDo = true;

      this.$refs.form.validate(async (valid) => {
        if (!valid) return

        try{
          await this.$api.updateLpActivity({
            content: this.form.content,
            eventStartTime: this.$dayjs(this.form.eventStartTime).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            address: this.form.address,
            latitude: this.form.latitude,
            longitude: this.form.longitude,
            price: parseFloat(this.form.price) * 100,
            regEndTime: this.$dayjs(this.bookDate[1]).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            regStartTime: this.$dayjs(this.bookDate[0]).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            title: this.form.title,
            url: this.form.url,
            id: this.form.id
          })
          this.$message.success('修改成功')
          this.canDo = false;
        }catch(e){
          this.canDo = false;
        }
      })
    },
    async queryActivityDetail() {
      let res = await this.$api.detailLpActivity({
        activityId: this.$route.query.id
      })
      res.price = parseFloat(res.price) / 100;
      this.form = res;
      this.bookDate = [new Date(this.form.regStartTime), new Date(this.form.regEndTime)]

      this.$nextTick((_) => {
        this.$refs['url-list'].setFileList(this.form.url)
        this.$refs['amap'].setsearchKey(this.form.address)
      })
    }
  }
}
</script>
  <style lang="sass" scoped>
.submit
    width: 260px
    height: 44px
    margin-left: 50%
    transform: translateX(-50%)
</style>