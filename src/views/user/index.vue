<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="status" slot-scope="props">
        <div class="table-row-status-status" v-if="props">
          <span :class="props === 'ENABLED' ? 'table-row-status-enable':'table-row-status-disable'">
            {{ $enums.UserStatus.getName(props) }}
          </span>
        </div>
      </template>
      <template slot="action" slot-scope="props">
        <template>
          <el-button
            v-if="props.userStatus === 'ENABLED' && $powers('/user/disableUser')"
            type="text"
            @click="doOperate(props.id, 'disable')"
            >停用</el-button
          >
          <el-button
            v-else-if="props.userStatus === 'DISABLED' && $powers('/user/enableUser')"
            type="text"
            @click="doOperate(props.id, 'enable')"
            >启用</el-button
          >
        </template>
      </template>
    </yc-table>
  </div>
</template>

<script>
export default {
  data(vm) {
    return {
      table: {
        api: this.$api.userQueryUserPage,
        query: {},
        searchData: [
          {
            title: "用户昵称",
            type: "input",
            model: "keywords",
            placeholder: "请输入",
          },
          {
            title: "性别",
            type: "select",
            model: "sex",
            enumType: "Sex",
            placeholder: "请选择",
          },
          {
            title: "注册来源",
            type: "select",
            model: "dataSource",
            placeholder: "请选择",
            option: [
              {
                label: "剧游宝小程序",
                value: "SAAS_MP",
              },
              {
                label: "剧游圈小程序",
                value: "EXHIBITION_MP",
              },
              {
                label: "剧游宇宙app",
                value: "APP",
              },
              {
                label: "安卓",
                value: "ANDROID",
              },
              {
                label: "苹果",
                value: "IOS",
              },
            ],
          },
          {
            title: "用户状态",
            type: "select",
            model: "userStatus",
            enumType: "UserStatus",
            placeholder: "请选择",
          },
          {
            title: "手机号",
            type: "input",
            model: "phone",
            placeholder: "请输入",
          },
        ],
        columns: [
          {
            title: "用户ID",
            key: "id",
          },
          {
            title: "用户昵称",
            key: "nickName",
          },
          {
            title: "手机号",
            key: "phone",
          },
          {
            title: "注册来源",
            key: "dataSource",
            enumType: "DataSource",
          },
          {
            title: "性别",
            key: "sex",
            enumType: "Sex",
          },
          {
            title: "用户状态",
            width: '100px',
            render(h, ctx) {
              return h(
                "div",
                vm.$refs.myTable.$scopedSlots.status(ctx.row.userStatus)
              );
            },
          },
          {
            title: "操作",
            width: "150px",
            render(h, ctx) {
              return h("div", vm.$refs.myTable.$scopedSlots.action(ctx.row));
            },
          },
        ],
      },
    };
  },

  methods: {
    //  禁用/启用
    doOperate(id, type) {
      this.$confirm(
        `此操作将${this.operateTxt(type)}该用户, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          let api = null;
          if (type === "disable") {
            api = "userDisableUser";
          } else if (type === "enable") {
            api = "userEnableUser";
          }
          await this.$api[api]({ id });
          this.$message({
            type: "success",
            message: `${this.operateTxt(type)}成功!`,
          });
          this.$refs.myTable.refresh();
        })
        .catch(() => {});
    },
    operateTxt(val) {
      switch (val) {
        case "disable":
          return "停用";
        case "enable":
          return "启用";
        default:
          return val;
      }
    },
  },
};
</script>
<style lang="sass" scoped>
</style>
