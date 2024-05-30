<template>
  <div v-loading="loading" element-loading-text="数据加载中...">
    <div>
      <div class="titleBox">
        <span style="font-size: 14px; padding-left: 20px"
          >{{roundName}} - 场景搜证 - 密码解锁</span
        >
      </div>
      <div class="tableBox">
        <div class="tableBox-tabBox">
          <yc-tab v-model="activeName" backBtnText="btn-slot">
            <yc-tab-item
              :label="$enums.AppTypeList.getName(item)"
              :value="item"
              v-for="item in appTypeList"
              :key="item"
            >
            </yc-tab-item>
          </yc-tab>
          <div
            class="tableBox-tabBox-addBox"
            @click="onAdd"
            v-if="activeName === 'ROUNDAUDIO' && $powers('/murderMysteryRoundAudio/addMurderMysteryRoundAudio')"
          >
            新增
          </div>
        </div>
        <editPassword :roundId="roundId" ref="editPassword" v-if="activeName === 'SETTING'"/>
        <audioList :assistantId="assistantId" :roundId="roundId" :appId="appId" ref="audioList" v-if="activeName === 'ROUNDAUDIO' && appTypeList.length"/>
      </div>
    </div>
  </div>
</template>
<script>
import dialogContent from '@global/dialog'
import editPassword from './edit-password.vue'
import audioList from './audioList.vue'
export default {
  name: 'edit-round-password',
  components: { dialogContent, audioList, editPassword },
  props: {
    assistantId: {
      type: Number,
      default: 0
    },
    roundId: {
      type: Number,
      default: ''
    },
    roundName: {
      type: String,
      default: ''
    }
  },
  data(vm) {
    return {
      activeName: 'SETTING',
      appTypeList: ['SETTING','ROUNDAUDIO'],
      loading: false
    }
  },
  computed: {
    clueItemName() {
      return function (list) {
        if (!list) return ''
        let name = []
        list.map((it) => {
          if (it.clueId) {
            name.push(`${it.clueName}`)
          }
        })
        return name.join('、')
      }
    }
  },
  watch: {
    activeName() {
      this.queryInfo();
    }
  },
  methods: {
    queryInfo(){
      this.loading = true
      setTimeout(() => {
        this.$nextTick(async _=>{
          if(this.activeName === 'SETTING'){
            await this.$refs.editPassword.queryInfo();
            this.loading = false;
          }else if(this.activeName === 'ROUNDAUDIO'){
            await this.$refs.audioList.queryClueAudioList();
            this.loading = false;
          }
        })
      }, 500);
      
    },
    onAdd() {
      this.$refs.audioList.doManageAudio(); 
    }
  }
}
</script>
<style>
.yc-tab__header {
  margin-bottom: 0px !important;
}
</style>
<style lang="sass" scoped>
.titleBox
  background: #fff
  @include ver
  border-radius: 6px
  padding-bottom: 20px

.tableBox
  margin-top: 20px
  background: #fff
  &-tabBox
    @include hor-between-center
    &-addBox
      width: 100px
      height: 44px
      line-height: 44px
      background: $orange
      color: #fff
      font-size: 15px
      border-radius: 8px
      text-align: center
      margin-right: 20px
      cursor: pointer
</style>
