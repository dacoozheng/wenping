<template>
  <div id="app">
    <div class="menu">
      <router-link to="/enterprise_account">录入公司账号</router-link>
      <router-link to="/operations">录入操作信息</router-link>
      <router-link to="/financial_date">录入财务数据</router-link>
    </div>
    <hr/>
    <router-view v-if="isReloadAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    provide() {
      return {
        reload: this.reload
      }
    },
    data: function() {
      return {
        isReloadAlive: true
      }
    },
    methods: {
      reload: function() {
        this.isReloadAlive = false;
        this.$nextTick(function(){
          this.isReloadAlive = true;
        })
      },
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    margin-top: 10px;
  }
  .menu a {
    margin-left: 10px;
  }
</style>
