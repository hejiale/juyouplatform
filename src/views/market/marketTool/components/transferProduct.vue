<template>
  <div class="container">
    <el-row type="flex">
      <el-col :span="10" class="left_box">
        <div class="checkAll">
          <el-checkbox
            :indeterminate="isIndeterminateLeft"
            v-model="checkAllLeft"
            @change="handleCheckAllChangeLeft"
            >未添加</el-checkbox
          >
          <span v-if="transferData">{{
            leftSelectNum + '/' + leftList.length
          }}</span>
        </div>

        <div class="search" style="display: flex">
          <el-input
            placeholder="请输入商品名称"
            prefix-icon="el-icon-search"
            v-model="leftValue"
          >
          </el-input>
        </div>
        <div class="layout_box">
          <div class="choose_box">
            <ul class="content_box" v-if="transferData">
              <li v-for="item in leftList" :key="item.clueId">
                <el-checkbox
                  v-model="item.select"
                  :disabled="disabled"
                  @change="handleCheckChangeLeft"
                >
                  <div class="label_box">
                    <span>{{ item.productName }} </span
                    ><span>￥{{ item.currentPrice / 100 }}</span>
                  </div></el-checkbox
                >
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
        <div class="checkAll">
          <el-checkbox
            :indeterminate="isIndeterminateRight"
            v-model="checkAllRight"
            @change="handleCheckAllChangeRight"
            >已添加</el-checkbox
          >
          <span v-if="rightData">{{
            rightSelectNum + '/' + rightList.length
          }}</span>
        </div>
        <div class="search" style="display: flex">
          <el-input
            placeholder="请输入商品名称"
            prefix-icon="el-icon-search"
            v-model="rightValue"
          >
          </el-input>
        </div>
        <div class="layout_box">
          <div class="choose_box">
            <ul class="content_box" v-if="rightData">
              <li v-for="item in rightList" :key="item.clueId">
                <el-checkbox
                  v-model="item.select"
                  :disabled="disabled"
                  @change="handleCheckChangeRight"
                >
                  <div class="label_box">
                    <span>{{ item.productName }} </span
                    ><span>￥{{ item.currentPrice / 100 }}</span>
                  </div></el-checkbox
                >
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    productType: {
      type: String,
      default: 'APPLY_DRAMA_PRODUCT'
    },
    rightInit: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      checkAllLeft: false,
      isIndeterminateLeft: false,
      checkAllRight: false,
      isIndeterminateRight: false,
      transferData: null,
      rightData: null,
      leftValue: '',
      rightValue: '',
      subLoading: false,
      isOther: false,
      checkAll: false,
      searchData: {
        modelName: ['provinceId', 'cityId'],
        props: {
          checkStrictly: true,
          label: 'regionName',
          value: 'id',
          children: 'subRegionList'
        },
        placeholder: '请选择'
      }
    }
  },
  computed: {
    leftList() {
      let arr = []
      if (this.leftValue) {
        this.transferData.map((it) => {
          if (it.productName.indexOf(this.leftValue) !== -1) {
            it.select = false
            arr.push(it)
          }
        })
      } else {
        arr.push(...this.transferData)
      }
      return arr
    },
    rightList() {
      let arr = []
      if (this.rightValue) {
        this.rightData.map((it) => {
          if (it.productName.indexOf(this.rightValue) !== -1) {
            it.select = false
            arr.push(it)
          }
        })
      } else {
        arr.push(...this.rightData)
      }
      return arr
    },
    leftSelectNum() {
      let num = 0
      this.transferData.map((v) => {
        if (v.select) {
          num++
        }
      })
      return num
    },
    rightSelectNum() {
      let num = 0
      this.rightData.map((v) => {
        if (v.select) {
          num++
        }
      })
      return num
    }
  },
  async created() {},
  methods: {
    // 选中 右移
    add() {
      let arr = this.transferData.filter((item) => item.select)
      this.rightData.push(...arr)
      //移除左侧已选中的
      this.transferData = this.transferData.filter((item) => !item.select)
      //处理右侧全部是未选中状态
      this.rightData.map((it) => {
        it.select = false
      })
    },
    // 选中 左移
    remove() {
      let arr = this.rightData.filter((item) => item.select)
      this.transferData.unshift(...arr)
      //移除右侧已选中的
      this.rightData = this.rightData.filter((item) => !item.select)
      //处理左侧全部是未选中状态
      this.transferData.map((it) => {
        it.select = false
      })
    },
    //获取左侧列表数据
    async getTransferLeftData() {
      // this.isOther = isOther

      let data = await this.$api.productGetList({
        pageNo: 1,
        pageSize: 100,
        productType: this.productType,
        productName: this.leftValue
      })
      //保存原始数据
      // data.lastRoundClue.map((clue) => {
      //   clue.select = false
      // })
      // data.thisRoundClue.map((clue) => {
      //   clue.select = false
      // })
      data.records.map((v) => {
        v.select = false
      })
      this.transferData = data.records
    },
    async getTransferRightData() {
      let arr = [...this.rightInit]
      console.log(arr)
      let data = []
      arr.map((v) => {
        data.push(v.id)
      })
      // let arr = []
      // arr = this.transferData.filter((v) => {
      //   if (data.storeId) {
      //     return data.storeId.includes(v.id)
      //   } else {
      //     return null
      //   }
      // })
      if (data.length) {
        this.transferData = this.transferData.filter((v) => {
          return data.indexOf(v.id) == -1
        })
      }

      this.rightData = arr
    },
    handleCheckChangeLeft() {
      let result = this.transferData.findIndex((v) => {
        return v.select == false
      })
      if (result == -1) {
        this.checkAllLeft = true
        this.isIndeterminateLeft = false
      } else {
        this.checkAllLeft = false
        this.isIndeterminateLeft = true
      }
    },
    handleCheckAllChangeLeft(val) {
      this.checkAllLeft = val
      this.isIndeterminateLeft = false
      if (val) {
        this.transferData.map((v) => {
          v.select = true
        })
      } else {
        this.transferData.map((v) => {
          v.select = false
        })
      }
    },
    handleCheckChangeRight() {
      let result = this.rightData.findIndex((v) => {
        return v.select == false
      })
      if (result == -1) {
        this.checkAllRight = true
        this.isIndeterminateRight = false
      } else {
        this.checkAllRight = false
        this.isIndeterminateRight = true
      }
    },
    handleCheckAllChangeRight(val) {
      this.checkAllRight = val
      this.isIndeterminateRight = false
      if (val) {
        this.rightData.map((v) => {
          v.select = true
        })
      } else {
        this.rightData.map((v) => {
          v.select = false
        })
      }
    },
    async doSubmitAdd() {
      try {
        // let storeId = []
        // this.rightData.map((it) => {
        //   storeId.push(it.id)
        // })
        // await this.$api.productConfigVisibility({
        //   storeId,
        //   productId: this.id
        // })
        // this.clearData()
        // this.$message.success(`保存成功`)
        this.$emit('on-success-save', this.rightData)
      } catch (e) {}
    },
    doCancel() {
      this.clearData()
      this.$emit('on-close-transfer')
    },
    clearData() {
      this.transferData = null
      this.rightData = null
      this.leftValue = ''
      this.rightValue = ''
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
.checkAll
    display: flex
    justify-content: space-between
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
        .el-checkbox
            width: 100%
        /deep/.el-checkbox__label
            width: 100%
    .label_box
        display: flex
        justify-content: space-between
.dialog-footer
  @include hor-center-center
  margin-top: 50px
</style>
