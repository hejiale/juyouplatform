<template>
  <div>
    <yc-table :table="table" ref="myTable" :isShowPagination="false">
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="onAddNewSubMenu" v-if="$powers('/permission/add')">新增权限</el-button>
        </div>
      </template>
      <template slot="authCode" slot-scope="props">
        {{ props.data.authCode }}
      </template>
      <template slot="path" slot-scope="props">
        {{ props.data.path }}
      </template>
      <template slot="sortNo" slot-scope="props">
        {{ props.data.sortNo }}
      </template>
      <template slot="icon" slot-scope="props">
        {{ props.data.icon }}
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" v-if="props.data.level === 1 && $powers('/permission/add')" @click="onAddNewSubMenu(props)">添加子菜单</el-button>
        <el-button type="text" v-if="props.data.level === 2 && $powers('/permission/add')" @click="onAddNewSubMenu(props)">添加子项</el-button>
        <el-button type="text" @click="onUpdateMenu(props)" v-if="$powers('/permission/update')">编辑</el-button>
        <el-button type="text" @click="onDeleteMenu(props.id)" v-if="$powers('/permission/delete')">删除</el-button>
      </template>
    </yc-table>
    <el-dialog
      :title="isUpdate ? '编辑菜单权限':'添加菜单权限'"
      :visible.sync="firstDialogVisible"
      class="role-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="600px"
      center
    >
      <dialogContent :isLoading="isLoading" @on-back="handleClose" @on-cancel="handleClose" @on-sure="doSubmit">
        <template slot="content">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="right"
            label-width="150px"
          >
            <el-form-item label="关联父级菜单：" v-if="currentParent && currentParent.level && parentName">
              <span>{{ parentName }}</span>
            </el-form-item>
            <el-form-item label="菜单名称：" prop="authName">
              <el-input
                v-model="form.authName"
                placeholder="请输入"
                style="width: 320px"
              />
            </el-form-item>
            <el-form-item label="路由参数：" prop="path">
              <el-input
                v-model="form.path"
                placeholder="请输入"
                style="width: 320px"
              />
            </el-form-item>
            <el-form-item label="权限标识：" prop="authCode">
              <el-input
                v-model="form.authCode"
                placeholder="请输入"
                style="width: 320px"
                type="textarea"
                autosize
              />
            </el-form-item>
            <el-form-item label="排序号 ：" prop="sortNo">
              <el-input
                v-model="form.sortNo"
                placeholder="请输入"
                style="width: 320px"
              />
            </el-form-item>
            <el-form-item label="图标：">
              <el-input
                v-model="form.icon"
                placeholder="请输入"
                style="width: 320px"
              />
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>
<script>
import dialogContent from '@global/dialog'
const FORM = {
  authName: null,
  authCode: null,
  path: null,
  icon: null,
  sortNo: null
}
export default {
  components: {
    dialogContent
  },
  data(vm) {
    return {
      tooltipDisabled: true,
      table: {
        api: this.$api.permissionQueryPermissionTree,
        changePermission: true,
        query: {},
        searchData: [
          {
            title: '菜单名称',
            type: 'input',
            model: 'str',
            placeholder: '请输入'
          }
        ],
        columns: [
          {
            title: '菜单名称',
            align: 'left',
            width: 280,
            key: 'authName',
            renderChildren(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.authName(ctx.row))
            }
          },
          {
            title: '路由参数',
            align: 'center',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.path(ctx.row))
            }
          },
          {
            title: '权限标识',
            align: 'center',
            showTooltip: true,
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.authCode(ctx.row))
            }
          },
          {
            title: '排序号',
            align: 'center',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.sortNo(ctx.row))
            }
          },
          {
            title: '图标',
            align: 'center',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.icon(ctx.row))
            }
          },
          {
            title: '操作',
            align: 'center',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      firstDialogVisible: false,
      form: this.$_.cloneDeep(FORM),
      rules: {
        authName: {
          required: true,
          message: '请输入菜单名称',
          trigger: 'blur'
        },
        path: {
          required: true,
          message: '请输入路由参数',
          trigger: 'blur'
        },
        sortNo: {
          required: true,
          message: '请输入排序号',
          trigger: 'blur'
        },
        authCode: {
          required: true,
          message: '请输入权限标识',
          trigger: 'blur'
        },
        icon: {
          required: true,
          message: '请上传菜单图标',
          trigger: 'change'
        },
      },
      currentParent: null,
      isUpdate: false,
      isLoading: false
    }
  },
  computed:{
    parentName(){
      if(this.isUpdate){
        return this.currentParent.parentName;
      }else{
        return this.currentParent.authName;
      }
    }
  },
  methods: {
    handleClose(){
      this.clear();
    },
    clear(){
      this.firstDialogVisible = false;
      this.isLoading = false;
      this.form = {};
      this.$refs.form.clearValidate();
    },
    //添加子项
    onAddNewSubMenu(info){
      this.isUpdate = false;
      this.currentParent = info.data;
      this.firstDialogVisible = true;
    },
    //编辑
    onUpdateMenu(info){
      this.isUpdate = true;
      this.currentParent = info.data;
      // 插入数据
      this.form = {
        authName: info.data.authName,
        authCode: info.data.authCode,
        path: info.data.path,
        icon: info.data.icon,
        sortNo: info.data.sortNo
      }
      this.firstDialogVisible = true;
    },
    //删除菜单
    onDeleteMenu(id){
      this.$confirm(
        `此操作将删除该菜单, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          await this.$api.permissionDeleteMenu({id})
          this.$refs.myTable.refresh();
        })
    },
    doSubmit(){
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.isLoading = true;

        if(this.isUpdate){
          await this.$api.permissionUpdateMenu({
            "authCode": this.form.authCode,
            "authName": this.form.authName,
            "authType": this.currentParent.authType,
            "icon": this.form.icon,
            "parentId": this.currentParent.parentId,
            "path": this.form.path,
            "sortNo": this.form.sortNo,
            "id": this.currentParent.id,
            "level": this.currentParent.level
          })
          this.$message.success('修改成功')
        }else{
          await this.$api.permissionAddMenu({
            "authCode": this.form.authCode,
            "authName": this.form.authName,
            "authType": this.currentParent && this.currentParent.level > 1 ? "BUTTON":"PAGE",
            "icon": this.form.icon,
            "parentId": this.currentParent ? this.currentParent.id: 0,
            "path": this.form.path,
            "sortNo": this.form.sortNo,
            "level": this.currentParent ? this.currentParent.level + 1: 1
          })
          this.$message.success('新增成功')
        }

        this.clear();
        this.$refs.myTable.refresh();
      })
    },
  }
}
</script>
<style lang="sass">
.icon
  width: 50px
  height: 50px
</style>
