<template>
  <div>
    <el-radio-group v-model="radio">
      <el-radio-button label="当前线上"></el-radio-button>
      <el-radio-button label="历史记录"></el-radio-button>
    </el-radio-group>
    <div class="reject mt10">！跳转站外链接的banner在小程序端不显示</div>
    <yc-table
      :table="radio === '当前线上' ? table : historyTable"
      ref="myTable"
      :hideTableTitle="true"
      :isShowPagination="true"
    >
      <template slot="buttons" v-if="$powers('/backend/activity/edit')">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd">新增官方资讯</el-button>
        </div>
      </template>
      <template slot="jumpPath" slot-scope="props">
        <span>{{ props.content }}</span>
      </template>
      <template
        slot="detail"
        slot-scope="props"
        v-if="props.dynamicType === 2 && $powers('/activity/detail')"
      >
        <el-button type="text" @click="doLook(props)">查看</el-button>
      </template>
      <template
        slot="toTop"
        slot-scope="props"
        v-if="
          radio === '当前线上' && $powers('/backend/activity/dynamicTopEdit')
        "
      >
        <el-button type="text" @click="doToTop(props)">{{
          props.topFlag ? '取消置顶' : '置顶'
        }}</el-button>
      </template>
      <template
        slot="delete"
        slot-scope="props"
        v-if="enableEdit(props) && $powers('/backend/activity/dynamicTopEdit')"
      >
        <el-button type="text" @click="doDelete(props)">{{
          radio === '当前线上' ? '撤销' : '恢复'
        }}</el-button>
      </template>
    </yc-table>
    <el-dialog
      :visible.sync="dialogVisible"
      title="新增剧圈动态广告位--官方资讯"
      width="600px"
      center
      :close-on-click-modal="false"
    >
      <dialogContent @on-cancel="onClose" @on-sure="onSave" sureText="确认发布">
        <template slot="content">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="top"
            label-width="200px"
          >
            <el-form-item label="添加封面：" prop="activityImg">
              <yc-image-uploader
                ref="activityImg-cover"
                v-model="form.activityImg"
                :uploadMultiple="false"
                width="100px"
                height="100px"
                :showTips="false"
              ></yc-image-uploader>
            </el-form-item>
            <el-form-item label="添加标题：" prop="activityName">
              <el-input
                v-model="form.activityName"
                placeholder="请输入"
                maxlength="25"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="" prop="richText">
              <tinymce ref="editor" v-model="form.richText" />
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
    <div class="popPhoneBox" v-if="showHtml" @click="showHtml = false">
      <div class="htmlBox" v-html="lookContent">
      </div>
    </div>
  </div>
</template>
<script>
import DialogContent from '../../components/global/dialog/index.vue'
import tinymce from '@partial/tinymce'
export default {
  components: {
    DialogContent,
    tinymce
  },
  data(vm) {
    return {
      radio: '当前线上',
      table: {
        api: this.$api.showDynamicList,
        query: {
          type: 1
        },
        hasKeys: 'createdTime',
        columns: [
          {
            title: '图片',
            width: 140,
            key: 'fileUrl',
            isImage: true
          },
          {
            title: '跳转类型',
            key: 'dynamicType',
            enumType: 'ActivityJumpType'
          },
          {
            title: '跳转目标',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.jumpPath(ctx.row))
            },
            showTooltip: true
          },
          {
            title: '详情',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.detail(ctx.row))
            }
          },
          {
            title: '发布时间',
            key: 'createdTime'
          },
          {
            title: '置顶时间',
            key: 'topEndTime'
          },
          {
            title: '置顶',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.toTop(ctx.row))
            }
          },
          {
            title: '撤销首页',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.delete(ctx.row))
            }
          }
        ]
      },
      historyTable: {
        api: this.$api.showDynamicList,
        query: {
          type: 2
        },
        columns: [
          {
            title: '图片',
            width: 140,
            key: 'fileUrl',
            isImage: true
          },
          {
            title: '跳转类型',
            key: 'dynamicType',
            enumType: 'ActivityJumpType'
          },
          {
            title: '跳转目标',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.jumpPath(ctx.row))
            },
            showTooltip: true
          },
          {
            title: '详情',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.detail(ctx.row))
            }
          },
          {
            title: '发布时间',
            key: 'createdTime'
          },
          {
            title: '恢复首页',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.delete(ctx.row))
            }
          }
        ]
      },
      dialogVisible: false,
      form: {
        jumpType: 'CONSULATION_DETAIL'
      },
      rules: {
        activityImg: {
          required: true,
          message: '请上传图片',
          trigger: 'change'
        },
        jumpType: {
          required: true,
          message: '请选择跳转类型',
          trigger: 'change'
        },
        jumpPath: {
          required: true,
          message: '请填写跳转路径',
          trigger: ['blur', 'change']
        },
        activityName: {
          required: true,
          message: '请填写标题',
          trigger: ['blur', 'change']
        },
        richText: {
          required: true,
          message: '请填写富文本内容',
          trigger: ['blur', 'change']
        }
      },
      options: [],
      lookContent: null,
      showHtml: false
    }
  },
  watch: {
    radio() {
      this.$nextTick((_) => {
        this.$refs.myTable.refresh()
      })
    }
  },
  computed: {
    enableEdit() {
      return function (v) {
        if (
          this.radio === '当前线上' ||
          (this.radio === '历史记录' && v.recommendPosition === 'DISABLE')
        ) {
          return true
        }
        return false
      }
    }
  },
  methods: {
    doAdd() {
      this.dialogVisible = true
    },
    doEdit(v) {
      this.form = v
      if (v.jumpType === 'DRAMA_DETAIL') {
        this.options = [{ id: v.jumpPath, dramaName: v.expandName }]
      } else if (v.jumpType === 'STORE_DETAIL') {
        this.options = [{ id: v.jumpPath, storeName: v.expandName }]
      }

      this.dialogVisible = true
      this.$nextTick((_) => {
        this.$refs['activityImg-cover'].setFileList(v.activityImg)
      })
    },
    async doLook(v) {
      try {
        let data = await this.$api.activityDetail({ id: v.id })
        this.lookContent = data.rainText
        this.showHtml = true
      } catch (e) {}
    },
    //置顶
    async doToTop(v) {
      this.$confirm(`确定继续吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$api.dynamicTopEdit({
            dynamicId: v.id,
            operation: !v.topFlag,
            dynamicType: v.dynamicType
          })
          this.$refs.myTable.refresh()
        } catch (e) {}
      })
    },
    //撤销
    async doDelete(v) {
      this.$confirm(`确定继续吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$api.dynamicTopEdit({
            dynamicId: v.id,
            shelvesStatus: this.radio === '当前线上' ? 'DISABLE' : 'ENABLE',
            dynamicType: v.dynamicType
          })
          this.$refs.myTable.refresh()
        } catch (e) {}
      })
    },
    async remoteDramaMethod(query) {
      try {
        let data = await this.$api.dramaQueryDramaPage({
          dramaNameKeyword: query,
          pageNo: 1,
          pageSize: 100
        })
        this.options = data.records
      } catch (e) {}
    },
    async remoteStoreMethod(query) {
      try {
        let data = await this.$api.storeQueryStorePage({
          storeNameKeyword: query,
          pageNo: 1,
          pageSize: 100
        })
        this.options = data.records
      } catch (e) {}
    },
    onClose() {
      this.clearForm()
      this.$refs.myTable.refresh();
    },
    onSave() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return

        if (this.subLoading) return
        this.subLoading = true

        try {
          await this.$api.activityEdit({
            ...this.form,
            activityType: 'DRAMA_DYNAMIC_COMMUNITY',
            activityScene:
              this.form.jumpType === 'OUTSIDE_LINK' ? 'APP' : 'COMMON'
          })

          this.clearForm()
          this.$refs.myTable.refresh()
        } catch (e) {
          this.subLoading = false
        }
      })
    },
    clearForm() {
      this.$refs['activityImg-cover'].setFileList()

      this.$refs.form.resetFields()
      this.form = {
        jumpType: 'CONSULATION_DETAIL'
      }

      this.dialogVisible = false
      this.subLoading = false
    }
  }
}
</script>
<style>
.dialog-content {
  padding: 10px 36px !important;
}
.v-modal {
  z-index: 999 !important;
}
.el-dialog__wrapper {
  z-index: 1000 !important;
}
</style>
<style lang="sass" scoped>
.imageUploadBox
  @include hor
  align-items: center
.popPhoneBox
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  background: rgba(0, 0, 0, 0.3)
  @include hor-center-center
  z-index: 100
.htmlBox
  overflow-y: scroll
  // background: url('../../assets/images/iphone.png')
  // background-repeat: no-repeat
  // background-size: 100% 100%
  background: #fff
  width: 375px
  height: 812px
  position: relative
  border: 20px solid #000
  border-radius: 50px
</style>