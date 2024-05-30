<template>
  <div>
    <el-radio-group v-model="radio">
      <el-radio-button label="当前线上"></el-radio-button>
      <el-radio-button label="历史记录"></el-radio-button>
    </el-radio-group>
    <div class="reject mt10">！跳转站外链接的banner在小程序端不显示</div>
    <yc-table
      :table="table"
      ref="myTable"
      :hideTableTitle="true"
      :isShowPagination="radio === '当前线上' ? false: true"
      @on-complete-load="searchLoad"
    >
      <template slot="buttons" v-if="$powers('/backend/activity/edit')">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd">新增头部Banner</el-button>
        </div>
      </template>
      <template slot="jumpPath" slot-scope="props">
        <a :href="props.jumpPath" v-if="props.jumpType === 'OUTSIDE_LINK'" target="_blank">{{props.jumpPath}}</a>
        <el-button type="text" v-else-if="props.jumpType === 'CONSULATION_DETAIL'" @click="doLook(props.jumpPath)">查看</el-button>
        <span v-else>{{props.expandName}}</span>
      </template>
      <template slot="action" slot-scope="props" v-if="$powers('/backend/activity/edit')">
        <el-button type="text" @click="doEdit(props)">重置</el-button>
      </template>
    </yc-table>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="form.id ? '修改首页头部Banner':'新增首页头部Banner'"
      width="600px"
      center
      :close-on-click-modal="false"
    >
      <dialogContent @on-cancel="onClose" @on-sure="onSave" :isLoading="subLoading">
        <template slot="content">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="top"
            label-width="200px"
          >
            <el-form-item label="添加图片：" prop="activityImg">
              <yc-image-uploader
                ref="activity-cover"
                v-model="form.activityImg"
                :showTips="false"
                :uploadMultiple="false"
                width="100px"
                height="100px"
              ></yc-image-uploader>
              <span class="note"
                >只能上传jpg/png/jpeg/gif文件，且不超过1MB</span
              >
            </el-form-item>
            <el-form-item label="添加描述：" prop="activityName">
              <el-input
                v-model="form.activityName"
                placeholder="请输入"
                maxlength="25"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="跳转类型：" prop="jumpType">
              <el-select v-model="form.jumpType" filterable @change="onChangeJumpType">
                <el-option
                  v-for="i in $enums.JumpType.list"
                  :label="i.label"
                  :value="i.value"
                  :key="i.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="跳转路径"
              prop="jumpPath"
              v-if="form.jumpType === 'OUTSIDE_LINK'"
            >
              <el-input v-model="form.jumpPath" placeholder="请输入站外链接" />
            </el-form-item>
            <el-form-item label="跳转路径" prop="jumpPath" v-if="form.jumpType === 'DRAMA_DETAIL' || form.jumpType === 'STORE_DETAIL' || form.jumpType === 'CONSULATION_DETAIL'">
              <el-select
                v-model="form.jumpPath"
                filterable
                remote
                reserve-keyword
                :remote-method="remoteDramaMethod"
                :placeholder="placeHolderText"
                v-if="form.jumpType === 'DRAMA_DETAIL'"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.dramaName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="form.jumpPath"
                filterable
                remote
                reserve-keyword
                :remote-method="remoteStoreMethod"
                :placeholder="placeHolderText"
                v-if="form.jumpType === 'STORE_DETAIL'"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.storeName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="form.jumpPath"
                :placeholder="placeHolderText"
                v-if="form.jumpType === 'CONSULATION_DETAIL'"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.content"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否上线：" prop="status">
              <el-select v-model="form.status" filterable>
                <el-option
                  v-for="i in $enums.StatusEnum.list"
                  :label="i.label"
                  :value="i.value"
                  :key="i.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
    <div class="popPhoneBox" v-if="showHtml" @click="showHtml = false">
      <div v-html="lookContent" class="htmlBox"></div>
    </div>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
import DialogContent from '../../components/global/dialog/index.vue'
export default {
  components: {
    DialogContent
  },
  data(vm) {
    return {
      radio: '当前线上',
      table: {
        api: this.$api.activityPageList,
        showMore: true,
        hidePagination: true,
        query: {
          typeEnum: 'PAGE_INDEX_BANNER',
          statusEnum: 'ENABLE'
        },
        columns: [
          {
            title: '图片',
            width: 140,
            key: 'activityImg',
            isImage: true
          },
          {
            title: '跳转类型',
            key: 'jumpType',
            enumType: 'JumpType'
          },
          {
            title: '跳转目标',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.jumpPath(ctx.row))
            }
          },
          {
            title: '描述',
            key: 'activityName'
          },
          {
            title: '上线时间',
            key: 'createdTime'
          },
          {
            title: '操作',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      dialogVisible: false,
      form: {
        jumpType: 'CONSULATION_DETAIL',
        status: 'ENABLE',
        jumpPath: null
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
        status: {
          required: true,
          message: '请选择是否上线',
          trigger: 'change'
        }
      },
      value: null,
      options: [],
      subLoading: false,
      sortable: null,
      showHtml: false,
      lookContent: null,
    }
  },
  watch: {
    radio() {
      this.$nextTick((_) => {
        this.table.query.statusEnum = this.radio === '当前线上' ? 'ENABLE':'DISABLE';
        this.table.showMore = this.radio === '当前线上' ? true: false;
        this.table.hidePagination = this.radio === '当前线上' ? true: false;
        this.$refs.myTable.refresh()
      })
    },
    'form.jumpType'(){
      if(this.form.jumpType === 'CONSULATION_DETAIL'){
        this.remoteActivityMethod();
      }else{
        this.options = [];
      }
    }
  },
  computed: {
    placeHolderText() {
      if (this.form.jumpType === 'CONSULATION_DETAIL') {
        return '请选择资讯'
      } else if (this.form.jumpType === 'DRAMA_DETAIL') {
        return '请输入剧本关键词搜索'
      } else if (this.form.jumpType === 'STORE_DETAIL') {
        return '请输入店铺关键词搜索'
      }
    }
  },
  activated(){
    this.remoteActivityMethod();
  },
  methods: {
    async doLook(id) {
      try {
        let data = await this.$api.activityDetail({ id })
        this.lookContent = data.rainText
        this.showHtml = true
      } catch (e) {}
    },
    onChangeJumpType(){
      this.form.jumpPath = null;
    },
    doAdd() {
      this.dialogVisible = true
    },
    async doEdit(v) {
      this.form = JSON.parse(JSON.stringify(v)); 
      if(this.form.jumpType !== 'OUTSIDE_LINK'){
        this.form.jumpPath = parseInt(this.form.jumpPath);
      }
      
      if(this.form.jumpType === 'DRAMA_DETAIL'){
        await this.remoteDramaMethod(this.form.expandName, true)
      }else if(this.form.jumpType === 'STORE_DETAIL'){
        await this.remoteStoreMethod(this.form.expandName, true)
      }
      console.log(this.options)
      this.dialogVisible = true;
      this.$nextTick(_=>{
        this.$refs['activity-cover'].setFileList(this.form.activityImg)
      })
    },
    onClose() {
      this.clearForm();
      this.$refs.myTable.refresh();
    },
    onSave() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if(this.subLoading)return;
        this.subLoading = true;

        try{
          await this.$api.activityEdit({
            ...this.form,
            activityType: 'PAGE_INDEX_BANNER',
            activityScene: this.form.jumpType === 'OUTSIDE_LINK' ? 'APP': 'COMMON'
          })
          
          this.clearForm();
          this.$refs.myTable.refresh();
        }catch(e){
          this.subLoading = false;
        }
      })
    },
    clearForm(){
      this.$refs['activity-cover'].setFileList();
      this.$refs.form.resetFields()
      this.form = {
        jumpType: 'CONSULATION_DETAIL',
        status: 'ENABLE',
        jumpPath: null
      };
      this.dialogVisible = false;
      this.subLoading = false;
    },
    async remoteDramaMethod(query, isAll) {
      try {
        let data = await this.$api.dramaQueryDramaPage({
          dramaNameKeyword: query,
          pageNo: 1,
          pageSize: 100,
          dramaStatus: isAll ? null: 'ENABLED'
        })
        this.options = data.records
      } catch (e) {}
    },
    async remoteStoreMethod(query, isAll) {
      try {
        let data = await this.$api.storeQueryStorePage({
          storeNameKeyword: query,
          pageNo: 1,
          pageSize: 100,
          enableStatus: isAll ? null: 'ENABLED'
        })
        this.options = data.records
      } catch (e) {}
    },
    async remoteActivityMethod() {
      try {
        let data = await this.$api.showDynamicList({
          pageNo: 1,
          pageSize: 100,
          type: 1
        })
        let arr = [];
        data.records.map(v=>{
          if(v.jumpType === 'CONSULATION_DETAIL'){
            arr.push(v)
          }
        })
        this.options = arr
      } catch (e) {}
    },
    searchLoad() {
      this.$nextTick((_) => {
        this.setSort()
      })
    },
    //回合排序
    setSort() {
      let that = this
      const el = this.$refs.myTable.$refs.multipleTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]

      this.sortable = Sortable.create(el, {
        animation: 500,
        sort: this.radio === '当前线上' ? true: false,
        onEnd: (evt) => {
          if (that.table.data.length > 1) {
            that.table.data.splice(
              evt.newIndex,
              0,
              that.table.data.splice(evt.oldIndex, 1)[0]
            )
            that.changeSort();
          }
        }
      })
    },
    //案件顺序调换
    async changeSort() {
      let arr = []
      this.table.data.map((v) => {
        arr.push({id: v.id, activityType: v.activityType})
      })

      try{
        await this.$api.batchEditSort(arr);
        this.$refs.myTable.refresh();
      }catch(e){}
    },
  }
}
</script>
<style>
.dialog-content {
  padding: 10px 36px !important;
}
</style>
<style lang="sass" scoped>
.note
  line-height: 1.5
  font-size: $font-small
  color: #999
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
  width: 375px
  height: 812px
  background: #fff
  border: 20px solid #000
  border-radius: 50px
</style>