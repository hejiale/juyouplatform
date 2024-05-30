<template>
  <div>
    <yc-table
      :table="table"
      ref="myTable"
      @on-complete-load="searchLoad"
      :isShowPagination="false"
      :isAutoLoad="false"
    >
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd" v-if="$powers('/murderMysteryRole/addMurderMysteryRole')">新增角色</el-button>
        </div>
      </template>
      <template slot="sort" slot-scope="props">
        {{ props + 1 }}
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doEdit(props)" v-if="$powers('/murderMysteryRole/updateMurderMysteryRole')">编辑</el-button>
        <el-button type="text" class="reject" @click="doDetail(props.id)" v-if="$powers('/murderMysteryRole/deleteMurderMysteryRole')"
          >删除</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      :title="title"
      :visible.sync="roleDialogVisible"
      class="role-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="600px"
      center
    >
      <dialogContent
        :isLoading="subLoading"
        @on-back="handleClose"
        @on-cancel="handleClose"
        @on-sure="doSubmit"
      >
        <template slot="content">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="left"
            label-width="100px"
            class="user-form"
            style="padding: 0 50px"
            center
          >
            <el-form-item label="角色名称：" prop="roleName">
              <el-input
                v-model="form.roleName"
                maxlength="100"
                placeholder="请输入角色名称"
              />
            </el-form-item>
            <el-form-item label="性别：" prop="roleSex">
              <el-select v-model="form.roleSex" placeholder="请选择性别">
                <el-option
                  v-for="i in $enums.Sex.list"
                  :label="i.label"
                  :value="i.value"
                  :key="i.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              type="textarea"
              label="角色描述："
              maxlength="200"
              prop="content"
            >
              <el-input v-model="form.content" placeholder="请填写描述" />
            </el-form-item>
            <el-form-item label="角色图片：" prop="roleAvatar">
              <yc-image-uploader
                ref="role-avatar"
                v-model="form.roleAvatar"
                showTips
              ></yc-image-uploader>
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import dialogContent from '@global/dialog'
const FORM = {
  roleName: null,
  roleSex: 'MALE',
  content: null,
  roleAvatar: null
}
export default {
  components: {
    dialogContent
  },
  data(vm) {
    return {
      table: {
        api: this.$api.murderMysteryRoleQueryMurderMysteryRole,
        pagination: false,
        query: {
          id: null
        },
        searchData: [],
        columns: [
          {
            title: '顺序',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.sort(ctx.index))
            }
          },
          {
            title: '角色图片',
            key: 'roleAvatar',
            isImage: true
          },
          {
            title: '角色名称',
            key: 'roleName',
            showTooltip: true
          },
          {
            title: '性别',
            key: 'roleSex',
            enumType: 'Sex'
          },
          {
            title: '角色描述',
            key: 'content',
            showTooltip: true
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
      subLoading: false,
      roleDialogVisible: false,
      title: '新增角色',
      form: this.$_.cloneDeep(FORM),
      rules: {
        roleName: {
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        },
        roleSex: {
          required: true,
          message: '请选择性别',
          trigger: 'change'
        },
        roleAvatar: {
          required: true,
          message: '请上传角色图片',
          trigger: 'change'
        }
      }
    }
  },
  mounted() {},
  methods: {
    refresh(){
      console.log(this.$route.query.id)
      this.table.query.id = this.$route.query.id
      this.$refs.myTable.refresh();
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
        disabled: false,
        onEnd: (evt) => {
          if (that.table.data.length > 1) {
            // if (that.currentIndex === evt.oldIndex) {
            //   that.currentIndex = evt.newIndex;
            // }

            that.table.data.splice(
              evt.newIndex,
              0,
              that.table.data.splice(evt.oldIndex, 1)[0]
            )

            // that.table.map((it, index) => {
            //   it.sort = index + 1
            // })

            that.changeSortAssistant()
          }
        }
      })
    },
    //案件顺序调换
    async changeSortAssistant() {
      let roleIds = []
      let sorts = []
      this.table.data.map((v, i) => {
        roleIds.push(v.id)
        sorts.push(i + 1)
      })
      await this.$api.murderMysteryRoleSortMurderMysteryRole({
        roleIds,
        sorts
      })
      this.$message.success('调换顺序成功')
    },
    doAdd() {
      this.form = this.$_.cloneDeep(FORM)
      this.roleDialogVisible = true
    },
    doEdit(props) {
      this.form = this.$_.cloneDeep(props)
      this.roleDialogVisible = true
      this.$nextTick(() => {
        this.$refs['role-avatar'].setFileList(props.roleAvatar)
      })
    },
    async doDetail(id) {
      await this.$api.murderMysteryRoleDeleteMurderMysteryRole({
        id
      })
      this.$refs.myTable.refresh()
    },
    //  禁用/启用/删除
    doOperate(id, type) {
      this.$confirm(
        `此操作将${this.operateTxt(type)}该剧本, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          await this.$api.dramaDisableDrama({ id, dramaStatus: type })
          this.$message({
            type: 'success',
            message: `${this.operateTxt(type)}成功!`
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
    operateTxt(val) {
      switch (val) {
        case 'DISABLED':
          return '禁用'
        case 'ENABLED':
          return '启用'
        default:
          return val
      }
    },
    handleClose() {
      this.clearAll()
    },
    clearAll() {
      this.roleDialogVisible = false
      this.$refs['role-avatar'].setFileList()
      this.$refs.form.resetFields()
    },
    doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if(this.subLoading)return;
        this.subLoading = true

        try {
          let api = null
          if (this.form.id) api = 'murderMysteryRoleUpdateMurderMysteryRole'
          else api = 'murderMysteryRoleAddMurderMysteryRole'
          await this.$api[api]({
            ...this.form,
            dramaId: this.$route.query.id
          })
          this.$refs['role-avatar'].setFileList()
          this.$refs.form.resetFields()
          await this.$refs.myTable.refresh()
          this.roleDialogVisible = false
          this.subLoading = false
        } catch (e) {
          this.subLoading = false
        }
      })
    }
  }
}
</script>

<style scoped></style>
