<template>
  <div class="layout">
    <transition mode="out-in" name="el-fade-in-linear">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>
