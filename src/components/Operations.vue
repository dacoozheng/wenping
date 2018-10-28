<template>
  <div class="main">
    <div class="list">
      <enterprise-search @action="action"></enterprise-search>
    </div>
    <hr/>
    <div class="list">
      <input type="hidden" size="30" v-model="data.account_id" />
      <span>上号时间</span><input type="text" size="30" v-model="data.online_time" :disabled="input_disable" />
      <span>下号时间</span><input type="text" size="30" v-model="data.offline_time" :disabled="input_disable" />
      <span>撤号原因</span><input type="text" size="30" v-model="data.cancel_reason" :disabled="input_disable" />
      <span>当天收入</span><input type="text" size="30" v-model="data.day_income" :disabled="input_disable" />
      <span>当天支出</span><input type="text" size="30" v-model="data.day_expense" :disabled="input_disable" />
      <span>使用班次</span><input type="text" size="30" v-model="data.frequency" :disabled="input_disable" />
      <button v-on:click="add">新增</button>
    </div>
    <div class="ui container list">
      <operations-table @action="table_action" ref="operations_table"></operations-table>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import axios from 'axios';
  import EnterpriseSearch from './EnterpriseSearch';
  import OperationsTable from './OperationsTable';

  export default {
    name: 'Operations',
    inject: ['reload'],
    components: {
      EnterpriseSearch,
      OperationsTable
    },
    data: function () {
      return {
        input_disable: true,
        data: {
          action: 'add',
          account_id: 0,
          id: 0,
          online_time: '',
          offline_time: '',
          cancel_reason: '',
          day_income: 0.00,
          day_expense: 0.00,
          frequency: ''
        }
      }
    },
    methods: {
      action: function(action, data) {
        if (action === 'searching') {
          this.input_disable = true;
        } else if (action === 'searched') {
          this.input_disable = false;
          this.data.account_id = data.account_id;
        }
      },
      table_action: function(action, data, index) {
        console.log(action, data, index);
        if (action === 'delete-item') {
          this.delete(data);
        }
      },
      has_letter: function(input) {
        let p = /[a-z]/i;
        if (_.isString(input) && p.test(input)) {
          return true;
        }
        return false;
      },
      add: function() {
        if (_.isNaN(this.data.day_income) || _.isNaN(this.data.day_expense)
          || this.has_letter(this.data.day_income) || this.has_letter(this.data.day_expense)) {
          alert('当天收入和当天支出必须为数字，请重新输入。');
          return;
        }
        this.data.action = 'add';
        this.remote_call(this.data);
      },
      delete: function (data) {
        data.action = 'delete';
        this.remote_call(data);
      },
      remote_call: function(data) {
        let self = this;
        axios.post('/api/operations', data).then(function (response) {
          console.log(response);
          if (data.action === 'add') {
            alert('恭喜，添加成功！');
          } else if (data.action === 'delete') {
            alert('恭喜，删除成功！');
          }
          self.$refs.operations_table.refresh();
        }).catch(function (error) {
          alert(error);
        });
      }
    }
  }
</script>

<style scoped>
  .main div {
    margin-left: 10px;
  }
  .list {
    margin-top: 10px;
  }
</style>

