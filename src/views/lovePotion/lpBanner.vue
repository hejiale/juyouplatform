<template>

  <div>

    <yc-table :table='table' ref='myTable'>
      <template slot='buttons'>
        <div class='base-topBtn' @click='dialogOpen'>
          <el-button type='primary'>新增LP Banner</el-button>
        </div>
      </template>

      <template slot='action' slot-scope='props'>
        <el-button type='text' @click='doUpdate(props.id)'>编辑</el-button>
      </template>

      <template slot='delete' slot-scope='props'>
        <el-button type='text' @click='doDelete(props.id)'>删除</el-button>
      </template>


      <template slot='seq' slot-scope='props'>
        {{ props.index + (table.pagination.pageNo - 1) * 10 + 1 }}
      </template>


    </yc-table>


    <el-dialog title='新增LP Banner' :visible.sync='dialogVisible' width='40%'>
      <el-form :model='form' :rules='rules' ref='form'>
        <el-form-item style='margin-top: 40px' label='文字' label-width="60px">
          <el-input style='width: 500px' v-model='form.name' placeholder='请输入Banner图文字描述' maxLength='50' show-word-limit />
        </el-form-item>
        <el-form-item label="主图" label-width="60px" prop='mainUrl'>
          <yc-image-uploader ref='mainUrl' v-model="form.mainUrl" showTips :uploadSize="0.5" tips="图片大小不可超过500k，宽高比3:4，可上传png、jpg、gif" />
        </el-form-item>
        <el-form-item label="副图" label-width="60px" prop='subUrl'>
          <yc-image-uploader ref='subUrl' v-model="form.subUrl" showTips :uploadSize="0.5" tips="图片大小不可超过500k，宽高比3:4，可上传png、jpg、gif" />
        </el-form-item>
      </el-form>
      <!--按钮-->
      <div slot='footer' class='dialog-footer'>
        <el-button @click='dialogClose'>取 消</el-button>
        <el-button type='primary' @click='submitBanner'>确 定</el-button>
      </div>
    </el-dialog>

  </div>


</template>
<script>
import dialogContent from '@global/dialog/index.vue'

export default {
  components: { dialogContent },
  data(vm) {
    return {

      /*弹出框显隐形*/
      dialogVisible: false,
      /*弹出框表单*/
      form: {
        id: '',
        name: '',
        mainUrl: '',
        subUrl: ''
      },
      /*弹出框条目录入规则*/
      rules: {
        mainUrl: [
          { required: true, message: '请输入主图', trigger: 'blur' }
        ],
        subUrl: [
          { required: true, message: '请输入副图', trigger: 'blur' }
        ]
      },

      /*表单*/
      table: {
        api: this.$api.lpBannerList,
        searchData: [],
        columns: [
          {
            title: '序号',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.seq(ctx))
            },
            width: 100
          },
          {
            title: '主图',
            key: 'mainUrl',
            isImage: true,
            width: 100
          },
          {
            title: '副图',
            key: 'subUrl',
            isImage: true,
            width: 100
          },
          {
            title: '文字',
            key: 'name',
            width: 200
          },
          {
            title: '添加时间',
            key: 'createdTime',
            width: 150
          },
          {
            title: '操作',
            fixed: 'right',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
          ,
          {
            title: '删除',
            fixed: 'right',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.delete(ctx.row))
            }
          }
        ]
      }
    }
  },
  mounted() {

  },
  methods: {

    /*打开弹出框*/
    dialogOpen() {
      this.clearData();
      this.dialogVisible = true
    },

    /*编辑*/
    doUpdate(id) {
      this.dialogVisible = true
      this.form = JSON.parse(JSON.stringify(this.$refs.myTable.table.data.find(item => item.id === id)));
      this.$nextTick(() => {
        this.$refs['mainUrl'].setFileList(this.form.mainUrl);
        this.$refs['subUrl'].setFileList(this.form.subUrl);
      })
    },
    doDelete(id) {
      this.$api.lpBannerDelete(id);
      this.$refs.myTable.refresh()
    },

    /*关闭弹出框*/
    dialogClose() {
      this.clearData();
    },

    /*提交LP-banner*/
    async submitBanner() {
      await this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        try {
          if (this.form.id) {
            await this.$api.lpBannerUpdate(this.form);
          } else {
            await this.$api.lpBannerAdd(this.form);
          }
          await this.clearData();
          this.$refs.myTable.refresh();
        } catch (e) {
        }
      })
    },

    /*清空数据*/
    async clearData() {
      this.dialogVisible = false
      this.form = {};
      this.$nextTick(() => {
        this.$refs['mainUrl'].setFileList();
        this.$refs['subUrl'].setFileList();
      })
    },
  }
}
</script>