<template>
  <div>
    <yc-table
      :table="table"
      ref="myTable"
      :hideTableTitle="true"
      :topTitle="topTitle"
      :isShowPagination="false"
      :isAutoLoad="false"
    >
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button
            type="primary"
            @click="onAdd"
            v-if="$powers('/murderMysteryTool/addToolForQuestion')"
            >创建答题</el-button
          >
        </div>
      </template>
      <template slot="action" slot-scope="props">
        <el-button
          type="text"
          @click="doEdit(props)"
          v-if="$powers('/murderMysteryTool/updateToolForQuestion')"
          >编辑</el-button
        >
        <el-button
          type="text"
          class="reject"
          @click="doDel(props.id)"
          v-if="$powers('/murderMysteryTool/deleteToolForQuestion')"
          >删除</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      :title="form.id ? '编辑问题工具': '新增问题工具'"
      :visible.sync="dialogVisible"
      class="role-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="1000px"
      center
    >
      <dialogContent
        :isLoading="subLoading"
        @on-back="handleClose"
        @on-cancel="handleClose"
        @on-sure="doSubmit"
        v-if="$powers('/murderMysteryTool/configQuestionReward')"
        :hideFooter="true"
      >
        <template slot="content">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="left"
            label-width="120px"
            class="user-form"
            style="padding: 0 50px"
            center
          >
            <el-form-item label="题目" prop="question">
              <el-input
                v-model="form.question"
                placeholder="请输入"
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="音视频文件">
              <file-upload
                v-model="videoList"
                :multiple="false"
                :verifyChinese="true"
                @uploaded="onCompleteUpload"
                @remove="onRemoveFile"
                accept=".mp3,.wav,.mp4"
              ></file-upload>
            </el-form-item>
            <div class="partingLine"></div>
            <el-form-item label="题型和发放设置"></el-form-item>
            <el-form-item label="题型" prop="questionType">
              <el-select v-model="form.questionType" placeholder="请选择">
                <el-option
                  v-for="i in $enums.QuestionType.list"
                  :label="i.label"
                  :value="i.value"
                  :key="i.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="可发放角色" prop="roleIds">
              <el-select
                v-model="form.roleIds"
                multiple
                filterable
                clearable
                placeholder="请选择"
                @change="judge"
                style="width: 500px"
              >
                <el-option
                  v-for="i in option"
                  :label="i.roleName"
                  :value="i.id"
                  :key="i.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="选项设置"></el-form-item>
            <el-table
              ref="multipleTable"
              :data="form.answers"
              class="mb20 info-table"
              style="width: 100%"
            >
              <el-table-column
                label="正确答案（可不选）"
                :align="'left'"
                width="160"
              >
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.isTrue"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="选项文字" :align="'left'">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.content"
                    placeholder="请输入"
                    style="width: 400px"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" :align="'left'" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    class="reject"
                    @click="doDelContent(scope.cxt)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="btn">
              <el-button type="primary" plain @click="addContent"
                >添加选项</el-button
              >
            </div>
            <div class="btn" style="margin-top: 20px">
              <el-button
                type="primary"
                @click="firstSubmit"
                :loading="subLoadingFirst"
                >保存选项配置</el-button
              >
            </div>
            <div class="partingLine"></div>
            <el-form-item
              label="奖励配置"
              v-if="awardArr.questionId"
            ></el-form-item>
            <div class="tips" v-if="awardArr.questionId">
              可配置问题的奖励，主持人不可修改，玩家完成回答后，系统自动判定触发逻辑。
            </div>
            <div class="optionsBox">
              <div class="optionsBox-btnBox">
                <div
                  class="optionsBox-btnBox-item"
                  v-for="item in roleTag"
                  :key="item.id"
                  @click="getCurrentQue(item.id)"
                  :style="
                    item.id == currentQue
                      ? 'background:#737F93;color:#ffffff'
                      : ''
                  "
                >
                  {{ getRoleName(item) }}
                </div>
              </div>
              <div class="optionsBox-roleBox">
                <div class="optionsBox-roleBox-label"></div>
                <div class="optionsBox-roleBox-role">选项文字</div>
                <div class="optionsBox-roleBox-type">发放方式</div>
                <div class="optionsBox-roleBox-who">发放给谁</div>
                <div class="optionsBox-roleBox-clue">发放线索</div>
              </div>
              <div>
                <template v-if="awardArr.questionId">
                  <div
                    class="optionsBox-roleBox"
                    v-for="it in awardArr.reward"
                    :key="it.answerId"
                  >
                    <div class="optionsBox-roleBox-label">选项为</div>
                    <div class="optionsBox-roleBox-role">{{ it.content }}</div>
                    <!-- <div class="optionsBox-roleBox-role">
                      <el-select
                        v-model="form.roleIds[idx]"
                        placeholder="请选择"
                        disabled
                      >
                        <el-option
                          v-for="i in option"
                          :label="i.roleName"
                          :value="i.id"
                          :key="i.id"
                        />
                      </el-select>
                    </div> -->
                    <div class="optionsBox-roleBox-type">
                      <el-select v-model="it.receiveType" placeholder="请选择">
                        <el-option
                          v-for="i in $enums.ReceiveType.list"
                          :label="i.label"
                          :value="i.value"
                          :key="i.value"
                        />
                      </el-select>
                    </div>
                    <div class="optionsBox-roleBox-who">
                      <el-select
                        v-model="it.targetRoleId"
                        placeholder="请选择"
                        v-if="it.receiveType == 'ROLE'"
                      >
                        <el-option
                          v-for="i in option"
                          :label="i.roleName"
                          :value="i.id"
                          :key="i.id"
                        />
                      </el-select>
                    </div>
                    <div class="optionsBox-roleBox-clue">
                      <el-select
                        v-model="it.clueId"
                        filterable
                        placeholder="'请输入关键字'"
                        @change="onChangeClue"
                      >
                        <el-option
                          v-for="i in clueList"
                          :label="i.clueName"
                          :value="i.id"
                          :key="i.id"
                          :disabled="!i.isCanUsed"
                        />
                      </el-select>
                    </div>
                  </div>
                </template>
              </div>
              <div class="optionsBox-footer">
                <el-button type="info" @click="handleClose">关闭</el-button>
                <el-button
                  type="primary"
                  @click="doSubmit"
                  v-if="
                    awardArr.questionId &&
                    $powers('/murderMysteryTool/configQuestionReward')
                  "
                  :loading="subLoading"
                  >保存当前角色配置</el-button
                >
              </div>
            </div>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
import dialogContent from '@global/dialog'
import fileUpload from '@partial/file-upload'
const FORM = {
  question: '',
  questionType: 'ONCE',
  roleIds: [],
  answers: []
}

export default {
  components: {
    dialogContent,
    fileUpload
  },
  data(vm) {
    return {
      table: {
        customTopTitle: true,
        api: this.$api.murderMysteryToolToolForQuestionItemList,
        query: {
          dramaId: this.$route.query.id
        },
        searchData: [
          {
            title: '答题名称',
            type: 'input',
            model: 'questionName',
            placeholder: '请输入'
          }
        ],
        columns: [
          {
            title: '答题名称',
            key: 'question',
            showTooltip: true,
            align: 'left'
          },
          {
            title: '操作',
            align: 'left',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      form: this.$_.cloneDeep(FORM),
      rules: {
        question: {
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        },
        questionType: {
          required: true,
          message: '请选择题型',
          trigger: 'change'
        },
        roleIds: {
          required: true,
          message: '请选择可发放角色',
          trigger: 'change'
        }
      },
      awardArr: [],
      option: [],
      videoList: [],
      multipleSelection: [],
      clueList: [],
      roleTag: [],
      currentQue: null,
      isCompleteUpload: false,
      dialogVisible: false,
      subLoading: false,
      subLoadingFirst: false,
      clueLoading: false,
      topTitle:
        '主持人可发送问题给玩家回答，如果配置了”编辑奖励“，则系统根据设定自动发放奖励。'
    }
  },
  computed: {
    // disabled() {
    //   return function (arr) {
    //     if (arr.indexOf(0) != -1) {
    //       return true
    //     }
    //   }
    // },
    getRoleName() {
      return function (item) {
        console.log(item)
        let res = this.option.filter((v) => v.id == item.id)
        console.log(res)
        return res[0].roleName
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.myTable.refresh()
      this.queryRoleList()
    },
    async getCurrentQue(i) {
      this.currentQue = i
      let res = await this.$api.murderMysteryToolToolForQuestionRewardDetail({
        questionId: this.form.id,
        responseRoleId: i
      })
      this.awardArr = {
        questionId: this.form.id,
        responseRoleId: i,
        reward: []
      }
      if (res[0]) {
        res.map((v) => {
          this.awardArr.reward.push({
            answerId: v.answerId,
            content: v.answerContent,
            clueId: v.clueId,
            receiveType: v.receiveType,
            targetRoleId: v.targetRoleId,
            id: v.id
          })
        })
      } else {
        this.form.answers.map((v) => {
          this.awardArr.reward.push({
            answerId: v.id,
            content: v.content,
            clueId: null,
            receiveType: 'PUBLIC',
            targetRoleId: null
          })
        })
      }
      await this.remoteMethod();
    },
    async queryRoleList() {
      let data = await this.$api.murderMysteryRoleQueryMurderMysteryRole({
        id: this.$route.query.id
      })
      // this.option.push(...data)
      // data.unshift({ roleName: '全部', id: 0 })
      this.option = data
    },
    judge() {
      if (this.form.roleIds.indexOf(0) != -1) {
        this.form.roleIds = [0]
      }
    },
    onChangeClue(){
      //过滤线索
      if(this.awardArr.reward){
        this.clueList.map(v=>{
          let idx = this.awardArr.reward.findIndex(i=>i.clueId === v.id);
          if(idx !== -1){
            v.isCanUsed = false;
          }
        })
      }
    },
    //  线索下拉筛选
    async remoteMethod() {
      try {
        let res = await this.$api.queryUnusedClue(
          {
            id: this.$route.query.id
          }
        )
        this.clueList = res
      } catch(e) {
      }
    },
    addContent() {
      this.form.answers.push({ content: '', isTrue: false })
    },
    doDelContent(i) {
      this.form.answers.splice(i, 1)
    },
    async onAdd(){
      this.form = {
        question: '',
        questionType: 'ONCE',
        roleIds: [],
        answers: []
      }
      this.awardArr = {};
      this.roleTag = [];
      this.videoList = [];
      this.multipleSelection = [];
      this.clueList = [];
      this.dialogVisible = true;
      this.$nextTick(_=>{
        this.$refs.form.clearValidate();
      })
    },
    async doEdit(prop) {
      this.form.id = prop.id
      await this.queryDetail()
      this.dialogVisible = true
    },
    doDel(id) {
      this.$confirm(`此操作将删除该线索, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.murderMysteryToolDeleteToolForQuestion({
            questionId: id
          })
          this.$message({
            type: 'success',
            message: `删除成功!`
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
    async queryDetail() {
      if (this.form.id) {
        let data = await this.$api.murderMysteryToolToolForQuestionDetail({
          questionId: this.form.id
        })
        
        data.answers = data.answerItemList
        this.form = data
        if(this.form.url){
          let url = this.form.url
          let name = this.form.url.split('/').pop()
          this.videoList = []
          this.videoList.push({ url, name })
        }
        
        this.roleTag = this.option.filter((v) => {
          return this.form.roleIds.includes(v.id)
        })
        console.log(this.roleTag)
        // this.form.roleIds.map(async (v, i) => {
        //   let res =
        //     await this.$api.murderMysteryToolToolForQuestionRewardDetail({
        //       questionId: this.form.id,
        //       responseRoleId: v
        //     })
        //   this.awardArr.push({
        //     questionId: this.form.id,
        //     responseRoleId: v,
        //     reward: []
        //   })
        //   res.map((val) => {
        //     this.awardArr[i].reward.push({
        //       answerId: val.answerId,
        //       // content: val.content,
        //       clueId: val.clueId,
        //       receiveType: val.receiveType,
        //       targetRoleId: val.targetRoleId,
        //       id: val.id
        //     })
        //   })
        // })
        // console.log(this.awardArr)
        // this.form.roleIds.map((v, i) => {
        //   this.awardArr.push({
        //     questionId: this.form.id,
        //     responseRoleId: v,
        //     reward: []
        //   })
        //   this.form.answers.map((val) => {
        //     this.awardArr[i].reward.push({
        //       answerId: val.id,
        //       content: val.content,
        //       clueId: null,
        //       receiveType: 'PUBLIC',
        //       targetRoleId: null
        //     })
        //   })
        // })
      }
    },
    async firstSubmit() {
      this.$refs.form.validate(async (valid) => {
        if(!valid)return;

        let it = this.form.answers.find(it=>!it.content);
        if(it){
          this.$message.error('选项设置中文字为空！')
          return;
        }

        if (this.subLoadingFirst) return
        this.subLoadingFirst = true

        try {
          let url = this.videoList.length ? this.videoList[0].url: null;
          if (this.form.id) {
            await this.$api.murderMysteryToolUpdateToolForQuestion({
              ...this.form,
              dramaId: this.$route.query.id,
              url
            })
          } else {
            let data = await this.$api.murderMysteryToolAddToolForQuestion({
              ...this.form,
              dramaId: this.$route.query.id,
              url
            })
            this.form.id = data.id
          }
          await this.queryDetail()
          await this.getCurrentQue(this.form.roleIds[0])
          this.$message.success('操作成功')
          await this.$refs.myTable.refresh()
          this.subLoadingFirst = false
        } catch (e) {
          this.subLoadingFirst = false
          console.log(e)
        }
      })
    },
    async doSubmit() {
      let idx = this.awardArr.reward.findIndex(it=>!it.clueId);
      if(idx !== -1){
        this.$message.error('请选择发放线索')
        return;
      }
      if (this.subLoading) return
      this.subLoading = true
      try {
        await this.$api.murderMysteryToolCleanQuestionReward({
          questionId: this.form.id,
          responseRoleId: this.currentQue
        })
        await this.$api.murderMysteryToolConfigQuestionReward({
          ...this.awardArr
        })
        // this.dialogVisible = false
        // this.clearData()
        this.$message.success('操作成功')
        await this.$refs.myTable.refresh()
        this.subLoading = false
      } catch (e) {
        this.subLoading = false
        console.log(e)
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
    handleClose() {
      this.clearData()
      this.dialogVisible = false
    },
    clearData() {
      this.form = this.$_.cloneDeep(FORM)
      this.videoList = []
      this.awardArr = []
    }
  }
}
</script>

<style lang="sass" scoped>
.partingLine
  height: 1px
  background: #D8D8D8
  margin: 20px 0
.btn
  display: flex
  justify-content: center
.tips
  font-size: 14px
  font-family: OPPOSans-Regular, OPPOSans
  font-weight: 400
  color: #727272
  line-height: 23px
  margin: 20px
.optionsBox
  margin-left: 50px
  &-btnBox
    display: flex
    &-item
      width: 100px
      height: 36px
      font-style: 16px
      font-weight: 500
      border: 1px solid #3662EC
      color: #3662EC
      line-height: 36px
      text-align: center
      cursor: pointer
  &-roleBox
    display: flex
    align-items: center
    margin: 20px 0
    &-label
      width: 160px
      margin-right: 20px
    &-role
      width: 160px
      margin-right: 20px
    &-type
      width: 160px
      margin-right: 20px
    &-who
      width: 160px
      margin-right: 20px
    &-clue
      width: 240px
      margin-right: 20px
  &-footer
    display: flex
    justify-content: space-evenly
</style>
