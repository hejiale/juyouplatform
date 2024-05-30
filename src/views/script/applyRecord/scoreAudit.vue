<template>
  <div class="container">
    <div class="container-title">总得分：{{totalScore}}分（待审核*{{waitAuditCount}}）</div>
    <div class="container-questionItem" v-for="(item,idx) in applyDramas" :key="item.questionId">
      <div class="container-questionItem-title">
        {{idx + 1}}.{{item.isRequired ? '[必填]':''}} {{item.question}}
      </div>
      <div class="container-questionItem-score">(总分{{item.score}}分)</div>
      <div class="container-questionItem-images">
        <span>图片：</span>
        <div class="container-questionItem-images-list">
          <el-image
            v-for="url in item.urls"
            :key="url"
            :src="url"
            :preview-src-list="item.urls"
            class="container-questionItem-images-list-img"
          >
          </el-image>
        </div>
      </div>
      <div class="container-questionItem-texts">
        <span>文字：</span>
        <span class="container-questionItem-texts-content"
          >{{item.answerWord}}</span
        >
      </div>
      <div class="container-questionItem-auditBox">
        <span class="container-questionItem-auditBox-title">实际得分</span>
        <el-input
          v-model="item.realyScore"
          placeholder="请输入"
          class="container-questionItem-auditBox-scoreInput"
          @input="onInputRealScore($event, item)"
        />
        <el-select
          v-model="item.answerApplyStatus"
          placeholder="请选择"
          class="container-questionItem-auditBox-auditStatusSelect"
          :disabled="item.oldStatus === 'PASS'"
        >
          <el-option
            v-for="i in $enums.AnswerApplyStatus.list"
            :label="i.label"
            :value="i.value"
            :key="i.value"
          />
        </el-select>
        <el-input
          v-model="item.reason"
          placeholder="请输入"
          class="container-questionItem-auditBox-inputRemark"
          :disabled="item.answerApplyStatus !== 'UN_PASS'"
        />
      </div>
    </div>
    <div class="container-bottomBox">
        <div @click="onBack">返回</div>
        <div @click="onSave">保存</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      previewList: [],
      applyDramas: []
    }
  },
  activated(){
    this.queryScoreData();
  },
  computed:{
    waitAuditCount(){
      let count = 0;
      this.applyDramas.map(it=>{
        if(it.answerApplyStatus === 'WAIT'){
          count++;
        }
      })
      return count;
    },
    totalScore(){
      let score = 0;
      this.applyDramas.map(it=>{
        score += parseFloat(it.score)
      })
      return score;
    }
  },
  methods: {
    onBack(){
      this.$router.push({
        name: 'scriptApplyRecord'
      })
    },
    onInputRealScore(e, item){
      if(Number(e) > item.score){
        item.realyScore = item.score
      }
    },
    async queryScoreData(){
      try{
        let data = await this.$api.boxStoreApplyQueryBoxStoreAnswer({id: this.$route.query.id})
        data.boxStoreAnswerItems.map(it=>{
          it.oldStatus = it.answerApplyStatus;
        })
        this.applyDramas = data.boxStoreAnswerItems;
      }catch(e){}
    },
    async onSave(){
      try{
        let auditBoxStoreApplyItemList = JSON.parse(JSON.stringify(this.applyDramas));
        auditBoxStoreApplyItemList.map(it=>{
          it.id = it.answerId
        })
        await this.$api.boxDramaApplyAuditBoxStoreApply({
          auditBoxStoreApplyItemList
        })
        this.$message.success('保存成功!')
        this.queryScoreData();
      }catch(e){}
    }
  }
}
</script>
<style lang="sass" scoped>
.container
    &-title
        margin: 39px 0 0 15px
        font-size: 24px
        font-family: OPPOSans-Regular, OPPOSans
        font-weight: 400
        color: rgba(0,0,0,0.9)
        line-height: 22px
    &-questionItem
        @include ver
        margin-top: 27px
        margin-left: 15px
        border-bottom: 1px solid #D8D8D8
        padding-bottom: 38px
        &-title, &-score
            font-size: 14px
            font-family: OPPOSans-Regular, OPPOSans
            font-weight: 400
            color: rgba(0,0,0,0.9)
            line-height: 22px
        &-images
            margin-top: 27px
            @include hor
            align-items: center
            span
                font-size: 14px
                font-family: OPPOSans-Regular, OPPOSans
                font-weight: 400
                color: #5D5D5D !important
                line-height: 22px
            &-list
                margin-left: 30px
                &-img
                    width: 72px
                    height: 72px
                    border-radius: 4px
                    margin-right: 10px
        &-texts
            margin-top: 8px
            &-content
                margin-left: 30px
                font-size: 14px
                font-family: OPPOSans-Regular, OPPOSans
                font-weight: 400
                color: #5D5D5D
                line-height: 22px
        &-auditBox
            @include hor
            align-items: center
            margin-top: 30px
            &-title
                font-size: 14px
                font-family: HarmonyOS Sans SC-Regular, HarmonyOS Sans SC
                font-weight: 400
                color: #E34D59
                line-height: 24px
            &-scoreInput
                margin-left: 20px
                width: 80px
            &-auditStatusSelect
                margin-left: 20px
                width: 100px
            &-inputRemark
                margin-left: 20px
                width: 50vw
    &-bottomBox
        @include hor-center-center
        margin-top: 21px
        div
            width: 60px
            height: 32px
            border-radius: 3px
            font-size: 14px
            font-family: OPPOSans-Light, OPPOSans
            font-weight: 300
            @include hor-center-center
            cursor: pointer
        div:nth-child(1)
            background: #E7E7E7
            color: rgba(0,0,0,0.9)
        div:nth-child(2)
            background: #3978F7
            color: #fff
            margin-left: 120px
</style>