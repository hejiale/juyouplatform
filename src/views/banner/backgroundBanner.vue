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
      :isShowPagination="false"
    >
      <template slot="buttons" v-if="$powers('/backend/activity/edit') && radio === '当前线上'">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd">新增背景Banner</el-button>
        </div>
      </template>
      <template slot="actUrl" slot-scope="props">
        <el-image
          style="width: 100px; height: 100px"
          :src="props.info.actUrl"
          :preview-src-list="[props.info.actUrl]"
        >
        </el-image>
      </template>
      <template slot="bkUrl" slot-scope="props">
        <el-image
          style="width: 100px; height: 100px"
          :src="props.info.bkUrl"
          :preview-src-list="[props.info.bkUrl]"
        >
        </el-image>
      </template>
      <template slot="actBotUrl" slot-scope="props">
        <el-image
          style="width: 100px; height: 100px"
          :src="props.info.actBotUrl"
          :preview-src-list="[props.info.actBotUrl]"
        >
        </el-image>
      </template>
      <template slot="font" slot-scope="props">
        {{ words(props.info.font) }}
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
      :title="form.id ? '修改背景Banner':'新增背景Banner'"
      width="600px"
      center
      :close-on-click-modal="false"
    >
      <dialogContent
        @on-cancel="onClose"
        @on-sure="onSave"
        :sureText="form.id ? '确认修改':'确认添加'"
      >
        <template slot="content">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="top"
            label-width="200px"
          >
            <el-form-item label="添加图片：" prop="Imgs">
              <div class="imageUploadBox">
                <yc-image-uploader
                  ref="actBotUrl-cover"
                  v-model="actBotUrl"
                  showTips
                  :uploadMultiple="false"
                  width="100px"
                  height="100px"
                  tips="导航栏层"
                ></yc-image-uploader>
                <yc-image-uploader
                  ref="bkUrl-cover"
                  v-model="bkUrl"
                  showTips
                  :uploadMultiple="false"
                  width="100px"
                  height="100px"
                  tips="背景层"
                ></yc-image-uploader>
                <yc-image-uploader
                  ref="actUrl-cover"
                  v-model="actUrl"
                  showTips
                  :uploadMultiple="false"
                  width="100px"
                  height="100px"
                  tips="动态层"
                ></yc-image-uploader>
              </div>
            </el-form-item>
            <el-form-item label="添加文字层：">
              <div class="wordBox">
                <div v-for="(word,index) in wordList" :key="index" class="wordBox-item">
                  <el-input
                    v-model="word.title"
                    placeholder="请输入"
                    maxlength="25"
                    show-word-limit
                    style="width: 460px"
                  />
                  <el-button class="ml5" type="danger" icon='el-icon-delete' circle @click="onDeleteWord(index)" v-if="index > 0"></el-button>
                </div>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  class="mt10"
                  @click="onAddNewWord"
                  >文字层</el-button
                >
              </div>
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
            <el-form-item label="跳转路径" prop="jumpPath" v-if="form.jumpType !== 'LOVE_POTION'">
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
                filterable
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
import DialogContent from '../../components/global/dialog/index.vue'
export default {
  components: {
    DialogContent
  },
  data(vm) {
    const validateImgs = (rule, value, callback) => {
      if(!this.actUrl || !this.bkUrl || !this.actBotUrl){
        callback(new Error('请上传图片'))
      }else{
        callback();
      }
    }
    return {
      radio: '当前线上',
      table: {
        api: this.$api.activityPageList,
        query: {
          typeEnum: 'PAGE_MIDDLE_BANNER',
          statusEnum: 'ENABLE'
        },
        columns: [
          {
            title: '导航栏层',
            width: 140,
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.actBotUrl(ctx.row))
            }
          },
          {
            title: '背景层',
            width: 140,
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.bkUrl(ctx.row))
            }
          },
          {
            title: '动态层',
            width: 140,
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.actUrl(ctx.row))
            }
          },
          {
            title: '文字层',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.font(ctx.row))
            },
            showTooltip: true
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
        Imgs: { validator: validateImgs, trigger: 'blur' }
      },
      options: [],
      wordList: [{title: ''}],
      inputWord:null,
      actBotUrl: null,
      bkUrl: null,
      actUrl: null,
      subLoading: false,
      showHtml: false,
      lookContent: null,
    }
  },
  watch: {
    radio() {
      this.$nextTick((_) => {
        this.table.query.statusEnum = this.radio === '当前线上' ? 'ENABLE':'DISABLE';
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
  activated(){
    this.remoteActivityMethod();
  },
  computed: {
    words() {
      return function (val) {
        return val.join('，')
      }
    },
    placeHolderText() {
      if (this.form.jumpType === 'APP_LINK_H5') {
        return '请输入资讯关键词搜索'
      } else if (this.form.jumpType === 'DRAMA_DETAIL') {
        return '请输入剧本关键词搜索'
      } else if (this.form.jumpType === 'STORE_DETAIL') {
        return '请输入店铺关键词搜索'
      }
    }
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
      if(this.table.data.length > 0){
        this.$message.warning('已存在一条记录，无法新增！')
      }else{
        this.dialogVisible = true
      }
    },
    async doEdit(v) {
      if(v.jumpType !== 'OUTSIDE_LINK'){
        v.jumpPath = parseInt(v.jumpPath);
      }
      this.form = v;
      
      if(v.jumpType === 'DRAMA_DETAIL'){
        await this.remoteDramaMethod(this.form.expandName, true)
      }else if(v.jumpType === 'STORE_DETAIL'){
        await this.remoteStoreMethod(this.form.expandName, true)
      }

      this.dialogVisible = true;
      this.$nextTick(_=>{
        this.$refs['actUrl-cover'].setFileList(v.info.actUrl)
        this.$refs['bkUrl-cover'].setFileList(v.info.bkUrl)
        this.$refs['actBotUrl-cover'].setFileList(v.info.actBotUrl)
        this.wordList = [];
        v.info.font.map(v=>{
          this.wordList.push({title: v})
        })
      })
    },
    onAddNewWord() {
      let idx = this.wordList.findIndex(v=>v.title === '');
      if(idx !== -1){
        return this.$message.warning('文字内容输入不能为空！')
      }
      this.wordList.push({title: ''});
    },
    onDeleteWord(index){
      this.wordList.splice(index, 1);
    },
    clearForm(){
      this.$refs['actUrl-cover'].setFileList();
      this.$refs['bkUrl-cover'].setFileList();
      this.$refs['actBotUrl-cover'].setFileList();
      this.$refs.form.resetFields()
      this.form = {
        jumpType: 'CONSULATION_DETAIL',
        status: 'ENABLE',
        jumpPath: null
      };
      this.wordList = [{title: ''}];
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
    onClose() {
      this.clearForm();
      this.$refs.myTable.refresh();
    },
    onSave() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        let idx = this.wordList.findIndex(v=>v.title === '');
        if(idx !== -1){
          return this.$message.warning('文字层不能为空！')
        }

        if(this.subLoading)return;
        this.subLoading = true;

        try{
          await this.$api.activityEdit({
            ...this.form,
            activityType: 'PAGE_MIDDLE_BANNER',
            activityScene: this.form.jumpType === 'OUTSIDE_LINK' ? 'APP': 'COMMON',
            info: {
              actUrl: this.actUrl,
              bkUrl: this.bkUrl,
              actBotUrl: this.actBotUrl,
              font: this.wordList.map(v=>v.title)
            }
          })
          
          this.clearForm();
          this.$refs.myTable.refresh();
        }catch(e){
          this.subLoading = false;
        }
      })
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
.imageUploadBox
  @include hor
  align-items: center
.wordBox
  @include ver
  &-item
    @include hor
    align-items: center
    margin-bottom: 10px
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