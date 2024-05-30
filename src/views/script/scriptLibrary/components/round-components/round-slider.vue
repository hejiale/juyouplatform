<template>
  <div class="slider-content">
    <div class="slider-content-title">回合列表</div>
    <div class="slider-content-list">
      <el-table
        :data="list"
        :row-class-name="({ row }) => row.id"
        :row-key="(row) => row.id"
        ref="roundDragTable"
        :show-header="false"
        v-if="list.length"
      >
        <el-table-column>
          <template slot-scope="scope">
            <div
              class="slider-content-list-item"
              @click="onSelect(scope.row, scope.$index)"
              :class="currentIndex === scope.$index ? 'active' : ''"
            >
              <div class="slider-content-list-item-right">
                <div class="slider-content-list-item-right-title">
                  <span>{{ scope.row.roundName }}</span>
                  <i
                    class="el-icon-edit-outline"
                    v-if="!disabled && $powers('/murderMysteryRound/updateMurderMysteryRound')"
                    @click.stop="onEditRound(scope.row)"
                  ></i>
                </div>
                <div class="slider-content-list-item-right-value">
                  {{ $enums.RoundType.getName(scope.row.roundType) }}
                </div>
              </div>
              <div
                class="slider-content-list-item-clear"
                @click="onDeleterRound(scope.row.id)"
                v-if="!disabled && $powers('/murderMysteryRound/deleteMurderMysteryRound')"
              >
                <i class="el-icon-delete danger"></i>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-empty :image-size="50" v-if="!list.length"></el-empty>
    <el-button type="primary" @click="onAddNewRound" v-if="!disabled && $powers('/murderMysteryRound/addMurderMysteryRound')"
      >新增回合</el-button
    >
    <el-dialog
      :title="updateRound ? '修改回合' : '新增回合'"
      width="500px"
      :visible.sync="dialogVisible"
      center
    >
      <dialogContent
        @on-back="handleClose"
        @on-cancel="handleClose"
        @on-sure="doSubmit"
      >
        <template slot="content">
          <addNewRound
            ref="addNewRound"
            :assistantId="assistantId"
            :updateRound="updateRound"
            @on-success="onSuccess"
          ></addNewRound>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
import dialogContent from '@global/dialog'
import addNewRound from './addNewRound.vue'
import Sortable from 'sortablejs'
export default {
  name: 'round-slider',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    assistantId: {
      type: Number,
      default: 0
    }
  },
  components: { dialogContent, addNewRound },
  data() {
    return {
      list: [],
      dialogVisible: false,
      currentIndex: -1,
      updateRound: null
      // subLoading: false
    }
  },
  methods: {
    onAddNewRound() {
      this.updateRound = null
      this.dialogVisible = true
    },
    onSelect(item, index) {
      this.currentIndex = index
      this.$emit('on-select-round', item)
    },
    onEditRound(item) {
      this.updateRound = item
      this.dialogVisible = true
    },
    onDeleterRound(id) {
      this.$emit('on-delete-round', id)
    },
    onSuccessAdd() {
      this.dialogVisible = false
      this.queryRoundList()
    },
    doSubmit() {
      // this.subLoading = true
      this.$refs.addNewRound.doSubmitAdd()
    },
    onSuccess() {
      // this.subLoading = false
      setTimeout(() => {
        this.onSuccessAdd()
      }, 1000)
    },
    handleClose() {
      new Promise((resolve, reject) => {
        this.$refs.addNewRound.doCancel()
        resolve()
      }).then(() => {
        this.onSuccessAdd()
      })
    },
    /**
     *  isShowLast 新增保存成功后展示最后一条
     */
    async queryRoundList() {
      let data = await this.$api.murderMysteryRoundQueryMurderMysteryRoundPage({
        id: Number(this.$route.query.id),
        pageNo: 1 /*当前页码*/,
        pageSize: 1000 /*分页大小*/
      })
      this.list = data.records

      if (data.records.length) {
        if (this.currentIndex === -1) {
          this.currentIndex = 0
        }
        this.$emit('on-select-round', data.records[this.currentIndex])

        this.$nextTick((_) => {
          this.setSort()
        })
      }
      this.$emit('on-complete-load', data.records.length > 0)
    },
    //回合排序
    setSort() {
      let that = this
      const el = this.$refs.roundDragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortable = Sortable.create(el, {
        animation: 500,
        disabled: this.disabled,
        onEnd: (evt) => {
          if (that.list.length > 1) {
            if (that.currentIndex === evt.oldIndex) {
              that.currentIndex = evt.newIndex
            }

            that.list.splice(
              evt.newIndex,
              0,
              that.list.splice(evt.oldIndex, 1)[0]
            )

            // that.list.map((it, index) => {
            //   it.sort = index + 1
            // })

            that.changeSortAssistant()
          }
        }
      })
    },
    //案件顺序调换
    async changeSortAssistant() {
      let roundIds = []
      let sorts = []
      this.list.map((v, i) => {
        roundIds.push(v.id)
        sorts.push(i + 1)
      })
      await this.$api.murderMysteryRoundChangeMurderMysteryRoundOrder({
        roundIds,
        sorts
      })
      this.$message.success('调换顺序成功')
    }
  }
}
</script>
<style scoped>
.el-button {
  margin: 20px;
}
</style>
<style lang="sass" scoped>
.slider-content
  @include ver

  &-title
    padding: 15px
    text-align: center
    font-size: 15px

  &-list
    @include ver
    &-item
      display: flex
      position: relative
      padding: 20px 10px
      cursor: pointer
      align-items: center

      &-head
        border-radius: 88px
        width: 40px
        height: 40px

      &-right
        margin-left: 8px
        @include ver
        width: 50%

        &-title
          display: flex
          align-items: center

          span
            font-size: 13px
            @include text-overflow-twoLine
            line-height: 16px
            -webkit-line-clamp: 1

          img
            width: 18px
            height: 18px
            margin-left: 5px

        &-value
          font-size: 10px
          @include text-overflow-twoLine
          -webkit-line-clamp: 1
          color: $light-gray
          margin-top: 5px

      &-clear
        position: absolute
        right: 0
        width: 40px
        height: 40px
        @include hor-center-center

        img
          width: 20px
          height: 20px
  .active
    background: #ECEEF2

/deep/.el-table__cell
       padding: unset !important

/deep/.el-table
      .cell
        padding: unset !important
/deep/.el-table
      tbody tr
        &:hover
          td
            background-color: #fff !important
</style>
