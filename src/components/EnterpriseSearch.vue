<template>
  <div class="main">
    <div class="item">
      <input type="hidden" size="30" v-model="data.account_id" />
      <span>企业名称</span><input type="text" size="30" v-model="data.enterprise_name" />
      <span>支付宝账号</span><input type="text" size="30" v-model="data.alipay_account" />
      <button v-on:click="search">查询</button>
    </div>
    <div class="item">
      <span>序号(主号备注)</span><input type="text" size="30" v-model="data.account_type" :disabled="true" />
      <span>开户银行</span><input type="text" size="30" v-model="data.bank_name" :disabled="true" />
      <span>银行额度</span><input type="text" size="30" v-model="data.bank_quota" :disabled="true" />
      <span>绑定手机号</span><input type="text" size="30" v-model="data.mobile" :disabled="true" />
      <span>通道分配</span><input type="text" size="30" v-model="data.channel" :disabled="true" />
      <span>班次分配</span><input type="text" size="30" v-model="data.frequency" :disabled="true" />
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'EnterpriseSearch',
    data: function () {
      return {
        data: {
          action: 'search',
          account_id: 0,
          enterprise_name: '',
          alipay_account: '',
          account_type: '',
          bank_name: '',
          bank_quota: '',
          mobile: '',
          channel: '',
          frequency: ''
        }
      }
    },
    methods: {
      reset: function() {
        let enterprise_name = this.data.enterprise_name;
        let alipay_account = this.data.alipay_account;
        this.data = {}
        this.data.action = 'search';
        this.data.enterprise_name = enterprise_name;
        this.data.alipay_account = alipay_account;
      },
      search: function() {
        if (this.data.account_id !== 0 || (this.data.enterprise_name && this.data.alipay_account)) {
          this.reset();
          this.action('searching');
          this.remote_call();
        } else {
          alert('请先输入企业账号进行查询');
        }
      },
      remote_call: function() {
        let self = this;
        axios.post('/api/enterprise', this.data).then(function (response) {
          console.log(response);
          if (response.data.length === 0) {
            alert('对不起，无法查询到改企业账号，请修改后重新查询');
          } else {
            self.data = response.data[0];
            self.action('searched');
          }
        }).catch(function (error) {
          alert(error);
        });
      },
      action: function(action) {
        this.$emit('action', action, this.data);
      }
    }
  }
</script>

<style scoped>
  .main div,button {
    margin-left: 10px;
  }
  .item {
    margin-bottom: 10px;
  }
  .item span {
    margin-right: 10px;
  }
</style>
