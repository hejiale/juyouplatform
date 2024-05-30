<template>
  <div class="container">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-position="left"
      label-width="200px"
    >
      <el-form-item label="入口名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入" style="width: 200px;" maxlength="15" show-word-limit/>
        <span class="ml20" style="color:#8B8B8B">例：密码门、密码锁</span>
      </el-form-item>
      <el-form-item label="点击入口图标：" prop="enterUrl">
        <yc-image-uploader
          ref="enterUrl-cover"
          v-model="form.enterUrl"
          showTips
          :uploadSize="0.5"
          tips="图片大小不可超过500k，宽高比3:4，可上传png、jpg、gif"
        ></yc-image-uploader>
      </el-form-item>
      <!-- <el-form-item label="解密成功图片：" prop="successUrl">
        <yc-image-uploader
          ref="successUrl-cover"
          v-model="form.successUrl"
          showTips
          :uploadSize="0.5"
          tips="图片大小不可超过500k，可上传png、jpg、gif"
        ></yc-image-uploader>
      </el-form-item> -->
      <el-form-item label="解锁页面标题：" prop="title">
        <el-input v-model="form.title" placeholder="请输入"  style="width: 200px;" maxlength="15" show-word-limit/>
        <span class="ml20" style="color:#8B8B8B">例：请输入解锁密码（4位数字）</span>
      </el-form-item>
      <el-form-item label="正确密码：" prop="password">
        <el-input v-model="form.password" placeholder="请输入"  style="width: 200px;" show-word-limit type="number"/>
        <span class="ml20" style="color:#8B8B8B">允许4-6个数字。</span>
      </el-form-item>
      <el-form-item label="是否开启解密助手：" prop="isHelper">
        <el-radio v-model="form.isHelper" label="0">不开启</el-radio>
        <el-radio v-model="form.isHelper" label="1">内容和位置判定</el-radio>
        <el-tooltip class="item" effect="dark" content="每次输入后会告知数字和位置正确情况" placement="bottom">
            <i class="el-icon-question"></i>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div class="bottomBox" v-if="$powers('/roundPasswordDecryption/addPasswordDecryption')">
        <div @click="onReset">重置</div>
        <div @click="onSave" v-loading="isSubloading">保存</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    roundId: {
      type: Number,
      default: 0
    }
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if(!value || value.length < 4 || value.length > 6){
        callback('请输入4-6位长度密码')
      }else{
        callback();
      }
    }
    return {
      form: {},
      rules: {
        name: {
          required: true,
          message: '请输入入口名称',
          trigger: 'blur'
        },
        enterUrl: {
          required: true,
          message: '请选择点击入口图标',
          trigger: 'change'
        },
        successUrl: {
          required: true,
          message: '请选择解密成功图片',
          trigger: 'change'
        },
        title: {
          required: true,
          message: '请输入解锁页面标题',
          trigger: 'blur'
        },
        password: {
          required: true,
          validator: validatePassword,
          trigger: 'blur'
        },
        isHelper: {
          required: true,
          message: '请选择是否开启解密助手',
          trigger: 'change'
        },
      },
      isSubloading: false
    }
  },
  methods:{
    async queryInfo(){
        try{
            let res = await this.$api.getPasswordDecryptionByRoundId({
                id: this.roundId
            })
            if(res){
                res.isHelper = res.isHelper ? '1':'0'
                this.form = res;
                this.$nextTick(_=>{
                    this.$refs['enterUrl-cover'].setFileList(res.enterUrl);
                    this.$refs['successUrl-cover'].setFileList(res.successUrl);
                })
            }else{
              this.form = {
                name: '',
                title: '',
                password: '',
                isHelper: null
              };
              this.$nextTick(_=>{
                    this.$refs['enterUrl-cover'].setFileList();
                    this.$refs['successUrl-cover'].setFileList();
                })
            }
        }catch(e){
        }
    },
    onReset(){
        this.$confirm(
        `此操作将重置刚刚修改的数据, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          this.queryInfo();
        })
        .catch(() => {})
    },
    onSave(){
        this.$refs.form.validate(async (valid) => {
          if (!valid) return
          if(this.isSubloading)return;
          this.isSubloading = true;

          try{
            
            if(this.form.id){
                await this.$api.updatePasswordDecryption({
                    dramaId: this.$route.query.id,
                    enterUrl: this.form.enterUrl,
                    isHelper: this.form.isHelper === '1' ? true: false,
                    name: this.form.name,
                    password: this.form.password,
                    roundId: this.roundId,
                    successUrl: this.form.successUrl,
                    title: this.form.title,
                    id: this.form.id
                })
            }else{
                await this.$api.addPasswordDecryption({
                    dramaId: this.$route.query.id,
                    enterUrl: this.form.enterUrl,
                    isHelper: this.form.isHelper === '1' ? true: false,
                    name: this.form.name,
                    password: this.form.password,
                    roundId: this.roundId,
                    successUrl: this.form.successUrl,
                    title: this.form.title
                })
            }
            
            this.$message({
                type: 'success',
                message: `保存成功!`
            })
            this.isSubloading = false
          }catch(e){
            this.isSubloading = false
          }
        })
    }
  }
}
</script>
<style lang="sass" scoped>
.container
    padding: 20px 30px
.bottomBox
    margin-top: 30px
    @include hor-center-center
    div:nth-child(1)
        width: 60px
        height: 32px
        background: #E7E7E7
        border-radius: 3px
        font-size: 14px
        font-family: OPPOSans-Light, OPPOSans
        font-weight: 300
        color: rgba(0,0,0,0.9)
        line-height: 22px
        @include hor-center-center
        cursor: pointer
    div:nth-child(2)
        margin-left: 50px
        width: 60px
        height: 32px
        background: #3978F7
        border-radius: 3px
        font-size: 14px
        font-family: OPPOSans-Light, OPPOSans
        font-weight: 300
        color: #fff
        line-height: 22px
        @include hor-center-center
        cursor: pointer
</style>