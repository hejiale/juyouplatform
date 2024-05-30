<template>
  <div>
    <yc-tab v-model="activeName">
      <yc-tab-item label="合成" value="compound" v-if="$powers('/murderMysteryTool/toolForRollList')"> <compound ref="compound" v-if="activeName === 'compound'"/> </yc-tab-item
      ><yc-tab-item label="投票" value="vote" v-if="$powers('/murderMysteryTool/toolForVoteList')">
        <vote v-if="activeName === 'vote'" ref="vote"/>
      </yc-tab-item>
      <yc-tab-item label="来电" value="tel" v-if="$powers('/murderMysteryTool/toolForPhoneList')"> <tel v-if="activeName === 'tel'" ref="tel"/> </yc-tab-item>
      <yc-tab-item label="拼图" value="jigsaw" v-if="$powers('/murderMysteryTool/toolForJigsawList')"> <jigsaw v-if="activeName === 'jigsaw'" ref="jigsaw"/> </yc-tab-item>
      <yc-tab-item label="问答题" value="question" v-if="$powers('/murderMysteryTool/toolForQuestionItemList')"> <question v-if="activeName === 'question'" ref="question"/> </yc-tab-item>
    </yc-tab>
  </div>
</template>

<script>
import compound from './tool-components/compound.vue'
import vote from './tool-components/vote.vue'
import tel from './tool-components/tel.vue'
import jigsaw from './tool-components/jigsaw.vue'
import question from './tool-components/question.vue'
export default {
  components: {
    compound,
    vote,
    tel,
    jigsaw,
    question
  },
  data() {
    return {
      activeName: null
    }
  },
  created(){
    this.queryActiveName();
  },
  watch:{
    activeName(){
      this.loadPage();
    }
  },
  methods:{
    queryActiveName(){
      if(this.$powers('/murderMysteryTool/toolForRollList')){
        this.activeName = 'compound';
      }else if(this.$powers('/murderMysteryTool/toolForVoteList')){
        this.activeName = 'vote';
      }else if(this.$powers('/murderMysteryTool/toolForPhoneList')){
        this.activeName = 'tel';
      }else if(this.$powers('/murderMysteryTool/toolForJigsawList')){
        this.activeName = 'jigsaw';
      }else if(this.$powers('/murderMysteryTool/toolForQuestionItemList')){
        this.activeName = 'question';
      }
    },
    loadPage(){
      this.$nextTick(_=>{
        if(this.activeName === 'compound'){
          this.$refs.compound.refresh();
        }else if(this.activeName === 'vote'){
          this.$refs.vote.refresh();
        }else if(this.activeName === 'tel'){
          this.$refs.tel.refresh();
        }else if(this.activeName === 'jigsaw'){
          this.$refs.jigsaw.refresh();
        }else if(this.activeName === 'question'){
          this.$refs.question.refresh();
        }
      })
    }
  }
}
</script>

<style></style>
