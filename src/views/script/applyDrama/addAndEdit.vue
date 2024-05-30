<template>
  <div v-loading="subLoading">
    <div class="base-form">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-position="left"
        class="merchantform"
      >
        <el-row :gutter="5" class="mb20">
          <el-form-item label="申领剧本商品：" prop="productId" label-width="140px">
            <el-select
              v-model="form.productId"
              filterable
              remote
              reserve-keyword
              placeholder="请选择申领剧本商品"
              :remote-method="remoteMethod"
              :loading="loading"
              clearable
              :disabled="disable"
            >
              <el-option
                ref="option"
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申领时间：" prop="date" label-width="140px">
            <el-date-picker
              v-model="date"
              type="daterange"
              unlink-panels
              @change="dateChange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <div class="base-form-noteBox">
            <span>未开始：当前时间 < 起始时间，小程序显示未开始，此剧本无法申领</span>
            <span>申领中：起始时间 <当前时间 < 终止时间，小程序显示申领中，此剧本可申领</span>
            <span>已结束：当前时间 > 终止时间，小程序显示已结束，此剧本无法申领</span>
          </div>
        </el-row>
        <title-info
          title="申领任务配置"
          tips=""
          btnText="返回"
          :isShow="false"
        />
        <el-row :gutter="5" class="mb20">
          <el-form-item>
            <div class="assignment">
              <span>分值总计: {{totalScore}}</span>
              <div
                class="box"
                v-for="(item, idx) in form.boxDramaQuestionList"
                :key="idx"
              >
                <span class="box-title">第{{idx + 1}}题</span>
                <el-form-item
                  label="标题"
                  :prop="'boxDramaQuestionList.' + idx"
                  :rules="rules.title"
                >
                  <div>
                    <el-input
                      v-model="item.title"
                      placeholder="请输入标题"
                      maxlength="200"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 10}"
                    ></el-input>
                    <span class="ml10">{{item.title ? item.title.length: 0}}/200</span>
                  </div>
                </el-form-item>
                <el-form-item
                  label="回答方式"
                  :prop="'boxDramaQuestionList.' + idx"
                  :rules="rules.answerType"
                >
                  <el-checkbox-group v-model="item.answerType">
                    <el-checkbox v-for="it in $enums.AnswerType.list" :label="it.value" :key="it.value">{{it.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  label="必填"
                  :prop="'boxDramaQuestionList.' + idx"
                  :rules="rules.isRequired"
                  style="display:flex;align-items: center"
                >
                  <el-switch
                    v-model="item.isRequired"
                    active-color="#3978F7"
                    inactive-color="#EAEAEA">
                  </el-switch>
                </el-form-item>
                <el-form-item
                  label="说明"
                >
                  <div>
                    <el-input
                      v-model="item.remark"
                      placeholder="请输入说明"
                      type="textarea"
                      maxlength="200"
                      :autosize="{ minRows: 2, maxRows: 10}"
                    />
                  </div>
                </el-form-item>
                <el-form-item
                  label="示例"
                  style="margin-top: 30px"
                >
                  <yc-image-uploader
                    :ref="'imgUploadpicUrlList' + idx"
                    v-model="item.picUrlList"
                    uploadMultiple
                    :showTips="false"
                    width="120px"
                    :limit="9"
                  ></yc-image-uploader>
                </el-form-item>
                <el-form-item
                  label="分值"
                  :prop="'boxDramaQuestionList.' + idx"
                  :rules="rules.score"
                >
                  <div class="inpBox">
                    <el-input-number
                      v-model="item.score"
                      controls-position="right"
                      @input="onInputScore($event, idx)"
                    ></el-input-number>
                  </div>
                </el-form-item>
                <div class="box-operationBox">
                  <div class="box-operationBox-top" @click="onTop(idx)" :style="{'opacity': idx === 0 ? '0.2':'1'}">
                    <i class="el-icon-top"></i>
                    上移
                  </div>
                  <div class="box-operationBox-bottom" @click="onBottom(idx)" :style="{'opacity': idx === form.boxDramaQuestionList.length - 1 ? '0.2':'1'}">
                    <i class="el-icon-bottom"></i>
                    下移
                  </div>
                </div>
                <div
                  class="delBtn"
                  @click="delAssignment(idx, item)"
                  v-if="idx > 0"
                >
                  删除
                </div>
              </div>
              <div class="addBtn" @click="addAssignment">添加任务</div>
            </div>
          </el-form-item>
        </el-row>
        <el-row :gutter="5" class="mb20" v-if="$powers('/boxDramaApply/addOneBoxDramaApply') || $powers('/boxDramaApply/updateBoxDramaApplyById')">
          <div class="footerBtn">
            <el-button type="primary" @click="submit"
              >保存</el-button
            >
          </div>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import tinymce from '@partial/tinymce'
import titleInfo from '@partial/title-info'
export default {
  components: {
    tinymce,
    titleInfo
  },
  data() {
    var requiredTitle = (rule, value, callback) => {
      if (value.title) {
        callback()
      } else {
        callback(new Error('请输入标题'))
      }
    }
    var requiredRemark = (rule, value, callback) => {
      if (value.remark) {
        callback()
      } else {
        callback(new Error('请输入说明'))
      }
    }
    var requiredAnswer = (rule, value, callback) => {
      if (value.answerType.length) {
        callback()
      } else {
        callback(new Error('请选择回答方式'))
      }
    }
    var requiredRequired = (rule, value, callback) => {
      if (value.isRequired !== null) {
        callback()
      } else {
        callback(new Error('请选择是否必填'))
      }
    }
    var requiredScore = (rule, value, callback) => { 
      if (value.score) {
        callback()
      } else {
        callback(new Error('请输入分值'))
      }
    }
    var requiredDaterange = (rule, value, callback) => {
      if(!this.date || !this.date.length){
        return callback(new Error('请选择申领时间'))
      }
      return callback();
    }
    return {
      loading: false,
      subLoading: false,
      form: {},
      options: [],
      date: [],
      saving: false,
      rules: {
        productId: [{ required: true, message: '请选择剧本', trigger: 'change' }],
        date: [{ required: true, validator: requiredDaterange, trigger: 'change' }],
        title: [
          { required: true, validator: requiredTitle, trigger: 'blur' }
        ],
        remark: [
          { required: true, validator: requiredRemark, trigger: 'blur' }
        ],
        answerType: [
          { required: true, validator: requiredAnswer, trigger: 'change' }
        ],
        isRequired: [
          { required: true, validator: requiredRequired, trigger: 'blur' }
        ],
        score: [{ required: true, validator: requiredScore, trigger: 'blur' }]
      },
      answerType: [
        { label: '图片', value: false },
        { label: '文本', value: true }
      ]
    }
  },
  async activated() {
    if (this.$route.query.id) {
      this.queryBoxDramaApplyDetail();
    } else {
      this.date = [];
      this.options = [];
      this.form = {
        productId: null,
        startDate: null,
        endDate: null,
        boxDramaQuestionList: [{
          answerType: ['WORD'],
          picUrlList: [],
          isRequired: false,
          score: 0,
          title: null,
          remark: null
        }]
      }
      this.$nextTick(_=>{
        this.$refs.form.clearValidate();
      })
    }
  },
  computed:{
    totalScore(){
      let score = 0;
      if(this.form.boxDramaQuestionList){
        if(this.form.boxDramaQuestionList){
          this.form.boxDramaQuestionList.map(it=>{
            if(it.score){
              score += parseFloat(it.score)
            }
          })
        }
      }
      return score;
    },
    disable(){
      return this.$route.query.id !== undefined;
    }
  },
  methods: {
    onInputScore(e, idx){
      let score = 0;
      if(this.form.boxDramaQuestionList){
        this.form.boxDramaQuestionList.map((it,index)=>{
          if(idx !== index){
            score += parseFloat(it.score)
          }
        })
      } 
      if(100 - parseInt(e) - parseInt(score) < 0){
        this.form.boxDramaQuestionList[idx].score = "";
      }
    },
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        let data = await this.$api.queryNoApplyProduct({
          pageNo: 1,
          pageSize: 100,
          productName: query
        })
        if (data.records) {
          this.options = data.records.map(it=>({
            value: it.id,
            label: it.productName,
          }))
        }

        this.loading = false
      } else {
        this.options = []
      }
    },
    async queryDramaPage(query){
      let data = await this.$api.productGetList({
          pageNo: 1,
          pageSize: 100,
          productName: query,
          productType: 'APPLY_DRAMA_PRODUCT'
        })
        if (data.records) {
          this.options = data.records.map(it=>({
            value: it.id,
            label: it.productName,
          }))
        }
    },
    addAssignment() {
      let item = {
        answerType: ['WORD'],
        picUrlList: [],
        id: null,
        isRequired: false,
        score: 0,
        title: null
      }
      this.form.boxDramaQuestionList.push(item)
    },
    async delAssignment(idx, item) {
      if(item.id){
        try{
          let res = await this.$api.checkBoxDramaQuestionCanDelete({
            id: item.id
          })
          if(res.result){
            this.form.boxDramaQuestionList.splice(idx, 1)
          }else{
            this.$message.error('该任务不可删除')
          }
        }catch(e){}
      }else{
        this.form.boxDramaQuestionList.splice(idx, 1)
      }
    },
    submit() {
      let form = JSON.parse(JSON.stringify(this.form))
      //处理答案类型
      form.boxDramaQuestionList.map((it,index)=>{
        if(it.answerType.length === 2){
          it.answerType = 'ALL'
        }else if(it.answerType[0] === 'PICTURE'){
          it.answerType = 'PICTURE';
        }else{
          it.answerType = "WORD";
        }
        it.sort = index + 1;
      })

      this.$refs.form.validate(async (valid) => {
        if (!valid)return;

        //校验任务总分
        let count = 0;
        this.form.boxDramaQuestionList.map(q=>{
          count += q.score;
        })
        if(count < 100){
          this.$message.error('任务总分必须等于100')
          return;
        }

        if (this.saving) return
        this.saving = true

        try{
          if(this.$route.query.id){
            form.applyId = this.$route.query.id;
            await this.$api.boxDramaApplyUpdateBoxDramaApplyById(form)
          }else{
            await this.$api.boxDramaApplyAddBoxDramaApply(form)
          }
          
          this.$message.success(this.$route.query.id ? '编辑成功' : '新增成功')

          if(!this.$route.query.id){
            this.$utils.routeBack('/script/applyDrama')
          }else{
            this.queryBoxDramaApplyDetail();
          }
          this.saving = false;
        }catch(e){
          this.saving = false;
        }
      })
      this.saving = false
    },
    goBack() {
      this.$router.back()
    },
    onTop(index){
      if(index === 0)return;

      let arr = JSON.parse(JSON.stringify(this.form.boxDramaQuestionList))
      arr[index] = arr.splice(index - 1, 1, arr[index])[0];
      this.form.boxDramaQuestionList = arr;

      this.$nextTick(_=>{
        this.form.boxDramaQuestionList.map((v,i)=>{
          this.$refs[`imgUploadpicUrlList${i}`][0].setFileList(v.picUrlList)
        })
      })
    },
    onBottom(index){
      if(index === this.form.boxDramaQuestionList.length - 1)return;

      let arr = JSON.parse(JSON.stringify(this.form.boxDramaQuestionList))
      arr[index] = arr.splice(index + 1, 1, arr[index])[0]
      this.form.boxDramaQuestionList = arr;

      this.$nextTick(_=>{
        this.form.boxDramaQuestionList.map((v,i)=>{
          this.$refs[`imgUploadpicUrlList${i}`][0].setFileList(v.picUrlList)
        })
      })
    },
    // 日期选择控件切换的回调
    dateChange(val) {
      if(this.date.length){
        let curDate = new Date();
        curDate = curDate.setDate(curDate.getDate() - 1);

        if(new Date(val[0]) < curDate){
          this.date = null
          return this.$message.error(`申领起始时间不能小于当天`)
        }
        this.form.startDate = this.$dayjs(val[0]).format('YYYY-MM-DD 00:00:00')
        this.form.endDate = this.$dayjs(val[1]).format('YYYY-MM-DD 23:59:59')
      }
    },
    async queryBoxDramaApplyDetail(){
      this.subLoading = true;
      try{
        let data = await this.$api.boxDramaApplyQueryBoxDramaApplyDetail({
          applyId: this.$route.query.id
        })
        
        if(!data.boxDramaQuestionResponse.length){
          data.boxDramaQuestionList = [{
            answerType: ['WORD'],
            productId: null,
            picUrlList: [],
            isRequired: false,
            score: 0,
            title: null,
            remark: null
          }]
        }else{
          data.boxDramaQuestionResponse.map(it=>{
            if(it.answerType === 'ALL'){
              it.answerType = ['PICTURE','WORD']
            }else{
              it.answerType = [it.answerType]
            }
          })
          data.boxDramaQuestionList = data.boxDramaQuestionResponse
        }
        
        await this.queryDramaPage(data.productName)
        this.form = data;
        this.isShowImg = true;
        this.date = [data.startDate, data.endDate];
        this.$nextTick(_=>{
          this.form.boxDramaQuestionList.map((v,i)=>{
            this.$refs[`imgUploadpicUrlList${i}`][0].setFileList(v.picUrlList)
          })
        })
        this.subLoading = false;
      }catch(e){}
    }
  }
}
</script>

<style lang="sass">
.table-header__custom
  display: table-row
  color: #393D4E
  font-size: 16px
  background-color: #EBEEF5 !important
  th
    background-color: #EBEEF5 !important
.base-form
    padding: unset !important
    .remind
        width: 400px
        margin-top: 12px
        line-height: 14px
        color: #7F7F7F
        font-size: 14px
    .inpBox
        position: relative
        .el-input__inner
        .incAndDec
            position: absolute
            right: 10px
            top: 0
            bottom: 0
            display: flex
            flex-direction: column
            justify-content: center
            align-items: center

            .inc
                width: 16px
                height: 16px
                background-color: #AEAEAE
                -webkit-clip-path: polygon(50% 50%, 0% 100%, 100% 100%)
                clip-path: polygon(50% 50%, 0% 100%, 100% 100%)
            .dec
                margin-top: 4px
                width: 16px
                height: 16px
                background-color: #AEAEAE
                -webkit-clip-path: polygon(50% 50%, 0 0, 100% 0)
                clip-path: polygon(50% 50%, 0 0, 100% 0)
    .explain,.assignment
        width: 100%
        padding: 16px
        background-color: #F2F2F2
        .box
            background-color: #fff
            padding: 20px
            position: relative
            margin-bottom: 10px
            &-title
              font-size: 15px
              font-weight: 500
            .delBtn
                display: inline-block
                padding: 8px 20px
                line-height: 14px
                text-align: center
                border: 1px solid #0052D9
                border-radius: 4px
                color: #0052D9
                position: absolute
                top: 10px
                right: 20px
                cursor: pointer
            &-operationBox
              margin-top: 20px
              @include hor
              align-items: center
              &-top
                cursor: pointer
              &-bottom
                cursor: pointer
                margin-left: 30px
        .addBtn
            display: inline-block
            padding: 12px 16px
            line-height: 14px
            text-align: center
            border-radius: 4px
            color: #fff
            background-color: #3978F7
            cursor: pointer
        .el-form-item
            margin-bottom: 8px
    .footerBtn
    &-noteBox
      margin-left: 150px
      @include ver

    .el-form-item
    .el-form-item__content
        display: flex
        justify-content: first baseline
        align-items: center
    .el-form-item__label
        min-width: 100px
        margin-right: 10px
    .el-table__header-wrapper
        display: none
    .el-table__cell
        text-align: center
</style>
