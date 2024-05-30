<template>
  <div>
    <title-info title="基础信息" btnText="返回角色" @onBack="onGoBack">
      <template slot="ctrl-btn">
        <el-button type="primary" @click="doAdd">+添加</el-button>
      </template>
    </title-info>
    <div class="role-authorize base-form">
      <template v-if="checkUserList && checkUserList.length > 0">
        <span class="role-authorize__item" v-for="(item, idx) in checkUserList" :key="'btn_'+idx" @click.stop="doDel(item.id)">{{item.nickName}}/{{item.phone}} <i class="el-icon-close"></i></span>
      </template>
      <div class="no-data" v-else>暂无数据</div>
    </div>
    <el-dialog
      title="用户授权"
      :visible.sync="dialogVisible"
      class="authorize-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :center="true"
      width="900px"
    >
      <dialogContent @on-cancel="dialogVisible = false" @on-sure="doSubmit" :center="true">
        <template slot="content">
          <el-transfer
            filterable
            filter-placeholder="输入关键字进行过滤"
            v-model="users"
            :data="userList"
            :titles="['未授权用户', '已授权用户']"
            :button-texts="['移除', '添加']"
            :render-content="renderFunc"
            :props="transferProps">
          </el-transfer>
        </template>
        
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
import titleInfo from '@partial/title-info'
import dialogContent from '@global/dialog'
export default {
  components: {
    titleInfo,
    dialogContent
  },
  data () {
    return {
      checkUserList: [],
      userList: [],
      activeIdx: null,
      dialogVisible: false,
      users: [],
      transferProps: {
        key: 'id',
        label: 'nickName'
      },
      renderFunc(h, option) {
        return <span>{ option.nickName } - { option.phone }</span>;
      },
      subLoading: false
    }
  },
  activated () {
    this.initUserData()
    this.initAllUsers()
  },
  methods: {
    onGoBack(){
      this.$router.push({ path: '/system/role' })
    },
    async initUserData () {
      this.checkUserList = await this.$api.roleQueryAuthorizedAdmins({
        id: this.$route.query.id
      })

      this.users = this.checkUserList.map(m => {
        return m.id
      })
    },
    // 查询所有用户列表
    async initAllUsers () {
      let res = await this.$api.adminQueryAdminPage({
        pageNo: 1,
        pageSize: 999
      })
      this.userList = res.records
    },
    doAdd () {
      this.dialogVisible = true
    },
    async doDel (id) {
      await this.$api.roleToCancelAuthorized({
        adminId: id,
        roleId: this.$route.query.id
      })
      this.initUserData()
      this.$message.success('取消授权成功')
    },
    async doSubmit () {
      this.subLoading = true
      try {
        await this.$api.roleToGrantAuthorized({
          roleId: this.$route.query.id,
          adminIdList: this.users
        })
        this.$message.success('授权成功')
        this.initUserData()
        this.dialogVisible = false
      } finally {
        this.subLoading = false
      }
    }
  }
}
</script>

<style>
.el-dialog__body{
  padding: unset !important;
}
.el-transfer-panel{
  width: 260px !important;
}
</style>
<style lang="sass">
.role-authorize
  min-height: calc(100vh - #{$headerHeight + $primaryGap * 2 + $defaultGap * 3} - 40px)
  &__item
    display: inline-block
    padding: 8px
    cursor: pointer
    margin-right: 25px
    margin-bottom: 10px
    background: #EAF1FF
    border-radius: 9999px
    border: 1px solid #3978F7
    font-size: 12px
    font-family: PingFang SC-Regular, PingFang SC
    font-weight: 400
    color: #3978F7
    position: relative
    line-height: 14px
    .el-icon-close
      font-size: 14px
  .no-data
    text-align: center
    color: $primaryColor
    padding-top: 40px
// .authorize-dialog__content
//   border-top: 1px solid #DCDFE6
//   border-bottom: 1px solid #DCDFE6
//   padding-bottom: 42px
//   &__label
//     margin-bottom: 20px
//   &__transfer
//     margin-top: 20px
//     width: 100%
//     @include hor-center-center
</style>
