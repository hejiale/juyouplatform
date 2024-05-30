<template>
  <div style="display: inline-block">
    <div class="tips">说明</div>
    <div class="tips">1、座位关联剧本人数上限</div>
    <div class="tips">2、每个座位每回合的角色不能重复</div>
    <div class="table" v-if="list.length">
      <div class="table-first">
        <div class="table-first-top">几人本就有几个座位，按最大人数判断</div>
        <div
          class="table-first-items"
          v-for="(item, index) in list[0].seatList"
          :key="index"
        >
          座位{{ index + 1 }}
        </div>
      </div>
      <div class="table-other" v-for="(item, index) in list" :key="index">
        <div class="table-other-top">{{ item.roundName }}</div>
        <div
          class="table-other-items"
          v-for="(it, idx) in item.seatList"
          :key="idx"
        >
          <el-select v-model="it.roleId" placeholder="请选择角色" :disabled="!$powers('/roundRoleSeat/addOrUpdateRoundRoleSeat')">
            <el-option
              v-for="i in roleList"
              :label="i.roleName"
              :value="i.id"
              :key="i.id"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button type="info" @click="querySeatList" v-if="$powers('/roundRoleSeat/addOrUpdateRoundRoleSeat')">重置</el-button>
      <el-button type="primary" @click="doSubmit" :loading="isLoading" v-if="$powers('/roundRoleSeat/addOrUpdateRoundRoleSeat')"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      roleList: [],
      isLoading: false
    }
  },
  methods: {
    loadData(){
      this.queryRoleList()
      this.querySeatList()
    },
    async queryRoleList() {
      this.roleList = await this.$api.murderMysteryRoleQueryMurderMysteryRole({
        id: this.$route.query.id
      })
    },
    async querySeatList() {
      let res = await this.$api.roundRoleSeatGetRoundRoleSeatList({
        id: this.$route.query.id
      })
      res.map((v, i) => {
        v.seatList.map((val, idx) => {
          val.seatNumber = idx + 1
          val.roundId = v.roundId
        })
      })
      this.list = res
    },
    async doSubmit() {
      if(this.isLoading)return;
      this.isLoading = true

      try{
        let seatItemList = []
        let isRepetition = false
        this.list.map((v) => {
          seatItemList.push(...v.seatList)
          let roleArr = []
          v.seatList.map((val) => {
            roleArr.push(val.roleId)
            roleArr.map((value) => {
              if (value && roleArr.indexOf(value) != roleArr.lastIndexOf(value)) {
                isRepetition = true
              }
            })
          })
        })
        if (isRepetition) {
          this.$message.warning('同一回合不能出现相同角色')
          this.isLoading = false
          return
        }
        await this.$api.roundRoleSeatAddOrUpdateRoundRoleSeat({
          seatItemList,
          dramaId: this.$route.query.id
        })
        this.isLoading = false
        this.$message.success('保存成功')
      }catch(e){
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.tips
    color: #aaaaaa
.table
    margin-top: 8px
    display: flex
    &-first
        width: 180px
        display: flex
        flex-direction: column
        &-top
            height: 80px
            padding: 10px 20px
            border: 1px #999999 solid
        &-items
            height: 44px
            padding: 10px 20px
            border-left: 1px #999999 solid
            border-right: 1px #999999 solid
            border-bottom: 1px #999999 solid
    &-other
        width: 120px
        &-top
            height: 80px
            padding: 10px
            line-height: 60px
            border-top: 1px #999999 solid
            border-right: 1px #999999 solid
            border-bottom: 1px #999999 solid
        &-items
            height: 44px
            border-right: 1px #999999 solid
            border-bottom: 1px #999999 solid
    /deep/.el-input__inner
            border: none
.btn
    display: flex
    justify-content: center
    margin-top: 120px
    button
        width: 200px
    .el-button--primary
        margin-left: 80px
</style>
