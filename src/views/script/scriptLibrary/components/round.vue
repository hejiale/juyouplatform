<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="4">
        <div class="left-content" :class="!hasList ? 'center' : ''">
          <roundSlider
            ref="roundSlider"
            @on-select-round="onSelectRound"
            :disabled="disabled"
            @on-add-round="onAddNewRound"
            @on-delete-round="onDeleteRound"
            @on-complete-load="onCompleteLoad"
            :assistantId="assistantId"
          ></roundSlider>
        </div>
      </el-col>
      <el-col :span="20">
        <div v-if="currentRound && currentRound.roundType == 'DISTRIBUTE_CLUE'">
          <editRound
            :disabled="disabled"
            :assistantId="assistantId"
            :roundId="currentRound.id"
            :roundName="currentRound.roundName"
            @on-success="onSuccessSave"
            ref="editRound"
          ></editRound>
        </div>
        <div
          v-else-if="
            currentRound &&
            currentRound.roundType == 'PHYSICAL_EVIDENCE_INVESTIGATION'
          "
        >
          <editRoundPhysical
            :disabled="disabled"
            :assistantId="assistantId"
            :roundId="currentRound.id"
            :appId="currentRound.appIdList[0]"
            :roundName="currentRound.roundName"
            ref="editRoundPhysical"
          ></editRoundPhysical>
        </div>
        <div
          v-else-if="
            currentRound &&
            currentRound.roundType == 'PASSWORD_DECRYPTION'
          "
        >
          <editRoundPassword
            :disabled="disabled"
            :assistantId="assistantId"
            :roundId="currentRound.id"
            :roundName="currentRound.roundName"
            ref="editRoundPassword"
          ></editRoundPassword>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import roundSlider from './round-components/round-slider.vue'
import editRound from './round-components/edit-round.vue'
import editRoundPhysical from './round-components/edit-round-physical.vue'
import editRoundPassword from './round-components/edit-round-password.vue'
export default {
  components: {
    roundSlider,
    editRound,
    editRoundPhysical,
    editRoundPassword
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentRound: null,
      hasList: false,
      assistantId: null
    }
  },
  created() {
    this.assistantId = Number(this.$route.query.id)
  },
  methods: {
    onAddNewRound() {
      this.currentRoleId = null
    },
    onSelectRound(item) {
      this.currentRound = item
      this.$nextTick((_) => {
        if (
          this.$refs.editRound &&
          this.currentRound.roundType == 'DISTRIBUTE_CLUE'
        ) {
          this.$refs.editRound.queryInfo()
        } else if (
          this.$refs.editRoundPhysical &&
          this.currentRound.roundType == 'PHYSICAL_EVIDENCE_INVESTIGATION'
        ) {
          this.$refs.editRoundPhysical.queryInfo()
          this.$refs.editRoundPhysical.queryAppType()
        } else if (
          this.$refs.editRoundPassword &&
          this.currentRound.roundType == 'PASSWORD_DECRYPTION'
        ) {
          this.$refs.editRoundPassword.queryInfo()
        }
      })
    },
    onDeleteRound(id) {
      this.$confirm(`此操作将删除此回合，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.murderMysteryRoundDeleteMurderMysteryRound({
            id
          })
          this.$message.success('删除成功')
          this.queryList()
          this.currentRound = null
        })
        .catch(() => {})
    },
    onSuccessSave() {
      this.$refs.roundSlider.queryRoleList()
    },
    onCompleteLoad(hasList) {
      this.hasList = this.disabled ? hasList : true
    },
    queryList() {
      this.$nextTick((_) => {
        this.$refs.roundSlider.queryRoundList()
      })
    }
  }
}
</script>
<style lang="sass" scoped>
@import "./style/content.sass"

.left-content
  &-tab
    display: flex
    width: 100%
    height: 50px
    border-radius: 5px
    border: 1px solid $primaryColor
    overflow: hidden

    div
      display: flex
      flex: 1
      @include hor-center-center
      color: $primaryColor
      background: #fff
      cursor: pointer

      .active
        background: $primaryColor
        color: #fff
.center
  @include ver-center-center
</style>
