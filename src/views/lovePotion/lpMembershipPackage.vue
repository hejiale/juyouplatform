<template>

  <div>
    <yc-table :table='table' ref='myTable'>
      <template slot='buttons'>
        <div class='base-topBtn' @click='dialogOpen'>
          <el-button type='primary'>新增套餐</el-button>
        </div>
      </template>

      <template slot='look' slot-scope='props'>
        <el-button type='text' @click='doEditContent(props.id)'>查看</el-button>
      </template>

      <template slot='action' slot-scope='props'>
        <el-button type='text' @click='doUpdate(props.id)'>编辑</el-button>
      </template>
    </yc-table>

    <el-dialog title='新增或编辑LP会员套餐' :visible.sync='dialogVisible' width='34%'>
      <el-form :model='form' :rules='rules' ref='form' label-position="right">
        <el-form-item style='margin-top: 40px' prop='name' label='套餐名称' label-width="200px">
          <el-input style='width: 300px' v-model='form.name' placeholder='请输入套餐名称' maxLength='10' show-word-limit />
        </el-form-item>
        <el-form-item prop='price' label='套餐价格（元）' label-width="200px">
          <el-input-number v-model="form.price" :precision="2" :step="0.1" />
        </el-form-item>
        <el-form-item prop='expiration' label='套餐有效期（天）' label-width="200px">
          <el-input-number v-model="form.expiration" :min="1" label="套餐有效期"/>
        </el-form-item>
        <el-form-item prop='matchCount' label='套餐每日获赠匹配次数' label-width="200px">
          <el-input v-model="form.matchCount" style="width: 300px"/>
        </el-form-item>
      </el-form>
      <!--按钮-->
      <div slot='footer' class='dialog-footer'>
        <el-button @click='dialogClose'>取 消</el-button>
        <el-button type='primary' @click='submitMembershipPackage'>确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title='套餐内容' :visible.sync='contentDialogVisible' width='620px' center :close-on-click-modal="false">
      <div class="packageBox mt10" v-for="(item,index) in editPackage.items" :key="index">
        <span class="packageBox-title">{{ index + 1 }}，</span>
        <el-card  class="cardBox">
        <div class="cardBox-content">
          <yc-image-uploader
            :ref="'cardCover' + index"
            v-model="item.url"
            showTips
            tips="请上传权益图标，且不超过500k"
            :uploadSize="0.5"
            width="100px"
            height="100px"
          ></yc-image-uploader>
          <el-input style='width: 400px' v-model='item.name' placeholder='请输入权益标题' type="textarea" class="mb20 mt20" autosize/>
          <el-input style='width: 400px' v-model='item.content' placeholder='请输入权益内容' type="textarea" autosize/>
        </div>
        <el-button type="danger" icon="el-icon-delete-solid" circle @click="onDelete(index)"></el-button>
      </el-card>
      </div>
      
      <el-button type="primary" class="addIcon" @click="onAddContent">添加内容</el-button>
      <!--按钮-->
      <div slot='footer' class='dialog-footer'>
        <el-button @click='contentDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='submitContentPackage'>保 存</el-button>
      </div>
    </el-dialog>
  </div>


</template>
<script>
import fileUpload from '@partial/file-upload'
export default {
  components: {
    fileUpload
  },
  data(vm) {
    return {
      /*弹出框显隐形*/
      dialogVisible: false,
      contentDialogVisible: false,
      editPackage: {
        items: []
      },
      /*弹出框表单*/
      form: {
        id: '',
        name: '',
        price: '',
        expiration: '',
        matchCount: ''
      },
      /*弹出框条目录入规则*/
      rules: {
        name: [
          { required: true, message: '请输入套餐姓名', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入套餐价格（元）', trigger: 'blur' }
        ],
        expiration: [
          { required: true, message: '请输入套餐有效期（天）', trigger: 'blur' }
        ],
        matchCount: [
          { required: true, message: '请输入套餐每日获赠匹配次数', trigger: 'blur' }
        ],
      },

      /*表单*/
      table: {
        api: this.$api.lpMembershipPackageList,
        searchData: [],
        columns: [
          {
            title: '套餐名称',
            key: 'name'
          },
          {
            title: '价格',
            key: 'price',
            render: (h, params) => {
              return h('div', (params.row.price / 100).toFixed(2) + ' 元');
            }
          },
          {
            title: '有效天数',
            key: 'expiration',
            render: (h, params) => {
              return h('div', params.row.expiration + ' 天');
            }
          },
          {
            title: '已开通该套餐人次',
            key: 'numberOfSubscribers'
          },
          {
            title: '该套餐有效期内人数',
            key: 'numberOfActiveSubscribers'
          },
          // {
          //   title: '套餐服务内容',
          //   key: 'content',
          //   width: 300
          // },
          {
            title: '套餐服务内容',
            fixed: 'right',
            render(h, ctx) {
              if (ctx.row.id) {
                // 如果有id，则渲染编辑按钮
                return h('div', vm.$refs.myTable.$scopedSlots.look(ctx.row))
              }
            }
          },
          {
            title: '操作',
            fixed: 'right',
            render(h, ctx) {
              if (ctx.row.id) {
                // 如果有id，则渲染编辑按钮
                return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
              }
            }
          }
        ]
      },
      canDo: false
    }
  },
  mounted() {

  },
  methods: {
    /*编辑*/
    doUpdate(id) {
      this.dialogVisible = true
      this.form = JSON.parse(JSON.stringify(this.$refs.myTable.table.data.find(item => item.id === id)));
      this.form.price = this.form.price/ 100;
    },

    //编辑内容
    async doEditContent(id){
      this.contentDialogVisible = true;

      let res = await this.$api.LpGetPackageDetail({id});
      this.editPackage = res;

      if(res.items.length){
        this.$nextTick(_=>{
          res.items.map((v,i)=>{
            this.$refs[`cardCover${i}`][0].setFileList(v.url)
          })
        })
      }else{
        this.editPackage.items = [{
          url: null,
          name: null,
          content: null
        }]
        this.$nextTick(_=>{
          res.items.map((v,i)=>{
            this.$refs[`cardCover${i}`][0].setFileList()
          })
        })
      }
    },

    /*打开弹出框*/
    dialogOpen() {
      this.clearData();
      this.dialogVisible = true
    },

    /*关闭弹出框*/
    dialogClose() {
      this.clearData();
    },

    /*清空数据*/
    async clearData() {
      this.dialogVisible = false
      this.form = {};
    },

    /*提交LP-会员套餐*/
    async submitMembershipPackage() {
      await this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        try {
          let submit = JSON.parse(JSON.stringify(this.form));
          submit.price = submit.price * 100;
          if (this.form.id) {
            await this.$api.lpMembershipPackageUpdate(submit);
          }else {
            await this.$api.lpMembershipPackageAdd(submit);
          }
          await this.clearData();
          this.$refs.myTable.refresh();
        } catch (e) {
        }
      })
    },
    async submitContentPackage(){
      let canSubmit = true;

      this.editPackage.items.map(v=>{
        if(!v.url || !v.name || !v.content){
          canSubmit = false;
        }
      })

      if(canSubmit){
        if(this.canDo)return;
        this.canDo = true;

        await this.$api.LpSavePackageItem({
          id: this.editPackage.id,
          list: this.editPackage.items
        })
        this.contentDialogVisible = false;
        this.$message.success('保存成功!')
        this.canDo = false;
      }else{
        this.$message.error('请检查输入内容！')
      }
    },

    onAddContent(){
      this.editPackage.items.push({name: '', content: '', url: ''})
    },
    onDelete(index){
      this.editPackage.items.splice(index, 1);
    }
  }
}
</script>
<style>
.el-card__body{
  display: flex;
  align-items: center;
}
</style>
<style lang="sass" scoped>
.packageBox
  @include hor
  margin: 0px 10px
  border-bottom: 1px solid lightgrey
  padding: 10px 0px
  &-title
    font-size: 16px
    font-weight: 600
.cardBox
  width: 85%
  margin-left: 5%
  position: relative
  &-content
    @include ver
    margin-right: 20px
.addIcon
  margin-left: 10px
  margin-top: 30px
</style>
