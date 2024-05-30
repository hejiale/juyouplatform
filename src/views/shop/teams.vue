<template>
  <div>
    <yc-table :table="table" ref="myTable" :isAutoLoad="false">
      <template slot="buttons">
        <el-button
          type="primary"
          @click="onShowDialog"
          v-if="$powers('/storeUser/addStoreUser')"
          >新增成员</el-button
        >
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="onEditUser(props)" v-if="$powers('/storeUser/editStoreUser')">修改角色</el-button>
        <el-button type="text" @click="doDelete(props.userId)" v-if="props.storeUserType !== 'OWNER' && $powers('/storeUser/deleteStoreUser')"
          >踢出团队</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      :visible.sync="visible"
      :show-close="false"
      center
      :before-close="doCancel"
      width="600px"
      title="新增成员"
      destroy-on-close
    >
      <dialogContent @on-cancel="doCancel" @on-sure="doSubmit">
        <template slot="content">
          <div class="popSearchBox">
            <el-select
              v-model="selectValue"
              filterable
              remote
              placeholder="请输入用户手机号"
              :remote-method="remoteMethod"
              :loading="loading"
              reserve-keyword
              @change="onSelectUser"
              style="width: 500px"
              no-data-text="未查询到此用户，请确认手机号"
            >
              <el-option
                v-for="item in options"
                :key="item.value.id"
                :label="item.label"
                :value="item.value"
              >
                <div class="selectCustomBox">
                  <el-image
                    :src="item.value.avatar"
                    class="selectCustomBox-img"
                    fit="scale-down"
                  ></el-image>
                  <div class="selectCustomBox-info">
                    <span>{{ item.label }}</span>
                    <span>{{ item.value.phone }}</span>
                  </div>
                </div>
              </el-option>
            </el-select>
            <div class="popSearchBox-userListBox">
              <div
                v-for="(item, index) in addPhones"
                :key="item.id"
                class="popSearchBox-userListBox-item"
                :style="index === 0 ? 'margin-top: 30px' : ''"
              >
                <div class="popSearchBox-userListBox-item-left">
                  <el-image
                    :src="item.avatar"
                    class="popSearchBox-userListBox-item-left-img"
                    fit="scale-down"
                  ></el-image>
                  <div class="popSearchBox-userListBox-item-left-info">
                    <span>{{ item.nickName }}</span>
                    <span>{{ item.phone }}</span>
                  </div>
                </div>
                <div class="popSearchBox-userListBox-item-right">
                  <el-select
                    v-model="item.storeUserType"
                    placeholder="请选择"
                    style="width: 100px"
                    @change="onSelectUserType"
                    v-if="total > 0"
                  >
                    <el-option
                      v-for="item in $enums.NewStoreUserType.list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    v-model="item.storeUserType"
                    style="width:100px"
                    placeholder="请选择"
                    v-else
                  >
                    <el-option
                      v-for="item in [{ label: '店主', value: 'OWNER' }]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <div
                    class="popSearchBox-userListBox-item-right-close"
                    @click="onDeleteUser(index)"
                  >
                    <i class="el-icon-close"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </dialogContent>
    </el-dialog>
    <el-dialog
      :visible.sync="editVisible"
      :show-close="false"
      center
      :before-close="doCancel"
      width="500px"
      title="编辑"
      destroy-on-close
    >
      <dialogContent @on-cancel="doCancel" @on-sure="onUpdateUser">
        <template slot="content">
          <div class="popEditUserBox">
            <div class="popEditUserBox-infoBox">
              <el-image
                :src="currentUser.avatar"
                class="selectCustomBox-img"
                fit="scale-down"
              ></el-image>
              <div class="popEditUserBox-infoBox-right">
                <span>{{ currentUser.userName }}</span>
                <span>{{ currentUser.phone }}</span>
              </div>
            </div>
            <el-form
              label-width="100px"
              :rules="rules"
              :model="form"
              ref="form"
            >
              <el-form-item label="角色：" prop="storeUserType">
                <el-select
                  v-model="form.storeUserType"
                  placeholder="请选择"
                  style="width:150px"
                >
                  <el-option
                    v-for="item in $enums.StoreUserType.list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.value === 'OWNER'"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="真实姓名：">
                <el-input v-model="form.realName"></el-input>
              </el-form-item>
            </el-form>
          </div>
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
      list: [],
      loading: false,
      visible: false,
      editVisible: false,
      table: {
        api: this.$api.storeUserQueryUserPageWithStore,
        query: {
          storeId: null
        },
        searchData: [],
        columns: [
          {
            title: '用户ID',
            key: 'userId'
          },
          {
            title: '用户昵称',
            key: 'userName'
          },
          {
            title: '用户头像',
            key: 'avatar',
            isImage: true
          },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '职位',
            key: 'storeUserType',
            enumType: 'StoreUserType'
          },
          {
            title: '操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      options: [],
      selectValue: null,
      addPhones: [],
      currentUser: {},
      form: {},
      rules: {
        storeUserType: {
          required: true,
          message: '请选择角色类型',
          trigger: 'change'
        }
      },
      canSubmit: false,
      total: 0
    }
  },
  methods: {
    //手动刷新列表
    refresh(){
      this.options = [];
      this.table.query['storeId'] = this.$route.query.id;

      this.$nextTick(_=>{
        this.$refs.myTable.refresh();
        this.$refs.myTable.update();
      })
    },
    onDeleteUser(index) {
      this.addPhones.splice(index, 1)
    },
    onEditUser(user) {
      this.editVisible = true
      this.currentUser = user
      this.form = {
        storeUserType: user.storeUserType,
        realName: user.realName
      }
    },
    onShowDialog() {
      this.total = this.table.data ? this.table.data.length: 0;
      this.visible = true
    },
    async doSubmit() {
      if (this.addPhones.length === 0)
        return this.$message.warning('请先选择用户')

      if(this.canSubmit)return;
      this.canSubmit = true;

      try{
        let storeUserAddItem = []
        this.addPhones.map((it) => {
          storeUserAddItem.push({
            storeUserType: it.storeUserType,
            userId: it.id,
            realName: ''
          })
        })

        await this.$api.storeUserAddStoreUser({
          storeId: this.$route.query.id,
          storeUserAddItem
        })
        this.$message.success('添加成功')
        this.$refs.myTable.refresh()
        this.doCancel()
        this.canSubmit = false
      }catch(e){
        this.canSubmit = false
      }
    },
    doCancel() {
      this.visible = false
      this.editVisible = false
      this.addPhones = []
      this.form = {}
      this.currentUser = {}
    },
    //搜索
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        let data = await this.$api.storeUserQueryStoreUserDistributePage({
          pageNo: 1,
          pageSize: 100,
          phone: query,
          storeId: this.$route.query.id
        })
        this.options = data.records.map((e) => ({
          value: e,
          label: e.nickName
        }))
        this.loading = false
      } else {
        this.options = []
      }
    },
    onSelectUser(event) {
      this.selectValue = null
      this.options = []
      let index = this.addPhones.findIndex((it) => it.id === event.id)
      if (index === -1) {
        if(this.table.data.length){
          event.storeUserType = 'EMPLOYEE'
        }else{
          event.storeUserType = 'OWNER'
        }
        this.addPhones.unshift(event)
      }
    },
    onSelectUserType() {
      this.$nextTick((_) => {
        this.$forceUpdate()
      })
    },
    //踢出
    doDelete(userId) {
      this.$confirm(`此操作将踢出该成员, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if(this.canSubmit)return;
          this.canSubmit = true;

          try{
            await this.$api.storeUserRemoveStoreUserWithStore({
              storeId: this.$route.query.id,
              userId
            })
            this.$message({
              type: 'success',
              message: `踢出成员成功!`
            })
            this.$refs.myTable.refresh()
            this.canSubmit = false
          }catch(e){
            this.canSubmit = false
          }
        })
        .catch(() => {})
    },
    //修改角色 
    onUpdateUser(){
      this.$refs.form.validate(async (valid) => {
        if (!valid) return

        try{
          await this.$api.storeUserAddStoreKeeper({
            storeId: this.$route.query.id,
            storeUserType: this.form.storeUserType,
            userId: this.currentUser.userId,
            realName: this.form.realName
          })
          this.$message({
            type: 'success',
            message: `修改成功!`
          })
          this.doCancel();
          this.$refs.myTable.refresh()
        }catch(e){}
      })
    }
  }
}
</script>
<style>
.el-select-dropdown__item {
  height: auto !important;
}
</style>
<style lang="sass" scoped>
.popSearchBox
  @include ver
  align-items: center
  max-height: 50vh
  &-userListBox
    @include ver
    width: 90%
    overflow-y: scroll
    &-item
      @include hor-between-center
      display: inline-flex
      margin-top: 10px
      &-left
        @include hor
        align-items: center
        &-img
          width: 50px
          height: 50px
          border-radius: 4px
        &-info
          margin-left: 10px
          @include ver
          span
            font-size: 14px
          span:nth-child(2)
            color: #737F93
      &-right
        @include hor
        cursor: pointer
        &-close
          padding: 10px

.selectCustomBox
  @include hor
  align-items: center
  height: 80px
  &-img
    width: 50px
    height: 50px
    border-radius: 4px
  &-info
    margin-left: 10px
    @include ver
    span
      font-size: 14px
    span:nth-child(2)
      color: #737F93
.popEditUserBox
  @include ver
  align-items: center
  &-infoBox
    @include hor
    align-items: center
    margin-bottom: 20px
    &-right
      @include ver
      margin-left: 5px
      span:nth-child(2)
        color: #737F93
</style>
