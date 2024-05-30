<template>
  <div class="container">
    <yc-table :table="table" ref="myTable">
      <template slot="buttons">
        <el-button type="primary" @click="doAdd">新增</el-button>
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="onEdit(props)">编辑</el-button>
        <el-button type="text" @click="onDelete(props)">删除</el-button>
      </template>
    </yc-table>
    <el-dialog
      title="图标配置"
      :visible.sync="treeDialogVisible"
      class="tree-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="600px"
      center
      destroy-on-close
    >
      <dialogContent @on-cancel="handleClose" @on-sure="doSubmit">
        <template slot="content">
          <el-form
            :model="form"
            ref="form"
            label-position="right"
            label-width="180px"
          >
            <el-form-item label="图标中文名：">
              <el-input
                v-model="form.iconName"
                placeholder="请输入"
                :maxLength="30"
              />
            </el-form-item>
            <el-form-item label="图标英文名：">
              <el-input
                v-model="form.iconParam"
                placeholder="请输入"
                :maxLength="30"
              />
            </el-form-item>
            <el-form-item label="图标：">
              <yc-image-uploader
                ref="svg-cover"
                v-model="form.url"
                :showTips="false"
              ></yc-image-uploader>
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>
  <script>
import dialogContent from '@global/dialog'
export default {
  components: {
    dialogContent
  },
  data(vm) {
    return {
      table: {
        api: vm.$api.queryIconSvg,
        query: {},
        searchData: [
          {
            title: '图标名称',
            type: 'input',
            model: 'iconName',
            placeholder: '请输入'
          }
        ],
        columns: [
          {
            title: '图标中文名',
            key: 'iconName'
          },
          {
            title: '图标英文名',
            key: 'iconParam'
          },
          {
            title: '图标',
            key: 'url',
            width: 100,
            isImage: true
          },
          {
            title: '操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      treeDialogVisible: false,
      form: {}
    }
  },
  methods: {
    doAdd() {
      this.treeDialogVisible = true
    },
    onEdit(props){
      this.form = props;
      this.treeDialogVisible = true;
      this.$nextTick(_=>{
        this.$refs['svg-cover'].setFileList(this.form.url)
      })
    },
    async onDelete(props){
      try{
        await this.$api.deleteIconSvg({id: props.id});
        this.$refs.myTable.refresh();
      }catch(e){}
    },
    async doPermisson() {
      this.treeDialogVisible = true
    },
    handleClose() {
      this.treeDialogVisible = false
      this.clear();
    },
    async doSubmit() {
      try{
        if(this.form.id){
          await this.$api.updateIconSvg(this.form);
        }else{
          await this.$api.saveNewIconSvg(this.form);
        }
        this.clear();
        this.treeDialogVisible = false;
        this.$refs.myTable.refresh();
      }catch(e){}
    },
    clear(){
      this.form = {};
      this.$refs['svg-cover'].setFileList();
    }
  }
}
</script>
  
  <style lang="sass" scoped>
.container
    width: 80vw
.role-dialog
    .custom-tree-node
    .is-active
        color: $primaryColor
    &__box
        display: flex
    .box-item
        flex: 1
        height: 270px
        &:first-child
            width: 232px
            flex: none
    .box-title
        width: 100%
        padding: 0 10px
        @include hor-start-center
        height: 36px
        .gary
            color: $gray
            margin-left: 10px
            font-size: $font-small
    .box-content
        height: 233px
        padding-bottom: 7px
        overflow-y: scroll
    .box-btnItem
        @include hor-start-center
        margin-left: 15px
        margin-top: 15px
        .el-radio
            margin-right: 12px
        &__span
            display: inline-block
            width: 200px
        @include text-overflow
</style>
  