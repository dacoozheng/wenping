<template>
  <div class="main">
    <input type="hidden" size="30" v-model="data.account_id" />
    <div class="item"><span>企业名称</span><input type="text" size="30" v-model="data.enterprise_name" :disabled="input_disable" /></div>
    <div class="item"><span>序号(主号备注)</span><input type="text" size="30" v-model="data.account_type" /></div>
    <div class="item"><span>支付宝账号</span><input type="text" size="30" v-model="data.alipay_account" :disabled="input_disable" /></div>
    <div class="item"><span>开户银行</span><input type="text" size="30" v-model="data.bank_name" /></div>
    <div class="item"><span>银行额度</span><input type="text" size="30" v-model="data.bank_quota" /></div>
    <div class="item"><span>绑定手机号</span><input type="text" size="30" v-model="data.mobile" /></div>
    <div class="item"><span>通道分配</span><input type="text" size="30" v-model="data.channel" /></div>
    <div class="item"><span>班次分配</span><input type="text" size="30" v-model="data.frequency" /></div>
    <button v-on:click="add">新增</button><button v-on:click="update">修改</button><button v-on:click="clean">清除</button>
    <div class="ui container list">
      <enterprise-table @action="action" ref="enterprise_table"></enterprise-table>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import EnterpriseTable from './EnterpriseTable';

  export default {
    name: 'EnterpriseAccount',
    inject: ['reload'],
    components: {
      EnterpriseTable
    },
    data: function () {
      return {
        input_disable: false,
        data: {
          action: 'add',
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
      action: function(action, data, index) {
        console.log(action, data, index);
        if (action === 'edit-item') {
          this.input_disable = true;
          this.data = data;
        } else if (action === 'delete-item') {
          this.input_disable = false;
          this.delete(data);
        }
      },
      remote_call: function(data) {
        let self = this;
        if (!data.enterprise_name || !data.alipay_account) {
          alert('企业名称和支付宝账号不允许为空');
          return;
        }
        axios.post('/api/enterprise', data).then(function (response) {
          console.log(response);
          if (response.data.status === 'exist') {
            alert('相同的企业名称和支付宝账号已存在，不可重复添加。')
          } else if (response.data.status === 'can_not_delete_operations') {
            alert('该企业账号已有操作信息，不可删除，请先删除相关操作信息。');
          } else if (response.data.status === 'can_not_delete_financial') {
            alert('该企业账号已有财务信息，不可删除，请先删除相关财务信息。');
          } else {
            if (data.action === 'add') {
              alert('恭喜，添加成功！');
            } else if (data.action === 'update') {
              alert('恭喜，修改成功！');
            } else if (data.action === 'delete') {
              alert('恭喜，删除成功！');
            }
            self.$refs.enterprise_table.refresh();
          }
        }).catch(function (error) {
          alert(error);
        });
      },
      clean: function() {
        this.input_disable = false;
        this.data = {}
      },
      add: function() {
        this.data.action = 'add';
        this.remote_call(this.data);
      },
      update: function() {
        if (!this.data.account_id || this.data.account_id === 0) {
          alert('请从下面的列表中选择一个进行修改');
        } else {
          this.data.action = 'update';
          this.remote_call(this.data);
        }
      },
      delete: function(data) {
        data.action = 'delete';
        this.remote_call(data);
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
  .list {
    margin-top: 10px;
  }
</style>
