<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="角色"
        name="first"
        v-if="$powers('/murderMysteryRole/queryMurderMysteryRole')"
      >
        <role v-if="activeName === 'first'" ref="role"/>
      </el-tab-pane>
      <el-tab-pane
        label="回合"
        name="second"
        :assistantId="assistantId"
        :disabled="disabled"
        v-if="$powers('/murderMysteryRound/queryMurderMysteryRoundPage')"
      >
        <round v-if="activeName === 'second'" ref="round"/>
      </el-tab-pane>
      <el-tab-pane
        label="线索"
        name="third"
        v-if="$powers('/murderMysteryClue/queryMurderMysteryCluePage')"
      >
        <clue v-if="activeName === 'third'" ref="clue"/>
      </el-tab-pane>
      <el-tab-pane
        label="音乐"
        name="music"
        v-if="$powers('/murderMysteryAudio/queryMurderMysteryAudioPage')"
      >
        <music v-if="activeName === 'music'" ref="music"/>
      </el-tab-pane>
      <el-tab-pane label="座位" name="seat" v-if="$powers('/roundRoleSeat/getRoundRoleSeatList')">
        <seat v-if="activeName === 'seat'" ref="seat"/>
      </el-tab-pane>
      <el-tab-pane label="工具" name="tool" v-if="toolPowers">
        <tool v-if="activeName === 'tool'" ref="tool"/>
      </el-tab-pane>
      <el-tab-pane label="其他信息" name="other" v-if="$powers('/murderMysteryInfo/queryMurderMysteryInfo')">
        <other v-if="activeName === 'other'" ref="other"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import role from './role.vue'
import clue from './clue.vue'
import music from './music.vue'
import round from './round.vue'
import seat from './seat.vue'
import tool from './tool.vue'
import other from './otherInfo.vue'
export default {
  components: {
    seat,
    role,
    round,
    clue,
    music,
    tool,
    other
  },
  data() {
    return {
      activeName: null,
      disabled: false,
      assistantId: null
    }
  },
  watch: {
    //监听切换
    activeName(val) {
      this.loadTabData();
    }
  },
  computed:{
    toolPowers(){
      return this.judgeToolPowers();
    }
  },
  methods:{
    refresh(){
      //根据权限获取当前第一个tab
      this.getFirstActive();
      this.assistantId = Number(this.$route.query.id)
    },
    loadTabData(){
      let val = this.activeName;

      this.$nextTick(_=>{
        if(val === 'first'){
          this.$refs.role.refresh()
        }else if (val === 'second') {
          this.$refs.round.queryList()
        }else if (val === 'third') {
          this.$refs.clue.refresh()
        }else if (val === 'music') {
          this.$refs.music.refresh()
        }else if (val === 'seat') {
          this.$refs.seat.loadData()
        }else if (val === 'tool') {
          
        }else if (val === 'other') {
          this.$refs.other.queryDetail()
        }
      })
    },
    judgeToolPowers(){
      return this.$powers('/murderMysteryTool/toolForRollList') || this.$powers('/murderMysteryTool/toolForVoteList') || this.$powers('/murderMysteryTool/toolForPhoneList') || this.$powers('/murderMysteryTool/toolForQuestionList');
    },
    getFirstActive(){
      if(this.$powers('/murderMysteryRole/queryMurderMysteryRole')){
        this.activeName = 'first';
      }else if(this.$powers('/murderMysteryRound/queryMurderMysteryRoundPage')){
        this.activeName = 'second';
      }else if(this.$powers('/murderMysteryClue/queryMurderMysteryCluePage')){
        this.activeName = 'third';
      }else if(this.$powers('/murderMysteryAudio/queryMurderMysteryAudioPage')){
        this.activeName = "music"
      }else if(this.$powers('/roundRoleSeat/getRoundRoleSeatList')){
        this.activeName = "seat"
      }else if(this.judgeToolPowers()){
        this.activeName = "tool"
      }else if(this.$powers('/murderMysteryInfo/queryMurderMysteryInfo')){
        this.activeName = "other"
      }
      this.loadTabData();
    }
  }
}
</script>

<style></style>
