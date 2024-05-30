<template>
  <div class="container">
    <div>一条线索只能配置一次</div>
    <el-row type="flex">
      <el-col :span="10" class="left_box">
        <el-input
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          v-model="leftValue"
        >
        </el-input>
        <div class="layout_box">
          <div class="choose_box">
            <ul class="content_box" v-if="transferData">
              <li v-for="item in leftList" :key="item.clueId">
                <el-checkbox v-model="item.select" :disabled="disabled">{{
                  item.clueName
                }}</el-checkbox>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="middle-box">
        <div @click="remove" v-if="!disabled">
          <i class="el-icon-caret-left"></i>移除
        </div>
        <div @click="add" v-if="!disabled">
          添加<i class="el-icon-caret-right"></i>
        </div>
      </el-col>
      <el-col :span="10" class="right_box">
        <el-input
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          v-model="rightVaue"
        >
        </el-input>
        <div class="layout_box">
          <div class="choose_box">
            <ul class="content_box" v-if="transferData">
              <li v-for="item in rightList" :key="item.clueId">
                <el-checkbox v-model="item.select" :disabled="disabled">{{
                  item.clueName
                }}</el-checkbox>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <div slot="footer" class="dialog-footer" v-if="!disabled">
      <el-button type="primary" @click="doSubmitAdd" v-loading="subLoading"
        >提 交</el-button
      >
      <el-button @click="doCancel">返 回</el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    assistantId: {
      type: Number,
      default: 0
    },
    roleId: {
      type: Number,
      default: 0
    },
    roundId: {
      type: Number,
      default: 0
    },
    distributeType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      transferData: null,
      leftValue: '',
      rightVaue: '',
      subLoading: false,
      isOther: false
    }
  },
  computed: {
    leftList() {
      let arr = []
      this.transferData.lastRoundClue.map((it) => {
        if (it.clueName.indexOf(this.leftValue) !== -1) {
          it.select = false
          arr.push(it)
        }
      })
      return arr
    },
    rightList() {
      let arr = []
      this.transferData.thisRoundClue.map((it) => {
        if (it.clueName.indexOf(this.rightVaue) !== -1) {
          it.select = false
          arr.push(it)
        }
      })
      return arr
    }
  },
  methods: {
    // 选中 右移
    add() {
      let arr = this.transferData.lastRoundClue.filter((item) => item.select)
      this.transferData.thisRoundClue.push(...arr)
      //移除左侧已选中的
      this.transferData.lastRoundClue = this.transferData.lastRoundClue.filter(
        (item) => !item.select
      )
      //处理右侧全部是未选中状态
      this.transferData.thisRoundClue.map((it) => {
        it.select = false
      })
    },
    // 选中 左移
    remove() {
      let arr = this.transferData.thisRoundClue.filter((item) => item.select)
      this.transferData.lastRoundClue.unshift(...arr)
      //移除右侧已选中的
      this.transferData.thisRoundClue = this.transferData.thisRoundClue.filter(
        (item) => !item.select
      )
      //处理左侧全部是未选中状态
      this.transferData.lastRoundClue.map((it) => {
        it.select = false
      })
    },
    //获取列表数据
    async getTransferData(isOther) {
      this.isOther = isOther

      let data =
        await this.$api.murderMysteryRoundClueQueryMurderMysteryRoundClueDoubleTable(
          {
            dramaId: this.assistantId,
            distributeType: this.distributeType,
            roundId: this.roundId,
            roleId: isOther ? this.roleId : null
          }
        )
      //保存原始数据
      data.lastRoundClue.map((clue) => {
        clue.select = false
      })
      data.thisRoundClue.map((clue) => {
        clue.select = false
      })
      this.transferData = data
    },
    async doSubmitAdd() {
      try {
        let clueIds = []
        this.transferData.thisRoundClue.map((it) => {
          clueIds.push(it.clueId)
        })
        let form = {
          dramaId: this.assistantId /*票房主键id*/,
          roundId: this.roundId /*回合主键id*/,
          distributeType: this.distributeType,
          clueIds
        }
        //发到玩家得需要传roleId
        if (this.isOther) {
          form.roleId = this.roleId
        }
        await this.$api.murderMysteryRoundClueAddMurderMysteryRoundClue(form)
        this.clearData()
        this.$message.success(`保存成功`)
        this.$emit('on-success-save')
      } catch (e) {}
    },
    doCancel() {
      this.clearData()
      this.$emit('on-close-transfer')
    },
    clearData() {
      this.transferData = null
      this.leftValue = ''
      this.rightVaue = ''
    }
  }
}
</script>
<style scoped>
.el-input {
  border-radius: 60px;
  margin-top: 10px;
}
</style>
<style lang="sass" scoped>
.container
  padding: 20px 20px 30px 20px
  border: 1px solid #ededed
.left_box,
.right_box
    .topTitleBox
        width: 100%
        height: 40px
        background: #DCDFE6
        span
            color: #fff
            font-size: 14px
            font-weight: 600
            margin-left: 10px
            line-height: 40px
    /deep/.el-input--prefix
    .el-input__inner
        border-radius: 60px !important
.middle-box
    @include ver-center-center
    div
        background: $orange
        paddng 10px
        color: 16px
        font-weight: 600
        text-align: center
        color: #fff
        width: 60%
        height: 40px
        line-height: 40px
        border-radius: 4px
        margin-bottom: 20px
        cursor: pointer

.layout_box
    width: 100%
    height: 300px
    display: flex
    align-items: center
.arrow_left
    font-size: 30px
    margin-left: 20px

.choose_box
    width: 100%
    height: 300px
    .choose_box_title
        text-align: center
    .content_box
        width: 100%
        height: 300px
        border: 1px solid #ededed
        overflow-y: scroll
        margin-top: 10px
    li
        padding: 3px 5px
        width: 90%
        box-sizing: border-box
.dialog-footer
  @include hor-center-center
  margin-top: 50px
</style>
