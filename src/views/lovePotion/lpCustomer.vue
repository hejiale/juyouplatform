<template>

  <div>
    <yc-table :table='table' ref='myTable'>
      <template slot='action' slot-scope='props'>
        <el-button type='text' @click='doUpdate(props.id)'>编辑</el-button>
      </template>
    </yc-table>

    <el-dialog title='编辑LP客服信息' :visible.sync='dialogVisible' width='40%'>
      <el-form :model='form' :rules='rules' ref='form'>
        <el-form-item style='margin-top: 40px' prop='name' label='客服姓名' label-width="100px">
          <el-input style='width: 300px' v-model='form.name' placeholder='请输入客服姓名' maxLength='10' show-word-limit />
        </el-form-item>
        <el-form-item style='margin-top: 40px' prop='phone' label='客服手机号' label-width="100px">
          <el-input style='width: 300px' v-model='form.phone' placeholder='请输入客服手机号' maxLength='12' show-word-limit />
        </el-form-item>
        <el-form-item style='margin-top: 40px' prop='wxNumber' label='客服微信号' label-width="100px">
          <el-input style='width: 300px' v-model='form.wxNumber' placeholder='请输入客服手机号' maxLength='30' show-word-limit />
        </el-form-item>
        <el-form-item label="客服二维码" label-width="100px" prop='qrCode'>
          <yc-image-uploader ref='qrCode' v-model="form.qrCode" showTips :uploadSize="0.5" tips="图片大小不可超过500k，宽高比3:4，可上传png、jpg、gif" />
        </el-form-item>
      </el-form>
      <!--按钮-->
      <div slot='footer' class='dialog-footer'>
        <el-button @click='dialogClose'>取 消</el-button>
        <el-button type='primary' @click='submitCustomer'>确 定</el-button>
      </div>
    </el-dialog>
  </div>


</template>
<script>

export default {
  components: {},
  data(vm) {
    return {
      /*弹出框显隐形*/
      dialogVisible: false,
      /*弹出框表单*/
      form: {
        id: '',
        name: '',
        phone: '',
        wxNumber: '',
        qrCode: ''
      },
      /*弹出框条目录入规则*/
      rules: {
        name: [
          { required: true, message: '请输入客服姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入客服手机号', trigger: 'blur' }
        ],
        wxNumber: [
          { required: true, message: '请输入客服微信', trigger: 'blur' }
        ],
        qrCode: [
          { required: true, message: '请输入客服二维码', trigger: 'blur' }
        ],
      },

      /*表单*/
      table: {
        api: this.$api.lpCustomerList,
        searchData: [],
        columns: [
          {
            title: '客服姓名',
            key: 'name',
            width: 150
          },
          {
            title: '客服手机号',
            key: 'phone',
            width: 150
          },
          {
            title: '客服微信号',
            key: 'wxNumber',
            width: 200
          },
          {
            title: '客服二维码',
            key: 'qrCode',
            isImage: true,
            width: 100
          },
          {
            title: '操作',
            fixed: 'right',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      }
    }
  },
  mounted() {

  },
  methods: {
    /*编辑*/
    doUpdate(id) {
      this.dialogVisible = true
      this.form = JSON.parse(JSON.stringify(this.$refs.myTable.table.data.find(item => item.id === id)));
      this.$nextTick(() => {
        this.$refs['qrCode'].setFileList(this.form.qrCode);
      })
    },

    /*关闭弹出框*/
    dialogClose() {
      this.clearData();
    },

    /*清空数据*/
    async clearData() {
      this.dialogVisible = false
      this.form = {};
      this.$nextTick(() => {
        this.$refs['qrCode'].setFileList();
      })
    },

    /*提交LP-banner*/
    async submitCustomer() {
      await this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        try {
          if (this.form.id) {
            await this.$api.lpCustomerUpdate(this.form);
          }
          await this.clearData();
          this.$refs.myTable.refresh();
        } catch (e) {
        }
      })
    },
  }
}
</script>
