<template>
  <div class="container">
    <yc-table :table="table" :isShowPagination="false" ref="myTable">
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doPermisson(props.userType)" v-if="$powers('/role/queryPermissionTree')"
          >权限配置</el-button>
      </template>
    </yc-table>
    <el-dialog
      title="权限配置"
      :visible.sync="treeDialogVisible"
      class="tree-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="600px"
      center
      destroy-on-close
    >
      <dialogContent @on-cancel="handleClose" @on-sure="doSubmitTree">
        <template slot="content">
          <el-tree
            default-expand-all
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            ref="tree"
            :check-strictly="true"
          >
          </el-tree>
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
        query: {},
        searchData: [],
        border: true,
        columns: [
          {
            title: '角色名',
            key: 'name'
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
      currentType: null,
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      treeData: null,
      checkedArr: []
    }
  },
  activated(){
    this.queryList();
  },
  methods: {
    async doPermisson(userType) {
      this.currentType = userType
      this.initRoleTree(userType)
      this.treeDialogVisible = true
    },
    async queryList(){
      try{
        this.table.data = await this.$api.rolePermissionGetStoreRoleList({})
        this.$nextTick(_=>{
          this.$refs.myTable.update();
        })
      }catch(e){}
    },
    async initRoleTree(userType) {
      this.treeData = await this.$api.storeRolePermissionGetRolePermissionByRoleId({ str: userType })
      this.treeData.map((it) => {
        this.doWhileTree(it)
      })

      this.$refs.tree.setCheckedKeys(this.checkedArr)
    },
    doWhileTree(tree) {
      tree.name = tree.data.name;

      if (tree.checked) {
        this.checkedArr.push(tree.id)
      }
      if (tree.children && tree.children.length) {
        tree.children.map((it) => {
          this.doWhileTree(it)
        })
      }
    },
    handleClose() {
     this.treeDialogVisible = false;
     this.checkedArr = [];
    },
    async doSubmitTree() {
      let arr = this.$refs.tree.getCheckedKeys()
      if (arr && arr.length > 0) {
        arr = arr.map((m) => {
          return {
            id: m,
            checked: true
          }
        })
      }
      try {
        await this.$api.storeRolePermissionEditRolePermission({
          storeUserType: this.currentType,
          permissionList: arr
        })
        this.$message.success('操作成功')
        this.treeDialogVisible = false
        this.checkedArr = [];
      } catch (e) {}
    }
  }
}
</script>

<style lang="sass" scoped>
.container
    width: 30vw
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
